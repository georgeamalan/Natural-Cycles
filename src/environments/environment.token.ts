import { InjectionToken } from '@angular/core'
import { environment } from './environment'

export interface AppEnvironment {
  readonly production: boolean
  readonly webhookUrl: string
  readonly quoteApiUrl: string
}

export const ENVIRONMENT = new InjectionToken<AppEnvironment>('ENVIRONMENT', {
  providedIn: 'root',
  factory: () => environment,
})
