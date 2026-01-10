# Security Policy

## Supported Versions

We currently support the following versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 0.7.x   | :white_check_mark: |
| < 0.7   | :x:                |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security vulnerability, please follow these steps:

### 1. **Do NOT** create a public GitHub issue

Security vulnerabilities should be reported privately to prevent exploitation.

### 2. Report the vulnerability

Please email security concerns to: **security@tekthar.com**

Include the following information:
- **Type of vulnerability** (e.g., XSS, CSRF, authentication bypass)
- **Affected package(s)** and version(s)
- **Steps to reproduce** the vulnerability
- **Potential impact** of the vulnerability
- **Suggested fix** (if you have one)

### 3. Response timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Depends on severity, typically within 30 days

### 4. Disclosure policy

- We will acknowledge receipt of your report
- We will keep you informed of our progress
- We will credit you in the security advisory (unless you prefer to remain anonymous)
- We will coordinate public disclosure after a fix is available

## Security Best Practices

When using this library:

1. **Keep dependencies updated**: Regularly update to the latest versions
2. **Use HTTPS**: Always use HTTPS in production
3. **Validate inputs**: Validate all user inputs on both client and server
4. **Follow OAuth best practices**: Use secure OAuth flows and store tokens securely
5. **Review configuration**: Ensure your OAuth and API configurations are secure

## Known Security Considerations

### OAuth Configuration

- Always use HTTPS in production (`requireHttps: true`)
- Use secure redirect URIs
- Keep client secrets secure (server-side only)
- Use appropriate OAuth scopes

### Token Storage

- Tokens are stored in `localStorage` or `sessionStorage` by default
- Consider using secure, httpOnly cookies for production applications
- Implement token refresh mechanisms
- Clear tokens on logout

### API Security

- Always validate API responses
- Use CORS appropriately
- Implement rate limiting on the backend
- Use secure authentication headers

## Security Updates

Security updates will be:
- Released as patch versions (e.g., 0.7.6 → 0.7.7)
- Documented in release notes
- Tagged with security labels on GitHub

## Thank You

Thank you for helping keep this project and its users safe!
