import { Router } from 'express';
import { cargaArchivos, buscarArchivos, actualizarArchivo, getArchivos, descargarArchivo } from '../controllers/archivosController.js';
import { validateJWT } from '../middlewares/validate_jwt.js';

const routerArchivos = Router();

routerArchivos.get('/buscar', validateJWT, buscarArchivos);

routerArchivos.put('/actualizar', actualizarArchivo);

routerArchivos.post('/upload', cargaArchivos);

routerArchivos.get('/getFiles', getArchivos);

routerArchivos.post('/download', descargarArchivo);

export { routerArchivos };