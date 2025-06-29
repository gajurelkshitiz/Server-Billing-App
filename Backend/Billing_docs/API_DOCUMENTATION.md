# API Documentation by Rashuv(95% accurate)

## Fiscal Year Endpoints

### Create Fiscal Year
**POST** `/api/fiscal-years`
- **Body**:
  ```json
  {
    "name": "string",
    "startDate": "ISO8601 date",
    "endDate": "ISO8601 date",
    "status": "Active | Inactive"
  }
  ```
- **Response**:
  - `201 Created`: Fiscal year created successfully.
  - `400 Bad Request`: Validation errors.

### Get All Fiscal Years
**GET** `/api/fiscal-years`
- **Response**:
  - `200 OK`: List of fiscal years.

## Customer Endpoints

### Create Customer
**POST** `/api/customers`
- **Body**:
  ```json
  {
    "name": "string",
    "phone": "string",
    "email": "string",
    "address": "string",
    "status": "Active | Inactive"
  }
  ```
- **Response**:
  - `201 Created`: Customer created successfully.
  - `400 Bad Request`: Validation errors.

### Get All Customers
**GET** `/api/customers`
- **Response**:
  - `200 OK`: List of customers.

## Supplier Endpoints

### Create Supplier
**POST** `/api/suppliers`
- **Body**:
  ```json
  {
    "name": "string",
    "phone": "string",
    "email": "string",
    "address": "string",
    "status": "Active | Inactive"
  }
  ```
- **Response**:
  - `201 Created`: Supplier created successfully.
  - `400 Bad Request`: Validation errors.

### Get All Suppliers
**GET** `/api/suppliers`
- **Response**:
  - `200 OK`: List of suppliers.

### Get Supplier By ID
**GET** `/api/suppliers/:id`
- **Response**:
  - `200 OK`: Supplier details.
  - `404 Not Found`: Supplier not found.

### Update Supplier
**PUT** `/api/suppliers/:id`
- **Body**:
  ```json
  {
    "name": "string",
    "phone": "string",
    "email": "string",
    "address": "string",
    "status": "Active | Inactive"
  }
  ```
- **Response**:
  - `200 OK`: Supplier updated successfully.
  - `400 Bad Request`: Validation errors.
  - `404 Not Found`: Supplier not found.

### Delete Supplier
**DELETE** `/api/suppliers/:id`
- **Response**:
  - `200 OK`: Supplier deleted successfully.
  - `404 Not Found`: Supplier not found.

## Purchase Entry Endpoints

### Create Purchase Entry
**POST** `/api/purchase-entries`
- **Body**:
  ```json
  {
    "date": "ISO8601 date",
    "amount": "float",
    "itemDescription": "string",
    "supplier": "string",
    "billAttachment": "file",
    "paid": "boolean",
    "isDue": "boolean",
    "dueAmount": "float (if isDue is true)"
  }
  ```
- **Response**:
  - `201 Created`: Purchase entry created successfully.
  - `400 Bad Request`: Validation errors.

### Get All Purchase Entries
**GET** `/api/purchase-entries`
- **Response**:
  - `200 OK`: List of purchase entries.

## Sales Entry Endpoints

### Create Sales Entry
**POST** `/api/sales-entries`
- **Body**:
  ```json
  {
    "date": "ISO8601 date",
    "amount": "float",
    "itemDescription": "string",
    "customer": "string",
    "billAttachment": "file",
    "paid": "boolean",
    "isDue": "boolean",
    "dueAmount": "float (if isDue is true)"
  }
  ```
- **Response**:
  - `201 Created`: Sales entry created successfully.
  - `400 Bad Request`: Validation errors.

### Get All Sales Entries
**GET** `/api/sales-entries`
- **Response**:
  - `200 OK`: List of sales entries.

## Due Endpoints

### Get All Dues
**GET** `/api/dues`
- **Response**:
  - `200 OK`: List of dues.

### Update Due
**PUT** `/api/dues/:id`
- **Body**:
  ```json
  {
    "amountPaid": "float"
  }
  ```
- **Response**:
  - `200 OK`: Due updated successfully.
  - `404 Not Found`: Due not found.
  - `400 Bad Request`: Validation errors.

## Payment Endpoints

### Create Payment
**POST** `/api/payments`
- **Body**:
  ```json
  {
    "party": "string",
    "partyType": "Customer | Supplier",
    "linkedDue": "string",
    "amountPaid": "float",
    "date": "ISO8601 date",
    "paymentMode": "Cash | Cheque | Online",
    "remarks": "string (optional)"
  }
  ```
- **Response**:
  - `201 Created`: Payment created successfully.
  - `400 Bad Request`: Validation errors.
