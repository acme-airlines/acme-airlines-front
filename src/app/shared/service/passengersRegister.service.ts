// src/app/sharedModule/service/passengersRegister.service.ts
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { InformationTariffFly } from "@sharedModule/models/informationTariffFly";
import { MainPassenger } from "@sharedModule/models/main-passenger";
import { AdditionalPassenger } from "@sharedModule/models/additional-passenger";
import { ServiceExtraFlightResponseDto } from "@sharedModule/models/serviceExtraFlightResponseDto";

@Injectable({
  providedIn: 'root'
})
export class PassengersRegisterService {
  // 1) Tarifas / Información de vuelo
  private _infoSubject = new BehaviorSubject<InformationTariffFly>(new InformationTariffFly());
  public info$: Observable<InformationTariffFly> = this._infoSubject.asObservable();

  // 2) Pasajero principal
  private _mainPassengerSubject = new BehaviorSubject<MainPassenger | null>(null);
  public mainPassenger$ = this._mainPassengerSubject.asObservable();

  // 3) Acompañante (opcionales)
  private _companionSubject = new BehaviorSubject<MainPassenger | null>(null);
  public companion$ = this._companionSubject.asObservable();

  // 4) Pasajeros adicionales
  private _additionalPassengersSubject = new BehaviorSubject<AdditionalPassenger[]>([]);
  public additionalPassengers$ = this._additionalPassengersSubject.asObservable();

  // 5) Mapa de servicios extra por pasajero (key: rol, value: lista de servicios con selectedCount)
  private _servicesByPassengerSubject = new BehaviorSubject<{
    [key: string]: ServiceExtraFlightResponseDto[];
  }>({});
  public servicesByPassenger$ = this._servicesByPassengerSubject.asObservable();

  private _selectedSeatsSubject = new BehaviorSubject<string[]>([]);
  public selectedSeats$ = this._selectedSeatsSubject.asObservable();

  private _assignedSeatsSubject = new BehaviorSubject<{ [key: string]: string | null }>({});
  public assignedSeats$: Observable<{ [key: string]: string | null }> = this._assignedSeatsSubject.asObservable();

  constructor() {}

  /** Actualiza solo el objeto InformationTariffFly */
  setInformation(info: InformationTariffFly): void {
    this._infoSubject.next(info);
  }
  getCurrentInformation(): InformationTariffFly {
    return this._infoSubject.getValue();
  }

  /** Pasajero Principal */
  setMainPassenger(mp: MainPassenger): void {
    this._mainPassengerSubject.next(mp);
  }
  getMainPassenger(): MainPassenger | null {
    return this._mainPassengerSubject.getValue();
  }

  /** Acompañante (si aplica) */
  setCompanion(c: MainPassenger | null): void {
    this._companionSubject.next(c);
  }
  getCompanion(): MainPassenger | null {
    return this._companionSubject.getValue();
  }

  /** Pasajeros Adicionales */
  setAdditionalPassengers(list: AdditionalPassenger[]): void {
    this._additionalPassengersSubject.next(list);
  }
  getAdditionalPassengers(): AdditionalPassenger[] {
    return this._additionalPassengersSubject.getValue();
  }

  /** Servicios Extra por pasajero */
  setServicesByPassenger(map: { [key: string]: ServiceExtraFlightResponseDto[] }): void {
    this._servicesByPassengerSubject.next(map);
  }
  getServicesByPassenger(): { [key: string]: ServiceExtraFlightResponseDto[] } {
    return this._servicesByPassengerSubject.getValue();
  }

  getTotalAmount(): number {
    const info = this.getCurrentInformation();
    const baseFare = info.valorTarifaSeleccionado ?? 0;

    const extras = Object.values(this.getServicesByPassenger()).reduce(
      (acc, services) =>
        acc +
        services.reduce(
          (sum, s) => sum + (s.value ?? 0) * (s.quantity ?? 0),
          0
        ),
      0
    );

    return baseFare + extras;
  }

  setSelectedSeats(ids: string[]): void {
    this._selectedSeatsSubject.next(ids);
  }
  getSelectedSeats(): string[] {
    return this._selectedSeatsSubject.getValue();
  }

  initAssignedSeats(passengerKeys: string[]): void {
    const initialMap: { [key: string]: string | null } = {};
    passengerKeys.forEach(key => initialMap[key] = null);
    this._assignedSeatsSubject.next(initialMap);
  }

  /** Asigna un asiento a un pasajero, sobreescribiendo cualquier anterior */
  setAssignedSeat(passengerKey: string, seatId: string | null): void {
    const current = this._assignedSeatsSubject.getValue();
    // quitar ese seatId de otros pasajeros, si estaba asignado
    Object.keys(current).forEach(k => {
      if (current[k] === seatId) {
        current[k] = null;
      }
    });
    current[passengerKey] = seatId;
    this._assignedSeatsSubject.next({ ...current });
  }
  getAssignedSeats(): { [key: string]: string | null } {
    return this._assignedSeatsSubject.getValue();
  }

}
