import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { BookingRequest } from '@sharedModule/models/booking-request';

@Injectable({
  providedIn: 'root',
})
export class PassengerService {
  constructor(private http: HttpClient) {}

  createPassager(bookinRequest: BookingRequest): Observable<Record<string, string>> {
    return this.http.post<Record<string, string>>(`${environment.api.postCreatePassenger}`, bookinRequest);
  }
}
