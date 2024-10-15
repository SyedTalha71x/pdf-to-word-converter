import express from 'express'
import { configDotenv } from 'dotenv';
import documentRoutes from './Routes/documents-routes.js'
import cors from 'cors'
import path from 'path'

configDotenv();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/backend/doc', express.static(path.join(process.cwd(), 'backend/doc'))); 
app.use("/", documentRoutes);

app.listen(process.env.PORT, ()=>{
    console.log('Server is running');
    
})