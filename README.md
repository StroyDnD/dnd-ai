# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```

## API and Template System

The application now includes an API integration with OpenAI to generate stories based on user inputs using a template system.

### Setup

1. Copy `.env.example` to `.env`:
   ```
   cp .env.example .env
   ```

2. Edit `.env` and add your OpenAI API key:
   ```
   VITE_OPENAI_API_KEY=your_actual_key_here
   ```

### How It Works

1. **Templates**: The system uses templates to format user inputs into prompts for the LLM.
   - Templates are defined by genre in `src/lib/templates/`
   - SciFi templates are currently implemented, with a structure for adding other genres

2. **API Services**: OpenAI integration is handled through service classes:
   - `OpenAIService`: Interacts directly with OpenAI API
   - `StoryService`: Combines templates with API calls to generate stories

3. **User Flow**:
   - User selects a genre and answers prompt questions
   - System uses answers to fill a template
   - Template is sent to OpenAI to generate a story
   - Generated story is displayed to the user

### Extending the System

To add support for new genres:

1. Create a new template file in `src/lib/templates/` (e.g., `mystery.ts`)
2. Define the prompt answers interface and template generator function
3. Add the new genre to the `TemplateMap` in `src/lib/templates/index.ts`
4. Update the `StoryService` to support the new genre

Future plans include support for AI-generated illustrations.
