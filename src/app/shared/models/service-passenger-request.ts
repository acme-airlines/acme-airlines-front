import { ServicesExt } from "./services-ext"

export interface ServicePassengerRequest{
    codeFlight:string
    service: ServicesExt[]
    codePassengers:string[]
}