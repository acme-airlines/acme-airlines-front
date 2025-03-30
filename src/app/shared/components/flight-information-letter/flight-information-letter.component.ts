import { Component, Input } from '@angular/core';

@Component({
  selector: 'acme-airlines-flight-information-letter',
  templateUrl: './flight-information-letter.component.html',
  styleUrls: ['./flight-information-letter.component.scss'],
})
export class FlightInformationLetterComponent  {
    // Objeto genérico con los datos a mostrar
    @Input() data: any;

    // Mapeo de campos: indica el nombre del atributo donde se encuentra cada dato
    @Input() recommendedField?: string;      // Ej: 'recommended'
    @Input() mostEconomicalField?: string;     // Ej: 'mostEconomical'
    @Input() departureTimeField!: string;      // Ej: 'departureTime'
    @Input() departureAirportField!: string;   // Ej: 'departureAirport'
    @Input() durationField!: string;           // Ej: 'duration'
    @Input() arrivalTimeField!: string;        // Ej: 'arrivalTime'
    @Input() arrivalAirportField!: string;     // Ej: 'arrivalAirport'
    @Input() stopsField!: string;              // Ej: 'stops'
    @Input() operatedByField!: string;         // Ej: 'operatedBy'
    @Input() priceField!: string;              // Ej: 'price'
    @Input() currencyField!: string;           // Ej: 'currency'

}
