import dotenv from 'dotenv';
dotenv.config(); // Memuat variabel dari .env ke process.env

import app from './api/server';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('API is ready to accept requests at /naver');
});