import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // @dale/ui is linked from ../.. : use this app's single copy of React.
  resolve: { dedupe: ['react', 'react-dom'] },
});
