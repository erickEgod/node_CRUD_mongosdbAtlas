//!Pondremos todas las rutas para realizar las solicitudes a la base de datos
import express from "express";
import bookSchema from "../models/book_model.js" ;


//*2)hacer un middleware
const getBook = async(req, res, next) =>{
    let book;
    const {id} = req.params;    //de los parámetros del request me traigo el "id"

    //Si el id no matchea con esa expresión regular (propia de mongo)
    if (!id.match(/^[0-9a-fA-F]{24}$/)){    
        return res.status(400).json({message: "El id del libro no es válido"});
    }

    //si todo sale bien
    try {
        book = await bookSchema.findById(id);   //busca la key "id" en el esquema del book
        if (!book){
            return res.status(404).json({message:"El libro no se encontró"});
        }
        return res.book = book,  next();   //retornamos el book y mandamos el next para ir al siguiente middleware
       
    } catch (error) {
        return res.status(500).json({message:error.message});
        //^^error del sistema
    }

        
};


//*1)creo un router
//Para poder manejar bastantes rutas con diferentes middlewares 
const router = express.Router();

//*Vamos a hacer cada ruta (como cada url)
//obtener todos los libros(GETALL)
router.get("/", async (req, res)=>{ //página principal
    try {
        const books = await bookSchema.find(); //es para traer todos los books que tenemos en la base de datos
        if (books.length == 0){
            return res.status(204).json([]); //si no hay ningún book entonces manda 204 que es que está vacío
        }else{
            return res.json(books); //la respuesta será la variable de arriba
        }
        
    } catch (error) {
        res.status(500).json({message: error.message}); //pongo un status 500 que es error en la db y el mensaje del error que tenga
    }   //^^error de sistema
});


//Crear un nuevo libro (POST) ES decir crear un nuevo RECURSO
router.post("/", async (req, res)=>{
    const {title, author,genre, publicationDate} = req?.body; //destructuramos el req que se envía (con el book a ingresar)
    //?si algo está mal
    if (!title || !author || !genre || !publicationDate){
        return res.status(400).json({message: "Es necesario un título, autor, género y fecha de publicación"});
    }
    //?si todo está bien
    
    const book = new bookSchema({   //creamos un nuevo libro siguiendo el esquema hecho en el modelo
        title, //propio de js cuando el key es igual al value title:title
        author,
        genre,
        publicationDate
    })
    
    try {
        const newBook = await book.save();  //acá realmente se creó el book
        res.status(201).json(newBook)
        console.log(newBook); //!para verificar que esté funcionando
    } catch (error) {
        res.status(400).json({message: error.message});
        //^^error de sistema
    }

})


//get individual
router.get("/:id",getBook, async (req, res) =>{ //getBook es el middleware que creamos arriba
    res.json(res.book);
});


//PUT
router.put("/:id",getBook, async (req, res) =>{ //getBook es el middleware que creamos arriba
    try {
        res.book.title= req.body.title || res.book.title
        res.book.author= req.body.author || res.book.author
        res.book.genre= req.body.genre || res.book.genre
        res.book.publicationDate= req.body.publicationDate || res.book.publicationDate
        
        const updateBook = await res.book.save();
        res.json(updateBook);

    } catch (error) {
        res.status(400).json({message:error.message});

    }
});


//PATCH
router.patch("/:id",getBook, async (req, res) =>{ //getBook es el middleware que creamos arriba
    if (req.body.title && req.body.author && req.body.genre && req.body.publicationDate){
        res.status(400).json({message:"Al menos un campo debe ser enviado (title, author, genre, publicationDate)"});
    }
    
    
    try {
        res.book.title= req.body.title || res.book.title
        res.book.author= req.body.author || res.book.author
        res.book.genre= req.body.genre || res.book.genre
        res.book.publicationDate= req.body.publicationDate || res.book.publicationDate
        
        const updateBook = await res.book.save();
        res.json(updateBook);

    } catch (error) {
        res.status(400).json({message:error.message});

    }
});


//DELETE
router.delete("/:id",getBook, async (req, res) =>{ //getBook es el middleware que creamos arriba
    try {
        await res.book.deleteOne({
            _id: res.book._id
        });
        res.json({message: `el libro ${res.body.title} ha sido removido`})
    } catch (error) {
        res.status(400).json({message: error.message});
    }

});



//!exportamos el router
export default router;





