import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
  })
  export class PetService {

    code: string = '';

    getPetInfo(code: string) {
        this.code = code; 


    }
  }