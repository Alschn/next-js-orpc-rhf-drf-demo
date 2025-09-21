ARG PYTHON_VERSION=3.13.2-alpine3.21

FROM python:${PYTHON_VERSION} as base-image

ARG GUNICORN_WORKERS=3

RUN \
    apk update && \
    apk upgrade && \
    python3 -m pip install --upgrade pip && \
    pip install poetry

FROM base-image as compile-image

ENV PYTHONUNBUFFERED=1

COPY pyproject.toml poetry.lock ./

RUN \
    apk add --virtual .build-deps gcc musl-dev postgresql-dev && \
    mkdir .venv && \
    poetry install --no-root && \
    apk --purge del .build-deps

FROM base-image as runtime

ENV PYTHONUNBUFFERED=1

COPY --from=compile-image /.venv /.venv
ENV PATH="/.venv/bin:$PATH"

WORKDIR /app

RUN \
    apk add bash postgresql-libs && \
    rm -rf /var/cache/apk/*

COPY . .
ARG GUNICORN_WORKERS=3
ENV GUNICORN_WORKERS=${GUNICORN_WORKERS}

CMD gunicorn --bind 0.0.0.0:8000 --workers ${GUNICORN_WORKERS} core.wsgi:application
EXPOSE 8000
