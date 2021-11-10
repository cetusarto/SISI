
const controller = {};


function loadTabla(res, name, cols, data, selection = false, contacto = false, historial = false, cajas=false) {
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
    const { id } = req.params;
    const name = "contacto";
    cols = ['tipoContacto', 'contacto'];

    const queryT =
        "SELECT iDContacto, tipoContacto, contacto FROM contacto " +
        "WHERE iDProveedor = " + id;

    req.getConnection((err, conn) => {
        var nombre = "";
        nombrar = function (a) { nombre = a; }
        conn.query("SELECT nombreProveedor from proveedor Where iDProveedor = " + id, (err, proveedor) => {
            nombrar(proveedor[0].nombreProveedor);
        });
        conn.query(queryT, (err, contactos) => {
            loadTabla(res, name, cols, contactos, false, [id, nombre]);
        });

    });
};

controller.add = (req, res) => {
    const { id } = req.params;

    req.getConnection((err, conn) => {
        conn.query("SELECT nombreProveedor from proveedor Where iDProveedor = " + id, (err, proveedor) => {
            res.render('contacto', {
                data: false,
                con: [id, proveedor[0].nombreProveedor]
            });
        });
    });

};

controller.create = (req, res) => {
    var data = req.body;
    req.getConnection((err, conn) => {
        conn.query('INSERT INTO contacto set ?', data, (err, categoria) => {
            res.redirect('/contacto/list/' + data.iDProveedor);
        })
    })
};

controller.edit = (req, res) => {
    const { id } = req.params;
    const queryT =
        "SELECT *,Proveedor.nombreProveedor FROM Contacto " +
        "INNER JOIN Proveedor On Contacto.iDProveedor = Proveedor.iDproveedor " +
        "Where Contacto.iDContacto = " + id;
    req.getConnection((err, conn) => {

        conn.query(queryT, (err, rows) => {
            res.render('contacto', {
                data: rows[0],
                con: [id, rows[0].nombreProveedor]
            })
        });
    });
};

controller.update = (req, res) => {
    const { id } = req.params;
    const newContacto = req.body;
    req.getConnection((err, conn) => {
        conn.query('UPDATE Contacto set ? where iDContacto = ?', [newContacto, id], (err, rows) => {
            res.redirect('/contacto/list/' + newContacto.iDProveedor);
        });
    });
};

controller.delete = (req, res) => {
    const { id } = req.params;
    const queryT =
        "SELECT Proveedor.iDProveedor FROM Contacto " +
        "INNER JOIN Proveedor On Contacto.iDProveedor = Proveedor.iDproveedor " +
        "Where Contacto.iDContacto = " + id;
    req.getConnection((err, conn) => {
        var idProv = "";
        llenar = function (a) { idProv = a };
        conn.query(queryT, (err, rows) => {
            llenar(rows[0].iDProveedor)
        });
        conn.query('DELETE from Contacto where iDContacto = ?', id, (err, rows) => {

            res.redirect('/contacto/list/'+idProv);
        });
    });
};





module.exports = controller;