import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://app:4200',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
