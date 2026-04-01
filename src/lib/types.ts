import type { Timestamp } from 'firebase/firestore';

export interface Vehicle {
  id: string;
  marca: string;
  modelo: string;
  ano: number;
  precio: number | null;
  kilometraje: number;
  combustible: 'Nafta' | 'Diesel' | 'Electrico' | 'Hibrido';
  transmision: 'Manual' | 'Automatica';
  tipoVehiculo: 'Auto' | 'Camioneta' | 'SUV' | 'Utilitario';
  descripcion: string;
  destacado: boolean;
  vendido: boolean;
  fechaCreacion: Timestamp;
  imagenPrincipalUrl?: string;
  galeriaImagenesUrls?: string[];
}
