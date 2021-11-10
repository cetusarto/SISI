const { render } = require("ejs");
const { json } = require("express");

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

//List categorias
controller.list = (req, res) => {
  const name = "categoria";
  cols = ['iDCategoria', 'nombreCategoria', 'descripcionCategoria'];

  req.getConnection((err, conn) => {
    conn.query('SELECT * from Categoria', (err, categorias) => {
      loadTabla(res, name, cols, categorias, false, false, false, true);
    });
  });
};

// Open add menu
controller.add = (req, res) => {
  res.render('categoria', {
    data: false
  });
};

// Open add categoria
controller.create = (req, res) => {
  const data = req.body;
  req.getConnection((err, conn) => {
    conn.query('INSERT INTO Categoria set ?', data, (err, categoria) => {
      res.redirect('/categoria/');
    })
  })
};

// Open edit categoria
controller.edit = (req, res) => {
  const { id } = req.params;
  req.getConnection((err, conn) => {
    conn.query("SELECT * FROM Categoria WHERE iDCategoria = ?", [id], (err, rows) => {
      res.render('categoria', {
        data: rows[0]
      })
    });
  });
};


// Update categoria by id
controller.update = (req, res) => {
  const { id } = req.params;
  const newCategoria = req.body;
  req.getConnection((err, conn) => {
    conn.query('UPDATE categoria set ? where iDCategoria = ?', [newCategoria, id], (err, rows) => {
      res.redirect('/categoria/');
    });
  });
};

// Delete categoria by id
controller.delete = (req, res) => {
  const { id } = req.params;
  req.getConnection((err, conn) => {
    conn.query('DELETE from Categoria where iDCategoria = ?', id, (err, rows) => {
      res.redirect('/categoria/');
    });
  });
};


controller.sort = (req, res) => {
  const { col, dir } = req.params;
  const name = "categoria";
  const quer = col + " " + dir;
  cols = ['iDCategoria', 'nombreCategoria', 'descripcionCategoria'];
  const selection = [col, dir]

  req.getConnection((err, conn) => {
    conn.query('SELECT * from Categoria ORDER BY ' + quer, (err, categorias) => {
      loadTabla(res, name, cols, categorias, selection, false, false, true);
    });
  });

};

controller.cajas = (req, res) => {
  const { id } = req.params;
  const name = "categoria";
  cols = ['iDCaja', 'nombreProducto', 'nombreProveedor', 'diasUtiles'];

  const queryT =
    "SELECT Producto.nombreProducto,  Caja.iDCaja, " +
    "Proveedor.nombreProveedor, DATEDIFF(Caja.fechaVencimiento,CURDATE()) AS diasUtiles FROM Caja " +
    "INNER JOIN Proveedor ON Caja.iDProveedor = Proveedor.iDProveedor " +
    "INNER JOIN Producto ON Caja.iDProducto = Producto.iDProducto " +
    "INNER JOIN Categoria ON Producto.iDCategoria= Categoria.iDCategoria " +
    "WHERE Caja.fechaSalida is null " +
    "AND Categoria.iDcategoria = " + id;

  req.getConnection((err, conn) => {
    filtro = "";
    conn.query('SELECT nombreCategoria FROM Categoria WHERE iDCategoria = ' + id, (err, categorias) => {
      filtro = categorias[0].nombreCategoria;
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