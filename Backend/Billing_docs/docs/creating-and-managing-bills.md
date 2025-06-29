# Creating and Managing Bills

This section explains how to create, update, and manage bills in the Billing Backend System. Bills are linked to companies and users, and only authorized users can perform billing operations.

## Prerequisites
- You must be authenticated (login required).
- You must have the appropriate role (admin or superadmin) to create or manage bills.
- Ensure companies and users are already created in the system.

## Creating a Bill
To create a bill, send a POST request to the relevant endpoint (e.g., `/api/v1/bill`).

**Example Request:**
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

**Response:**
- Returns the created bill object with a unique ID and status.

## Updating a Bill
To update a bill, use the PATCH endpoint:
```http
PATCH /api/v1/bill/:billId
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "amount": 1200,
  "description": "Updated fee for June"
}
```

## Fetching Bills
- **All bills:** `GET /api/v1/bill`
- **By company:** `GET /api/v1/bill?companyId=<company_id>`
- **By user:** `GET /api/v1/bill?userId=<user_id>`
- **Single bill:** `GET /api/v1/bill/:billId`

## Deleting a Bill
To delete a bill:
```http
DELETE /api/v1/bill/:billId
Authorization: Bearer <your-jwt-token>
```

## Bill Status
Bills may have statuses such as `pending`, `paid`, or `overdue`. Status is updated automatically based on payment or manually by an admin.

## Best Practices
- Always validate input data before sending requests.
- Use secure authentication tokens.
- Regularly review bill statuses and follow up on overdue payments.

## Troubleshooting
- **401 Unauthorized:** Check your JWT token and user role.
- **404 Not Found:** Ensure the bill, company, or user ID exists.
- **400 Bad Request:** Check your request body for missing or invalid fields.

> For more details, refer to the API documentation or contact the backend team.
