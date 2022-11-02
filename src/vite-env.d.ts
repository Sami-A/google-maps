/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE__GOOGLE_MAP_API_KEY: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
