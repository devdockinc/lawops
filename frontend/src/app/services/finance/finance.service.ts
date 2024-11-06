import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { CookieService } from '../cookie/cookie.service';
import { BehaviorSubject, EMPTY, finalize, interval, map, mergeMap, Observable, reduce, startWith, switchMap, tap } from 'rxjs';
import { ElementInteractionService } from '../element-interaction/element-interaction.service';
import { ToastService } from '../toast/toast.service';
import { AuthService } from '../auth/auth.service';
import { EscavadorKeyResponse } from '../../interfaces/escavador-key-response';

@Injectable({
  providedIn: 'root'
})
export class FinanceService {

  ddCategoryEndpoint = `${environment.baseEndpoint}/api/v1/finance/category/`;
  ddCategoryActiveEndpoint = `${environment.baseEndpoint}/api/v1/finance/category/?active=true`;
  ddBillEndpoint = `${environment.baseEndpoint}/api/v1/finance/`;
  ddBillActiveEndpoint = new BehaviorSubject<string>(`${environment.baseEndpoint}/api/v1/finance/?active=true`)
  ddValueSumEndpoint = `${environment.baseEndpoint}/api/v1/finance/value/?active=true&status=PA&`
  categoriesSubject = new BehaviorSubject<any>(null);
  categories = this.categoriesSubject.asObservable();

  billsSubject = new BehaviorSubject<any>(null);
  bills = this.billsSubject.asObservable();

  valueSumSubject = new BehaviorSubject<any>(null);
  valueSum = this.valueSumSubject.asObservable();

  escavadorBalanceSubject = new BehaviorSubject<any>(null);
  escavadorBalance = this.escavadorBalanceSubject;

  billSubmit: boolean = false;
  categorySubmit: boolean = false;
  

  constructor(private toastService: ToastService, private http: HttpClient, private elInService: ElementInteractionService, private authService: AuthService) {}

  startCategoriesPolling(): Observable<any> {
    return interval(120000).pipe(
      startWith(0),
      switchMap(() => this.getCategories()),
    );
  }
  
  startBillsPolling(page: number, filters: string): Observable<any> {
    return interval(120000).pipe(
      startWith(0),
      switchMap(() => this.getBills(page, filters)),
    );
  }

  addCategory(name: string | null, description: string | null){
    this.categorySubmit = true;
    const categoryData = {
      name,
      description,
      active: true
    }

    this.http.post(this.ddCategoryEndpoint, categoryData).pipe(
      switchMap(() => this.getCategories()),
      finalize(() => {
        this.categorySubmit = false;
      })
    )
    .subscribe({
      next: (value) => {
        this.toastService.addToast(200, 'Categoria cadastrada');

      },
      error: (err) => {
        if(err.status === 400) {
          this.toastService.addToast(err.status, 'Erro ao criar categoria');
        } else if (err.status === 404){
          this.toastService.addToast(err.status, 'Algo deu errado');
        } else {
          this.toastService.addToast(err.status, 'Erro interno de servidor')
        }
      },
    })
  }


  getCategories(){
    return this.http.get(this.ddCategoryActiveEndpoint).pipe(
      tap(categories => this.categoriesSubject.next(categories))
    )
  }

  addBill(bill_type: string | null, category: string | null, status: string | null, description: string | null, observation: string | null, value: number | null, payment_date: string | null, due_date: string | null, lawsuit: number | null){
    this.billSubmit = true;
    const billData = {
      bill_type,
      category,
      status,
      active: true,
      description,
      observation,
      value,
      payment_date,
      due_date,
      lawsuit
    }

    console.log("Dados de envio: ", billData);
    

    this.http.post(this.ddBillEndpoint, billData).pipe(
      switchMap(() => this.getBills()),
      finalize(() => {
        this.billSubmit = false;
      })
    )
    .subscribe({
      next: (value) => {
        console.log(value);
        this.toastService.addToast(200, 'Finança criada!');
      },
      error: (err) => {
        console.log(err);
        
        if(err.status === 400) {
          this.toastService.addToast(err.status, 'Erro ao criar finança');
        } else if (err.status === 404) {
          this.toastService.addToast(err.status, 'Algo deu errado');
        } else {
          this.toastService.addToast(err.status, 'Erro interno de servidor')
        }
      },
    })
  }

  valueFormat(value: any){
    
    let stringValue = value.toString()
    stringValue = stringValue.replace('.', ',');
    stringValue = stringValue.replace('.', ',');
    const valuePart = stringValue.split(',');
    valuePart[0] = valuePart[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return stringValue = valuePart.join(',');
  }

  getValue(){
    return this.http.get(this.ddValueSumEndpoint).pipe(
      tap((sum) => {
        console.log(sum);
        
        this.valueSumSubject.next(sum)})
    )
  }

  getBills(page?: number, filters?: string){
    console.log('bills');
    
    if(page){
      this.ddBillActiveEndpoint.next(`${environment.baseEndpoint}/api/v1/finance/?active=true&page=${page}${filters}`)
    }
    return this.http.get(this.ddBillActiveEndpoint.value).pipe(
      map((bill: any) => {
        const bills = bill.results.map((billRes: any) => {
          if (billRes.bill_type === 'IN') {
            billRes.bill_type = 'receita';
          } else {
            billRes.bill_type = 'despesa';
          }

          if (billRes.status === 'PA') {
            billRes.status = 'pago';
          } else if (billRes.status === 'CA'){
            billRes.status = 'cancelado'
          } else {
            billRes.status = 'pendente'
          }

          
          return {
            ...billRes,
            stringValue: this.valueFormat(billRes.value),
            created_since: this.elInService.timeSince(billRes.created_at),
            created_at_formatted: this.elInService.formatDate(billRes.created_at),
            updated_at_formatted: this.elInService.formatDate(billRes.updated_at),
            created_at: billRes.created_at,
            updated_at: billRes.updated_at,
            updated_since: this.elInService.timeSince(billRes.updated_at),
          }
        })
        
        const IN = bills.map((item: any) => {
          if(item.bill_type === 'receita' && item.status === 'pago'){
            return item.value
          } else {
            return 0;
          }
        })

        const OUT = bills.map((item: any) => {
          if(item.bill_type === 'despesa' && item.status === 'pago'){
            return item.value
          } else {
            return 0;
          }
        })

        let billIn: number = IN.reduce((accumulator: any, current: any) => accumulator + parseFloat(current), 0);
        let billOut: number = OUT.reduce((accumulator: any, current: any) => accumulator + parseFloat(current), 0);
        
        let sum = billIn - billOut;

        billIn = this.valueFormat(billIn.toFixed(2))
        billOut = this.valueFormat(billOut.toFixed(2))
        sum = this.valueFormat(sum.toFixed(2))
        
        return {
          ...bill,
          results: bills,
          sum,
          billIn,
          billOut
        }
      }),
      tap(bills => this.billsSubject.next(bills)),
      mergeMap(bills => 
        this.getValue().pipe(
          map(() => bills) // Retorna apenas o resultado de getBills()
        )
      ),
    )
  }

  getEscavadorBalance(){
    const escavadorKeyEndpoint = `${environment.baseEndpoint}/api/v1/parameter/`;
    return this.http.get<EscavadorKeyResponse>(escavadorKeyEndpoint).pipe(
      switchMap(res => {
        const apiKey = res.results[0].escavador_api_key;
        const escavadorHeader = new HttpHeaders({
          'Authorization': `Bearer ${apiKey}`,
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        });

        return this.http.get("https://api.escavador.com/api/v1/quantidade-creditos", { headers: escavadorHeader }).pipe(
          tap({
            next: (value) => {
              console.log("Saldo da api: ", value);
              this.escavadorBalanceSubject.next(value)
            },
            error: (err: HttpErrorResponse) => {
              if(err.status === 401){
                this.toastService.addToast(401, 'Créditos de consulta expirados!')
              }     
            },
          })
        )
      })
    )
  }

  deleteBill(index: number, page: number, filters: string){
    this.ddBillActiveEndpoint.next(`${environment.baseEndpoint}/api/v1/finance/?active=true&page=${page}${filters}`)
    this.http.patch(`${this.ddBillEndpoint}${index}/`, { active: false }).pipe(
      switchMap((value) => {
        console.log(value);
        
        return this.getBills()}),
    ).subscribe({
      next: (value) => {
        this.toastService.addToast(200, 'Finança deletada!');
      }, 
      error: (err) => {
        if(err.status === 400){
          this.toastService.addToast(err.status, 'Erro ao deletar finança');
        } else {
          this.toastService.addToast(err.status, 'Erro interno de servidor');
        }
      },
    })
  }

  patchBill(index: number | null, bill_type: string | null, category: string | null, status: string | null, description: string | null, observation: string | null, value: number | null, payment_date: string | null, due_date: string | null, lawsuit: number | null){ 
    this.billSubmit = true;
    const billData = {
      bill_type,
      category,
      status,
      active: true,
      description,
      observation,
      value,
      payment_date,
      due_date,
      lawsuit
    }
    
    this.http.patch(`${this.ddBillEndpoint}${index}/`, billData).pipe(
      switchMap(() => this.getBills()),
      finalize(() => {
        this.billSubmit = false;
      })
    )
    .subscribe({
      next: (value) => {
        console.log(value);
        
        this.toastService.addToast(200, 'Finança editada');
      },
      error: (err) => {
        console.log(err);
        
        if(err.status === 400) {
          this.toastService.addToast(err.status, 'Erro ao editar finança');
        } else {
          this.toastService.addToast(err.status, 'Erro interno de servidor')
        }
      },
    })
  }

}
