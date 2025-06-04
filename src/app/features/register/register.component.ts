import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CreatePassenger } from '@sharedModule/models/create-passenger';
import { DocumentType } from '@sharedModule/models/document-type';
import { DocumentTypeService } from '@sharedModule/service/document-type.service';
import { UserService } from '@sharedModule/service/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { of } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

@Component({
  selector: 'acme-airlines-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  documentTypes: DocumentType[] = [];  // Propiedad para el listado

  constructor(
    private formBuilder: FormBuilder,
    private documentTypeService: DocumentTypeService,
    private userService: UserService,
    private router: Router,
    private spinner: NgxSpinnerService
  ){}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      typeDocument: ['', Validators.required],
      numberDocument: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dateOfBirth: ['', Validators.required],
      genre: ['', Validators.required],
      password: ['', Validators.required],
      repeatPassword: ['', Validators.required]
    }, {validators: this.passwordMatchValidator});

    // Carga los tipos de documento al iniciar el componente
    this.iniciarData();
  }

  iniciarData(){
    this.spinner.show();
    this.documentTypeService.allDocumentType().pipe(
      tap((data: DocumentType[]) => {
          this.documentTypes = data
      }),
      finalize(() => this.spinner.hide())
    ).subscribe();
  }

  register(){
    const {
      name,
      lastName,
      phone,
      typeDocument,
      numberDocument,
      email,
      dateOfBirth,
      genre,
      password
    } = this.registerForm.value;
    const passenger: CreatePassenger = {
      namePassenger: name,
      lastNamePassenger: lastName,
      phonePassenger: phone,
      documentTypePassengerFk: {
        codeTypeDocument: typeDocument
      },
      numberDocumentPassenger: numberDocument,
      emailPassenger: email,
      birthDate: dateOfBirth,
      genderPassenger: genre,
      password: password
    }
    this.userService.createUser(passenger).subscribe(
      {
        next: (data) => {
          console.log('Pasajero creado:', data);
        },
        error: (error) => {
          console.error('Error al crear pasajero:', error);
        },
        complete: () => {
          console.log('Creación de pasajero completada');
        }
      }
    )
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const repeatPassword = control.get('repeatPassword')?.value;
    return password && repeatPassword && password !== repeatPassword ? { passwordMismatch: true } : null;
  }
}
