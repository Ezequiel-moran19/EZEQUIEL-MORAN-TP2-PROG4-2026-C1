import { test, expect } from '@playwright/test';

test('Login correcto', async ({ page }) => {

  await page.goto('https://ezequiel-moran-tp-2-prog-4-2026-fro.vercel.app');

  await page.fill('#usuario', 'Palandri01');

  await page.fill(
    'input[formControlName="password"]',
    'Palandri01'
  );

  await page.click('button.btn-primary');

  await expect(page).toHaveURL(/publicaciones/);

  await page.waitForTimeout(5000); // mantiene abierta la página 5 segundos

})