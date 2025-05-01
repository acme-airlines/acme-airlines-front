import { Component, Input, OnInit } from '@angular/core';
import { FlightResponse } from '@sharedModule/models/flight-response';


interface FareType {
  code: string;
  label: string;
  price: number;    
  benefits: string[];
}

@Component({
  selector: 'acme-airlines-flight-information-letter',
  templateUrl: './flight-information-letter.component.html',
  styleUrls: ['./flight-information-letter.component.scss'],
})
export class FlightInformationLetterComponent   {
  @Input() data!: FlightResponse;

  // Control de visibilidad del listado de tarifas
  showFareTypes = false;

  // Definición de los tipos de tarifa y sus beneficios
  fareTypes: FareType[] = [
    {
      code: 'economica',
      label: 'Económica',
      price: 59,        // <-- precio
      benefits: [
        'Asiento estándar',
        'Equipaje de mano permitido',
        'Cancelación con cargo',
      ],
    },
    {
      code: 'semi-economica',
      label: 'Semi-económica',
      price: 69,
      benefits: [
        'Espacio extra para piernas',
        'Equipaje de mano + 1 documentado',
        'Cambio con recargo moderado',
      ],
    },
    {
      code: 'premium',
      label: 'Premium',
      price: 89,
      benefits: [
        'Asiento premium reclinable',
        '2 equipajes documentados gratis',
        'Cambio/cancelación sin cargo',
        'Acceso a salón VIP',
      ],
    },
  ];


  // Alterna la visibilidad del listado
  toggleFareTypes(): void {
    this.showFareTypes = !this.showFareTypes;
  }
}
