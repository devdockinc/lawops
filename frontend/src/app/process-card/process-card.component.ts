import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ElementInteractionService } from '../services/element-interaction/element-interaction.service';
import { AsyncPipe, NgClass } from '@angular/common';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { ProcessComment } from '../interfaces/process-comment';
import { CookieService } from '../services/cookie/cookie.service';
import { DropdownClickOutDirective } from '../directives/dropdown-click-out.directive';
import { Process, Processo } from '../interfaces/process';
import { ProcessService } from '../services/process/process.service';
import { Observable, Subscription, interval, startWith, switchMap, tap } from 'rxjs';
import { LawsuitActivityComponent } from '../lawsuit-activity/lawsuit-activity.component';
import { Announcement } from '../interfaces/announcement';
import { LawsuitCommentsComponent } from '../lawsuit-comments/lawsuit-comments.component';
import { LawsuitCommentsService } from '../services/lawsuit-comments/lawsuit-comments.service';
import { LawsuitActivitiesService } from '../services/lawsuit-activities/lawsuit-activities.service';

@Component({
  selector: 'app-process-card',
  standalone: true,
  imports: [NgClass, FormsModule, DropdownClickOutDirective, AsyncPipe, LawsuitActivityComponent, LawsuitCommentsComponent],
  providers: [NgForm],
  templateUrl: './process-card.component.html',
  styleUrl: './process-card.component.css'
})
export class ProcessCardComponent implements OnInit, OnDestroy {

  autoUpdate: string = 'no';
  autoFrequency: string = 'no';

  processos$: Observable<any> | undefined;
  pollingSubscription: Subscription = new Subscription;

  lawsuitModal: boolean[] = [];

  pages: number[] = [];
  maxVisibleButtons: number = 5;
  currentPage: number = 1;
  totalPages: number = 1;

  activity: boolean[] = [];

  filters: string = '';
  searchFilter: string = '';
  areaFilter: string = 'all';
  monitoringFilter: string = 'all';

  constructor(private lawsuitActivitiesService: LawsuitActivitiesService ,private lawsuitCommentsService: LawsuitCommentsService ,public elementInteractionService: ElementInteractionService, private cookieService: CookieService, private processService: ProcessService
  ){}

  
  ngOnInit(): void {
    this.pollingSubscription = this.processService.startPolling().subscribe();
    //this.processService.getAllMonitoring().subscribe()
    
    this.processos$ = this.processService.processes$.pipe(
      tap({
        next: (value: Announcement) => {
            if(value){
              this.totalPages = value.count / 25;
              this.totalPages = Math.ceil(this.totalPages);
              console.log(this.totalPages);
              this.updatePages()
            }
   
        },
      })
    )
    
  }

  showFilters(){
    const filters = document.getElementById("filters");
    if(filters?.style.maxHeight){
      filters.style.maxHeight = '';
    }
    else{
      filters!.style.maxHeight = filters?.scrollHeight + "px";
    }
  } 

  getComments(id: number) {
    return this.lawsuitCommentsService.getComments(id)
  }

  getMonitoring(id: number) {
    return this.processService.getMonitoring(id).subscribe();
  }

  getActivities(id: number){
    return this.lawsuitActivitiesService.getActivities(id);
  }


  toggleDropdown(index: number, freq?: any, upd?: any, monitoring?: number): void {
    if(upd){
      this.autoUpdate = "yes";
    } else {
      this.autoUpdate = "no"
    }

    if(monitoring){
      this.getMonitoring(monitoring)
    }
     
    this.autoFrequency = freq;
    this.elementInteractionService.toggleDropdown('card' ,index);
  }

  updatePages(index?: number){
    
    if(index){
      this.pollingSubscription.unsubscribe();
      this.pollingSubscription = this.processService.startPolling(index, '').subscribe();
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


  applyFilters() {

    this.filters = '';
    if (this.searchFilter) {
      this.filters = this.filters + `&q=${this.searchFilter}`
    }

    if (this.areaFilter !== 'all') {
      this.filters = this.filters + `&processo_fonte__capa__area__icontains=${this.areaFilter}`
    } 

    if(this.monitoringFilter !== 'all'){
      this.filters = this.filters + `&automatic_update=${this.monitoringFilter}`
    }

    this.pollingSubscription.unsubscribe();
    this.currentPage = 1
    this.pollingSubscription = this.processService.startPolling(this.currentPage, this.filters).subscribe();


  }

  clearSearch(){
    this.searchFilter = ''
    this.applyFilters();
  }

  handleDropdownClick(event: MouseEvent): void {
    this.elementInteractionService.handleDropdownClick(event);
  }

  autoUpdateProcess(index: number, monitoringId: number, cnj: string){
    const automaticUpdate = this.autoUpdate === 'yes'
    this.processService.updateLawsuit(index, automaticUpdate, this.autoFrequency, monitoringId, cnj)
  }

  showActivity(index: number){
    this.activity[index] = true;
  }

  closeActivity(index: number){
    this.activity[index] = false;
  }

  isSuperuser(){
    return this.cookieService.getCookie('is_superuser') == 'true'
  }

  openLawsuitModal(index: number) {
    this.lawsuitModal[index] = true
  }

  closeLawsuitModal(index: number) {
    this.lawsuitModal[index] = false
  }

  ngOnDestroy(): void {
    this.pollingSubscription.unsubscribe();
  }

}
