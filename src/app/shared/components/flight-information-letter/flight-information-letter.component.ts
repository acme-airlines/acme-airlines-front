import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'acme-airlines-flight-information-letter',
  templateUrl: './flight-information-letter.component.html',
  styleUrls: ['./flight-information-letter.component.scss'],
})
export class FlightInformationLetterComponent   {
    // Objeto con los datos del vuelo
    @Input() data: any;

    // Mapeo de campos para la nueva data
    @Input() codeFlightField: string = 'codeFlight';
    @Input() flightDateField: string = 'flightDate';
    @Input() flightStartTimeField: string = 'flightStartTime';
    @Input() flightEndTimeField: string = 'flightEndTime';
    @Input() originField: string = 'origin';
    @Input() destinationField: string = 'destination';
}
