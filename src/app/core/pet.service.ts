import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, from, map, Observable, throwError } from "rxjs";
import { PetResponse } from "./pet.model";
import { Platform } from "@ionic/angular";
import { CapacitorHttp, HttpResponse } from "@capacitor/core";
import { environment } from "../environments/environment";


@Injectable({
    providedIn: 'root'
  })
  export class PetService {
    private apiBaseUrl: string;

    constructor(private http: HttpClient, private platform: Platform) {
      if (this.platform.is('capacitor')) {
        this.apiBaseUrl = environment.apiUrlMob;
      } else {
        this.apiBaseUrl = environment.apiUrlWeb;
      }
    }
  
    getPetInfo(code: string): Observable<PetResponse> {
      const url = `${this.apiBaseUrl}/${code}`;
  
      console.log('Artur, platform: ' + this.platform.platforms.length)
      if (this.platform.is('capacitor')) {
        // Native: Use Capacitor HTTP
        console.log('Artur, capacitor version')
        return from(this.nativeGetRequest(url)).pipe(
          catchError(this.handleError)
        );    
      } else {
        // Web: Use Angular HttpClient
        console.log('Artur, web version')
        return this.http.get<PetResponse>(url).pipe(
          catchError(this.handleError)
        );
      }
    }
  
    private async nativeGetRequest(url: string): Promise<PetResponse> {
      console.log("url = " + url)
      const options = {
        url: url,
        // headers: { 'Access-Control-Allow-Origin': '*' },
        // params: { size: 'XL2' },
      };
    
      const response: HttpResponse = await CapacitorHttp.get(options);
  
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
  