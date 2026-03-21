# Frontend - Interfaz de Usuario

Esta carpeta contiene todas las páginas y rutas del frontend (interfaz de usuario del cliente).

## Estructura

```
(frontend)/
├── layout.tsx           - Layout principal de la aplicación
├── page.tsx             - Página de inicio (/)
├── agendar/             - Página de agendar
├── carrito/             - Carrito de compras
├── catalogo/            - Catálogo de productos
├── catalogo-privada/    - Catálogo privado (usuarios)
├── checkout/            - Página de checkout
├── curso/               - Detalle de un curso
├── curso-publico/       - Detalle público de curso
├── cursos/              - Lista de cursos
├── cursos-publicos/     - Lista pública de cursos
├── inscribirse/         - Página de inscripción
├── login/               - Login
├── mis-cursos/          - Mis cursos (área privada)
├── pago/                - Página de pago
├── perfil/              - Perfil de usuario
├── producto/            - Detalle de un producto
├── recuperar-contraseña/- Recuperar contraseña
├── register/            - Registro
├── reset-contraseña/    - Reset de contraseña
├── servicio/            - Detalle de un servicio
├── servicio-publico/    - Detalle público de servicio
├── servicios/           - Lista de servicios
└── servicios-publicas/  - Lista pública de servicios
```

## Notas

- Usa la carpeta `layout.tsx` para layouts compartidos
- Agrupa rutas relacionadas en subcarpetas
- Usa `page.tsx` como la ruta principal de cada carpeta
