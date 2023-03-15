import jwt from 'jsonwebtoken';

export const generateJWT = ( idUser, correo) => {
    return new Promise((resolve, reject) => {
        const payload = { idUser, correo };
        jwt.sign(payload, process.env.SECRETKEY, {
            expiresIn: '6h'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('No se pudo generar el JWT');
            } else {
                resolve(token);
            }
        });
    }
)};
