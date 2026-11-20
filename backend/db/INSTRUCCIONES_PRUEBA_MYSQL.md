# Pruebas SQL de Radio Burruyacu

## Preparación de la base

En MySQL Workbench, abrí y ejecutá `radio.sql`. Luego configurá el backend, completá las variables `ADMIN_*` y `USUARIO_*` de `.env` y ejecutá `npm run seed` desde la carpeta `backend`.

Para guardar cinco noticias informativas con ilustraciones locales, abrí y ejecutá `datos_demo.sql`. Es un seed persistente e idempotente; no lo confundas con la prueba transaccional que revierte sus cambios.

## Prueba CRUD transaccional sin banners

Abrí `prueba_crud_mysql_sin_banner.sql` en MySQL Workbench y ejecutalo en una conexión a la base `radio`. La prueba requiere que existan `admin_prueba` y `usuario_prueba`, y valida operaciones SQL y relaciones sin modificar `hero_banners`. Al final revierte los cambios temporales con `ROLLBACK`.

Antes de continuar, verificá que los indicadores `admin_prueba_disponible` y `usuario_prueba_disponible` den `1`. Si ocurre un error a mitad de ejecución, ejecutá `ROLLBACK;` antes de seguir trabajando en esa conexión.

La prueba verifica la base de datos directamente; no reemplaza la comprobación del CRUD desde la interfaz ni prueba la subida de archivos.

## Categorías completas del proyecto

Ejecutar este bloque si ya existe la base `radio` y faltan categorías:

```sql
USE radio;

INSERT IGNORE INTO categorias (nombre, activo, orden) VALUES
  ('Locales', 1, 0),
  ('Policiales', 1, 1),
  ('Salud', 1, 2),
  ('Política', 1, 3),
  ('Economía', 1, 4),
  ('Eventos', 1, 5),
  ('Deportes', 1, 6);

SELECT id, nombre, activo, orden
FROM categorias
ORDER BY orden, nombre;
```

Ejecutá primero `radio.sql` y luego los bloques siguientes en MySQL Workbench.

```sql
USE radio;
```

## 1. Usuarios

Las cuentas de prueba se crean con el seeder de backend usando las variables `ADMIN_*` y `USUARIO_*` de `.env`. Los usuarios también pueden registrarse desde la interfaz pública.

```sql
SELECT id, nombre, email, rol
FROM usuarios;
```

## 2. Configuración de la radio

```sql
INSERT INTO configuracion_radio (
  nombre,
  logo_url,
  stream_url,
  facebook,
  instagram,
  youtube,
  whatsapp
)
VALUES (
  'Radio Burruyacu',
  '/uploads/radio/logo.jpg',
  'https://ejemplo.test/radio.mp3',
  'https://facebook.com/radioburruyacu',
  'https://instagram.com/radioburruyacu',
  'https://youtube.com/@radioburruyacu',
  'https://wa.me/549000000000'
);

SET @config_id = LAST_INSERT_ID();

SELECT *
FROM configuracion_radio
WHERE id = @config_id;

UPDATE configuracion_radio
SET nombre = 'Radio Burruyacu FM'
WHERE id = @config_id;
```

## 3. Categorías

```sql
INSERT IGNORE INTO categorias (nombre, activo, orden) VALUES
  ('Locales', 1, 0),
  ('Policiales', 1, 1),
  ('Salud', 1, 2),
  ('Política', 1, 3),
  ('Economía', 1, 4),
  ('Eventos', 1, 5),
  ('Deportes', 1, 6),
  ('Prueba académica', 1, 99);

SELECT id, nombre, activo, orden
FROM categorias
ORDER BY orden, nombre;

UPDATE categorias
SET activo = 0
WHERE nombre = 'Prueba académica';

SELECT id, nombre, activo
FROM categorias
WHERE nombre = 'Prueba académica';
```

## 4. Redes sociales

```sql
INSERT INTO redes_sociales (nombre, url, activo, orden)
VALUES
  ('Facebook', 'https://facebook.com/radioburruyacu', 1, 0),
  ('Instagram', 'https://instagram.com/radioburruyacu', 1, 1),
  ('YouTube', 'https://youtube.com/@radioburruyacu', 1, 2);

SET @red_id = (
  SELECT id FROM redes_sociales
  WHERE nombre = 'Facebook'
  LIMIT 1
);

SELECT id, nombre, url, activo, orden
FROM redes_sociales
ORDER BY orden;

UPDATE redes_sociales
SET activo = 0
WHERE id = @red_id;
```

## 5. Media

```sql
INSERT INTO media (
  nombre_original,
  filename,
  ruta,
  mimetype,
  public_id,
  tipo_recurso,
  carpeta,
  tamano
)
VALUES
  (
    'prueba-noticia.jpg',
    'prueba-noticia.jpg',
    '/uploads/noticias/prueba-noticia.jpg',
    'image/jpeg',
    NULL,
    'image',
    'noticias',
    1024
  ),
  (
    'prueba-radio.png',
    'prueba-radio.png',
    '/uploads/radio/prueba-radio.png',
    'image/png',
    NULL,
    'image',
    'radio',
    2048
  ),
  (
    'prueba-banner.mp4',
    'prueba-banner.mp4',
    '/uploads/hero/prueba-banner.mp4',
    'video/mp4',
    NULL,
    'video',
    'hero',
    4096
  );

SET @media_noticia_id = (
  SELECT id FROM media
  WHERE filename = 'prueba-noticia.jpg'
  LIMIT 1
);
SET @media_radio_id = (
  SELECT id FROM media
  WHERE filename = 'prueba-radio.png'
  LIMIT 1
);
SET @media_hero_id = (
  SELECT id FROM media
  WHERE filename = 'prueba-banner.mp4'
  LIMIT 1
);

SELECT id, nombre_original, tipo_recurso, carpeta, tamano
FROM media
ORDER BY id;

UPDATE media
SET nombre_original = 'prueba-noticia-actualizada.jpg'
WHERE id = @media_noticia_id;
```

## 6. Noticias

```sql
SET @categoria_id = (
  SELECT id FROM categorias
  WHERE nombre = 'Prueba académica'
  LIMIT 1
);

INSERT INTO noticias (
  titulo,
  subtitulo,
  contenido,
  categoria_id,
  destacada,
  fecha_publicacion
)
VALUES (
  'Noticia de prueba desde MySQL',
  'Prueba de inserción y relaciones',
  'Contenido de prueba para demostrar que la noticia se guarda y se relaciona con su categoría.',
  @categoria_id,
  1,
  CURRENT_TIMESTAMP
);

SET @noticia_id = LAST_INSERT_ID();

SELECT
  n.id,
  n.titulo,
  n.subtitulo,
  n.destacada,
  c.nombre AS categoria
FROM noticias n
JOIN categorias c ON c.id = n.categoria_id
WHERE n.id = @noticia_id;

UPDATE noticias
SET
  titulo = 'Noticia de prueba actualizada',
  destacada = 0
WHERE id = @noticia_id;
```

## 7. Archivos asociados a noticias

```sql
INSERT INTO noticia_archivos (
  noticia_id,
  media_id,
  url,
  tipo,
  orden
)
VALUES (
  @noticia_id,
  @media_noticia_id,
  '/uploads/noticias/prueba-noticia.jpg',
  'imagen',
  0
);

SET @archivo_noticia_id = LAST_INSERT_ID();

SELECT
  na.id,
  na.noticia_id,
  n.titulo AS noticia,
  na.media_id,
  m.nombre_original AS medio,
  na.url,
  na.tipo,
  na.orden
FROM noticia_archivos na
JOIN noticias n ON n.id = na.noticia_id
LEFT JOIN media m ON m.id = na.media_id
WHERE na.id = @archivo_noticia_id;

UPDATE noticia_archivos
SET orden = 1
WHERE id = @archivo_noticia_id;
```

## 8. Banners principales

```sql
INSERT INTO hero_banners (
  titulo,
  subtitulo,
  tipo_media,
  media_url,
  media_id,
  link_accion,
  texto_boton,
  orden,
  activo
)
VALUES (
  'Banner de prueba',
  'Banner creado desde MySQL',
  'video',
  '/uploads/hero/prueba-banner.mp4',
  @media_hero_id,
  '/noticias',
  'Ver noticias',
  1,
  1
);

SET @banner_id = LAST_INSERT_ID();

SELECT
  h.id,
  h.titulo,
  h.tipo_media,
  h.media_url,
  m.nombre_original AS medio,
  h.link_accion,
  h.activo
FROM hero_banners h
LEFT JOIN media m ON m.id = h.media_id
WHERE h.id = @banner_id;

UPDATE hero_banners
SET activo = 0
WHERE id = @banner_id;
```

## 9. Contactos

```sql
INSERT INTO contactos (
  nombre,
  email,
  telefono,
  asunto,
  mensaje,
  estado
)
VALUES (
  'Visitante de prueba',
  'visitante@ejemplo.test',
  '3810000000',
  'Prueba académica',
  'Mensaje creado desde MySQL para probar la tabla contactos.',
  'pendiente'
);

SET @contacto_id = LAST_INSERT_ID();

SELECT
  id,
  nombre,
  email,
  telefono,
  asunto,
  mensaje,
  estado,
  creado_en
FROM contactos
WHERE id = @contacto_id;

UPDATE contactos
SET asunto = 'Prueba académica actualizada',
    estado = 'realizado'
WHERE id = @contacto_id;
```

## 10. Consulta general de relaciones

```sql
SELECT
  n.id AS noticia_id,
  n.titulo,
  c.nombre AS categoria,
  na.url AS archivo,
  m.nombre_original AS medio
FROM noticias n
JOIN categorias c ON c.id = n.categoria_id
LEFT JOIN noticia_archivos na ON na.noticia_id = n.id
LEFT JOIN media m ON m.id = na.media_id
ORDER BY n.id;
```

## 11. Eliminación opcional de datos de prueba

Primero ejecutar las consultas anteriores y conservar una captura de los resultados. Luego ejecutar:

```sql
DELETE FROM noticia_archivos
WHERE id = @archivo_noticia_id;

DELETE FROM noticias
WHERE id = @noticia_id;

DELETE FROM hero_banners
WHERE id = @banner_id;

DELETE FROM contactos
WHERE id = @contacto_id;

DELETE FROM media
WHERE id IN (@media_noticia_id, @media_radio_id, @media_hero_id);

DELETE FROM redes_sociales
WHERE nombre IN ('Facebook', 'Instagram', 'YouTube');

DELETE FROM categorias
WHERE nombre = 'Prueba académica';

DELETE FROM configuracion_radio
WHERE id = @config_id;

DELETE FROM usuarios
WHERE nombre IN ('admin_prueba', 'usuario_prueba');
```
