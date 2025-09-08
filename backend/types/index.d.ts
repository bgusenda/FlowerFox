declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ATLAS_URI: string;
      JWT_SECRETKEY?: string;
      PORT?: int;
      SALT_ROUNDS?: int;
    }
  }
}

export {};