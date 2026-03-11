# Security Policy

## Supported Versions

| Version | Supported           |
| ------- | ------------------- |
| 2.0.x   | Fully supported     |
| 1.0.x   | Security fixes only |
| < 1.0   | Unsupported         |

## Reporting a Vulnerability

I take security issues seriously. If you discover a security vulnerability, please follow these steps:

### How to Report

- **DO NOT** create a public GitHub issue
- Email us directly at: **mihlalimabovula@outlook.com**
- Or use GitHub's private vulnerability reporting feature

### What to Include

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested fixes (if known)

### Response Timeline

- **24 hours**: Initial acknowledgment
- **5-7 days**: Investigation and assessment
- **14 days**: Fix development or mitigation plan
- **30 days**: Public disclosure (if appropriate)

## Security Features

### Current Security Measures

- ✅ All data stored locally in browser (no external servers)
- ✅ No data transmission over network
- ✅ Input sanitization for all form fields
- ✅ XSS prevention through text content handling
- ✅ Content Security Policy ready

### Data Storage

- All datA browser's localStorage
- No sensitive data transmitted
- No cookies used for tracking
- No external API calls

## Known Security Considerations

### Browser localStorage

- Data is not encrypted by default
- Accessible by any JavaScript on the same domain
- Cleared when browser data is cleared
- Not suitable for highly sensitive data

### Recommendations for Production Use

If using this for sensitive data:

1. Implement server-side storage instead
2. Add encryption before localStorage
3. Use HTTPS in production
4. Add authentication system
5. Regular security audits

## Security Best Practices for Users

### For Administrators

- Regularly backup data files
- Clear browser data periodically
- Use in private/incognito mode for sensitive sessions
- Log out/close browser when done

### For Developers

- Validate all user inputs
- Sanitize data before displaying
- Keep dependencies updated
- Follow secure coding practices

## Security Update Process

Security updates will be released as:

- **Critical**: Within 48 hours
- **High**: Within 1 week
- **Medium**: Next release cycle
- **Low**: As scheduled

## Responsible Disclosure

I follow responsible disclosure practices:

1. Reporter discloses privately
2. I investigate and fix
3. I release fix and credit reporter (if desired)
4. Public disclosure after fix is available

## Security Acknowledgments

We thank these individuals for their responsible disclosures:

*(None yet - be the first!)*

---

**Last Updated:** March 2026
**Contact:** *mihlalimabovula@outlook.com*
