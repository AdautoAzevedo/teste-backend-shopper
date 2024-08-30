import { Sequelize } from "sequelize-typescript";
import dotenv from 'dotenv';
import path from "path";

dotenv.config();

export const sequelize = new Sequelize({
    database: process.env.DB_NAME,
    dialect: 'mysql',
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    models: [path.resolve(__dirname, '..', 'models')]
});
