import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import crypto from 'crypto'
import axios from 'axios' // ✅ Import axios for HTTP API requests

// HTTP mail delivery helper for services like Brevo and Resend (bypasses Render SMTP port block)
const sendEmailViaHttp = async (email, subject, htmlContent) => {
  if (process.env.BREVO_API_KEY) {
    console.log("📨 Sending email via Brevo HTTP API...");
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { email: process.env.EMAIL_USER || "studyroot18@gmail.com", name: "StudyRoot" },
        to: [{ email }],
        subject,
        htmlContent,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    return true;
  }
  
  if (process.env.RESEND_API_KEY) {
    console.log("📨 Sending email via Resend HTTP API...");
    await axios.post(
      "https://api.resend.com/emails",
      {
        from: "StudyRoot <onboarding@resend.dev>",
        to: [email],
        subject,
        html: htmlContent,
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return true;
  }
  
  return false;
};

export const generateToken = async (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,                  // prevents JavaScript access to cookie
        sameSite: isProduction ? "none" : "lax", // must be "none" for cross-domain cookies in production
        secure: isProduction,            // must be true (HTTPS) when sameSite is "none"
    });

    return token;
};


export const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

export const sendOtpEmail = async (email, otp) => {
  console.log(`✉️ Attempting to send OTP email to: ${email}`);

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; background-color: #f9f9f9;">
      <h2 style="text-align: center; color: #333;">🔐 Email Verification</h2>
      <p style="font-size: 16px; color: #555;">Hello,</p>
      <p style="font-size: 16px; color: #555;">
        You requested to verify your email address. Please use the OTP code below:
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <span style="display: inline-block; background-color: #e0f2fe; color: #0c4a6e; font-size: 24px; font-weight: bold; padding: 12px 24px; border-radius: 8px; letter-spacing: 2px;">
          ${otp}
        </span>
      </div>

      <p style="font-size: 15px; color: #666;">
        This OTP is valid for <strong>5 minutes</strong>. Please do not share it with anyone.
      </p>

      <p style="font-size: 14px; color: #999;">If you didn't request this, you can safely ignore this email.</p>

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />

      <p style="font-size: 12px; text-align: center; color: #aaa;">
        &copy; ${new Date().getFullYear()} StudyRoot. All rights reserved.
      </p>
    </div>
  `;

  // 1. Try sending via Web API over HTTPS first (avoids SMTP block on Render)
  try {
    const sent = await sendEmailViaHttp(email, "Your OTP Code", htmlContent);
    if (sent) {
      console.log(`✅ OTP email sent successfully via HTTP API to ${email}`);
      return;
    }
  } catch (httpError) {
    console.error(`❌ HTTP email API failed:`, httpError?.response?.data || httpError.message);
  }

  // 2. Fall back to standard SMTP transport
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("❌ EMAIL_USER or EMAIL_PASS environment variables are missing!");
    throw new Error("Email configuration is missing on the server.");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    html: htmlContent
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent successfully via SMTP to ${email}`);
  } catch (error) {
    console.error(`❌ SMTP connection failed to ${email}:`, error);
    throw error;
  }
};

export const sendMail = async (email, subject, htmlContent) => {
  console.log(`✉️ Attempting to send custom email to: ${email}`);

  // 1. Try sending via Web API over HTTPS first (avoids SMTP block on Render)
  try {
    const sent = await sendEmailViaHttp(email, subject, htmlContent);
    if (sent) {
      console.log(`✅ Custom email sent successfully via HTTP API to ${email}`);
      return;
    }
  } catch (httpError) {
    console.error(`❌ HTTP email API failed:`, httpError?.response?.data || httpError.message);
  }

  // 2. Fall back to standard SMTP transport
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("❌ EMAIL_USER or EMAIL_PASS environment variables are missing!");
    throw new Error("Email configuration is missing on the server.");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Custom email sent successfully via SMTP to ${email}`);
  } catch (error) {
    console.error(`❌ SMTP connection failed to ${email}:`, error);
    throw error;
  }
};

// API Error class
export class ApiError extends Error {
  constructor(statusCode, message = "Something went wrong", errors = [], stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// API Response class
export class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

