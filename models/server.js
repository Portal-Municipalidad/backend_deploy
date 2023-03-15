import express from 'express';
import cors from 'cors';
import mogan from 'morgan';
import {routerAuth} from '../routes/auth.js';
import fileUpload from 'express-fileupload';
import { routerArchivos } from '../routes/archivos.js';

export class Server {
    //Constructor
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 4001;
        this.paths = {
            auth: '/api/auth',
            archivos: '/api/archivos',
        }

        // Middlewares
        this.middlewares();
        // Rutas de la aplicación
        this.routes();
    }

    middlewares() {
        // CORS
        this.app.use(cors());
        // Lectura y parseo del body
        this.app.use(express.json());
        // Directorio público
        this.app.use(express.static('public'));
        // Morgan
        this.app.use(mogan('dev'));
        // Cargar Archivos
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: './files/',
        }));
    }

    routes() {
        this.app.use(this.paths.auth, routerAuth);
        this.app.use(this.paths.archivos, routerArchivos);
        //this.app.use(this.paths.cargaDatos, routerCargaDatos);
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Server en http://localhost:', this.port);
        });
    }
}

