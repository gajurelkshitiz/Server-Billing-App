# FAQ (Frequently Asked Questions)

**Q: How do I register as a superadmin?**
A: Use the `/api/v1/auth/register` endpoint. Only the first user should register this way.

**Q: How do I reset my password?**
A: Contact your admin or superadmin for password reset procedures.

**Q: What if I get a 401 Unauthorized error?**
A: Ensure your JWT token is valid and included in the `Authorization` header.

**Q: Who can create or manage subscriptions?**
A: Only superadmins can create or update subscriptions.

**Q: How do I assign a user to a company?**
A: When creating or updating a user, provide the `companyId` field.

**Q: How do I get support?**
A: Refer to the documentation or contact your backend team.

> For more questions, add them here or contact support.
