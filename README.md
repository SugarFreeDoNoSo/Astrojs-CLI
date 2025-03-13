# Astro-Craft

A CLI tool for automatically generating components, layouts, and APIs in Astro projects.

## Description

Astro-Craft allows you to quickly create components, layouts, and API endpoints following Astro naming conventions and structure, as well as automatically updating pages to include the new elements.

## Features

- Generation of components with proper naming conventions (PascalCase for component names, kebab-case for files)
- Creation of layouts with built-in slots
- Generation of API endpoints with customizable HTTP methods (GET, POST, PUT, DELETE, etc.)
- Automatic updating of existing pages to include new components/layouts
- Automatic page creation if it doesn't exist
- Support for creating multiple items in a single command

## Installation

```bash
npm install -g astro-craft
```

Or use it directly with npx:

```bash
npx astro-craft [command] [item-names...] [options]
```

## Usage

### Commands and Aliases

Astro-Craft supports the following commands with short aliases:

| Full Command    | Alias | Description                  |
|-----------------|-------|------------------------------|
| `add-component` | `-c`  | Create one or more components |
| `add-layout`    | `-l`  | Create one or more layouts    |
| `add-api`       | `-a`  | Create one or more API endpoints |

### Create components

```bash
# Create multiple components
npx astro-craft add-component Button Card Form

# Using the short alias
npx astro-craft -c Button Card Form
```

These commands create multiple components in `src/components/`.

### Create components and add to a page

```bash
# Create components and add them to a page
npx astro-craft add-component Button Card -p contact

# Using the short alias
npx astro-craft -c Button Card -p contact
```

These commands:
1. Create the components in `src/components/`
2. If the `contact.astro` page exists, add imports and use the components
3. If the page doesn't exist, create it with the components included

### Create layouts

```bash
# Create multiple layouts
npx astro-craft add-layout MainLayout PostLayout

# Using the short alias
npx astro-craft -l MainLayout PostLayout
```

These commands create multiple layouts in `src/layouts/`.

### Create layouts and add to a page

```bash
# Create a layout and add it to a page
npx astro-craft add-layout PostLayout -p blog

# Using the short alias
npx astro-craft -l PostLayout -p blog
```

These commands:
1. Create the layouts in `src/layouts/`
2. If the specified page exists, add imports and wrap content with the layouts
3. If the page doesn't exist, create it with the layouts included

### Create API endpoints

```bash
# Create API with default GET method
npx astro-craft add-api UserAPI

# Create API with specific HTTP method
npx astro-craft add-api UserAPI -m POST

# Create multiple API endpoints
npx astro-craft add-api UserAPI ProductAPI

# Using the short alias
npx astro-craft -a UserAPI -m PUT
```

These commands create API endpoints in `src/pages/api/` with the specified HTTP methods.

### Add another HTTP method to an existing API

```bash
# Add PUT method to an existing API
npx astro-craft add-api UserAPI -m PUT
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

## License

MIT 