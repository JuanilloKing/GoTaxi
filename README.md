# GoTaxi

## 🧾 Índice
1. [Introducción: ¿Qué es GoTaxi?](#-introducción-qué-es-gotaxi)
2. [Requisitos e Instalación](#️-requisitos-e-instalación)
3. [Configuración del Entorno](#-configuración-del-entorno)
4. [Migraciones y Seeders](#️-migraciones-y-seeders)
5. [Configuración de Colas (Queue)](#-configuración-de-colas-queue)
6. [Credenciales de Prueba](#-credenciales-de-prueba)
7. [Contacto](#-contacto)

## 1. Introducción: ¿Qué es GoTaxi?

**GoTaxi** es una plataforma moderna desarrollada en Laravel para gestionar clientes con taxistas de manera rápida, ordenada y eficiente.

El proyecto cuenta con:
- Panel de administración para gestionar y editar usuarios y tarifas.
- Interfaz de cliente para hacer reservas de taxi de manera sencilla, pudiendo elegir calles, lugares emblemanticos o tiendas que tengas cerca para pedir el servicio.
- Sistema de taxistas con lógica de aceptación/rechazo de reservas en tiempo real.
- Notificaciones automáticas y sistema de colas.

## 2. Requisitos e Instalación

Antes de ejecutar GoTaxi, asegúrate de tener instalados:

### Requisitos:
- [PHP 8.1+](https://www.php.net/)
- [Composer](https://getcomposer.org/)
- [Node.js & NPM](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/)
- Laravel Queues (configurado con supervisor o `php artisan queue:work`)

### Clona el repositorio:
```bash
git clone https://github.com/tuusuario/gotaxi.git
cd gotaxi
```

### Instala las dependencias:
```bash
composer install
npm install && npm run dev
```

## 3. Configuración del Entorno

```bash
cp .env.example .env
```

Edita el `.env`:
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=gotaxi
DB_USERNAME=gotaxi
DB_PASSWORD=gotaxi
```

```bash
php artisan key:generate
```

## 4. Migraciones y Seeders

```bash
php artisan migrate --seed
```

## 5. Configuración de Colas (Queue)

```bash
php artisan queue:work
```

En producción, usa `Supervisor` para mantener el worker activo.

## 6. Credenciales de Prueba

### Administrador:
- **Email:** `admin@admin`
- **Contraseña:** `adminadmin`

### Clientes:
- `manuel@example.com` / `password`

### Taxistas:
- `juan@example.com` / `password`
- `maria@example.com` / `password`
- `pedro@example.com` / `password`

## 7.Contacto

Abre un issue o contacta conmigo al siguiente correo: eduardo.sumariva@iesdonana.org
