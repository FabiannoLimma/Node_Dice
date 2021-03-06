/**
 * Copyright 2017 Node Dice
 *
 * Created by Neo on 2017/02/08
 */

//import newrelic from 'newrelic';
//import cluster from 'cluster');
import config from './config';
import express from 'express';
import expressValidator from 'express-validator';
//favicon from 'serve-favicon'),
import compression from 'compression';
import bodyParser from 'body-parser';
// import cookieParser from 'cookie-parser';
// import session from 'express-session';
// import MongoConnect from 'connect-mongo';
// import socketHandshake from 'socket.io-handshake';
import http from 'http';
import socketio from 'socket.io';
import routes from './app/routes';
import sockets from './app/sockets/';
import logger from './app/helper/logger';
const app = express();

/*require socket.io*/
const server = http.createServer(app);

const io = socketio(server, { cookie: 'dSession', cookiePath: '/', cookieHttpOnly: true });
//config express in all environments
app.disable('x-powered-by');


//Add express's middlewares
//app.use(favicon(config.clientRoot + '/favicon.ico'));
//Only used in development. In production, use nginx to serve static files
if (process.env.NODE_ENV == 'development') {
    app.use(express.static(config.clientRoot));
    app.use(compression({ threshold: 512 }));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator([]));

//map routes for pages
routes(app);
//socket communication for games
sockets(io);

server.listen(config.port, function () {
    logger.info('Server running on port ' + config.port);
});


