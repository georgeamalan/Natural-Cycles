import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Observable, map } from 'rxjs'
import { ENVIRONMENT } from '../../../environments/environment.token'

interface QuoteResponse {
  quote: string
}

@Injectable({ providedIn: 'root' })
export class QuoteService {
  private readonly env = inject(ENVIRONMENT)
  private readonly http = inject(HttpClient)

  fetchRandomQuote(): Observable<string> {
    return this.http.get<QuoteResponse>(this.env.quoteApiUrl).pipe(map(response => response.quote))
  }
}
