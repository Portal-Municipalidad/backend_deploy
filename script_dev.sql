CREATE DATABASE `dev_portal`;
USE `dev_portal`;

CREATE TABLE `t_usuarios` (
  `ID_USUARIO` int NOT NULL AUTO_INCREMENT,
  `NOMBRE` varchar(100) NOT NULL,
  `CONTRASENNA` varchar(100) NOT NULL,
  `TIPO` varchar(45) NOT NULL,
  `CORREO` varchar(100) NOT NULL,
  `ULTIMO_LOGIN` datetime,
  PRIMARY KEY (`ID_USUARIO`),
  UNIQUE KEY `ID_USUARIO_UNIQUE` (`ID_USUARIO`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/* Procedimientoo que almacena un nuevo usuario */

DELIMITER $$
CREATE PROCEDURE `INSERTAR_USUARIOS`(IN P_NOMBRE VARCHAR(100), IN P_CONTRA VARCHAR(100), IN P_TIPO VARCHAR(45), IN P_CORREO VARCHAR(100))
BEGIN 
	INSERT INTO `t_usuarios` (NOMBRE, CONTRASENNA, TIPO, CORREO) VALUES (P_NOMBRE, P_CONTRA, P_TIPO, P_CORREO);
END$$
DELIMITER ;

CALL INSERTAR_USUARIOS('Kendal Quesada Blanco', '1234', 'ADMIN', 'kendalqb1@gmail.com');

/* Procedimientoo que actualiza el ultimo login */

DELIMITER $$
CREATE PROCEDURE `REGISTRO_LOGIN`(IN P_CORREO VARCHAR(100))
BEGIN 
	DECLARE ID INT;
    SELECT ID_USUARIO INTO ID FROM `t_usuarios` WHERE CORREO = P_CORREO;
	UPDATE `t_usuarios` SET ULTIMO_LOGIN = SYSDATE() WHERE ID_USUARIO = ID;
END$$
DELIMITER ;

CALL REGISTRO_LOGIN('perezz25@gmail.com');


CREATE TABLE `t_archivos` (
  `ID_LINK` int NOT NULL AUTO_INCREMENT,
  `TIPO` varchar(45) NOT NULL,
  `NOMBRE` varchar(100) NOT NULL,
  `LINK` varchar(200) NOT NULL,
  `ACTIVO` varchar(2) NOT NULL,
  `CREADO_EL` datetime NOT NULL,
  `CATEGORIA` varchar(100) NOT NULL,
  `SUBCATEGORIA` varchar(100) NOT NULL,
  `CREADO_POR` varchar(100) NOT NULL,
  PRIMARY KEY (`ID_LINK`),
  UNIQUE KEY `ID_LINK_UNIQUE` (`ID_LINK`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELIMITER $$
CREATE PROCEDURE `INSERTAR_ARCHIVOS`(IN P_TIPO VARCHAR(45), IN P_NOMBRE VARCHAR(100), IN P_LINK VARCHAR(200), IN P_CATEGORIA VARCHAR(100), IN P_SUBCATEGORIA VARCHAR(100), IN P_CREADO_POR VARCHAR(100))
BEGIN 
	DECLARE COUNTER_ARCHIVOS INT;
	SELECT COUNT(*) INTO COUNTER_ARCHIVOS FROM `t_archivos` WHERE ACTIVO = 'SI' AND NOMBRE = P_NOMBRE;
    IF COUNTER_ARCHIVOS < 1 THEN
		INSERT INTO `t_archivos` (TIPO, NOMBRE, LINK, ACTIVO, CREADO_EL, CATEGORIA, SUBCATEGORIA, CREADO_POR) VALUES (P_TIPO, P_NOMBRE, P_LINK, 'SI', SYSDATE(), P_CATEGORIA, P_SUBCATEGORIA, P_CREADO_POR);
	END IF;
END$$
DELIMITER ;

CALL INSERTAR_ARCHIVOS('PDF', 'Estructura_Final', 'c/hola/files', 'Información del personal', 'Información de jerarcas','kendalqb1@gmail.com');

DELIMITER $$
CREATE FUNCTION `INSERTAR_ARCHIVOS`(P_TIPO VARCHAR(45), P_NOMBRE VARCHAR(100), P_LINK VARCHAR(200), P_CATEGORIA VARCHAR(100), P_SUBCATEGORIA VARCHAR(100), P_CREADO_POR VARCHAR(100)) RETURNS varchar(2) CHARSET utf8mb4
BEGIN
  DECLARE COUNTER_ARCHIVOS INT;
	SELECT COUNT(*) INTO COUNTER_ARCHIVOS FROM `t_archivos` WHERE ACTIVO = 'SI' AND NOMBRE = P_NOMBRE;
    IF COUNTER_ARCHIVOS < 1 THEN
		INSERT INTO `t_archivos` (TIPO, NOMBRE, LINK, ACTIVO, CREADO_EL, CATEGORIA, SUBCATEGORIA, CREADO_POR) VALUES (P_TIPO, P_NOMBRE, P_LINK, 'SI', SYSDATE(), P_CATEGORIA, P_SUBCATEGORIA, P_CREADO_POR);
		RETURN '1';
    END IF;
    RETURN '0';
END
$$

DELIMITER $$
CREATE PROCEDURE `ACTUALIZAR_ARCHIVO_ESTADO`(IN P_ID VARCHAR(100))
BEGIN
	UPDATE `t_archivos` SET ACTIVO = 'NO' WHERE ID_LINK = P_ID;
END$$
DELIMITER ;

CALL ACTUALIZAR_ARCHIVO_ESTADO(1);



/* --------------------------------------------------- */
CREATE PROCEDURE `INSERTAR_USUARIOS` (IN P_NOMBRE VARCHAR(100), IN P_CONTRA VARCHAR(100), IN P_TIPO VARCHAR(45), IN P_CORREO VARCHAR(100))
BEGIN
	INSERT INTO `t_usuarios` (NOMBRE, CONTRASENNA, TIPO, CORREO) VALUES (P_NOMBRE, P_CONTRA, P_TIPO, P_CORREO);
END