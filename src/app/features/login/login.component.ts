import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/service/auth.service';
import { TokenResponse } from '../../shared/models/token-response';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'acme-airlines-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  // Getter para acceder fácilmente a los controles del formulario
  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.spinner.show();
    // Consume el endpoint de client-oauth que se encarga de autenticar y generar el token
    this.authService.login(this.loginForm.value).subscribe({
      next: (response: TokenResponse) => {
        console.log('Autenticación exitosa', response);
        // Almacena el token (por ejemplo, en localStorage)
        localStorage.setItem('access_token', response.accessToken);
        this.spinner.hide();
        // Redirige a una ruta protegida o al dashboard
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.spinner.hide();
        console.error('Error de autenticación', err);
        // Aquí podrías agregar notificaciones al usuario o manejo de errores
      },
    });
  }
}
