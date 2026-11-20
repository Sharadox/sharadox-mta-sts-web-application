import { describeMailPolicy } from "@sharadox/test-web-library/mail-policy-suite";

// The policy and how Vercel serves it; keep `mx` in step with sharadox.com's MX records.
describeMailPolicy({
  root: new URL("../../", import.meta.url),
  domain: "sharadox.com",
  mx: ["mail.protonmail.ch", "mailsec.protonmail.ch"],
});
