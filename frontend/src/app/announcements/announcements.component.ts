import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CookieService } from '../services/cookie/cookie.service';
import { DropdownClickOutDirective } from '../directives/dropdown-click-out.directive';
import { ElementInteractionService } from '../services/element-interaction/element-interaction.service';
import { AsyncPipe, NgClass } from '@angular/common';
import { Announcement } from '../interfaces/announcement';
import { AnnouncementService } from '../services/announcement/announcement.service';
import { Observable, Subscription, map, tap } from 'rxjs';

@Component({
  selector: 'announcements',
  standalone: true,
  imports: [FormsModule, DropdownClickOutDirective, NgClass, AsyncPipe],
  providers: [NgForm, ElementInteractionService],
  templateUrl: './announcements.component.html',
  styleUrl: './announcements.component.css'
})
export class AnnouncementsComponent implements OnInit, OnDestroy { 

  title: string | null = null
  content: string | null = null;
  severity: string | null = null;
  notified: boolean = false;
  sendMail: boolean = false;
  
  announcements$: Observable<any> | null = null
  rawAnnouncements$: Observable<any> | null = null;
  editAnnouncement: boolean = false;
  announcementId: number | null = null;

  announcementForm: boolean = false;
  announcementSubmit$: Observable<any> | null = null;

  pollingSubscription: Subscription = new Subscription;

  notifiedFilter: string = 'all';
  severityFilter: string = 'all';
  searchFilter: string = '';
  dateSort: string = 'newest';
  filters: string = '';

  
  pages: number[] = [];
  maxVisibleButtons: number = 5;
  currentPage: number = 1;
  totalPages: number = 1;

  totalAnnouncements: number = 0;

  constructor(private cookieService: CookieService, public elementInteractionService: ElementInteractionService, public announcementService: AnnouncementService){}
  
  ngOnInit(): void {
    this.pollingSubscription = this.announcementService.startPolling().subscribe();
    
    this.announcements$ = this.announcementService.announcements.pipe(
      tap({
        next: (value: Announcement) => {
            if(value){
              this.totalPages = value.count / 25;
              this.totalAnnouncements = value.count;
              this.totalPages = Math.ceil(this.totalPages);
              this.updatePages()
            }
   
        },
      })
    )
    this.rawAnnouncements$ = this.announcementService.announcements
    this.announcementSubmit$ = this.announcementService.announcementSubmit;

  }

  onSubmit(announcementNgForm: NgForm ): void {
    if(this.notified || this.sendMail){
      let confirmMessage;
      if (this.notified && this.sendMail) {
        confirmMessage = 'Você deseja fazer o comunicado como mensagem do WhatsApp e e-mail?';
      } else if (this.notified) {
        confirmMessage = 'Você deseja fazer o comunicado como mensagem do WhatsApp?';
      } else if (this.sendMail) {
        confirmMessage = 'Você deseja fazer o comunicado como e-mail?';
      }

      if(!confirm(confirmMessage)){
        return;
      }
    }


    if (this.editAnnouncement) {
      this.announcementService.editAnnouncement(this.announcementId, this.title, this.content, this.severity, this.notified, this.sendMail)
      this.editAnnouncement = false
    } else {
      this.announcementService.addAnnouncement(this.title, this.content,  this.severity, this.notified, this.sendMail)
    }

    this.resetForm(announcementNgForm);
    this.notified = false;
    this.sendMail = false;

  }


  updatePages(index?: number){
    
    if(index){
      this.pollingSubscription.unsubscribe()
      this.pollingSubscription = this.announcementService.startPolling(index, this.filters).subscribe();
      window.scrollTo({
        top: 0,
        behavior: 'instant'
      });
      this.currentPage = index;
    }

    let startPage: number
    let endPage: number;

    if (this.totalPages <= this.maxVisibleButtons) {
      startPage = 1;
      endPage = this.totalPages;
    } else {
      const maxPagesBeforeCurrentPage = Math.floor(this.maxVisibleButtons / 2);
      const maxPagesAfterCurrentPage = Math.ceil(this.maxVisibleButtons / 2) - 1;

      if (this.currentPage <= maxPagesBeforeCurrentPage) {
        startPage = 1;
        endPage = this.maxVisibleButtons;
      } else if (this.currentPage + maxPagesAfterCurrentPage >= this.totalPages) {
        startPage = this.totalPages - this.maxVisibleButtons + 1;
        endPage = this.totalPages;
      } else {
        startPage = this.currentPage - maxPagesBeforeCurrentPage;
        endPage = this.currentPage + maxPagesAfterCurrentPage;
      }
    }

    this.pages = Array.from({ length: (endPage - startPage + 1) }, (_, i) => startPage + i);
    
  }

  clearSearch(){
    this.searchFilter = ''
    this.applyFilters();
  }

  applyFilters() {

    this.filters = '';
    if (this.searchFilter) {
      this.filters = this.filters + `&q=${this.searchFilter}`
    }

    if (this.notifiedFilter !== 'all') {
      this.filters = this.filters + `&notified=${this.notifiedFilter}`
    }

    if (this.severityFilter !== 'all') {
      this.filters = this.filters + `&severity=${this.severityFilter}`
    }

    if (this.dateSort === 'newest') {
      this.filters = this.filters + `&o=-created_at`
    } else {
      this.filters = this.filters + `&o=created_at`
    }

    this.pollingSubscription.unsubscribe();
    this.currentPage = 1
    this.pollingSubscription = this.announcementService.startPolling(this.currentPage, this.filters).subscribe();


  }

  resetForm(announcementNgForm: NgForm) {
    announcementNgForm.resetForm()
  }

  openAnnouncementForm(){
    this.announcementForm = true;
  }

  closeAnnouncementForm(){
    this.announcementForm = false;
  }

  handleDropdownClick(event: MouseEvent) {
    this.elementInteractionService.handleDropdownClick(event);
  }

  deleteAnnouncement(index: number) {
    const isInLastPage = this.currentPage === this.totalPages;
    const itensInLastPage = this.totalAnnouncements % 25;
    const aloneInLastPage = itensInLastPage === 1;
    if(isInLastPage && aloneInLastPage){
      this.currentPage--
    }
    this.announcementService.deleteAnnouncement(index, this.currentPage, this.filters)
  }

  edit(announcementId: number | null, title: string | null, content: string | null, severity: string | null, notified: boolean, sendMail: boolean){
    this.editAnnouncement = true;
    this.announcementId = announcementId;
    this.title = title;
    this.content = content;
    this.notified = notified;
    this.sendMail = sendMail

    console.log(this.announcementId, notified, sendMail);
    

    switch (severity) {
      case 'importante':
        this.severity = 'IM';
        break;
      case 'info':
        this.severity = 'IN';
        break;
      case 'urgente':
        this.severity = 'WA';
        break;
      case 'crítico':
        this.severity = 'CR';
        break;
    }
  }


  isStaff(){
    return this.cookieService.getCookie('is_staff') == 'true'
  }

    ngOnDestroy(): void {
      this.pollingSubscription.unsubscribe();
  }

}
