import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, EMPTY, Observable, Subscription, catchError, concatMap, finalize, forkJoin, from, iif, interval, map, mergeMap, of, shareReplay, startWith, switchMap, tap, toArray } from 'rxjs';
import { Advogado, AssuntoNormalizado, AssuntoNormalizadoRes, Capa, CapaRes, Envolvido, EnvolvidoRes, EstadoOrigemRes, Fonte, FonteRes, Oab, Process, Processo, ProcessoRes, Tribunal, TribunalRes, ValorCausa, ValorCausaRes } from '../../interfaces/process';
import { environment } from '../../../environments/environment.development';
import { CookieService } from '../cookie/cookie.service';
import { EscavadorKeyResponse } from '../../interfaces/escavador-key-response';
import { ElementInteractionService } from '../element-interaction/element-interaction.service';
import { ToastService } from '../toast/toast.service';
import { AuthService } from '../auth/auth.service';

interface CommentResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Comment[];
}

@Injectable({
  providedIn: 'root'
})
export class ProcessService {

  private processesSubject = new BehaviorSubject<any>(null);
  processes$ = this.processesSubject.asObservable();

  private pollingSubscription: Subscription | null = null;
  
  lawsuitSubmit: boolean = false;

  ddProcessoEndpoint = `${environment.baseEndpoint}/api/v1/escavador/processo/`;
  ddProcessoResumoEndpoint = new BehaviorSubject<string>(`${environment.baseEndpoint}/api/v1/escavador/processo-resumo/`);
  ddFonteEndpoint = `${environment.baseEndpoint}/api/v1/escavador/processo-fonte/`;
  ddCapaEndpoint = `${environment.baseEndpoint}/api/v1/escavador/processo-fonte-capa/`;
  ddTribunalEndpoint = `${environment.baseEndpoint}/api/v1/escavador/tribunal/`;
  ddAssuntoNormalizadoProcessoFonteCapa = `${environment.baseEndpoint}/api/v1/escavador/assunto-normalizado-processo-fonte-capa/`;
  ddAssuntoNormalizadoEndpoint = `${environment.baseEndpoint}/api/v1/escavador/assunto-normalizado/`;
  ddValorCausaEndpoint = `${environment.baseEndpoint}/api/v1/escavador/valor-causa/`;
  ddEnvolvidoEndpoint = `${environment.baseEndpoint}/api/v1/escavador/envolvido/`;
  ddEstadoOrigemEndpoint = `${environment.baseEndpoint}/api/v1/escavador/estado/`;
  ddOabEndpoint = `${environment.baseEndpoint}/api/v1/escavador/oab/`;
  ddLawsuitEndpoint = `${environment.baseEndpoint}/api/v1/lawsuit/`;
  ddLawsuitPaginationEndpoint = new BehaviorSubject<string>(`${environment.baseEndpoint}/api/v1/lawsuit/`);

  ddLawsuitActivitiesEndpoint = `${environment.baseEndpoint}/api/v1/escavador/movimentacao/`;

  constructor(private toastService: ToastService, private http: HttpClient, private cookieService: CookieService, private elementInteractionService: ElementInteractionService, private authService: AuthService) { 
  }

  startPolling(page?: number, filters?: string): Observable<Process[]> {
    return interval(120000).pipe(
      startWith(0),
      switchMap(() => this.getProcesses(page, filters))
    )
  }

  getAllMonitoring(){
    const escavadorKeyEndpoint = `${environment.baseEndpoint}/api/v1/parameter/`;
    return this.http.get<EscavadorKeyResponse>(escavadorKeyEndpoint).pipe(
      switchMap((res) => {
        const apiKey = res.results[0].escavador_api_key;
        const escavadorHeader = new HttpHeaders({
          'Authorization': `Bearer ${apiKey}`,
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        });

        return this.http.get("https://api.escavador.com/api/v1/monitoramentos-tribunal", { headers: escavadorHeader }).pipe(
          tap({
            next: (value) => {
              console.log("Todos os monitoramentos: ", value);
            },
          })
        )
      })
    )
  }

  getMonitoring(id: number){
    const escavadorKeyEndpoint = `${environment.baseEndpoint}/api/v1/parameter/`;
    return this.http.get<EscavadorKeyResponse>(escavadorKeyEndpoint).pipe(
      switchMap((res) => {
        const apiKey = res.results[0].escavador_api_key;
        const escavadorHeader = new HttpHeaders({
          'Authorization': `Bearer ${apiKey}`,
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        });

        return this.http.get(`https://api.escavador.com/api/v1/monitoramentos-tribunal/${id}`, { headers: escavadorHeader }).pipe(
          tap({
            next: (value) => {
              console.log("Monitoramento único: ", value);
            },
          })
        )
      })
    )
  }

  getProcesses(page?: number, filters?: string): Observable<any>{
    if(page){
      this.ddProcessoResumoEndpoint.next(`${environment.baseEndpoint}/api/v1/escavador/processo-resumo/?page=${page}${filters}`);
    }
    const processos$ = this.http.get<ProcessoRes>(this.ddProcessoResumoEndpoint.value);
    return processos$.pipe(
      map((processo) => {
        const header = processo;
        const results = processo.results.map((processoItem: any) => {
          const seenNames = new Set();
          const envolvidos_filtered = processoItem.envolvidos_processo.filter((envolvido: any) => !seenNames.has(envolvido.nome) && seenNames.add(envolvido.nome))
          const partes = envolvidos_filtered.filter((parte: any) => parte.polo === "PASSIVO" || parte.polo === "ATIVO")
          const urls_map = processoItem.processo_fonte.map((fonte: any) => fonte.url);
          const urls = urls_map.filter((url: any) => url !== null);
          const area_map = processoItem.processo_fonte.map((fonte: any) => fonte.capa_details?.area);
          const area = area_map.filter((area: any) => area);
          const orgao_julgador_map = processoItem.processo_fonte.map((fonte: any) => fonte.capa_details?.orgao_julgador);
          const orgao_julgador = orgao_julgador_map.filter((orgao_julgador: any) => orgao_julgador);
          const segredo_justica_map = processoItem.processo_fonte.map((fonte: any) => fonte.segredo_justica);
          const segredo_justica = segredo_justica_map.filter((segredo_justica: any) => segredo_justica !== (null && undefined))
          const valor_map = processoItem.processo_fonte.map((fonte: any) => fonte.capa_details?.valor_details?.valor_formatado)
          const valor = valor_map.filter((valor: any) => valor);
          return {
            ...processoItem,
            envolvidos: envolvidos_filtered,
            partes, 
            urls,
            valor,
            segredo_justica,
            orgao_julgador,
            area
          }   
        })


        return {
          ...header,
          results
        }
      }),
      tap((processes) => {
        console.log(processes);
        
        this.processesSubject.next(processes)})
    )
  }

  updateLawsuit(index: number, automaticUpdate: boolean, updateInterval: string, monitoringId?: number, numero_cnj?: string){
    const escavadorKeyEndpoint = `${environment.baseEndpoint}/api/v1/parameter/`;
    return this.http.get<EscavadorKeyResponse>(escavadorKeyEndpoint).pipe(
      switchMap((res) => {
        const apiKey = res.results[0].escavador_api_key;
        const escavadorHeader = new HttpHeaders({
          'Authorization': `Bearer ${apiKey}`,
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        });

        let monitoramento$: Observable<any>;
        let del = false;

        if(monitoringId){
          if(automaticUpdate){
            const monitoringBody = {
              frequencia: updateInterval === "DA" ? "DIARIA" : "SEMANAL"
            }
            monitoramento$ = this.http.put(`https://api.escavador.com/api/v1/monitoramentos-tribunal/${monitoringId}`, monitoringBody, { headers: escavadorHeader }).pipe(
              tap({
                next: (monitoramentoRes) => {
                  console.log("Monitoramento Tribunal: ", monitoramentoRes);
                }
              })
            )
            console.log("Update monitoring");
          } else {
            monitoramento$ = this.http.delete(`https://api.escavador.com/api/v1/monitoramentos-tribunal/${monitoringId}`, { headers: escavadorHeader }).pipe(
              tap({
                next: (monitoramentoRes) => {
                  console.log("Monitoramento Tribunal: ", monitoramentoRes);
                }
              })
            )
            console.log("Delete monitoring");
            del = true
            
          }
        } else if(automaticUpdate) {
          const monitoramentoBody = {
            tipo: "UNICO",
            valor: numero_cnj,
            frequencia: updateInterval === "DA" ? "DIARIA" : "SEMANAL"
          }

          monitoramento$ = this.http.post("https://api.escavador.com/api/v1/monitoramentos-tribunal", monitoramentoBody, { headers: escavadorHeader }).pipe(
            tap({
              next: (monitoramentoRes) => {
                console.log("Monitoramento Tribunal: ", monitoramentoRes);
              }
            })
          )

          console.log("Create monitoring");
        } else {
          monitoramento$ = of(null)
        }

        return monitoramento$.pipe(
          switchMap((monitoramentoRes) => {
            const lawsuitData = {
              automatic_update: automaticUpdate,
              update_interval: updateInterval,
              monitoring_id: (monitoramentoRes && !del) ? monitoramentoRes.id : null
            }
            return this.http.patch(this.ddLawsuitEndpoint+`${index}/`, lawsuitData).pipe(
              switchMap(() => this.getProcesses()),
              tap({
                next: (value) => {
                  this.toastService.addToast(200, 'Atualização manual definida');
                },
                error: (err) => {
                  if(err.status === 400) {
                    this.toastService.addToast(err.status, 'Erro ao modificar atualização');
                  } else {
                    this.toastService.addToast(err.status, 'Erro interno de servidor')
                  }
                },
              })
            )
          })
        )
      })
    ).subscribe()
  }

  isEmpty(value: any): boolean {
    if (value === null || value === undefined) {
        return true;
    }

    if (Array.isArray(value)) {
        if (value.length === 0) {
            return true;
        }
        return false;
    }

    if (typeof value === 'object') {
        const keys = Object.keys(value);
        if (keys.length === 0) {
            return true;
        }
        return keys.every(key => this.isEmpty(value[key]));
    }

    return false;
}

  addProcess(cnjNumber: string, autoUpdate: boolean, autoFrequency: string) {
    this.lawsuitSubmit = true;
    const escavadorKeyEndpoint = `${environment.baseEndpoint}/api/v1/parameter/`;
    const escavadorProcessEndpoint = `https://api.escavador.com/api/v2/processos/numero_cnj/${cnjNumber}`;

    this.http.get<EscavadorKeyResponse>(escavadorKeyEndpoint).subscribe({
      next: (res) => {
        const apiKey = res.results[0].escavador_api_key;
        const escavadorProcessHeader = new HttpHeaders({
          'Authorization': `Bearer ${apiKey}`,
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        });

        const response1 = {}
      const response: Processo = this.substituirIdPorIdEscavador(response1);
      // const fonteData = {
      //   ...response.fontes![0],
      //   processo: 164,
      //   status_predito: "A",
      //   capa: 190,
      //   tribunal: 183,
      // };
      // this.http.post(this.ddFonteEndpoint, fonteData).pipe(
      //   tap({
      //     next: fonteValue => console.log("Fonte: ", fonteValue)
      //   }),
      // )
        
        const estadoOrigem$: Observable<any> = !this.isEmpty(response.estado_origem)
        ? this.http.post(this.ddEstadoOrigemEndpoint, response.estado_origem)
        : of(null);
    
      return estadoOrigem$.pipe(
        switchMap(estadoOrigemRes => {
          const processoData = {
            ...response,
            estado_origem: estadoOrigemRes ? estadoOrigemRes.id : null
          };
    
          const processo$: Observable<any> = !this.isEmpty(response)
            ? this.http.post(this.ddProcessoEndpoint, processoData).pipe(
                tap({
                  next: (processoRes) => {
                    
                  },
                  error: (err: HttpErrorResponse) => {

                    this.toastService.addToast(err.status, 'Esse processo já está cadastrado');
                  }
                }),
            )
            : of(null);
            iif
          return processo$.pipe(
            switchMap(processoRes => {
              const monitoramentoBody = {
                tipo: "UNICO",
                valor: response.numero_cnj,
                frequencia: autoFrequency === "DA" ? "DIARIA" : "SEMANAL"
              }

              const monitoramento$: Observable<any> = of(null);
              // autoUpdate
              //   ? this.http.post("https://api.escavador.com/api/v1/monitoramentos-tribunal", monitoramentoBody, { headers: escavadorProcessHeader }).pipe(
              //       tap({
              //         next: (monitoramentoRes) => {
              //           console.log("Monitoramento Tribunal: ", monitoramentoRes);
              //         }
              //       })
              //     )
              //   : of(null);

              return monitoramento$.pipe(
                switchMap((monitoramentoRes) => {
                  const ddLawsuitData = {
                    cnj_number: response.numero_cnj,
                    automatic_update: autoUpdate,
                    update_interval: autoFrequency,
                    created_by: this.cookieService.getCookie('id'),
                    monitoring_id: monitoramentoRes ? monitoramentoRes.id : null
                  }

                  return this.http.post(this.ddLawsuitEndpoint, ddLawsuitData).pipe(
                    tap({next: (value) => {
                      console.log("Processo devdock: ", value);
                    }}),
                    switchMap(() => {
                      return from(response.fontes || []).pipe(
                        concatMap((fonte: any) => {
                          const valor$: Observable<any> = !this.isEmpty(fonte.capa?.valor_causa)
                            ? this.http.post(this.ddValorCausaEndpoint, fonte.capa?.valor_causa).pipe(
                                tap({
                                  next: valorCausaRes => console.log("Valor Causa: ", valorCausaRes)
                                })
                            )
                            : of(null);
            
                          const assunto$: Observable<any> = !this.isEmpty(fonte.capa?.assunto_principal_normalizado)
                            ? this.http.post(this.ddAssuntoNormalizadoEndpoint, fonte.capa!.assunto_principal_normalizado).pipe(
                                tap({
                                  next: assuntoNormalizadoRes => console.log("Assunto principal normalizado: ", assuntoNormalizadoRes)
                                })
                            )
                            : of(null);
            
                          return forkJoin([valor$, assunto$]).pipe(
                            switchMap(([valorCausaRes, assuntoPrincipalNormalizadoRes]) => {
                              const capaData = {
                                ...fonte.capa,
                                valor: valorCausaRes ? valorCausaRes.id : null,
                                assunto_principal_normalizado: assuntoPrincipalNormalizadoRes ? assuntoPrincipalNormalizadoRes.id : null,
                              };
            
                              const capa$: Observable<any> = !this.isEmpty(fonte.capa)
                                ? this.http.post(this.ddCapaEndpoint, capaData).pipe(
                                    tap({
                                      next: capaRes => console.log("Capa: ", capaRes)
                                    })
                                )
                                : of(null);
            
                              const envolvidosObservables = (fonte.envolvidos || []).map((envolvido: any) => {
                                envolvido.tipo_pessoa = envolvido.tipo_pessoa === "FISICA" ? "F" : "J";
                                const envolvidoData = {
                                  ...envolvido,
                                  processo: processoRes.id
                                };
            
                                const advogadosObservables = (envolvido.advogados || []).map((advogado: any) => {
                                  advogado.tipo_pessoa = advogado.tipo_pessoa === "FISICA" ? "F" : "J";
                                  const advogadoData = {
                                    ...advogado,
                                    processo: processoRes ? processoRes.id : null
                                  };
            
                                  return !this.isEmpty(advogado)
                                    ? this.http.post(this.ddEnvolvidoEndpoint, advogadoData).pipe(
                                        tap({
                                          next: advogadoValue => console.log("Advogado: ", advogadoValue)
                                        })
                                      )
                                    : of(null);
                                });
            
                                const advogadosForkJoin$ = advogadosObservables.length > 0
                                  ? forkJoin(advogadosObservables)
                                  : of([]);
            
                                return advogadosForkJoin$.pipe(
                                  concatMap(() =>
                                    !this.isEmpty(envolvido)
                                    ? this.http.post(this.ddEnvolvidoEndpoint, envolvidoData).pipe(
                                        tap({
                                          next: envolvidoValue => console.log("Envolvido: ", envolvidoValue)
                                        })
                                      )
                                    : of(null)
                                  )
                                );
                              });
            
                              const envolvidosForkJoin$ = envolvidosObservables.length > 0
                                ? forkJoin(envolvidosObservables)
                                : of([]);
            
                              const tribunal$: Observable<any> = this.http.get<any>(`${environment.baseEndpoint}/api/v1/escavador/tribunal/` ).pipe(
                                map(value => {
                                  console.log("TribunalGet: ", value);
            
                                  const tribunalFiltrado = value.results.filter((tribunal: any) => tribunal.id_escavador === fonte.tribunal.id_escavador);
                                  return tribunalFiltrado[0] || null;
                                }),
                                catchError(() => of(null)),
                                concatMap(tribunalRes => tribunalRes
                                  ? of(tribunalRes)
                                  : this.http.post(this.ddTribunalEndpoint, fonte.tribunal).pipe(
                                      tap({
                                        next: tribunalPostRes => console.log("Tribunal POST: ", tribunalPostRes)
                                      })
                                    )
                                ),
                                tap({
                                  next: tribunalRes => console.log("Tribunal: ", tribunalRes)
                                })
                              );
            
                              return forkJoin([tribunal$, capa$, envolvidosForkJoin$]).pipe(
                                switchMap(([tribunalRes, capaRes]) => {
                                  const fonteData = {
                                    ...fonte,
                                    processo: processoRes.id,
                                    status_predito: "A",
                                    capa: capaRes ? capaRes.id : null,
                                    tribunal: tribunalRes ? tribunalRes.id : null,
                                  };
                                  
                                  return !this.isEmpty(fonte)
                                    ? this.http.post(this.ddFonteEndpoint, fonteData).pipe(
                                        tap({
                                          next: fonteValue => console.log("Fonte: ", fonteValue)
                                        }),
                                      )
                                    : of(null);
                                })
                              );
                            })
                          );
                        }),
                        toArray()
                      ).pipe(
                        switchMap(() => {
                          return of(null)
                          // this.http.get(`https://api.escavador.com/api/v2/processos/numero_cnj/${cnjNumber}/movimentacoes`, { headers: escavadorProcessHeader }).pipe(
                          //   map(responseMovimentacoes => this.substituirIdPorIdEscavador(responseMovimentacoes)),
                          //   switchMap(responseSubstituido => {
                          //     const activitiesObservables = (responseSubstituido.items || []).map((item: any) => {
                          //         console.log("Movimentação: ", item);                             
                          //         const activityData = {
                          //           processo: processoRes.id,
                          //           id_escavador: item.id_escavador,
                          //           data: item.data,
                          //           tipo: item.tipo,
                          //           conteudo: item.conteudo,
                          //           fonte_id: item.fonte.fonte_id,
                          //           fonte_nome: item.fonte.nome,
                          //           fonte_tipo: item.fonte.tipo,
                          //           fonte_sigla: item.fonte.sigla,
                          //           fonte_grau: item.fonte.grau,
                          //           fonte_grau_formatado: item.fonte.grau_formatado
                          //       };
                
                          //         return !this.isEmpty(item)
                          //             ? this.http.post(`${environment.baseEndpoint}/api/v1/escavador/movimentacao/`, activityData).pipe(
                          //                 tap({
                          //                     next: activityValue => console.log("Movimentação: ", activityValue),
                          //                     error: activityValue => console.error('Erro: ', activityValue)
                          //                 })
                          //             )
                          //             : of(null);
                          //     });
                          //     const activitiesForkJoin$ = activitiesObservables.length > 0
                          //         ? forkJoin(activitiesObservables)
                          //         : of([]);

                          //     return activitiesForkJoin$;
                          // })
                          // )
                        })
                      );
                    })
                  )
                }),
              )
            }),
            catchError(err => {
              console.error("Erro: ", err)
              return of(null)
            }),
            switchMap(() => this.getProcesses()),
            finalize(() => {
              this.lawsuitSubmit = false;
            }),
          );
        })
      ).subscribe({
        next: (processoRes) => {
          if(!this.isEmpty(processoRes)){
            this.toastService.addToast(200, 'Processo cadastrado!');
          }
          console.log('processoRes:', processoRes);
        },
        error: (err) => {
          console.error('Erro:', err);
        }
      }); 

        this.http.get(escavadorProcessEndpoint, { headers: escavadorProcessHeader }).subscribe({
          next: (res) => {
            console.log(res);
          },
        })
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  substituirIdPorIdEscavador(obj: any) {
    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        obj[index] = this.substituirIdPorIdEscavador(item);
      });
    } else if (typeof obj === 'object' && obj !== null) {
      Object.keys(obj).forEach(key => {
        if (key === 'id') {
          obj['id_escavador'] = obj[key];
          delete obj[key]; 
        } else {
          obj[key] = this.substituirIdPorIdEscavador(obj[key]);
        }
      });
    }
    return obj;
  }
}