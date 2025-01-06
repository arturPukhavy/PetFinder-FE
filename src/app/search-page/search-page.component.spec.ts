import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchPageComponent } from './search-page.component';
import { NgxSpinnerService } from 'ngx-spinner'; // Adjust the import as necessary
import { Platform } from '@ionic/angular'; // Adjust the import as necessary
import { of } from 'rxjs';
import { PetService } from '../core/pet.service';
import { translations } from '../core/translations';


interface PetDetails {
  Identificatienummer: string;
  Diernaam: string;
  Diersoort: string;
  Paspoort_geregistreerd: string;
  Woonplaats_houder: string;
  Land_houder: string;
  Telefoon_Nederland: string;
  Telefoon_buitenland: string;
  Vermist: string;
  Overleden: string;
}

interface PetResponse {
  zoekresultaat: PetDetails;
  source: string; 
  description: string; 
}

class MockPetService {
  getPetInfo(code: string) {
    return of({
      zoekresultaat: {
        Identificatienummer: '12345',
        Diernaam: 'Fluffy',
        Diersoort: 'kat',
        Paspoort_geregistreerd: 'Nee',
        Woonplaats_houder: 'Amsterdam',
        Land_houder: 'Nederland',
        Telefoon_Nederland: '0123456789',
        Telefoon_buitenland: '+31123456789',
        Vermist: 'Nee',
        Overleden: 'Nee',
      },
      source: 'Mock Service', // Include required properties
      description: 'Mock pet information', // Include required properties
    } as PetResponse); // Cast to PetResponse
  }
}

class MockNgxSpinnerService {
  show() {}
  hide() {}
}

class MockPlatform {
  is() {
    return true; // Mock platform check
  }
}

describe('SearchPageComponent', () => {
  let component: SearchPageComponent;
  let fixture: ComponentFixture<SearchPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchPageComponent],
      providers: [
        { provide: PetService, useClass: MockPetService },
        { provide: NgxSpinnerService, useClass: MockNgxSpinnerService },
        { provide: Platform, useClass: MockPlatform }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.petCode).toBe('');
    expect(component.scannedCode).toBeNull();
    expect(component.petInfo).toBeNull();
    expect(component.message).toBeNull();
    expect(component.selectedLanguage).toBe('en');
  });

  it('should change language and update translations', () => {
    component.selectedLanguage = 'nl';
    component.changeLanguage();
    expect(component.currentTranslations).toEqual(translations.nl); 
  });

  it('should return correct pet info title', () => {
    component.petInfo = { zoekresultaat: { 
      Identificatienummer: '12345', 
      Diernaam: 'Fluffy', 
      Diersoort: 'kat', 
      Paspoort_geregistreerd: 'Nee', 
      Woonplaats_houder: 'Amsterdam', 
      Land_houder: 'Nederland',
      Telefoon_Nederland: '0123456789',
      Telefoon_buitenland: '+31123456789',
      Vermist: 'Nee',
      Overleden: 'Nee' 
    }, source: 'Mock Service', description: 'Mock pet information' }; // Include required properties
    expect(component.getPetInfoTitle()).toBe(component.currentTranslations.catInfoTitle);

    component.petInfo = { zoekresultaat: { 
      Identificatienummer: '67890', 
      Diernaam: 'Buddy', 
      Diersoort: 'hond', 
      Paspoort_geregistreerd: 'Nee', 
      Woonplaats_houder: 'Rotterdam', 
      Land_houder: 'Nederland',
      Telefoon_Nederland: '0123456789',
      Telefoon_buitenland: '+31123456789',
      Vermist: 'Nee',
      Overleden: 'Nee' 
    }, source: 'Mock Service', description: 'Mock pet information' }; // Include required properties
    expect(component.getPetInfoTitle()).toBe(component.currentTranslations.petInfoTitle);
    
    component.petInfo = null; // Test case when petInfo is null
    expect(component.getPetInfoTitle()).toBe(component.currentTranslations.petInfoTitle);
  });
});