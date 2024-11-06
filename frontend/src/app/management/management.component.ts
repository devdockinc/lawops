import { AsyncPipe, NgClass } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { ManagementService } from '../services/management/management.service';
import { Observable, Subscription, map, tap } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { Announcement } from '../interfaces/announcement';

@Component({
  selector: 'app-management',
  standalone: true,
  imports: [NgClass, FormsModule, AsyncPipe],
  templateUrl: './management.component.html',
  styleUrl: './management.component.css'
})
export class ManagementComponent implements OnInit, OnDestroy {

  users$: Observable<any> | null = null;
  rawUsers$: Observable<any> | null = null;

  userFormSubmit$: Observable<boolean> | null = null;
  postUserForm$: Observable<boolean> | null = null
  patchUserForm$: Observable<boolean[]> | null = null 
  
  showPasswordConfirmation: boolean = false;
  showPassword: boolean = false;
  
  userName: string | null = null;
  userPassword: string | null = null;
  userPasswordConfirmation: string | null = null;
  firstName: string | null = null;
  lastName: string | null = null;
  email: string | null = null;
  isStaff: boolean = false;
  isSuperuser: boolean = false;
  userId: number | null = null;

  isStaffFilter: string = 'all';
  isSuperuserFilter: string = 'all';
  searchFilter: string = '';

  pages: number[] = [];
  maxVisibleButtons: number = 5;
  currentPage: number = 1;
  totalPages: number = 1;

  filters: string = '';

  totalUsers: number = 0;

  usersSubscription: Subscription = new Subscription;

  constructor(private managementService: ManagementService, private authService: AuthService){}
  
  ngOnInit(): void {
    this.usersSubscription = this.managementService.usersPolling().subscribe();
    this.users$ = this.managementService.users$.pipe(
      tap({
        next: (value: Announcement) => {
            if(value){
              this.totalPages = (value.count -1) / 25;
              this.totalUsers = value.count - 1;
              this.totalPages = Math.ceil(this.totalPages);
              this.updatePages()
            }
        },
      })
    );;


    this.userFormSubmit$ = this.managementService.userFormSubmit$;
    this.postUserForm$ = this.managementService.postUserForm$;
    this.patchUserForm$ = this.managementService.patchUserForm$;
  }


  updatePages(index?: number){
    
    if(index){
      this.usersSubscription.unsubscribe();
      this.usersSubscription = this.usersSubscription = this.managementService.usersPolling(index, this.filters).subscribe();
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

  postUser(ngForm: NgForm){
    this.managementService.postUser(this.userName, this.userPassword, ngForm)
  }

  patchUser(index: number, ngForm: NgForm){
    const userData = {
      is_staff: this.isStaff,
      is_superuser: this.isSuperuser
    }

    this.managementService.patchUser(index, userData, this.userId, ngForm);

  }

  isAdmin(){
    return this.authService.isAdmin();
  }

  deleteUser(id: number){
    const isInLastPage = this.currentPage === this.totalPages;
    const itensInLastPage = this.totalUsers % 25;
    const aloneInLastPage = itensInLastPage === 1;
    if(isInLastPage && aloneInLastPage){
      this.currentPage--
    }
    this.managementService.deleteUser(id, this.currentPage, this.filters)
  }

  resetForm(ngForm: NgForm){
    ngForm.resetForm()
  }

  clearSearch(){
    this.searchFilter = ''
    this.applyFilters();
  }

  editUser(index: number, id: number, is_staff: boolean, is_superuser: boolean){
    this.isStaff = is_staff;
    this.isSuperuser = is_superuser;
    this.userId = id;
    this.managementService.openPatchUserForm(index)
  }

  applyFilters() {
    this.filters = '';

    if (this.isStaffFilter !== 'all') {
      this.filters = this.filters + `&is_staff=${this.isStaffFilter}`
    }

    if (this.isSuperuserFilter !== 'all') {
      this.filters = this.filters + `&is_superuser=${this.isSuperuserFilter}`
    }

    if (this.searchFilter) {
      this.filters = this.filters + `&q=${this.searchFilter}`
    }
    console.log(this.filters);
    

    this.usersSubscription.unsubscribe();
    this.currentPage = 1;
    this.usersSubscription = this.managementService.usersPolling(this.currentPage, this.filters).subscribe();
  }
 
  closePatchUserForm(index: number, ngForm: NgForm){
    this.managementService.closePatchUserForm(index, ngForm);
  }

  openPostUserForm(){
    this.managementService.openPostUserForm()
  }

  closePostUserForm(ngForm: NgForm){
    this.managementService.closePostUserForm(ngForm)
  }

  ngOnDestroy(): void {
    this.usersSubscription.unsubscribe();
  }
}