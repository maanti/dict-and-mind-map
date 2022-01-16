const fs = require('fs');
const http = require('http');
const path = require('path');

let dictionary = null;

function dictionaryHandler(request, response) {
    if (request.url === '/' || request.url === '/index' || request.url === '/index.html') {
        const filePath = path.join(__dirname, 'index.html');
        const stat = fs.statSync(filePath);

        const readStream = fs.createReadStream(filePath);
        return readStream.pipe(response);
    }
    const url = request.url.replace('/', '');
    let key = '';
    if (url.length > 0) {
        key = decodeURIComponent(url.toUpperCase());
    }
    let def = dictionary[key];
    if (!def) {
        response.writeHead(404);
        response.end(key + ' was not found');
        return;
    }
    response.setHeader('content-type', 'text/plain; charset=utf-8')
    response.writeHead(200);
    response.end(def);
}

function loadDictionary(file, callback) {
    fs.readFile(file, (err, data) => {
        if (err) {
            console.log(err);
            callback(err);
            return;
        }
        dictionary = JSON.parse(data.toString());
        console.log('dictionary loaded.');
        callback();
    })
}

function startServer() {
    http.createServer(dictionaryHandler).listen(8080, (err) => {
        if (err) {
            return console.log('error starting server: ' + err);
        }
        console.log('server is listening on 8080');
    });
}

(() => {
    loadDictionary('dictionary.json', (err) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log('ready to serve');
    });

    startServer();
})();
