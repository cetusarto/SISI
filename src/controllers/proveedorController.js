
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
controller.list = (req, res) => {
    const name = "proveedor";
    cols = ['iDProveedor', 'nombreProveedor', 'fechaInicio', 'tipoPersona'];

    const queryT =
        "SELECT iDProveedor, nombreProveedor, " +
        "DATE_FORMAT(fechaInicio, '%d-%m-%Y') AS fechaInicio ,(personaJuridica) AS tipoPersona  FROM Proveedor ";
    req.getConnection((err, conn) => {
        conn.query(queryT, (err, proveedores) => {
            for (var i = 0; i < proveedores.length; i++) {
                if (proveedores[i].tipoPersona == '1') {
                    proveedores[i].tipoPersona = "Persona Jurídica";
                } else {
                    proveedores[i].tipoPersona = "Persona Natural"
                }
            }
            loadTabla(res, name, cols, proveedores, false, false, false, true)
        });
    });
};

controller.add = (req, res) => {
    res.render('proveedor', {
        data: false,
        edit: false
    });
};

controller.create = (req, res) => {
    var data = req.body;
    req.getConnection((err, conn) => {
        conn.query('INSERT INTO Proveedor set ?', data, (err, categoria) => {
            res.redirect('/proveedor/');
        })
    })
};

controller.edit = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
        conn.query("SELECT * FROM Proveedor WHERE iDProveedor = ?", [id], (err, rows) => {
            res.render('proveedor', {
                data: rows[0],
                edit: true
            })
        });
    });
};

controller.update = (req, res) => {
    const { id } = req.params;
    const newProveedor = req.body;
    req.getConnection((err, conn) => {
        conn.query('UPDATE proveedor set ? where iDProveedor = ?', [newProveedor, id], (err, rows) => {
            res.redirect('/proveedor/');
        });
    });
};

controller.delete = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
        conn.query('DELETE from proveedor where iDProveedor = ?', id, (err, rows) => {
            res.redirect('/proveedor/');
        });
    });
};

controller.sort = (req, res) => {
    const { col, dir } = req.params;
    const name = "proveedor";
    var quer = col + " " + dir;
    cols = ['iDProveedor', 'nombreProveedor', 'fechaInicio', 'tipoPersona'];

    const selection = [col, dir]

    const queryT =
        "SELECT iDProveedor, nombreProveedor, DATE_FORMAT(fechaInicio, '%d-%m-%Y') AS fechaInicio," +
        " (personaJuridica) AS tipoPersona FROM Proveedor" +
        " ORDER BY " + quer;
    req.getConnection((err, conn) => {
        conn.query(queryT, (err, proveedores) => {
            for (var i = 0; i < proveedores.length; i++) {
                if (proveedores[i].tipoPersona == '1') {
                    proveedores[i].tipoPersona = "Persona Jurídica";
                } else {
                    proveedores[i].tipoPersona = "Persona Natural"
                }
            }
            loadTabla(res, name, cols, proveedores, selection, false, false, true);
        });
    });

};


controller.cajas = (req, res) => {
    const { id } = req.params;
    const name = "proveedor";
    cols = ['iDCaja', 'nombreProducto', 'valor', 'unidades', 'fechaEntrada', 'diasUtiles'];

    const queryT =
        "SELECT Producto.nombreProducto,  Caja.iDCaja, Caja.valor, Caja.cantidad As unidades, DATE_FORMAT(Caja.fechaEntrada, '%d-%m-%Y') AS fechaEntrada, " +
        "DATEDIFF(Caja.fechaVencimiento,CURDATE()) AS diasUtiles FROM Caja " +
        "INNER JOIN Proveedor ON Caja.iDProveedor = Proveedor.iDProveedor " +
        "INNER JOIN Producto ON Caja.iDProducto = Producto.iDProducto " +
        "WHERE Caja.fechaSalida is null " +
        "AND Proveedor.iDProveedor = " + id;

    req.getConnection((err, conn) => {
        filtro = "";
        conn.query('SELECT nombreProveedor FROM Proveedor WHERE iDproveedor = ' + id, (err, proveedores) => {
            filtro = proveedores[0].nombreProveedor;
            conn.query(queryT, (err, categorias) => {
                res.render('tablaFiltrada', {
                    tabla: name,
                    columns: cols,
                    data: categorias,
                    filtro: filtro
                });
            });
        });
    });
};





module.exports = controller;