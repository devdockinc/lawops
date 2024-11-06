import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, finalize, interval, map, startWith, switchMap, tap } from 'rxjs';
import { ToastService } from '../toast/toast.service';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { UserResponse } from '../../interfaces/user-response';
import { CookieService } from '../cookie/cookie.service';

@Injectable({
  providedIn: 'root'
})
export class ManagementService {
  private endpoint = `${environment.baseEndpoint}/api/v1/user/`;
  private activeUsersEndpoint = new BehaviorSubject<string>(`${environment.baseEndpoint}/api/v1/user/?is_active=true&username__exclude=${this.cookieService.getCookie('username')}`)

  private usersSubject = new BehaviorSubject<any>(null);
  users$ = this.usersSubject.asObservable();

  private userFormSubmitSubject = new BehaviorSubject<boolean>(false);
  userFormSubmit$ = this.userFormSubmitSubject.asObservable();

  private patchUserFormSubject$ = new BehaviorSubject<boolean[]>([]);
  patchUserForm$ = this.patchUserFormSubject$.asObservable();

  private postUserFormSubject$ = new BehaviorSubject<boolean>(false);
  postUserForm$ = this.postUserFormSubject$.asObservable();

  constructor(private http: HttpClient, private toastService: ToastService, private authService: AuthService, private cookieService: CookieService) {}

  usersPolling(page?: number, filters?: string){
    return interval(120000).pipe(
      startWith(0),
      switchMap(() => this.getUsers(page, filters)))
  }

  postUser(username: string | null, password: string | null, ngForm: NgForm){
    ngForm.resetForm()
    this.userFormSubmitSubject.next(true);
    const newUserData = {
      username,
      password,
    }
    return this.http.post(this.endpoint, newUserData).pipe(
      switchMap(() => this.getUsers()),
      finalize(() => {
        this.userFormSubmitSubject.next(false);
      })
    ).subscribe({
      next: (value) => {
        this.closePostUserForm()
        this.toastService.addToast(200, 'Usuário cadastrado!')
      },
      error: (err) => {
        console.log(err);
        
        if(err.status === 400){
          this.toastService.addToast(err.status, 'Erro ao cadastrar usuário');
        } else {
          this.toastService.addToast(err.status, 'Erro interno de servidor')
        }
      },
    })
  }

  patchUser(index: number, userData: object, id: number | null, ngForm: NgForm){
    ngForm.resetForm()
    this.userFormSubmitSubject.next(true);
    return this.http.patch(`${environment.baseEndpoint}/api/v1/user/${id}/`, userData).
    pipe(
      switchMap(() => this.getUsers()),
      finalize(()=> {
        this.closePatchUserForm(index)
        this.userFormSubmitSubject.next(false);
      })
    ).subscribe({
      next: (value) => {
        this.toastService.addToast(200, 'Usuário editado!')
      },
      error: (err) => {
        if(err.status === 400){
          this.toastService.addToast(err.status, 'Erro ao editar usuário');
        } else {
          this.toastService.addToast(err.status, 'Erro interno de servidor');
        }
      },
    })
  }

  patchUserProfile(email: string | null, first_name: string | null, last_name: string | null, id: number, ngForm: NgForm){
    
    const userData = {
      email,
      first_name,
      last_name
    }
    this.userFormSubmitSubject.next(true);
    return this.http.patch(`${environment.baseEndpoint}/api/v1/user/${id}/`, userData).
    pipe(
      switchMap((user: any) => this.authService.getUserInfo(user.username)),
      finalize(()=> {
        this.userFormSubmitSubject.next(false);
      })
    ).subscribe({
      next: (value: any) => {
        console.log(value);
        ngForm.resetForm()
        this.closePatchUserForm(0)
        this.toastService.addToast(200, 'Usuário editado!')
      },
      error: (err) => {
        if(err.status === 400){
          console.log(err);
          if(err.error.username){
            this.toastService.addToast(err.status, 'Esse nome de usuário já está sendo utilizado');
          } else {
            this.toastService.addToast(err.status, 'Erro ao editar usuário');
          }
          
        } else {
          this.toastService.addToast(err.status, 'Erro interno de servidor');
        }
      },
    })
  }



  closePatchUserForm(index: number, ngForm?: NgForm){
    ngForm?.resetForm()
    const currentArray = [...this.patchUserFormSubject$.value];
    currentArray[index] = false;
    this.patchUserFormSubject$.next(currentArray)
  }

  openPatchUserForm(index: number){
    const currentArray = [...this.patchUserFormSubject$.value];
    currentArray[index] = true;
    this.patchUserFormSubject$.next(currentArray)
  }

  closePostUserForm(ngForm?: NgForm){
    ngForm?.resetForm()
    this.postUserFormSubject$.next(false);
  }

  openPostUserForm(){
    this.postUserFormSubject$.next(true)
  }

  deleteUser(id: number, page: number, filters: string){
    this.activeUsersEndpoint.next(`${environment.baseEndpoint}/api/v1/user/?is_active=true&page=${page}${filters}`)

    return this.http.patch(`${environment.baseEndpoint}/api/v1/user/${id}/`, {is_active: false}).
      pipe(
        switchMap(() => this.getUsers()),
        finalize(()=> {
          this.userFormSubmitSubject.next(false);
        })
      ).subscribe({
        next: (value) => {
          this.toastService.addToast(200, 'Usuário excluído!')
        },
        error: (err) => {
          if(err.status === 400){
            this.toastService.addToast(err.status, 'Erro ao excluir usuário');
          } else {
            this.toastService.addToast(err.status, 'Erro interno de servidor');
          }
        },
      })
  }

  getUsers(page?: number, filters?: string): Observable<any>{
    if(page){
      this.activeUsersEndpoint.next(`${environment.baseEndpoint}/api/v1/user/?is_active=true&page=${page}${filters}`)
    }

    return this.http.get(this.activeUsersEndpoint.value).pipe(
      map((users: any) => {
        const filteredUsers = users.results.filter((user: any) => user.username !== this.cookieService.getCookie('username'))

        return {
          ...users,
          results: filteredUsers
        }
      }),
      tap({
        next: (value) => {
          console.log(value);
        
        this.usersSubject.next(value)
        },
        error: (err) => {
          console.log(err);
          
        },
      })
    )
  }
}
