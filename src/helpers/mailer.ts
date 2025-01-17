import User from "@/models/userModels";
import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";
import base64url from "base64-url";

export const sendEmail = async ({
  email,
  emailType,
  userId,
}: {
  email: string;
  emailType: string;
  userId: any;
}) => {
  try {
    const unsafetoken = await bcryptjs.hash(userId.toHexString(), 10);
    const hashedToken = base64url.encode(unsafetoken);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        $set: {
          verifyToken: hashedToken,
          verifyTokenExpiry: Date.now() + 3600000,
        },
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        $set: {
          forgotPasswordToken: hashedToken,
          forgotPasswordTokenExpiry: Date.now() + 3600000,
        },
      });
    }

    var transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.EMAIL_USERNAME!,
        pass: process.env.EMAIL_PASSWORD!,
      },
    });

    const mailoption = {
      from: "ymoviesbyyashasvi@yash.mit",
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify Your Email" : "Reset Your Password", 
      html:
        emailType === "VERIFY"
          ? `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to Verify your Email<br>${process.env.DOMAIN}/verifyemail?token=${hashedToken}</p><br><br>`
          : `<p>Click <a href="${process.env.DOMAIN}/resetpassword?token=${hashedToken}">here</a> to Reset Your Password<br>${process.env.DOMAIN}/resetpassword?token=${hashedToken}</p><br><br>`,
    };

    const mailresponse = await transporter.sendMail(mailoption);
  } catch (err) {
    throw err;
  }
};
