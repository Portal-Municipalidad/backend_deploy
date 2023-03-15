import { request, response } from 'express';
import jwt from 'jsonwebtoken';
import { pool } from '../database/db.js';

export const  validateJWT = async(req = request, res = response, next) => {
    const token = req.header('jwt-token');
    if (!token) {
        return res.status(401).json({
            error: true,
            msg: 'No hay token en la petición',
            data: null
        });
    }
    try {
        const { idUser, correo } = jwt.verify(token, process.env.SECRETKEY);
        const [rows] = await pool.query('SELECT count(*) cantidad FROM `t_usuarios` WHERE ID_USUARIO = ? AND CORREO = ?', [idUser, correo]);
        if (rows[0].cantidad < 1) {
            return res.status(401).json({
                error: true,
                msg: 'Token no válido, el usuario no existe',
                data: null
            });
        }
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: true,
                msg: 'Token expirado',
                data: null
            });
        }
        return res.status(401).json({
            error: true,
            msg: 'Token no válido',
            data: null
        });
    }
}