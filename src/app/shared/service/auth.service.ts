import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenResponse } from '../models/token-response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // URL del endpoint expuesto en client-oauth
  private readonly LOGIN_URL = 'http://127.0.0.1:8080/auth/login';

  constructor(private http: HttpClient) {}

  /**
   * Envía las credenciales al endpoint de client-oauth para obtener el token.
   * Se espera que el endpoint reciba un objeto JSON con "correo" y "password".
   */
  login(credentials: { correo: string; password: string }): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(this.LOGIN_URL, credentials);
  }
}
