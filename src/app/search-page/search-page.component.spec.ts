import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchPageComponent } from './search-page.component';
import { Platform } from '@ionic/angular'; 
import { of, throwError } from 'rxjs';
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

class MockPlatform {
  is() {
    return true; // Mock platform check
  }
}

describe('SearchPageComponent', () => {
  let component: SearchPageComponent;
  let fixture: ComponentFixture<SearchPageComponent>;
  let mockPetService: jasmine.SpyObj<PetService>;

  beforeEach(async () => {
    // Create spies for the services
    mockPetService = jasmine.createSpyObj('PetService', ['getPetInfo']);

    await TestBed.configureTestingModule({
      imports: [SearchPageComponent], 
      providers: [
        { provide: PetService, useValue: mockPetService },
        { provide: Platform, useClass: MockPlatform }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.petCode).toBe('');
    expect(component.scannedCode).toBe('');
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
    const mockPetInfo: PetResponse = {
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
      source: 'Mock Service',
      description: 'Mock pet information',
    };
    component.petInfo = mockPetInfo;
    
    expect(component.getPetInfoTitle()).toBe(component.currentTranslations.catInfoTitle);

    component.petInfo = {
      zoekresultaat: {
        Identificatienummer: '67890',
        Diernaam: 'Buddy',
        Diersoort: 'hond',
        Paspoort_geregistreerd: 'Nee',
        Woonplaats_houder: 'Rotterdam',
        Land_houder: 'Nederland',
        Telefoon_Nederland: '0123456789',
        Telefoon_buitenland: '+31123456789',
        Vermist: 'Nee',
        Overleden: 'Nee',
      },
      source: 'Mock Service',
      description: 'Mock pet information',
    };
    expect(component.getPetInfoTitle()).toBe(component.currentTranslations.petInfoTitle);

    component.petInfo = null;
    expect(component.getPetInfoTitle()).toBe(component.currentTranslations.petInfoTitle);
  });

  it('should handle 400 error and show appropriate message', () => {
    const errorResponse = {
      status: 400,
      error: { message: 'Invalid request' },
    };
    mockPetService.getPetInfo.and.returnValue(throwError(errorResponse));

    component.petCode = 'invalidCode';
    component.fetchPetInfo();

    expect(component.message).toBe('Invalid request');
    expect(component.petInfo).toBeNull();
  });

  it('should handle 403 error and show appropriate message', () => {
    const errorResponse = {
      status: 403,
      error: { message: 'Access denied' },
    };
    mockPetService.getPetInfo.and.returnValue(throwError(errorResponse));

    component.petCode = 'forbiddenCode';
    component.fetchPetInfo();

    expect(component.message).toBe('Access denied');
    expect(component.petInfo).toBeNull();
  });

  it('should handle 404 error and show default message', () => {
    const errorResponse = {
      status: 404,
      error: { message: null },
    };
    mockPetService.getPetInfo.and.returnValue(throwError(errorResponse));

    component.petCode = 'missingCode';
    component.fetchPetInfo();

    expect(component.message).toBe('Pet not found.');
    expect(component.petInfo).toBeNull();
  });

  it('should handle 500 error and show default message', () => {
    const errorResponse = {
      status: 500,
      error: { message: null },
    };
    mockPetService.getPetInfo.and.returnValue(throwError(errorResponse));

    component.petCode = 'serverErrorCode';
    component.fetchPetInfo();

    expect(component.message).toBe('Server error occurred.');
    expect(component.petInfo).toBeNull();
  });

  it('should handle unknown error and show generic message', () => {
    const errorResponse = {
      status: 0,
      error: { message: null },
    };
    mockPetService.getPetInfo.and.returnValue(throwError(errorResponse));

    component.petCode = 'unknownErrorCode';
    component.fetchPetInfo();

    expect(component.message).toBe('An error occurred while fetching pet info.');
    expect(component.petInfo).toBeNull();
  });
});