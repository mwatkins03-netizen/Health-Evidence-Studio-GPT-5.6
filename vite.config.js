import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Relative asset URLs allow the same build to work at a GitHub Pages
  // repository subpath or at a custom domain.
  base: './'
});

