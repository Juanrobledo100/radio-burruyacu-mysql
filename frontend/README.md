# Radio Burruyacu — Frontend

Sitio público y panel de administración construidos con React, Vite y Tailwind CSS. El frontend consume la API Express/MySQL del directorio `backend`.

## Desarrollo local

Usá Node.js 20.19 o superior, o 22.12 o superior (requisito de Vite 8).

1. Iniciá el backend en `http://localhost:5000` y configurá su conexión a MySQL.
2. Desde esta carpeta, ejecutá:

   ```bash
   npm install
   npm run dev
   ```

3. Vite abre el sitio en `http://localhost:5173`. Si el backend usa otra dirección, configurá `VITE_API` en `.env`; esa URL se usa para la API y los archivos de `/uploads`.

## Rutas

| Dirección | Contenido |
| --- | --- |
| `/` | Inicio, reproductor y últimas noticias |
| `/noticias` | Listado de noticias |
| `/noticias/:id` | Detalle de una noticia |
| `/nosotros` | Información de la emisora |
| `/contacto` | Consultas, pedido de temas, ubicación y canales de contacto |
| `/registro` | Registro de una cuenta con rol usuario |
| `/ingresar` | Inicio de sesión compartido para usuarios y administradores |
| `/PanelAdmin` | Panel protegido de administración |
| `/PanelAdmin/categorias` | Listado de categorías |
| `/PanelAdmin/categorias/nueva` | Crear categoría |
| `/PanelAdmin/categorias/:id/editar` | Editar categoría |
| `/PanelAdmin/noticias` | Listado de noticias |
| `/PanelAdmin/noticias/nueva` | Crear noticia |
| `/PanelAdmin/noticias/:id/editar` | Editar noticia |
| `/PanelAdmin/redes` | Listado de redes sociales |
| `/PanelAdmin/redes/nueva` | Crear red social |
| `/PanelAdmin/redes/:id/editar` | Editar red social |
| `/PanelAdmin/usuarios` | Listado de usuarios |
| `/PanelAdmin/usuarios/nueva` | Crear usuario |
| `/PanelAdmin/usuarios/:id/editar` | Editar usuario |
| `/PanelAdmin/banners` | Listado de banners |
| `/PanelAdmin/banners/nuevo` | Crear banner |
| `/PanelAdmin/banners/:id/editar` | Editar banner |

Las cinco entidades indicadas tienen vistas separadas de listado, alta y edición. El panel también permite administrar mensajes recibidos y la configuración de la radio.

El registro está disponible en la navegación principal. Una cuenta nueva recibe el rol `usuario` y, al registrarse, es dirigida al formulario de contacto con su nombre y correo precargados. Al ingresar, un administrador va al panel y un usuario a contacto.

## Organización

- `src/pages`: páginas públicas y secciones del panel.
- `src/components`: elementos de interfaz reutilizables, incluido el reproductor.
- `src/layouts/PublicLayout.jsx`: navegación, contenido público y pie de página.
- `src/stores/authStore.js`: sesión del panel con Zustand.
- `src/context/AudioContext.jsx`: estado compartido del reproductor.
- `src/config/api.js`: peticiones a la API y URLs de archivos.

Para enviar una consulta o pedir un tema hay que iniciar sesión. Ambos se guardan en `contactos` mediante `POST /api/contacto`; solo el panel de administración puede leerlos mediante `GET /api/contacto`, filtrarlos por estado pendiente/realizado y cambiar su estado mediante `PATCH /api/contacto/:id/estado`. Las categorías se guardan en `categorias` y las noticias las referencian por `categoria_id`.

Para una instalación nueva, usá `../backend/db/radio.sql`.

## Comprobaciones

```bash
npm run lint
npm run build
```
