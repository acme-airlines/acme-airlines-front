import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { City } from '@sharedModule/models/city';
import { CityService } from '@sharedModule/service/city.service';
import { FlightsService } from '@sharedModule/service/flights.service';
import { Flight } from '@sharedModule/models/flight';
import { FlightFilterRequest } from '@sharedModule/models/flight-filter-request';

@Component({
  selector: 'acme-airlines-flights',
  templateUrl: './flights.component.html',
  styleUrls: ['./flights.component.scss'],
})
export class FlightsComponent implements OnInit {

  // Formulario reactivo para la búsqueda de vuelos
  flightSearchForm!: FormGroup;

  // Arrays con todas las ciudades obtenidas del servicio y sus filtrados
  cities: City[] = [];
  filteredOriginCities: City[] = [];
  filteredDestinationCities: City[] = [];

  // Lista de vuelos para mostrar en la publicidad
  flightDetail: Flight[] = [];

// Vuelos quemados para publicidad (componente advertising-letter)
flights = [
  {
    imageUrl: 'https://picsum.photos/id/1018/400/200',
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

  // Valor por defecto para el tipo de viaje
  tripType: string = 'idaYvuelta';

  // Bandera para cambiar la vista cuando se presione "Buscar"
  searchClicked: boolean = false;


  constructor(
    private fb: FormBuilder,
    private cityService: CityService,
    private flightsService: FlightsService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCities();
  }

  private initForm(): void {
    this.flightSearchForm = this.fb.group({
      origin: ['', Validators.required],
      destination: ['', Validators.required],
      departureDate: ['', Validators.required],
      returnDate: ['']
    });
    this.updateReturnDateValidator();
  }

  onTripTypeChange(type: string): void {
    this.tripType = type;
    this.updateReturnDateValidator();
  }

  private updateReturnDateValidator(): void {
    const returnDateControl = this.flightSearchForm.get('returnDate');
    if (this.requiresReturnDate()) {
      returnDateControl?.setValidators(Validators.required);
    } else {
      returnDateControl?.clearValidators();
      returnDateControl?.setValue('');
    }
    returnDateControl?.updateValueAndValidity();
  }

  requiresReturnDate(): boolean {
    return this.tripType === 'idaYvuelta' || this.tripType === 'multiDestino';
  }

  private loadCities(): void {
    this.cityService.allCitys().subscribe((cities: City[]) => {
      this.cities = cities;
      this.filteredOriginCities = cities;
      this.filteredDestinationCities = cities;
    });

    this.flightSearchForm.get('origin')?.valueChanges.subscribe((value: string) => {
      this.filterOriginCities(value);
    });

    this.flightSearchForm.get('destination')?.valueChanges.subscribe((value: string) => {
      this.filterDestinationCities(value);
    });
  }

  private filterOriginCities(value: string): void {
    if (!value) {
      this.filteredOriginCities = this.cities;
      return;
    }
    const filterValue = value.toLowerCase();
    this.filteredOriginCities = this.cities.filter(city =>
      city.nameCity?.toLowerCase().includes(filterValue)
    );
  }

  private filterDestinationCities(value: string): void {
    if (!value) {
      this.filteredDestinationCities = this.cities;
      return;
    }
    const filterValue = value.toLowerCase();
    this.filteredDestinationCities = this.cities.filter(city =>
      city.nameCity?.toLowerCase().includes(filterValue)
    );
  }

  search(): void {
    if (this.flightSearchForm.valid) {
      const formValue = this.flightSearchForm.value;

      const requestPayload: FlightFilterRequest = {
        origin: formValue.origin,
        destination: formValue.destination,
        startDate: formValue.departureDate,
        endDate: this.tripType === 'idaYvuelta' ? formValue.returnDate : null
      };

      this.flightsService.getAvailableFlights(requestPayload).subscribe({
        next: (flightsApi: Flight[]) => {
          this.flightDetail = flightsApi;
          this.searchClicked = true;
        }
      })
    } else {
      this.flightSearchForm.markAllAsTouched();
    }
  }
}
