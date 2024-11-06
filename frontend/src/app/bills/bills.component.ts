import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, Subscription, map, tap } from 'rxjs';
import { FinanceService } from '../services/finance/finance.service';
import { ElementInteractionService } from '../services/element-interaction/element-interaction.service';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, NgClass } from '@angular/common';
import { DropdownClickOutDirective } from '../directives/dropdown-click-out.directive';
import { Announcement } from '../interfaces/announcement';

@Component({
  selector: 'bills',
  standalone: true,
  imports: [FormsModule, NgClass, AsyncPipe, DropdownClickOutDirective],
  templateUrl: './bills.component.html',
  styleUrl: './bills.component.css'
})
export class BillsComponent implements OnInit, OnDestroy {
  @Output() editBill = new EventEmitter<{bill_id: number | null, bill_type: string | null, category: string | null, status: string | null, description: string | null, observation: string | null, value: string | null, payment_date: string | null, due_date: string | null, lawsuit: number | null}>

  typeFilter = 'all';
  statusFilter = 'all';
  dateSort = 'newest';
  valueSort = 'none';
  searchFilter = ''

  type: string | null = null;
  category: string | null = null;
  active: boolean = true;
  status: string | null = null;
  description: string | null = null;
  observation: string | null = null;
  value: string | null = null;
  payment_date: string | null = null;
  due_date: string | null = null;
  lawsuit: number | null = null;
  bill_id: number | null = null;

  cards: boolean = true;

  bills$: Observable<any> | null = null;
  rawBills$: Observable<any> | null = null;
  billsPollingSubscription: Subscription = new Subscription

  billModal: boolean[] = [];

  pages: number[] = [];
  maxVisibleButtons: number = 5;
  currentPage: number = 1;
  totalPages: number = 1;
  totalBills: number = 0;

  filters: string = '';

  constructor(public financeService: FinanceService, public elInService: ElementInteractionService){
    
  }

  ngOnInit(): void {
    this.billsPollingSubscription = this.financeService.startBillsPolling(1, this.filters).subscribe();
    this.rawBills$ = this.financeService.bills;
    this.bills$ = this.financeService.bills.pipe(
      tap({
        next: (value: Announcement) => {
            if(value){
              this.totalPages = value.count / 25;
              this.totalBills = value.count;
              this.totalPages = Math.ceil(this.totalPages);
              this.updatePages()
            }
        },
      })
    );
  }


  edit(bill_id: number | null, bill_type: string | null, category: string | null, status: string | null, description: string | null, observation: string | null, value: string | null, payment_date: string | null, due_date: string | null, lawsuit: number | null){
    // this.billForm = true;
    // this.editBill = true;
    this.editBill.emit({bill_id, bill_type, category, status, description, observation, value, payment_date, due_date, lawsuit})
  }

  clearSearch(){
    this.searchFilter = ''
    this.applyFilters();
  }

  updatePages(index?: number){
    
    if(index){
      this.billsPollingSubscription.unsubscribe();
      this.billsPollingSubscription = this.financeService.startBillsPolling(index, this.filters).subscribe();
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

  applyFilters(sort?: string) {
    this.filters = '';

    if (this.searchFilter) {
      this.filters = this.filters + `&q=${this.searchFilter}`
    }

    if (this.typeFilter !== 'all') {
      this.filters = this.filters + `&bill_type=${this.typeFilter}`
    }

    if (this.statusFilter !== 'all') {
      this.filters = this.filters + `&status=${this.statusFilter}`
    }
    
    if(sort === 'value'){
      this.dateSort = 'newest'
    } else if(sort === 'date'){
      this.valueSort = 'none'
    }
    

    if (this.dateSort === 'newest') {
      this.filters = this.filters + `&o=-created_at`
    } else {
      this.filters = this.filters + `&o=created_at`
    }

    if (this.valueSort !== 'none') {   
        if (this.valueSort === 'highest') {
          this.filters = this.filters + `&o=-value`;
        } else {
          this.filters = this.filters + `&o=value`
        }
    }

    this.billsPollingSubscription.unsubscribe();
    this.currentPage = 1;
    this.billsPollingSubscription = this.financeService.startBillsPolling(1, this.filters).subscribe()
  }

  showCards(){
    this.cards = true;
  }

  showTable(){
    this.cards = false
  }

  handleDropdownClick(event: MouseEvent) {
    this.elInService.handleDropdownClick(event);
  }

  deleteBill(index: number){
    const isInLastPage = this.currentPage === this.totalPages;
    const itensInLastPage = this.totalBills % 25;
    const aloneInLastPage = itensInLastPage === 1;
    if(isInLastPage && aloneInLastPage){
      this.currentPage--
    }

    this.financeService.deleteBill(index, this.currentPage, this.filters);
  }

  openBillModal(index: number){
    this.billModal[index] = true
  }

  closeBillModal(index: number){
    this.billModal[index] = false
  }

  ngOnDestroy(): void {
    this.billsPollingSubscription.unsubscribe();
  }
}
