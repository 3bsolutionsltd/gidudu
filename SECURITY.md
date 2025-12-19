# Security Policy

## Reporting Security Issues

The International Great Faith Ministries (IGFM) team takes security seriously. We appreciate your efforts to responsibly disclose your findings.

### How to Report a Security Vulnerability

If you discover a security vulnerability within our website, please send an email to:

**Email:** info@gidudu.org

Please include the following information:
- Type of issue (e.g., XSS, CSRF, SQL injection, etc.)
- Full paths of source file(s) related to the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

### Response Timeline

We will:
- Acknowledge receipt of your vulnerability report within 48 hours
- Provide regular updates on our progress
- Credit you for your responsible disclosure (if desired)

### Security Best Practices

Our website implements the following security measures:

#### HTTPS Enforcement
- All traffic is served over HTTPS via GitHub Pages
- HTTP Strict Transport Security (HSTS) headers are enabled by GitHub Pages

#### Content Security Policy (CSP)
- Strict CSP headers to prevent XSS attacks
- Only allowing scripts and styles from trusted sources
- Restricting frame ancestors to prevent clickjacking

#### Security Headers
- **X-Content-Type-Options**: `nosniff` - Prevents MIME type sniffing
- **X-Frame-Options**: `SAMEORIGIN` - Prevents clickjacking
- **X-XSS-Protection**: `1; mode=block` - Enables browser XSS filtering
- **Referrer-Policy**: `strict-origin-when-cross-origin` - Controls referrer information
- **Permissions-Policy**: Restricts access to browser features

#### Subresource Integrity (SRI)
- All CDN resources include integrity hashes
- Ensures third-party resources haven't been tampered with

#### Form Security
- Form submissions only allowed to trusted domains
- CSRF protection on all form endpoints
- Input validation and sanitization

#### External Dependencies
- Font Awesome 6.4.0 with SRI hash verification
- Google Fonts with crossorigin attributes
- Regular dependency updates and security audits

### What We Don't Accept

Please do not:
- Perform automated testing that could harm our services
- Access or attempt to access data that doesn't belong to you
- Engage in social engineering attacks against our staff or volunteers
- Disrupt or degrade our services
- Publicly disclose the vulnerability before we've had a chance to address it

### Safe Harbor

We consider security research and vulnerability disclosure activities conducted consistent with this policy to constitute "authorized" conduct under applicable law. We will not pursue legal action against researchers who follow this policy.

### Privacy

We will handle your security report in confidence and will not share your personal information with third parties without your permission.

### Attribution

If you'd like, we'll publicly acknowledge your responsible disclosure after the issue is resolved. Please let us know your preference when submitting your report.

---

**Thank you for helping keep IGFM and our community safe!**

*Last Updated: December 19, 2025*
