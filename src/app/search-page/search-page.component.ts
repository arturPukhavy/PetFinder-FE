import { Component } from '@angular/core';
import { PetService } from './pet.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PetResponse } from './pet.model';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { IonicModule } from '@ionic/angular';

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

  constructor(private petService: PetService, private spinner: NgxSpinnerService) {}

  fetchPetInfo() {
    const code = this.petCode.trim();
    console.log('Fetching pet info for code:', code);

    this.spinner.show();

    this.petService.getPetInfo(code).subscribe(
      info => {
        this.petInfo = info; 
        console.log('Fetched pet info:', this.petInfo);
        this.spinner.hide();
      },
      error => {
        console.error('Error fetching pet info:', error);
        if (error.status === 404) {
          alert('Pet not found! Please check the pet code.');
        } else {
          alert('An error occurred while fetching pet info.');
        }
        this.spinner.hide();
        this.petInfo = null;
      }
    );
  }

  openScanner() {
    // Implement QR scanner logic here
    // On successful scan, set the scannedCode
    // this.scannedCode = scannedCodeFromScanner;
  }

}
