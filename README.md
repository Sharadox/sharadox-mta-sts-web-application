# mta-sts

A standalone branch, outside the usual branch flow, that serves only the MTA-STS policy for sharadox.com mail:
https://mta-sts.sharadox.com/.well-known/mta-sts.txt — every other path redirects to https://sharadox.com.

- Policy: `public/.well-known/mta-sts.txt` (mode enforce; the mx lines must match sharadox.com's MX records, today Proton).
- Served by the separate Vercel project `sharadox-mta-sts`, whose production branch is `mta-sts` (production, so it is public: MTA-STS must be readable without a login).
- When the policy changes, update the id in the `_mta-sts.sharadox.com` TXT record (`v=STSv1; id=<new id>`) so mail servers fetch it again.
