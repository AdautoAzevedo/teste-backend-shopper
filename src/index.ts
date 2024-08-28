import express from "express";
import { Sequelize } from "sequelize";
import { config } from "dotenv";
import cors from 'cors';

config();

const app = express();
const PORT = process.env.PORT || 3500;

app.use(express.json);
app.use(cors);

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
