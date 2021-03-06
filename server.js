const app = require('./lib/app');
const http = require('http');
require('./lib/connect');

const port = process.env.PORT || 3001;
const server = http.createServer(app);

server.listen(port, () => {
    console.log('server running on', server.address());
});