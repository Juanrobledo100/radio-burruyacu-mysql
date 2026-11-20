# Backend Radio Burruyacu

API en Node.js, Express y Sequelize con base de datos MySQL.

## Requisitos

- Node.js 20.19 o superior, o 22.12 o superior.
- MySQL 8.
- npm.

## Puesta en marcha

1. En MySQL Workbench, abrí y ejecutá `db/radio.sql` para crear la base y las tablas.
2. Desde esta carpeta, copiá `.env.example` a `.env` y completá la conexión local a MySQL, el secreto JWT y las credenciales de prueba.
3. Instalá las dependencias y creá las cuentas:

   ```powershell
   npm install
   npm run seed
   ```

4. En MySQL Workbench, abrí y ejecutá `db/datos_demo.sql` para cargar cinco noticias con ilustraciones locales.
5. Iniciá la API:

   ```powershell
   npm run dev
   ```

La API queda disponible en `http://localhost:5000` de forma predeterminada. Multer guarda los archivos subidos en `uploads/`, servidos bajo `/uploads`. Las ilustraciones SVG de `uploads/noticias/` son recursos de ejemplo versionados; los demás archivos subidos localmente no se publican en Git.

## Usuarios de prueba

El seeder lee `ADMIN_NOMBRE`, `ADMIN_PASSWORD`, `USUARIO_NOMBRE` y `USUARIO_PASSWORD` desde `.env`. El ejemplo local usa:

| Usuario | Contraseña de prueba | Rol |
|---|---|---|
| `admin_prueba` | `Admin123!` | `admin` |
| `usuario_prueba` | `Usuario123!` | `usuario` |

Son credenciales de demostración, no deben reutilizarse en producción. No publiques `.env` ni secretos reales.

## Scripts disponibles

```powershell
npm run dev
npm start
npm run seed
```

El esquema y los datos de inicio se mantienen en `db/radio.sql` y `db/datos_demo.sql`, respectivamente. El servidor no crea ni modifica el esquema automáticamente.
