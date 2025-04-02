export class Flight{
    codeFlight?: string;
    flightDate?: string; // formato ISO: 'YYYY-MM-DD'
    flightStartTime?: string; // formato ISO: 'HH:mm:ss'
    flightEndTime?: string;   // formato ISO: 'HH:mm:ss'
    origin?: string;
    destination?: string;
}