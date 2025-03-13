#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

// Function to capitalize the first letter
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Function to convert to camelCase
function toCamelCase(str) {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

// Function to convert to PascalCase (for components)
function toPascalCase(str) {
  const camelCase = toCamelCase(str);
  return capitalize(camelCase);
}

// Function to convert to kebab-case (for files)
function toKebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase();
}

// Create directory if it doesn't exist
function ensureDirExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Directory created: ${dir}`);
  }
}

// Create a component
function createComponent(componentName) {
  const componentDir = path.join(process.cwd(), 'src/components');
  ensureDirExists(componentDir);
  
  const fileName = `${toKebabCase(componentName)}.astro`;
  const filePath = path.join(componentDir, fileName);
  
  const componentContent = `---
// ${toPascalCase(componentName)} component
---

<div class="${toKebabCase(componentName)}">
  <!-- Your content here -->
</div>
`;

  fs.writeFileSync(filePath, componentContent);
  console.log(`Component created: ${filePath}`);
  return fileName;
}

// Create a layout
function createLayout(layoutName) {
  const layoutDir = path.join(process.cwd(), 'src/layouts');
  ensureDirExists(layoutDir);
  
  const fileName = `${toPascalCase(layoutName)}.astro`;
  const filePath = path.join(layoutDir, fileName);
  
  const layoutContent = `---
// ${toPascalCase(layoutName)} layout
---

<div class="${toKebabCase(layoutName)}-layout">
  <slot />
</div>

`;

  fs.writeFileSync(filePath, layoutContent);
  console.log(`Layout created: ${filePath}`);
  return fileName;
}

// Create an API or update existing API
function createApi(apiName, methodParam = 'GET') {
  const apiDir = path.join(process.cwd(), 'src/pages/api');
  ensureDirExists(apiDir);
  
  const fileName = `${toKebabCase(apiName)}.ts`;
  const filePath = path.join(apiDir, fileName);
  
  // Convert method to uppercase
  const method = methodParam.toUpperCase();
  
  // Only allow valid HTTP methods
  const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'];
  if (!validMethods.includes(method)) {
    console.error(`Invalid HTTP method: ${method}. Must be one of: ${validMethods.join(', ')}`);
    process.exit(1);
  }
  
  // Check if file already exists
  if (fs.existsSync(filePath)) {
    // Read the file content
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if the method is already defined
    const methodRegex = new RegExp(`export const ${method}\\s*:\\s*APIRoute`);
    if (methodRegex.test(content)) {
      console.error(`Error: Method ${method} already exists in ${filePath}`);
      process.exit(1);
    }
    
    // Add the new method to the existing file
    const newMethodContent = `
export const ${method}: APIRoute = ({ params, request }) => {
  return new Response(
    JSON.stringify({
      message: 'This is the ${method} method for ${apiName}'
    })
  );
};`;
    
    // Check if the import statement exists
    if (!content.includes('import type { APIRoute } from \'astro\';')) {
      // Add the import statement and the new method
      const updatedContent = `import type { APIRoute } from 'astro';\n${content}${newMethodContent}`;
      fs.writeFileSync(filePath, updatedContent);
    } else {
      // Just add the new method
      fs.writeFileSync(filePath, content + newMethodContent);
    }
    
    console.log(`API endpoint ${method} added to ${filePath}`);
  } else {
    // Create a new file with the specified method
    const apiContent = `import type { APIRoute } from 'astro';

export const ${method}: APIRoute = ({ params, request }) => {
  return new Response(
    JSON.stringify({
      message: 'This is the ${method} method for ${apiName}'
    })
  );
};
`;
    
    fs.writeFileSync(filePath, apiContent);
    console.log(`API endpoint created: ${filePath} with ${method} method`);
  }
  
  return fileName;
}

// Update a page with a new component or layout
function updatePage(pageName, itemType, itemName) {
  const pagesDir = path.join(process.cwd(), 'src/pages');
  ensureDirExists(pagesDir);
  
  const pageFile = `${toKebabCase(pageName)}.astro`;
  const pagePath = path.join(pagesDir, pageFile);
  
  // If the page doesn't exist, create it
  if (!fs.existsSync(pagePath)) {
    const pageContent = `---
import Layout from '@layouts/Layout.astro';
${itemType === 'component' 
  ? `import ${toPascalCase(itemName)} from '@components/${toKebabCase(itemName)}.astro';`
  : `import ${toPascalCase(itemName)} from '@layouts/${toPascalCase(itemName)}.astro';`}
---

<Layout>
  <h1>${capitalize(pageName)}</h1>
  ${itemType === 'component' 
    ? `<${toPascalCase(itemName)} />`
    : `<${toPascalCase(itemName)}>\n  <!-- Page content -->\n</${toPascalCase(itemName)}>`}
</Layout>
`;
    fs.writeFileSync(pagePath, pageContent);
    console.log(`Page created: ${pagePath}`);
  } else {
    // Update existing page
    let content = fs.readFileSync(pagePath, 'utf8');
    const frontmatterEnd = content.indexOf('---', 3);
    
    // Add import if it doesn't exist
    let importStatement = '';
    if (itemType === 'component') {
      importStatement = `import ${toPascalCase(itemName)} from '@components/${toKebabCase(itemName)}.astro';`;
    } else {
      importStatement = `import ${toPascalCase(itemName)} from '@layouts/${toPascalCase(itemName)}.astro';`;
    }
    
    if (!content.includes(importStatement)) {
      const frontmatter = content.substring(0, frontmatterEnd);
      const restOfContent = content.substring(frontmatterEnd);
      
      content = `${frontmatter}${importStatement}\n${restOfContent}`;
    }
    
    // Insert component or layout usage before Layout closing tag
    if (itemType === 'component' && !content.includes(`<${toPascalCase(itemName)}`)) {
      content = content.replace('</Layout>', `  <${toPascalCase(itemName)} />\n</Layout>`);
    } else if (itemType === 'layout' && !content.includes(`<${toPascalCase(itemName)}`)) {
      // For layouts, replace content within the main Layout
      content = content.replace(/<Layout>([\s\S]*?)<\/Layout>/m, `<Layout>\n  <${toPascalCase(itemName)}>\n$1  </${toPascalCase(itemName)}>\n</Layout>`);
    }
    
    fs.writeFileSync(pagePath, content);
    console.log(`Page updated: ${pagePath}`);
  }
}

// Parse arguments
function parseArgs(args) {
  const result = {
    command: '',
    items: [],
    pageName: null,
    apiMethod: 'GET'
  };
  
  // Extract the command
  result.command = args[0];
  
  // Process remaining arguments
  let i = 1;
  while (i < args.length) {
    if (args[i] === '-p' || args[i] === '--page') {
      // Next argument is page name
      if (i + 1 < args.length) {
        result.pageName = args[i + 1];
        i += 2;
      } else {
        console.error('Error: Missing page name after -p/--page flag');
        process.exit(1);
      }
    } else if (args[i] === '-m' || args[i] === '--method') {
      // Next argument is HTTP method for API
      if (i + 1 < args.length) {
        result.apiMethod = args[i + 1];
        i += 2;
      } else {
        console.error('Error: Missing HTTP method after -m/--method flag');
        process.exit(1);
      }
    } else {
      // It's an item name
      result.items.push(args[i]);
      i += 1;
    }
  }
  
  return result;
}

// Main function
function main() {
  const args = process.argv.slice(2);
  
  // Map command aliases to full commands
  const commandMap = {
    '-c': 'add-component',
    '-l': 'add-layout',
    '-a': 'add-api'
  };
  
  // If no arguments or help requested
  if (args.length === 0 || args[0] === '-h' || args[0] === '--help') {
    console.log(`
Astro-Craft - A tool for generating Astro components, layouts, and APIs

Usage: npx astro-craft [command] [item-names...] [options]

Commands:
  add-component, -c [item-names...]  - Create new component(s)
  add-layout, -l [item-names...]     - Create new layout(s)
  add-api, -a [item-names...]        - Create new API endpoint(s)

Options:
  -p, --page [page-name]             - Page to add items to
  -m, --method [http-method]         - HTTP method for API (default: GET)
  -h, --help                         - Show this help message

Examples:
  npx astro-craft add-component Button Card -p home     - Create components and add to page
  npx astro-craft -c Button Card                        - Create components only
  npx astro-craft add-layout MainLayout -p about        - Create layout and add to page
  npx astro-craft add-api UserAPI -m POST               - Create API endpoint with POST method
  npx astro-craft -a UserAPI ProductAPI                 - Create multiple API endpoints
    `);
    process.exit(0);
  }
  
  // Map alias to full command name if needed
  let command = args[0];
  if (commandMap[command]) {
    command = commandMap[command];
    args[0] = command; // Replace the alias with the full command
  }
  
  // Parse arguments
  const parsedArgs = parseArgs(args);
  
  // Validate arguments
  if (parsedArgs.items.length === 0) {
    console.error('Error: At least one item name is required');
    process.exit(1);
  }
  
  try {
    // Process based on command
    if (parsedArgs.command === 'add-component' || parsedArgs.command === '-c') {
      // Create each component
      for (const item of parsedArgs.items) {
        const fileName = createComponent(item);
        // Update page if specified
        if (parsedArgs.pageName) {
          updatePage(parsedArgs.pageName, 'component', item);
        }
      }
    } else if (parsedArgs.command === 'add-layout' || parsedArgs.command === '-l') {
      // Create each layout
      for (const item of parsedArgs.items) {
        const fileName = createLayout(item);
        // Update page if specified
        if (parsedArgs.pageName) {
          updatePage(parsedArgs.pageName, 'layout', item);
        }
      }
    } else if (parsedArgs.command === 'add-api' || parsedArgs.command === '-a') {
      // Create each API
      for (const item of parsedArgs.items) {
        const fileName = createApi(item, parsedArgs.apiMethod);
      }
    } else {
      console.log(`Unknown command: ${parsedArgs.command}. Use add-component (-c), add-layout (-l), or add-api (-a).`);
      process.exit(1);
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main(); 