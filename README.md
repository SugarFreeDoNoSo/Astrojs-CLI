# astrx

A CLI tool for automatically generating components, layouts, and APIs in Astro projects.

## Description

astrx allows you to quickly create components, layouts, and API endpoints following Astro naming conventions and structure, as well as automatically updating pages to include the new elements.

## Features

- Generation of components with proper naming conventions (PascalCase for component names, kebab-case for files)
- Creation of layouts with built-in slots
- Generation of API endpoints with customizable HTTP methods (GET, POST, PUT, DELETE, etc.)
- Automatic updating of existing pages to include new components/layouts
- Automatic page creation if it doesn't exist
- Support for creating multiple items in a single command
- Auto-detection of dynamic route parameters in API endpoints ([param] syntax)
- Support for nested API routes (e.g., 'users/[id]') with automatic directory creation

## Installation

```bash
npm install -g astrx
```

Or use it directly with npx:

```bash
npx astrx [command] [item-names...] [options]
```

## Usage

### Commands and Aliases

astrx supports the following commands with short aliases:

| Full Command    | Alias | Description                  |
|-----------------|-------|------------------------------|
| `add-component` | `-c`  | Create one or more components |
| `add-layout`    | `-l`  | Create one or more layouts    |
| `add-api`       | `-a`  | Create one or more API endpoints |

### Create components

```bash
# Create multiple components
npx astrx add-component Button Card Form

# Using the short alias
npx astrx -c Button Card Form
```

These commands create multiple components in `src/components/`.

### Create components and add to a page

```bash
# Create components and add them to a page
npx astrx add-component Button Card -p contact

# Using the short alias
npx astrx -c Button Card -p contact
```

These commands:
1. Create the components in `src/components/`
2. If the `contact.astro` page exists, add imports and use the components
3. If the page doesn't exist, create it with the components included

### Create layouts

```bash
# Create multiple layouts
npx astrx add-layout MainLayout PostLayout

# Using the short alias
npx astrx -l MainLayout PostLayout
```

These commands create multiple layouts in `src/layouts/`.

### Create layouts and add to a page

```bash
# Create a layout and add it to a page
npx astrx add-layout PostLayout -p blog

# Using the short alias
npx astrx -l PostLayout -p blog
```

These commands:
1. Create the layouts in `src/layouts/`
2. If the specified page exists, add imports and wrap content with the layouts
3. If the page doesn't exist, create it with the layouts included

### Create API endpoints

```bash
# Create API with default GET method
npx astrx add-api UserAPI

# Create API with specific HTTP method
npx astrx add-api UserAPI -m POST

# Create multiple API endpoints
npx astrx add-api UserAPI ProductAPI

# Using the short alias
npx astrx -a UserAPI -m PUT

# Create API with dynamic route parameters
npx astrx add-api users/[id] -m GET

# Create nested API routes
npx astrx add-api blog/posts/[id]/comments -m GET
```

These commands create API endpoints in `src/pages/api/` with the specified HTTP methods. For nested routes like `blog/posts/[id]/comments`, the tool automatically creates all necessary subdirectories.

### Add another HTTP method to an existing API

```bash
# Add PUT method to an existing API
npx astrx add-api UserAPI -m PUT
```

This command adds a PUT method to an existing UserAPI endpoint. If the method already exists, it will show an error.

## Generated Structure

### Components

Components are generated with this structure:

```astro
---
// ComponentName component
---

<div class="component-name">
  <!-- Your content here -->
</div>
```

### Layouts

Layouts are generated with this structure:

```astro
---
// LayoutName layout
---

<div class="layout-name-layout">
  <slot />
</div>
```

### APIs

APIs are generated with the modern Astro API format:

```typescript
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ params, request }) => {
  return new Response(
    JSON.stringify({
      message: 'This is the GET method for API-Name'
    })
  );
};
```

When adding another method to an existing API, it will append the new method:

```typescript
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ params, request }) => {
  return new Response(
    JSON.stringify({
      message: 'This is the GET method for API-Name'
    })
  );
};

export const POST: APIRoute = ({ params, request }) => {
  return new Response(
    JSON.stringify({
      message: 'This is the POST method for API-Name'
    })
  );
};
```

When using dynamic route parameters with [param] syntax, the tool automatically extracts them:

```typescript
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ params, request }) => {
  // Extraer parámetros de la URL
  const id = params.id;

  return new Response(
    JSON.stringify({
      message: 'This is the GET method for users/[id]',
      id
    })
  );
};
```

For nested routes, the same parameter extraction works:

```typescript
// src/pages/api/blog/posts/[id]/comments.ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ params, request }) => {
  // Extraer parámetros de la URL
  const id = params.id;

  return new Response(
    JSON.stringify({
      message: 'This is the GET method for blog/posts/[id]/comments',
      id
    })
  );
};
```

## License

MIT 

## Development & Publication

Este paquete utiliza GitHub Actions para automatizar la publicación en npm. Cada vez que se realiza un push al branch `main`, se ejecuta el siguiente proceso:

1. Se incrementa automáticamente la versión del paquete en +0.0.1 (nivel patch)
2. Se publica el paquete actualizado en npm con acceso público
3. Se actualiza el repositorio con la nueva versión

Para contribuir al desarrollo:

1. Haz fork del repositorio
2. Crea una rama para tu feature: `git checkout -b feature/nueva-funcionalidad`
3. Haz commit de tus cambios: `git commit -am 'Añadir nueva funcionalidad'`
4. Envía tus cambios: `git push origin feature/nueva-funcionalidad`
5. Crea un pull request

### Configuración para mantenedores

Si tienes permisos de administrador del repositorio, necesitas:

1. Configurar un secreto en GitHub:
   - Ve a Settings > Secrets and variables > Actions
   - Añade un secreto llamado `NPM_TOKEN` con tu token de publicación de npm

2. Para obtener un token de npm:
   - Inicia sesión en [npmjs.com](https://www.npmjs.com)
   - Ve a tu perfil > Access Tokens
   - Genera un nuevo token con permisos de publicación (publish) 
