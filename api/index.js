import express from 'express';
import axios from 'axios';

// Konfigurasi cookie dan domain
const COOKIE_HEADER = "csrftoken=62807a7d77c4b3ee9ee73ec9a847e31e;_pinterest_sess=...";
const DOMAIN = "https://id.pinterest.com/search/pins/?q=";

// Fungsi scraping gambar dari Pinterest
async function scrapeImages(keyword) {
    const url = `${DOMAIN}${encodeURIComponent(keyword)}`;
    try {
        const response = await axios.get(url, {
            headers: { Cookie: COOKIE_HEADER },
        });
        const imageLinks = response.data.match(/https:\/\/i\.pinimg\.com\/736x\/[^\s"]+\.jpg/g);
        return imageLinks || [];
    } catch (error) {
        console.error('Error scraping images:', error.message);
        return [];
    }
}

// Inisialisasi Express.js
const app = express();

// Endpoint untuk scraping gambar Pinterest
app.get('/pinterest', async (req, res) => {
    const keyword = req.query.q;
    if (!keyword) {
        return res.status(400).json({ error: 'Kata kunci tidak diberikan.' });
    }

    try {
        const images = await scrapeImages(keyword);
        res.json({ keyword, images });
    } catch (error) {
        res.status(500).json({ error: 'Gagal mengambil gambar.' });
    }
});

// Export handler untuk Vercel
export default app;
