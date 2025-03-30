import { Component, NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { FlightsComponent } from "./flights/flights.component";


const ROUTES: Routes = [
    {
        path: 'login',
        component: LoginComponent 
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'flights',
        component: FlightsComponent
    },
    { path: '**', redirectTo: 'flights', pathMatch: 'full' },
]

@NgModule({
    imports: [RouterModule.forChild(ROUTES)],
    exports: [RouterModule]
})
export class FeaturesRoutingModule {}