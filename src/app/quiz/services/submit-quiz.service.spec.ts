import { TestBed } from '@angular/core/testing'
import { of, throwError } from 'rxjs'
import { QuizStateService } from './quiz-state.service'
import { SubmissionService } from './submission.service'
import { SubmitQuizService } from './submit-quiz.service'

describe('SubmitQuizService', () => {
  let submitQuiz: SubmitQuizService
  let quizState: QuizStateService
  let submissionService: jasmine.SpyObj<SubmissionService>

  beforeEach(() => {
    submissionService = jasmine.createSpyObj<SubmissionService>('SubmissionService', ['submit'])
    submissionService.submit.and.returnValue(of(undefined))

    TestBed.configureTestingModule({
      providers: [{ provide: SubmissionService, useValue: submissionService }],
    })

    quizState = TestBed.inject(QuizStateService)
    submitQuiz = TestBed.inject(SubmitQuizService)
    quizState.startOver()
  })

  it('submits the current snapshot and marks success', () => {
    submitQuiz.submit()

    expect(submissionService.submit).toHaveBeenCalledWith(
      jasmine.objectContaining({ currentScreenId: 'welcome' }),
    )
    expect(quizState.submissionStatus()).toBe('success')
  })

  it('ignores duplicate submit clicks while submitting', () => {
    submissionService.submit.and.returnValue(of(undefined))

    quizState.setSubmissionStatus('submitting')
    submitQuiz.submit()

    expect(submissionService.submit).not.toHaveBeenCalled()
  })

  it('marks error when submission fails', () => {
    submissionService.submit.and.returnValue(throwError(() => new Error('network')))

    submitQuiz.submit()

    expect(quizState.submissionStatus()).toBe('error')
  })
})
