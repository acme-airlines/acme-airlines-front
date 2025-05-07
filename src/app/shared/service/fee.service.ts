import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { FeesFlight } from '@sharedModule/models/feesFlight';

@Injectable({
  providedIn: 'root',
})
export class FeeService {
  // URL del endpoint expuesto en client-oauth
  constructor(private http: HttpClient) {}

  /**
   * Envía las credenciales al endpoint de client-oauth para obtener el token.
   * Se espera que el endpoint reciba un objeto JSON con "correo" y "password".
   */
  getFeesForFlight(flightCode:string): Observable<FeesFlight> {
    const params = new HttpParams().set('flightCode', flightCode);
    return this.http.get<FeesFlight>(`${environment.api.getFeeAvailbleByFlight}`, {params});
  }
}
