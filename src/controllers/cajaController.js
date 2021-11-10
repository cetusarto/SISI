
const controller = {};


function loadTabla(res, name, cols, data, selection = false, contacto = false, historial = false, cajas = false) {
    res.render('tabla',
        {
            tabla: name,
            columns: cols,
            data: data,
            sel: selection,
            con: contacto,
            his: historial,
            caja: cajas
        });
}

controller.menu = (req, res) => {
    res.render('menu2');
};

controller.listI = (req, res) => {
    const name = "caja";
    cols = ['iDCaja', 'nombreProducto', 'nombreProveedor', 'diasUtiles'];
    const queryT =
        "SELECT Caja.iDCaja, Producto.nombreProducto, Proveedor.nombreProveedor,  DATEDIFF(Caja.fechaVencimiento,CURDATE()) AS diasUtiles " +
        "FROM Caja " +
        "INNER JOIN Proveedor ON Caja.iDProveedor = Proveedor.iDProveedor " +
        "INNER JOIN Producto ON Caja.iDProducto = Producto.iDProducto " +
        "WHERE Caja.fechaSalida is null ";
    console.log(queryT)
    req.getConnection((err, conn) => {
        conn.query(queryT, (err, cajas) => {
            loadTabla(res, name, cols, cajas)
        });
    });
};

controller.listH = (req, res) => {
    const name = "historial";
    cols = ['iDCaja', 'nombreProducto', 'nombreProveedor', 'fechaSalida', 'tipoSalida'];
    const queryT =
        "SELECT Caja.iDCaja, Producto.nombreProducto,  " +
        "Proveedor.nombreProveedor, DATE_FORMAT(Caja.fechaSalida, '%d-%m-%Y') AS fechaSalida, " +
        "CASE WHEN fechaSalida>fechaVencimiento THEN 'Vencida' " +
        "ELSE 'Vendida' END As tipoSalida " +
        "FROM Caja " +
        "INNER JOIN Proveedor ON Caja.iDProveedor = Proveedor.iDProveedor " +
        "INNER JOIN Producto ON Caja.iDProducto = Producto.iDProducto " +
        "WHERE NOT Caja.fechaSalida is null ";
    req.getConnection((err, conn) => {
        conn.query(queryT, (err, cajas) => {
            loadTabla(res, name, cols, cajas, false, false, true)
        });
    });
};


controller.add = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query("Select iDProveedor,nombreProveedor from Proveedor", (err, rows1) => {
            conn.query("Select iDProducto,nombreProducto from Producto", (err, rows2) => {
                res.render('caja', {
                    data: false,
                    proveedores: rows1,
                    productos: rows2,
                    extra: false

                })
            });
        });
    });
};

controller.create = (req, res) => {
    var data = req.body;

    if (data.fechaSalida == "") {
        data.fechaSalida = null;
    }
    req.getConnection((err, conn) => {
        conn.query('INSERT INTO Caja set ?', data, (err, categoria) => {
            res.redirect('/caja/inventario');
        })
    })
};

controller.edit = (req, res) => {
    const { id, extra } = req.params;
    var val = false;
    if (extra) {
        val = extra;
    }
    req.getConnection((err, conn) => {
        conn.query("Select iDProveedor,nombreProveedor from Proveedor", (err, rows1) => {
            conn.query("Select iDProducto,nombreProducto from Producto", (err, rows2) => {
                conn.query("Select * from Caja WHERE idCaja =" + id, (err, caja) => {
                    res.render('caja', {
                        data: caja[0],
                        proveedores: rows1,
                        productos: rows2,
                        extra: val
                    })
                });
            });
        });
    });
};

// Update categoria by id
controller.update = (req, res) => {
    const { id, extra } = req.params;
    direc = '/caja/inventario/';

    const newCaja = req.body;
    if (newCaja.fechaSalida == "") {
        newCaja.fechaSalida = null;
    }

    if (extra == "his") { direc = '/caja/historial/'; }
    if (extra == "proveedor") { direc = '/proveedor/cajas/' + newCaja.iDProveedor; }
    if (extra == "producto") { direc = '/producto/cajas/' + newCaja.iDProducto; }
    queryT = "";
    if (extra == "categoria") {
        queryT =
            "SELECT Categoria.iDCategoria from Categoria " +
            "INNER JOIN Producto ON Producto.iDCategoria = Categoria.iDCategoria " +
            "INNER JOIN Caja ON Caja.iDProducto = Producto.iDProducto " +
            "Where Caja.iDCaja = " + id;
    }
    req.getConnection((err, conn) => {

        conn.query('UPDATE Caja set ? where iDCaja = ?', [newCaja, id], (err, rows) => {

            conn.query(queryT, (err, rows) => {
                if (extra == "categoria") { direc = '/categoria/cajas/' + rows[0].iDCategoria; }
                res.redirect(direc);
            });
        });
    });
};

controller.delete = (req, res) => {
    const { id, extra } = req.params;
    direc = '/caja/inventario/';

    queryT =
        "SELECT Caja.iDProveedor, Caja.iDProducto,Categoria.iDCategoria from Categoria " +
        "INNER JOIN Producto ON Producto.iDCategoria = Categoria.iDCategoria " +
        "INNER JOIN Caja ON Caja.iDProducto = Producto.iDProducto " +
        "Where Caja.iDCaja = " + id;
    console.log(queryT)
    req.getConnection((err, conn) => {

        conn.query(queryT, (err, ids) => {
            conn.query('DELETE from Caja where iDCaja = ?', id, (err, rows) => {


                if (extra == "his") { direc = '/caja/historial/'; }
                if (extra == "proveedor") { direc = '/proveedor/cajas/' + ids[0].iDProveedor; }
                if (extra == "producto") { direc = '/producto/cajas/' + ids[0].iDProducto; }
                if (extra == "categoria") { direc = '/categoria/cajas/' + ids[0].iDCategoria; }

                res.redirect(direc);
            });
        });

    });
};

controller.sortI = (req, res) => {
    const { col, dir } = req.params;
    const name = "caja";
    cols = ['iDCaja', 'nombreProducto', 'nombreProveedor', 'diasUtiles'];
    var quer = ""

    if (col == 'nombreProveedor') { quer = "proveedor.nombreProveedor " + dir; }
    else if (col == 'nombreProducto') { quer = "producto.nombreProducto " + dir; }
    else if (col == 'diasUtiles') { quer = "diasUtiles " + dir; }
    else { quer = "caja.iDCaja " + dir; }

    const queryT =
        "SELECT Caja.iDCaja, Producto.nombreProducto,  " +
        "Proveedor.nombreProveedor, DATEDIFF(Caja.fechaVencimiento,CURDATE()) AS diasUtiles " +
        "FROM Caja " +
        "INNER JOIN Proveedor ON Caja.iDProveedor = Proveedor.iDProveedor " +
        "INNER JOIN Producto ON Caja.iDProducto = Producto.iDProducto " +
        "WHERE Caja.fechaSalida is null " +
        "ORDER BY " + quer;
    const selection = [col, dir]
    console.log(queryT)
    req.getConnection((err, conn) => {
        conn.query(queryT, (err, cajas) => {
            loadTabla(res, name, cols, cajas, selection);
        });
    });

};

controller.sortH = (req, res) => {
    const { col, dir } = req.params;

    quer = "";

    const name = "historial";
    cols = ['iDCaja', 'nombreProducto', 'nombreProveedor', 'fechaSalida', 'tipoSalida'];

    if (col == 'nombreProveedor') { quer = "proveedor.nombreProveedor " + dir; }
    else if (col == 'nombreProducto') { quer = "producto.nombreProducto " + dir; }
    else if (col == 'tipoSalida') { quer = "tipoSalida " + dir; }
    else { quer = "caja." + col + " " + dir; }

    const queryT =
        "SELECT Caja.iDCaja, Producto.nombreProducto,  " +
        "Proveedor.nombreProveedor, DATE_FORMAT(Caja.fechaSalida, '%d-%m-%Y') AS fechaSalida, " +
        "CASE WHEN fechaSalida>fechaVencimiento THEN 'Vencida' " +
        "ELSE 'Vendida' END As tipoSalida " +
        "FROM Caja " +
        "INNER JOIN Proveedor ON Caja.iDProveedor = Proveedor.iDProveedor " +
        "INNER JOIN Producto ON Caja.iDProducto = Producto.iDProducto " +
        "WHERE NOT Caja.fechaSalida is null " +
        "ORDER BY " + quer;


    const selection = [col, dir]

    req.getConnection((err, conn) => {
        conn.query(queryT, (err, cajas) => {
            loadTabla(res, name, cols, cajas, selection, false, true);
        });
    });

};





module.exports = controller;