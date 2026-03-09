## OikosFlow

Aplicación móvil híbrida (SPA en React + Vite) para la **organización, asignación y seguimiento de tareas domésticas** en viviendas compartidas.

- **Repositorio**: `https://github.com/Mateo-OZ/Entrega_2-App_hibrida`
- **Prototipo UI/UX**: https://www.figma.com/design/jM5rSgT95T7VvsIEmcKkzN/Wireframes-App-Organizacion-de-Tareas?node-id=0-1&p=f&t=tgBvLP556j3eDq36-0

---

## 1. Propósito del proyecto

En apartamentos compartidos, las tareas domésticas suelen gestionarse de forma informal, lo que genera:

- Confusión sobre responsabilidades.
- Olvidos frecuentes.
- Conflictos interpersonales.
- Percepción de inequidad.

**OikosFlow** busca resolver esto proporcionando:

- Claridad en las responsabilidades.
- Sistema estructurado de asignación de tareas.
- Registro histórico de cumplimiento.
- Recordatorios y notificaciones.
- Transparencia entre convivientes.

Público objetivo:

- Estudiantes universitarios.
- Jóvenes profesionales.
- Personas entre 18 y 35 años que comparten vivienda en arriendo.

---

## 2. Arquitectura y stack

- **Tipo**: Aplicación híbrida frontend (SPA).
- **Framework**: React (con React Router).
- **Bundler**: Vite.
- **Lenguaje**: JavaScript (ES6+).
- **Estilos**: SCSS + CSS modularizado por pantalla.
- **Estado / datos**:
  - Simulación de datos mediante archivos JSON en `src/Data`.
  - Uso de `localStorage` para persistencia simple en el navegador.

Estructura principal:

- `OikosFlow_Project/`
  - `src/`
    - `main.jsx`: punto de entrada de React.
    - `App.jsx`: configuración de rutas y protección de rutas.
    - `Auth/`: pantallas de autenticación.
    - `Home/`: pantalla principal con tabla de usuarios/tareas.
    - `Tarea/`: gestión de tareas.
    - `Historial/`: registro histórico de tareas.
    - `Perfil/`: gestión de datos del usuario.
    - `Notificaciones/`: lista de notificaciones.
    - `Data/`: fuentes de datos simulados (JSON).
  - Configuración: `package.json`, `vite.config.js`, `eslint.config.js`, etc.

Para un mapa detallado de pantallas y rutas, consulta el archivo `DIAGRAMA_FLUJO_OIKOSFLOW.md` en la raíz del repositorio.

---

## 3. Pantallas principales

- **Inicio (`/` y `/auth`)**
  - Logo OikosFlow.
  - Botón **Registro**.
  - Botón **Iniciar Sesión**.
  - Si ya existe un usuario activo en `localStorage`, redirige directamente a **Home**.

- **Registro (`/auth/registro`)**
  - Campos:
    - Nombre completo.
    - Teléfono.
    - Fecha de nacimiento.
    - Correo.
    - Contraseña.

- **Login (`/auth/login`)**
  - Campos:
    - Correo.
    - Contraseña.
  - Opciones:
    - Iniciar sesión.
    - Ir a recuperación de contraseña (SMS / Correo).

- **Recuperar contraseña**
  - `/auth/recuperar-sms`: flujo simulado vía SMS.
  - `/auth/recuperar-correo`: flujo simulado vía correo.

- **Home (`/home`)**
  - Saludo personalizado al usuario activo.
  - Tabla de usuarios/tareas.
  - Estado por tarea:
    - Activo.
    - Inactivo.
    - Deshabilitado.
  - Acciones:
    - Exportar datos a JSON.
    - Importar datos desde JSON.
    - Restaurar el sistema (limpia `localStorage`).
  - Navegación inferior hacia:
    - Home.
    - Tareas.
    - Historial.
    - Perfil.

- **Tareas (`/tareas`)**
  - Secciones:
    - Mis Tareas.
    - Tareas del Hogar.
  - Pantalla de **Añadir Tarea**:
    - Formulario con:
      - Nombre.
      - Tarea.
      - Estado.

- **Historial (`/historial`)**
  - Tabla con el histórico de tareas y estados.
  - Buscador/filtrado.

- **Perfil (`/perfil`)**
  - Campos:
    - Nombre completo.
    - Teléfono.
    - Fecha de nacimiento.
    - Correo.
  - Acciones:
    - Editar datos.
    - Cambiar contraseña.
    - Cerrar sesión (borra el usuario activo y redirige al flujo de autenticación).

- **Notificaciones (`/notificaciones`)**
  - Lista de notificaciones relacionadas con las tareas y eventos del hogar.

---

## 4. Flujo de usuario (resumen)

1. Inicio (`/` o `/auth`).
2. Registro o Login.
3. Home.
4. Gestión de tareas (Home / Tareas).
5. Consulta de historial.
6. Gestión de perfil.
7. Revisión de notificaciones.

El detalle visual del flujo está en `DIAGRAMA_FLUJO_OIKOSFLOW.md` (incluye un diagrama Mermaid con todas las rutas y transiciones).

---

## 5. Instalación y ejecución

### 5.1. Requisitos

- **Node.js** >= 18
- **npm** >= 9

### 5.2. Pasos

```bash
git clone https://github.com/Mateo-OZ/Entrega_2-App_hibrida.git
cd Entrega_2-App_hibrida/OikosFlow_Project
npm install
npm run dev
```

La aplicación se abrirá en modo desarrollo (por defecto en `http://localhost:5173` o el puerto configurado por Vite).

### 5.3. Build de producción

```bash
cd Entrega_2-App_hibrida/OikosFlow_Project
npm run build
```

Para previsualizar el build:

```bash
npm run preview
```

---

## 6. Estado actual del proyecto

- **Nivel**: MVP funcional académico.
- **Implementado**:
  - Navegación básica por vistas.
  - Formularios de autenticación y gestión de datos.
  - Simulación de datos con JSON y `localStorage`.
  - Interfaz completa con diseño basado en prototipo.
  - Estructura modular por pantallas.
- **Pendiente**:
  - Backend real (API REST / GraphQL).
  - Base de datos persistente.
  - Autenticación persistente y robusta (tokens, sesiones, etc.).
  - Notificaciones push reales (p. ej. FCM).
  - Multiusuario real con sincronización entre dispositivos.

---

## 7. Créditos

Proyecto académico de aplicación móvil híbrida desarrollado por:

- Carlos Danilo Vélez Castro  
- Mateo Ortiz Zapata  
- Nicolás Mantilla Gelves  

---

## 8. Scripts de npm disponibles

Desde la carpeta `OikosFlow_Project` puedes utilizar los siguientes scripts:

- `npm run dev`: levanta el servidor de desarrollo con Vite.
- `npm run build`: genera el build de producción.
- `npm run preview`: sirve localmente el build de producción para pruebas.
- `npm run lint`: ejecuta ESLint sobre el proyecto.

---

## 9. Soporte híbrido con Capacitor

El proyecto incluye dependencias de **Capacitor** (`@capacitor/core`, `@capacitor/android`) para facilitar la generación de builds híbridos (Android, iOS) a partir de la SPA en React.

- Para más detalles sobre la configuración de plataformas nativas, consulta la documentación oficial de Capacitor: `https://capacitorjs.com/docs`.
- El flujo típico consiste en:
  - Configurar `capacitor.config.*` según el entorno.
  - Ejecutar los comandos de sincronización (`npx cap sync`) y apertura del proyecto nativo (Android Studio, Xcode).

> Nota: Actualmente el foco principal del proyecto es el **MVP web híbrido**; la publicación en tiendas (Play Store / App Store) no forma parte del alcance académico básico.

---

## 10. Notas para desarrollo local

- **Recomendado** trabajar siempre sobre una rama por funcionalidad para mantener el historial del repositorio limpio.
- Antes de subir cambios, ejecutar `npm run lint` para verificar que no existan problemas básicos de estilo o errores comunes.
- Si el estado de la app parece inconsistente, limpiar `localStorage` desde las herramientas de desarrollo del navegador o usando la opción de **Restaurar el sistema** disponible en la pantalla Home.
- Mantener sincronizados los datos simulados en `src/Data` con los flujos descritos en `DIAGRAMA_FLUJO_OIKOSFLOW.md` para evitar desalineaciones entre UI y lógica.