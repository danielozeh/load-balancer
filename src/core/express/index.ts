import http from 'http'
import express from 'express'
import cors from 'cors'

import bodyParser from 'body-parser'
import morgan from 'morgan'
import helmet from 'helmet'

import config from '../../config'
import routes from '../../routes'
import Response from '../../utils/response'
// import db from '../db'
// console.log(db)

const rawBodySaver = function (req: any, _res: any, buf: any, encoding: any) {
    if (buf && buf.length)req.rawBody = buf.toString(encoding || 'utf8');
}

const app = express()

const corsOptions = {
    origin: function(origin: any, callback: any) {
        callback(null, true)
    }
}

app.use(express.static('.'));
app.use(cors(corsOptions))
app.use(bodyParser.json({limit: '50mb', verify: rawBodySaver}))
app.use(bodyParser.urlencoded({limit: '50mb', verify: rawBodySaver, extended: false}))
app.use(morgan('dev'))
// app.use(helmet())

app.use(routes)

app.use(function(req, res, next){
    res.status(404);

    Response.sendError(res, {message: 'Endpoint does not exist'})

    // res.send({ status: false, message: 'Endpoint does not exist' });
    return;
})

const startAPI = () => {
    const server = http.createServer(app)
    // Start the server without the error handler in the listen callback
    server.listen(process.argv[2], () => {
        console.log('Load Balancing Service started on port %O', process.argv[2]);
    });

    // Handle error event separately
    server.on('error', (err: any) => {
        console.log('API could not be started', err);
        process.exit(-1);  // Exit the process if the server fails to start
    });
}

export default {startAPI, app}