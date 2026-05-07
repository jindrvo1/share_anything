# Pomoc Teď 🤝

Místní micro-service platforma pro rychlou vzájemnou pomoc mezi uživateli v České republice.

## O aplikaci

**Pomoc Teď** je webová platforma, která propojuje lidi, kteří potřebují pomoc s každodenními úkoly, s těmi, kteří jim chtějí pomoci. Zaměřujeme se na místní komunitu a rychlou, přímou pomoc.

### Funkce
- 🔐 Registrace a přihlášení s ověřením emailu
- 📋 Vytváření a správa žádostí o pomoc
- 🤝 Reakce na úkoly (pro pomocníky)
- 📧 Emailové notifikace
- 👤 Uživatelské profily
- 🛡️ Admin panel

## Technologie

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: NestJS, TypeScript, PostgreSQL, TypeORM
- **Auth**: JWT
- **Email**: Nodemailer
- **Docker**: docker-compose

## Rychlý start / Quick Start

### Předpoklady / Prerequisites
- Docker & Docker Compose
- Node.js 18+ (pro lokální vývoj)

### Spuštění s Dockerem / Run with Docker

\`\`\`bash
git clone https://github.com/jindrvo1/share_anything.git
cd share_anything
docker-compose up -d
\`\`\`

Aplikace bude dostupná na:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- PostgreSQL: localhost:5432

### Lokální vývoj / Local Development

**Backend:**
\`\`\`bash
cd backend
cp .env.example .env
npm install
npm run start:dev
\`\`\`

**Frontend:**
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

## API Endpoints

| Method | Endpoint | Popis |
|--------|----------|-------|
| POST | /auth/register | Registrace uživatele |
| POST | /auth/login | Přihlášení |
| GET | /auth/verify-email?token= | Ověření emailu |
| GET | /users/me | Profil přihlášeného uživatele |
| PATCH | /users/me | Aktualizace profilu |
| GET | /tasks | Seznam úkolů |
| POST | /tasks | Vytvoření úkolu |
| GET | /tasks/:id | Detail úkolu |
| POST | /tasks/:id/respond | Přihlásit se k pomoci |
| PATCH | /tasks/:id/fulfill | Označit jako splněný |
| GET | /admin/users | Admin: seznam uživatelů |
| GET | /admin/tasks | Admin: seznam úkolů |

## Konfigurace / Configuration

Kopírujte \`.env.example\` do \`.env\` a nastavte proměnné prostředí.

## Licence / License

MIT
