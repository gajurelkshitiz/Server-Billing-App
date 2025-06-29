# Customer Management

This section explains how to manage customers (users) in the Billing Backend System. Customers are users who belong to companies and can be assigned different roles. Only admins and superadmins have permission to manage users.

---

## Prerequisites
- You must be authenticated (login required).
- You must have admin or superadmin privileges.
- Companies should be created before assigning users to them.

## User Roles
- **Superadmin:** Full access to all users and companies.
- **Admin:** Manages users within their assigned company.
- **User:** End customer, limited access.

## Endpoints for Customer Management

### Create a User
`POST /api/v1/user`

**Request Example:**
```http
POST /api/v1/user
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "companyId": "<company_id>",
  "role": "user"
}
```

### List All Users
`GET /api/v1/user`
- Returns a list of all users (filtered by company for admins).

### Update a User
`PATCH /api/v1/user/:userId`
- Update user details such as name, email, or role.

### Delete a User
`DELETE /api/v1/user/:userId`
- Remove a user from the system.

### Assigning Users to Companies
- When creating or updating a user, specify the `companyId` to assign them to a company.

## Best Practices
- Always validate user data before creating or updating.
- Assign roles carefully to ensure proper access control.
- Regularly review user lists for accuracy and security.

## Troubleshooting
- **401 Unauthorized:** Check your JWT token and permissions.
- **404 Not Found:** User or company does not exist.
- **400 Bad Request:** Invalid or missing fields in the request.

> For more details, refer to the API documentation or contact the backend team.
