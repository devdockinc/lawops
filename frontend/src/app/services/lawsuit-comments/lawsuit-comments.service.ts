import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { ElementInteractionService } from '../element-interaction/element-interaction.service';

@Injectable({
  providedIn: 'root'
})
export class LawsuitCommentsService {
  ddLawsuitCommentEndpoint = `${environment.baseEndpoint}/api/v1/lawsuit/comment/`;

  private commentsMap: { [key: number]: BehaviorSubject<any> } = {};

  constructor(private elementInteractionService: ElementInteractionService, private http: HttpClient) { }

  getComments(postId: number): Observable<any> {
    if (!this.commentsMap[postId]) {
      this.commentsMap[postId] = new BehaviorSubject<any>({
        count: 0,
        next: null,
        previous: null,
        results: [],
      });
      this.loadComments(postId); // Load initial comments
    }
    return this.commentsMap[postId].asObservable();
  }

  private loadComments(postId: number): void {
    this.http.get<any>(`${environment.baseEndpoint}/api/v1/lawsuit/comment/?lawsuit=${postId}`).subscribe(
      (response: any) => {
        const comments = response.results.map((comment: any) => {
          return {
            ...comment,
            since: this.elementInteractionService.timeSince(comment.created_at),
            created_at: this.elementInteractionService.formatDate(comment.created_at)
          }
        })

        const fullResponse = {
          ...response,
          results: comments
        }
        this.commentsMap[postId].next(fullResponse);
      }
    );
  }

  loadMoreComments(postId: number): void {
    const currentCommentsResponse = this.commentsMap[postId].getValue();
    const nextPageUrl = currentCommentsResponse.next;
    console.log(this.commentsMap[postId].getValue());
    
    if (nextPageUrl) {
      this.http.get<any>(nextPageUrl).subscribe((response: any) => {
        const comments = response.results.map((comment: any) => {
          return {
            ...comment,
            since: this.elementInteractionService.timeSince(comment.created_at),
            created_at: this.elementInteractionService.formatDate(comment.created_at)
          }
        })
        
        const updatedCommentsResponse = {
          ...currentCommentsResponse,
          next: response.next,
          results: [...currentCommentsResponse.results, ...comments],
        };
        this.commentsMap[postId].next(updatedCommentsResponse);
      });
    }
  }

  addLawsuitComment(lawsuit: number, comment: string) {  
    const lawsuitCommentData = {
      lawsuit,
      comment,
    }
    return this.http.post(this.ddLawsuitCommentEndpoint, lawsuitCommentData).pipe(
      finalize(() => this.loadComments(lawsuit))
    ).subscribe((value: any) => console.log("Comentário: ", value))
    
  }
}
