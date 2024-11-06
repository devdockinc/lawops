import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class LawsuitActivitiesService {

  private activitiesMap: { [key: number]: BehaviorSubject<any> } = {};
  ddLawsuitActivitiesEndpoint = `${environment.baseEndpoint}/api/v1/escavador/movimentacao/?processo=153`;

  constructor(private http: HttpClient) { }


  getActivities(postId: number): Observable<any> {
    if (!this.activitiesMap[postId]) {
      this.activitiesMap[postId] = new BehaviorSubject<any>({
        count: 0,
        next: null,
        previous: null,
        results: [],
      });
      this.loadActivities(postId);
    }
    
    return this.activitiesMap[postId].asObservable();
  }

  private loadActivities(postId: number): void {
    this.http.get<any>(`${environment.baseEndpoint}/api/v1/escavador/movimentacao/?processo=${postId}`).subscribe(
      (response: any) => {
        this.activitiesMap[postId].next(response);
      }
    );
  }

  loadMoreActivities(postId: number): void {
    const currentActivitiesResponse = this.activitiesMap[postId].getValue();
    const nextPageUrl = currentActivitiesResponse.next;
    console.log(this.activitiesMap[postId].getValue());
    
    if (nextPageUrl) {
      this.http.get<any>(nextPageUrl).subscribe((response: any) => {
        
        const updatedActivitiesResponse = {
          ...currentActivitiesResponse,
          next: response.next,
          results: [...currentActivitiesResponse.results, ...response.results],
        };
        this.activitiesMap[postId].next(updatedActivitiesResponse);
      });
    }
  }
}
