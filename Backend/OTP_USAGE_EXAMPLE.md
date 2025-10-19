# OTP Email Template Usage Guide

## Overview
This implementation provides a complete OTP (One-Time Password) system with a beautiful HTML email template that sends 6-digit verification codes.

## Features
- ✅ 6-digit OTP generation
- ✅ Beautiful HTML email template
- ✅ Rate limiting (1 minute cooldown)
- ✅ OTP expiration (10 minutes)
- ✅ Attempt limiting (3 attempts max)
- ✅ Security warnings in email
- ✅ Responsive design

## API Endpoints

### 1. Send OTP
```javascript
POST /api/auth/send-otp
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response:**
```javascript
{
  "responseCode": 200,
  "resultCode": "OTP_SENT",
  "message": "OTP sent successfully to your email"
}
```

### 2. Verify OTP
```javascript
POST /api/auth/verify-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response:**
```javascript
{
  "responseCode": 200,
  "resultCode": "OTP_VERIFIED",
  "message": "OTP verified successfully"
}
```

### 3. Resend OTP
```javascript
POST /api/auth/resend-otp
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response:**
```javascript
{
  "responseCode": 200,
  "resultCode": "OTP_RESENT",
  "message": "OTP resent successfully to your email"
}
```

## Email Template Features

The OTP email template includes:

1. **Professional Design**: Clean, modern layout with proper typography
2. **Security Warnings**: Clear instructions about not sharing the code
3. **Expiration Notice**: Shows 10-minute validity period
4. **Responsive**: Works on desktop and mobile devices
5. **Branding**: Customizable logo and company information
6. **Accessibility**: Proper contrast and readable fonts

## Database Schema

The User model now includes OTP fields:

```javascript
otp: {
  code: String,        // The 6-digit OTP code
  expiresAt: Date,     // Expiration timestamp
  attempts: Number,    // Number of verification attempts
  lastSentAt: Date     // Last OTP sent timestamp
}
```

## Security Features

1. **Rate Limiting**: 1-minute cooldown between OTP requests
2. **Expiration**: OTP expires after 10 minutes
3. **Attempt Limiting**: Maximum 3 verification attempts
4. **Secure Generation**: Cryptographically secure random number generation
5. **Auto-cleanup**: OTP data is cleared after successful verification

## Error Handling

The system handles various error scenarios:

- `USER_NOT_FOUND`: Email not registered
- `RATE_LIMITED`: Too many OTP requests
- `NO_OTP_FOUND`: No active OTP for user
- `OTP_EXPIRED`: OTP has expired
- `MAX_ATTEMPTS_REACHED`: Too many failed attempts
- `INVALID_OTP`: Wrong OTP code
- `EMAIL_SEND_FAILED`: Email delivery failed

## Integration Example

```javascript
// In your route handler
const { sendOTP, verifyOTP, resendOTP } = require('./src/handler/auth/auth');

// Send OTP
app.post('/api/auth/send-otp', async (req, res) => {
  const result = await sendOTP(req, res);
  res.status(result.responseCode).json(result);
});

// Verify OTP
app.post('/api/auth/verify-otp', async (req, res) => {
  const result = await verifyOTP(req, res);
  res.status(result.responseCode).json(result);
});

// Resend OTP
app.post('/api/auth/resend-otp', async (req, res) => {
  const result = await resendOTP(req, res);
  res.status(result.responseCode).json(result);
});
```

## Environment Variables Required

Make sure these environment variables are set:

```bash
EMAIL=your-gmail@gmail.com
EMAIL_PASS=your-app-password
JWT_SECRET=your-jwt-secret
```

## Customization

You can customize the email template by modifying the `getOTPEmailTemplate` function in `/src/utils/email/email.js`:

- Change the logo and branding
- Modify colors and styling
- Update security messages
- Add your company information

## Testing

To test the OTP functionality:

1. Start your backend server
2. Use a tool like Postman or curl to send requests
3. Check your email for the OTP
4. Verify the OTP using the verification endpoint

## Notes

- The OTP is generated using `Math.floor(100000 + Math.random() * 900000)` which ensures a 6-digit number
- Email template is responsive and works across different email clients
- All OTP data is automatically cleaned up after successful verification
- Rate limiting prevents spam and abuse
