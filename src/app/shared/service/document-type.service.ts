import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { DocumentType } from '@sharedModule/models/document-type';

@Injectable({
  providedIn: 'root',
})
export class DocumentTypeService {
  // URL del endpoint expuesto en client-oauth
  constructor(private http: HttpClient) {}

  /**
   * Envía las credenciales al endpoint de client-oauth para obtener el token.
   * Se espera que el endpoint reciba un objeto JSON con "correo" y "password".
   */
  allDocumentType(): Observable<DocumentType[]> {
    return this.http.get<DocumentType[]>(`${environment.api.getAllDocumentType}`);
  }
}
