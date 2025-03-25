import { Component, OnInit } from "@angular/core";

@Component({
    selector: 'acme-airlines-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
    ngOnInit(): void {
        console.log("Hola Mundo")
    }

}