'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useFirestore } from '@/firebase';
import { collection, query, where, limit, orderBy, getDocs } from 'firebase/firestore';
import type { Vehicle } from '@/lib/types';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';

function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Card className="overflow-hidden group transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 bg-background/50 hover:-translate-y-1">
      <CardContent className="p-0">
        <div className="relative">
          {vehicle.imagenPrincipalUrl ? (
            <Image
              src={vehicle.imagenPrincipalUrl}
              alt={`${vehicle.marca} ${vehicle.modelo}`}
              width={600}
              height={400}
              className="object-cover w-full aspect-video transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="aspect-video w-full bg-muted flex items-center justify-center">
              <span className="text-sm text-muted-foreground">Sin imagen</span>
            </div>
          )}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {vehicle.vendido && <Badge variant="destructive">Vendido</Badge>}
            {vehicle.destacado && !vehicle.vendido && <Badge variant="secondary">Destacado</Badge>}
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold font-headline">{vehicle.marca} {vehicle.modelo}</h3>
          <div className="text-sm text-muted-foreground flex justify-between mt-1">
            <span>{vehicle.ano}</span>
            <span>{vehicle.kilometraje.toLocaleString()} km</span>
          </div>
          <p className="text-xl font-semibold mt-2 text-primary">{vehicle.precio ? `U$S ${vehicle.precio.toLocaleString()}` : 'Consultar'}</p>
          <Button variant="outline" className="w-full mt-4" asChild>
            <Link href={`/catalogo/${vehicle.id}`}>Ver Detalles</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function VehicleCardSkeleton() {
    return (
        <Card className="overflow-hidden">
            <CardContent className="p-0">
                <Skeleton className="w-full aspect-video" />
                <div className="p-4 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <div className="flex justify-between">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-4 w-1/3" />
                    </div>
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </CardContent>
        </Card>
    )
}

export default function FeaturedVehicles() {
  const db = useFirestore();
  const [vehicles, setVehicles] = useState<Vehicle[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedVehicles = async () => {
      if (!db) {
        return;
      }
      setIsLoading(true);
      setError(null);

      try {
        const featuredQuery = query(
          collection(db, 'vehicles'),
          where('destacado', '==', true),
          where('vendido', '==', false),
          orderBy('fechaCreacion', 'desc'),
          limit(4)
        );

        const querySnapshot = await getDocs(featuredQuery);
        const fetchedVehicles = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Vehicle[];
        
        setVehicles(fetchedVehicles);

      } catch (e: any) {
        console.error("Error fetching featured vehicles:", e);
        // Set an error message but don't rethrow to avoid crashing the page.
        setError("No se pudieron cargar los vehículos destacados. Por favor, intente más tarde.");
      } finally {
        setIsLoading(false);
      }
    };

    if (db) {
        fetchFeaturedVehicles();
    }
  }, [db]);

  return (
    <Section className="bg-card">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold font-headline">Vehículos Destacados</h2>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
          Una selección de nuestros mejores vehículos disponibles.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading && Array.from({ length: 4 }).map((_, index) => (
          <VehicleCardSkeleton key={index} />
        ))}
        {!isLoading && vehicles?.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>
      
      {!isLoading && (vehicles?.length === 0 || error) && (
        <div className="text-center col-span-full py-12">
            <p className="text-muted-foreground">{error || "No hay vehículos destacados por el momento."}</p>
        </div>
      )}


       <div className="text-center mt-12">
          <Button size="lg" variant="outline" asChild>
            <Link href="/catalogo">Ver todo el catálogo</Link>
          </Button>
       </div>
    </Section>
  );
}
