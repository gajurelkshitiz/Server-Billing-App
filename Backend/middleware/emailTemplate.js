function emailtemplateforemailverify ({ recipientName, companyName, verificationLink, teamName, year, email }) {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Email Verification</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      body { background-color: #f4f8fb; font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 10px; box-shadow: 0 2px 8px rgba(30, 64, 175, 0.08); overflow: hidden; }
      .header { background: linear-gradient(90deg, #2563eb 0%, #60a5fa 100%); padding: 32px 24px 24px 24px; text-align: center; }
      .logo { width: 120px; margin-bottom: 12px; }
      .title { color: #fff; font-size: 26px; font-weight: 700; margin: 0; }
      .body { padding: 32px 24px; color: #1e293b; font-size: 16px; line-height: 1.7; }
      .button { display: inline-block; margin: 24px 0; padding: 12px 32px; background: #2563eb; color: #fff !important; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px; box-shadow: 0 2px 6px rgba(37, 99, 235, 0.12); transition: background 0.2s; }
      .button:hover { background: #1d4ed8; }
      .footer { background: #f1f5f9; padding: 20px 24px; text-align: center; color: #64748b; font-size: 14px; }
      .signature { margin-top: 32px; font-style: italic; color: #2563eb; font-weight: 500; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <!-- Company Logo -->
        <img src='https://res.cloudinary.com/dil5grmjc/image/upload/v1749882469/yexfqmu85j42bz7pif1j.png' alt="Company Logo" style="width:80px; height:80px; display:block; margin:0 auto;" />
        <h1 class="title">Verify Your Email Address</h1>
      </div>
      <div class="body">
        <p>Dear <strong>${recipientName}</strong>,</p>
        <p>
          Thank you for registering with <strong>${companyName}</strong>.<br>
          To complete your registration, please verify your email address by clicking the button below.
        </p>
        <p style="text-align: center;">
          <a href="${verificationLink}" class="button">Verify Now &amp; Set Password</a>
        </p>
        <p>
          If you did not create an account, no further action is required.
        </p>
        <div class="signature">
          Best regards,<br />
          ${teamName}
        </div>
      </div>
      <div class="footer">
        &copy; ${year} ${companyName}. All rights reserved.<br />
        <a class="email-link" href="mailto:${email}">${email}</a>
      </div>
    </div>
  </body>
</html>
`
}

function emailTemplateForReVerification ({ recipientName, companyName, verificationLink, teamName, year, email, message }) {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Re-verify Your Email</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      body { background-color: #f4f8fb; font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 10px; box-shadow: 0 2px 8px rgba(239, 68, 68, 0.08); overflow: hidden; border: 2px solid #fef2f2; }
      .header { background: linear-gradient(90deg, #dc2626 0%, #f87171 100%); padding: 32px 24px 24px 24px; text-align: center; }
      .title { color: #fff; font-size: 26px; font-weight: 700; margin: 0; }
      .body { padding: 32px 24px; color: #1e293b; font-size: 16px; line-height: 1.7; }
      .alert-box { background: #fef2f2; border-left: 4px solid #dc2626; padding: 16px; margin: 20px 0; border-radius: 4px; }
      .alert-text { color: #991b1b; font-weight: 500; margin: 0; }
      .button { display: inline-block; margin: 24px 0; padding: 12px 32px; background: #dc2626; color: #fff !important; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px; box-shadow: 0 2px 6px rgba(220, 38, 38, 0.12); transition: background 0.2s; }
      .button:hover { background: #b91c1c; }
      .footer { background: #f1f5f9; padding: 20px 24px; text-align: center; color: #64748b; font-size: 14px; }
      .signature { margin-top: 32px; font-style: italic; color: #dc2626; font-weight: 500; }
      .expiry-note { background: #fef3c7; border: 1px solid #f59e0b; padding: 12px; border-radius: 6px; margin: 16px 0; color: #92400e; font-size: 14px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <!-- Company Logo -->
        <img src='https://res.cloudinary.com/dil5grmjc/image/upload/v1749882469/yexfqmu85j42bz7pif1j.png' alt="Company Logo" style="width:80px; height:80px; display:block; margin:0 auto;" />
        <h1 class="title">🔄 Re-verify Your Email</h1>
      </div>
      <div class="body">
        <p>Dear <strong>${recipientName}</strong>,</p>
        
        <div class="alert-box">
          <p class="alert-text">⚠️ Previous verification link has expired</p>
        </div>
        
        <p>${message}</p>
        
        <p>
          We've generated a new verification link for your <strong>${companyName}</strong> account. 
          Please click the button below to verify your email address and complete your registration.
        </p>
        
        <p style="text-align: center;">
          <a href="${verificationLink}" class="button">🔗 Verify Now &amp; Set Password</a>
        </p>
        
        <div class="expiry-note">
          <strong>⏰ Important:</strong> This new verification link will expire in 24 hours. Please complete the verification process promptly.
        </div>
        
        <p>
          <strong>Need help?</strong> If you continue to experience issues or did not request this verification, 
          please contact our support team immediately.
        </p>
        
        <div class="signature">
          Best regards,<br />
          ${teamName}
        </div>
      </div>
      <div class="footer">
        &copy; ${year} ${companyName}. All rights reserved.<br />
        <a class="email-link" href="mailto:${email}">${email}</a>
      </div>
    </div>
  </body>
</html>
`
}



const verificationEmailTemplate = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
          }
          .container {
              max-width: 600px;
              margin: 30px auto;
              background: #ffffff;
              border-radius: 8px;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
              overflow: hidden;
              border: 1px solid #ddd;
          }
          .header {
              background-color: #4CAF50;
              color: white;
              padding: 20px;
              text-align: center;
              font-size: 26px;
              font-weight: bold;
          }
          .content {
              padding: 25px;
              color: #333;
              line-height: 1.8;
          }
          .verification-code {
              display: block;
              margin: 20px 0;
              font-size: 22px;
              color: #4CAF50;
              background: #e8f5e9;
              border: 1px dashed #4CAF50;
              padding: 10px;
              text-align: center;
              border-radius: 5px;
              font-weight: bold;
              letter-spacing: 2px;
          }
          .footer {
              background-color: #f4f4f4;
              padding: 15px;
              text-align: center;
              color: #777;
              font-size: 12px;
              border-top: 1px solid #ddd;
          }
          p {
              margin: 0 0 15px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">Verify Your Email</div>
          <div class="content">
              <p>Hello,</p>
              <p>Thank you for signing up! Please confirm your email address by entering the code below:</p>
              <span class="verification-code">{verificationCode}</span>
              <p>If you did not create an account, no further action is required. If you have any questions, feel free to contact our support team.</p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
`;




function Welcome_Email_Template ({ recipientName, companyName, teamName, year, email, loginLink }) {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Welcome to ${companyName}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      body { background-color: #f4f8fb; font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 10px; box-shadow: 0 2px 8px rgba(30, 64, 175, 0.08); overflow: hidden; }
      .header { background: linear-gradient(90deg, #2563eb 0%, #60a5fa 100%); padding: 32px 24px 24px 24px; text-align: center; }
      .title { color: #fff; font-size: 26px; font-weight: 700; margin: 0; }
      .body { padding: 32px 24px; color: #1e293b; font-size: 16px; line-height: 1.7; }
      .button { display: inline-block; margin: 24px 0; padding: 12px 32px; background: #2563eb; color: #fff !important; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px; box-shadow: 0 2px 6px rgba(37, 99, 235, 0.12); transition: background 0.2s; }
      .button:hover { background: #1d4ed8; }
      .footer { background: #f1f5f9; padding: 20px 24px; text-align: center; color: #64748b; font-size: 14px; }
      .signature { margin-top: 32px; font-style: italic; color: #2563eb; font-weight: 500; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <!-- Company Logo -->
        <img src="https://res.cloudinary.com/dil5grmjc/image/upload/v1749882469/yexfqmu85j42bz7pif1j.png" alt="Company Logo" style="width:80px; height:80px; display:block; margin:0 auto;"  />
        <h1 class="title">Welcome to ${companyName}!</h1>
      </div>
      <div class="body">
        <p>Dear <strong>${recipientName}</strong>,</p>
        <p>
          We are thrilled to welcome you to <strong>${companyName}</strong> – your trusted solution for seamless billing and account management.<br>
          Your account has been successfully created and is now ready to use.
        </p>
        <p>
          Here’s what you can do with Billing App:
          <ul>
            <li>Manage your invoices and payments efficiently</li>
            <li>Track your billing history and account activity</li>
            <li>Access your dashboard from any device, anytime</li>
            <li>Get timely notifications and support</li>
          </ul>
        </p>
        <p style="text-align: center;">
          <a href="${loginLink}" class="button">Login to Your Account</a>
        </p>
        <p>
          If you have any questions or need assistance, feel free to reply to this email or contact our support team.
        </p>
        <div class="signature">
          Best regards,<br />
          ${teamName}
        </div>
      </div>
      <div class="footer">
        &copy; ${year} ${companyName}. All rights reserved.<br />
        <a class="email-link" href="mailto:${email}">${email}</a>
      </div>
    </div>
  </body>
</html>
  `;
}

module.exports = {
    emailtemplateforemailverify,
    emailTemplateForReVerification, // Export the new re-verification template
    // Verification_Email_Template,
    Welcome_Email_Template
}