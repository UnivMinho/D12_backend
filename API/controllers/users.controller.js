const app = require('../app.js');
const connect = require('../Config/connection.js');

function read(req,res) {
    connect.con.query('SELECT * from Users', (err, rows) => {
        if(err) throw err;
        console.log('The data from users table are: \n', rows);
        res.send(rows);
    });
}

function readById(req,res) {
    let userID = req.params.id;
    let mainQuery = 'SELECT * from Users where user_id = ?';
    connect.con.query(mainQuery, [userID], (err, rows) => {
        if(err) throw err;
        console.log('The user with the the id is: \n', rows);
        res.send(rows);
    });
}


function save(req, res) {
    //receber os dados do formuário que são enviados por post

    const password = req.sanitize('password').escape();
    const type = req.sanitize('type').escape();
    

    var query = "";

    var post = {
        password: password,
        type: type,
    };

    query = connect.con.query('INSERT INTO Users SET ?', post, function(err, rows, fields) {
        console.log(query.sql);
        if (!err) {
            res.status(200).location(rows.insertId).send({
                "msg": "inserted with success"
            });
            console.log("Number of records inserted: " + rows.affectedRows);
        }
        else {
            if (err.code == "ER_DUP_ENTRY") {
                res.status(409).send({ "msg": err.code });
                console.log('Error while performing Query.', err);
            }
            else res.status(400).send({ "msg": err.code });
        }
    });
}


function update(req, res) {
    //receber os dados do formuário que são enviados por post
    const password = req.sanitize('password').escape();
    const type = req.sanitize('type').escape();
    const user_id = req.sanitize('user_id').escape();
    console.log("without hahsh:" + req.body.pass);

    var query = "";
    var update = {
        password,
        type,
        user_id
    };
    query = connect.con.query('INSERT INTO Users SET password = ?, type = ?, where user_id = ?', update, function(err, rows,
        fields) {
        console.log(query.sql);
        if (!err) {
            console.log("Number of records updated: " + rows.affectedRows);
            res.status(200).send({ "msg": "update with success" });
        }
        else {
            res.status(400).send({ "msg": err.code });
            console.log('Error while performing Query.', err);
        }
    });
}


//função que apaga todos os dados de um iduser
function deleteID(req, res) {
    //criar e executar a query de leitura na BD
    const user_id = req.sanitize('request_id').escape();
    const post = {
        user_id: user_id
    };
    connect.con.query('DELETE from Users where user_id = ?', post, function(err, rows, fields) {
        if (!err) {
            //verifica os resultados se o número de linhas for 0 devolve dados não encontrados, caso contrário envia os resultados (rows).
            if (rows.length == 0) {
                res.status(404).send({
                    "msg": "data not found"
                });
            }
            else {
                res.status(200).send({
                    "msg": "success"
                });
            }
        }
        else
            console.log('Error while performing Query.', err);
    });
}


module.exports = {
        read: read,
        readById: readById,
        save: save,
        update: update,
        deleteID: deleteID
    };