import { Injectable } from "@angular/core";
import { InformationTariffFly } from "@sharedModule/models/informationTariffFly";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
  })
export class PassengersRegisterService{
  // Inicializamos con un objeto vacío o con valores por defecto
  private _infoSubject = new BehaviorSubject<InformationTariffFly>(new InformationTariffFly());
  public info$: Observable<InformationTariffFly> = this._infoSubject.asObservable();

  constructor() {}

  /** Actualiza todo el objeto */
  setInformation(info: InformationTariffFly): void {
    this._infoSubject.next(info);
  }

  /** Obtiene el último valor sincronously */
  getCurrentInformation(): InformationTariffFly {
    return this._infoSubject.getValue();
  }

  /** Actualiza solo el código de vuelo */
  updateCodigoVuelo(codigo: string): void {
    const current = this.getCurrentInformation();
    this._infoSubject.next({ ...current, codigoVuelo: codigo });
  }

  /** Actualiza solo el código de tarifa seleccionado */
  updateCodigoTarifa(codigo: string): void {
    const current = this.getCurrentInformation();
    this._infoSubject.next({ ...current, codigoTarifaSeleccionado: codigo });
  }
}