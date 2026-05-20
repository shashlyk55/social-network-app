const corsConfig = {
  development: {
    // origin: (origin, callback) => {
    //   const allowedOrigins = [
    //     'http://localhost:3000',
    //     'http://localhost:3002',
    //     'http://localhost:3003',
    //   ];
    //   if (!origin || allowedOrigins.includes(origin)) {
    //     callback(null, true);
    //   } else {
    //     callback(new Error('Not allowed by CORS'));
    //   }
    // },
    // origin: [
    //   'http://localhost:3002',
    //   'http://localhost:3003',
    //   'http://localhost:3000',
    // ],
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
      'Access-Control-Allow-Headers',
      'Access-Control-Request-Method',
    ],
    credentials: true,
    // exposedHeaders: ['Content-Range', 'X-Content-Range'],
    // preflightContinue: false,
    optionsSuccessStatus: 204,
    // maxAge: 86400,
  },
};

export const getCorsConfig = () => {
  return corsConfig;
};
