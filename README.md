# next-js-orpc-rhf-drf-demo

Next.js frontend with oRPC, React Hook Form, Zod 
where typesafe oRPC endpoints proxy requests to Django Rest Framework backend.

## Setup

### Backend

Create a `.env` file in the root of the backend directory with the following content:

```dotenv
DJANGO_SETTINGS_MODULE=core.settings.base
DEBUG=True
SECRET_KEY=random-secret-key
ALLOWED_HOSTS=backend,localhost,127.0.0.1,host.docker.internal,*

# option 1: postgres in docker
DB_ENGINE=django.db.backends.postgresql
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=postgres-db
DB_PORT=5432

POSTGRES_USER=${DB_NAME}
POSTGRES_PASSWORD=${DB_PASSWORD}
# option 2: local sqlite
USE_LOCAL_SQLITE_DB=True

SIMPLE_JWT_AUDIENCE=bff
SIMPLE_JWT_ISSUER=backend
SIMPLE_JWT_ACCESS_TOKEN_LIFETIME_SECONDS=3600
SIMPLE_JWT_REFRESH_TOKEN_LIFETIME_SECONDS=86400

API_KEY_HEADER=X-Api-Key

# optional host-container ports mapping
# BACKEND_HOST_PORT=8000
```

### Frontend

...

