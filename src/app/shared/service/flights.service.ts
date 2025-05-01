import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenResponse } from '../models/token-response';
import { environment } from '@env/environment';
import { FlightFilterRequest } from '@sharedModule/models/flight-filter-request';
import { Flight } from '@sharedModule/models/flight';
import { FlightResponse } from '@sharedModule/models/flight-response';

@Injectable({
  providedIn: 'root',
})
export class FlightsService {
  // URL del endpoint expuesto en client-oauth
  constructor(private http: HttpClient) {}

  /**
   * Envía las credenciales al endpoint de client-oauth para obtener el token.
   * Se espera que el endpoint reciba un objeto JSON con "correo" y "password".
   */
  getAvailableFlights(credentials:FlightFilterRequest): Observable<FlightResponse[]> {
    return this.http.post<FlightResponse[]>(`${environment.api.getAvailableFlights}`, credentials);
  }
}
