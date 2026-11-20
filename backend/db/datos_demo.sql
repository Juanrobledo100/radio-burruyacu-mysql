USE radio;

INSERT INTO noticias (
  titulo, subtitulo, contenido, categoria_id, destacada
)
SELECT
  'Agenda cultural: cómo mantenerse al tanto de las actividades locales',
  'Claves para encontrar información sobre actividades culturales.',
  'La agenda cultural de cada comunidad se construye con propuestas de instituciones, espacios culturales y organizaciones. Para conocer fechas, horarios y requisitos, conviene consultar los canales oficiales de quienes organizan cada actividad y compartir únicamente información confirmada.',
  categoria.id,
  0
FROM categorias AS categoria
WHERE categoria.nombre = 'Eventos'
  AND categoria.activo = 1
  AND NOT EXISTS (
    SELECT 1
    FROM noticias
    WHERE titulo = 'Agenda cultural: cómo mantenerse al tanto de las actividades locales'
  )
LIMIT 1;

INSERT INTO noticias (
  titulo, subtitulo, contenido, categoria_id, destacada
)
SELECT
  'Bienestar cotidiano: hábitos saludables para la vida diaria',
  'Algunas pautas generales para cuidar el bienestar en la vida diaria.',
  'El bienestar cotidiano puede apoyarse en rutinas equilibradas, descanso suficiente y actividad física acorde a las posibilidades de cada persona. Las necesidades son distintas; para consultas personales o recomendaciones médicas, es importante acudir a profesionales de salud. Esta nota ofrece orientación general y no reemplaza una consulta profesional.',
  categoria.id,
  0
FROM categorias AS categoria
WHERE categoria.nombre = 'Salud'
  AND categoria.activo = 1
  AND NOT EXISTS (
    SELECT 1
    FROM noticias
    WHERE titulo = 'Bienestar cotidiano: hábitos saludables para la vida diaria'
  )
LIMIT 1;

INSERT INTO noticias (
  titulo, subtitulo, contenido, categoria_id, destacada
)
SELECT
  'Emprendimientos locales y su aporte a la economía regional',
  'Ideas para acompañar el trabajo de los emprendimientos de la zona.',
  'Los emprendimientos y comercios de cercanía forman parte de la vida económica de una comunidad. Conocer sus productos y servicios permite a los vecinos encontrar alternativas locales y a quienes emprenden acercarse a nuevos públicos. Para difundir una iniciativa, se recomienda compartir información de contacto y detalles previamente confirmados.',
  categoria.id,
  0
FROM categorias AS categoria
WHERE categoria.nombre = 'Economía'
  AND categoria.activo = 1
  AND NOT EXISTS (
    SELECT 1
    FROM noticias
    WHERE titulo = 'Emprendimientos locales y su aporte a la economía regional'
  )
LIMIT 1;

INSERT INTO noticias (
  titulo, subtitulo, contenido, categoria_id, destacada
)
SELECT
  'El cuidado de los espacios comunitarios es una tarea compartida',
  'El cuidado cotidiano de los espacios comunes beneficia a toda la comunidad.',
  'Plazas, veredas y otros espacios compartidos forman parte del encuentro diario entre vecinos. Mantenerlos limpios, respetar su uso y comunicar necesidades a las áreas correspondientes son acciones que ayudan a cuidarlos. Esta nota es una invitación general a la participación y no informa sobre una actividad o reclamo específico.',
  categoria.id,
  0
FROM categorias AS categoria
WHERE categoria.nombre = 'Locales'
  AND categoria.activo = 1
  AND NOT EXISTS (
    SELECT 1
    FROM noticias
    WHERE titulo = 'El cuidado de los espacios comunitarios es una tarea compartida'
  )
LIMIT 1;

INSERT INTO noticias (
  titulo, subtitulo, contenido, categoria_id, destacada
)
SELECT
  'Deporte comunitario: actividad física y participación',
  'El deporte acerca a las personas y puede ayudar a crear hábitos saludables.',
  'La actividad deportiva puede ofrecer oportunidades de encuentro, aprendizaje y trabajo en equipo para personas de distintas edades. Cada persona puede elegir una práctica acorde a sus intereses y posibilidades. Para conocer entrenamientos, horarios o resultados locales, conviene consultar a los clubes y organizadores correspondientes.',
  categoria.id,
  0
FROM categorias AS categoria
WHERE categoria.nombre = 'Deportes'
  AND categoria.activo = 1
  AND NOT EXISTS (
    SELECT 1
    FROM noticias
    WHERE titulo = 'Deporte comunitario: actividad física y participación'
  )
LIMIT 1;

INSERT INTO noticia_archivos (noticia_id, media_id, url, tipo, orden)
SELECT noticia.id, NULL, '/uploads/noticias/agenda-cultural.svg', 'imagen', 0
FROM noticias AS noticia
WHERE noticia.titulo = 'Agenda cultural: cómo mantenerse al tanto de las actividades locales'
  AND NOT EXISTS (
    SELECT 1
    FROM noticia_archivos AS archivo
    WHERE archivo.noticia_id = noticia.id
      AND archivo.url = '/uploads/noticias/agenda-cultural.svg'
  )
ORDER BY noticia.id
LIMIT 1;

INSERT INTO noticia_archivos (noticia_id, media_id, url, tipo, orden)
SELECT noticia.id, NULL, '/uploads/noticias/bienestar.svg', 'imagen', 0
FROM noticias AS noticia
WHERE noticia.titulo = 'Bienestar cotidiano: hábitos saludables para la vida diaria'
  AND NOT EXISTS (
    SELECT 1
    FROM noticia_archivos AS archivo
    WHERE archivo.noticia_id = noticia.id
      AND archivo.url = '/uploads/noticias/bienestar.svg'
  )
ORDER BY noticia.id
LIMIT 1;

INSERT INTO noticia_archivos (noticia_id, media_id, url, tipo, orden)
SELECT noticia.id, NULL, '/uploads/noticias/emprendimientos.svg', 'imagen', 0
FROM noticias AS noticia
WHERE noticia.titulo = 'Emprendimientos locales y su aporte a la economía regional'
  AND NOT EXISTS (
    SELECT 1
    FROM noticia_archivos AS archivo
    WHERE archivo.noticia_id = noticia.id
      AND archivo.url = '/uploads/noticias/emprendimientos.svg'
  )
ORDER BY noticia.id
LIMIT 1;

INSERT INTO noticia_archivos (noticia_id, media_id, url, tipo, orden)
SELECT noticia.id, NULL, '/uploads/noticias/espacios-comunitarios.svg', 'imagen', 0
FROM noticias AS noticia
WHERE noticia.titulo = 'El cuidado de los espacios comunitarios es una tarea compartida'
  AND NOT EXISTS (
    SELECT 1
    FROM noticia_archivos AS archivo
    WHERE archivo.noticia_id = noticia.id
      AND archivo.url = '/uploads/noticias/espacios-comunitarios.svg'
  )
ORDER BY noticia.id
LIMIT 1;

INSERT INTO noticia_archivos (noticia_id, media_id, url, tipo, orden)
SELECT noticia.id, NULL, '/uploads/noticias/deporte-comunitario.svg', 'imagen', 0
FROM noticias AS noticia
WHERE noticia.titulo = 'Deporte comunitario: actividad física y participación'
  AND NOT EXISTS (
    SELECT 1
    FROM noticia_archivos AS archivo
    WHERE archivo.noticia_id = noticia.id
      AND archivo.url = '/uploads/noticias/deporte-comunitario.svg'
  )
ORDER BY noticia.id
LIMIT 1;

SELECT noticia.id, noticia.titulo, categoria.nombre AS categoria, archivo.url AS imagen
FROM noticias AS noticia
JOIN categorias AS categoria ON categoria.id = noticia.categoria_id
LEFT JOIN noticia_archivos AS archivo ON archivo.noticia_id = noticia.id
WHERE noticia.titulo IN (
  'Agenda cultural: cómo mantenerse al tanto de las actividades locales',
  'Bienestar cotidiano: hábitos saludables para la vida diaria',
  'Emprendimientos locales y su aporte a la economía regional',
  'El cuidado de los espacios comunitarios es una tarea compartida',
  'Deporte comunitario: actividad física y participación'
)
ORDER BY noticia.id, archivo.orden;
