// src/app/services/seat.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { SeatFlight } from '@sharedModule/models/seat-flight';
// (define esta interfaz igual que tu DTO de respuesta en Spring)

// DTO que enviaremos al backend:
export interface SeatBookingRequestDto {
  codeFlight: string;
  codeSeatFlight: string;
  codePassenger: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeatService {

  constructor(private http: HttpClient) { }

  /** 1) Obtiene todos los asientos (y su estado) para un vuelo dado */
  getSeatsByFlight(flightCode: string): Observable<SeatFlight[]> {
    return this.http.get<SeatFlight[]>(`${environment.api.getSeatsByFlight}/${flightCode}`);
  }

  /**
   * 2) Envía al backend la lista de asientos que el usuario desea reservar.
   *    Este payload debe coincidir con List<SeatBookingRequestDto> en Spring.
   */
  bookSeats(requests: SeatBookingRequestDto[]): Observable<Response> {
    return this.http.post<Response>(`${environment.api.bookSeats}`, requests);
  }

}
