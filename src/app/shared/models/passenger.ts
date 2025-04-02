import { DocumentType } from "./document-type";

export class Passenger {
    codePassenger?: string;
    namePassenger?: string;
    lastNamePassenger?: string;
    phonePassenger?: string;
    documentTypePassengerFk?: DocumentType;
    numberDocumentPassenger?: string;
    emailPassenger?: string;
    birthDate?: Date;         
    creationDate?: Date;      
    genderPassenger?: string;
    hashPassword?: string;
  }