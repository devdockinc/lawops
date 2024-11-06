import { Component } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { FormsModule, NgForm } from '@angular/forms';
import { FooterComponent } from '../footer/footer.component';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FooterComponent, NgClass, FormsModule],
  providers: [NgForm],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  username!: string;
  usernameFlag!: string;
  userPassword!: string;
  showPassword: boolean = false;
  checkbox: boolean = false;
  keepLogged: boolean = false;
  submitted: boolean = false;

  constructor(private authService: AuthService, public router: Router){}
  
  onSubmit(loginForm: NgForm) {
    this.submitted = true;
    this.usernameFlag = this.username;
    this.keepLogged = this.checkbox;
  
    this.authService.login(this.usernameFlag, this.userPassword).pipe(
      tap((response) => {
        this.authService.saveSession(response.access, response.refresh);
      }),
      switchMap(() => 
        this.authService.getUserInfo(this.usernameFlag, this.keepLogged)
      ),
      tap(() => {
        if (this.keepLogged) {
          localStorage.setItem('keepLoggedIn', 'true');
          this.authService.scheduleRefreshToken();
        }
        this.router.navigate(['/dashboard']);
        this.usernameFlag = '';
      })
    ).subscribe({
        error: (error: HttpErrorResponse) => {
          this.submitted = false;
        }
    });
  
    loginForm.resetForm();
  }
}
