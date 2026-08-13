import dns from "dns";
import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./db/connectDB.js";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

dotenv.config();

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚜 KisanSetu server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();