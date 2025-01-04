import { Component } from '@angular/core';
import { PetService } from '../core/pet.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PetResponse } from '../core/pet.model';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { IonicModule, Platform } from '@ionic/angular';
import { translations } from '../core/translations';

type Language = 'en' | 'nl';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxSpinnerModule, IonicModule],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss'
})



export class SearchPageComponent {
  petCode: string = '';
  scannedCode: string | null = null;
  petInfo: PetResponse | null = null;
  message: string | null = null
  isNative: boolean;
  selectedLanguage: Language = 'en';
  currentTranslations = translations.en;

  constructor(private petService: PetService, private spinner: NgxSpinnerService, private platform: Platform) {
    this.isNative = this.platform.is('capacitor');
  }

  fetchPetInfo() {
    const code = this.petCode.trim();
    console.log('Fetching pet info for code:', code);

    this.spinner.show();
    this.message = null;

    this.petService.getPetInfo(code).subscribe(
      info => {
        this.petInfo = info; 
        this.message = null;
        console.log('Fetched pet info:', this.petInfo);
        this.spinner.hide();
      },
      error => {
        console.error('Error fetching pet info:', error);
        if (error.status === 400) {
          this.message = error.error.message; 
        } else if (error.status === 403) {
          this.message = error.error.message || 'Access denied.'; 
        } else if (error.status === 404) {
          this.message = error.error.message || 'Pet not found.';
        } else if (error.status === 500) {
          this.message = error.error.message || 'Server error occurred.';
        } else {
          this.message = 'An error occurred while fetching pet info.'; 
        }
        this.spinner.hide();
        this.petInfo = null;
      }
    );
  }

  changeLanguage() {
    this.currentTranslations = translations[this.selectedLanguage];
  }

  getPetInfoTitle(): string {
    if (!this.petInfo || !this.petInfo.zoekresultaat?.Diersoort) {
      return this.currentTranslations.petInfoTitle; // Default title
    }

    const breed = this.petInfo.zoekresultaat.Diersoort.toLowerCase();
    if (breed === 'kat') {
      return this.currentTranslations.catInfoTitle;;
    } else {
      return this.currentTranslations.petInfoTitle;;
    }
  }

  openScanner() {
    // Implement QR scanner logic here
    // On successful scan, set the scannedCode
    // this.scannedCode = scannedCodeFromScanner;
  }

}
