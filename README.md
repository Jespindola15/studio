
# DocScanner - Generador de PDF Instantáneo

Esta aplicación permite escanear documentos (Frente y Dorso) y generar un PDF optimizado de forma instantánea. Todo el procesamiento ocurre localmente en tu navegador para garantizar máxima privacidad.

## 📥 Cómo descargar este proyecto
Para llevarte este código a tu computadora:
1. Busca el botón de **Download ZIP** o **Export** en la parte superior o lateral de la interfaz de Firebase Studio.
2. Descomprime el archivo `.zip` en una carpeta de tu elección.

## 💻 Cómo ejecutarlo en tu PC
Si quieres seguir editándolo o verlo en tu máquina local:
1. Asegúrate de tener instalado [Node.js](https://nodejs.org/).
2. Abre una terminal en la carpeta del proyecto.
3. Instala las dependencias: `npm install`
4. Inicia el modo desarrollo: `npm run dev`
5. Abre `http://localhost:9002` en tu navegador.

## 🚀 Cómo subir tu página GRATIS a Internet

### 1. Usando Vercel (La forma más fácil)
1. Crea una cuenta gratuita en [Vercel.com](https://vercel.com).
2. Haz clic en **"Add New"** > **"Project"**.
3. Conecta tu cuenta de GitHub.
4. Si te pide un **código** para conectar GitHub:
   - Mira la pantalla de la herramienta: allí aparecerá un código tipo `ABCD-1234`.
   - Ve a [github.com/login/device](https://github.com/login/device) en tu navegador.
   - Pega el código allí y presiona **Continue**.
   - Haz clic en **Authorize**.
5. Una vez conectado, selecciona este repositorio y dale a **Deploy**.

### 2. Usando Firebase App Hosting
1. En tu terminal ejecuta: `npm install -g firebase-tools`.
2. Ejecuta `firebase login` y sigue los pasos en el navegador.
3. Ejecuta `firebase init apphosting`.
4. Sigue los pasos para conectar con GitHub (es el mismo proceso del código mencionado arriba).

## 📱 Funciones Principales
- **Sin IA (Privacidad Total)**: Tus fotos nunca salen de tu dispositivo hacia ningún servidor; el PDF se construye en tu propia memoria RAM.
- **Menú Completo en Móvil**: Al presionar "Seleccionar", podrás elegir entre Cámara, Galería o tus Archivos.
- **Soporte PDF**: Puedes subir un PDF original y la app extraerá la primera página automáticamente.
- **Limpieza Automática**: Al descargar el PDF, la app se reinicia sola para el siguiente escaneo.

---
Generado con Firebase Studio.
