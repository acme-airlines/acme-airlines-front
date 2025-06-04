import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CreatePassenger } from '@sharedModule/models/create-passenger';
import { DocumentType } from '@sharedModule/models/document-type';
import { DocumentTypeService } from '@sharedModule/service/document-type.service';
import { PassengersRegisterService } from '@sharedModule/service/passengersRegister.service';
import { SeatService } from '@sharedModule/service/seat.service';
import { UserService } from '@sharedModule/service/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { of } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

interface SeatView {
  id: string;        // codeSeatFlight
  label: string;     // codeSeat (por ejemplo "1A")
  status: 'FREE' | 'TAKEN';
  selected: boolean; // si el usuario lo ha marcado para reservar
}

@Component({
  selector: 'acme-airlines-seat-selection',
  templateUrl: './seat-selection.component.html',
  styleUrls: ['./seat-selection.component.scss'],
})
export class SeatSelectionComponent implements OnInit {
  flightCode!: string;
  seats: SeatView[] = [];
  errorMsg: string | null = null;
  loading = false;
  reserving = false;

    // Lista de roles de pasajeros cargados desde el servicio
    passengerKeys: string[] = [];
    activePassengerKey: string | null = null;

    assignedSeats: { [key: string]: string | null } = {};

  constructor(
    private route: ActivatedRoute,
    private seatService: SeatService,
    private router: Router,
    private passengersRegister: PassengersRegisterService,
    private location: Location
  ) {}

  goBack(): void {
    this.location.back();
  }

  ngOnInit(): void {
    // Suponemos que la ruta tiene un parámetro 'flightCode'
    this.flightCode = this.route.snapshot.paramMap.get('flightCode')!;
   // Obtener lista de pasajeros (main, companion, adicionales)
   const main = this.passengersRegister.getMainPassenger();
   const companion = this.passengersRegister.getCompanion();
   const additionals = this.passengersRegister.getAdditionalPassengers();
   this.passengerKeys = [];
   if (main) this.passengerKeys.push(main.rol);
   if (companion) this.passengerKeys.push(companion.rol);
   additionals.forEach(p => this.passengerKeys.push(p.rol));

   // Inicializar mapa de asientos con claves y valor null
   this.passengersRegister.initAssignedSeats(this.passengerKeys);
   this.assignedSeats = this.passengersRegister.getAssignedSeats();

   // Suscribirse a cambios de asignaciones
   this.passengersRegister.assignedSeats$.subscribe(map => {
     this.assignedSeats = map;
   });

   this.fetchSeats();
  }

  /** 1) Traer los asientos del vuelo desde el servicio */
  public fetchSeats(): void {
    this.loading = true;
    this.seatService.getSeatsByFlight(this.flightCode).subscribe({
      next: (dtos) => {
        this.seats = dtos.map(dto => {
          const rawSeatCode: string = dto.codeSeatFk!.codeSeat!; // p. ej. "S-EC-01A"
          const label = rawSeatCode.substring(rawSeatCode.lastIndexOf('-') + 1); // → "01A"
          const status: 'FREE' | 'TAKEN' = dto.status === 'available' ? 'FREE' : 'TAKEN';

          return {
            id: dto.codeSeatFlight, // "SF001"
            label,                 // "01A" (o "1A")
            status,                // "FREE" o "TAKEN"
            selected: false
          } as SeatView;
        });
        this.loading = false;
      },
      error: (_) => {
        this.errorMsg = 'Error al cargar los asientos del vuelo.';
        this.loading = false;
      }
    });
  }

  selectPassenger(key: string) {
    this.activePassengerKey = key;
  }

  assignSeatToPassenger(seat: SeatView): void {
    if (!this.activePassengerKey) return;
    if (seat.status !== 'FREE') return;

    const currentlyAssigned = this.assignedSeats[this.activePassengerKey];
    if (currentlyAssigned === seat.id) {
      // Ya asignado a este pasajero, desasignar
      this.passengersRegister.setAssignedSeat(this.activePassengerKey, null);
    } else {
      // Asignar a este pasajero (elimina de otro si estuviera)
      this.passengersRegister.setAssignedSeat(this.activePassengerKey, seat.id);
    }
  }

  getAssignedPassengerLabel(seatId: string): string | null {
    const map = this.assignedSeats;
    for (const key of Object.keys(map)) {
      if (map[key] === seatId) return key;
    }
    return null;
  }

  /** 2) Click en un asiento: solo permite marcar/desmarcar si está FREE */
  toggleSeatSelection(seat: SeatView): void {
    if (seat.status === 'FREE') {
      seat.selected = !seat.selected;
    }
  }

  get selectedSeatLabels(): string[] {
    return this.seats
      .filter(s => s.selected)
      .map(s => s.label);
  }

  /** 3) Confirmar reserva: enviar los IDs seleccionados al backend */
  confirmSelection(): void {
    // Asegurarse de que cada pasajero tenga un asiento distinto
    const assigned = Object.values(this.assignedSeats).filter(v => v !== null);
    if (assigned.length !== this.passengerKeys.length) {
      alert('Debe asignar un asiento a cada pasajero.');
      return;
    }
    // Navegar a /payment con monto y se mantienen asignaciones en servicio
    const totalAmount = this.passengersRegister.getTotalAmount();
    this.router.navigate(['/payment'], { queryParams: { amount: totalAmount } });
  }

  /** Utilitario para agrupar asientos en filas según su etiqueta, e.j. "1A","1B","2A"… */
  getRows(): string[][] {
    // Asumimos que "label" sigue patrón número+letra, ej. "1A", "1B", etc.
    // Agrupamos por número de fila
    const map = new Map<string, string[]>();
    this.seats.forEach(s => {
      const rowNumber = s.label.match(/^\d+/)?.[0] ?? '0';
      if (!map.has(rowNumber)) {
        map.set(rowNumber, []);
      }
      map.get(rowNumber)!.push(s.label);
    });
    // Convertir a array de arrays ordenados
    return Array.from(map.keys())
      .sort((a, b) => +a - +b)
      .map(rowNum => map.get(rowNum)!.sort());
  }

  /** Encuentra el SeatView dado su label */
  findSeatByLabel(label: string): SeatView | undefined {
    return this.seats.find(s => s.label === label);
  }
}
