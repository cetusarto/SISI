const { render } = require("ejs");
const { json, query } = require("express");

const controller = {};

controller.list = (req, res) => {
    res.render('menu');
};

controller.test = (req, res) => {


    const queryT =
        "SELECT * FROM Categoria " +
        "Limit 1";
    req.getConnection((err, conn) => {
        var idProv = "";
        llenar = function (a) { idProv = a };
        conn.query(queryT, (err, rows) => {
            llenar(rows[0].iDCategoria)
        });
        console.log(idProv)
    });


    res.redirect('/');
};



module.exports = controller;