import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, from, map, Observable, throwError } from "rxjs";
import { PetResponse } from "./pet.model";
import { Http } from "@capacitor/http";
import { Platform } from "@ionic/angular";
import { CapacitorHttp, HttpResponse } from "@capacitor/core";


@Injectable({
    providedIn: 'root'
  })
  export class PetService {
    private apiUrl = 'https://petfinder-api.glitch.me/api/v1/barcode'; 

    constructor(private http: HttpClient, private platform: Platform) {}
  
    getPetInfo(code: string): Observable<PetResponse> {
      const url = `${this.apiUrl}/${code}`;
  
      if (true) {
        // Native: Use Capacitor HTTP
        return from(this.nativeGetRequest(url)).pipe(
          catchError(this.handleError)
        );
      } else {
        // Web: Use Angular HttpClient
        return this.http.get<PetResponse>(url).pipe(
          catchError(this.handleError)
        );
      }
    }
  
    private async nativeGetRequest(url: string): Promise<PetResponse> {
      const options = {
        url: url,
        headers: { 'X-Fake-Header': 'Fake-Value' },
        params: { size: 'XL' },
      };
    
      const response: HttpResponse = await CapacitorHttp.get(options);
      // const response = await Http.request({
      //   method: 'GET',
      //   url: url
      // });
  
      if (response.status === 200) {
        return response.data as PetResponse;
      } else {
        throw response;
      }
    }
  
    private handleError(error: any) {
      // Handle errors for both web and native environments
      if (error instanceof HttpErrorResponse) {
        return throwError(error); // Angular HttpClient errors
      } else {
        // Capacitor HTTP errors
        return throwError({
          status: error.status,
          error: { message: error.data?.message || 'An error occurred.' }
        });
      }
    }
  }
  