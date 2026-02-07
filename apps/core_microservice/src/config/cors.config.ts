// const corsConfig = {
//   // origin: (origin, callback) => {
//   //   const allowedOrigins = [
//   //     'http://localhost:3000',
//   //     'http://localhost:3002',
//   //     'http://localhost:3003',
//   //   ];
//   //   if (!origin || allowedOrigins.includes(origin)) {
//   //     callback(null, true);
//   //   } else {
//   //     callback(new Error('Not allowed by CORS'));
//   //   }
//   // },
//   // origin: [
//   //   'http://localhost:3002',
//   //   'http://localhost:3003',
//   //   'http://localhost:3000',
//   // ],
//   origin: 'http://localhost:3000',
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//   allowedHeaders: [
//     'Content-Type',
//     'Authorization',
//     'X-Requested-With',
//     'Accept',
//     'Origin',
//     'Access-Control-Allow-Headers',
//     'Access-Control-Request-Method',
//   ],
//   credentials: true,
//   // exposedHeaders: ['Content-Range', 'X-Content-Range'],
//   // preflightContinue: false,
//   optionsSuccessStatus: 204,
//   // maxAge: 86400,
// };

// export const getCorsConfig = () => {
//   return corsConfig;
// };

export const corsConfig = {
  origin: (
    origin: string | undefined,
    callback: (error: Error | null, allow?: boolean) => void,
  ) => {
    if (!origin) {
      return callback(null, true);
    }

    if (origin === 'http://localhost:3000') {
      return callback(null, true);
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
  ],
  optionsSuccessStatus: 204,
};
