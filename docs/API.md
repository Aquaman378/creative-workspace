# API Documentation 📚

Backend API endpoints for Creative Workspace.

## Base URL

```
http://localhost:3000/api
```

## Authentication

All protected endpoints require JWT token in header:

```
Authorization: Bearer <token>
```

---

## 🔐 Authentication Endpoints

### Register User
**POST** `/auth/register`

Request:
```json
{
  "email": "creator@example.com",
  "password": "secure_password",
  "fullName": "Creator Name"
}
```

Response:
```json
{
  "success": true,
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "email": "creator@example.com",
    "fullName": "Creator Name"
  }
}
```

### Login
**POST** `/auth/login`

Request:
```json
{
  "email": "creator@example.com",
  "password": "secure_password"
}
```

Response:
```json
{
  "success": true,
  "token": "jwt_token",
  "user": { ... }
}
```

---

## 📁 Projects Endpoints

### Create Project
**POST** `/projects`

**Auth Required**: Yes

Request:
```json
{
  "name": "Summer Pop-up Store Photos",
  "description": "Urban street portrait series"
}
```

Response:
```json
{
  "success": true,
  "project": {
    "id": "proj_123",
    "userId": "user_123",
    "name": "Summer Pop-up Store Photos",
    "description": "Urban street portrait series",
    "status": "draft",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### Get All Projects
**GET** `/projects`

**Auth Required**: Yes

Response:
```json
{
  "success": true,
  "projects": [ ... ]
}
```

### Get Single Project
**GET** `/projects/:projectId`

**Auth Required**: Yes

Response:
```json
{
  "success": true,
  "project": { ... }
}
```

### Update Project
**PUT** `/projects/:projectId`

**Auth Required**: Yes

Request:
```json
{
  "name": "Updated Project Name",
  "status": "active"
}
```

---

## 👥 Clients Endpoints

### Add Client to Project
**POST** `/projects/:projectId/clients`

**Auth Required**: Yes

Request:
```json
{
  "email": "client@example.com",
  "name": "Client Name"
}
```

Response:
```json
{
  "success": true,
  "client": {
    "id": "client_123",
    "projectId": "proj_123",
    "email": "client@example.com",
    "name": "Client Name",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Get Project Clients
**GET** `/projects/:projectId/clients`

**Auth Required**: Yes

---

## 📸 Assets Endpoints

### Upload Asset
**POST** `/projects/:projectId/assets`

**Auth Required**: Yes

**Content-Type**: multipart/form-data

Request:
```
file: <binary file data>
type: "image" | "video" | "mockup"
name: "Urban Portrait 01"
```

Response:
```json
{
  "success": true,
  "asset": {
    "id": "asset_123",
    "projectId": "proj_123",
    "name": "Urban Portrait 01",
    "type": "image",
    "url": "https://storage.googleapis.com/bucket/asset_123.jpg",
    "uploadedAt": "2024-01-15T10:30:00Z"
  }
}
```

### Get Project Assets
**GET** `/projects/:projectId/assets`

**Auth Required**: Yes

Response:
```json
{
  "success": true,
  "assets": [ ... ]
}
```

### Delete Asset
**DELETE** `/assets/:assetId`

**Auth Required**: Yes

---

## ✅ Proofing Portal Endpoints

### Create Proofing Link
**POST** `/projects/:projectId/proofing-links`

**Auth Required**: Yes

Request:
```json
{
  "assetIds": ["asset_123", "asset_456"],
  "clientId": "client_123",
  "expiresIn": 7
}
```

Response:
```json
{
  "success": true,
  "proofingLink": {
    "id": "proof_link_123",
    "token": "unique_token",
    "url": "https://creative-workspace.app/proof/unique_token",
    "assetIds": ["asset_123", "asset_456"],
    "clientId": "client_123",
    "expiresAt": "2024-01-22T10:30:00Z",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Get Proofing Link (Public - No Auth)
**GET** `/proof/:token`

Response:
```json
{
  "success": true,
  "proofingSession": {
    "id": "proof_link_123",
    "assets": [ ... ],
    "clientName": "Client Name",
    "status": "pending"
  }
}
```

### Submit Feedback
**POST** `/proof/:token/feedback`

Request:
```json
{
  "assetId": "asset_123",
  "feedback": "Looks great! Just adjust the shadows slightly.",
  "type": "comment"
}
```

Response:
```json
{
  "success": true,
  "feedback": { ... }
}
```

### Approve Proofing
**POST** `/proof/:token/approve`

Response:
```json
{
  "success": true,
  "message": "Approval confirmed",
  "proofingLink": {
    "status": "approved",
    "approvedAt": "2024-01-15T10:35:00Z"
  }
}
```

---

## 💰 Invoices Endpoints

### Create Invoice
**POST** `/projects/:projectId/invoices`

**Auth Required**: Yes

Request:
```json
{
  "clientId": "client_123",
  "amount": 500,
  "description": "Draft approval - 50% deposit",
  "dueDate": "2024-01-22T00:00:00Z"
}
```

Response:
```json
{
  "success": true,
  "invoice": {
    "id": "invoice_123",
    "projectId": "proj_123",
    "clientId": "client_123",
    "amount": 500,
    "currency": "USD",
    "description": "Draft approval - 50% deposit",
    "status": "draft",
    "dueDate": "2024-01-22T00:00:00Z",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Get Project Invoices
**GET** `/projects/:projectId/invoices`

**Auth Required**: Yes

### Send Invoice
**POST** `/invoices/:invoiceId/send`

**Auth Required**: Yes

Response:
```json
{
  "success": true,
  "invoice": {
    "status": "sent",
    "sentAt": "2024-01-15T10:35:00Z",
    "paymentLink": "https://stripe.com/pay/invoice_123"
  }
}
```

### Get Invoice
**GET** `/invoices/:invoiceId`

Response:
```json
{
  "success": true,
  "invoice": { ... }
}
```

---

## 💳 Payment Endpoints

### Create Payment Intent
**POST** `/payments/create-intent`

**Auth Required**: Yes

Request:
```json
{
  "invoiceId": "invoice_123",
  "amount": 500,
  "paymentMethod": "card" | "apple_pay" | "google_pay"
}
```

Response:
```json
{
  "success": true,
  "clientSecret": "pi_1234_secret",
  "paymentIntentId": "pi_1234"
}
```

### Confirm Payment
**POST** `/payments/confirm`

**Auth Required**: Yes

Request:
```json
{
  "paymentIntentId": "pi_1234",
  "invoiceId": "invoice_123"
}
```

Response:
```json
{
  "success": true,
  "payment": {
    "id": "payment_123",
    "invoiceId": "invoice_123",
    "amount": 500,
    "status": "succeeded",
    "paymentMethod": "card",
    "paidAt": "2024-01-15T10:40:00Z"
  }
}
```

### Webhook - Payment Success
**POST** `/webhooks/stripe`

(Handled automatically by Stripe)

---

## 🔗 Link Management Endpoints

### Create Short Link
**POST** `/links`

**Auth Required**: Yes

Request:
```json
{
  "projectId": "proj_123",
  "url": "https://social.com/content/123",
  "type": "social_media" | "pop_up_store" | "deliverable",
  "title": "Summer Collection Launch"
}
```

Response:
```json
{
  "success": true,
  "link": {
    "id": "link_123",
    "shortUrl": "https://cw.app/l/abc123",
    "originalUrl": "https://social.com/content/123",
    "type": "social_media",
    "title": "Summer Collection Launch",
    "clicks": 0,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Get All Links
**GET** `/links`

**Auth Required**: Yes

### Delete Link
**DELETE** `/links/:linkId`

**Auth Required**: Yes

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": { ... }
  }
}
```

### Common Error Codes

- `UNAUTHORIZED` - Missing or invalid token
- `FORBIDDEN` - User doesn't have permission
- `NOT_FOUND` - Resource not found
- `VALIDATION_ERROR` - Invalid request data
- `FIREBASE_ERROR` - Firebase operation failed
- `PAYMENT_ERROR` - Payment processing failed

---

## Rate Limiting

- **Free tier**: 100 requests/hour
- **Pro tier**: 10,000 requests/hour

Rate limit info in headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1234567890
```

---

## Webhooks

### Stripe Events

Configured webhooks for:
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `charge.refunded`

Webhook secret: `whsec_...` (in `.env`)

---

**Last Updated**: January 2024
