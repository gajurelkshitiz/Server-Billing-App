# API Reference

This section provides a detailed reference for all available API endpoints in the Billing Backend System, including request/response formats, required parameters, and example payloads.

## Authentication
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`

## Subscriptions
- `POST /api/v1/subscription`
- `GET /api/v1/subscription`
- `GET /api/v1/subscription/:id`
- `PATCH /api/v1/subscription/:id`

## Admins
- `GET /api/v1/admin`
- `GET /api/v1/admin/:id`
- `PATCH /api/v1/admin/:id`
- `DELETE /api/v1/admin/:id`

## Companies
- `POST /api/v1/company`
- `GET /api/v1/company`

## Users
- `POST /api/v1/user`
- `GET /api/v1/user`

## Bills
- `POST /api/v1/bill`
- `GET /api/v1/bill`
- `GET /api/v1/bill/:billId`
- `PATCH /api/v1/bill/:billId`
- `DELETE /api/v1/bill/:billId`

> For detailed request/response examples, see the Usage section or contact the backend team.
