import { NgModule } from "@angular/core";
import { LoginComponent } from "./login/login.component";
import { SharedModule } from "../shared/shared.module";
import { FeaturesRoutingModule } from "./features.routing";
import { NavBarComponent } from "../shared/components/nav-bar/nav-bar.component";
import { RegisterComponent } from "./register/register.component";
import { FlightsComponent } from "./flights/flights.component";

@NgModule({
    declarations: [LoginComponent, RegisterComponent, FlightsComponent],
    imports: [
        SharedModule,
        FeaturesRoutingModule
    ],
    exports: [],
    bootstrap: [FeaturesModule]
})
export class FeaturesModule{}