#!/usr/bin/env node

/**
 * CardMarket Price Merger Script
 * 
 * Downloads CardMarket pricing data and merges it with the existing
 * TCGPlayer consolidated data, matching cards by name.
 * 
 * Usage:
 *   npm run merge-cardmarket
 *   or
 *   node scripts/mergeCardMarketPrices.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CardMarket API URLs for Riftbound (game ID 22)
const CARDMARKET_PRODUCTS_URL = 'https://downloads.s3.cardmarket.com/productCatalog/productList/products_singles_22.json';
const CARDMARKET_PRICES_URL = 'https://downloads.s3.cardmarket.com/productCatalog/priceGuide/price_guide_22.json';

// Paths
const CONSOLIDATED_DATA_PATH = path.join(__dirname, '..', 'public', 'price-guide', 'consolidated-data.json');
const CARDMARKET_CACHE_DIR = path.join(__dirname, '..', 'public', 'price-guide', 'cardmarketprices');

/**
 * Normalize a card name for matching
 */
function normalizeCardName(name) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '') // Remove special characters
        .replace(/\s+/g, ' ')        // Normalize whitespace
        .trim();
}

/**
 * Fetch JSON from a URL
 */
async function fetchJSON(url) {
    console.log(`📥 Fetching: ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.status}`);
    }
    return response.json();
}

/**
 * Load existing consolidated data
 */
function loadConsolidatedData() {
    if (!fs.existsSync(CONSOLIDATED_DATA_PATH)) {
        throw new Error('Consolidated data not found. Run npm run consolidate-csvs first.');
    }
    return JSON.parse(fs.readFileSync(CONSOLIDATED_DATA_PATH, 'utf8'));
}

/**
 * Main merge function
 */
async function mergeCardMarketPrices() {
    console.log('🌍 Starting CardMarket price merge...\n');

    try {
        // 1. Load existing TCGPlayer data
        console.log('📂 Loading TCGPlayer consolidated data...');
        const consolidatedData = loadConsolidatedData();
        console.log(`   Found ${consolidatedData.data.length} TCGPlayer cards\n`);

        // 2. Fetch CardMarket products
        const productsData = await fetchJSON(CARDMARKET_PRODUCTS_URL);
        const products = productsData.products;
        console.log(`   Found ${products.length} CardMarket products\n`);

        // 3. Fetch CardMarket prices
        const pricesData = await fetchJSON(CARDMARKET_PRICES_URL);
        const priceGuides = pricesData.priceGuides;
        console.log(`   Found ${priceGuides.length} CardMarket price entries\n`);

        // 4. Create a map of CardMarket product ID -> price data
        const priceMap = new Map();
        for (const price of priceGuides) {
            priceMap.set(price.idProduct, price);
        }

        // 5. Create a map of normalized name -> CardMarket data
        const cardMarketByName = new Map();
        for (const product of products) {
            const normalizedName = normalizeCardName(product.name);
            const prices = priceMap.get(product.idProduct);
            if (prices) {
                cardMarketByName.set(normalizedName, {
                    name: product.name,
                    idProduct: product.idProduct,
                    // Normal prices (in EUR)
                    avg: prices.avg || 0,
                    low: prices.low || 0,
                    trend: prices.trend || 0,
                    // Foil prices (in EUR)
                    avgFoil: prices['avg-foil'] || 0,
                    lowFoil: prices['low-foil'] || 0,
                    trendFoil: prices['trend-foil'] || 0
                });
            }
        }
        console.log(`   Built CardMarket lookup with ${cardMarketByName.size} entries\n`);

        // 6. Merge CardMarket prices into TCGPlayer data
        let matchCount = 0;
        let noMatchCount = 0;

        for (const card of consolidatedData.data) {
            // Try to match by cleanName first, then name
            const cleanNameNormalized = normalizeCardName(card.cleanName || '');
            const nameNormalized = normalizeCardName(card.name || '');

            let cmData = cardMarketByName.get(cleanNameNormalized);
            if (!cmData) {
                cmData = cardMarketByName.get(nameNormalized);
            }

            if (cmData) {
                // Determine if this is a foil variant
                const isFoil = (card.subTypeName || '').toLowerCase().includes('foil');

                // Add CardMarket prices
                card.cardmarketId = cmData.idProduct;
                card.cardmarketName = cmData.name;
                
                // Normal prices
                card.cardmarketAvg = cmData.avg;
                card.cardmarketLow = cmData.low;
                card.cardmarketTrend = cmData.trend;
                
                // Foil prices
                card.cardmarketAvgFoil = cmData.avgFoil;
                card.cardmarketLowFoil = cmData.lowFoil;
                card.cardmarketTrendFoil = cmData.trendFoil;

                matchCount++;
            } else {
                // No match found - set to null/0
                card.cardmarketId = null;
                card.cardmarketName = null;
                card.cardmarketAvg = 0;
                card.cardmarketLow = 0;
                card.cardmarketTrend = 0;
                card.cardmarketAvgFoil = 0;
                card.cardmarketLowFoil = 0;
                card.cardmarketTrendFoil = 0;
                noMatchCount++;
            }
        }

        console.log(`✅ Matched: ${matchCount} cards`);
        console.log(`⚠️  No match: ${noMatchCount} cards\n`);

        // 7. Update metadata
        consolidatedData.metadata.cardmarketMergedAt = new Date().toISOString();
        consolidatedData.metadata.cardmarketProductsUrl = CARDMARKET_PRODUCTS_URL;
        consolidatedData.metadata.cardmarketPricesUrl = CARDMARKET_PRICES_URL;
        consolidatedData.metadata.cardmarketMatchCount = matchCount;
        consolidatedData.metadata.cardmarketNoMatchCount = noMatchCount;

        // 8. Save updated data
        console.log('💾 Saving merged data...');
        fs.writeFileSync(CONSOLIDATED_DATA_PATH, JSON.stringify(consolidatedData, null, 2));
        console.log(`   Saved to ${CONSOLIDATED_DATA_PATH}\n`);

        // 9. Show some examples
        console.log('📋 Sample merged cards:');
        const samples = consolidatedData.data.filter(c => c.cardmarketId).slice(0, 3);
        for (const sample of samples) {
            console.log(`   ${sample.name}:`);
            console.log(`     TCGPlayer: $${sample.marketPrice} market, $${sample.lowPrice} low`);
            console.log(`     CardMarket: €${sample.cardmarketTrend} trend, €${sample.cardmarketLow} low`);
        }

        console.log('\n✅ CardMarket price merge completed successfully!');

    } catch (error) {
        console.error('❌ Error during merge:', error.message);
        process.exit(1);
    }
}

// Run the script
mergeCardMarketPrices();

