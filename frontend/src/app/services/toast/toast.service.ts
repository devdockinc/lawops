import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new BehaviorSubject<any>(null);
  toasts$ = this.toastSubject.asObservable()
  toasts: any = []

  addToast(status: number, message: string){
    const toast = { status, message };

    this.toasts.push(toast)
    this.toastSubject.next(this.toasts);
    

    setTimeout(() => {
      this.removeToast(toast);
    }, 5000);
  }

  removeToast(toast: any) {
    this.toasts = this.toasts.filter((t: any) => t !== toast);
    this.toastSubject.next(this.toasts);
  }
}
