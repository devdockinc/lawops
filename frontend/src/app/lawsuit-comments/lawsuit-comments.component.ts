import { Component, Input } from '@angular/core';
import { ElementInteractionService } from '../services/element-interaction/element-interaction.service';
import { DropdownClickOutDirective } from '../directives/dropdown-click-out.directive';
import { FormsModule, NgForm } from '@angular/forms';
import { NgClass } from '@angular/common';
import { ProcessService } from '../services/process/process.service';
import { LawsuitCommentsService } from '../services/lawsuit-comments/lawsuit-comments.service';

@Component({
  selector: 'lawsuit-comments',
  standalone: true,
  imports: [DropdownClickOutDirective, FormsModule, NgClass],
  providers: [NgForm],
  templateUrl: './lawsuit-comments.component.html',
  styleUrl: './lawsuit-comments.component.css'
})
export class LawsuitCommentsComponent {
  constructor(public elementInteractionService: ElementInteractionService, private lawsuitCommentsService: LawsuitCommentsService){}
  @Input() comments: any;
  @Input() lawsuitId: number = 0;

  content: string = '';

  handleDropdownClick(event: MouseEvent): void {
    this.elementInteractionService.handleDropdownClick(event);
  }


  loadMoreComments(id: number){
    this.lawsuitCommentsService.loadMoreComments(id);
  }

  addComment(commentForm: NgForm ,lawsuit: any): void {
    this.lawsuitCommentsService.addLawsuitComment(lawsuit, this.content)
    commentForm.resetForm();
  }
}
