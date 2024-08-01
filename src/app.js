import dotenv from "dotenv";
import express, { Router } from "express";
import mongoose, { mongo } from "mongoose";
import bookRoutes from "./routes/book_routes.js"
import bodyParser from "body-parser";

dotenv.config();    //traemos las variables de entorno del archivo .env

//usamos express para los middlewares
const app = express(); //creamos una instancia del objeto express llamado "app"
app.use(bodyParser.json()); //parseamos el body que nos llega


//se conecta la base de datos:
mongoose.connect(process.env.MONGODB_URI).then(()=>console.log("conectado correctamente")).catch((e)=>console.log(e));
const db = mongoose.connection; //db es la conexión creada con la url y nombre de db de arriba

//creamos otro middleware para usar las rutas creadas en el archivo "book_routes.js"
app.use("/books", bookRoutes);
//*^^ /books es la ruta donde se guardaran los libros

const port = process.env.PORT || 3001;  //guardamos en "port" el puerto de .env y si no existe el default sería 3001
app.get("/", (req, res)=>res.send("WELCOME TO MY API"));

app.listen(port, ()=>{
    console.log(`Servidor iniciado en el puerto: ${port}`);
    
});













