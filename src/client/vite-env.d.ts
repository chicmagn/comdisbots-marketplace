/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_DISCORD_CLIENT_ID: string
    readonly VITE_DISCORD_CLIENT_SECRET: string
    readonly VITE_DISCORD_REDIRECT_URL: string
    readonly VITE_DISCORD_AUTH_URL: string
    readonly VITE_SERVER_URL: string
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }