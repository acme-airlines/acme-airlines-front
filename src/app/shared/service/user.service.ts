import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenResponse } from '../models/token-response';
import { environment } from '@env/environment';
import { CreatePassenger } from '@sharedModule/models/create-passenger';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  createUser(passengerInfo: CreatePassenger): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${environment.api.postCreatePassenger}`, passengerInfo);
  }
}
