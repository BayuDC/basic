import http from 'http';
import app from './core/app';

const server = http.createServer(app);
const port = process.env.PORT || 8080;

app.set('port', port);

server.listen(port, () => {
    console.log('Server started on port', port);
});
