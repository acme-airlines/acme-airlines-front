import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { DocumentType } from '@sharedModule/models/document-type';
import { City } from '@sharedModule/models/city';

@Injectable({
  providedIn: 'root',
})
export class CityService {
  // URL del endpoint expuesto en client-oauth
  constructor(private http: HttpClient) {}

  /**
   * Envía las credenciales al endpoint de client-oauth para obtener el token.
   * Se espera que el endpoint reciba un objeto JSON con "correo" y "password".
   */
  allCitys(): Observable<City[]> {
    return this.http.get<City[]>(`${environment.api.getAllCities}`);
  }
}
