import express from "express";
import { config } from "dotenv";
import cors from 'cors';
import { sequelize } from "./config/dbConnector"; 
import measureRouter from './routes/measureRoute';

config();

const app = express();
const PORT = process.env.PORT || 3500;

app.use(express.json());
app.use(cors());

app.use('/', measureRouter);

sequelize.sync().then(() => {
    app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
}).catch(error => {
    console.log(error);
})