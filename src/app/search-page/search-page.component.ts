import { Component } from '@angular/core';
import { PetService } from './pet.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss'
})
export class SearchPageComponent {
  petCode: string = '';
  scannedCode: string | null = null;
  petInfo: any;

  constructor(private petService: PetService) {}

  fetchPetInfo(code: string = this.petCode) {
    if (!code) {
      alert('Please enter a pet code!');
      return;
    }

    // this.petService.getPetInfo(code).subscribe(
    //   info => {
    //     this.petInfo = info;
    //   },
    //   error => {
    //     alert('Pet not found!');
    //     this.petInfo = null;
    //   }
    // );
  }

  openScanner() {
    // Implement QR scanner logic here
    // On successful scan, set the scannedCode
    // this.scannedCode = scannedCodeFromScanner;
  }

}
