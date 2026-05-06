# VetOnline — Sistema de Gestión Veterinaria

Plataforma web completa para clínica veterinaria. Permite a los clientes explorar servicios y reservar turnos online, mientras que veterinarios y administradores gestionan turnos, servicios y personal desde un panel dedicado.

---

## Tecnologías

### Frontend
| Tecnología | Versión | Uso |
|---|---|---|
| Next.js | 14 | Framework React con routing por páginas |
| React | 18 | UI |
| TypeScript | — | Tipado estático |
| Tailwind CSS | — | Estilos utilitarios |
| Auth0 React SDK | — | Autenticación / sesión |
| Space Grotesk | — | Tipografía principal (Google Fonts) |

### Backend
| Tecnología | Versión | Uso |
|---|---|---|
| Java | 17 | Lenguaje |
| Spring Boot | 3.5 | Framework principal |
| Spring Security + OAuth2 | — | Validación de JWT |
| Spring Data JPA / Hibernate | — | ORM |
| MySQL | 8 | Base de datos |
| Auth0 Management API | — | Creación de usuarios y asignación de roles |

### Autenticación
- Proveedor: **Auth0**
- Roles: `admin`, `veterinario`, `cliente`
- Claims en JWT bajo el namespace `https://cafeteria.com/roles`
- Roles mapeados en Spring Security con prefijo `ROLE_` (ej: `ROLE_CLIENTE`)

---

## Estructura del proyecto

```
Proyecto/
├── Frontend-veterinaria/        # Aplicación Next.js
│   ├── pages/                   # Rutas de la app
│   │   ├── index.tsx            # Home / login
│   │   ├── menu.tsx             # Catálogo de servicios (clientes)
│   │   ├── mis-pedidos.tsx      # Historial de turnos (clientes)
│   │   ├── pedidos.tsx          # Gestión de turnos (veterinarios)
│   │   └── admin.tsx            # Panel de administración
│   ├── src/
│   │   ├── components/
│   │   │   ├── Admin/           # AdminView, MenuItemForm, VeterinarioView
│   │   │   ├── Auth/            # LoginButton, LogoutButton
│   │   │   ├── Layout/          # Header
│   │   │   ├── Menu/            # MenuView, MenuCard
│   │   │   └── Orders/          # OrdersView, OrderCard
│   │   ├── hooks/
│   │   │   └── useAuth.ts       # Hook de autenticación y roles
│   │   ├── services/
│   │   │   └── api.ts           # Cliente HTTP hacia el backend
│   │   ├── config/
│   │   │   └── auth0.ts         # Config Auth0 y API_BASE_URL
│   │   └── types/
│   │       └── index.ts         # Interfaces TypeScript
│   └── styles/
│       └── globals.css          # Estilos globales y animaciones
│
└── Backend-Veterinaria/         # API REST Spring Boot
    └── src/main/java/.../
        ├── controllers/
        │   ├── PublicController.java    # GET /public/menu
        │   ├── PrivateController.java
        │   ├── OrderController.java     # CRUD turnos
        │   ├── VeterinarioController.java
        │   └── AdminUsuarioController.java
        ├── entity/
        │   ├── MenuItem.java
        │   ├── Order.java
        │   ├── OrderItem.java
        │   └── Persona.java
        ├── service/
        │   ├── MenuItemService.java
        │   ├── OrderService.java
        │   └── Auth0Service.java
        ├── config/
        │   └── SecurityConfig.java      # JWT + CORS + roles
        └── dto/
            ├── OrderDTO.java
            └── OrderItemDTO.java
```

---

## Roles y permisos

| Rol | Acceso |
|---|---|
| `cliente` | Ver servicios, reservar turnos, ver sus propios turnos |
| `veterinario` | Ver y gestionar todos los turnos |
| `admin` | Todo lo anterior + gestión de servicios y veterinarios |

### Flujo de redirección post-login
```
Login exitoso
├── admin       → /admin
├── veterinario → /pedidos
└── cliente     → /menu
```

---

## Endpoints principales

### Públicos
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/public/menu` | Listar servicios disponibles (`available = true`) |

### Privados (requieren JWT)
| Método | Ruta | Rol requerido | Descripción |
|---|---|---|---|
| GET | `/private/menu` | ADMIN | Listar todos los servicios |
| POST | `/private/menu` | ADMIN | Crear servicio |
| PUT | `/private/menu/{id}` | ADMIN | Editar servicio |
| DELETE | `/private/menu/{id}` | ADMIN | Eliminar servicio |
| POST | `/private/orders` | CLIENTE | Crear turno |
| GET | `/private/orders/my` | CLIENTE | Ver mis turnos |
| GET | `/private/orders` | VETERINARIO, ADMIN | Ver todos los turnos |
| PUT | `/private/orders/{id}/status` | VETERINARIO, ADMIN | Cambiar estado del turno |
| GET | `/private/users?role=veterinario` | ADMIN | Listar veterinarios |
| POST | `/private/users` | ADMIN | Crear veterinario |

---

## Configuración y variables de entorno

### Frontend — `.env.local`
```env
NEXT_PUBLIC_AUTH0_DOMAIN=dev-qnnixkm1mha32a8b.us.auth0.com
NEXT_PUBLIC_AUTH0_CLIENT_ID=<client_id_spa>
NEXT_PUBLIC_AUTH0_AUDIENCE=https://veterinaria-api
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Backend — `application.properties`
```properties
spring.datasource.url=jdbc:mysql://127.0.0.1:3308/veterinaria
spring.datasource.username=root
spring.datasource.password=root

auth0.domain=dev-qnnixkm1mha32a8b.us.auth0.com
auth0.issuer=https://dev-qnnixkm1mha32a8b.us.auth0.com/
auth0.audience=https://dev-qnnixkm1mha32a8b.us.auth0.com/api/v2/
auth0.clientId=<m2m_client_id>
auth0.clientSecret=<m2m_client_secret>
auth0.veterinarioRoleId=rol_YftjaL5kFvP5Pg9l
```

---

## Instalación y ejecución

### Requisitos previos
- Node.js 18+
- Java 17+
- Maven 3.8+
- MySQL 8 corriendo en puerto `3308`
- Cuenta Auth0 configurada

### 1. Base de datos
```sql
CREATE DATABASE veterinaria;
```
Luego ejecutar el script de servicios iniciales (ver sección **Datos iniciales**).

### 2. Backend
```bash
cd Backend-Veterinaria
./mvnw spring-boot:run
# Disponible en http://localhost:8080
```

### 3. Frontend
```bash
cd Frontend-veterinaria
npm install
npm run dev
# Disponible en http://localhost:3000
```

---

## Datos iniciales (servicios)

Ejecutar en MySQL para poblar los servicios del catálogo:

```sql
DELETE FROM order_items; DELETE FROM orders; DELETE FROM menu_items;
ALTER TABLE menu_items AUTO_INCREMENT = 1;

INSERT INTO menu_items (name, description, category, price, available, image) VALUES
('Consulta General',       'Revisión clínica completa con diagnóstico y recomendaciones.',              'Consulta General',        3500,  1, NULL),
('Vacunación Antirrábica', 'Vacuna obligatoria contra la rabia. Válida 1 año con certificado.',         'Vacunación',              2500,  1, NULL),
('Vacunación Séxtuple',    'Protección contra moquillo, hepatitis, parvovirus y más.',                  'Vacunación',              3800,  1, NULL),
('Castración Macho',       'Esterilización para machos con anestesia general y recuperación asistida.', 'Cirugía',                18000,  1, NULL),
('Castración Hembra',      'Esterilización para hembras con anestesia general y recuperación asistida.','Cirugía',                24000,  1, NULL),
('Baño y Peluquería Pequeño','Baño, secado, corte y uñas para razas hasta 10 kg.',                     'Peluquería y Baño',       4500,  1, NULL),
('Baño y Peluquería Grande', 'Baño, secado, corte y uñas para razas más de 10 kg.',                    'Peluquería y Baño',       7000,  1, NULL),
('Limpieza Dental',         'Destartarización y limpieza profunda bajo anestesia general.',             'Odontología',            12000,  1, NULL),
('Radiografía Digital',     'Imagen digital para fracturas, órganos y patologías internas.',           'Diagnóstico por Imagen',  6500,  1, NULL),
('Ecografía Abdominal',     'Estudio ecográfico de órganos abdominales.',                              'Diagnóstico por Imagen',  8000,  1, NULL),
('Hemograma Completo',      'Análisis de sangre para evaluación general de salud.',                    'Análisis Clínicos',       4200,  1, NULL),
('Perfil Bioquímico',       'Función hepática, renal y otros parámetros en sangre.',                   'Análisis Clínicos',       5500,  1, NULL),
('Urgencia 24hs',           'Atención de emergencias con guardia activa las 24hs, 365 días.',          'Urgencias',               9500,  1, NULL);
```

---

## Auth0 — Acciones configuradas

### Post-Login (setear claims en JWT)
```js
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://cafeteria.com/roles';
  const assignedRoles = event.authorization?.roles || ['cliente'];
  api.idToken.setCustomClaim(namespace, assignedRoles);
  api.accessToken.setCustomClaim(namespace, assignedRoles);
};
```

### Post-User-Registration (asignar rol cliente automáticamente)
```js
exports.onExecutePostUserRegistration = async (event, api) => {
  const axios = require('axios');
  const { data: { access_token } } = await axios.post(
    `https://${event.secrets.AUTH0_DOMAIN}/oauth/token`,
    {
      client_id:     event.secrets.AUTH0_M2M_CLIENT_ID,
      client_secret: event.secrets.AUTH0_M2M_CLIENT_SECRET,
      audience:      `https://${event.secrets.AUTH0_DOMAIN}/api/v2/`,
      grant_type:    'client_credentials',
    }
  );
  await axios.post(
    `https://${event.secrets.AUTH0_DOMAIN}/api/v2/users/${event.user.user_id}/roles`,
    { roles: [event.secrets.CLIENTE_ROLE_ID] },
    { headers: { Authorization: `Bearer ${access_token}`, 'Content-Type': 'application/json' } }
  );
};
```

---

## Estados de un turno

```
PENDIENTE → EN_PROGRESO → COMPLETADO
    └──────────────────→ CANCELADO
```

| Estado | Quién lo cambia |
|---|---|
| `PENDIENTE` | Se crea automáticamente |
| `EN_PROGRESO` | Veterinario / Admin |
| `COMPLETADO` | Veterinario / Admin |
| `CANCELADO` | Veterinario / Admin |

---

## Paleta de colores (Tailwind)

| Nombre | Color | Uso |
|---|---|---|
| `clinic-*` | Verde farmacia (teal) | Color primario, botones, acentos |
| `medblue-*` | Azul médico | Gradientes, secundario |
| `slate-*` | Grises neutros | Texto, bordes |
