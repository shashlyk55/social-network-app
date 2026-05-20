const helmetConfig = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      fontSrc: ["'self'", 'https:'],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
      connectSrc: ["'self'", 'http://localhost:3000', 'http://localhost:3001'],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  noSniff: true,
  xssFilter: true,
  crossOriginResourcePolicy: { policy: 'cross-origin' as const },
  crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' as const },
};

export const getHelmetConfig = () => {
  return helmetConfig;
};
