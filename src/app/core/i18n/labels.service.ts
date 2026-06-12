import { Injectable } from '@angular/core'
import { EnLabelKey, LABELS_EN } from './labels.en'
import { LabelDictionary } from './labels.types'

declare const ngDevMode: boolean | undefined

@Injectable({ providedIn: 'root' })
export class LabelsService {
  private readonly dictionary: LabelDictionary = LABELS_EN

  translate(key: EnLabelKey, params?: Record<string, string | number>): string {
    const labelText = this.lookupLabelText(key)
    if (labelText === undefined) {
      this.warnMissingKey(key)
      return key
    }
    if (typeof labelText !== 'string') return key
    return params ? this.fillPlaceholders(labelText, params) : labelText
  }

  private lookupLabelText(key: string): string | LabelDictionary | undefined {
    return key.split('.').reduce<string | LabelDictionary | undefined>((currentNode, keyPart) => {
      if (currentNode && typeof currentNode === 'object' && keyPart in currentNode) {
        return (currentNode as LabelDictionary)[keyPart] as string | LabelDictionary
      }
      return undefined
    }, this.dictionary)
  }

  private fillPlaceholders(template: string, params: Record<string, string | number>): string {
    return Object.entries(params).reduce(
      (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
      template,
    )
  }

  private warnMissingKey(key: string): void {
    if (typeof ngDevMode !== 'undefined' && ngDevMode) {
      // eslint-disable-next-line no-console
      console.warn(`[labels] Missing translation key: ${key}`)
    }
  }
}
