import { AfterViewInit, Directive, ElementRef, inject } from '@angular/core'

@Directive({
  selector: '[appAutofocus]',
  standalone: true,
})
export class AutofocusDirective implements AfterViewInit {
  private readonly element = inject(ElementRef<HTMLElement>)

  ngAfterViewInit(): void {
    this.element.nativeElement.focus({ preventScroll: true })
  }
}
