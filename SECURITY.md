# Security policy

## Reporting a vulnerability

Please report security problems privately through GitHub: open the repository's **Security** tab and choose **Report a vulnerability**, or go straight to [the private report form](https://github.com/HybridCloudWorks/SimplySoph-SimplySoph/security/advisories/new). Do not open a public issue, pull request or discussion for a security problem.

A useful report says what is affected (a page, an API route, a Cloud Function or a file in this repository), how to reproduce it, and what an attacker could do with it. Please do not include other people's personal details, such as subscriber or commenter emails; describe them instead.

You will get an acknowledgement in the report thread. This is a personal project with no bug bounty, so please give reasonable time for a fix before disclosing anything publicly.

## Scope

- The code in this repository.
- The live website at [simplysoph.com](https://simplysoph.com) and its `/api/` functions, limited to what you can observe as an ordinary visitor or signed-in reader.

Out of scope: testing that sends email to subscribers, creates load, or tries other people's accounts; and the third-party services the site uses (Firebase, Google Cloud, Algolia, Instagram, TikTok). Report problems in those services to their vendors.

## Supported versions

Only the current `main` branch, which is what the live website runs, receives fixes.

How the site is secured is described in [docs/SECURITY.md](docs/SECURITY.md).
