const express = require('express');
const path = require('path');
const https = require('https');
const fs = require('fs');
const app = express();

// Serve static files
app.use(express.static(__dirname));

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// SSL certificate options
const options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
};

const PORT = process.env.PORT || 3000;
https.createServer(options, app).listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Open https://localhost:${PORT} in your mobile browser`);
}); 