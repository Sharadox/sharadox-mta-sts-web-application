import { readFileSync } from "node:fs";
import { expect, test } from "vitest";

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");
const policy = Object.groupBy(
  read("public/.well-known/mta-sts.txt")
    .trim()
    .split("\n")
    .map((line) => line.split(": ") as [string, string]),
  ([key]) => key,
);
const value = (key: string) => policy[key]?.map(([, entry]) => entry);

test("the policy enforces TLS for sharadox.com's Proton mail servers", () => {
  expect(value("version")).toEqual(["STSv1"]);
  expect(value("mode")).toEqual(["enforce"]);
  expect(value("mx")).toEqual(["mail.protonmail.ch", "mailsec.protonmail.ch"]);
});

test("mail servers cache it for one day, so a change reaches them quickly", () => {
  expect(value("max_age")).toEqual(["86400"]);
});

test("Vercel serves the policy as plain text and sends every other path to sharadox.com", () => {
  const configuration = JSON.parse(read("vercel.json")) as {
    outputDirectory: string;
    headers: { source: string; headers: { key: string; value: string }[] }[];
    redirects: { source: string; destination: string }[];
  };
  expect(configuration.outputDirectory).toBe("public");
  expect(configuration.headers[0]!.source).toBe("/.well-known/mta-sts.txt");
  expect(configuration.headers[0]!.headers).toContainEqual({ key: "Content-Type", value: "text/plain; charset=utf-8" });
  const redirect = configuration.redirects[0]!;
  expect(redirect.destination).toBe("https://sharadox.com");
  const pattern = new RegExp(`^${redirect.source.replace("/((?!", "/(?!(?:").replace(").*)", ")).*")}$`);
  expect(pattern.test("/.well-known/mta-sts.txt")).toBe(false);
  expect(pattern.test("/")).toBe(true);
  expect(pattern.test("/anything")).toBe(true);
});
