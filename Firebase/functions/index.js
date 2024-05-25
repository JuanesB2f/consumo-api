const functions = require('firebase-functions');
const admin = require('firebase-admin'); 


var serviceAccount = require("./permisos.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://consumo-api-34029-default-rtdb.firebaseio.com"
 
  });
  

const express = require('express'); 
const app = express();
const db = admin.firestore();

const cors = require('cors'); 
app.use(cors({orign:true}));



//Routers
app.get('/Hola-mundo', (req, res) => {
    return res.status(200).send('heloo word');

});

//Create
//post
app.post('/api/create', async (req, res) => {
    try {
        const { id, name, description, price } = req.body;
        if (!id || !name || !description || !price) {
            return res.status(400).send('Faltan campos obligatorios.');
        }

        await db.collection('products').doc(id.toString()).set({
            name: name,
            description: description,
            price: price
        });

        return res.status(201).send('Producto creado exitosamente.');
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error al crear el producto.');
    }
});

// Leer todos los productos
app.get('/api/products', async (req, res) => {
    try {
        const snapshot = await db.collection('products').get();
        const products = [];
        snapshot.forEach(doc => {
            products.push(doc.data());
        });
        return res.status(200).json(products);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error al obtener los productos.');
    }
});

// Actualizar un producto
app.put('/api/update/:id', async (req, res) => {
    try {
        const { name, description, price } = req.body;
        await db.collection('products').doc(req.params.id).update({
            name: name,
            description: description,
            price: price
        });
        return res.status(200).send('Producto actualizado correctamente.');
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error al actualizar el producto.');
    }
});

// Eliminar un producto
app.delete('/api/delete/:id', async (req, res) => {
    try {
        await db.collection('products').doc(req.params.id).delete();
        return res.status(200).send('Producto eliminado correctamente.');
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error al eliminar el producto.');
    }
});

//exporta la api desde la base de datos 

exports.app = functions.https.onRequest(app)


    


