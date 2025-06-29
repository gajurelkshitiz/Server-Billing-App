# API Usage

This section provides detailed information on how to interact with the Billing Backend System via its RESTful API. All endpoints require authentication using a JWT token in the `Authorization` header.

---

## Table of Contents
- [Authentication](#authentication)
- [Subscriptions](#subscriptions)
- [Admins](#admins)
- [Companies](#companies)
- [Users](#users)
- [Bills](#bills)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)
- [FAQ](#faq)

---

## Authentication

### Register Superadmin
`POST /api/v1/auth/register`
Registers a new superadmin. Only the first user should register this way.

### Login
`POST /api/v1/auth/login`
Logs in a user and returns a JWT token.

**Example Request:**
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "yourpassword"
}
```

**Response:**
- Returns a JWT token to be used in the `Authorization` header for all subsequent requests.

---

## Subscriptions
- `POST /api/v1/subscription` – Create a subscription (superadmin only)
- `GET /api/v1/subscription` – List all subscriptions (superadmin, admin)
- `GET /api/v1/subscription/:id` – Get subscription details
- `PATCH /api/v1/subscription/:id` – Update a subscription (superadmin only)

---

## Admins
- `GET /api/v1/admin` – List all admins (superadmin only)
- `GET /api/v1/admin/:id` – Get admin details
- `PATCH /api/v1/admin/:id` – Update admin
- `DELETE /api/v1/admin/:id` – Delete admin

---

## Companies
- `POST /api/v1/company` – Create a company
- `GET /api/v1/company` – List companies

---

## Users
- `POST /api/v1/user` – Create a user
- `GET /api/v1/user` – List users

---

## Bills

- `POST /api/v1/bill` – Create a new bill
- `GET /api/v1/bill` – List all bills
- `GET /api/v1/bill/:billId` – Get details of a specific bill
- `PATCH /api/v1/bill/:billId` – Update a bill
- `DELETE /api/v1/bill/:billId` – Delete a bill

**Example: Create a Bill**
```http
POST /api/v1/bill
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "companyId": "<company_id>",
  "userId": "<user_id>",
  "amount": 1000,
  "description": "Monthly subscription fee",
  "dueDate": "2025-06-01"
}
```

---

## Error Handling

- **401 Unauthorized:** Invalid or missing JWT token.
- **403 Forbidden:** Insufficient permissions for the requested operation.
- **404 Not Found:** Resource does not exist.
- **400 Bad Request:** Invalid input data.

**Example Error Response:**
```json
{
  "error": "Unauthorized access. Please login."
}
```

---

## Best Practices
- Always keep your JWT token secure and do not share it.
- Validate all input data before sending requests.
- Use appropriate user roles for sensitive operations.
- Regularly review and update your access permissions.

---

## FAQ

**Q: How do I get my JWT token?**
A: Login using the `/api/v1/auth/login` endpoint. The response will include your token.

**Q: What if my token expires?**
A: Login again to receive a new token.

**Q: Who can create subscriptions?**
A: Only superadmins can create or update subscriptions.

> All endpoints require authentication. Use the JWT token in the `Authorization` header.