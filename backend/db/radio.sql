
CREATE DATABASE IF NOT EXISTS radio
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE radio;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(255) NULL,
  password VARCHAR(255) NOT NULL,
  token_restablecimiento VARCHAR(255) NULL,
  token_restablecimiento_expira DATETIME NULL,
  rol ENUM('admin','usuario') NOT NULL DEFAULT 'usuario',
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_usuarios_nombre (nombre),
  UNIQUE KEY uq_usuarios_email (email)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS configuracion_radio (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(150) NOT NULL DEFAULT 'Radio Burruyacu',
  logo_url VARCHAR(500) NOT NULL DEFAULT '',
  stream_url VARCHAR(500) NOT NULL DEFAULT '',
  facebook VARCHAR(500) NOT NULL DEFAULT '',
  instagram VARCHAR(500) NOT NULL DEFAULT '',
  youtube VARCHAR(500) NOT NULL DEFAULT '',
  whatsapp VARCHAR(500) NOT NULL DEFAULT '',
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

INSERT INTO configuracion_radio (nombre)
SELECT 'Radio Burruyacu'
WHERE NOT EXISTS (SELECT 1 FROM configuracion_radio);

CREATE TABLE IF NOT EXISTS redes_sociales (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  creado_por_usuario_id INT UNSIGNED NULL,
  nombre VARCHAR(100) NOT NULL,
  url VARCHAR(500) NOT NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  orden INT NOT NULL DEFAULT 0,
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_redes_activo_orden (activo, orden),
  KEY idx_redes_creador (creado_por_usuario_id),
  CONSTRAINT fk_redes_creador
    FOREIGN KEY (creado_por_usuario_id)
    REFERENCES usuarios (id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS media (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  creado_por_usuario_id INT UNSIGNED NULL,
  nombre_original VARCHAR(255) NOT NULL,
  filename VARCHAR(255) NOT NULL,
  ruta VARCHAR(500) NOT NULL,
  mimetype VARCHAR(100) NOT NULL,
  public_id VARCHAR(255) NULL,
  tipo_recurso ENUM('image','video') NOT NULL DEFAULT 'image',
  carpeta ENUM('noticias','hero','radio') NOT NULL,
  tamano BIGINT UNSIGNED NOT NULL,
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_media_carpeta (carpeta, creado_en),
  KEY idx_media_creador (creado_por_usuario_id),
  CONSTRAINT fk_media_creador
    FOREIGN KEY (creado_por_usuario_id)
    REFERENCES usuarios (id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS categorias (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  creado_por_usuario_id INT UNSIGNED NULL,
  nombre VARCHAR(100) NOT NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  orden INT NOT NULL DEFAULT 0,
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_categorias_nombre (nombre),
  KEY idx_categorias_activo_orden (activo, orden),
  KEY idx_categorias_creador (creado_por_usuario_id),
  CONSTRAINT fk_categorias_creador
    FOREIGN KEY (creado_por_usuario_id)
    REFERENCES usuarios (id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB;

INSERT IGNORE INTO categorias (nombre, orden) VALUES
  ('Locales', 0),
  ('Policiales', 1),
  ('Salud', 2),
  ('Política', 3),
  ('Economía', 4),
  ('Eventos', 5),
  ('Deportes', 6);

CREATE TABLE IF NOT EXISTS noticias (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  creado_por_usuario_id INT UNSIGNED NULL,
  titulo VARCHAR(255) NOT NULL,
  subtitulo VARCHAR(255) NOT NULL DEFAULT '',
  contenido MEDIUMTEXT NOT NULL,
  categoria_id INT UNSIGNED NOT NULL,
  destacada TINYINT(1) NOT NULL DEFAULT 0,
  fecha_publicacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_noticias_fecha (fecha_publicacion DESC),
  KEY idx_noticias_categoria_id (categoria_id),
  KEY idx_noticias_destacada_fecha (destacada, fecha_publicacion DESC),
  KEY idx_noticias_creador (creado_por_usuario_id),
  CONSTRAINT fk_noticias_creador
    FOREIGN KEY (creado_por_usuario_id)
    REFERENCES usuarios (id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_noticias_categoria
    FOREIGN KEY (categoria_id)
    REFERENCES categorias (id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS noticia_archivos (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  noticia_id INT UNSIGNED NOT NULL,
  media_id INT UNSIGNED NULL,
  url VARCHAR(500) NOT NULL,
  tipo ENUM('imagen','video') NOT NULL,
  orden SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_na_noticia (noticia_id, tipo, orden),
  CONSTRAINT fk_na_noticia
    FOREIGN KEY (noticia_id)
    REFERENCES noticias (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_na_media
    FOREIGN KEY (media_id)
    REFERENCES media (id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS hero_banners (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  creado_por_usuario_id INT UNSIGNED NULL,
  titulo VARCHAR(255) NOT NULL DEFAULT '',
  subtitulo VARCHAR(255) NOT NULL DEFAULT '',
  tipo_media ENUM('imagen','video') NOT NULL,
  media_url VARCHAR(500) NULL,
  media_id INT UNSIGNED NULL,
  link_accion VARCHAR(500) NOT NULL DEFAULT '',
  texto_boton VARCHAR(100) NOT NULL DEFAULT '',
  orden INT NOT NULL DEFAULT 0,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_hero_activo_orden (activo, orden),
  KEY idx_hero_creador (creado_por_usuario_id),
  CONSTRAINT fk_hero_creador
    FOREIGN KEY (creado_por_usuario_id)
    REFERENCES usuarios (id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_hero_media
    FOREIGN KEY (media_id)
    REFERENCES media (id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS contactos (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  usuario_id INT UNSIGNED NULL,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telefono VARCHAR(30) NULL,
  asunto VARCHAR(150) NOT NULL,
  mensaje TEXT NOT NULL,
  estado ENUM('pendiente','realizado') NOT NULL DEFAULT 'pendiente',
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_contactos_creado_en (creado_en),
  KEY idx_contactos_estado_creado (estado, creado_en),
  KEY idx_contactos_usuario (usuario_id),
  CONSTRAINT fk_contactos_usuario
    FOREIGN KEY (usuario_id)
    REFERENCES usuarios (id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB;

SHOW TABLES;
