import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenResponse } from '../models/token-response';
import { environment } from '@env/environment';
import { CreatePassenger } from '@sharedModule/models/create-passenger';
import { ServiceExtraFlightResponseDto } from '@sharedModule/models/serviceExtraFlightResponseDto';

@Injectable({
  providedIn: 'root',
})
export class ServiceFeeService {
  constructor(private http: HttpClient) {}

  getAllServiceExtra(codeFlight: string): Observable<ServiceExtraFlightResponseDto[]> {
    const params = new HttpParams().set('flightCode', codeFlight);
    return this.http.get<ServiceExtraFlightResponseDto[]>(`${environment.api.getServiceFeeAll}`, {params});
  }
}
