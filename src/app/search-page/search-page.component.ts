import { Component } from '@angular/core';
import { PetService } from '../core/pet.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PetResponse } from '../core/pet.model';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { IonicModule, Platform } from '@ionic/angular';
import { translations } from '../core/translations';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Camera, CameraResultType } from '@capacitor/camera';
import Tesseract from 'tesseract.js';

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
  scannedCode: string = '';
  petInfo: PetResponse | null = null;
  message: string | null = null
  isNative: boolean;
  selectedLanguage: Language = 'en';
  currentTranslations = translations.en;
  isScanning: boolean = false;
  scanResults: boolean = false;

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
          this.message = error.error?.message; 
        } else if (error.status === 403) {
          this.message = error.error?.message || 'Access denied.'; 
        } else if (error.status === 404) {
          this.message = error.error?.message || 'Pet not found.';
        } else if (error.status === 500) {
          this.message = error.error?.message || 'Server error occurred.';
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

  async openScanner() {
    if (!this.isNative) {
      this.message = 'Scanning is only available on mobile.';
      return;
    }
  
    try {
      // Check and request camera permission
      // Step 1: Try scanning a barcode
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (!status.granted) {
        this.message = 'Camera access denied.';
        return;
      }

      this.isScanning = true;
  
      // Start the scanner and wait for the result
      const scanResult = await BarcodeScanner.startScan(); // This handles the scanning process
  
      if (scanResult.hasContent) {
        // If the scanner successfully returns content
        this.scannedCode = scanResult.content; // The scanned code (e.g., a number or text)
        console.log('Scanned Code:', this.scannedCode);
  
        // Automatically fetch pet info if the code is valid
        this.petCode = this.scannedCode.trim();
        this.fetchPetInfo();
        return;
      } 
      
      // Step 2: If no barcode was found, fallback to OCR
    console.log('No barcode detected. Switching to OCR...');
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl, // Use base64 image
    });

    if (image && image.dataUrl) {
      this.spinner.show();
      this.message = 'Processing image...';

      const result = await Tesseract.recognize(image.dataUrl, 'digits', {
        logger: (info) => console.log(info), // OCR processing
      });

      const scannedText = result.data.text.trim(); // Extract text from the image
      console.log('Scanned Text:', scannedText);

      // Validate if the detected text is numeric
      if (/^\d+$/.test(scannedText)) {
        this.scannedCode = scannedText;
        this.petCode = this.scannedCode;
        this.fetchPetInfo();
      } else {
        this.message = 'No valid number was detected. Please try again.';
      }
    } else {
      this.message = 'Image capture failed.';
    }
    } catch (error) {
      console.error('Error during scanning:', error);
      this.message = 'An error occurred while scanning.';
    } finally {
      // Stop the scanner if it’s still running
      BarcodeScanner.stopScan();
      this.spinner.hide();
      this.isScanning = false;
    }
  }

}
