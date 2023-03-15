import { response, Router } from 'express';
import { login } from '../controllers/authController.js';
import { validateJWT } from '../middlewares/validate_jwt.js';

import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";

const routerAuth = Router();

routerAuth.post('/login', login);

routerAuth.get('/test', (req, res) => {
    console.log()
    res.status(200).json({
        error: false,
        msg: 'Todo bien'
    });
});


export { routerAuth };