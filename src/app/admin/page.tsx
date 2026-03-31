import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Bienvenido al Panel de AutoHaus</CardTitle>
            <CardDescription>Desde aquí podrás gestionar todo el contenido del sitio web.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Utilizá el menú de la izquierda para navegar a las diferentes secciones, como la gestión de vehículos.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
