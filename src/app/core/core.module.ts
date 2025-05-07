import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/interceptor';

/**
 * Módulo central (`CoreModule`) que configura y proporciona servicios o utilidades
 * compartidas en toda la aplicación.
 *
 * Este módulo no debe ser importado directamente en módulos de características (feature modules).
 * En su lugar, debe ser importado solo una vez en el `AppModule`.
 */
@NgModule({
  imports: [
    CommonModule, // Proporciona directivas y servicios comunes de Angular (ngIf, ngFor, etc.).
  ],
  providers: [
    {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true
      }
  ],
})
export class CoreModule {}