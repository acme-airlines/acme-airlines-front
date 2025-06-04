import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { ServicePassengerRequest } from '@sharedModule/models/service-passenger-request';
import { Response } from '@sharedModule/models/response';

@Injectable({
  providedIn: 'root',
})
export class ServicePassengerService {
  constructor(private http: HttpClient) {}

  createServicePassenger(request: ServicePassengerRequest): Observable<Response> {
    return this.http.post<Response>(`${environment.api.postCreateServicePassenger}`, request);
  }
}
