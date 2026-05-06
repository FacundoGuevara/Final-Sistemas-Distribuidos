# Guía de Configuración - Frontend Cafetería

## 📋 Configuración Inicial

### 1. Configurar Auth0

#### Paso 1: Crear una aplicación en Auth0
1. Ve a [Auth0 Dashboard](https://manage.auth0.com)
2. Crea una nueva aplicación tipo "Single Page Application"
3. Toma nota del **Domain** y **Client ID**

#### Paso 2: Configurar URLs permitidas
En la configuración de tu aplicación en Auth0:
- **Allowed Callback URLs**: `http://localhost:3000`
- **Allowed Logout URLs**: `http://localhost:3000`  
- **Allowed Web Origins**: `http://localhost:3000`

#### Paso 3: Crear API
1. Ve a APIs en el dashboard de Auth0
2. Crea una nueva API con identificador: `http://localhost:8080`
3. Habilita "Allow Offline Access" si necesitas refresh tokens

#### Paso 4: Configurar Roles
1. Ve a User Management > Roles
2. Crea los siguientes roles:
   - `admin` (descripción: "Administrador con acceso completo")
   - `barista` (descripción: "Barista que gestiona pedidos")
   - `cliente` (descripción: "Cliente que puede hacer pedidos")

#### Paso 5: Configurar Claims personalizados
1. Ve a Actions > Library
2. Crea una nueva Action:

```javascript
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://cafeteria.com/roles';
  const assignedRoles = event.authorization.roles || ['cliente'];
  
  // Agregar roles al token
  api.idToken.setCustomClaim(namespace, assignedRoles);
  api.accessToken.setCustomClaim(namespace, assignedRoles);
};
```

3. Agregala al flow de "Login"

### 2. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Auth0 Configuration
REACT_APP_AUTH0_DOMAIN=tu-dominio.auth0.com
REACT_APP_AUTH0_CLIENT_ID=tu-client-id
REACT_APP_AUTH0_AUDIENCE=http://localhost:8080

# API Configuration
REACT_APP_API_URL=http://localhost:8080
```

### 3. Asignar Roles a Usuarios

#### Opción 1: Desde el Dashboard
1. Ve a User Management > Users
2. Selecciona un usuario
3. Ve a la pestaña "Roles"
4. Asigna el rol correspondiente

#### Opción 2: Programáticamente
```javascript
// En tu backend o usando Auth0 Management API
const ManagementClient = require('auth0').ManagementClient;

const management = new ManagementClient({
  domain: 'tu-dominio.auth0.com',
  clientId: 'tu-client-id',
  clientSecret: 'tu-client-secret',
  scope: 'read:users update:users'
});

// Asignar rol a usuario
management.assignRolestoUser(
  { id: 'user-id' },
  { roles: ['rol-id'] }
);
```

## 🚀 Comandos Útiles

### Desarrollo
```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start

# Verificar tipos de TypeScript
npm run type-check

# Ejecutar linter
npm run lint

# Compilar para producción
npm run build
```

### Testing
```bash
# Ejecutar pruebas
npm test

# Ejecutar pruebas con coverage
npm run test:coverage
```

## 🔧 Estructura de Roles

### Cliente (`cliente`)
- ✅ Ver menú público
- ✅ Agregar productos al carrito
- ✅ Realizar pedidos
- ✅ Ver sus propios pedidos
- ❌ No puede ver pedidos de otros
- ❌ No puede gestionar menú

### Barista (`barista`)
- ✅ Ver todos los pedidos
- ✅ Actualizar estado de pedidos
- ✅ Cancelar pedidos
- ✅ Ver menú completo
- ❌ No puede agregar/editar productos del menú

### Admin (`admin`)
- ✅ Todas las funcionalidades de barista
- ✅ Agregar nuevos productos
- ✅ Editar productos existentes
- ✅ Eliminar productos
- ✅ Gestión completa del menú

## 🎨 Personalización de Estilos

### Colores del Tema
Los colores están definidos en `tailwind.config.js`:

```javascript
colors: {
  coffee: {
    50: '#f7f3f0',   // Muy claro
    100: '#e8ddd4',  // Claro
    200: '#d4c2a8',  // Medio claro
    300: '#bc9a7a',  // Medio
    400: '#a67c52',  // Medio oscuro
    500: '#8b5a2b',  // Principal
    600: '#6f4518',  // Oscuro
    700: '#523010',  // Muy oscuro
    800: '#3a1f0a',  // Casi negro
    900: '#1f0f04',  // Negro
  }
}
```

### Cambiar Colores
Para usar diferentes colores, modifica el archivo `tailwind.config.js` y actualiza las clases CSS en los componentes.

## 🐛 Troubleshooting

### Error: "Cannot read property 'roles' of undefined"
**Solución**: Verifica que los roles estén correctamente configurados en Auth0 y que el namespace sea el correcto.

### Error: "Access token expired"
**Solución**: El token se renueva automáticamente. Si persiste, verifica la configuración de Auth0.

### Error: "CORS policy error"
**Solución**: Asegúrate de que el backend esté configurado para permitir requests desde `http://localhost:3000`.

### Error: "Failed to fetch menu"
**Solución**: 
1. Verifica que el backend esté ejecutándose en el puerto correcto
2. Revisa que `REACT_APP_API_URL` esté configurado correctamente
3. Verifica los endpoints del backend

## 📱 Responsive Design

La aplicación está diseñada para ser responsive:
- **Desktop**: Experiencia completa con todas las funcionalidades
- **Tablet**: Navegación adaptada con menús colapsables
- **Mobile**: Interfaz optimizada para touch

## 🔐 Seguridad

### Tokens
- Los tokens se manejan automáticamente por Auth0
- Se renuevan automáticamente antes de expirar
- No se almacenan en localStorage por seguridad

### Roles
- Los roles se verifican tanto en frontend como backend
- El frontend solo oculta/muestra elementos según roles
- La autorización real debe implementarse en el backend

## 📦 Dependencias Principales

- `@auth0/auth0-react` - Autenticación
- `react-router-dom` - Enrutamiento
- `tailwindcss` - Estilos
- `typescript` - Tipado estático

## 🤝 Contribución

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request 