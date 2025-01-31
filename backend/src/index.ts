import express from "express";
import cors from "cors";
import { config } from "dotenv";
import SignRoutes from "./routes/sign.routes";


config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req , res) => {
  res.send("Messanger Backend is Running!");
});

app.use("/", SignRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



