import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { BehaviorSubject, EMPTY, Observable, finalize, interval, map, startWith, switchMap, tap } from 'rxjs';
import { ElementInteractionService } from '../element-interaction/element-interaction.service';
import { ToastService } from '../toast/toast.service';
import { AuthService } from '../auth/auth.service';
import { Announcement } from '../../interfaces/announcement';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {
  private announcementSubject = new BehaviorSubject<any>(null);
  announcements = this.announcementSubject.asObservable();
  ddAnnouncementsEndpoint = `${environment.baseEndpoint}/api/v1/announcement/`;
  ddAnnouncementsActiveEndpoint = new BehaviorSubject<string>(`${environment.baseEndpoint}/api/v1/announcement/?status=true`)

  private announcementSubmitSubject = new BehaviorSubject<boolean>(false)
  announcementSubmit = this.announcementSubmitSubject.asObservable();
  
  constructor(private http: HttpClient, private toastService: ToastService, private elementInteractionService: ElementInteractionService, private authService: AuthService) {}

  startPolling(page?: number, filters?: string): Observable<any> {
    return interval(120000).pipe(
      startWith(0),
      switchMap(() => this.getAnnouncements(page, filters)),
    );
  }

  addAnnouncement(title: string | null, content: string | null, severity: string | null, notified: boolean, send_mail: boolean){
    this.announcementSubmitSubject.next(true)
    const announcementData = {
      title,
      content,
      severity,
      status: true,
      notified,
      send_mail
    }

    this.http.post(this.ddAnnouncementsEndpoint, announcementData).pipe(
      switchMap(() => this.getAnnouncements()),
      finalize(() => {
        this.announcementSubmitSubject.next(false);
      })
    ).subscribe({
      next: (value) => {
        this.toastService.addToast(200, 'Comunicado criado!')
      },
      error: (err) => {
        if(err.status === 400) {
          console.log(err);
          
          this.toastService.addToast(err.status, 'Erro ao criar comunicado');
        } else {
          this.toastService.addToast(err.status, 'Erro interno de servidor')
        }
      },
    })
  }

  editAnnouncement(index: number | null, title: string | null, content: string | null, severity: string | null, notified: boolean, send_mail: boolean){
    this.announcementSubmitSubject.next(true);
    const announcementData = {
      title,
      content,
      severity,
      status: true,
      notified,
      send_mail
    }

    return this.http.patch(`${this.ddAnnouncementsEndpoint}${index}/`, announcementData).pipe(
      switchMap(() => this.getAnnouncements()),
      finalize(() => {
        this.announcementSubmitSubject.next(false);
      })
    ).subscribe({
      next:(value) => {
        this.toastService.addToast(200, 'Comunicado editado!')
      },
      error: (err) => {
        if(err.status === 400) {
          this.toastService.addToast(err.status, 'Erro ao editar comunicado');
        } else {
          this.toastService.addToast(err.status, 'Erro interno de servidor')
        }
      },
    })
  }

  getAnnouncements(page?: number, filters?: string): Observable<any>{
    if(page){
      this.ddAnnouncementsActiveEndpoint.next(`${environment.baseEndpoint}/api/v1/announcement/?status=true&page=${page}${filters}`)
      
    }
    
    return this.http.get(this.ddAnnouncementsActiveEndpoint.value).pipe(
      map((announcements: any) => {
        const res = announcements.results.map((announcement: any) => {


          switch (announcement.severity) {
            case 'IN':
              announcement.severity = 'info';
              break;
            case 'IM':
              announcement.severity = 'importante';
              break;
            case 'WA':
              announcement.severity = 'urgente';
              break;
            case 'CR':
              announcement.severity = 'crítico';
              break;
          }

          return {
            ...announcement,
            since: this.elementInteractionService.timeSince(announcement.created_at),
            created_at: announcement.created_at,
            created_at_formatted: this.elementInteractionService.formatDate(announcement.created_at),
            updated_at: announcement.updated_at,
            updated_at_formatted: this.elementInteractionService.formatDate(announcement.updated_at)
          }
        })


        const allAnnouncements = {
          ...announcements,
          results: res 
        }
        console.log("Anuncios: ", allAnnouncements);
        

        return allAnnouncements
      }),
      tap(announcements => this.announcementSubject.next(announcements))
    )
  }

  deleteAnnouncement(index: number, page: number, filters: string){
    this.ddAnnouncementsActiveEndpoint.next(`${environment.baseEndpoint}/api/v1/announcement/?status=true&page=${page}${filters}`)
    const ddAnnouncementEndpointDelete = `${environment.baseEndpoint}/api/v1/announcement/${index}/`
    this.http.patch(ddAnnouncementEndpointDelete, {status: false}).pipe(
      switchMap(() => this.getAnnouncements()),
    ).subscribe({
        next: (value) => {
          this.toastService.addToast(200, 'Comunicado excluído!');
        },
        error: (err) => {
          if(err.status === 400) {
            this.toastService.addToast(err.status, 'Erro ao excluir comunicado');
          } else {
            this.toastService.addToast(err.status, 'Erro interno de servidor')
          }
        },
    })
  }

}
