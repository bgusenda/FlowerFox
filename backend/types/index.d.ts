declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ATLAS_URI: string;
      JWT_SECRETKEY?: string;
      PORT?: string;
    }
  }
}

export {};