import { ServicesExt } from "./services-ext"

export interface ServicePassengerRequest{
    codeFlight:string
    servicesByPassenger: {
        [passengerKey: string]: ServicesExt[]
      }
    codePassengers:Record<string, string>
}