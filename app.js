import cookieParser from 'cookie-parser';
import 'dotenv/config';
import express, { urlencoded } from 'express';
import cors from 'cors'; 
import router from './src/routes/api.js';




const app = express();

//MIDDLEWARES
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

//ROUTES
app.use('/api/v1',router)



export default app;