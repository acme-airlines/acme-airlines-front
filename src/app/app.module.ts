import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from "./app.routes";
import { SharedModule } from "./shared/shared.module";
import { NgxSpinnerModule } from "ngx-spinner";

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        SharedModule, 
        NgxSpinnerModule.forRoot({ type: 'square-jelly-box' }),
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}