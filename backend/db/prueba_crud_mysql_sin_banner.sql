
USE radio;

SET @marca_prueba = REPLACE(UUID(), '-', '');
SET @admin_id = COALESCE((
  SELECT id FROM usuarios WHERE nombre = 'admin_prueba' AND rol = 'admin' LIMIT 1
), 0);
SET @usuario_prueba_id = COALESCE((
  SELECT id FROM usuarios WHERE nombre = 'usuario_prueba' AND rol = 'usuario' LIMIT 1
), 0);
SET @categoria_eventos_id = (
  SELECT id FROM categorias WHERE nombre = 'Eventos' AND activo = 1 LIMIT 1
);
SET @categoria_salud_id = (
  SELECT id FROM categorias WHERE nombre = 'Salud' AND activo = 1 LIMIT 1
);
SET @categoria_economia_id = (
  SELECT id FROM categorias WHERE nombre = 'Economía' AND activo = 1 LIMIT 1
);
SET @categoria_locales_id = (
  SELECT id FROM categorias WHERE nombre = 'Locales' AND activo = 1 LIMIT 1
);
SET @categoria_deportes_id = (
  SELECT id FROM categorias WHERE nombre = 'Deportes' AND activo = 1 LIMIT 1
);

SELECT
  @admin_id > 0 AS admin_prueba_disponible,
  @usuario_prueba_id > 0 AS usuario_prueba_disponible,
  @categoria_eventos_id IS NOT NULL AS categoria_eventos_disponible,
  @categoria_salud_id IS NOT NULL AS categoria_salud_disponible,
  @categoria_economia_id IS NOT NULL AS categoria_economia_disponible,
  @categoria_locales_id IS NOT NULL AS categoria_locales_disponible,
  @categoria_deportes_id IS NOT NULL AS categoria_deportes_disponible;

START TRANSACTION;

SET @usuario_temporal_nombre = CONCAT('mysql_prueba_', @marca_prueba);
INSERT INTO usuarios (nombre, email, password, rol)
VALUES (
  @usuario_temporal_nombre,
  CONCAT(@usuario_temporal_nombre, '@ejemplo.test'),
  '$2a$10$f11KD7n8/Cv3t1MWzD.g/uarIsmf/XwBJaz7S0ia26mQDaiFDgfB.',
  'usuario'
);
SET @usuario_temporal_id = LAST_INSERT_ID();

UPDATE usuarios
SET nombre = CONCAT(@usuario_temporal_nombre, '_actualizado'),
    email = CONCAT('actualizado.', @usuario_temporal_nombre, '@ejemplo.test')
WHERE id = @usuario_temporal_id;

UPDATE usuarios
SET email = CONCAT('actualizado.', @marca_prueba, '@ejemplo.test')
WHERE id = @usuario_prueba_id;

INSERT INTO configuracion_radio (nombre)
VALUES (CONCAT('Prueba MySQL ', @marca_prueba));
SET @configuracion_id = LAST_INSERT_ID();
UPDATE configuracion_radio
SET nombre = CONCAT('Prueba MySQL actualizada ', @marca_prueba)
WHERE id = @configuracion_id;

INSERT INTO categorias (creado_por_usuario_id, nombre, activo, orden)
VALUES (@admin_id, CONCAT('Prueba MySQL ', @marca_prueba), 1, 999);
SET @categoria_id = LAST_INSERT_ID();
UPDATE categorias
SET nombre = CONCAT('Prueba MySQL actualizada ', @marca_prueba),
    orden = 1000
WHERE id = @categoria_id;

INSERT INTO redes_sociales (creado_por_usuario_id, nombre, url, activo, orden)
VALUES (
  @admin_id,
  CONCAT('Prueba MySQL ', @marca_prueba),
  'https://example.test/prueba',
  1,
  999
);
SET @red_social_id = LAST_INSERT_ID();
UPDATE redes_sociales
SET url = 'https://example.test/prueba-actualizada',
    activo = 0
WHERE id = @red_social_id;

INSERT INTO media (
  creado_por_usuario_id,
  nombre_original,
  filename,
  ruta,
  mimetype,
  tipo_recurso,
  carpeta,
  tamano
)
VALUES (
  @admin_id,
  CONCAT('prueba-', @marca_prueba, '.jpg'),
  CONCAT('prueba-', @marca_prueba, '.jpg'),
  CONCAT('/uploads/noticias/prueba-', @marca_prueba, '.jpg'),
  'image/jpeg',
  'image',
  'noticias',
  1024
);
SET @media_id = LAST_INSERT_ID();
UPDATE media
SET nombre_original = CONCAT('prueba-actualizada-', @marca_prueba, '.jpg')
WHERE id = @media_id;

INSERT INTO noticias (
  creado_por_usuario_id,
  titulo,
  subtitulo,
  contenido,
  categoria_id,
  destacada
)
VALUES (
  @admin_id,
  CONCAT('Noticia de prueba ', @marca_prueba),
  'Prueba MySQL',
  'Registro temporal para probar las relaciones de la noticia.',
  @categoria_id,
  1
);
SET @noticia_id = LAST_INSERT_ID();
UPDATE noticias
SET titulo = CONCAT('Noticia actualizada ', @marca_prueba),
    destacada = 0
WHERE id = @noticia_id;

INSERT INTO noticia_archivos (noticia_id, media_id, url, tipo, orden)
VALUES (
  @noticia_id,
  @media_id,
  CONCAT('/uploads/noticias/prueba-', @marca_prueba, '.jpg'),
  'imagen',
  0
);
SET @archivo_id = LAST_INSERT_ID();
UPDATE noticia_archivos
SET orden = 1
WHERE id = @archivo_id;

INSERT INTO noticias (
  creado_por_usuario_id, titulo, subtitulo, contenido, categoria_id, destacada
)
VALUES (
  @admin_id,
  'Agenda cultural: cómo mantenerse al tanto de las actividades locales',
  'Claves para encontrar información sobre actividades culturales.',
  'La agenda cultural de cada comunidad se construye con propuestas de instituciones, espacios culturales y organizaciones. Para conocer fechas, horarios y requisitos, conviene consultar los canales oficiales de quienes organizan cada actividad y compartir únicamente información confirmada.',
  @categoria_eventos_id,
  0
);
SET @noticia_eventos_id = LAST_INSERT_ID();

INSERT INTO noticias (
  creado_por_usuario_id, titulo, subtitulo, contenido, categoria_id, destacada
)
VALUES (
  @admin_id,
  'Bienestar cotidiano: hábitos saludables para la vida diaria',
  'Algunas pautas generales para cuidar el bienestar en la vida diaria.',
  'El bienestar cotidiano puede apoyarse en rutinas equilibradas, descanso suficiente y actividad física acorde a las posibilidades de cada persona. Las necesidades son distintas para cada quien; para consultas personales o recomendaciones médicas, es importante acudir a profesionales de salud. Esta nota ofrece orientación general y no reemplaza una consulta profesional.',
  @categoria_salud_id,
  0
);
SET @noticia_salud_id = LAST_INSERT_ID();

INSERT INTO noticias (
  creado_por_usuario_id, titulo, subtitulo, contenido, categoria_id, destacada
)
VALUES (
  @admin_id,
  'Emprendimientos locales y su aporte a la economía regional',
  'Ideas para acompañar el trabajo de los emprendimientos de la zona.',
  'Los emprendimientos y comercios de cercanía forman parte de la vida económica de una comunidad. Conocer sus productos y servicios permite a los vecinos encontrar alternativas locales y a quienes emprenden acercarse a nuevos públicos. Para difundir una iniciativa, se recomienda compartir información de contacto y detalles previamente confirmados.',
  @categoria_economia_id,
  0
);
SET @noticia_economia_id = LAST_INSERT_ID();

INSERT INTO noticias (
  creado_por_usuario_id, titulo, subtitulo, contenido, categoria_id, destacada
)
VALUES (
  @admin_id,
  'El cuidado de los espacios comunitarios es una tarea compartida',
  'El cuidado cotidiano de los espacios comunes beneficia a toda la comunidad.',
  'Plazas, veredas y otros espacios compartidos forman parte del encuentro diario entre vecinos. Mantenerlos limpios, respetar su uso y comunicar necesidades a las áreas correspondientes son acciones que ayudan a cuidarlos. Esta nota es una invitación general a la participación y no informa sobre una actividad o reclamo específico.',
  @categoria_locales_id,
  0
);
SET @noticia_locales_id = LAST_INSERT_ID();

INSERT INTO noticias (
  creado_por_usuario_id, titulo, subtitulo, contenido, categoria_id, destacada
)
VALUES (
  @admin_id,
  'Deporte comunitario: actividad física y participación',
  'El deporte acerca a las personas y puede ayudar a crear hábitos saludables.',
  'La actividad deportiva puede ofrecer oportunidades de encuentro, aprendizaje y trabajo en equipo para personas de distintas edades. Cada persona puede elegir una práctica acorde a sus intereses y posibilidades. Para conocer entrenamientos, horarios o resultados locales, conviene consultar a los clubes y organizadores correspondientes.',
  @categoria_deportes_id,
  0
);
SET @noticia_deportes_id = LAST_INSERT_ID();

INSERT INTO noticia_archivos (noticia_id, media_id, url, tipo, orden)
VALUES
  (@noticia_eventos_id, NULL, '/uploads/noticias/agenda-cultural.svg', 'imagen', 0),
  (@noticia_salud_id, NULL, '/uploads/noticias/bienestar.svg', 'imagen', 0),
  (@noticia_economia_id, NULL, '/uploads/noticias/emprendimientos.svg', 'imagen', 0),
  (@noticia_locales_id, NULL, '/uploads/noticias/espacios-comunitarios.svg', 'imagen', 0),
  (@noticia_deportes_id, NULL, '/uploads/noticias/deporte-comunitario.svg', 'imagen', 0);

INSERT INTO contactos (usuario_id, nombre, email, telefono, asunto, mensaje)
VALUES (
  @usuario_prueba_id,
  'Visitante de prueba',
  CONCAT('contacto.', @marca_prueba, '@ejemplo.test'),
  '3810000000',
  'Prueba MySQL',
  'Mensaje temporal para verificar la relación con el usuario.'
);
SET @contacto_id = LAST_INSERT_ID();
UPDATE contactos
SET asunto = 'Prueba MySQL actualizada',
    estado = 'realizado'
WHERE id = @contacto_id;

SELECT id, nombre, email, rol
FROM usuarios
WHERE id IN (@usuario_prueba_id, @usuario_temporal_id)
ORDER BY id;

SELECT
  n.id,
  n.titulo,
  c.nombre AS categoria,
  na.url AS imagen,
  n.creado_por_usuario_id = @admin_id AS creado_por_admin
FROM noticias n
JOIN categorias c ON c.id = n.categoria_id
JOIN noticia_archivos na ON na.noticia_id = n.id AND na.tipo = 'imagen'
WHERE n.id IN (
  @noticia_eventos_id,
  @noticia_salud_id,
  @noticia_economia_id,
  @noticia_locales_id,
  @noticia_deportes_id
)
ORDER BY n.id;

SELECT
  (SELECT creado_por_usuario_id = @admin_id FROM categorias WHERE id = @categoria_id)
    AS categoria_creada_por_admin,
  (SELECT creado_por_usuario_id = @admin_id FROM redes_sociales WHERE id = @red_social_id)
    AS red_creada_por_admin,
  (SELECT creado_por_usuario_id = @admin_id FROM media WHERE id = @media_id)
    AS media_creada_por_admin,
  (SELECT creado_por_usuario_id = @admin_id FROM noticias WHERE id = @noticia_id)
    AS noticia_creada_por_admin,
  (SELECT categoria_id = @categoria_id FROM noticias WHERE id = @noticia_id)
    AS noticia_relacionada_con_categoria,
  (SELECT media_id = @media_id FROM noticia_archivos WHERE id = @archivo_id)
    AS archivo_relacionado_con_media,
  (SELECT usuario_id = @usuario_prueba_id FROM contactos WHERE id = @contacto_id)
    AS contacto_relacionado_con_usuario;

SELECT
  (SELECT nombre FROM categorias WHERE id = @categoria_id) AS categoria_actualizada,
  (SELECT url FROM redes_sociales WHERE id = @red_social_id) AS red_actualizada,
  (SELECT nombre_original FROM media WHERE id = @media_id) AS media_actualizada,
  (SELECT titulo FROM noticias WHERE id = @noticia_id) AS noticia_actualizada,
  (SELECT orden FROM noticia_archivos WHERE id = @archivo_id) AS orden_archivo_actualizado,
  (SELECT estado FROM contactos WHERE id = @contacto_id) AS estado_contacto_actualizado,
  (SELECT nombre FROM configuracion_radio WHERE id = @configuracion_id) AS configuracion_actualizada;

DELETE FROM contactos WHERE id = @contacto_id;
DELETE FROM noticia_archivos
WHERE noticia_id IN (
  @noticia_eventos_id,
  @noticia_salud_id,
  @noticia_economia_id,
  @noticia_locales_id,
  @noticia_deportes_id
);
DELETE FROM noticia_archivos WHERE id = @archivo_id;
DELETE FROM noticias
WHERE id IN (
  @noticia_eventos_id,
  @noticia_salud_id,
  @noticia_economia_id,
  @noticia_locales_id,
  @noticia_deportes_id
);
DELETE FROM noticias WHERE id = @noticia_id;
DELETE FROM media WHERE id = @media_id;
DELETE FROM redes_sociales WHERE id = @red_social_id;
DELETE FROM categorias WHERE id = @categoria_id;
DELETE FROM configuracion_radio WHERE id = @configuracion_id;
DELETE FROM usuarios WHERE id = @usuario_temporal_id;

SELECT
  (SELECT COUNT(*) FROM contactos WHERE id = @contacto_id) = 0 AS contacto_eliminado,
  (SELECT COUNT(*) FROM noticia_archivos WHERE id = @archivo_id) = 0 AS archivo_eliminado,
  (SELECT COUNT(*) FROM noticias WHERE id IN (
    @noticia_eventos_id,
    @noticia_salud_id,
    @noticia_economia_id,
    @noticia_locales_id,
    @noticia_deportes_id
  )) = 0 AS cinco_noticias_temporales_eliminadas,
  (SELECT COUNT(*) FROM noticia_archivos WHERE noticia_id IN (
    @noticia_eventos_id,
    @noticia_salud_id,
    @noticia_economia_id,
    @noticia_locales_id,
    @noticia_deportes_id
  )) = 0 AS cinco_imagenes_temporales_eliminadas,
  (SELECT COUNT(*) FROM noticias WHERE id = @noticia_id) = 0 AS noticia_eliminada,
  (SELECT COUNT(*) FROM media WHERE id = @media_id) = 0 AS media_eliminado,
  (SELECT COUNT(*) FROM redes_sociales WHERE id = @red_social_id) = 0 AS red_eliminada,
  (SELECT COUNT(*) FROM categorias WHERE id = @categoria_id) = 0 AS categoria_eliminada,
  (SELECT COUNT(*) FROM configuracion_radio WHERE id = @configuracion_id) = 0 AS configuracion_eliminada,
  (SELECT COUNT(*) FROM usuarios WHERE id = @usuario_temporal_id) = 0 AS usuario_temporal_eliminado;

ROLLBACK;

SELECT id, nombre, email, rol
FROM usuarios
WHERE id = @usuario_prueba_id;

SELECT
  n.id,
  n.titulo,
  c.nombre AS categoria,
  na.url AS imagen
FROM noticias n
JOIN categorias c ON c.id = n.categoria_id
LEFT JOIN noticia_archivos na ON na.noticia_id = n.id AND na.tipo = 'imagen' AND na.orden = 0
WHERE n.titulo IN (
  'Agenda cultural: cómo mantenerse al tanto de las actividades locales',
  'Bienestar cotidiano: hábitos saludables para la vida diaria',
  'Emprendimientos locales y su aporte a la economía regional',
  'El cuidado de los espacios comunitarios es una tarea compartida',
  'Deporte comunitario: actividad física y participación'
)
ORDER BY n.id;
