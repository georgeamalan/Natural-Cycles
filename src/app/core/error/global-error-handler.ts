import { ErrorHandler, Injectable, isDevMode } from '@angular/core'

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: unknown): void {
    if (isDevMode()) {
      // eslint-disable-next-line no-console
      console.error('[GlobalErrorHandler]', error)
    } else {
      // eslint-disable-next-line no-console
      console.error('An unexpected error occurred.')
    }
  }
}
