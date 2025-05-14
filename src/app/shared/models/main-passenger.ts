import { Companion } from "./companion";

export interface MainPassenger{
    firstName: string;
    lastName: string;
    document: string;
    documentType: string;
    birthDate: string;
    gender: string;
    email: string;
    age: number;
    companion?: Companion
    rol:string;
}