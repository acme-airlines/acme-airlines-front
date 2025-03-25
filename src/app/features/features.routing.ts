import { Component, NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";


const ROUTES: Routes = [
    {
        path: 'login',
        component: LoginComponent 
    },
    { path: '**', redirectTo: 'login', pathMatch: 'full' },
]

@NgModule({
    imports: [RouterModule.forChild(ROUTES)],
    exports: [RouterModule]
})
export class FeaturesRoutingModule {}