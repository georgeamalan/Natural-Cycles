import { TestBed } from '@angular/core/testing'
import { LabelsService } from './labels.service'

describe('LabelsService', () => {
  let labels: LabelsService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    labels = TestBed.inject(LabelsService)
  })

  it('returns plain label text', () => {
    expect(labels.translate('common.back')).toBe('Back')
  })

  it('fills in placeholders', () => {
    expect(labels.translate('progress.questionOf', { current: 2, total: 3 })).toBe(
      'Question 2 of 3',
    )
  })
})
