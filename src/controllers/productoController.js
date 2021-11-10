
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
    const name = "producto";
    cols = ['iDProducto', 'nombreProducto', 'categoria'];

    const queryT =
        "SELECT Producto.iDProducto, Producto.nombreProducto,  " +
        "Categoria.nombreCategoria AS categoria " +
        "FROM Producto " +
        "INNER JOIN Categoria ON Producto.idCategoria = Categoria.idCategoria;";

    req.getConnection((err, conn) => {
        conn.query(queryT, (err, productos) => {
            loadTabla(res, name, cols, productos, false, false, false, true)
        });
    });
};

controller.add = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query("Select iDCategoria,nombreCategoria from Categoria", (err, rows) => {
            res.render('producto', {
                data: false,
                categorias: rows
            })
        });
    });
};

controller.create = (req, res) => {
    var data = req.body;
    req.getConnection((err, conn) => {
        conn.query('INSERT INTO Producto set ?', data, (err, categoria) => {
            res.redirect('/producto/');
        })
    })
};

controller.edit = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
        var queried = []
        conn.query("SELECT * FROM Producto WHERE iDProducto = " + id, (err, rows) => {
            queried = rows[0];
        });
        conn.query("Select iDCategoria,nombreCategoria from Categoria", (err, rows) => {
            res.render('producto', {
                data: queried,
                categorias: rows
            })
        });
    });
};

// Update categoria by id
controller.update = (req, res) => {
    const { id } = req.params;
    const newContacto = req.body;
    req.getConnection((err, conn) => {
        conn.query('UPDATE Producto set ? where iDProducto = ?', [newContacto, id], (err, rows) => {
            res.redirect('/producto/');
        });
    });
};

controller.delete = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
        conn.query('DELETE from Producto where iDProducto = ?', id, (err, rows) => {
            res.redirect('/producto/');
        });
    });
};

controller.sort = (req, res) => {
    const { col, dir } = req.params;
    const name = "producto";
    var quer = ""

    if (col != 'categoria') {
        quer = name + "." + col + " " + dir;
    }
    else {
        quer = "categoria.nombreCategoria" + " " + dir;
    }

    cols = ['iDProducto', 'nombreProducto', 'categoria'];
    const selection = [col, dir]

    const queryT =
        "SELECT Producto.iDProducto, Producto.nombreProducto,  " +
        "Categoria.nombreCategoria AS categoria " +
        "FROM Producto " +
        "INNER JOIN Categoria ON Producto.idCategoria = Categoria.idCategoria" +
        " ORDER BY " + quer;
    req.getConnection((err, conn) => {
        conn.query(queryT, (err, productos) => {
            loadTabla(res, name, cols, productos, selection, false, false, true);
        });
    });

};

controller.cajas = (req, res) => {
    const { id } = req.params;
    const name = "producto";
    cols = ['iDCaja', 'nombreProveedor', 'valor','unidades','fechaEntrada', 'diasUtiles'];
  
    const queryT =
      "SELECT Caja.iDCaja, Caja.valor, Caja.cantidad As unidades, DATE_FORMAT(Caja.fechaEntrada, '%d-%m-%Y') AS fechaEntrada, " +
      "Proveedor.nombreProveedor, DATEDIFF(Caja.fechaVencimiento,CURDATE()) AS diasUtiles FROM Caja " +
      "INNER JOIN Proveedor ON Caja.iDProveedor = Proveedor.iDProveedor " +
      "INNER JOIN Producto ON Caja.iDProducto = Producto.iDProducto " +
      "WHERE Caja.fechaSalida is null " +
      "AND Producto.iDProducto = " + id;
    
    req.getConnection((err, conn) => {
      filtro = "";
      conn.query('SELECT nombreProducto FROM Producto WHERE iDProducto = ' + id, (err, productos) => {
        filtro = productos[0].nombreProducto;
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