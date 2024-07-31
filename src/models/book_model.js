//!Crearemos el modelo que tendrán los libros creados en nuestra base de datos, algo así como un "interface" de ts
//*usaremos mongoose que debemos instalarlo como dependencia
import mongoose from "mongoose";

const bookSchemamongo = new mongoose.Schema(  //?se crea un "ejemplo" de como va a estar creado cada OBJETO que entra en la db
    {
        title:String,
        author:String,
        genre:String,
        publicationDate:Number
    }
);

//*ASÍ se exporta un modelo de mongoose
const bookSchema = mongoose.model("bookSchema", bookSchemamongo );
export default bookSchema;



