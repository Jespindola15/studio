# DocScanner - Generador de PDF Optimizado

Esta es una aplicación web diseñada para escanear documentos (Frente y Dorso) y generar un PDF optimizado de forma instantánea y privada, ya que todo el procesamiento ocurre en tu navegador.

## 🚀 Cómo usarlo gratis para siempre

### Opción A: Despliegue en Vercel (Recomendado por simplicidad)
1. Sube este código a un repositorio de **GitHub**.
2. Ve a [Vercel](https://vercel.com) y crea una cuenta gratuita.
3. Haz clic en **"Add New"** > **"Project"**.
4. Importa tu repositorio de GitHub.
5. Haz clic en **"Deploy"**.
6. ¡Listo! Tendrás una URL tipo `tu-proyecto.vercel.app` que funcionará siempre.

### Opción B: Despliegue en Firebase App Hosting
Dado que este proyecto ya tiene `apphosting.yaml`:
1. Instala Firebase CLI: `npm install -g firebase-tools`.
2. Ejecuta `firebase login`.
3. Ejecuta `firebase init apphosting`.
4. Sigue los pasos para conectar tu GitHub.
5. Firebase desplegará tu app automáticamente en su infraestructura gratuita.

### Opción C: Uso Local (Sin internet)
Si quieres usarlo en tu propia computadora sin subirlo a ningún lado:
1. Descarga el código.
2. Abre una terminal en la carpeta.
3. Instala las dependencias: `npm install`.
4. Ejecuta: `npm run dev`.
5. Abre `http://localhost:9002` en tu navegador.

## 📱 Características Móviles
- Al tocar "Seleccionar", el móvil te permitirá elegir entre **Cámara**, **Galería** o **Explorador de archivos**.
- Funciona sin necesidad de enviar tus fotos a ningún servidor (Privacidad Total).
- Permite subir PDFs originales y extraer sus páginas para generar un nuevo PDF optimizado.

---
Generado con Firebase Studio.