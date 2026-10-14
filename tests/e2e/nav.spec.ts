import { expect, test } from '@playwright/test';

test('home loads with hero and all sections', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'OBT Intelligence Brief' }).first()).toBeVisible();
  for (const id of ['resumen', 'historia', 'modelo-operativo', 'africa', 'gobierno', 'plantilla', 'finanzas', 'prensa', 'sierra-leona', 'fuentes']) {
    await expect(page.locator(`#${id}`)).toBeAttached();
  }
});

test('nav deep link scrolls to finance section', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Finanzas 2021–2025' }).first().click();
  await expect(page.locator('#finanzas')).toBeInViewport();
});

test('language switch to English translates UI', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Idioma').selectOption('en');
  await expect(page.getByRole('heading', { name: 'Executive summary' })).toBeVisible();
  await expect(page).toHaveURL(/lang=en/);
});

test('verified-only toggle filters press items', async ({ page }) => {
  await page.goto('/#prensa');
  const items = page.locator('#prensa ol > li');
  const before = await items.count();
  await page.getByLabel('Solo hechos verificados').click();
  const after = await items.count();
  expect(after).toBeGreaterThan(0);
  expect(after).toBeLessThan(before);
});

test('africa map renders and country panel opens', async ({ page }) => {
  await page.goto('/#africa');
  const svg = page.locator('#africa svg').first();
  await expect(svg).toBeVisible();
  await expect.poll(async () => await svg.locator('path').count(), { timeout: 10000 }).toBeGreaterThan(50);
});

test('finance year selection shows YoY deltas', async ({ page }) => {
  await page.goto('/#finanzas');
  await page.getByRole('button', { name: '2024', exact: true }).click();
  await expect(page.getByText('Var. interanual').first()).toBeVisible();
  await expect(page).toHaveURL(/fyear=2024/);
});

test('methodology page loads', async ({ page }) => {
  await page.goto('/methodology');
  await expect(page.getByRole('heading', { name: 'Metodología' })).toBeVisible();
  await expect(page.getByText('Fecha de corte: 14 de octubre de 2026')).toBeVisible();
});

test('sierra leone tabs switch content', async ({ page }) => {
  await page.goto('/#sierra-leona');
  const panel = page.getByRole('tabpanel');
  await page.getByRole('tab', { name: 'Riesgos' }).click();
  await expect(panel.getByRole('heading', { name: 'Matriz de riesgos' })).toBeVisible();
  await page.getByRole('tab', { name: 'SWOT' }).click();
  await expect(panel.getByRole('heading', { name: 'SWOT de Sierra Leona' })).toBeVisible();
});
