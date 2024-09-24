import path from "path";
import { DataSource } from "typeorm";
require('dotenv').config();


export const AppDataSource = new DataSource({
    type:"postgres",
    host:"localhost",
    port:5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: true,
    entities: [path.join(process.cwd(), "src/models/*.ts")],
    subscribers: [],
})

export const checkConnection = async()=>{
    try {
        await AppDataSource.initialize();
        console.log('DB connected successful 🔥');
        
    } catch (error) {
        console.log('DB connection failed 😱',error);
        
    }
}