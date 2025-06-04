import { Flight } from "./flight";
import { Seat } from "./seat";

export class SeatFlight{
    codeSeatFlight?: string;  // ID único del asiento‐vuelo
    codeFlightFk?: Flight;      // Código de vuelo
    codeSeatFk?: Seat;        // Código de asiento (por ejemplo "1A", "1B")
    status?: string; // Estado actual
}
