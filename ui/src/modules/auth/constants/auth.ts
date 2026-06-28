// src/modules/auth/constants/auth.ts
type ViteEnv = {
  VITE_AUTH0_DOMAIN?: string;
  VITE_AUTH0_CLIENT_ID?: string;
  VITE_AUTH0_AUDIENCE?: string;
  VITE_AUTH0_SCOPE?: string;
  VITE_AUTH0_REDIRECT_URL?: string;
};

type ImportMetaWithOptionalEnv = ImportMeta & {
  env?: ViteEnv;
};

// Vite runtime (browser) provides import.meta.env; Node/Playwright does not.
const viteEnv: ViteEnv | undefined =
  typeof import.meta !== "undefined"
    ? (import.meta as ImportMetaWithOptionalEnv).env
    : undefined;

// Always available in Node; also available in Vite dev via dotenv.
const nodeEnv = (typeof process !== "undefined" ? process.env : {}) as Record<
  string,
  string | undefined
>;

/**
 * Prefer Vite vars; fall back to Node env (supports Playwright and server code).
 * Also accept AUTH0_* names so tests/servers don't have to use VITE_* prefixes.
 */
export const AUTH0_DOMAIN =
  viteEnv?.VITE_AUTH0_DOMAIN ??
  nodeEnv.VITE_AUTH0_DOMAIN ??
  nodeEnv.AUTH0_DOMAIN;

export const AUTH0_CLIENT_ID =
  viteEnv?.VITE_AUTH0_CLIENT_ID ??
  nodeEnv.VITE_AUTH0_CLIENT_ID ??
  nodeEnv.AUTH0_CLIENT_ID;

export const AUTH0_AUDIENCE =
  viteEnv?.VITE_AUTH0_AUDIENCE ??
  nodeEnv.VITE_AUTH0_AUDIENCE ??
  nodeEnv.AUTH0_AUDIENCE;

export const AUTH0_SCOPE =
  viteEnv?.VITE_AUTH0_SCOPE ??
  nodeEnv.VITE_AUTH0_SCOPE ??
  "openid profile email";

export const AUTH0_REDIRECT_URL =
  viteEnv?.VITE_AUTH0_REDIRECT_URL ??
  nodeEnv.VITE_AUTH0_REDIRECT_URL ??
  nodeEnv.AUTH0_REDIRECT_URI; // common alternate name

/** Call this at app startup (browser) to fail fast if misconfigured. */
export function assertAuth0Config() {
  const missing: string[] = [];
  if (!AUTH0_DOMAIN) missing.push("AUTH0_DOMAIN / VITE_AUTH0_DOMAIN");
  if (!AUTH0_CLIENT_ID) missing.push("AUTH0_CLIENT_ID / VITE_AUTH0_CLIENT_ID");
  if (!AUTH0_REDIRECT_URL)
    missing.push(
      "AUTH0_REDIRECT_URL / AUTH0_REDIRECT_URI / VITE_AUTH0_REDIRECT_URL",
    );
  if (missing.length) {
    throw new Error(`Missing Auth0 env: ${missing.join(", ")}`);
  }
}
