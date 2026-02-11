# Gidudu Mail Server Configuration

## Quick Setup Guide for Using Gidudu's Own Email Server

This guide helps you configure the IGFM website to send emails through the Gidudu mail server instead of third-party services.

---

## Step 1: Get Your Email Server Information

Contact your email hosting provider (whoever manages gidudu.org email) and request:

### Required Information:
1. **SMTP Server Hostname**
   - Common formats:
     - `mail.gidudu.org`
     - `smtp.gidudu.org`
     - `gidudu.org`
   - Ask: "What is the outgoing mail server (SMTP) address?"

2. **SMTP Port Number**
   - `587` - TLS/STARTTLS (recommended, most common)
   - `465` - SSL (secure alternative)
   - `25` - Standard (not recommended, often blocked)
   - Ask: "What port should I use for SMTP?"

3. **Email Account**
   - Create a dedicated email: `noreply@gidudu.org` or `website@gidudu.org`
   - Or use existing: `paul@gidudu.org`
   - Ask: "Can you create a noreply@gidudu.org account?"

4. **Email Password**
   - The password for the email account
   - Ask: "What is the password for this email account?"

5. **Encryption Type**
   - TLS/STARTTLS (port 587)
   - SSL (port 465)
   - Ask: "Does the server use TLS or SSL?"

---

## Step 2: Common Configuration Scenarios

### Scenario A: Standard TLS (Port 587) - Most Common

**Local Development** - Update `server/.env`:
```env
EMAIL_HOST=mail.gidudu.org
EMAIL_PORT=587
EMAIL_USER=noreply@gidudu.org
EMAIL_PASS=your-actual-password
EMAIL_SECURE=false
```

**Production** - Add to Render Environment Variables:
```
EMAIL_HOST=mail.gidudu.org
EMAIL_PORT=587
EMAIL_USER=noreply@gidudu.org
EMAIL_PASS=your-actual-password
EMAIL_SECURE=false
NODE_ENV=production
```

### Scenario B: SSL (Port 465)

```env
EMAIL_HOST=mail.gidudu.org
EMAIL_PORT=465
EMAIL_USER=noreply@gidudu.org
EMAIL_PASS=your-actual-password
EMAIL_SECURE=true
```

### Scenario C: Using Subdomain

```env
EMAIL_HOST=smtp.gidudu.org
EMAIL_PORT=587
EMAIL_USER=noreply@gidudu.org
EMAIL_PASS=your-actual-password
EMAIL_SECURE=false
```

### Scenario D: Using Main Domain

```env
EMAIL_HOST=gidudu.org
EMAIL_PORT=587
EMAIL_USER=noreply@gidudu.org
EMAIL_PASS=your-actual-password
EMAIL_SECURE=false
```

---

## Step 3: Testing the Configuration

### Test Locally First

1. **Update your `.env` file** with the correct settings
2. **Start the server:**
   ```bash
   cd server
   node server.js
   ```
3. **Look for connection message:**
   ```
   Email server connection verified ✓
   ```
4. **Test the contact form** at http://localhost:3000
5. **Check your inbox** (paul@gidudu.org, igfm@gidudu.org)

### Common Test Issues

**Error: "ECONNREFUSED"**
- ✅ Check EMAIL_HOST is correct
- ✅ Check EMAIL_PORT is correct
- ✅ Verify your server can reach the mail server

**Error: "Invalid login"**
- ✅ Check EMAIL_USER is correct (might need full email or just username)
- ✅ Check EMAIL_PASS is correct
- ✅ Ask provider: "Do I need to use the full email address or just the username?"

**Error: "ETIMEDOUT"**
- ✅ Port might be blocked by firewall
- ✅ Try different port (587 vs 465)
- ✅ Contact hosting provider

**Error: "Certificate verify failed"**
- ✅ Try setting EMAIL_SECURE=false
- ✅ Contact provider about SSL certificate status

---

## Step 4: Deploy to Production

### On Render.com:

1. **Go to your service** → Environment tab
2. **Add environment variables:**
   ```
   EMAIL_HOST=mail.gidudu.org
   EMAIL_PORT=587
   EMAIL_USER=noreply@gidudu.org
   EMAIL_PASS=your-actual-password
   EMAIL_SECURE=false
   NODE_ENV=production
   ```
3. **Click "Save Changes"**
4. **Service will automatically redeploy**
5. **Check logs** for "Email server connection verified"
6. **Test contact form** on your live site

---

## Step 5: Verify Email Delivery

1. **Submit test message** through contact form
2. **Check recipient inboxes:**
   - paul@gidudu.org
   - igfm@gidudu.org
3. **Check spam/junk folders** if not in inbox
4. **Review server logs** on Render for any errors

---

## Common Email Provider Configurations

### cPanel/WHM Hosting
```env
EMAIL_HOST=mail.gidudu.org
EMAIL_PORT=587
EMAIL_USER=noreply@gidudu.org  # or just "noreply"
EMAIL_PASS=cpanel-email-password
EMAIL_SECURE=false
```

### Plesk Hosting
```env
EMAIL_HOST=smtp.gidudu.org
EMAIL_PORT=587
EMAIL_USER=noreply@gidudu.org
EMAIL_PASS=plesk-email-password
EMAIL_SECURE=false
```

### Office 365 / Microsoft 365
```env
EMAIL_HOST=smtp.office365.com
EMAIL_PORT=587
EMAIL_USER=noreply@gidudu.org
EMAIL_PASS=microsoft-password
EMAIL_SECURE=false
```

### Google Workspace (if gidudu.org uses Google)
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=noreply@gidudu.org
EMAIL_PASS=app-specific-password
EMAIL_SECURE=false
```

---

## Troubleshooting Checklist

- [ ] Confirmed SMTP server address with hosting provider
- [ ] Confirmed SMTP port number
- [ ] Created dedicated email account (noreply@gidudu.org)
- [ ] Got correct password for the email account
- [ ] Updated local .env file
- [ ] Tested locally and got "Email server connection verified"
- [ ] Successfully sent test email locally
- [ ] Added environment variables to Render
- [ ] Redeployed service on Render
- [ ] Checked Render logs for errors
- [ ] Tested contact form on production site
- [ ] Verified email arrived (checked spam too)

---

## Getting Help from Your Email Provider

Use this script when contacting support:

> Hi,
> 
> I need to configure my website to send emails through your SMTP server. 
> Can you provide the following information for gidudu.org:
> 
> 1. SMTP server hostname (mail.gidudu.org or smtp.gidudu.org?)
> 2. SMTP port (587 or 465?)
> 3. Does it use TLS or SSL?
> 4. Can you create a noreply@gidudu.org email account?
> 5. Should I use the full email address or just "noreply" as username?
> 
> Thank you!

---

## Security Best Practices

1. ✅ Use a dedicated email account (noreply@gidudu.org)
2. ✅ Use strong password
3. ✅ Never commit .env file to git
4. ✅ Rotate password every 90 days
5. ✅ Monitor email logs for suspicious activity
6. ✅ Use TLS/SSL encryption (port 587 or 465)

---

## Benefits of Using Gidudu Mail Server

- ✅ **Professional** - Emails come from @gidudu.org
- ✅ **No limits** - No daily sending restrictions like Gmail
- ✅ **Better deliverability** - Emails less likely to be marked as spam
- ✅ **Full control** - You own the infrastructure
- ✅ **No third-party dependencies** - No external service accounts needed
- ✅ **Cost-effective** - Already included with your hosting

---

## Current Configuration

The website is configured to send emails from:
- `EMAIL_USER` (your configured sender)

To these recipients:
- paul@gidudu.org
- igfm@gidudu.org

Users receive confirmation that includes:
- Their name, email, subject, and message
- Option to reply directly to the user's email

---

## Need Help?

1. **Check server logs** on Render Dashboard → Logs
2. **Contact hosting provider** for SMTP details
3. **Email:** paul@gidudu.org
4. **Review:** [PRODUCTION_EMAIL_SETUP.md](./PRODUCTION_EMAIL_SETUP.md) for alternative options
