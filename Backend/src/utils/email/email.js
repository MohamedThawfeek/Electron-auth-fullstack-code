const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: `${process.env.EMAIL}`,
    pass: `${process.env.EMAIL_PASS}`,
  },
});

// Generate 6-digit OTP

// OTP Email Template
const getOTPEmailTemplate = (otp, userName = "User") => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>OTP Verification</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f4f4f4;
            }
            .container {
                background-color: #ffffff;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 0 20px rgba(0,0,0,0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            .logo {
                font-size: 24px;
                font-weight: bold;
                color: #2c3e50;
                margin-bottom: 10px;
            }
            .otp-container {
                background-color: #f8f9fa;
                border: 2px dashed #007bff;
                border-radius: 8px;
                padding: 20px;
                text-align: center;
                margin: 20px 0;
            }
            .otp-code {
                font-size: 32px;
                font-weight: bold;
                color: #007bff;
                letter-spacing: 5px;
                margin: 10px 0;
            }
            .message {
                font-size: 16px;
                margin-bottom: 20px;
                text-align: center;
            }
            .warning {
                background-color: #fff3cd;
                border: 1px solid #ffeaa7;
                border-radius: 5px;
                padding: 15px;
                margin: 20px 0;
                color: #856404;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                font-size: 14px;
                color: #666;
            }
            .button {
                display: inline-block;
                background-color: #007bff;
                color: white;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 5px;
                margin: 10px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">🔐 SecureAuth</div>
                <h2>OTP Verification Code</h2>
            </div>
            
            <div class="message">
                <p>Hello <strong>${userName}</strong>,</p>
                <p>You have requested a One-Time Password (OTP) for verification. Please use the following code to complete your verification:</p>
            </div>
            
            <div class="otp-container">
                <p style="margin: 0; font-size: 14px; color: #666;">Your verification code is:</p>
                <div class="otp-code">${otp}</div>
                <p style="margin: 0; font-size: 12px; color: #999;">This code expires in 5 minutes</p>
            </div>
            
            <div class="warning">
                <strong>⚠️ Security Notice:</strong>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>Never share this code with anyone</li>
                    <li>Our team will never ask for your OTP</li>
                    <li>This code is valid for 5 minutes only</li>
                    <li>If you didn't request this code, please ignore this email</li>
                </ul>
            </div>
            
            <div class="message">
                <p>If you're having trouble with the code, you can request a new one from the application.</p>
            </div>
            
            <div class="footer">
                <p>This is an automated message. Please do not reply to this email.</p>
                <p>© 2024 SecureAuth. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

// Send OTP Email
exports.sendOTPEmail = async (to, userName, otp) => {
  const subject = "Your OTP Verification Code";
  const html = getOTPEmailTemplate(otp, userName);
  
  const mailOptions = {
    from: `${process.env.EMAIL}`,
    to,
    subject,
    html,
  };
  
  try {
    await transport.sendMail(mailOptions);
    return {
      success: true,
      message: "OTP email sent successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to send OTP email",
      error: error.message,
    };
  }
};

// Send general email (existing functionality)
exports.sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: `${process.env.EMAIL}`,
    to,
    subject,
    text,
  };
  
  try {
    await transport.sendMail(mailOptions);
    return {
      success: true,
      message: "Email sent successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to send email",
      error: error.message,
    };
  }
};

// Export OTP generation function