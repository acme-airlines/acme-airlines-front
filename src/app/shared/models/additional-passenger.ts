import { EmergencyContact } from "./emergency-contact";

export interface AdditionalPassenger{
    firstName: string;
    lastName: string;
    document: string;
    documentType: string;
    birthDate: string;
    gender: string;
    email: string;
    relationShip: string;
    age: number;
    specialCondition:boolean;
    emergencyContact?: EmergencyContact
    rol: string
}