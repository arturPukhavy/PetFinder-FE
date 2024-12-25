import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PetResponse } from "./pet.model";

@Injectable({
    providedIn: 'root'
  })
  export class PetService {
    private apiUrl = '/api/v1/barcode'; 

    constructor(private http: HttpClient) {}
  
    getPetInfo(code: string): Observable<PetResponse> {
      return this.http.get<PetResponse>(`${this.apiUrl}/${code}`);
    }
  }