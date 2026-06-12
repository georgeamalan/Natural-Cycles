import { BranchResolver, QuizConfig, QuizScreen, ScreenId } from '../models/quiz.types'

export function validateQuizConfig(config: QuizConfig): QuizConfig {
  assertScreenExists(config, config.startScreenId, 'startScreenId')

  for (const [screenId, screen] of Object.entries(config.screens)) {
    if (screen.id !== screenId) {
      throw new Error(`Quiz screen key "${screenId}" does not match its id "${screen.id}"`)
    }
    validateScreen(config, screen)
  }

  return config
}

function validateScreen(config: QuizConfig, screen: QuizScreen): void {
  const optionIds = new Set((screen.options ?? []).map(option => option.id))
  if (optionIds.size !== (screen.options ?? []).length) {
    throw new Error(`Quiz screen "${screen.id}" has duplicate option IDs`)
  }

  const requiresOptions = screen.kind === 'single-select' || screen.kind === 'multi-select'
  if (requiresOptions && optionIds.size === 0) {
    throw new Error(`Quiz screen "${screen.id}" requires at least one option`)
  }

  if (
    screen.progress &&
    (screen.progress.current < 1 || screen.progress.current > screen.progress.total)
  ) {
    throw new Error(`Quiz screen "${screen.id}" has invalid progress`)
  }
  if (
    screen.segmentedProgress &&
    (screen.segmentedProgress.total < 1 ||
      screen.segmentedProgress.activeIndex < 0 ||
      screen.segmentedProgress.activeIndex >= screen.segmentedProgress.total)
  ) {
    throw new Error(`Quiz screen "${screen.id}" has invalid segmented progress`)
  }

  validateBranch(config, screen.branch, screen.id)
  validateBranchOptions(config, screen)
}

function validateBranch(config: QuizConfig, branch: BranchResolver, screenId: ScreenId): void {
  if (branch.type === 'terminal') return

  if (branch.type === 'static') {
    assertScreenExists(config, branch.target, `branch target from "${screenId}"`)
    return
  }

  assertScreenExists(config, branch.questionId, `branch question from "${screenId}"`)
  for (const target of Object.values(branch.map)) {
    assertScreenExists(config, target, `branch target from "${screenId}"`)
  }

  if (Object.keys(branch.map).length === 0) {
    throw new Error(`Quiz screen "${screenId}" has an empty branch map`)
  }

  if (branch.type === 'priority') {
    if (branch.priority.length === 0) {
      throw new Error(`Quiz screen "${screenId}" has an empty branch priority`)
    }
    for (const priorityId of branch.priority) {
      if (!branch.map[priorityId]) {
        throw new Error(`Quiz screen "${screenId}" is missing a target for "${priorityId}"`)
      }
    }
  }
}

function validateBranchOptions(config: QuizConfig, screen: QuizScreen): void {
  const branch = screen.branch
  if (branch.type !== 'answer' && branch.type !== 'priority') return

  const question = config.screens[branch.questionId]
  const optionIds = new Set((question.options ?? []).map(option => option.id))

  if (branch.type === 'answer' && branch.questionId !== screen.id) {
    throw new Error(`Quiz screen "${screen.id}" must branch from its own answer`)
  }
  if (branch.type === 'priority' && question.kind !== 'multi-select') {
    throw new Error(`Quiz screen "${screen.id}" priority branch requires a multi-select question`)
  }

  for (const optionId of Object.keys(branch.map)) {
    if (!optionIds.has(optionId)) {
      throw new Error(`Quiz screen "${screen.id}" branches from unknown option "${optionId}"`)
    }
  }
  for (const optionId of optionIds) {
    if (!branch.map[optionId]) {
      throw new Error(`Quiz screen "${screen.id}" is missing a target for "${optionId}"`)
    }
  }
}

function assertScreenExists(config: QuizConfig, screenId: ScreenId, context: string): void {
  if (!(screenId in config.screens)) {
    throw new Error(`Unknown quiz screen "${screenId}" referenced by ${context}`)
  }
}
