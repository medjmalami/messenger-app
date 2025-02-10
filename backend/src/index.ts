import express from "express";
import cors from "cors";
import { config } from "dotenv";
import SignRoutes from "./routes/sign.routes";
import TokenRoutes from "./routes/token.routes";
import PassRoutes from "./routes/pass.routes";
const morgan = require('morgan');

config();

const app = express();
app.use(cors());
app.use(express.json());



app.use(morgan('combined'));

app.get("/", (req , res) => {
  res.send("Messanger Backend is Running!");
});

app.use("/", SignRoutes);
app.use("/", TokenRoutes);
app.use("/", PassRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



