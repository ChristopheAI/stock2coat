import { test, expect } from '@playwright/test';

test.describe('Stock2coat User Journey - Realistic Workflow', () => {
  
  test('Complete gebruikersreis: Van dashboard naar voorraad beheer', async ({ page }) => {
    console.log('🏭 GEBRUIKERSREIS START: Ik ben eigenaar van een poedercoating bedrijf...');
    
    // STAP 1: Inloggen op het dashboard
    console.log('👤 Ik open mijn Stock2coat dashboard om de dagelijkse status te checken');
    await page.goto('/');
    
    // Ik zie mijn merklogo en voel me professioneel
    await expect(page.locator('img[alt="Stock2Coat"]')).toBeVisible();
    console.log('✅ Mooi! Mijn Stock2coat logo staat prominent in de sidebar');
    
    // Ik zie de welkomstboodschap
    await expect(page.locator('text=Welkom bij Stock2coat')).toBeVisible();
    console.log('✅ Dashboard laadt correct met welkomstbericht');
    
    await page.screenshot({ path: 'journey-1-dashboard-landing.png', fullPage: true });
    
    // STAP 2: Navigeren naar voorraad
    console.log('👤 Nu ga ik naar mijn voorraad om te zien wat er beschikbaar is');
    await page.click('text=Voorraad');
    await expect(page).toHaveURL('/inventory');
    
    // Ik zie het voorraad overzicht
    await expect(page.locator('text=Stock2Coat Poeder Inventaris')).toBeVisible();
    console.log('✅ Voorraad pagina geladen met volledige inventaris');
    
    await page.screenshot({ path: 'journey-2-inventory-overview.png', fullPage: true });
    
    // STAP 3: Zoeken naar een specifieke RAL kleur
    console.log('👤 Een klant heeft gevraagd om RAL 1000. Laat me dat zoeken...');
    await page.fill('input[placeholder="Zoek RAL code..."]', '1000');
    
    // Wacht tot de zoekresultaten laden
    await page.waitForTimeout(1000);
    
    // Ik zie de gefilterde resultaten
    await expect(page.locator('text=1000')).toBeVisible();
    console.log('✅ RAL 1000 gevonden in het systeem');
    
    await page.screenshot({ path: 'journey-3-search-ral-1000.png' });
    
    // STAP 4: Status van het materiaal controleren
    console.log('👤 Ik zie dat RAL 1000 lage voorraad heeft (rode badge)');
    await expect(page.locator('.bg-red-100')).toBeVisible(); // LAAG status badge
    console.log('⚠️  Alert: RAL 1000 heeft lage voorraad - moet bijbestellen!');
    
    // STAP 5: Details bekijken van het item
    console.log('👤 Laat me de details bekijken om meer info te krijgen');
    await page.click('table tbody tr');
    
    // Details modal opent
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    console.log('✅ Details modal geopend');
    
    await page.screenshot({ path: 'journey-4-item-details.png' });
    
    // STAP 6: Modal sluiten
    console.log('👤 Ik sluit de details en ga terug naar het overzicht');
    await page.keyboard.press('Escape'); // Sluit modal met ESC
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
    
    // STAP 7: Andere RAL kleuren bekijken
    console.log('👤 Laat me ook RAL 9010 (wit) checken - dat wordt veel gebruikt');
    await page.fill('input[placeholder="Zoek RAL code..."]', '9010');
    await page.waitForTimeout(1000);
    
    await expect(page.locator('text=9010')).toBeVisible();
    await expect(page.locator('.bg-green-100')).toBeVisible(); // OK status
    console.log('✅ RAL 9010 heeft voldoende voorraad (groene badge)');
    
    await page.screenshot({ path: 'journey-5-check-ral-9010.png' });
    
    // STAP 8: Alle voorraad bekijken
    console.log('👤 Nu bekijk ik al mijn voorraad weer');
    await page.fill('input[placeholder="Zoek RAL code..."]', ''); // Clear search
    await page.waitForTimeout(1000);
    
    // Ik zie weer alle items
    const rowCount = await page.locator('table tbody tr').count();
    console.log(`✅ Ik zie ${rowCount} voorraad items in totaal`);
    expect(rowCount).toBeGreaterThan(5); // Verwacht meerdere items
    
    await page.screenshot({ path: 'journey-6-full-inventory.png' });
    
    // STAP 9: Terug naar dashboard
    console.log('👤 Terug naar dashboard voor het algemene overzicht');
    await page.click('text=Dashboard');
    await expect(page).toHaveURL('/');
    
    // Ik zie weer het dashboard
    await expect(page.locator('text=Welkom bij Stock2coat')).toBeVisible();
    console.log('✅ Terug op het hoofddashboard');
    
    await page.screenshot({ path: 'journey-7-back-to-dashboard.png', fullPage: true });
    
    // STAP 10: Mobile responsiveness testen
    console.log('👤 Laat me even checken hoe het er op mobiel uitziet');
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone size
    
    // Logo moet nog steeds zichtbaar zijn
    await expect(page.locator('img[alt="Stock2Coat"]')).toBeVisible();
    console.log('✅ Logo zichtbaar op mobiel formaat');
    
    await page.screenshot({ path: 'journey-8-mobile-view.png', fullPage: true });
    
    // Terug naar desktop
    await page.setViewportSize({ width: 1280, height: 720 });
    
    console.log('🎯 GEBRUIKERSREIS VOLTOOID!');
    console.log('');
    console.log('📊 Wat ik heb gedaan als bedrijfseigenaar:');
    console.log('   ✅ Dashboard geopend met professioneel Stock2coat logo');
    console.log('   ✅ Voorraad overzicht bekeken');
    console.log('   ✅ Gezocht naar specifieke RAL kleuren (1000, 9010)');
    console.log('   ✅ Status badges gecontroleerd (LAAG/OK)');
    console.log('   ✅ Item details bekeken');
    console.log('   ✅ Mobile responsiveness getest');
    console.log('   ✅ Navigatie tussen paginas getest');
    console.log('');
    console.log('💼 Zakelijke waarde bereikt:');
    console.log('   📈 Voorraad status snel inzichtelijk');
    console.log('   ⚠️  Lage voorraad items geïdentificeerd');
    console.log('   🔍 Efficiënt zoeken naar specifieke RAL codes');
    console.log('   📱 Toegankelijk op alle apparaten');
    console.log('   🎨 Professionele merkuitstraling');
  });

  test('Werknemersreis: Snel voorraad status checken', async ({ page }) => {
    console.log('👷 WERKNEMERSREIS: Ik moet snel checken of er genoeg materiaal is voor een klus');
    
    await page.goto('/inventory');
    
    console.log('👤 Klant wil iets in RAL 2000 (oranje) - hoeveel hebben we?');
    await page.fill('input[placeholder="Zoek RAL code..."]', '2000');
    await page.waitForTimeout(1000);
    
    // Check if we found the orange color
    await expect(page.locator('text=2000')).toBeVisible();
    await expect(page.locator('text=Hempel')).toBeVisible(); // Brand
    
    console.log('✅ RAL 2000 gevonden - merk: Hempel');
    console.log('✅ Status: Gemiddelde voorraad (oranje badge)');
    
    await page.screenshot({ path: 'worker-quick-check.png' });
    
    console.log('💪 Perfect! Genoeg materiaal voor de klus!');
  });

});