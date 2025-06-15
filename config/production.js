const productionConfig = {
  // Database configuration
  database: {
    uri: process.env.MONGO_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    },
  },

  // Server configuration
  server: {
    port: process.env.PORT || 5000,
    cors: {
      origin: [
        process.env.FRONTEND_URL,
        process.env.VERCEL_URL,
        "https://unilorin-voting.vercel.app", // Your production domain
      ],
      credentials: true,
    },
  },

  // Security configuration
  security: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiration: "7d",
    bcryptRounds: 12,
  },

  // Email configuration
  email: {
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  },
}

module.exports = productionConfig
