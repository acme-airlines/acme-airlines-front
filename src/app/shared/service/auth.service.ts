import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenResponse } from '../models/token-response';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // URL del endpoint expuesto en client-oauth
  constructor(private http: HttpClient) {}

  /**
   * Envía las credenciales al endpoint de client-oauth para obtener el token.
   * Se espera que el endpoint reciba un objeto JSON con "correo" y "password".
   */
  login(credentials: { correo: string; password: string }): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${environment.api.postPublicAuthLogin}`, credentials);
  }
}
