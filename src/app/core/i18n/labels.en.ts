import { LabelDictionary, LabelKey } from './labels.types'

export const LABELS_EN = {
  common: {
    back: 'Back',
    continue: 'Continue',
    getStarted: 'Get Started',
    submit: 'Submit',
    submitting: 'Submitting...',
    submitted: 'Submitted!',
    submissionFailed: 'Submission failed',
    startOver: 'Start Over',
    loadingQuote: 'Loading quote...',
    quoteLoadFailed: 'Could not load quote. Please try again.',
    retry: 'Retry',
    success: 'Success',
    selectAllThatApply: 'Select all that apply',
    skipToContent: 'Skip to quiz content',
  },
  progress: {
    questionOf: 'Question {current} of {total}',
    advancedTrack: 'Advanced Track • Question {current} of {total}',
    stepOf: 'Step {current} of {total}',
  },
  screens: {
    welcome: {
      titleLine1: 'Welcome to the',
      titleLine2: 'Onboarding Quiz',
      subtitle: "Let's learn more about you and customize your experience.",
    },
    experienceLevel: { title: "What's your experience level?" },
    inspiration: { title: "Here's some inspiration" },
    interests: { title: 'What areas interest you?' },
    designPreference: { title: 'How do you prefer to work with designs?' },
    technicalFocus: { title: "What's your technical focus?" },
    primaryObjective: { title: "What's your primary objective?" },
    standardCompletion: {
      title: 'All Set!',
      subtitle: "We've personalized your experience based on your answers.",
      summaryTitle: 'Your Profile Summary',
    },
    expertise: { title: "What's your area of expertise?" },
    achievement: { title: 'What are you looking to achieve?' },
    advancedCompletion: {
      title: 'Expert Profile Created',
      subtitle: 'Your advanced learning path has been customized.',
      resourcesTitle: 'Your Advanced Resources',
      resourcesIntro:
        "As an advanced professional focusing on {focus} with the goal of {goal}, you'll receive:",
      bullet1: 'Access to expert-level content and case studies',
      bullet2: 'Invitation to exclusive advanced practitioner community',
      bullet3: 'Personalized learning paths for senior professionals',
    },
  },
  options: {
    experience: {
      beginner: { label: 'Beginner', description: 'Just starting out' },
      intermediate: { label: 'Intermediate', description: 'Have some experience' },
      advanced: { label: 'Advanced', description: 'Experienced professional' },
    },
    interests: {
      design: { label: 'Design', description: 'Visual and user experience' },
      development: { label: 'Development', description: 'Code and implementation' },
      strategy: { label: 'Strategy', description: 'Business and planning' },
    },
    designPreference: {
      soloDesigner: { label: 'Solo Designer', description: 'Independent work and ownership' },
      teamCollaboration: { label: 'Team Collaboration', description: 'Working with others' },
    },
    technicalFocus: {
      frontend: { label: 'Frontend', description: 'UI, UX, and client-side' },
      backend: { label: 'Backend', description: 'APIs, databases, and servers' },
    },
    primaryObjective: {
      growth: { label: 'Growth', description: 'Scale and expansion' },
      efficiency: { label: 'Efficiency', description: 'Optimization and process improvement' },
    },
    expertise: {
      systemArchitecture: {
        label: 'System Architecture',
        description: 'Large-scale design and infrastructure',
      },
      technicalLeadership: {
        label: 'Technical Leadership',
        description: 'Team guidance and mentorship',
      },
      researchInnovation: {
        label: 'Research & Innovation',
        description: 'Cutting-edge exploration',
      },
    },
    achievement: {
      maximizeImpact: { label: 'Maximize Impact', description: 'Influence at scale' },
      deepMastery: { label: 'Deep Mastery', description: 'Expert-level specialization' },
      driveInnovation: { label: 'Drive Innovation', description: 'Pioneer new solutions' },
    },
  },
  summary: {
    experienceLevel: 'Experience Level',
    interests: 'Interests',
    specialization: 'Specialization',
  },
  summaryFocus: {
    systemArchitecture: 'system design',
    leadership: 'leadership',
    innovation: 'innovation',
  },
  summaryGoal: {
    impact: 'impact',
    mastery: 'mastery',
    innovation: 'innovation',
  },
  summaryValues: {
    experience: {
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      advanced: 'Advanced',
    },
    interests: {
      design: 'Design',
      development: 'Development',
      strategy: 'Strategy',
    },
    designPreference: {
      'solo-designer': 'Solo work',
      'team-collaboration': 'Team collaboration',
    },
    technicalFocus: {
      frontend: 'Frontend',
      backend: 'Backend',
    },
    primaryObjective: {
      growth: 'Growth',
      efficiency: 'Efficiency',
    },
    expertise: {
      'system-architecture': 'System Architecture',
      'technical-leadership': 'Technical Leadership',
      'research-innovation': 'Research & Innovation',
    },
    achievement: {
      'maximize-impact': 'Maximize Impact',
      'deep-mastery': 'Deep Mastery',
      'drive-innovation': 'Drive Innovation',
    },
  },
} as const satisfies LabelDictionary

export type EnLabelKey = LabelKey<typeof LABELS_EN>
