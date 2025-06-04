import { NgModule } from "@angular/core";
import { LoginComponent } from "./login/login.component";
import { SharedModule } from "../shared/shared.module";
import { FeaturesRoutingModule } from "./features.routing";
import { RegisterComponent } from "./register/register.component";
import { FlightsComponent } from "./flights/flights.component";
import { PassengersComponent } from "./passengers/passengers.component";
import { PaymentComponent } from "./payment/payment.component";
import { SeatSelectionComponent } from "./seat-selection/seat-selection.component";

@NgModule({
    declarations: [LoginComponent, RegisterComponent, FlightsComponent, PassengersComponent, PaymentComponent, SeatSelectionComponent],
    imports: [
        SharedModule,
        FeaturesRoutingModule
    ],
    exports: [],
    bootstrap: [FeaturesModule]
})
export class FeaturesModule{}
