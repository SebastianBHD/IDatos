const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const PORT = 3000;

app.use(cors());

const conexion = mysql.createConnection({
    host: 'localhost',
    database: 'books',
    user: 'root',
    password: 'Valeseba07'
});

conexion.connect(function(error) {
    if (error) {
        console.error('Error de conexión: ', error);
        return;
    } 
    console.log('Conexión exitosa a la base de datos.');
});

app.get('/api/books', (req, res) => {
    conexion.query('SELECT * FROM bookstable1', function(error, results, fields) {
        if (error) {
            console.error('Error en la consulta: ', error);
            return res.status(500).json({ error: 'Error en la consulta' });
        }
        res.json(results);
    });
});

app.get('/api/books/search', (req, res) => {
    const searchTerm = req.query.search || '';
    const query = `SELECT * FROM tabla_final WHERE book_title LIKE ?`; 

    conexion.query(query, [`%${searchTerm}%`], function(error, results) {
        if (error) {
            console.error('Error en la consulta: ', error);
            return res.status(500).json({ error: 'Error en la consulta' });
        }
        res.json(results);
    });
});


app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
