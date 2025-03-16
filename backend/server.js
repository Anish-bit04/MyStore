import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import productRoutes from "./routes/productRoute.js";
import { arcjetMiddleware } from "./lib/arcjet.js";
import { sql } from "./config/db.js";
const app = express();

dotenv.config();
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

const PORT = process.env.PORT;

app.use(async (req, res, next) => {
  try {
    const decision = await arcjetMiddleware.protect(req, {
      requested: 1, // each request consume 1 token
    });
   
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        res.status(429).json({ error: "Too Many Requests" });
      } else if (decision.reason.isBot()) {
        res.status(403).json({ error: "Bot access denied" });
      } else {
        res.status(403).json({ error: "Forbidden" });
      }
      return;
    }

    // check for spoofed bots
    if(decision.results.some((result) => result.reason.isBot() && result.reason.isSpoofed())) {
        res.status(403).json({
            error: "Spoofed bot detected",
        })
        return
    }
    next()
  } catch (error) {
    console.log("Error in arcjetMiddleware", error);
    res.status(500).json(error);
    next(error)
  }
});
app.use("/api/product", productRoutes);

async function initDB() {
  try {
    await sql`
        CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            image VARCHAR(255) NOT NULL,
            price DECIMAL(10,2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
        )
        `;
    console.log("Database initialized successfully");
  } catch (error) {
    console.log("Error in initDB", error);
  }
}

initDB().then(() => {
  app.listen(PORT, () => console.log(`server is active at ${PORT}`));
});
