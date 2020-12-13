const app = require('../app.js');
const connect = require('../Config/connection.js');

function read(req,res) {
    connect.con.query('SELECT * from Operation_Managers', (err, rows) => {
        if(err) throw err;
        console.log('The data from Operation Managers table are: \n', rows);
        res.send(rows);
    });
}

function readById(req,res) {
    let manager_id = req.params.id;
    let mainQuery = 'SELECT * from Operation_Managers where manager_id = ?';
    connect.con.query(mainQuery, [manager_id], (err, rows) => {
        if(err) throw err;
        console.log('The operation manager with the the id is: \n', rows);
        res.send(rows);
    });
}


//função de gravação que recebe os 7 parâmetros   manager_id // birth_date // rating // phone_number // email // distance_from_scene // availability
function save(req, res) {
    //receber os dados do formuário que são enviados por post
    const birth_date = req.sanitize('birth_date').escape();
    const rating = req.sanitize('rating').escape();
    const phone_number = req.sanitize('phone_number').escape();
    const email = req.sanitize('email').escape();
    const distance_from_scene = req.sanitize('distance_from_scene').escape();
    const availability = req.sanitize('availability').escape();
   
    var query = "";
    var post = {
        birth_date: birth_date,
        rating: rating,
        phone_number: phone_number,
        email: email,
        distance_from_scene: distance_from_scene,
        availability: availability,
    };
    query = connect.con.query('INSERT INTO Operation_Managers SET ?', post, function(err, rows, fields) {
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

//efetuar updade de todos os dados para um determinado manager_id
function update(req, res) {
    //receber os dados do formuário que são enviados por post
    const manager_id = req.sanitize('manager_id').escape();
    const birth_date = req.sanitize('birth_date').escape();
    const rating = req.sanitize('rating').escape();
    const phone_number = req.sanitize('phone_number').escape();
    const email = req.sanitize('email').escape();
    const distance_from_scene = req.sanitize('distance_from_scene').escape();
    const availability = req.sanitize('availability').escape();
    console.log("without hahsh:" + req.body.pass);
    var query = "";
    var update = {
        manager_id,
        birth_date,
        rating,
        phone_number,
        email,
        distance_from_scene,
        availability,
    };
    query = connect.con.query('INSERT INTO Operation_managers SET manager_id = ?, birth_date =?, rating=?, phone_number =?, email =?, distance_from_scene =?, availability =?, where manager_id=?', update, function(err, rows,
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


//função que apaga todos os dados de um manager_id
function deleteID(req, res) {
    //criar e executar a query de leitura na BD
    const manager_id = req.sanitize('manager_id').escape();
    const post = {
        manager_id: manager_id,
    };
    connect.con.query('DELETE from Operation_managers where manager_id = ?', post, function(err, rows, fields) {
        if (!err) {
            //verifica os resultados se o número de linhas for 0 devolve dados não encontrados, caso contrário envia os resultados(rows).
            if(rows.length == 0) {
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