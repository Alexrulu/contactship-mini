# Contactship-Mini

Microservicio backend para gestión de leads, desarrollado con NestJS, TypeScript, PostgreSQL (Supabase), Redis y colas de trabajo (Bull), con integración de IA para resumir leads automáticamente.

---

## Tabla de Contenidos

- [Objetivo](#objetivo)
- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Docker](#docker)
- [Endpoints](#endpoints)
- [Ejecución](#ejecución)
---

## Objetivo

Este proyecto tiene como objetivo demostrar la capacidad de diseñar e implementar un microservicio backend que gestione leads de forma manual y automática, utilizando buenas prácticas de desarrollo, persistencia en base de datos, cache, colas y una integración de IA.

---

## Tecnologías

- **Backend:** NestJS, TypeScript
- **Base de datos:** PostgreSQL (Supabase)
- **Cache:** Redis
- **Colas:** Bull
- **IA:** Hugging Face / OpenAI (modelo de lenguaje para generar resúmenes)
- **Sincronización externa:** API Random User Generator

---

## Instalación

Clonar el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
cd contactship-mini
npm i
npm run start:dev
```
## Docker
- Ejecutar Redis en un contenedor (necesario para cache de leads):
- Abrir la terminal y ejecutar:
```bash
docker run -d --name contactship-redis -p 6379:6379 redis:7
```

## Endpoints

| Método | Ruta | Descripción | Ejemplo de body / respuesta |
|--------|------|------------|----------------------------|
| POST   | /create-lead | Crea un lead manualmente | Body: `{ "first_name": "Test", "last_name": "User", "email": "test@contactship.com" }` |
| GET    | /leads | Lista todos los leads | Response: `[ { "id": "...", "first_name": "...", "email": "...", ... }, ... ]` |
| GET    | /leads/:id | Obtiene detalle de un lead por ID (cacheado en Redis) | Response: `{ "id": "...", "first_name": "...", "email": "...", "summary": "...", "next_action": "...", ... }` |
| POST   | /leads/:id/summarize | Genera resumen y próxima acción usando IA para un lead | Response: `{ "status": "queued" }` (el resumen se genera en background) |
| POST   | /sync-external | Sincroniza 10 leads aleatorios desde Random User Generator | Response: `{ "status": "queued" }` (la inserción se hace en background) |

## Ejecución

- Se puede usar Postman, ThunderClient u otra herramienta similar para hacer requests HTTP.
- Base URL local: `http://localhost:3000`
- Headers obligatorios para todos los endpoints:
  - `x-api-key: contactship-secret`
- Para métodos POST que envían un body JSON, agregar además:
  - `Content-Type: application/json`

### Ejemplos de uso

```http
GET http://localhost:3000/leads
Headers:
- x-api-key: contactship-secret

GET http://localhost:3000/leads/:id
Headers:
- x-api-key: contactship-secret

POST http://localhost:3000/create-lead
Headers:
- x-api-key: contactship-secret
- Content-Type: application/json
{
  "first_name": "Test",
  "last_name": "User",
  "email": "test@contactship.com"
}

POST http://localhost:3000/leads/:id/summarize
Headers:
- x-api-key: contactship-secret

POST http://localhost:3000/sync-external
Headers:
- x-api-key: contactship-secret
```
