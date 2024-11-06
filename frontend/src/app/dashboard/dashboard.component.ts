import { Component, ElementRef, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { DropdownClickOutDirective } from '../directives/dropdown-click-out.directive';
import { ElementInteractionService } from '../services/element-interaction/element-interaction.service';
import { AsyncPipe, NgClass } from '@angular/common';
import { CookieService } from '../services/cookie/cookie.service';
import { ProcessCardComponent } from '../process-card/process-card.component';
import { ProcessService } from '../services/process/process.service';
import { of } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, DropdownClickOutDirective, NgClass, ProcessCardComponent, AsyncPipe],
  providers: [NgForm, ElementInteractionService],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  autoFrequency: string = 'NA';
  autoUpdate: string = 'false';
  cnjNumber: string = ''; 

  lawsuitToast: boolean = false;
  lawsuitMessage: string | null = null
  lawsuitStatus: number | null = null;

  lawsuitSubmit: boolean = false;

  lawsuitForm: boolean = false;


  constructor(public elementInteractionService: ElementInteractionService, public processService: ProcessService, private authService: AuthService){}
  ngOnInit(): void {

  }
  

  isAdmin(){
    return this.authService.isAdmin();
  }

  addProcess(form: NgForm): void {
    this.lawsuitSubmit = true;
    const cnjNumberFlag = this.cnjNumber
    this.cnjNumber = '';
    let autoUpdateBoolean = this.autoUpdate === 'true';
    
    console.log(autoUpdateBoolean);
    
    this.processService.addProcess(cnjNumberFlag, autoUpdateBoolean, this.autoFrequency);
    this.autoFrequency = 'NA';
    this.autoUpdate = 'false';
  }

  closeLawsuitForm(){
    this.lawsuitForm = false;
  }

  openLawsuitForm(){
    this.lawsuitForm = true;
  }

  cnjNumberFormat(event: any) {
    const currentValue = event.target.value.replace(/[^\d]/g, ''); // Remove todos os caracteres não numéricos

    // Adiciona os hífens e pontos conforme necessário
    let formattedValue = '';
    for (let i = 0; i < currentValue.length; i++) {
      if (i === 7) {
        formattedValue += '-';
      } else if (i === 9 || i === 13 || i === 14 || i === 16) {
        formattedValue += '.';
      }
      formattedValue += currentValue[i];
    }

    this.cnjNumber = formattedValue;

    const userInputLength = event.target.selectionEnd - event.target.selectionStart;
    const currentValueLength = currentValue.length;
    if (userInputLength < 0) {
      this.cnjNumber = this.cnjNumber.slice(0, currentValueLength + userInputLength);
    }
  }
}

