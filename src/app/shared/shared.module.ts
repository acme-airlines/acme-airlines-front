import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { NavBarComponent } from "./components/nav-bar/nav-bar.component";
import { AdvertingLatterComponent } from "./components/advertising-letter/advertising-letter.component";
import { FlightInformationLetterComponent } from "./components/flight-information-letter/flight-information-letter.component";

@NgModule({
    declarations: [NavBarComponent, AdvertingLatterComponent, FlightInformationLetterComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule
    ],
    exports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        RouterModule,
        NavBarComponent,
        AdvertingLatterComponent,
        FlightInformationLetterComponent
    ]
})
export class SharedModule {}