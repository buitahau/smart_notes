import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { readFileSync, writeFileSync, copyFileSync, mkdirSync, existsSync } from 'fs';

// Simple function to copy files after build
const copyAssets = () => ({
  name: 'copy-assets',
  writeBundle() {
    const manifestPath = resolve(__dirname, 'manifest.json');
    const destPath = resolve(__dirname, 'dist/manifest.json');
    const assetsPath = resolve(__dirname, 'src/assets');
    
    // Ensure dist directory exists
    if (!existsSync(resolve(__dirname, 'dist'))) {
      mkdirSync(resolve(__dirname, 'dist'), { recursive: true });
    }
    
    // Copy manifest file
    if (existsSync(manifestPath)) {
      // Read and update manifest to point to correct background script path
      const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
      manifest.background.service_worker = 'assets/background.js';
      writeFileSync(destPath, JSON.stringify(manifest, null, 2));
      console.log('Manifest file processed and copied successfully!');
    } else {
      console.error('Manifest file not found at:', manifestPath);
    }

    // Copy icon files
    const icons = ['icon16.png', 'icon32.png', 'icon48.png', 'icon128.png'];
    const distAssetsPath = resolve(__dirname, 'dist/assets');
    if (!existsSync(distAssetsPath)) {
      mkdirSync(distAssetsPath, { recursive: true });
    }
    
    icons.forEach(icon => {
      const iconPath = resolve(assetsPath, icon);
      const destIconPath = resolve(distAssetsPath, icon);
      
      if (existsSync(iconPath)) {
        copyFileSync(iconPath, destIconPath);
        console.log(`Icon file ${icon} copied successfully!`);
      } else {
        console.error(`Icon file not found at: ${iconPath}`);
      }
    });
  }
});

export default defineConfig({
  base: './',
  plugins: [
    react(),
    copyAssets()
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        background: resolve(__dirname, 'src/background.ts')
      },
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  }
});
