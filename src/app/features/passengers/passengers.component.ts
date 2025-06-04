import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PassengersRegisterService } from '@sharedModule/service/passengersRegister.service';
import { InformationTariffFly } from '@sharedModule/models/informationTariffFly';
import { NgxSpinnerService } from 'ngx-spinner';
import { DocumentTypeService } from '@sharedModule/service/document-type.service';
import { finalize, tap } from 'rxjs';
import { DocumentType } from '@sharedModule/models/document-type';
import { ServiceExtraFlightResponseDto } from '@sharedModule/models/serviceExtraFlightResponseDto';
import { ServiceFeeService } from '@sharedModule/service/serviceFee.service';
import { BookingRequest } from '@sharedModule/models/booking-request';
import { MainPassenger } from '@sharedModule/models/main-passenger';
import { AdditionalPassenger } from '@sharedModule/models/additional-passenger';
import { ServicesExt } from '@sharedModule/models/services-ext';
import { PassengerService } from '@sharedModule/service/passenger.service';
import { ServicePassengerService } from '@sharedModule/service/service-passenger.service';
import { ServicePassengerRequest } from '@sharedModule/models/service-passenger-request';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

interface Passenger {
  rol: string;
  firstName: string;
  lastName: string;
  document: string;
  documentType: string;
  age: number;
  birthDate: string; // ← nuevo
  gender: string;
  email: string;
  relationShip?: string;
  specialCondition: boolean;
}

@Component({
  selector: 'acme-airlines-passengers',
  templateUrl: './passengers.component.html',
  styleUrls: ['./passengers.component.scss'],
})
export class PassengersComponent implements OnInit {

  public minBirthDate = '1900-01-01';
  public maxBirthDate = new Date().toISOString().split('T')[0]; // hoy en formato YYYY-MM-DD

  // Lista de tipos de documento para selects
  documentTypes: DocumentType[] = []; // Propiedad para el listado

  // Información de tarifa (from Behavior service)
  info?: InformationTariffFly;

  // Control de pestañas
  activeTab: 'principal' | 'adicionales' = 'principal';

  // Formularios reactivos
  principalForm: FormGroup;
  additionalForm: FormGroup;
  companionForm: FormGroup;

  // Datos guardados
  mainPassenger?: Passenger;
  companionData?: Passenger; // datos del acompañante
  additionalPassengers: Passenger[] = [];

  // Servicios dual-box
  availableServices: ServiceExtraFlightResponseDto[] = [];
  emergencyContactForm: FormGroup; // ← Nuevo

  // --------------------------------------------------
  // ↓ NUEVAS PROPIEDADES ↓
  // --------------------------------------------------
  // Clave del pasajero actualmente seleccionado
  selectedPassengerKey: string | null = null;

  // Lista original de servicios (plantilla)
  baseServices: ServiceExtraFlightResponseDto[] = [];

  // Map de servicios por pasajero
  servicesByPassenger: {
    [key: string]: {
      available: ServiceExtraFlightResponseDto[];
      selected: ServiceExtraFlightResponseDto[];
    };
  } = {};

  // Para generar IDs únicas de adicionales
  nextAdditionalId = 0;

  constructor(
    private fb: FormBuilder,
    private documentTypeService: DocumentTypeService,
    private passengersRegister: PassengersRegisterService,
    private spinner: NgxSpinnerService,
    private serviceFee: ServiceFeeService,
    private passengerService: PassengerService,
    private servicePassenger: ServicePassengerService,
    private router:Router,
    private location: Location
  ) {
    // inicializa principalForm con validación de edad y tipoDocumento
    this.principalForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      document: ['', [Validators.required, Validators.maxLength(10)]],     // ← añadido maxLength
      documentType: ['', Validators.required],
      birthDate: ['', Validators.required],
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });

    // inicializa additionalForm con tipoDocumento
    this.additionalForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      document: ['', [Validators.required, Validators.maxLength(10)]],     // ← añadido maxLength
      documentType: ['', Validators.required],
      gender: ['', Validators.required],
      birthDate: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      specialCondition: [false],
    });

    // inicializa emergencyContactForm vacío (se validará sólo en menores)
    this.emergencyContactForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.minLength(7)]],
      relationShip: ['', Validators.required],
    });

    // inicializa companionForm con validación de tipoDocumento y edad mínima 18
    this.companionForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      document: ['', [Validators.required, Validators.maxLength(10)]],     // ← añadido maxLength
      documentType: ['', Validators.required],
      birthDate: ['', Validators.required],
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      relationShip: ['', Validators.required],
    });
  }

  goBack(): void {
    this.location.back();
  }

   /**
   * Llama a este método para guardar pasajeros/servicios en el servicio compartido
   * y luego navegar a la ruta de selección de asientos.
   */
   goToSeatSelection(): void {
    if (!this.mainPassenger || !this.info) {
      console.error('Faltan datos de pasajero principal o info de vuelo');
      return;
    }

    // 1) Construir MainPassenger (igual que ya lo tienes)
    const main: MainPassenger = {
      firstName: this.mainPassenger.firstName,
      lastName: this.mainPassenger.lastName,
      document: this.mainPassenger.document,
      documentType: this.mainPassenger.documentType,
      birthDate: this.mainPassenger.birthDate,
      gender: this.mainPassenger.gender,
      email: this.mainPassenger.email,
      age: this.mainPassenger.age,
      rol: this.mainPassenger.rol,
      ...(this.companionData && {
        companion: {
          firstName: this.companionData.firstName,
          lastName: this.companionData.lastName,
          document: this.companionData.document,
          documentType: this.companionData.documentType,
          birthDate: this.companionData.birthDate,
          gender: this.companionData.gender,
          email: this.companionData.email,
          relationShip: this.companionData.relationShip!,
          age: this.companionData.age,
          rol: this.companionData.rol,
        },
      }),
    };

    // 2) Construir arreglo de AdditionalPassenger[]
    const additionals: AdditionalPassenger[] = this.additionalPassengers.map(p => {
      const base: any = {
        firstName: p.firstName,
        lastName: p.lastName,
        document: p.document,
        documentType: p.documentType,
        birthDate: p.birthDate,
        gender: p.gender,
        email: p.email,
        age: p.age,
        rol: p.rol,
        specialCondition: p.specialCondition,
      };
      if ((p as any).emergencyContact) {
        base.emergencyContact = (p as any).emergencyContact;
      }
      return base as AdditionalPassenger;
    });

    // 3) Construir mapa de ServicesExt[] para cada pasajero
    const servicesMap: { [key: string]: ServicesExt[] } = {};
    Object.entries(this.servicesByPassenger).forEach(([passengerKey, ctx]) => {
      servicesMap[passengerKey] = ctx.selected.map(s => ({
        codeService: s.codeService!,
        quantity: s.selectedCount!,
        value: s.value!        // precio unitario
      }));
    });

    // 4) Guardar todo en PassengersRegisterService
    this.passengersRegister.setMainPassenger(main);
    this.passengersRegister.setCompanion(this.companionData ?? null);
    this.passengersRegister.setAdditionalPassengers(additionals);
    this.passengersRegister.setServicesByPassenger(servicesMap);

    // 5) Navegar a selección de asientos, usando el código de vuelo
    this.router.navigate(['/seats', this.info.codigoVuelo]);
  }

  ngOnInit(): void {
    // suscribe a la tarifa actual
    this.passengersRegister.info$.subscribe((i) => (this.info = i));

    // activar/desactivar validación de companion si edad principal < 18
    // activar/desactivar validación de companion si edad principal < 18
    this.principalForm.get('birthDate')!.valueChanges.subscribe(() => {
      const edadPrincipal = this.age;
      const needsCompanion = edadPrincipal < 18;

      if (needsCompanion) {
        // Aplicar validadores básicos al companionForm
        this.companionForm
          .get('birthDate')!
          .setValidators([Validators.required]);
        this.companionForm
          .get('relationShip')!
          .setValidators([Validators.required]);
        // Los campos gender y email ya tienen sus validadores en el constructor
      } else {
        // Si ya no necesita acompañante, limpiar valores y validadores
        this.companionForm.reset();
        Object.values(this.companionForm.controls).forEach((ctrl) => {
          ctrl.clearValidators();
          ctrl.updateValueAndValidity();
        });
      }

      // Asegurarnos de que los campos obligatorios siempre tengan Validators.required
      [
        'firstName',
        'lastName',
        'document',
        'documentType',
        'gender',
        'email',
        'relationShip',
      ].forEach((key) => {
        const c = this.companionForm.get(key)!;
        c.setValidators(
          c.validator
            ? [Validators.required, c.validator]
            : [Validators.required]
        );
        c.updateValueAndValidity();
      });

      // Finalmente validar la fecha de nacimiento del companion
      this.companionForm.get('birthDate')!.updateValueAndValidity();
    });

    this.additionalForm.get('birthDate')!.valueChanges.subscribe(() => {
      if (this.additionalAge < 18) {
        // si es menor: mantenemos los validadores del emergencyContactForm
        Object.values(this.emergencyContactForm.controls).forEach((ctrl) => {
          ctrl.setValidators([Validators.required]);
          ctrl.updateValueAndValidity();
        });
      } else {
        // si ya no es menor, limpiamos y quitamos validadores
        this.emergencyContactForm.reset();
        Object.values(this.emergencyContactForm.controls).forEach((ctrl) => {
          ctrl.clearValidators();
          ctrl.updateValueAndValidity();
        });
      }
    });

    this.iniciarData();
  }

  get additionalAge(): number {
    const dob = this.additionalForm.get('birthDate')!.value;
    if (!dob) return 0;
    const diffMs = Date.now() - new Date(dob).getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365.25));
  }

  /** Mostrar contacto de emergencia si menor o condición especial marcada **/
  get showEmergencyContact(): boolean {
    return (
      (this.additionalForm.get('birthDate')!.valid &&
        this.additionalAge < 18) ||
      this.additionalForm.get('specialCondition')!.value
    );
  }

  iniciarData() {
    this.spinner.show();
    this.documentTypeService
      .allDocumentType()
      .pipe(
        tap((data: DocumentType[]) => {
          this.documentTypes = data;
        }),
        finalize(() => this.spinner.hide())
      )
      .subscribe();
    this.serviceFee
      .getAllServiceExtra(this.info?.codigoVuelo!)
      .pipe(
        tap((data: ServiceExtraFlightResponseDto[]) => {
          this.availableServices = data.map((s) => ({
            ...s,
            quantity: Number(s.quantity) || 0,
            selectedCount: 0,
          }));
          this.baseServices = [...this.availableServices];
        }),
        finalize(() => this.spinner.hide())
      )
      .subscribe();
  }

  // muestra formulario de acompañante sólo si edad principal válida y < 18
  get showCompanion(): boolean {
    return this.principalForm.get('birthDate')!.valid && this.age < 18;
  }

  get age(): number {
    const dob = this.principalForm.get('birthDate')!.value;
    if (!dob) return 0;
    const diffMs = Date.now() - new Date(dob).getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365.25));
  }

  /** Edad calculada del acompañante **/
  get companionAge(): number {
    const dob = this.companionForm.get('birthDate')!.value;
    if (!dob) return 0;
    const diff = Date.now() - new Date(dob).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  }

  // servicios con selectedCount > 0
  get selectedServices(): ServiceExtraFlightResponseDto[] {
    return this.availableServices.filter((s) => s.selectedCount! > 0);
  }

  // controla pestañas
  setTab(tab: 'principal' | 'adicionales'): void {
    this.activeTab = tab;
  }

  // agregar pasajero principal y acompañante
  addPrincipal(): void {
    if (this.principalForm.invalid) return;
    const m = this.principalForm.value;
    // asignamos ID fijo para principal
    this.mainPassenger = { rol: 'principal', ...m, age: this.age };

    if (this.age < 18) {
      // asignamos ID fijo para acompañante
      const c = this.companionForm.value;
      this.companionData = { rol: 'companion', ...c, age: this.companionAge };
    } else {
      this.companionData = undefined;
    }

    // inicializamos servicios para cada uno
    this.initializeServicesFor('principal');
    if (this.companionData) {
      this.initializeServicesFor('companion');
    }

    this.principalForm.reset();
    this.companionForm.reset();
  }

  // editar pasajero principal
  editPrincipal(): void {
    if (!this.mainPassenger) return;
    this.principalForm.setValue({
      firstName: this.mainPassenger.firstName,
      lastName: this.mainPassenger.lastName,
      document: this.mainPassenger.document,
      documentType: this.mainPassenger.documentType,
      birthDate: this.mainPassenger.birthDate,
      gender: this.mainPassenger.gender,
      email: this.mainPassenger.email,
    });
    if (this.companionData) {
      this.companionForm.setValue({
        firstName: this.companionData.firstName,
        lastName: this.companionData.lastName,
        document: this.companionData.document,
        documentType: this.companionData.documentType,
        birthDate: this.companionData.birthDate,
        gender: this.companionData.gender,
        email: this.companionData.email,
        relationShip: this.companionData.relationShip,
      });
    }
    this.mainPassenger = undefined;
  }

  // eliminar pasajero principal
  deletePrincipal(): void {
    this.mainPassenger = undefined;
    this.companionData = undefined;
    // limpiamos del map
    delete this.servicesByPassenger['principal'];
    delete this.servicesByPassenger['companion'];
    this.principalForm.reset();
    this.companionForm.reset();
  }

  // Cuando agregas un pasajero adicional
  addAdditional(): void {
    if (this.additionalForm.invalid) return;
    if (this.showEmergencyContact && this.emergencyContactForm.invalid) return;

    const rol = `additional_${this.nextAdditionalId++}`;
    const p: any = {
      rol,
      ...this.additionalForm.value,
      age: this.additionalAge,
    };
    if (this.showEmergencyContact)
      p.emergencyContact = this.emergencyContactForm.value;

    this.additionalPassengers.push(p);
    // inicializamos sus servicios
    this.initializeServicesFor(rol);

    this.additionalForm.reset({ specialCondition: false });
    this.emergencyContactForm.reset();
  }

  /** Crea un contexto de servicios clonado a partir de baseServices */
  initializeServicesFor(key: string) {
    this.servicesByPassenger[key] = {
      available: this.availableServices,
      selected: [],
    };
  }

  /** Cambia el pasajero activo para el dual-box */
  selectPassenger(key: string) {
    this.selectedPassengerKey = key;
  }

  getPassengerServices(key: string) {
    return this.servicesByPassenger[key]?.available || [];
  }

  getPassengerSelectedServices(key: string) {
    return this.servicesByPassenger[key]?.selected || [];
  }

  // eliminar adicional
  removeAdditional(p: Passenger): void {
    this.additionalPassengers = this.additionalPassengers.filter(
      (x) => x !== p
    );
  }

  // dual-box servicios
  toSelected(s: ServiceExtraFlightResponseDto) {
    if (!this.selectedPassengerKey) return;
    const ctx = this.servicesByPassenger[this.selectedPassengerKey];
    const av = ctx.available.find((x) => x.codeService === s.codeService);
    if (!av || av.quantity! <= 0) return;
    av.quantity!--;
    const sel = ctx.selected.find((x) => x.codeService === s.codeService);
    if (sel) {
      sel.selectedCount!++;
    } else {
      ctx.selected.push({ ...av, selectedCount: 1 });
    }
  }

  removeSelected(s: ServiceExtraFlightResponseDto) {
    if (!this.selectedPassengerKey) return;
    const ctx = this.servicesByPassenger[this.selectedPassengerKey];
    const sel = ctx.selected.find((x) => x.codeService === s.codeService);
    if (!sel) return;
    sel.selectedCount!--;
    if (sel.selectedCount! <= 0) {
      ctx.selected = ctx.selected.filter(
        (x) => x.codeService !== s.codeService
      );
    }
    const av = ctx.available.find((x) => x.codeService === s.codeService);
    if (av) av.quantity!++;
  }

  removeAllSelected() {
    if (!this.selectedPassengerKey) return;
    const ctx = this.servicesByPassenger[this.selectedPassengerKey];
    ctx.selected.forEach((s) => {
      const av = ctx.available.find((x) => x.codeService === s.codeService);
      if (av) av.quantity! += s.selectedCount!;
    });
    ctx.selected = [];
  }

  /** Para mostrar nombre en el botón de adicionales */
  getAdditionalPassengerName(key: string) {
    const p = this.additionalPassengers.find((x) => x.rol === key);
    return p ? `${p.firstName} ${p.lastName}` : '';
  }

  // passengers.component.ts
  get totalAmount(): number {
    const plan = this.info?.valorTarifaSeleccionado ?? 0;

    // suma de extras para TODOS los pasajeros
    const extras = Object.values(this.servicesByPassenger).reduce(
      (acc, ctx) =>
        acc +
        ctx.selected.reduce((sum, s) => sum + s.value! * s.selectedCount!, 0),
      0
    );

    return plan + extras;
  }

}
