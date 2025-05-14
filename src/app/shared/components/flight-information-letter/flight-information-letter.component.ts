import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlightResponse } from '@sharedModule/models/flight-response';
import { InformationTariffFly } from '@sharedModule/models/informationTariffFly';
import { PassengersRegisterService } from '@sharedModule/service/passengersRegister.service';


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

  constructor(private passengerRegisterService:PassengersRegisterService, private router:Router){}

  // Control de visibilidad del listado de tarifas
  showFareTypes = false;


  // Alterna la visibilidad del listado
  toggleFareTypes(): void {
    this.showFareTypes = !this.showFareTypes;
  }

  registrarPassenger(codigoVuelo:string, codigoTarifa:string, valorTarifa:string){

    const informacion:InformationTariffFly = {
      codigoVuelo: codigoVuelo,
      codigoTarifaSeleccionado: codigoTarifa,
      valorTarifaSeleccionado: Number(valorTarifa)
    }
    this.passengerRegisterService.setInformation(informacion)
    this.router.navigate(['/passengers-register'], {replaceUrl: true})

  }

}
