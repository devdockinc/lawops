import { AsyncPipe, NgClass } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { FinanceService } from '../services/finance/finance.service';
import { Observable, Subscription, map } from 'rxjs';
import { ProcessService } from '../services/process/process.service';
import { ElementInteractionService } from '../services/element-interaction/element-interaction.service';
import { DropdownClickOutDirective } from '../directives/dropdown-click-out.directive';
import { ToastComponent } from '../toast/toast.component';
import { BillsComponent } from '../bills/bills.component';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-finances',
  standalone: true,
  imports: [FormsModule, NgClass, AsyncPipe, DropdownClickOutDirective, ToastComponent, BillsComponent],
  templateUrl: './finances.component.html',
  styleUrl: './finances.component.css'
})
export class FinancesComponent implements OnInit, OnDestroy {
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

  categoryName: string | null = null;
  categoryDescription: string | null = null;

  fieldsVisible: boolean = false;

  categories$: Observable<any> | null = null;

  bills$: Observable<any> | null = null;
  rawBills$: Observable<any> | null = null;
  billsPollingSubscription: Subscription = new Subscription;
  categoriesPollingSubscription: Subscription = new Subscription

  lawsuits$: Observable<any> | null = null;
  editBill: boolean = false;

  escavadorBalance$: Observable<any> | null = null;

  billForm: boolean = false;
  categoryForm: boolean = false;

  valueSumPollingSubscription: Subscription = new Subscription;
  valueSum$: Observable<any> | null = null;

  constructor(public elInService:ElementInteractionService, public financeService: FinanceService, private processService: ProcessService, private authService: AuthService){
  }


  ngOnInit(): void {

    this.categoriesPollingSubscription = this.financeService.startCategoriesPolling().subscribe();
    this.financeService.getEscavadorBalance().subscribe();
    this.escavadorBalance$ = this.financeService.escavadorBalance;


    this.valueSum$ = this.financeService.valueSum;
    this.categories$ = this.financeService.categories;

    this.rawBills$ = this.financeService.bills;
    this.bills$ = this.rawBills$;

    this.lawsuits$ = this.processService.processes$;
  }

  closeBillForm(){
    this.billForm = false
  }

  openBillForm(){
    this.billForm = true;
  }

  isAdmin(){
    return this.authService.isAdmin();
  }

  onEditBill(event: { bill_id: number | null, bill_type: string | null, category: string | null, status: string | null, description: string | null, observation: string | null, value: string | null, payment_date: string | null, due_date: string | null, lawsuit: number | null }){
    this.editBill = true;
    this.openBillForm();
    if(event.bill_type === 'receita'){
      this.type = 'IN'
    } else {
      this.type = 'OUT'
    }
    
    if(event.status === 'pago'){
      this.status = 'PA'
    } else if (event.status === 'cancelado') {
      this.status = 'CA'
    } else {
      this.status = 'PE'
    }
    this.category = event.category;
    this.bill_id = event.bill_id
    this.description = event.description;
    this.observation = event.observation;
    this.value = event.value;
    this.due_date = event.due_date;
    this.payment_date = event.payment_date;
    this.lawsuit = event.lawsuit
  }

  closeCategoryForm(){
    this.categoryForm = false
  }

  openCategoryForm(){
    this.categoryForm = true
  }

  formatValue(event: any){
    let value = event.target.value;

    if(value.length === 0 || value === '' || value.length === 2){
      value = '0,00';
      return
    }
    // Remove todos os caracteres não numéricos, exceto vírgulas e pontos
    value = value.replace(/[^0-9]/g, '');
  
    // Evita adicionar zeros à esquerda
    value = value.replace(/^0+(?!$)/, '');

    // Adiciona as casas decimais
    const integerPart = value.slice(0, -2) || '0';
    const decimalPart = value.slice(-2).padStart(2, '0');

    let formattedValue = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    this.value = `${formattedValue},${decimalPart}`;
  }

  addBill(ngForm: NgForm){
    let valueNoDots = this.value?.replace(/\./g, '');
    let valueDecString = valueNoDots!.replace(',', '.');
    let numberValue = parseFloat(valueDecString);
    console.log(numberValue);
    
    if(this.editBill){
      this.financeService.patchBill(this.bill_id, this.type, this.category, this.status, this.description, this.observation, numberValue, this.payment_date, this.due_date, this.lawsuit)
      this.editBill = false;
    } else{
      this.financeService.addBill(this.type, this.category, this.status, this.description, this.observation, numberValue, this.payment_date, this.due_date, this.lawsuit)
    }

    ngForm.resetForm();
  }

  addCategory(ngForm: NgForm){
    this.financeService.addCategory(this.categoryName, this.categoryDescription)
    ngForm.resetForm()

  }

  resetForm(form: NgForm){
    form.resetForm()
  }

  showFields(){
    this.fieldsVisible = !this.fieldsVisible;
  }

  ngOnDestroy(): void {
    this.billsPollingSubscription.unsubscribe();
    this.categoriesPollingSubscription.unsubscribe();
  }
}