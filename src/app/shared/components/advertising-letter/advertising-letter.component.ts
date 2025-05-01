import { Component, Input } from '@angular/core';
import { CardField } from '../../models/card-field';

@Component({
  selector: 'acme-airlines-advertising-letter',
  templateUrl: './advertising-letter.component.html',
  styleUrls: ['./advertising-letter.component.scss'],
})
export class AdvertingLatterComponent  {
 // Objeto genérico a mostrar (puede tener cualquier estructura)
 @Input() data: any;

 // Mapeo de campos: indica el nombre de la propiedad que se usará para cada sección
 @Input() imageField?: string;      // Propiedad que contiene la URL de la imagen (opcional)
 @Input() titleField?: string;      // Propiedad que se usará como título principal
 @Input() subtitleField?: string;   // Propiedad para subtítulo o información adicional

 // Campos de texto adicionales (arreglo de objetos con etiqueta y nombre de propiedad)
 @Input() textFields?: CardField[];

 // Opciones de estilo (clases de Bootstrap u otras)
 @Input() containerClass: string = 'container my-4';
 @Input() cardClass: string = 'card h-100 shadow-sm';

 showDetails: boolean = false;


}
