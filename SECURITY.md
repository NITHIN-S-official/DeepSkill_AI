# Security Policy

## Reporting a vulnerability

Please do not publish credentials, API keys, tokens, or exploit details in a public issue.

If this repository is used publicly, provide a private security-reporting channel before inviting vulnerability reports.

## Secrets

Never commit:

- Gemini API keys
- database credentials
- JWT/session secrets
- `.env` files containing real values

If a credential is exposed, revoke/rotate it immediately and remove it from repository history where appropriate.
