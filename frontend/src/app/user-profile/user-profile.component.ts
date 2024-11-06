import { Component, OnDestroy, OnInit } from '@angular/core';
import { ManagementService } from '../services/management/management.service';
import { AsyncPipe, NgClass } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Observable, of, Subscription } from 'rxjs';
import { CookieService } from '../services/cookie/cookie.service';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [NgClass, AsyncPipe, FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit, OnDestroy {

  email: string | null = null;
  name: string | null = null;
  lastName: string | null = null;

  patchUserForm$: Observable<boolean[] > = of([false]);
  userFormSubmit$: Observable<boolean> = of(false);

  userProfile$: Observable<any> | null = null;

  userProfileSubscription: Subscription = new Subscription;

  constructor(private managementService: ManagementService, private authService: AuthService, private cookieService: CookieService){}

  ngOnInit(): void {
    this.userProfileSubscription = this.authService.userProfilePolling().subscribe();
    this.patchUserForm$ = this.managementService.patchUserForm$
    this.userFormSubmit$ = this.managementService.userFormSubmit$;
    this.userProfile$ = this.authService.userProfile$;
  }

  submitPatchUser(ngForm: NgForm){
    const id = Number(this.cookieService.getCookie('id'))
    console.log(id);
    
    this.managementService.patchUserProfile(this.email, this.name, this.lastName, id, ngForm)
  }

  editUserInfo(){
    this.email = this.cookieService.getCookie('email');
    this.name = this.cookieService.getCookie('first_name');
    this.lastName = this.cookieService.getCookie('last_name');
    this.openPatchUserForm()
  }


  openPatchUserForm(){
    this.managementService.openPatchUserForm(0)
  }

  closePatchUserForm(ngForm: NgForm){
    this.managementService.closePatchUserForm(0, ngForm);
  }

  ngOnDestroy(): void {
    this.userProfileSubscription.unsubscribe();
  }

}
