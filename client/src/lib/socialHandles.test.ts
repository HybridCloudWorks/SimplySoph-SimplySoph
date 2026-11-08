import fs from "node:fs";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/firebase", () => ({
  getFirebaseAuth: () => ({ currentUser: null }),
  getFirebaseStorage: () => ({}),
  microsoftProvider: {},
}));

import { SOCIAL_PROFILE_URLS } from "@/const";
import {
  SITE_CONFIG_DEFAULTS,
  socialHandle,
} from "@/contexts/SiteConfigContext";

const SRC_ROOT = path.join(process.cwd(), "client", "src");

/**
 * Profile links that point at the wrong account (issue #63):
 *  - youtube.com/@simplysoph and pinterest.com/simplysoph belong to other people
 *  - youtube.com/@smply.soph does not exist
 *  - instagram.com/simply.soph and instagram.com/simplysoph are not Soph's
 */
const RETIRED_PROFILE_URL =
  /(instagram\.com\/(simply\.soph|simplysoph)|youtube\.com\/@(simplysoph|smply\.soph)|pinterest\.com\/simplysoph|tiktok\.com\/@(simplysoph|simply\.soph))\b/i;

/** Hard-coded profile URLs bypass the admin-editable site config. */
const PROFILE_URL =
  /https?:\/\/(www\.)?(instagram\.com\/|youtube\.com\/@|tiktok\.com\/@|pinterest\.com\/)(?!(pin|embed|p|reel|watch|player|sharer)\b)[A-Za-z0-9_.]+/;

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return /\.(ts|tsx)$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name)
      ? [full]
      : [];
  });
}

describe("social handles", () => {
  it("uses the verified profile for each network", () => {
    expect(SITE_CONFIG_DEFAULTS.social).toMatchObject(SOCIAL_PROFILE_URLS);
    expect(socialHandle(SOCIAL_PROFILE_URLS.instagram)).toBe("@smply.soph");
    expect(socialHandle(SOCIAL_PROFILE_URLS.youtube)).toBe("@smplysoph");
    expect(socialHandle(SOCIAL_PROFILE_URLS.tiktok)).toBe("@smply.soph");
    expect(socialHandle(SOCIAL_PROFILE_URLS.pinterest)).toBe("@smplysoph");
  });

  it("derives display handles from profile URLs", () => {
    expect(socialHandle("https://instagram.com/someone/")).toBe("@someone");
    expect(socialHandle("not a url")).toBe("");
    expect(socialHandle("https://www.youtube.com/")).toBe("");
  });

  it("never links a retired or wrong-account handle", () => {
    const offenders = walk(SRC_ROOT).filter(file =>
      RETIRED_PROFILE_URL.test(fs.readFileSync(file, "utf8"))
    );
    expect(offenders).toEqual([]);
  });

  it("keeps profile URLs in one place (const.ts)", () => {
    const allowed = path.join(SRC_ROOT, "const.ts");
    const offenders = walk(SRC_ROOT)
      .filter(file => file !== allowed)
      .filter(file => PROFILE_URL.test(fs.readFileSync(file, "utf8")));
    expect(offenders).toEqual([]);
  });
});
