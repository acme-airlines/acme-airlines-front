import { FeesService } from "./feesService";

export class FlightResponse {
  /** Mapa de destinos, clave-valor */
  destination?: Record<string, string>;

  /** Hora de inicio del vuelo en formato string */
  startTime?: string;

  /** Hora de fin del vuelo en formato string */
  endTime?: string;

  /** Valor del vuelo (precio, tarifa, etc.) */
  valueFlight?: string;

  codigoVuelo?:string

  fees?: FeesService[]

}