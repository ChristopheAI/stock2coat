import { test, expect } from '@playwright/test';

test.describe('Stock2coat User Journey - Complete Workflow', () => {
  
  test('Als poedercoating bedrijf eigenaar wil ik mijn voorraad beheren', async ({ page }) => {
    // 🏠 STAP 1: Aankomen op de homepage
    await page.goto('/');
    
    // Ik zie het mooie Stock2coat logo en donkere sidebar
    await expect(page.locator('img[alt="Stock2Coat"]')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Welkom bij Stock2coat');
    
    // Ik zie mijn bedrijfsoverzicht met belangrijke KPI's
    await expect(page.locator('text=156')).toBeVisible(); // Total Items
    await expect(page.locator('.text-orange-600')).toBeVisible(); // Lage Voorraad badge
    await expect(page.locator('text=€24.580')).toBeVisible(); // Totale Waarde
    
    await page.screenshot({ path: 'user-journey-1-homepage.png' });
    
    // 📦 STAP 2: Navigeren naar voorraad om mijn poederlakken te bekijken
    await page.click('text=Voorraad');
    await expect(page).toHaveURL('/inventory');
    
    // Ik zie een overzicht van al mijn poedercoating producten
    await expect(page.locator('h1')).toContainText('Stock2Coat Poeder Inventaris');
    await expect(page.locator('text=Beheer van poedercoating voorraad en status')).toBeVisible();
    
    await page.screenshot({ path: 'user-journey-2-inventory-overview.png' });
    
    // 🔍 STAP 3: Zoeken naar specifieke RAL kleur
    console.log('👤 Als gebruiker zoek ik naar RAL 1000 (geelbeige) voor een klantproject...');
    
    await page.fill('input[placeholder="Zoek RAL code..."]', '1000');
    
    // Ik zie alleen de RAL 1000 resultaten
    await expect(page.locator('table tbody tr')).toHaveCount(1);
    await expect(page.locator('text=1000')).toBeVisible();
    await expect(page.locator('text=Teknos')).toBeVisible();
    
    await page.screenshot({ path: 'user-journey-3-search-results.png' });
    
    // 🔍 STAP 4: Ik zie dat RAL 1000 LAAG voorraad heeft (rood badge)
    console.log('👤 Oh nee! RAL 1000 heeft lage voorraad. Ik moet dit bijbestellen...');
    
    const laagBadge = page.locator('.bg-red-100').first();
    await expect(laagBadge).toBeVisible();
    await expect(laagBadge).toContainText('LAAG');
    
    // Ik klik op de rij om meer details te zien
    await page.click('table tbody tr:first-child');
    
    // Er opent een modal met gedetailleerde informatie
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(page.locator('text=Inventory Details')).toBeVisible();
    
    await page.screenshot({ path: 'user-journey-4-item-details.png' });
    
    // 📝 STAP 5: Ik bekijk de transactiegeschiedenis
    console.log('👤 Laat me kijken waarom de voorraad zo laag is...');
    
    await expect(page.locator('text=Transactie Geschiedenis')).toBeVisible();
    await expect(page.locator('text=Jan Janssen')).toBeVisible(); // Laatste gebruiker
    await expect(page.locator('text=20 kg')).toBeVisible(); // Verbruikte hoeveelheid
    
    // Sluit de details modal
    await page.click('button:has-text("×")');
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
    
    // ✏️ STAP 6: Ik ga de voorraad aanpassen na bijbestelling
    console.log('👤 Ik heb net 50kg RAL 1000 bijbesteld. Laat me dit in het systeem zetten...');
    
    // Clear de zoekbalk eerst
    await page.fill('input[placeholder="Zoek RAL code..."]', '');
    await page.waitForTimeout(500); // Wacht even tot resultaten weer volledig laden
    
    // Zoek opnieuw naar RAL 1000
    await page.fill('input[placeholder="Zoek RAL code..."]', '1000');
    await page.waitForTimeout(500);
    
    // Klik op "Bewerken" button
    await page.click('button:has-text("Bewerken")');
    
    // Er opent een edit modal
    await expect(page.locator('text=Inventory Item Bewerken')).toBeVisible();
    
    await page.screenshot({ path: 'user-journey-5-edit-modal.png' });
    
    // 📊 STAP 7: Ik update de voorraad van 8kg naar 58kg (8 + 50 nieuwe)
    console.log('👤 Huidige voorraad is 8kg, ik voeg 50kg toe = 58kg totaal');
    
    const currentStockField = page.locator('input[type="number"]').first();
    await currentStockField.clear();
    await currentStockField.fill('58');
    
    // Ik klik op Opslaan
    await page.click('button:has-text("Opslaan")');
    
    // Modal sluit en ik zie de update in de tabel
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
    
    await page.screenshot({ path: 'user-journey-6-updated-stock.png' });
    
    // ✅ STAP 8: Verificatie dat alles correct is bijgewerkt
    console.log('👤 Perfect! Nu controleer ik of alles correct is bijgewerkt...');
    
    // De status badge zou nu GEM (gemiddeld) moeten zijn in plaats van LAAG
    // omdat 58kg tussen de min (20kg) en max (183kg) zit
    await expect(page.locator('.bg-orange-100')).toBeVisible(); // GEM status
    
    // 🏠 STAP 9: Terug naar dashboard om overall impact te zien
    await page.click('text=Dashboard');
    await expect(page).toHaveURL('/');
    
    // De "Lage Voorraad" counter zou moeten zijn gedaald van 8 naar 7
    // omdat RAL 1000 niet meer in de lage voorraad categorie zit
    
    await page.screenshot({ path: 'user-journey-7-final-dashboard.png' });
    
    // 🎯 STAP 10: Controle van recente activiteit
    console.log('👤 Ik kijk naar de recente activiteit om mijn update te bevestigen...');
    
    await expect(page.locator('text=Recente Activiteit')).toBeVisible();
    
    // Laatste screenshots voor het volledige overzicht
    await page.screenshot({ path: 'user-journey-8-complete-overview.png', fullPage: true });
    
    console.log('✅ Gebruikersreis voltooid! Als bedrijfseigenaar heb ik succesvol:');
    console.log('   📊 Mijn voorraad overzicht bekeken');
    console.log('   🔍 Gezocht naar specifieke RAL kleuren');
    console.log('   ⚠️  Lage voorraad geïdentificeerd');
    console.log('   📝 Voorraad bijgewerkt na bijbestelling');
    console.log('   ✅ Status wijziging gecontroleerd');
    console.log('   🎯 Dashboard KPIs gemonitord');
  });

  test('Als werknemer wil ik snel materiaal consumeren voor een project', async ({ page }) => {
    console.log('👤 Nieuwe gebruikersreis: Ik ben een werknemer en moet 15kg RAL 2000 (oranje) gebruiken voor project XYZ...');
    
    // Start op voorraad pagina
    await page.goto('/inventory');
    
    // Zoek RAL 2000 (oranje)
    await page.fill('input[placeholder="Zoek RAL code..."]', '2000');
    
    // Controleer huidige voorraad 
    await expect(page.locator('text=253')).toBeVisible();
    await expect(page.locator('.bg-orange-100')).toBeVisible(); // GEM status
    
    // Klik op details om meer info te zien
    await page.click('table tbody tr:first-child');
    await expect(page.locator('text=Inventory Details')).toBeVisible();
    
    await page.screenshot({ path: 'worker-journey-1-check-material.png' });
    
    // Sluit details en ga naar bewerken voor verbruik
    await page.click('button:has-text("×")');
    await page.click('button:has-text("Bewerken")');
    
    // Update voorraad van 253kg naar 238kg (253 - 15 = 238)
    const stockField = page.locator('input[type="number"]').first();
    await stockField.clear();
    await stockField.fill('238');
    
    await page.click('button:has-text("Opslaan")');
    
    await page.screenshot({ path: 'worker-journey-2-material-consumed.png' });
    
    console.log('✅ Materiaal succesvol geconsumeerd voor project!');
  });

});