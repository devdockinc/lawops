import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription, interval, startWith, switchMap, takeWhile, tap } from 'rxjs';
import { LoginResponse } from '../../interfaces/login-response';
import { UserResponse } from '../../interfaces/user-response';
import { Router } from '@angular/router';
import { CookieService } from '../cookie/cookie.service';
import { environment } from '../../../environments/environment.development';


/** Service to handle user authentication and cookies related to it.*/

@Injectable({providedIn: 'root'})
export class AuthService {
  private sessionMonitoringSubscription: Subscription | null = null;
  private accessTokenRequestSubscription: Subscription | null = null;
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);

  private userProfileSubject = new BehaviorSubject<any>(null);
  userProfile$ = this.userProfileSubject.asObservable();

  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private keepLoggedIn: string | null;

  constructor(private http: HttpClient, private router: Router, private cookieService: CookieService) {
    this.keepLoggedIn = localStorage.getItem('keepLoggedIn');

    if (this.keepLoggedIn === 'true' && this.cookieService.getCookie('access_token') !== '') {
      this.scheduleRefreshToken();
    }
  }

  userProfilePolling(){
    return interval(120000).pipe(
      startWith(0),
      switchMap(() => this.getUserInfo(this.cookieService.getCookie('username'), this.keepLoggedIn === 'true')))
  }

  login(username: string, password: string): Observable<any> {
    const endpoint = `${environment.baseEndpoint}/api/v1/token/`;
    const body = {
      username: username,
      password: password
    };

    return this.http.post<LoginResponse>(endpoint, body)
  }

  private requestNewAccessToken(): void {
    const refreshToken = this.cookieService.getCookie('refresh_token');

    this.accessTokenRequestSubscription = this.http.post<LoginResponse>(`${environment.baseEndpoint}/api/v1/token/refresh/`, { refresh: refreshToken }).subscribe({
      next: (res) => {
        const accessTokenExpiration = this.cookieService.setCookieExpiration(30 * 60 * 1000);
        this.cookieService.setCookie('access_token', res.access, accessTokenExpiration);
        this.cookieService.setCookie('access_token_expiration', accessTokenExpiration, accessTokenExpiration);
        
        this.scheduleRefreshToken();
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  scheduleRefreshToken(): void {
    if (this.cookieService.getCookie('refresh_token') !== '') {
      const accesTokenExpiration = this.cookieService.getCookie('access_token_expiration')
      const accessTokenExpirationMili = Date.parse(accesTokenExpiration)
      const currentTime = Date.now();
      const refreshInterval = (accessTokenExpirationMili - currentTime - 30000);
      
      setTimeout(() => {
        this.accessTokenRequestSubscription?.unsubscribe();
        this.requestNewAccessToken();
      }, refreshInterval)
    }
  }
  
  logout(): void {
    this.cookieService.deleteCookies();
    
    if (this.keepLoggedIn === 'true') {
      localStorage.removeItem('keepLoggedIn');
      this.accessTokenRequestSubscription?.unsubscribe();
    }
    this.isLoggedInSubject.next(false);

  }

  saveSession(access_token: string, refresh_token: string){
    this.cookieService.setCookies(access_token, refresh_token);
    this.isLoggedInSubject.next(true);
  }

  getUserInfo(username: string, keepLoggedIn?: boolean): Observable<any> {
    let userTokenExpiration = this.cookieService.setCookieExpiration(30 * 60 * 1000)
    
    if (keepLoggedIn) {
      userTokenExpiration = this.cookieService.setCookieExpiration(24 * 60 * 60 * 1000)
    }
    
    const endpoint = `${environment.baseEndpoint}/api/v1/user/?username=${username}`;
    
    return this.http.get<UserResponse>(endpoint).pipe(
      tap(({
        next: (res) => {
          console.log(res);      
          this.cookieService.setCookie('username', `${res.results[0].username}`, userTokenExpiration)
          this.cookieService.setCookie('first_name', `${res.results[0].first_name}`, userTokenExpiration)
          this.cookieService.setCookie('last_name', `${res.results[0].last_name}`, userTokenExpiration)
          this.cookieService.setCookie('is_superuser', `${res.results[0].is_superuser}`, userTokenExpiration)
          this.cookieService.setCookie('is_staff', `${res.results[0].is_staff}`, userTokenExpiration)
          this.cookieService.setCookie('id', `${res.results[0].id}`, userTokenExpiration)
          this.cookieService.setCookie('email', `${res.results[0].email}`, userTokenExpiration);
          this.userProfileSubject.next(res)
        },
        error: (err) => {
          console.error(err);
        }
      }))
    )
  }

  isLoggedIn(): boolean {
    return this.cookieService.getCookie('access_token') !== '';
  }

  isAdmin(): boolean {
    return this.cookieService.getCookie('access_token') !== '' && this.cookieService.getCookie('is_superuser') === 'true'
  }

  startSessionMonitoring(): void {
    this.sessionMonitoringSubscription = interval(120000)
      .pipe(
        takeWhile(() => true)
      )
      .subscribe(() => {
        if (!this.isLoggedIn()) {
          this.logout()
          this.router.navigate(['/login']);
        }
        if(!this.isAdmin()){
          console.log('Erro de cookies');
          const timestamp = Date.now();
          const date = new Date(timestamp);
          const formattedDate = date.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
});
          console.log('Horário: ', formattedDate)
        }
      });
  }

  stopSessionMonitoring(): void {
    if (this.sessionMonitoringSubscription !== null) {
      this.sessionMonitoringSubscription.unsubscribe();
    }
  }
  
}
