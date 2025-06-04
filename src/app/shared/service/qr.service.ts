// src/app/services/qr.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { Qr } from '@sharedModule/models/qr';

@Injectable({
  providedIn: 'root'
})
export class QrService {

  constructor(private http: HttpClient) { }

  /**
   * Llama al endpoint GET /api/qr/create?userCode=...&flightCode=...
   * para que el backend genere y guarde el QR. El backend devuelve
   * el codigoQr (un UUID) en texto plano.
   */
  generateQr(userCode: string, flightCode: string): Observable<Qr> {
      const params = new HttpParams()
      .set('userCode', userCode)
      .set('flightCode', flightCode);

    return this.http.get<Qr>(environment.api.getCreateQr, {
      params
    });
  }

}
