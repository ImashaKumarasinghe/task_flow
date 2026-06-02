# TaskFlow – Full Stack Engineer Assessment

Backend-focused task management API built using Next.js App Router, TypeScript, and Supabase following Clean Architecture principles.

---

# Tech Stack

* Next.js App Router
* TypeScript
* Supabase Authentication
* Supabase PostgreSQL
* Row Level Security (RLS)
* Clean Architecture
* REST API

---

# Features

## Authentication

* User Signup
* User Signin
* User Signout
* Session validation using Supabase access tokens
* Automatic user profile creation using Supabase triggers

## Projects

* Create Project
* Get All Projects
* Get Single Project
* Update Project
* Delete Project
* Owner-only access control

## Tasks

* Create Task inside Project
* List Tasks by Project
* Update Task
* Delete Task
* Tasks scoped to project ownership

## Reliability

* Structured error handling
* Repository-level logging
* Predictable error responses

## Performance

* In-memory cache for project listing
* Cache invalidation after create/update/delete

---

# Architecture

This project follows Clean Architecture principles.

```text
app/
 └── api/
      ├── auth/
      └── projects/

domain/
repositories/
use-cases/
lib/
supabase/
```

## Layer Responsibilities

### app/api/**

Thin route handlers only.

Responsibilities:

* Parse requests
* Validate input
* Call use-cases
* Return responses

No database logic exists here.

### use-cases/

Contains business logic.

Responsibilities:

* Authorization checks
* Cache handling
* Ownership validation
* Calling repositories

### repositories/

Contains all Supabase queries.

Responsibilities:

* CRUD operations
* Error handling
* Query execution

### domain/

Contains:

* Interfaces
* Types
* Shared result models

### lib/

Contains:

* Supabase client
* Authentication helpers
* Error helpers
* Cache helpers

---

# Folder Structure

```text
app/
 └── api/
      ├── auth/
      │    ├── signin/
      │    ├── signup/
      │    └── signout/
      │
      └── projects/
           ├── route.ts
           ├── [id]/
           │     ├── route.ts
           │     └── tasks/
           │          ├── route.ts
           │          └── [taskId]/
           │               └── route.ts

domain/
 ├── project.ts
 ├── task.ts
 ├── user.ts
 └── result.ts

repositories/
 ├── projectRepository.ts
 ├── taskRepository.ts
 └── userRepository.ts

use-cases/
 ├── authUseCases.ts
 ├── projectUseCases.ts
 └── taskUseCases.ts

lib/
 ├── auth.ts
 ├── cache.ts
 ├── errors.ts
 └── supabase/
      └── server.ts

supabase/
 └── migrations/
      └── 001_create_tables.sql
```

---

# Environment Variables

Create:

```text
.env.local
```

Add:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Never commit:

```text
.env.local
```

---

# Installation

Clone repository:

```bash
git clone YOUR_REPO_URL
cd taskflow
```

Install dependencies:

```bash
npm install
```

Run:

```bash
npm run dev
```

Application:

```text
http://localhost:3000
```

---

# Database Setup

Run SQL migration file:

```text
supabase/migrations/001_create_tables.sql
```

Tables created:

* users
* projects
* tasks

---

# Authentication Setup

Email confirmation disabled for testing.

Navigation:

```text
Supabase
→ Authentication
→ Sign In / Providers
→ Disable Confirm Email
```

---

# User Profile Trigger

User profiles are automatically created after signup.

SQL Trigger:

```sql
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();
```

Reason:

Avoids RLS violations during signup.

---

# Row Level Security (RLS)

Enabled on:

```text
users
projects
tasks
```

Rules enforce:

* Users access only own projects
* Users access only tasks belonging to owned projects
* Unauthorized access blocked automatically

---

# Caching Strategy

Problem:

Repeated project list requests caused unnecessary database queries.

Solution:

* Cache key = authenticated user id
* TTL = 60 seconds
* Cache cleared after:

```text
Create Project
Update Project
Delete Project
```

Implementation location:

```text
use-cases/projectUseCases.ts
```

---

# Error Handling Strategy

All repositories:

* Wrapped in try/catch
* Logged using console.error()
* Return structured responses

Example:

```json
{
  "error": "Something went wrong"
}
```

No silent failures.

---

# API Endpoints

## Authentication

### Signup

```http
POST /api/auth/signup
```

Body:

```json
{
  "email": "test@gmail.com",
  "password": "12345678",
  "name": "Test User"
}
```

---

### Signin

```http
POST /api/auth/signin
```

Body:

```json
{
  "email": "test@gmail.com",
  "password": "12345678"
}
```

Returns:

```json
{
  "accessToken": "...",
  "refreshToken": "..."
}
```

---

### Signout

```http
POST /api/auth/signout
```

---

# Authorization Header

Protected routes require:

```text
Authorization: Bearer ACCESS_TOKEN
```

Do NOT send token in URL parameters.

Correct:

```text
Headers
Authorization: Bearer eyJ...
```

Wrong:

```text
/api/projects?id=1&Authorization=Bearer...
```

---

# Projects API

## Create Project

```http
POST /api/projects
```

Body:

```json
{
  "name": "TaskFlow",
  "description": "Assessment project"
}
```

---

## Get All Projects

```http
GET /api/projects
```

---

## Get Single Project

```http
GET /api/projects/:id
```

---

## Update Project

```http
PATCH /api/projects/:id
```

---

## Delete Project

```http
DELETE /api/projects/:id
```

---

# Tasks API

## Create Task

```http
POST /api/projects/:id/tasks
```

Body:

```json
{
  "title": "Testing",
  "status": "todo",
  "dueDate": "2026-06-05"
}
```

---

## Get Tasks

```http
GET /api/projects/:id/tasks
```

---

## Update Task

Method:

```http
PATCH
```

URL:

```http
/api/projects/:id/tasks/:taskId
```

Example:

```json
{
  "title": "Updated Task",
  "status": "in_progress"
}
```

---

## Delete Task

```http
DELETE /api/projects/:id/tasks/:taskId
```

---

# Testing

Recommended tool:

```text
Postman
```

Testing order:

```text
1. Signup
2. Signin
3. Create Project
4. List Projects
5. Create Task
6. List Tasks
7. Update Task
8. Delete Task
9. Delete Project
```

---

# Security Considerations

* Supabase Auth sessions
* Protected routes
* RLS enabled
* Owner-only access
* Environment variables hidden

---

# Assumptions

* Email confirmation disabled during assessment
* In-memory cache sufficient for assessment scale
* API-only implementation required

---

# Author

Imasha Kumarasinghe

Software Engineering Undergraduate
Sabaragamuwa University of Sri Lanka

```
```
