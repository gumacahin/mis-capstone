/// <reference types="vite/client" />
// import "vite/client";

interface ImportMetaEnv {
  readonly VITE_AUTH0_DOMAIN: string;
  readonly VITE_AUTH0_CLIENT_ID: string;
  readonly VITE_AUTH0_AUDIENCE: string;
  readonly VITE_AUTH0_SCOPE: string;
  readonly VITE_AUTH0_REDIRECT_URL: string;
}

export interface ImportMeta {
  readonly env: ImportMetaEnv;
}
