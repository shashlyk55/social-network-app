// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      accessToken?: string;
      refreshToken?: string;
    }
  }
}

// import { Request } from 'express';

// declare module 'express-serve-static-core' {
//   interface Request {
//     accessToken?: string;
//     refreshToken?: string;
//   }
// }
