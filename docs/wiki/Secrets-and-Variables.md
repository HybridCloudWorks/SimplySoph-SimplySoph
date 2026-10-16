---
title: Secrets & Variables
---

# Secrets & Variables — SimplySoph CI/CD

This page lists what GitHub Actions needs to build, deploy, and run Lighthouse
audits for SimplySoph.

CI signs in to Google Cloud with GitHub OIDC and Workload Identity Federation.
There are no service-account JSON keys or deploy tokens in GitHub, and the
Firebase web config is fetched at build time.

> **Where to add them:**
> GitHub repo → **Settings** → **Secrets and variables** → **Actions** → **Variables** tab → **New repository variable**

---

## Repository variables

These are identifiers, not secrets.

| Variable | Required? | Used in | Value |
|---|---|---|---|
| `GCP_WORKLOAD_IDENTITY_PROVIDER` | ✅ Yes | `deploy.yml`, `lighthouse.yml` | Terraform output `workload_identity_provider` |
| `GCP_SERVICE_ACCOUNT` | ✅ Yes | `deploy.yml`, `lighthouse.yml` | Terraform output `github_deploy_service_account` |
| `VITE_OWNER_FIREBASE_UID` | ✅ Yes | `deploy.yml`, `lighthouse.yml` | Firebase Console → **Authentication** → **Users** → the owner's **User UID** |
| `VITE_ALGOLIA_APP_ID` | ⭕ Optional (search) | `deploy.yml` | Algolia dashboard |
| `VITE_ALGOLIA_SEARCH_KEY` | ⭕ Optional (search) | `deploy.yml` | Algolia **search-only** API key |
| `VITE_ALGOLIA_INDEX_NAME` | ⭕ Optional (search) | `deploy.yml` | Algolia index name |

The Workload Identity provider only trusts this repository, pinned by its
repository and owner IDs
([`platform/terraform/wif.tf`](https://github.com/HybridCloudWorks/SimplySoph-SimplySoph/blob/main/platform/terraform/wif.tf)).

---

## Firebase web config (nothing to add)

The `VITE_FIREBASE_*` values are public. After the OIDC sign-in, the workflows
fetch them with `firebase apps:sdkconfig` and pass them to the build. For local
development, put them in `.env` (see the
[README](https://github.com/HybridCloudWorks/SimplySoph-SimplySoph#environment-variables)).

---

## Runtime secrets (Secret Manager, not GitHub)

Cloud Functions read their secrets from Google Cloud Secret Manager through
`defineSecret()`. Terraform in
[`platform/terraform`](https://github.com/HybridCloudWorks/SimplySoph-SimplySoph/tree/main/platform/terraform)
manages the secrets; their values come from the sensitive HCP Terraform
workspace variable `firebase_runtime_secret_values`. The key names are listed in
[`terraform.tfvars.example`](https://github.com/HybridCloudWorks/SimplySoph-SimplySoph/blob/main/platform/terraform/terraform.tfvars.example).

---

## GitHub built-in secret

| Secret Name | Purpose | Notes |
|---|---|---|
| `GITHUB_TOKEN` | Posts the preview channel URL as a PR comment | **Auto-provided — do NOT add manually** |

---

## No longer used

The move to keyless deploys removed these. Don't add them back:
`FIREBASE_SERVICE_ACCOUNT` (and `FIREBASE_SERVICE_ACCOUNT_SIMPLYSOPH_66C78`),
`FIREBASE_TOKEN`, the `VITE_FIREBASE_*` secrets, `VITE_EMAILJS_*` and
`LHCI_GITHUB_APP_TOKEN`. See
[`docs/SECRETS_MIGRATION_PLAN.md`](https://github.com/HybridCloudWorks/SimplySoph-SimplySoph/blob/main/docs/SECRETS_MIGRATION_PLAN.md).
