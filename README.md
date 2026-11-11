# sharadox-mta-sts-web-application

The MTA-STS policy for sharadox.com mail, served at https://mta-sts.sharadox.com/.well-known/mta-sts.txt. It tells other mail servers to deliver to sharadox.com only over verified TLS. Every other path redirects to https://sharadox.com.

## What is here

- **The policy:** `public/.well-known/mta-sts.txt`.
  - Mode is `enforce`.
  - The `mx` lines must match sharadox.com's MX records, which today point to Proton.
  - `max_age` is one day (86400), so a change reaches mail servers quickly. Keep it there.
- **Serving:** `vercel.json` serves `public/` as plain text, with no build, and redirects every other path.
- **Tests:** `source/policy/unit-test.ts` checks the policy and the serving rules.

## Deploying

- **Production:** the Vercel project `sharadox-mta-sts-web-application` serves `index` publicly on mta-sts.sharadox.com. MTA-STS must be readable without a login.
- **Other branches:** `development` and `<feature>.development` deploy to Vercel's branch addresses, behind the team login.
- **When the policy changes:** update the id in the `_mta-sts.sharadox.com` TXT record (`v=STSv1; id=<new id>`), so mail servers fetch the policy again.

## Develop

- `pnpm verify` runs formatting, types and tests.
- **Branch flow:** `<feature>.development` → `development` (squash) → `index` (merge commit).

## License

The source is public to read and verify under the Sharadox Verifiable Source License, version 0.1.0:

- `LICENCA.md`: the Portuguese original, which prevails.
- `LICENSE.md`: the English translation.
- `NOTICE.md`: the copyright notice.
