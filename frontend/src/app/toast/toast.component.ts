import { Component, OnInit } from '@angular/core';
import { ToastService } from '../services/toast/toast.service';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent implements OnInit{
  toasts$: Observable<any> | null = null;

  constructor(public toastService: ToastService){

  }
  ngOnInit(): void {
    this.toasts$ = this.toastService.toasts$;
  }
}
