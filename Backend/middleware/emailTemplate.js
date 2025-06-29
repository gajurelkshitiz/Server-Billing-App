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
        <img src="https://res.cloudinary.com/dil5grmjc/image/upload/v1749882469/yexfqmu85j42bz7pif1j.png" alt="Company Logo" style="width:80px; height:80px; display:block; margin:0 auto;" />
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



// let forgotverify = `
// <!DOCTYPE html>
// <html>
// <head>
//     <style>
//         body {
//             font-family: Arial, sans-serif;
//             line-height: 1.5;
//             margin: 0;
//             padding: 0;
//         }
//         a{
//             color: white!important;
//         }
//         .container {
//             max-width: 600px;
//             margin: 0 auto;
//             padding: 20px;
//         }

//         .logo {
//             text-align: center;
//             margin-bottom: 20px;
//         }

//         .logo img {
//             max-width: 150px;
//         }

//         .content {
//             background-color: #f8f8f8;
//             padding: 20px;
//             border-radius: 5px;
//         }

//         .instructions {
//             margin-bottom: 20px;
//         }

//         .button {
//             display: inline-block;
//             padding: 10px 20px;
//             background-color: #3366cc;
//             color: #ffffff;
//             text-decoration: none;
//             border-radius: 5px;
//         }

//         .button:hover {
//             background-color: #254785;
//         }

//         .footer {
//             margin-top: 20px;
//             font-size: 12px;
//             text-align: center;
//         }
//     </style>
// </head>
// <body>
//     <div class="container">
//         <div class="content">
//             <h2>Reset Your Rappitnepal Password</h2>
//             <p>We received a request to reset the password for your Rappit account. To regain access to your account, please follow the instructions below:</p>
//             <div class="instructions">
//                 <ol>
//                     <li>Click on the following link to reset your password:</li>
//                 </ol>
//                 <Span><a class="button" href="https://rappitnepal.netlify.app/resetPassword/***emailtoken***/***role***">Reset Password</a></Span>
//                 <p>If the link doesn't work, Please contact with us</p>
//                 <a href="https://www.facebook.com/rn.sharma.16568548"><p>Facebook</p></a>
//             </div>
//             <p>Please note that this password reset link will expire after 10 mins, so we recommend completing the process promptly.</p>
//             <p>If you did not initiate this password reset request, please ignore this email or contact our support team rappit777@example.com immediately for assistance. We take the security of your account seriously and will investigate any unauthorized access attempts.</p>
//         </div>
//         <div class="footer">
//             <p>Thank you for being a valued Rappitnepal user. If you have any further questions or need assistance, feel free to reach out to our support team.</p>
//             <p>rabindra sharma<br>founder<br>Rappit Team</p>
//         </div>
//     </div>
// </body>
// </html>
// `





const Verification_Email_Template = `
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
    Verification_Email_Template,
    Welcome_Email_Template
}