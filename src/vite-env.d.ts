
/// <reference types="vite/client" />

declare global {
  interface Window {
    google: typeof google;
  }
  
  namespace google {
    namespace maps {
      class Map {
        constructor(mapDiv: Element | null, opts?: MapOptions);
      }
      
      interface MapOptions {
        center?: LatLng | LatLngLiteral;
        zoom?: number;
      }
      
      interface LatLng {
        lat(): number;
        lng(): number;
      }
      
      interface LatLngLiteral {
        lat: number;
        lng: number;
      }
      
      namespace places {
        class PlacesService {
          constructor(attrContainer: Map | HTMLDivElement);
          nearbySearch(request: PlaceSearchRequest, callback: (results: PlaceResult[] | null, status: PlacesServiceStatus) => void): void;
        }
        
        interface PlaceSearchRequest {
          location: LatLng | LatLngLiteral;
          radius: number;
          type?: string;
        }
        
        interface PlaceResult {
          place_id?: string;
          name?: string;
          vicinity?: string;
          rating?: number;
          types?: string[];
          geometry?: {
            location?: LatLng;
          };
          formatted_phone_number?: string;
          opening_hours?: {
            open_now?: boolean;
          };
        }
        
        enum PlacesServiceStatus {
          OK = 'OK',
          ERROR = 'ERROR',
          INVALID_REQUEST = 'INVALID_REQUEST',
          OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT',
          REQUEST_DENIED = 'REQUEST_DENIED',
          UNKNOWN_ERROR = 'UNKNOWN_ERROR',
          ZERO_RESULTS = 'ZERO_RESULTS'
        }
      }
    }
  }
}

export {};
