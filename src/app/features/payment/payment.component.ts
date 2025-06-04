import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { InformationTariffFly } from '@sharedModule/models/informationTariffFly';
import { MainPassenger } from '@sharedModule/models/main-passenger';
import { AdditionalPassenger } from '@sharedModule/models/additional-passenger';
import { ServiceExtraFlightResponseDto } from '@sharedModule/models/serviceExtraFlightResponseDto';
import { ServicesExt } from '@sharedModule/models/services-ext';
import { BookingRequest } from '@sharedModule/models/booking-request';
import { ServicePassengerRequest } from '@sharedModule/models/service-passenger-request';
import { PaymentRequest } from '@sharedModule/models/payment-request';
import { PaymentResponse } from '@sharedModule/models/payment-response';

import { PassengersRegisterService } from '@sharedModule/service/passengersRegister.service';
import { PassengerService } from '@sharedModule/service/passenger.service';
import { ServicePassengerService } from '@sharedModule/service/service-passenger.service';
import { PaymentService } from '@sharedModule/service/paymentService.service';
import { QrService } from '@sharedModule/service/qr.service';
import { Qr } from '@sharedModule/models/qr';
import { Location } from '@angular/common';
import { SeatBookingRequestDto, SeatService } from '@sharedModule/service/seat.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'acme-airlines-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {

  info?: InformationTariffFly;
  mainPassenger?: MainPassenger | null;
  companionData?: MainPassenger | null;
  additionalPassengers: AdditionalPassenger[] = [];

  rawServicesByPassenger: { [key: string]: ServiceExtraFlightResponseDto[] } = {};

  payment: PaymentRequest = {
    cardNumber: '',
    cardHolder: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    amount: 0, // se cargará desde la query param
    codeFlight: '',
    codePassenger: ''
  };

  response: PaymentResponse | null = null;
  errorMsg: string | null = null;


  showSummary: boolean = false;            // ocultar formulario y mostrar resumen
  qrImageUrl: SafeUrl | null = null;       // URL seguro para <img [src]="qrImageUrl">
  codigoQr: string | null = null;          // UUID generado por el backend
  generatingQr = false;                    // flag de “Cargando QR…”

  constructor(
    private paymentService: PaymentService,
    private route: ActivatedRoute,
    private router: Router,
    private passengersRegister: PassengersRegisterService,
    private passengerService: PassengerService,
    private servicePassenger: ServicePassengerService,
    private seatService: SeatService,                // ← inyectamos SeatService
    private qrService: QrService,
    private sanitizer: DomSanitizer,
    private location: Location,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    const amountParam = this.route.snapshot.queryParamMap.get('amount');
    if (amountParam) {
      this.payment.amount = parseFloat(amountParam);
    }


    this.info = this.passengersRegister.getCurrentInformation();
    this.mainPassenger = this.passengersRegister.getMainPassenger();
    this.companionData = this.passengersRegister.getCompanion();
    this.additionalPassengers = this.passengersRegister.getAdditionalPassengers();
    this.rawServicesByPassenger = this.passengersRegister.getServicesByPassenger();
  }

  onVolverClick(): void {
    console.log(this.showSummary)
    if (this.showSummary) {
      // Al visualizar el resumen/QR, llevar a la pantalla de inicio.
      this.router.navigate(['/']);
    } else {
      // Si todavía no llegué al resumen, simplemente retrocedo.
      this.location.back();
    }
  }

  saveReservationAndCharge(): void {
    this.response = null;
    this.errorMsg = null;

    if (!this.mainPassenger || !this.info) {
      this.errorMsg = 'Faltan datos de reserva para completar el pago.';
      return;
    }

    this.spinner.show();
    // ─── 1) Construir la lista de asientos a reservar ───────────────────────
    const assignedMap = this.passengersRegister.getAssignedSeats();

    // convertimos a un array provisional sin codePassenger
    const provisionalSeats: Array<{ codeFlight: string; codeSeatFlight: string }> = [];
    Object.values(assignedMap).forEach(codeSeatFlight => {
      if (codeSeatFlight) {
        provisionalSeats.push({
          codeFlight: this.info!.codigoVuelo!,
          codeSeatFlight
        });
      }
    });

    const numPassengers =
      1 +
      (this.companionData ? 1 : 0) +
      this.additionalPassengers.length;
    if (provisionalSeats.length !== numPassengers) {
      this.spinner.hide();
      this.errorMsg = 'Debe asignar un asiento a cada pasajero antes de continuar.';
      return;
    }


    this.createPassengersAndCharge(provisionalSeats);
  }


  /**
   * Extraemos todo el código que antes estaba directamente en saveReservationAndCharge()
   * y lo dejamos aquí para invocarlo SOLO si la reserva de asientos fue exitosa.
   */
  private createPassengersAndCharge(provisionalSeats: Array<{ codeFlight: string; codeSeatFlight: string }>): void {
    const main: MainPassenger = {
      firstName: this.mainPassenger!.firstName,
      lastName: this.mainPassenger!.lastName,
      document: this.mainPassenger!.document,
      documentType: this.mainPassenger!.documentType,
      birthDate: this.mainPassenger!.birthDate,
      gender: this.mainPassenger!.gender,
      email: this.mainPassenger!.email,
      age: this.mainPassenger!.age,
      rol: this.mainPassenger!.rol,
      ...(this.companionData && {
        companion: {
          firstName: this.companionData.firstName,
          lastName: this.companionData.lastName,
          document: this.companionData.document,
          documentType: this.companionData.documentType,
          birthDate: this.companionData.birthDate,
          gender: this.companionData.gender,
          email: this.companionData.email,
          relationShip: this.companionData.companion!.relationShip,
          age: this.companionData.age,
          rol: this.companionData.rol,
        },
      }),
    };

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

    const booking: BookingRequest = {
      codeFlight: this.info!.codigoVuelo!,
      mainPassenger: main,
      feeCode: this.info!.codigoTarifaSeleccionado!,
      additionalPassengers: additionals
    };

    this.passengerService.createPassager(booking).subscribe({
      next: (data: Record<string, string>) => {
        // ─── 2.2) Ahora que tenemos { rol → codePassenger } en 'data', armamos SeatBookingRequestDto[]
        const seatRequests: SeatBookingRequestDto[] = [];

        Object.entries(this.passengersRegister.getAssignedSeats()).forEach(([rol, codeSeatFlight]) => {
          if (codeSeatFlight) {
            seatRequests.push({
              codeFlight: this.info!.codigoVuelo!,
              codeSeatFlight,
              codePassenger: data[rol]!   // obtenemos el código generado por el backend
            });
          }
        });
        // ─── 2.3) Invocamos al endpoint /book de SeatService ─────────────────────────
        this.seatService.bookSeats(seatRequests).subscribe({
          next: () => {
            // ─── 3) Si los asientos se reservan bien, guardamos servicios extra ──────────
            const servicesMap: { [key: string]: ServicesExt[] } = {};
            Object.keys(this.rawServicesByPassenger).forEach(passengerKey => {
              const dtoArray = this.rawServicesByPassenger[passengerKey];
              servicesMap[passengerKey] = dtoArray.map(dto => ({
                codeService: dto.codeService!,
                quantity: dto.quantity!,
                value: dto.value!
              }));
            });

            const request: ServicePassengerRequest = {
              codeFlight: this.info!.codigoVuelo!,
              servicesByPassenger: servicesMap,
              codePassengers: data
            };

            this.servicePassenger.createServicePassenger(request).subscribe({
              next: (respMap) => {
                // ─── 4) Finalmente cobramos la tarjeta ──────────────────────────────────
                this.chargeCard(data['principal']);
              },
              error: err => {
                this.spinner.hide();
                this.errorMsg = 'Error guardando servicios: ' + (err.error?.message || err.message);
              }
            });
          },
          error: err => {
            this.spinner.hide();
            this.errorMsg = 'Error reservando asientos: ' + (err.error?.message || err.message);
          }
        });
      },
      error: err => {
        this.spinner.hide();
        this.errorMsg = 'Error guardando reserva: ' + (err.error?.message || err.message);
      }
    });
  }


  /** 3.10) Cobrar la tarjeta */
  private chargeCard(resPassenger:string): void {
      // === Asignar codeFlight / codePassenger en el objeto `payment` ===
  if (!this.info || !this.mainPassenger) {
    this.spinner.hide();
    this.errorMsg = 'No hay datos de vuelo o pasajero para procesar pago.';
    return;
  }
  // Suponemos que el identificador único del pasajero es su document
  // (o el campo que el backend use como código de pasajero)
  this.payment.codeFlight     = this.info.codigoVuelo!;
  this.payment.codePassenger = resPassenger

    this.paymentService.chargeCard(this.payment).subscribe({
      next: (res) => {
        this.response = res;
        this.spinner.hide();
        // ───────────── Si el pago fue aprobado, mostramos el resumen + QR ─────────────
        if (res.status === 'APPROVED') {
          this.showSummary = true;           // ocultar el formulario
          this.generateAndFetchQr();         // dispara la generación/descarga del QR
        }
        // Si status === 'DECLINED', simplemente se mostrará el mensaje de error en template.
      },
      error: (err) => {
        this.spinner.hide();
        if (err.error && err.error.message) {
          this.errorMsg = err.error.message;
          this.response = {
            transactionId: err.error.transactionId || 'N/A',
            status: err.error.status || 'DECLINED',
            message: err.error.message,
          };
        } else {
          this.errorMsg = 'Error en la comunicación con el servidor.';
        }
      },
    });
  }

  /**
   * 3.11) Llama a QrService.createAndSaveQr(...) que devuelve un QrEntity.
   *         Luego convierte imagenQr (base64) a Blob y a SafeUrl para mostrarlo.
   */
  private generateAndFetchQr(): void {
    if (!this.mainPassenger || !this.info) return;

    this.generatingQr = true;
    this.qrImageUrl = null;

    const userCode = this.mainPassenger.document;    // o el campo único que desees
    const flightCode = this.info.codigoVuelo!;

    this.qrService.generateQr(userCode, flightCode).subscribe({
      next: (qrEntity: Qr) => {
        this.codigoQr = qrEntity.codigoQr;

        // 1) El campo qrEntity.imagenQr viene como base64 (string)
        const base64Data = qrEntity.imagenQr;

        // 2) Convertimos de base64 string a Blob (PNG)
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/png' });

        // 3) Creamos un ObjectURL y lo "segurizamos" vía DomSanitizer
        const objectUrl = URL.createObjectURL(blob);
        this.qrImageUrl = this.sanitizer.bypassSecurityTrustUrl(objectUrl);

        this.generatingQr = false;
      },
      error: (e: { message: string; }) => {
        this.errorMsg = 'Error generando o descargando el código QR: ' + e.message;
        this.generatingQr = false;
      }
    });
  }
}
