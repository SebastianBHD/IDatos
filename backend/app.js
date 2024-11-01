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
    const query = 'SELECT * FROM tabla_final_rating ORDER BY promedio_rating DESC LIMIT 300';
    
    conexion.query(query, function(error, results, fields) {
        if (error) {
            console.error('Error en la consulta: ', error);
            return res.status(500).json({ error: 'Error en la consulta' });
        }
        res.json(results);
    });
});

app.get('/api/books/search', (req, res) => {
    const searchTerm = req.query.search || '';
    const query = `SELECT * FROM tabla_final_rating WHERE book_title LIKE ?`; 

    conexion.query(query, [`%${searchTerm}%`], function(error, results) {
        if (error) {
            console.error('Error en la consulta: ', error);
            return res.status(500).json({ error: 'Error en la consulta' });
        }
        res.json(results);
        console.log(results);
    });
});

app.get('/api/books/filter', (req, res) => {
    const authorTerm = req.query.author || '';
    const dateSinceTerm = req.query.dateSince || null;
    const dateToTerm = req.query.dateTo || null;
    const ratingFromTerm = req.query.ratingFrom || -1;
    const ratingToTerm = req.query.ratingTo || 11;

    let query = `SELECT * FROM tabla_final_rating WHERE 1=1`;
    let queryParams = [];

    if (authorTerm != '') {
        query += ` AND book_author LIKE ?`;
        queryParams.push(`%${authorTerm}%`);
    }

    if (dateSinceTerm != null) {
        query += ` AND year_of_publication >= ?`;
        queryParams.push(dateSinceTerm);
    }

    if (dateToTerm != null) {
        query += ` AND year_of_publication <= ?`;
        queryParams.push(dateToTerm);
    }

    if (ratingFromTerm) {
        query += ` AND promedio_rating >= ?`;
        queryParams.push(ratingFromTerm);
    }

    if (ratingToTerm) {
        query += ` AND promedio_rating <= ?`;
        queryParams.push(ratingToTerm);
    }

    query += ` LIMIT 200`;

    conexion.query(query, queryParams, function(error, results) {
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
