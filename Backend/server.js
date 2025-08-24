import express from 'express';
const app = express();

app.get('/', (req, res) => {
    res.send('Server is Ready');
});

app.get('/api/buses', (req, res) => {
    const buses = [
        { id: 1, number: 'KA-01-1234', route: 'Bangalore-Chennai', capacity: 40, status: 'active' },
        { id: 2, number: 'MH-02-5678', route: 'Mumbai-Pune', capacity: 36, status: 'maintenance' }  
        
    ]
    res.json(buses);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running http://localhost:${PORT}`);
});