import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { ServicePassengerRequest } from '@sharedModule/models/service-passenger-request';

@Injectable({
  providedIn: 'root',
})
export class ServicePassengerService {
  constructor(private http: HttpClient) {}

  createServicePassenger(request: ServicePassengerRequest): Observable<Boolean> {
    return this.http.post<Boolean>(`${environment.api.postCreateServicePassenger}`, request);
  }
}
