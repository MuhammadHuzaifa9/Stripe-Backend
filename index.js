const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Stripe = require('stripe');
const morgan = require('morgan');
const cors = require('cors');

const stripe = Stripe('sk_test_51QuDf4H44ZYSFgufQkBKK9CuKSIjxcj40PTHqlxwnzdwJ1xGZF0ip1pBQiLZF5PfDJuUYnP6Ffqr6aAJxXwSEGjO00kwyPziWA');

// Middleware
app.use(express.json());
app.use(morgan('dev'));

// Explicit CORS Handling
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // Allow any frontend (For testing)
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
        return res.sendStatus(200); // Handle preflight requests
    }
    
    next();
});

// Stripe Payment Endpoint
app.post('/payment', async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount) {
            return res.status(400).json({ error: 'Amount is required' });
        }

        const payment = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'usd'
        });

        res.json({ clientSecret: payment.client_secret });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Set port dynamically for Vercel
const port = process.env.PORT || 3000;

// Start Server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = app; // Required for Vercel deployment
