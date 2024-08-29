import { Sequelize } from "sequelize-typescript";
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize({
    database: process.env.DB_NAME,
    dialect: 'mysql',
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    models: [__dirname + '/models']
});
