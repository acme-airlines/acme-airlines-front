import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { City } from '@sharedModule/models/city';
import { CityService } from '@sharedModule/service/city.service';
import { FlightsService } from '@sharedModule/service/flights.service';
import { Flight } from '@sharedModule/models/flight';
import { FlightFilterRequest } from '@sharedModule/models/flight-filter-request';
import { FlightResponse } from '@sharedModule/models/flight-response';
import { FeeService } from '@sharedModule/service/fee.service';
import { of } from 'rxjs';
import { FeesFlight } from '@sharedModule/models/feesFlight';
import { AuthService } from '@sharedModule/service/auth.service';
import { TokenResponse } from '@sharedModule/models/token-response';
import { NgxSpinnerService } from 'ngx-spinner';

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
  flightDetail: FlightResponse[] = [];

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
    private flightsService: FlightsService,
    private feeService:FeeService,
    private authService:AuthService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.iniciarSesion()
    this.initForm();

  }

  private iniciarSesion(): void {
    this.spinner.show();
     // Consume el endpoint de client-oauth que se encarga de autenticar y generar el token
        this.authService.login({username:'1qwe.doe@example.com', password: '12345'}).subscribe({
          next: (response: TokenResponse) => {
            console.log('Autenticación exitosa', response);
            // Almacena el token (por ejemplo, en localStorage)
            localStorage.setItem('access_token', response.accessToken);
            this.spinner.hide();
            this.loadCities();
          },
          error: (err) => {
            this.spinner.hide();
            console.error('Error de autenticación', err);
          },
        });
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
    this.spinner.show()
    this.cityService.allCitys().subscribe((cities: City[]) => {
      this.cities = cities;
      this.filteredOriginCities = cities;
      this.filteredDestinationCities = cities;
      this.spinner.hide();
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
      this.spinner.show();
      const formValue = this.flightSearchForm.value;

      const requestPayload: FlightFilterRequest = {
        origin: formValue.origin,
        destination: formValue.destination,
        startDate: formValue.departureDate,
        endDate: this.tripType === 'idaYvuelta' ? formValue.returnDate : null
      };

      this.flightsService.getAvailableFlights(requestPayload).subscribe({
        next: (flightsApi: FlightResponse[]) => {
          this.flightDetail = flightsApi;
          this.searchClicked = true;
          this.spinner.hide();
        },
        complete: (() => {
          for(const flight of this.flightDetail){
            this.feeService.getFeesForFlight(flight.codigoVuelo!).subscribe({
              next: (feesInformation:FeesFlight) => {
                flight.fees = feesInformation.fees;
              }
            })
          }
        }),
        error: () => {    // ← en caso de error también detenemos spinner
                  this.spinner.hide();
        }
      })
    } else {
      this.flightSearchForm.markAllAsTouched();
    }
  }
}
