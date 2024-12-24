const http = require('http');

// Adresse de votre serveur local
const LOCAL_PORT = 5500;
const PUBLIC_PORT = 8080;

const server = http.createServer((req, res) => {
    const options = {
        hostname: 'localhost',
        port: LOCAL_PORT,
        path: req.url,
        method: req.method,
        headers: req.headers,
    };

    const proxyReq = http.request(options, (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res, { end: true });
    });

    req.pipe(proxyReq, { end: true });

    proxyReq.on('error', (err) => {
        console.error('Erreur dans le tunnel :', err.message);
        res.writeHead(502);
        res.end('Erreur de connexion au serveur local.');
    });
});

server.listen(PUBLIC_PORT, () => {
    console.log(`Tunnel public ouvert sur http://<Votre-IP-Publique>:${PUBLIC_PORT}`);
});
