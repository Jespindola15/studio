'use client';

import { useState } from 'react';
import { useAuth, useFirestore } from '@/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/logo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const grantAdminRole = async (uid: string) => {
      if (!db) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'La base de datos no está disponible para asignar el rol.',
        });
        throw new Error("Firestore no está disponible.");
      }
      const adminRoleRef = doc(db, 'roles_admin', uid);
      await setDoc(adminRoleRef, { id: uid });
    };

    try {
      // Intenta iniciar sesión primero
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/administrador');
    } catch (error: any) {
      // Si el usuario no existe (o la credencial es inválida), lo crea
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          await grantAdminRole(user.uid);
          toast({
            title: '¡Cuenta de administrador creada!',
            description: 'Bienvenido. Has sido registrado como administrador.',
          });
          router.push('/administrador');
        } catch (createError: any) {
          toast({
            variant: 'destructive',
            title: 'Error al crear la cuenta',
            description: createError.message || 'No se pudo crear la cuenta de administrador.',
          });
          console.error('Signup error:', createError);
        }
      } else {
        // Maneja otros errores (ej. contraseña incorrecta)
        let description = 'Las credenciales no son correctas. Por favor, intente de nuevo.';
        if (error.code === 'auth/wrong-password') {
          description = 'La contraseña es incorrecta.';
        } else if (error.code === 'auth/invalid-email') {
          description = 'El formato del email no es válido.';
        } else if (error.code === 'auth/weak-password') {
          description = 'La contraseña debe tener al menos 6 caracteres.';
        }

        toast({
          variant: 'destructive',
          title: 'Error de autenticación',
          description: description,
        });
        console.error('Login error:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Logo />
          </div>
          <CardTitle className="text-2xl font-bold">Panel de Administrador</CardTitle>
          <CardDescription>
            Ingresá tus credenciales para administrar el sitio.
            Si es la primera vez, se creará una cuenta de administrador.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@autohaus.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Ingresando...' : 'Ingresar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
