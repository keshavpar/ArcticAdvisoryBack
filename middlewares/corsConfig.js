export const corsConfig = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (origin.startsWith("http://localhost") || origin.startsWith("http://192.168.")) {
      return callback(null, true);
    }
    const allowedOrigins = ["https://metora.ai"];
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
