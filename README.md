# Bank Products Frontend

Este repositorio contiene la aplicación frontend Angular para el proyecto de productos financieros.

## Estructura del proyecto

- `client/` - aplicación Angular independiente
- `repo-interview-main/` - código adicional separado (no es parte directa del cliente Angular)

### Arquitectura principal del cliente

- `client/src/app/app.routes.ts` - define las rutas de la aplicación y carga perezosa de páginas
- `client/src/app/core/` - servicios y modelos compartidos
  - `services/product.ts` - lógica de comunicación HTTP con la API de productos
  - `models/api-response.model.ts`, `models/api-error.model.ts` - tipos de respuesta de API
- `client/src/app/features/products/` - funcionalidad de productos financieros
  - `models/` - definiciones de tipos de producto, creación y actualización
  - `validators/` - validadores personalizados para formularios
  - `components/` - componentes reutilizables
    - `product-form/` - formulario reutilizable de creación/edición
    - `product-table/` - tabla de productos con acciones de editar/eliminar
  - `pages/` - páginas principales del flujo de productos
    - `product-list/` - listado, búsqueda, paginación y borrado
    - `product-create/` - formulario de creación de productos
    - `product-edit/` - edición de productos existentes
- `client/src/app/shared/components/confirm-modal/` - modal de confirmación para acciones destructivas
- `client/src/environments/` - configuración de entornos de Angular

## Requisitos previos

- Node.js 20+ recomendado
- npm 10+

## Instalación

```bash
cd client
npm install
```

## Ejecutar la aplicación en modo desarrollo

```bash
cd client
npm start
```

Luego abre el navegador en `http://localhost:4200/`.

## Ejecutar pruebas unitarias

```bash
cd client
npm test -- --watch=false
```

Las pruebas usan Vitest junto con el soporte Angular del CLI.

## Construir para producción

```bash
cd client
npm run build
```

El resultado se genera en `client/dist/`.

## Cobertura y pruebas relevantes

- `client/src/app/core/services/product.spec.ts` - pruebas del servicio HTTP de productos
- `client/src/app/features/products/components/product-form/product-form.spec.ts` - pruebas del formulario de producto
- `client/src/app/features/products/pages/product-edit/product-edit.spec.ts` - pruebas de la edición de producto
- `client/src/app/features/products/pages/product-list/product-list.spec.ts` - pruebas de listado, búsqueda y eliminación

## Notas de arquitectura

- La app usa componentes standalone de Angular 21.
- El flujo de datos se basa en formularios reactivos (`ReactiveFormsModule`).
- El servicio `ProductService` encapsula llamadas a la API REST sobre `/bp/products`.
- Las páginas de productos usan señales (`signal`, `computed`) para manejar estado local.
