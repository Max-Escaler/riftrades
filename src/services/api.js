export async function fetchLastUpdatedTimestamp() {
    try {
        // Read from the local manifest written when CSVs were last pulled.
        // The previous remote endpoint (tcgcsv.com/last-updated.txt) lacks
        // CORS headers and gets blocked by the browser.
        const base = import.meta.env?.BASE_URL ?? '/';
        const response = await fetch(`${base}price-guide/manifest.json`, { cache: 'no-store' });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const manifest = await response.json();
        return manifest?.lastUpdated ?? null;
    } catch (error) {
        console.error('Error fetching last updated timestamp:', error);
        return null;
    }
}








