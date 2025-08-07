import express, { Request, Response } from 'express';
import { scrapeNaverProduct } from '../scraper/scraper';

const app = express();

app.use(express.json());

// Endpoint untuk scraping data produk Naver [cite: 22, 23, 24]
app.get('/naver', async (req: Request, res: Response) => {
    const productUrl = req.query.productUrl as string;

    if (!productUrl) {
        return res.status(400).json({ error: 'productUrl query parameter is required.' });
    }

    // Validasi URL sederhana
    try {
        const url = new URL(productUrl);
        if (!url.hostname.includes('smartstore.naver.com')) {
            return res.status(400).json({ error: 'Invalid Naver SmartStore URL.' });
        }
    } catch (_) {
        return res.status(400).json({ error: 'Invalid URL format.' });
    }

    console.log(`[${new Date().toISOString()}] Received request for: ${productUrl}`);
    const startTime = Date.now();

    try {
        // Panggil fungsi scraper
        const data = await scrapeNaverProduct(productUrl);
        const latency = (Date.now() - startTime) / 1000; // Latensi dalam detik

        console.log(`[SUCCESS] Scraped in ${latency.toFixed(2)}s. URL: ${productUrl}`);
        
        // Mengembalikan data JSON yang berhasil di-scrape
        res.status(200).json({
            success: true,
            latency_seconds: latency,
            data: data
        });

    } catch (error: any) {
        const latency = (Date.now() - startTime) / 1000;
        console.error(`[FAILURE] Scrape failed in ${latency.toFixed(2)}s. URL: ${productUrl}. Error: ${error.message}`);
        
        res.status(500).json({ 
            success: false,
            latency_seconds: latency,
            error: error.message 
        });
    }
});

export default app;