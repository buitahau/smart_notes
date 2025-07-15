import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Smart Notes',
    description: 'Smart Notes Chrome Extension',
    version: '1.0.0',
    permissions: ['storage', 'activeTab'],
  },
});