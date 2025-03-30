import { Component } from '@angular/core';

@Component({
  selector: 'acme-airlines-flights',
  templateUrl: './flights.component.html',
  styleUrls: ['./flights.component.scss'],
})
export class FlightsComponent  {

  // Objeto para la carta detallada (puedes usarlo si lo necesitas en otra parte)
  flight = {
    recommended: true,
    mostEconomical: false,
    departureTime: '5:54 p.m.',
    departureAirport: 'AXM',
    duration: '3h 16 min',
    arrivalTime: '9:30 p.m.',
    arrivalAirport: 'CTG',
    stops: '1 parada',
    operatedBy: 'LATAM Airlines Colombia',
    price: 312910,
    currency: 'COP'
  };

  // Lista de vuelos para mostrar en la publicidad
  flights = [
    {
      imageUrl: 'https://picsum.photos/id/1018/400/200', // Ejemplo de imagen
      city: 'Bucaramanga',
      date: '20/05/25',
      recommended: true,
      connection: 'Vuelo con conexión',
      seatClass: 'Economy',
      miles: 'Acumula millas',
      price: 277660,
      currency: 'COP'
    },
    {
      imageUrl: 'https://picsum.photos/id/1022/400/200',
      city: 'Cúcuta',
      date: '23/04/25',
      recommended: true,
      connection: 'Vuelo con conexión',
      seatClass: 'Economy',
      miles: 'Acumula millas',
      price: 241960,
      currency: 'COP'
    },
    {
      imageUrl: 'https://picsum.photos/id/1027/400/200',
      city: 'Barranquilla',
      date: '20/05/25',
      recommended: true,
      connection: 'Vuelo con conexión',
      seatClass: 'Economy',
      miles: 'Acumula millas',
      price: 325250,
      currency: 'COP'
    }
  ];

  // Valores por defecto del formulario de búsqueda
  tripType: string = 'idaYvuelta';
  origin: string = '';
  destination: string = '';
  passengers: number = 1;
  departureDate: string = '';
  returnDate: string = '';

  // Bandera que indica si se ha presionado "Buscar"
  searchClicked: boolean = false;
  
  onTripTypeChange(type: string) {
    this.tripType = type;
  }
  
  search() {
    console.log("Tipo de viaje:", this.tripType);
    console.log("Origen:", this.origin);
    console.log("Destino:", this.destination);
    console.log("Pasajeros:", this.passengers);
    console.log("Fecha de Ida:", this.departureDate);
    console.log("Fecha de Vuelta:", this.returnDate);
    // Aquí podrías agregar lógica de filtrado o llamar a un servicio.
    // Una vez listo, activamos la bandera para cambiar la vista.
    this.searchClicked = true;
  }
}
