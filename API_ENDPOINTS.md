# REST API Endpoints

## Authentication Endpoints

### POST /api/auth/signup

Регистрация нового пользователя

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "companyName": "Example Corp"
}
```

**Response:**

```json
{
  "id": 1,
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "companyName": "Example Corp",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### POST /api/auth/signin

Вход в систему

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "user@example.com"
}
```

### GET /api/auth/protected

Защищенный ресурс (требует JWT токен)

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "message": "This is a protected resource!",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

## User Management Endpoints

Все endpoints пользователей требуют JWT токен в заголовке Authorization.

### GET /api/users

Получить список всех пользователей

**Headers:**

```
Authorization: Bearer <jwt_token>
```

### GET /api/users/:id

Получить пользователя по ID

**Headers:**

```
Authorization: Bearer <jwt_token>
```

### POST /api/users

Создать нового пользователя

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Request Body:**

```json
{
  "email": "newuser@example.com",
  "password": "Password123!",
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+1234567891",
  "companyName": "New Corp"
}
```

### PATCH /api/users/:id

Обновить пользователя

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Request Body:**

```json
{
  "firstName": "Updated Name",
  "companyName": "Updated Corp"
}
```

### DELETE /api/users/:id

Удалить пользователя (мягкое удаление)

**Headers:**

```
Authorization: Bearer <jwt_token>
```

## Notes

- Все endpoints имеют префикс `/api`
- JWT токены имеют время жизни 10 часов
- Валидация данных выполняется автоматически
- CORS включен для интеграции с фронтендом
- Сервер запускается на порту 3000
