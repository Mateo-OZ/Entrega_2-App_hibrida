# OikosFlow

Aplicación móvil híbrida para la organización, asignación y seguimiento
de tareas domésticas en viviendas compartidas.

Repositorio: https://github.com/Mateo-OZ/Entrega_2-App_hibrida

Prototipo UI/UX:
https://www.figma.com/design/jM5rSgT95T7VvsIEmcKkzN/Wireframes-App-Organizacion-de-Tareas

------------------------------------------------------------------------

# 1. Propósito del Proyecto

OikosFlow resuelve la falta de organización y seguimiento en la
distribución de tareas domésticas dentro de apartamentos compartidos.

La aplicación introduce:

-   Claridad en responsabilidades
-   Sistema estructurado de asignación
-   Registro histórico de cumplimiento
-   Recordatorios
-   Transparencia entre convivientes

------------------------------------------------------------------------

# 2. Problema Identificado

En viviendas compartidas, las tareas suelen gestionarse de forma
informal, lo que genera:

-   Confusión sobre responsabilidades
-   Olvido frecuente
-   Conflictos interpersonales
-   Percepción de inequidad

Insight central:

Las personas no evitan tareas por irresponsabilidad, sino por
desorganización y falta de acuerdos claros.

------------------------------------------------------------------------

# 3. Público Objetivo

-   Estudiantes universitarios
-   Jóvenes profesionales
-   Personas entre 18 y 35 años
-   Usuarios con acceso frecuente a smartphone
-   Convivientes en arriendo compartido

------------------------------------------------------------------------

# 4. Arquitectura General

Tipo: Aplicación híbrida frontend\
Stack:

-   React
-   Vite
-   JavaScript (ES6+)
-   SCSS

Arquitectura: SPA (Single Page Application) con navegación por vistas
internas.

------------------------------------------------------------------------

# 5. Estructura de Pantallas

## Inicio

-   Logo OikosFlow
-   Botón Registro
-   Botón Iniciar Sesión

## Registro

Campos: - Nombre completo - Teléfono - Fecha de nacimiento - Correo -
Contraseña

## Login

Campos: - Correo - Contraseña Opciones: - Iniciar sesión - Olvidé
contraseña

## Recuperar Contraseña

-   Recuperación por SMS
-   Recuperación por Gmail

## Estado de Conexión

-   Sin conexión
-   Con conexión activa

## Home

-   Saludo personalizado
-   Tabla de usuarios/tareas
-   Estado (Active / Inactive / Disabled)
-   Exportar / Importar
-   Navegación inferior

## Tareas

-   Mis Tareas
-   Tareas del Hogar
-   Añadir Tarea

## Añadir Tarea

Formulario: - Nombre - Tarea - Estado

## Historial

-   Tabla con estado
-   Buscador

## Perfil

Campos: - Nombre completo - Teléfono - Fecha de nacimiento - Correo
Acciones: - Editar - Cambiar contraseña - Cerrar sesión

## Notificaciones

-   Lista de notificaciones

------------------------------------------------------------------------

# 6. Flujo del Usuario

1.  Inicio
2.  Registro o Login
3.  Home
4.  Gestión de tareas
5.  Registro en historial
6.  Gestión de perfil
7.  Notificaciones

------------------------------------------------------------------------

# 7. Instalación

Requisitos: - Node.js \>= 18 - npm \>= 9

Instalación:

git clone https://github.com/Mateo-OZ/Entrega_2-App_hibrida.git\
cd Entrega_2-App_hibrida/OikosFlow_Project\
npm install\
npm run dev

Build producción:

npm run build

------------------------------------------------------------------------

# 8. Estado Actual

Nivel: MVP funcional académico

Implementado: - Navegación básica - Formularios - Simulación de datos -
Interfaz completa - Estructura modular

Pendiente: - Backend real - Base de datos - Autenticación persistente -
Notificaciones push reales - Multiusuario real

------------------------------------------------------------------------

# 9. Créditos

Carlos Danilo Vélez Castro\
Mateo Ortiz Zapata\
Nicolás Mantilla Gelves

Proyecto académico de aplicación móvil híbrida.
