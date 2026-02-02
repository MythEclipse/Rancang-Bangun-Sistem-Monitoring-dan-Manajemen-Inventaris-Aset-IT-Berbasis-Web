# Architecture Diagram

Folder ini berisi semua diagram arsitektur untuk Sistem Monitoring dan Manajemen Inventaris Aset IT.

## File-file dalam folder ini:

### Diagram Arsitektur Sistem

1. **Architecture.png** - Arsitektur Keseluruhan Sistem
   - Visualisasi komponen utama sistem
   - Interaksi antar layer
   - Infrastructure overview

2. **Backend_Axum.png** - Arsitektur Backend (Framework Axum)
   - Stack teknologi backend
   - Module structure
   - Service architecture

3. **Backend_ElysiaJS.png** - Arsitektur Backend (Framework ElysiaJS)
   - Alternatif backend dengan ElysiaJS
   - Struktur dan layer

4. **Frontend.png** - Arsitektur Frontend
   - UI component structure
   - State management
   - Router dan navigation

5. **Database.png** - Database Schema
   - Entity-Relationship Diagram
   - Table structure
   - Primary & Foreign Keys

6. **ERD_Complete.png** - Entity Relationship Diagram Lengkap
   - Detailed database schema
   - Relationships antar tabel
   - Normalisasi database

### Infrastructure & DevOps

7. **Security.png** - Security Architecture
   - Authentication & Authorization
   - Data encryption
   - Security layers

8. **DevOps.png** - DevOps & Deployment
   - CI/CD Pipeline
   - Infrastructure setup
   - Containerization (Docker)
   - Orchestration (Docker Compose)

### Domain Model

9. **Actors.png** - Aktor/Users dalam Sistem
   - Admin
   - Technician
   - Manager

10. **Actor_Relationship.png** - Relasi Antar Aktor
    - Interaksi antar role
    - Responsibility mapping
    - Permission hierarchy

## Struktur Folder:

```
architecture/
├── Architecture.png
├── Backend_Axum.png
├── Backend_ElysiaJS.png
├── Frontend.png
├── Database.png
├── ERD_Complete.png
├── Security.png
├── DevOps.png
├── Actors.png
├── Actor_Relationship.png
├── README.md (file ini)
└── images/ (folder dengan gambar PNG)
```

## 🔧 Teknologi Stack

### Backend
- **Language**: TypeScript/Node.js
- **Framework Option 1**: Axum (Rust)
- **Framework Option 2**: ElysiaJS (Bun)
- **Database**: MySQL/PostgreSQL
- **ORM**: Drizzle

### Frontend
- **Framework**: React
- **Styling**: Tailwind CSS
- **Bundler**: Vite
- **State Management**: Zustand/Redux

### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **API Gateway**: Ngrok (Development)
- **Monitoring**: TBD

## 📊 Database

- **Type**: Relational (SQL)
- **Tables**: Users, Assets, Maintenance, Requests, Notifications, etc.
- **Relationships**: 1:N, N:N dengan foreign keys

## 🔐 Security

- **Authentication**: JWT Token
- **Authorization**: Role-Based Access Control (RBAC)
- **Password**: Hashing dengan bcrypt
- **API Security**: CORS, Rate Limiting

## 📦 Deployment

- **Development**: Docker Compose
- **Production**: TBD (Kubernetes/Cloud)
- **CI/CD**: Git-based pipeline

## Lihat juga:

- [Use Case Diagrams](../use-case/) - Perspektif pengguna
- [Sequence Diagrams](../sequence/) - Alur interaksi
- [Activity Diagrams](../activity/) - Alur proses bisnis
- [Class Diagrams](../class/) - Struktur kelas
