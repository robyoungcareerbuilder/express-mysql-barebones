const express = require('express');
const bodyParser = require('body-parser');
const app = express();
var mysql = require('mysql');

var con=mysql.createConnection({
    host: "localhost",
    database: "nodejs",
    user: "robsdb",
    password: ""
})

con.connect((err) => {
    if (err) throw err;
    console.log("MySQL Connected!");
})

app.use(bodyParser.urlencoded({extended:true}));
app.listen(3000,() => {
    console.log('listening on 3000');
});

//ROUTES
// app.get(path, callback)
// DISPLAY FORM
app.get('/', (req,res) => {
        res.sendFile(__dirname + '/index.html');
});

// CREATE
app.post('/put', (req,res) => {
    var sql = "INSERT INTO quotes (name, quote) VALUES (?, ?)";
    con.query(sql, [req.body.name, req.body.quote], (err, result) => {
        if (err) throw err;
        con.query('SELECT LAST_INSERT_ID() as id', (err,result) => {
            res.send([{status:"success"},result[0]]);
        })
    });    
});

// READ ALL
app.get('/get', (req,res) => {
    con.query("SELECT * FROM quotes", (err, result, fields) => {
        if (err) throw err;
        res.send(result);
    });
});

// READ ONE
app.get('/get/:id', (req,res) => {
    let sql="SELECT * FROM quotes WHERE id=?";
    con.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// UPDATE
app.post('/update/:id', (req,res) => {
    var sql = "UPDATE quotes SET name=?, quote=? WHERE id=?";
    console.log(sql, [req.body.name, req.body.quote, req.params.id]);
    con.query(sql, [req.body.name, req.body.quote, req.params.id], (err, result) => {
        if (err) throw err;
        res.send({status:"success"});
    });        
})

// DELETE
app.get('/delete/:id', (req,res) => {
    var sql = "DELETE FROM quotes WHERE id=?";
    con.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.send({status:"success"});
    });        
})


