-- database.sql
-- Base de datos de Cusco Mistico Travel para la version Node.js
-- Basado en bdatos.sql del proyecto PHP original (tablas oferta y usuario).
-- Cambios: se agrega CREATE DATABASE / USE, charset utf8mb4 (tildes y ñ),
-- motor InnoDB y se limpia el texto "htmlspecialchars(...)" del cuerpo de la oferta.

SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS cuscomistico CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE cuscomistico;

DROP TABLE IF EXISTS oferta;
CREATE TABLE oferta (
  id_oferta INT(11) NOT NULL AUTO_INCREMENT,
  titulo    TEXT NOT NULL,
  cuerpo    TEXT NOT NULL,
  incluye   TEXT DEFAULT NULL,
  imagen    VARCHAR(300) DEFAULT NULL,
  archivo   VARCHAR(300) DEFAULT NULL,
  estado    INT(11) DEFAULT 1,
  PRIMARY KEY (id_oferta)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO oferta (id_oferta, titulo, cuerpo, incluye, imagen, archivo, estado) VALUES
(1, 'Vuelo de los cóndores de Chonta  con zip line y puente tibetano', 'PUEBLO DE CHONTA y en seguida empezaremos la caminata de 1 hora aproximadamente hasta llegar al MIRADOR DEL CÓNDOR ANDINO que está a los 3350 msnm. El camino es plano gradual con pocas subidas y bajadas bordeando una montaña con vista al impresionante cañón del Apurímac que tiene más de 1500 metros de profundidad, una vez que lleguemos al mirador de los cóndores tendremos la oportunidad de presenciar al impresionante cóndor andino en su habitad natural, nos ubicaremos en el mirador y esperaremos que los cóndores lleguen después de sus actividades diarias...', 'Transporte ida y vuelta[Guía profesional equipado con binocular y libro[Almuerzo[Desayuno campestre o box lunch[Deporte de aventuras, Zip line y Puente tibetano[Ticket de Ingreso a Killarumiyoc[Ticket de Ingreso a Tarawasi[Ticket de Ingreso Vuelo del cóndor', 'promocion.jpg', 'promo-condor.pdf', 1);

DROP TABLE IF EXISTS usuario;
CREATE TABLE usuario (
  id_usuario INT(11) NOT NULL AUTO_INCREMENT,
  usuario    VARCHAR(100) NOT NULL,
  pass       VARCHAR(100) NOT NULL,
  tipo       VARCHAR(50) DEFAULT NULL,
  PRIMARY KEY (id_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Mismos usuarios del proyecto original
INSERT INTO usuario (id_usuario, usuario, pass, tipo) VALUES
(1, 'antonio', '1234', 'admin'),
(2, 'ramiro', '1234', 'admin');
