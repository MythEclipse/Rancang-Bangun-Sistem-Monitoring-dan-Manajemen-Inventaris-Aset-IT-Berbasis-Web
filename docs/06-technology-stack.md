# Technology Stack

## 📋 Deskripsi

Dokumen ini menjelaskan stack teknologi yang direkomendasikan untuk implementasi Sistem Monitoring dan Manajemen Inventaris Aset IT berbasis web.

---

## Arsitektur Sistem

```plantuml
@startuml Architecture
skinparam backgroundColor #FEFEFE
skinparam component {
    BackgroundColor LightYellow
    BorderColor DarkOrange
}

title System Architecture: IT Asset Management System

cloud "Internet" as internet {
}

package "Client Layer" #LightBlue {
    component [Web Browser] as browser
    component [Mobile Browser] as mobile
    component [QR Scanner App] as scanner
}

package "CDN / Load Balancer" #LightGray {
    component [Nginx / Cloudflare] as cdn
}

package "Application Layer" #LightGreen {

    package "Frontend" #PaleGreen {
        component [Next.js App] as nextjs
        component [React Components] as react
        component [TailwindCSS] as tailwind
    }

    package "Backend API" #LightCoral {
        component [ElysiaJS / Axum] as api
        component [REST API] as rest
        component [WebSocket] as ws
    }

    package "Services" #LightYellow {
        component [Auth Service] as auth
        component [Asset Service] as asset
        component [Notification Service] as notif
        component [Report Service] as report
        component [Scheduler Service] as scheduler
    }
}

package "Data Layer" #LightPink {
    database "PostgreSQL" as postgres
    database "Redis Cache" as redis
    storage "File Storage\n(MinIO/S3)" as storage
}

package "External Services" #LightGray {
    component [Email Service\n(SMTP/SendGrid)] as email
    component [SMS Gateway] as sms
}

' Connections
browser --> cdn
mobile --> cdn
scanner --> cdn
cdn --> nextjs
cdn --> api

nextjs --> react
react --> tailwind
nextjs --> api

api --> rest
api --> ws
api --> auth
api --> asset
api --> notif
api --> report
api --> scheduler

auth --> postgres
auth --> redis
asset --> postgres
asset --> storage
notif --> redis
notif --> email
notif --> sms
report --> postgres
scheduler --> postgres
scheduler --> redis

@enduml
```

---

## Tech Stack Detail

### A. Backend

#### Option 1: ElysiaJS (Bun Runtime) - Recommended

```plantuml
@startuml Backend_ElysiaJS
skinparam backgroundColor #FEFEFE

package "ElysiaJS Backend" #LightCoral {

    component "Elysia Framework" as elysia {
        component [Routing] as routing
        component [Validation] as validation
        component [Swagger/OpenAPI] as swagger
        component [CORS/Security] as security
    }

    component "Plugins" as plugins {
        component [elysia-jwt] as jwt
        component [elysia-cookie] as cookie
        component [elysia-static] as static
        component [elysia-rate-limit] as ratelimit
    }

    component "ORM" as orm {
        component [Drizzle ORM] as drizzle
        component [Prisma] as prisma
    }

    component "Utilities" as utils {
        component [Zod] as zod
        component [date-fns] as datefns
        component [bcrypt] as bcrypt
        component [QRCode] as qrcode
    }
}

@enduml
```

**Kelebihan ElysiaJS:**

- 🚀 Performa sangat tinggi (Bun runtime)
- 📝 Type-safe dengan TypeScript
- 🔌 Plugin ecosystem yang lengkap
- 📖 Auto-generate OpenAPI documentation
- ⚡ Hot reload super cepat

**Dependencies:**

```json
{
  "dependencies": {
    "elysia": "^1.0.0",
    "@elysiajs/jwt": "^1.0.0",
    "@elysiajs/cookie": "^1.0.0",
    "@elysiajs/swagger": "^1.0.0",
    "@elysiajs/cors": "^1.0.0",
    "@elysiajs/static": "^1.0.0",
    "drizzle-orm": "^0.30.0",
    "@neondatabase/serverless": "^0.9.0",
    "zod": "^3.23.0",
    "bcrypt": "^5.1.0",
    "qrcode": "^1.5.0",
    "date-fns": "^3.6.0"
  }
}
```

#### Option 2: Axum (Rust)

```plantuml
@startuml Backend_Axum
skinparam backgroundColor #FEFEFE

package "Axum Backend (Rust)" #Orange {

    component "Axum Framework" as axum {
        component [Routing] as routing
        component [Extractors] as extractors
        component [Middleware] as middleware
        component [State Management] as state
    }

    component "Ecosystem" as ecosystem {
        component [Tower] as tower
        component [Tokio] as tokio
        component [Serde] as serde
        component [Tracing] as tracing
    }

    component "Database" as db {
        component [SQLx] as sqlx
        component [Sea-ORM] as seaorm
    }

    component "Utilities" as utils {
        component [jsonwebtoken] as jwt
        component [argon2] as argon2
        component [uuid] as uuid
        component [chrono] as chrono
    }
}

@enduml
```

**Kelebihan Axum:**

- 🦀 Memory safety dengan Rust
- ⚡ Performa sangat tinggi
- 🔒 Type system yang kuat
- 📦 Compile-time error checking

**Cargo.toml:**

```toml
[dependencies]
axum = "0.7"
tokio = { version = "1", features = ["full"] }
tower = "0.4"
tower-http = { version = "0.5", features = ["cors", "trace"] }
serde = { version = "1", features = ["derive"] }
serde_json = "1"
sqlx = { version = "0.7", features = ["runtime-tokio", "postgres", "uuid", "chrono"] }
jsonwebtoken = "9"
argon2 = "0.5"
uuid = { version = "1", features = ["v4", "serde"] }
chrono = { version = "0.4", features = ["serde"] }
tracing = "0.1"
tracing-subscriber = "0.3"
```

---

### B. Frontend

#### Next.js + React + TailwindCSS

```plantuml
@startuml Frontend
skinparam backgroundColor #FEFEFE

package "Frontend Stack" #LightBlue {

    component "Next.js 14+" as nextjs {
        component [App Router] as approuter
        component [Server Components] as rsc
        component [API Routes] as apiroutes
        component [Middleware] as middleware
    }

    component "React 18+" as react {
        component [Hooks] as hooks
        component [Context] as context
        component [Suspense] as suspense
    }

    component "Styling" as styling {
        component [TailwindCSS] as tailwind
        component [shadcn/ui] as shadcn
        component [Radix UI] as radix
        component [Lucide Icons] as lucide
    }

    component "State & Data" as state {
        component [TanStack Query] as query
        component [Zustand] as zustand
        component [React Hook Form] as hookform
        component [Zod] as zod
    }

    component "Utilities" as utils {
        component [date-fns] as datefns
        component [Recharts] as charts
        component [html5-qrcode] as qrscan
        component [jsPDF] as pdf
    }
}

@enduml
```

**Dependencies:**

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "tailwindcss": "^3.4.0",
    "@radix-ui/react-*": "^1.0.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.3.0",
    "@tanstack/react-query": "^5.32.0",
    "zustand": "^4.5.0",
    "react-hook-form": "^7.51.0",
    "@hookform/resolvers": "^3.3.0",
    "zod": "^3.23.0",
    "recharts": "^2.12.0",
    "date-fns": "^3.6.0",
    "lucide-react": "^0.372.0",
    "html5-qrcode": "^2.3.0",
    "jspdf": "^2.5.0",
    "xlsx": "^0.18.0"
  }
}
```

**Struktur Folder:**

```
frontend/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   │   ├── login/
│   │   └── forgot-password/
│   ├── (dashboard)/       # Dashboard routes
│   │   ├── layout.tsx
│   │   ├── page.tsx       # Dashboard home
│   │   ├── assets/        # Asset management
│   │   ├── maintenance/   # Maintenance
│   │   ├── requests/      # Request & Approval
│   │   ├── reports/       # Reports
│   │   ├── users/         # User management
│   │   └── settings/      # Settings
│   ├── api/               # API routes
│   └── layout.tsx
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── forms/             # Form components
│   ├── tables/            # Data tables
│   ├── charts/            # Chart components
│   └── layouts/           # Layout components
├── lib/
│   ├── api/               # API client
│   ├── hooks/             # Custom hooks
│   ├── utils/             # Utility functions
│   └── validations/       # Zod schemas
├── stores/                # Zustand stores
└── types/                 # TypeScript types
```

---

### C. Database

#### PostgreSQL

```plantuml
@startuml Database
skinparam backgroundColor #FEFEFE

package "Database Architecture" #LightPink {

    database "PostgreSQL 16" as postgres {
        frame "Main Schema" {
            collections users
            collections departments
            collections roles
        }

        frame "Asset Schema" {
            collections assets
            collections categories
            collections locations
            collections vendors
            collections asset_history
        }

        frame "Maintenance Schema" {
            collections maintenance_logs
            collections maintenance_schedules
            collections parts
            collections part_usage
        }

        frame "Request Schema" {
            collections requests
            collections approval_history
            collections approval_workflows
        }

        frame "Notification Schema" {
            collections notifications
            collections notification_templates
            collections notification_preferences
        }
    }

    database "Redis" as redis {
        frame "Cache" {
            collections session_cache
            collections asset_cache
            collections dashboard_cache
        }

        frame "Queue" {
            collections notification_queue
            collections email_queue
            collections job_queue
        }
    }
}

@enduml
```

**PostgreSQL Extensions:**

- `uuid-ossp` - UUID generation
- `pg_trgm` - Text search
- `btree_gist` - Indexing

**Redis Usage:**

- Session management
- Dashboard caching
- Rate limiting
- Job queues
- Real-time notifications (Pub/Sub)

---

### D. File Storage

| Option            | Use Case    | Kelebihan                     |
| ----------------- | ----------- | ----------------------------- |
| **MinIO**         | Self-hosted | S3-compatible, cost-effective |
| **AWS S3**        | Cloud       | Scalable, reliable            |
| **Cloudflare R2** | Cloud       | Zero egress fees              |

**Stored Files:**

- QR Code images
- Asset photos
- Maintenance attachments
- Report exports
- User avatars

---

### E. Authentication & Security

```plantuml
@startuml Security
skinparam backgroundColor #FEFEFE

package "Security Stack" #LightYellow {

    component "Authentication" as auth {
        component [JWT Tokens] as jwt
        component [Refresh Tokens] as refresh
        component [2FA (TOTP)] as totp
        component [Password Hashing\n(bcrypt/argon2)] as hash
    }

    component "Authorization" as authz {
        component [Role-Based Access\nControl (RBAC)] as rbac
        component [Permission Guards] as guards
        component [Resource Policies] as policies
    }

    component "Security Measures" as security {
        component [Rate Limiting] as ratelimit
        component [CORS] as cors
        component [CSRF Protection] as csrf
        component [Input Validation] as validation
        component [SQL Injection Prevention] as sqli
        component [XSS Prevention] as xss
    }

    component "Audit" as audit {
        component [Login Logs] as loginlog
        component [Action Logs] as actionlog
        component [Change History] as history
    }
}

@enduml
```

---

### F. DevOps & Deployment

```plantuml
@startuml DevOps
skinparam backgroundColor #FEFEFE

package "DevOps Stack" #LightGray {

    package "Development" {
        component [Git] as git
        component [GitHub/GitLab] as repo
        component [VS Code] as vscode
        component [Docker Compose] as compose
    }

    package "CI/CD" {
        component [GitHub Actions] as actions
        component [Docker Build] as docker
        component [Testing] as testing
        component [Linting] as linting
    }

    package "Deployment" {
        component [Docker] as dockerprod
        component [Kubernetes] as k8s
        component [Nginx] as nginx
    }

    package "Monitoring" {
        component [Prometheus] as prometheus
        component [Grafana] as grafana
        component [Loki] as loki
        component [Healthchecks] as health
    }

    package "Cloud Options" {
        component [VPS\n(Contabo/Hetzner)] as vps
        component [Vercel] as vercel
        component [Railway] as railway
    }
}

@enduml
```

**Docker Compose (Development):**

```yaml
version: "3.8"

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:3001
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=postgresql://user:pass@postgres:5432/assetdb
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:16-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=assetdb
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"

  minio:
    image: minio/minio
    command: server /data --console-address ":9001"
    volumes:
      - minio_data:/data
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      - MINIO_ROOT_USER=minio
      - MINIO_ROOT_PASSWORD=minio123

volumes:
  postgres_data:
  redis_data:
  minio_data:
```

---

## Summary Technology Stack

| Layer            | Technology                         | Justification                 |
| ---------------- | ---------------------------------- | ----------------------------- |
| **Frontend**     | Next.js 14, React 18, TailwindCSS  | Modern, performant, great DX  |
| **Backend**      | ElysiaJS/Axum                      | High performance, type-safe   |
| **Database**     | PostgreSQL 16                      | Reliable, feature-rich RDBMS  |
| **Cache**        | Redis 7                            | Fast caching, session storage |
| **ORM**          | Drizzle/Prisma (TS) or SQLx (Rust) | Type-safe database access     |
| **File Storage** | MinIO/S3                           | Scalable object storage       |
| **Auth**         | JWT + Refresh Tokens               | Stateless, secure             |
| **Container**    | Docker                             | Consistent environments       |
| **CI/CD**        | GitHub Actions                     | Automated deployments         |
| **Monitoring**   | Prometheus + Grafana               | Comprehensive observability   |

---

## Minimum Requirements

### Development Environment

- **OS**: Linux (Arch recommended), macOS, or WSL2
- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 10GB free space
- **Bun/Node**: Bun 1.1+ or Node.js 20+
- **Rust**: 1.75+ (if using Axum)
- **Docker**: 24.0+

### Production Environment (VPS)

- **CPU**: 2 vCPU minimum
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 40GB SSD
- **OS**: Ubuntu 22.04 LTS / Debian 12
