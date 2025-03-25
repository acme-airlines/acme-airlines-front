import { NgModule } from "@angular/core";
import { LoginComponent } from "./login/login.component";
import { SharedModule } from "../shared/shared.module";
import { FeaturesRoutingModule } from "./features.routing";

@NgModule({
    declarations: [LoginComponent],
    imports: [
        SharedModule,
        FeaturesRoutingModule
    ],
    exports: [],
    bootstrap: [FeaturesModule]
})
export class FeaturesModule{}