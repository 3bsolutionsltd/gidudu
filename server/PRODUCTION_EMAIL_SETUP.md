# Production Email Setup Guide

## Overview
This guide covers setting up email functionality for the IGFM contact form in production.

---

## Option 1: Gmail (Free - Best for Small Traffic)

### Limitations
- 500 emails per day limit
- May be flagged as spam by some recipients
- Requires 2-Step Verification

### Setup Steps

1. **Create Gmail Account**
   - Use a dedicated account (e.g., `website@gidudu.org` → Gmail)
   - Enable 2-Step Verification

2. **Generate App Password**
   ```
   Google Account → Security → 2-Step Verification → App Passwords
   - Select app: Mail
   - Select device: Other (Custom name) → "IGFM Website"
   - Copy the 16-character password
   ```

3. **Set Environment Variables on Render**
   ```
   Dashboard → Your Service → Environment
   
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=xxxx xxxx xxxx xxxx
   NODE_ENV=production
   ```

4. **Redeploy** your service on Render

---

## Option 2: SendGrid (Recommended for Production)

### Benefits
- 100 emails/day free tier (or upgrade for more)
- Better deliverability
- Professional email tracking and analytics
- No daily Gmail quotas

### Setup Steps

1. **Sign Up for SendGrid**
   - Visit: https://sendgrid.com/
   - Create free account
   - Verify your email

2. **Verify Your Domain (Optional but Recommended)**
   ```
   Settings → Sender Authentication → Verify a Domain
   - Domain: gidudu.org
   - Follow DNS setup instructions
   ```

3. **Create API Key**
   ```
   Settings → API Keys → Create API Key
   - Name: "IGFM Contact Form"
   - Permissions: Mail Send → Full Access
   - SAVE THE KEY (shown only once!)
   ```

4. **Set Environment Variables on Render**
   ```
   EMAIL_HOST=smtp.sendgrid.net
   EMAIL_PORT=587
   EMAIL_USER=apikey
   EMAIL_PASS=SG.xxxxxxxxxxxxxxxxxxxxxxxxx
   NODE_ENV=production
   ```

5. **Redeploy** on Render

---

## Option 3: Mailgun (Alternative Professional Service)

### Setup Steps

1. **Sign Up:** https://www.mailgun.com/
2. **Get SMTP Credentials:**
   ```
   Sending → Domain Settings → SMTP credentials
   ```

3. **Environment Variables:**
   ```
   EMAIL_HOST=smtp.mailgun.org
   EMAIL_PORT=587
   EMAIL_USER=postmaster@yourdomain.mailgun.org
   EMAIL_PASS=your-mailgun-password
   NODE_ENV=production
   ```

---

## Option 4: Custom Email Server (Advanced)

If you have email hosting with your domain provider:

```
EMAIL_HOST=mail.gidudu.org
EMAIL_PORT=587 (or 465 for SSL)
EMAIL_USER=noreply@gidudu.org
EMAIL_PASS=your-email-password
NODE_ENV=production
```

---

## Setting Environment Variables on Different Platforms

### **Render.com** (Current)
```bash
Dashboard → Service → Environment → Add Environment Variable
```

### **Vercel**
```bash
Settings → Environment Variables → Add
```

### **Railway**
```bash
Variables tab → Add Variable
```

### **Heroku**
```bash
Settings → Config Vars → Reveal Config Vars
```

### **DigitalOcean App Platform**
```bash
Settings → App-Level Environment Variables
```

---

## Testing Production Email

### Test Locally First
1. Update your local `.env` file with production credentials
2. Restart server: `node server.js`
3. Test contact form at http://localhost:3000
4. Check if email arrives

### Test in Production
1. Deploy with environment variables set
2. Visit your production site
3. Submit test contact form
4. Check email inbox (paul@gidudu.org, igfm@gidudu.org)
5. Check server logs on Render for errors

---

## Troubleshooting

### "Authentication failed" Error
- ✅ Double-check EMAIL_USER and EMAIL_PASS are correct
- ✅ For Gmail: Ensure App Password is used (not regular password)
- ✅ For SendGrid: Ensure EMAIL_USER is literally "apikey"
- ✅ Restart service after adding variables

### "Connection timeout" Error
- ✅ Check EMAIL_PORT (587 for TLS, 465 for SSL)
- ✅ Verify EMAIL_HOST is correct
- ✅ Check hosting platform allows outbound SMTP

### Emails Going to Spam
- ✅ Verify your domain with SendGrid/Mailgun
- ✅ Set up SPF and DKIM records
- ✅ Use a professional "from" address

### No Email Received
- ✅ Check spam/junk folders
- ✅ Review server logs on Render
- ✅ Verify recipient email addresses are correct in server.js

---

## Security Best Practices

1. **Never commit `.env` file** (already in .gitignore ✓)
2. **Rotate credentials** every 90 days
3. **Use App Passwords** for Gmail (not main password)
4. **Monitor email logs** for suspicious activity
5. **Set up rate limiting** (already done ✓)

---

## Current Configuration

The server expects these environment variables:

```env
EMAIL_HOST=smtp.gmail.com          # SMTP server
EMAIL_PORT=587                     # SMTP port
EMAIL_USER=your-email@domain.com   # Login username
EMAIL_PASS=your-password           # Login password or API key
NODE_ENV=production                # Environment
```

Recipients configured in `server.js`:
- paul@gidudu.org
- igfm@gidudu.org

---

## Quick Start Checklist

- [ ] Choose email service (Gmail/SendGrid/Other)
- [ ] Create account and get credentials
- [ ] Add environment variables to Render
- [ ] Redeploy service
- [ ] Test contact form
- [ ] Verify emails arrive
- [ ] Check spam folder if needed
- [ ] Monitor logs for errors

---

## Support

For issues contact:
- paul@gidudu.org
- Server logs: Render Dashboard → Logs tab
