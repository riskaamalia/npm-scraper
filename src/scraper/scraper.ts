import axios from 'axios';
import cheerio from 'cheerio';

// Daftar User-Agent untuk rotasi
const USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
];

// Konfigurasi Proxy dari dokumen tantangan
const proxyHost = process.env.PROXY_HOST;
const proxyPort = parseInt(process.env.PROXY_PORT || '9999', 10);
const proxyUsername = process.env.PROXY_USERNAME;
const proxyPassword = process.env.PROXY_PASSWORD;

// Pastikan semua variabel ada sebelum melanjutkan
if (!proxyHost || !proxyUsername || !proxyPassword) {
    throw new Error('Proxy configuration is missing in the .env file. Please check your environment variables.');
}

const proxy = {
    host: proxyHost,
    port: proxyPort,
    auth: {
        username: proxyUsername,
        password: proxyPassword
    }
};


/**
 * Fungsi untuk mengambil data _PRELOADED_STATE_ dari URL produk Naver SmartStore.
 * @param productUrl URL lengkap ke halaman produk.
 * @returns Objek JSON dari _PRELOADED_STATE_.
 */
export async function scrapeNaverProduct(productUrl: string): Promise<any> {
    try {
        // 1. Implementasi Teknik Anti-Deteksi
        const randomUserAgent = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
        const headers = {
            'User-Agent': randomUserAgent,
            'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        };

        // 2. Membuat permintaan HTTP melalui Proxy
        const response = await axios.get(productUrl, {
            headers,
            proxy, // Menggunakan proxy untuk rotasi IP
            timeout: 20000 // Timeout 20 detik untuk mencegah request macet
        });

        const html = response.data;
        const $ = cheerio.load(html);

        // 3. Mengekstrak JSON dari _PRELOADED_STATE_ [cite: 5, 16]
        const scriptContent = $('script')
            .filter((_, el) => {
                return $(el).html()?.includes('window.__PRELOADED_STATE__') ?? false;
            })
            .html();

        if (!scriptContent) {
            throw new Error('Could not find __PRELOADED_STATE__ in the page source.');
        }

        // Menggunakan regex untuk mengekstrak objek JSON secara aman
        const jsonMatch = scriptContent.match(/window\.__PRELOADED_STATE__\s*=\s*(\{.*?\});/);
        if (jsonMatch && jsonMatch[1]) {
            return JSON.parse(jsonMatch[1]);
        } else {
            throw new Error('Failed to parse __PRELOADED_STATE__ JSON.');
        }

    } catch (error: any) {
        console.error(`Scraping failed for ${productUrl}:`, error.message);
        // Melemparkan error kembali agar bisa ditangani oleh API controller
        throw new Error(`Failed to scrape product data. Reason: ${error.message}`);
    }
}