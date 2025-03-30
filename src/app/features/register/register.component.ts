import { Component } from '@angular/core';

@Component({
  selector: 'acme-airlines-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent  {
    // Objeto para almacenar los datos del pasajero
    passenger: any = {
      name_passenger: '',
      lastname_passenger: '',
      phone_passenger: '',
      document_type_passenger: '',
      number_document_passenger: '',
      email_passenger: '',
      birth_date: '',
      creation_date: '',
      gender_passenger: ''
    };
  
    register() {
      console.log('Datos del pasajero:', this.passenger);
      // Aquí puedes llamar a un servicio para enviar los datos al backend
    }
}
