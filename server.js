const http = require('http');
const fs = require('fs').promises;
const { createServer } = require('http');
const { parse } = require('url');
const https = require('https');

const serveFile = async (res, filename, contentType) => {
    try {
        const data = await fs.readFile(filename);
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    } catch (err) {
        console.error('Error reading file:', err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
    }
};

const handleApiRequest = (req, res) => {
    const { page = 1 } = parse(req.url, true).query;

    const options = {
        hostname: 'randomuser.me',
        path: `/api/?results=10&page=${page}`,
        method: 'GET',
    };

    const apiRequest = https.request(options, (apiResponse) => {
        let data = '';

        apiResponse.on('data', (chunk) => {
            data += chunk;
        });

        apiResponse.on('end', () => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
        });
    });

    apiRequest.on('error', (error) => {
        console.error('Error making API request:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
    });

    apiRequest.end();
};

const server = createServer(async (req, res) => {
    const { pathname } = parse(req.url);

    if (pathname === '/') {
        await serveFile(res, 'index.html', 'text/html');
    } else if (pathname === '/style.css') {
        await serveFile(res, 'style.css', 'text/css');
    } else if (pathname === '/script.js') {
        await serveFile(res, 'script.js', 'text/javascript');
    } else if (pathname.startsWith('/api/people')) {
        handleApiRequest(req, res);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
