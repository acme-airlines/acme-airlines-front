import { AdditionalPassenger } from "./additional-passenger";
import { MainPassenger } from "./main-passenger";
import { ServicesExt } from "./services-ext";

export interface BookingRequest{
    codeFlight: string;
    feeCode:string;
    mainPassenger: MainPassenger
    additionalPassengers: AdditionalPassenger[]
}