import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';
import { ElementInteractionService } from '../services/element-interaction/element-interaction.service';

@Directive({
  selector: '[dropdownClickOut]',
  standalone: true
})
export class DropdownClickOutDirective {

  constructor(private eRef: ElementRef, private elementInteractionService: ElementInteractionService, private renderer: Renderer2) { }

  @HostListener('document:click', ['$event'])
  clickOut(event: any): void {
    const target = event.target as HTMLElement;

    if (!this.eRef.nativeElement.contains(event.target) && !target.classList.contains('dropdown-button')) {
      this.elementInteractionService.closeAllDropdowns()
    }
  }
}
