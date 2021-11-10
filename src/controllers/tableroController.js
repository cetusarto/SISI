const { query } = require("express");

const controller = {};



controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        vInv = ""; vHis = ""; alto = "", medio = ""; bajo = ""

        queryT = "Select SUM(valor) as sum FROM Caja WHERE fechaSalida is null"
        conn.query(queryT, (err, rows) => {
            vInv = rows[0].sum
            if (!vInv) { vInv = 0 }
        });

        queryT = "Select SUM(valor) as sum FROM Caja WHERE NOT fechaSalida is null " +
            "AND fechaSalida>fechaVencimiento"
        conn.query(queryT, (err, rows) => {
            vHis = rows[0].sum
            if (!vHis) { vHis = 0 }
        });

        queryT = "Select count(*) As sum FROM Caja WHERE fechaSalida is null " +
            "AND (DATEDIFF(fechaVencimiento,CURDATE()))<=3"
        conn.query(queryT, (err, rows) => {
            alto = rows[0].sum
            if (!alto) { alto = 0 }
        });

        queryT = "Select count(*) As sum FROM Caja WHERE fechaSalida is null " +
            "AND (DATEDIFF(fechaVencimiento,CURDATE()))>3 " +
            "AND (DATEDIFF(fechaVencimiento,CURDATE()))<=7 "
        conn.query(queryT, (err, rows) => {
            medio = rows[0].sum
            if (!medio) { medio = 0 }
        });

        queryT = "Select count(*) As sum FROM Caja WHERE fechaSalida is null " +
            "AND (DATEDIFF(fechaVencimiento,CURDATE()))>7 " +
            "AND (DATEDIFF(fechaVencimiento,CURDATE()))<=15 "
        conn.query(queryT, (err, rows) => {
            bajo = rows[0].sum
            if (!bajo) { bajo = 0 }
            res.render('tablero', {
                alto: alto,
                medio: medio,
                bajo: bajo,
                vHis: vHis,
                vInv: vInv
            });
        });
    })

};

controller.listS = (req, res) => {
    const { tabla } = req.params;

    cols = [];
    if (tabla == "categoria") { cols = ['iDCategoria', 'nombreCategoria', 'dineroPerdido', 'cajas']; }
    if (tabla == "producto") { cols = ['iDProducto', 'nombreProducto', 'dineroPerdido', 'unidadesPerdidas', 'promedioDiasUtiles', 'cajas']; }
    if (tabla == "proveedor") { cols = ['iDProveedor', 'nombreProveedor', 'dineroPerdido', 'promedioDiasUtiles', 'cajas']; }

    const queryT =
        "SELECT Producto.nombreProducto, Categoria.iDCategoria, Categoria.nombreCategoria, Producto.iDProducto," +
        "Proveedor.iDProveedor, Proveedor.nombreProveedor, SUM(Caja.valor) as dineroPerdido, " +
        "SUM(Caja.cantidad) as unidadesPerdidas, " +
        "AVG(DATEDIFF(Caja.fechaVencimiento,Caja.fechaEntrada)) AS promedioDiasUtiles  FROM Caja " +
        "INNER JOIN Proveedor ON Caja.iDProveedor = Proveedor.iDProveedor " +
        "INNER JOIN Producto ON Caja.iDProducto = Producto.iDProducto " +
        "INNER JOIN Categoria ON Producto.iDCategoria= Categoria.iDCategoria " +
        "WHERE NOT Caja.fechaSalida is null " +
        "AND Caja.fechaSalida>=Caja.fechaVencimiento " +
        "GROUP BY " + tabla + "." + cols[0];

    req.getConnection((err, conn) => {
        conn.query(queryT, (err, rows) => {
            res.render('tablaDash',
                {
                    columns: cols,
                    data: rows,
                    tabla: tabla
                }
            )
        })
    })



};

controller.listR = (req, res) => {
    const { riesgo } = req.params
    var name = ""

    range = []
    if (riesgo == "bajo") {
        range = [7, 15];
        name = "cajas con riesgo bajo";
    }
    if (riesgo == "medio") {
        range = [3, 7];
        name = "cajas con riesgo medio";
    }
    if (riesgo == "alto") {
        range = [-15, 3];
        name = "cajas con riesgo alto";
    }



    cols = ['iDCaja', 'nombreProducto', 'nombreProveedor', 'diasUtiles'];
    const queryT =
        "SELECT Caja.iDCaja, Producto.nombreProducto, Proveedor.nombreProveedor,  DATEDIFF(Caja.fechaVencimiento,CURDATE()) AS diasUtiles " +
        "FROM Caja " +
        "INNER JOIN Proveedor ON Caja.iDProveedor = Proveedor.iDProveedor " +
        "INNER JOIN Producto ON Caja.iDProducto = Producto.iDProducto " +
        "WHERE Caja.fechaSalida is null " +
        "AND (DATEDIFF(fechaVencimiento,CURDATE()))> " + range[0] +
        " AND (DATEDIFF(fechaVencimiento,CURDATE()))<= " + range[1];

    req.getConnection((err, conn) => {
        conn.query(queryT, (err, data) => {
            res.render('tabla',
                {
                    tabla: name,
                    columns: cols,
                    data: data,
                    sel: false,
                    con: false,
                    his: true,
                    caja: false
                });
        });
    });
};

module.exports = controller;