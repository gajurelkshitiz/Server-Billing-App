const transporter = require("./email.config.js");
const {
  Verification_Email_Template,
  Welcome_Email_Template,
  emailtemplateforemailverify,
} = require("./emailTemplate.js");

const sendVerificationEmail = async (
  email,
  name,
  emailVerificationToken,
  Role
) => {
  const currentYear = new Date().getFullYear();
  console.log(email, name, emailVerificationToken, Role);
  verificationUrl = `${
    process.env.FRONTEND_URL
  }/set-password?token=${emailVerificationToken}&role=${Role}&name=${encodeURIComponent(
    name
  )}`;
  const response = await transporter.sendMail({
    from: '"Kshitiz Gajurel" <gajurel4311@gmail.com>',

    to: email, // list of receivers
    subject: "Verify your Email from Billing App", // Subject line
    text: "Verify your Email", // plain text body
    html: emailtemplateforemailverify({
      recipientName: name,
      companyName: "Telemko Pvt. Ltd",
      verificationLink: verificationUrl,
      teamName: "Kshitiz Gajurel",
      year: new Date().getFullYear(),
      email: "kshitizgajurel08@gmail.com",
    }),
  });
  console.log("Email send Successfully", response);
  return {status:'success', data: response}
};



const sendWelcomeEmail = async (email, name) => {
  try {
    const loginLink = process.env.FRONTEND_URL
    const response = await transporter.sendMail({
      from: '"Kshitiz Gajurel" <gajurel4311@gmail.com>',

      to: email, // list of receivers
      subject: "Welcome Email", // Subject line
      text: "Welcome Email", // plain text body
      html: Welcome_Email_Template({
        recipientName: name,
        companyName: "Telemko Pvt Ltd", // paxi create user/admin batai company ko value lyauxu
        teamName: "Kshitiz Gajurel",
        year: new Date().getFullYear(),
        email: "kshitizgajurel08@gmail.com",
        loginLink: loginLink
      }),
    });
    console.log("Email send Successfully", response);
  } catch (error) {
    console.log("Email error", error);
  }
};



module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
};
