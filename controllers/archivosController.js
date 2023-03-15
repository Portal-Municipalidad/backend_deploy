import { pool } from '../database/db.js';
import fs from 'fs';
import path from 'path'
import { fileURLToPath } from "node:url";

const UPLOAD_PATH = import.meta.url + "/../../files/";


export const descargarArchivo = (req, res) => {
    try {
        const { filePath } = req.body;
        return res.status(200).download(filePath);
    }
    catch(error) {
        return res.status(500).json({
            error: true,
            msg: 'Error al intentar descargar el archivo',
            data: null
        });
    } 
}


export const getArchivos = async (req, res) => {
    try {
        const { categoria, subCategoria } = req.query;
        const [response] = await pool.query("select * from t_archivos where CATEGORIA = ? and SUBCATEGORIA = ? and ACTIVO = 'SI'", [categoria, subCategoria]);
        if (response.length < 0) {
            return res.status(404).json({
                error: true,
                msg: 'No se encontraron archivos',
                data: null
            });
        }
        return res.status(200).json({
            error: false,
            cantidad: response.length,
            msg: 'Archivos encontrados',
            data: response
        });
        
    }
    catch(error) {
        return res.status(500).json({
            error: true,
            msg: 'Error al intentar recuperar los archivos',
            data: null,
            token: null
        });
    }
    
    
}

export const actualizarArchivo = async (req, res) => {
    const { id_link } = req.query;
    try {
        const [rows] = await pool.query('CALL ACTUALIZAR_ARCHIVO_ESTADO(?)', [id_link]);
        const [archivo] = await pool.query('SELECT * FROM `t_archivos` WHERE ID_LINK = ?', [id_link]);
        if (rows.affectedRows > 0) {
            fs.unlink(UPLOAD_PATH + archivo[0].NOMBRE, (err) => {
                if (err) {
                    return res.status(500).json({
                        error: true,
                        msg: 'Error al eliminar el archivo',
                        data: null
                    });
                }
            });
            return res.status(200).json({
                error: false,
                msg: 'Archivo eliminado correctamente',
                data: null
            });
        }
        else {
            return res.status(404).json({
                error: true,
                msg: 'Archivo no encontrado',
                data: null
            });
        }
    } catch (error) {
        return res.status(500).json({
            error: true,
            msg: 'Error al intentar actualizar el archivo',
            data: null
        });
    }
       
}

export const buscarArchivos = async (req, res) => {
    const { archivo } = req.query;
    const archivoLike = `%${archivo}%`.toUpperCase();
    try {
        const [rows] = await pool.query("SELECT * FROM `t_archivos` WHERE ACTIVO = 'SI' AND UPPER(NOMBRE) LIKE ?", [archivoLike]);
        if (rows.length > 0) {
            return res.status(200).json({
                error: false,
                msg: 'Archivos encontrado',
                cantidad: rows.length,
                data: rows
            });
        } else {
            return res.status(404).json({
                error: true,
                msg: 'Archivo no encontrado',
                cantidad: 0,
                data: null
            });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: true,
            msg: 'Error al intentar buscar el archivo',
            cantidad: 0,
            data: null
        });
    }
}



export const cargaArchivos = async (req, res) => {
    const { correo, categoria, subCategoria  } = req.body;
    const file = req.files.file;
    const extensionFile = file.name.split('.').pop().toUpperCase();
    const UPLOAD_PATH1 = fileURLToPath(new URL(file.name,UPLOAD_PATH ))
    const [value, result] = await pool.query('SELECT INSERTAR_ARCHIVOS(?,?,?,?,?,?)', [extensionFile, file.name, UPLOAD_PATH1, categoria, subCategoria, correo]);
    const retorno = value[0][result[0].name];
    if (retorno === "1") {
        try {
            file.mv(fileURLToPath(new URL(file.name,UPLOAD_PATH )), (err) => {
                if (err) {
                    return res.status(500).json({
                        error: true,
                        msg: 'Error al gaudrar el archivo',
                        data: null
                    });
                }
            });
            return res.status(200).json({
                error: false,
                msg: 'Archivo subido correctamente',
                data: null
            });
        }
        catch (error) {
            return res.status(500).json({
                error: true,
                msg: 'Error al subir el archivo',
                data: null
            });
        }
    }
    if (retorno === "0") {
        return res.status(404).json({ error: true, msg: 'El archivo ya existe', data: null });
    }
    return res.status(500).json({ error: true, msg: 'Error en la base de datos', data: null });
}