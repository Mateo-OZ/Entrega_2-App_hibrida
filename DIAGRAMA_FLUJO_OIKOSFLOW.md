## Diagrama de flujo de OikosFlow

Este documento resume el flujo principal de pantallas y datos de la aplicación OikosFlow.

### 1. Diagrama general de navegación

```mermaid
flowchart TD
    A[Inicio /auth & /] -->|Registro| B[Registro /auth/registro]
    A -->|Iniciar sesión| C[Login /auth/login]
    C -->|Login correcto<br/>set localStorage.usuarioActivo| D[Home /home]
    B -->|Registro exitoso| C

    A -->|Ya está logueado<br/>(localStorage.usuarioActivo)| D

    C -->|Olvidé contraseña| E[Recuperar SMS /auth/recuperar-sms]
    C -->|Olvidé contraseña| F[Recuperar Correo /auth/recuperar-correo]

    D -->|Bottom nav| G[Tareas /tareas]
    D -->|Bottom nav| H[Historial /historial]
    D -->|Icono perfil<br/>o bottom nav| I[Perfil /perfil]
    D -->|Icono campana| J[Notificaciones /notificaciones]

    G -->|Bottom nav| D
    G -->|Bottom nav| H
    G -->|Bottom nav| I

    H -->|Bottom nav| D
    H -->|Bottom nav| G
    H -->|Bottom nav| I

    I -->|Bottom nav| D
    I -->|Bottom nav| G
    I -->|Bottom nav| H

    I -->|Cerrar sesión<br/>clear localStorage.usuarioActivo| A

    J -->|Volver| D
```

### 2. Flujo de autenticación y protección de rutas

- **Inicio (`/` y `/auth`)**:
  - Si **no** hay `localStorage.usuarioActivo`, muestra:
    - Botón **Registro** → `/auth/registro`.
    - Botón **Iniciar Sesión** → `/auth/login`.
  - Si **sí** hay `localStorage.usuarioActivo`, redirige automáticamente a `/home`.

- **Registro (`/auth/registro`)**:
  - El usuario completa sus datos.
  - Tras un registro correcto, se redirige normalmente al **Login** para autenticar.

- **Login (`/auth/login`)**:
  - Al validar credenciales:
    - Guarda los datos del usuario en `localStorage.usuarioActivo`.
    - Redirige a **Home** (`/home`).
  - Si el usuario no recuerda la contraseña, puede ir a:
    - **Recuperar por SMS** (`/auth/recuperar-sms`).
    - **Recuperar por Correo** (`/auth/recuperar-correo`).

- **Protección de rutas internas**:
  - Las rutas `/home`, `/tareas`, `/historial` y `/perfil` están envueltas en `RequireAuth`.
  - `RequireAuth`:
    - Revisa si existe `localStorage.usuarioActivo`.
    - Si existe → muestra la página interna.
    - Si no existe → redirige a `/auth`.

- **Salida de la app**:
  - Al recargar o cerrar la pestaña, se ejecuta un `beforeunload` que elimina `localStorage.usuarioActivo`.
  - Eso obliga a volver a autenticarse la próxima vez.

### 3. Flujo dentro de Home y manejo de datos

- **Home (`/home`)**:
  - Carga lista de miembros/tareas desde:
    - `localStorage.members` (si existe), o
    - `src/Data/home_datos.json` como valor inicial.
  - Muestra:
    - Saludo al usuario (`nombre_completo` de `usuarioActivo` o "Invitado").
    - Tabla de tareas con campo `Estado` (Activo / Inactivo / Deshabilitado).
  - Permite:
    - **Descargar JSON**: exporta el estado actual de `members` a `home_backup.json`.
    - **Subir JSON**: importa un archivo `.json` y reemplaza `members`.
    - **Restaurar sistema**: hace `localStorage.clear()` y recarga la página.
  - Navegación inferior:
    - Home (`/home`), Tareas (`/tareas`), Historial (`/historial`), Perfil (`/perfil`).

### 4. Flujo de Tareas, Historial y Perfil

- **Tareas (`/tareas`)**:
  - Usa los datos de `tareas_datos.json` y/o `localStorage` para:
    - Mostrar **Mis Tareas** y **Tareas del Hogar**.
    - Añadir nuevas tareas (Nombre, Tarea, Estado).
  - Forma parte del mismo menú inferior que Home.

- **Historial (`/historial`)**:
  - Usa `historial_datos.json` y/o datos guardados para:
    - Mostrar el registro de tareas realizadas.
    - Permitir buscar/filtrar dentro del historial.

- **Perfil (`/perfil`)**:
  - Muestra y edita datos del usuario:
    - Nombre completo, Teléfono, Fecha de nacimiento, Correo.
  - Acciones:
    - **Editar** datos.
    - **Cambiar contraseña**.
    - **Cerrar sesión**:
      - Borra `localStorage.usuarioActivo`.
      - Redirige al flujo de autenticación (Inicio).

### 5. Notificaciones

- **Notificaciones (`/notificaciones`)**:
  - Muestra una lista de avisos relacionados con:
    - Recordatorios de tareas.
    - Cambios de estado.
  - Normalmente se accede desde:
    - El icono de campana en la parte superior de Home.

