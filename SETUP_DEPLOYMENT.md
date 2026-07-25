# 109 Tavern Project - Setup & Deployment Guide

## Quick Start (Development)

### Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

pip install -r requirements.txt

cp .env.example .env
# Edit .env with your settings

python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

### Docker Setup

```bash
docker-compose up --build
# Frontend: http://localhost:5173
# Backend: http://localhost:8000
# Database: localhost:5433
```

---

## Testing

### Backend Tests

```bash
cd backend
source venv/bin/activate

# Run all tests with coverage
pytest

# Run specific test file
pytest core_api/tests.py

# Run with coverage report
pytest --cov=core_api --cov-report=html
# View: htmlcov/index.html
```

### Frontend Tests

```bash
cd frontend

# Run tests
npm test

# Watch mode
npm test -- --watch

# Coverage
npm run test:coverage
```

---

## Code Standards

### Format Code

```bash
# Backend
cd backend
black .
ruff check . --fix

# Frontend
cd frontend
npm run format
npm run lint
```

### Pre-commit Hooks

```bash
# Install pre-commit
pip install pre-commit

# Setup hooks
pre-commit install

# Run hooks manually
pre-commit run --all-files
```

---

## Deployment

### Environment Variables

**Backend (.env or .env.docker):**
```
DJANGO_SECRET_KEY=your-secret-key-here
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=yourdomain.com,api.yourdomain.com
DB_NAME=tavern109_db
DB_USER=tavern109
DB_PASSWORD=secure-password
DB_HOST=your-db-host
DB_PORT=5432
CORS_ALLOWED_ORIGINS=https://yourdomain.com
TAVERN_WHATSAPP_NUMBER=254700000000
```

**Frontend (.env):**
```
VITE_API_BASE_URL=https://api.yourdomain.com
```

### Backend Deployment (Render / Railway)

1. Connect your GitHub repository
2. Set environment variables in platform dashboard
3. Configure build command: `pip install -r requirements.txt && python manage.py migrate`
4. Configure start command: `gunicorn tavern_core.wsgi:application --bind 0.0.0.0:8000`
5. Deploy

### Frontend Deployment (Vercel / Netlify)

1. Connect your GitHub repository
2. Set `VITE_API_BASE_URL` environment variable
3. Build command: `npm run build`
4. Output directory: `dist`
5. Deploy

---

## Database Migrations

### Create Migration

```bash
cd backend
python manage.py makemigrations core_api --name your_migration_name
python manage.py migrate
```

### Rollback Migration

```bash
python manage.py migrate core_api 0001  # Roll back to specific migration
python manage.py migrate core_api zero  # Roll back all
```

---

## API Documentation

Base URL: `http://localhost:8000/api` (development) or `https://api.yourdomain.com` (production)

### Authentication

**Login:**
```bash
curl -X POST http://localhost:8000/api/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'
```

Tokens are set as httpOnly cookies automatically.

**Refresh Token:**
```bash
curl -X POST http://localhost:8000/api/auth/token/refresh/ \
  -H "Content-Type: application/json"
```

**Logout:**
```bash
curl -X POST http://localhost:8000/api/auth/logout/ \
  -H "Content-Type: application/json"
```

### Core Endpoints

- `GET /api/offerings/` - List all offerings
- `POST /api/offerings/` - Create offering (staff only)
- `GET /api/events/` - List events
- `GET /api/events/happening_now/` - Events happening now
- `GET /api/bundles/` - List active bundles
- `GET /api/bundles/{slug}/` - Get bundle by slug
- `POST /api/redemptions/` - Log bundle redemption (authenticated)
- `GET /api/gallery/` - List gallery images
- `POST /api/posters/` - Create poster (authenticated)
- `POST /api/posters/{id}/generate/` - Generate poster image
- `POST /api/posters/{id}/publish/` - Publish poster
- `POST /api/social-logs/` - Log social engagement (authenticated)
- `GET /api/analytics/summary/` - Get analytics dashboard data

---

## Performance Optimization

### Database

- Indexes on frequently filtered fields: `unit`, `is_active`, `is_published`, `start_datetime`
- Use `select_related()` for ForeignKey queries
- Use `prefetch_related()` for reverse relations
- Pagination enabled (default 20 items per page)

### Frontend

- Code splitting with React.lazy()
- Image lazy loading
- CSS purging with Tailwind
- Bundle size monitoring

### Caching

- Browser caching headers on static assets
- HTTP caching with appropriate headers
- Consider Redis for session caching in production

---

## Monitoring & Logging

### Backend Logs

View Django logs in production:
```bash
# Render
render logs

# Railway
railway logs

# Local
python manage.py runserver --log-level DEBUG
```

### Frontend Monitoring

- Use Sentry for error tracking
- Use LogRocket for session replay
- Monitor Core Web Vitals

---

## Security Checklist

- ✅ JWT tokens in httpOnly cookies (XSS protection)
- ✅ CSRF protection enabled
- ✅ CORS restricted to allowed origins
- ✅ Debug mode disabled in production
- ✅ Secret key rotated
- ✅ Database password not in version control
- ✅ HTTPS enforced in production
- ✅ Rate limiting on auth endpoints (recommended)
- ✅ Input validation on all endpoints
- ✅ SQL injection prevention (using Django ORM)

---

## Troubleshooting

### 401 Unauthorized

- Ensure tokens are set in httpOnly cookies
- Check CORS settings match your frontend URL
- Verify token hasn't expired

### CORS Errors

- Update `CORS_ALLOWED_ORIGINS` in settings
- Ensure frontend URL matches exactly

### Migration Errors

- Check for conflicting migrations
- Try `python manage.py migrate --fake-initial`
- Review migration files for errors

### Test Failures

- Ensure test database credentials are correct
- Clear test database: `docker exec 109tavern-db-1 psql -U tavern109 -d tavern109_db_test -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"`
- Re-run migrations: `pytest` (handles automatically)

---

## Support & Resources

- Django Documentation: https://docs.djangoproject.com/
- Django REST Framework: https://www.django-rest-framework.org/
- React Documentation: https://react.dev/
- Tailwind CSS: https://tailwindcss.com/

