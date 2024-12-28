export interface PetResponse {
    source: string;
    description: string;
    zoekresultaat: PetDetails;
  }
  
  export interface PetDetails {
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