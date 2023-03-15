import { pool } from '../database/db.js';
import { generateJWT } from '../helpers/generate_jwt.js';

export const login = async (req, res) => {
    try {
        const { correo, contrasenna } = req.body;
        const [rows] = await pool.query('SELECT * FROM `t_usuarios` WHERE CORREO = ? AND CONTRASENNA = ?', [correo, contrasenna]);
        if (rows.length < 1) {
            return res.status(401).json({
                error: true,
                msg: 'Usuario o contraseña incorrectos',
                data: null,
                token: null               
            });
        } 
        await pool.query('CALL REGISTRO_LOGIN(?)', [correo]);
        const { CONTRASENNA, ...usuario } = rows[0];
        const token = await generateJWT( usuario.ID_USUARIO, usuario.CORREO );
        return res.status(200).json({
            error: false,
            msg: 'Usuario correcto',
            data: usuario,
            token
        });
    } 
    catch (error) {
        return res.status(500).json({
            error: true,
            msg: 'Error al intentar loguear al usuario',
            data: null,
            token: null
        });
    } 
}

