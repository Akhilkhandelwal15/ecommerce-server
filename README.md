# E-Commerce Server (Backend)

Notes: 

app.use(cors({
  origin: process.env.CORS_ORIGIN, // your frontend URL
  credentials: process.env.CORS_CREDENTIALS === 'true' // this enables cookies to be sent
}));
