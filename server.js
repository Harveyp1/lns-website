// A simple Express server to securely proxy requests to the Syncro API.

// 1. Import necessary libraries
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

// 2. Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000; // Use port from environment or default to 3000

// 3. Get API Key from secure environment variables
// IMPORTANT: The API key is NOT written here. You will add it in the Render dashboard.
const SYNCRO_API_KEY = process.env.SYNCRO_API_KEY;
const SYNCRO_API_BASE_URL = "https://api.syncromsp.com/api/v1";

if (!SYNCRO_API_KEY) {
    console.error("FATAL ERROR: SYNCRO_API_KEY environment variable is not set.");
    process.exit(1); // Exit if the key is not found
}

// 4. Middleware
app.use(cors()); // Allow requests from your Vercel frontend
app.use(express.json());

// --- API PROXY ROUTES ---

// Endpoint to authenticate a user
// This is a placeholder. A real implementation would be more secure.
app.post('/api/authenticate', (req, res) => {
    const { credential, password } = req.body;

    // SIMULATED AUTHENTICATION LOGIC
    // In a real-world scenario, you would query the Syncro API's /contacts endpoint
    // to verify the user's credentials against their database.
    console.log(`Attempting to authenticate user: ${credential}`);
    
    if ((credential.toLowerCase() === 'admin@example.com' || credential.toLowerCase() === 'harveyp1') && password === '@Freezepop1!') {
        res.json({ success: true, user: { name: 'McAllen Preventive Care Institute', role: 'admin' } });
    } else if (credential.toLowerCase() === 'user@example.com' && password === 'password') {
         res.json({ success: true, user: { name: 'Standard User', role: 'user' } });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});


// Add more secure endpoints here for fetching tickets, invoices, etc.
// For example:
app.get('/api/tickets', async (req, res) => {
    try {
        const apiResponse = await fetch(`${SYNCRO_API_BASE_URL}/tickets`, {
            headers: { 'Authorization': `Bearer ${SYNCRO_API_KEY}` }
        });
        if (!apiResponse.ok) throw new Error(`Syncro API error: ${apiResponse.statusText}`);
        const data = await apiResponse.json();
        res.json(data);
    } catch (error) {
        console.error("Error fetching tickets:", error);
        res.status(500).json({ error: 'Failed to fetch tickets' });
    }
});


// 5. Start the server
app.listen(PORT, () => {
    console.log(`Secure backend server is running on port ${PORT}`);
});
