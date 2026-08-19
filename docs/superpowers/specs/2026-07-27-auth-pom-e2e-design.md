# Auth E2E con Page Object Model

Fecha: 2026-07-27  
Estado: aprobado en conversación; pendiente de implementación

## Objetivo

Agregar un test e2e Playwright con Page Object Model (POM) que cubra el flujo completo de autenticación: registro → logout → login.

## Alcance

Incluye:
- Page objects para `/login` y `/register`
- Un spec que orquesta el flujo completo
- Archivos bajo `tests/pom/`

No incluye:
- Page object de Nav/Header
- Casos de error (credenciales inválidas, email duplicado)
- Cambios en la app (auth ya tiene IDs estables)

## Estructura de archivos

```
tests/pom/
  pages/
    LoginPage.ts
    RegisterPage.ts
  auth.spec.ts
```

## Enfoque POM

Page Objects con locators + métodos de alto nivel (`goto`, `fill*`, `submit`, helpers de flujo). El spec orquesta; las pages no asertan el resultado del flujo completo.

### `RegisterPage`

- Locators: `#register-email`, `#register-password`, `#register-submit`, `#register-error`
- Métodos: `goto()`, `fillEmail()`, `fillPassword()`, `submit()`, `register(email, password)`

### `LoginPage`

- Locators: `#login-email`, `#login-password`, `#login-submit`, `#login-error`
- Métodos: `goto()`, `fillEmail()`, `fillPassword()`, `submit()`, `login(email, password)`

### Asserts de sesión (en el spec)

Usar IDs del nav existentes:
- Autenticado: `#nav-user` visible con el email; `#nav-logout` visible
- Desautenticado: `#nav-login` y `#nav-register` visibles; `#nav-user` no visible

Logout: `page.locator("#nav-logout").click()` directamente en el spec.

## Flujo del test

1. Generar email único: `user-${Date.now()}@example.com` y password fijo de test.
2. `RegisterPage.register(email, password)`.
3. Verificar redirect a `/` y `#nav-user` con el email.
4. Click `#nav-logout`.
5. Verificar estado desautenticado (`#nav-login` / `#nav-register`).
6. `LoginPage.login(email, password)`.
7. Verificar de nuevo `#nav-user` con el email.

## Datos y aislamiento

- Email dinámico para evitar colisiones en `localStorage` (`e2e-users`).
- No depende del usuario admin hardcodeado (`admin@talendready.com`).
- Auth es 100% client-side; no hace falta mock de API.

## Criterios de éxito

- `npx playwright test tests/pom/auth.spec.ts` pasa en Chromium.
- El spec no usa selectores crudos de formularios (solo vía POM), excepto nav/logout.
- No se modifican páginas de la app salvo que falte algún ID (hoy no falta).
