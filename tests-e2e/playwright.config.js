const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: '.',
  testMatch: '**/*.test.ts',

  reporter: [
    ['html'],
    ['list']
  ],

  use: {
    baseURL: 'https://ezequiel-moran-tp-2-prog-4-2026-fro.vercel.app',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure'
  }
});