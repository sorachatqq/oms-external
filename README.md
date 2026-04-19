# OMS External API

A NestJS-based proxy/gateway service for Oil Movement System that handles external requests from ASLC and forwards them to the internal web-api service.

## Architecture

```
ASLC System
    ↓ POST/PATCH
oms-external (:3201)
    ↓ HTTP (axios)
web-api api-gateway (:3000)
    ↓ TypeORM
Oracle DB
```

## Features

- **Proxy Service**: Receives requests from ASLC and forwards to web-api
- **API Documentation**: Swagger UI available at `http://localhost:3201/docs`
- **Oil Movement Operations**: GET and UPDATE oil movement data
- **Request Normalization**: Processes and normalizes payload before forwarding

## Installation

```bash
# Install dependencies
npm install

# For development
npm run start:dev

# For production build
npm run build
npm run start:prod
```

## Usage

### Development Server

```bash
npm run start:dev
```

The server will start on `http://localhost:3201`

### API Documentation

Visit `http://localhost:3201/docs` for Swagger documentation

## API Endpoints

### GET Oil Movements

```http
POST /api/oil-movements/get
Content-Type: application/json

{
  "ref_code": ["012604190022", "012604190023"]
}
```

**Note**: Uses POST method because GET doesn't support request body

### UPDATE Oil Movements

```http
PATCH /api/oil-movements/update
Content-Type: application/json

{
  // ExternalOilMovementDto object
}
```

## Project Structure

```
src/
├── app.module.ts                 # Main application module
├── main.ts                       # Application bootstrap & Swagger setup
└── oil-movement/
    ├── dto/
    │   └── external-oil-movement.dto.ts
    ├── oil-movement.controller.ts    # API endpoints
    ├── oil-movement.module.ts        # Module configuration
    └── oil-movement.service.ts       # Business logic & proxy calls
```

## Scripts

- `npm run build` - Build the application
- `npm run start` - Start production server
- `npm run start:dev` - Start development server with hot reload
- `npm run start:prod` - Start production server from dist

## Dependencies

- **@nestjs/common**: NestJS core framework
- **@nestjs/platform-express**: Express platform for NestJS
- **@nestjs/axios**: HTTP client for NestJS
- **@nestjs/swagger**: API documentation
- **axios**: HTTP client library
- **rxjs**: Reactive programming library

## Environment

- **Port**: 3201
- **Target API**: web-api on port 3000
- **Database**: Oracle (via web-api service)

## Related Projects

- **web-api**: Main API gateway service (port 3000)
- **ASLC System**: External system that sends requests to this service

## Development Notes

- The service acts as a gateway/proxy between ASLC and web-api
- All database operations are handled by the web-api service
- Request payloads are normalized before forwarding
- Uses 30-second timeout for HTTP requests to web-api