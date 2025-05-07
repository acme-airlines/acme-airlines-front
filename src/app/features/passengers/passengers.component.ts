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

interface Passenger {
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

  constructor(
    private fb: FormBuilder,
    private documentTypeService: DocumentTypeService,
    private passengersRegister: PassengersRegisterService,
    private spinner: NgxSpinnerService,
    private serviceFee: ServiceFeeService,
    private passengerService: PassengerService,
    private servicePassenger: ServicePassengerService
  ) {
    // inicializa principalForm con validación de edad y tipoDocumento
    this.principalForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      document: ['', Validators.required],
      documentType: ['', Validators.required],
      birthDate: ['', Validators.required],
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]], // ← añadido
    });

    // inicializa additionalForm con tipoDocumento
    this.additionalForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      document: ['', Validators.required],
      documentType: ['', Validators.required],
      gender: ['', Validators.required],
      birthDate: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]], // ← añadido
      specialCondition: [false]                      // ← checkbox
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
      document: ['', Validators.required],
      documentType: ['', Validators.required],
      birthDate: ['', Validators.required],
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]], // ← añadido
      relationShip: ['', Validators.required], // ← añadido
    });
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
    return this.additionalForm.get('birthDate')!.valid && this.additionalAge < 18
        || this.additionalForm.get('specialCondition')!.value;
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
    this.mainPassenger = {
      ...m,
      age: this.age,
    };

    if (this.age < 18) {
      this.companionForm.markAllAsTouched();
      if (this.companionForm.invalid) return;
      const c = this.companionForm.value;
      this.companionData = {
        ...c,
        age: this.companionAge,
      };
    } else {
      this.companionData = undefined;
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
    this.principalForm.reset();
    this.companionForm.reset();
  }

  // agregar pasajero adicional
  addAdditional(): void {
    if (this.additionalForm.invalid) return;
    if (this.showEmergencyContact && this.emergencyContactForm.invalid) return;

    // Combina data adicional + posible emergencia
    const p = this.additionalForm.value as any;
    if (this.showEmergencyContact) {
      p.emergencyContact = this.emergencyContactForm.value;
    }
    p.age = this.additionalAge;
    this.additionalPassengers.push(p);

    // Limpia ambos
    this.additionalForm.reset({ specialCondition: false });
    this.emergencyContactForm.reset();
  }

  // eliminar adicional
  removeAdditional(p: Passenger): void {
    this.additionalPassengers = this.additionalPassengers.filter(
      (x) => x !== p
    );
  }

  // dual-box servicios
  toSelected(service: ServiceExtraFlightResponseDto): void {
    if (service.quantity! <= 0) return;
    service.quantity!--;
    service.selectedCount!++;
  }

  removeSelected(service: ServiceExtraFlightResponseDto): void {
    if (service.selectedCount! <= 0) return;
    service.selectedCount!--;
    service.quantity!++;
  }

  removeAllSelected(): void {
    this.availableServices.forEach((s) => {
      s.quantity! += s.selectedCount!;
      s.selectedCount = 0;
    });
  }

   /** Llama a este método para armar el objeto y guardarlo en BD */
   saveAll(): void {
    if (!this.mainPassenger) {
      console.error('No hay pasajero principal registrado');
      return;
    }

    // 1) Construye el pasajero principal
    const main:MainPassenger = {
      firstName:    this.mainPassenger.firstName,
      lastName:     this.mainPassenger.lastName,
      document:     this.mainPassenger.document,
      documentType: this.mainPassenger.documentType,
      birthDate:    this.mainPassenger.birthDate,
      gender:       this.mainPassenger.gender,
      email:        this.mainPassenger.email,
      age:          this.mainPassenger.age,
      ...(this.companionData && {     // si existe acompañante, lo añade
        companion: {
          firstName:    this.companionData.firstName,
          lastName:     this.companionData.lastName,
          document:     this.companionData.document,
          documentType:this.companionData.documentType,
          birthDate:    this.companionData.birthDate,
          gender:       this.companionData.gender,
          email:        this.companionData.email,
          relationShip: this.companionData.relationShip!,
          age:          this.companionData.age
        }
      })
    };

    // 2) Construye los pasajeros adicionales
    const additionals:AdditionalPassenger[] = this.additionalPassengers.map(p => {
      const base = {
        firstName:    p.firstName,
        lastName:     p.lastName,
        document:     p.document,
        documentType:p.documentType,
        birthDate:    p.birthDate,
        gender:       p.gender,
        email:        p.email,
        specialCondition: p.specialCondition,
        relationShip: p.relationShip!,
        age:          p.age
      };
      // Si le añadiste emergencyContact en el payload:
      const ec = (p as AdditionalPassenger).emergencyContact;
      return ec
        ? { ...base, emergencyContact: ec }
        : base;
    });

    // 3) Construye la lista de servicios
    const services:ServicesExt[] = this.selectedServices.map(s => ({
      codeService: s.codeService!,            // o el campo que identifique tu servicio
      quantity:  s.selectedCount!
    }));

    // 4) Arma el request completo
    const payload: BookingRequest = {
      codeFlight:           this.info!.codigoVuelo!,
      mainPassenger:       main,
      feeCode: this.info?.codigoTarifaSeleccionado!,
      additionalPassengers: additionals,
      //services: services
    };

    this.passengerService.createPassager(payload)
    .pipe(
      tap((data: string[]) => {
        const request:ServicePassengerRequest = {
          codeFlight: this.info?.codigoVuelo!,
          service: services,
          codePassengers: data
        }
        this.servicePassenger.createServicePassenger(request).subscribe();
      }),
      finalize(() => this.spinner.hide())
    )
    .subscribe();
  
  }
}
