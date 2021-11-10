CREATE DATABASE Surtimax;

use Surtimax;


  CREATE TABLE `Categoria` (
  `iDCategoria` INT(10) NOT NULL AUTO_INCREMENT,
  `nombreCategoria` VARCHAR(30),
  `descripcionCategoria` TINYTEXT,
  PRIMARY KEY (`iDCategoria`)
  );

  CREATE TABLE `Producto` (
  `iDProducto` INT AUTO_INCREMENT,
  `nombreProducto` VARCHAR(30),
  `descripcionProducto` TINYTEXT,
  `iDCategoria` INT(10),
    PRIMARY KEY `Clave` (`iDProducto`),
    FOREIGN KEY (`iDCategoria`) REFERENCES Categoria(`iDCategoria`)
);


CREATE TABLE `Proveedor` (
  `iDProveedor` INT AUTO_INCREMENT,
  `nombreProveedor` VARCHAR(30),
  `descripcionProveedor` TINYTEXT,
  `fechaInicio` DATE,
  `personaJuridica` BOOLEAN,
  PRIMARY KEY `Clave` (`iDProveedor`)
);

CREATE TABLE `contacto` (
  `iDContacto` INT AUTO_INCREMENT,
  `tipoContacto` VARCHAR(15),
  `contacto` TINYTEXT,
  `iDProveedor` INT,
  PRIMARY KEY `Clave` (`iDContacto`),
  FOREIGN KEY (`iDProveedor`) REFERENCES Proveedor(`iDProveedor`)
);

CREATE TABLE `Caja` (
  `iDCaja` INT AUTO_INCREMENT, 
  `iDProducto`INT,
  `iDProveedor` INT,
  `fechaEntrada` DATE,
  `fechaVencimiento` DATE,
  `fechaSalida` DATE,
  `comentario` TINYTEXT,
  `valor` INT,
  `cantidad` INT,
  PRIMARY KEY `Clave` (`iDCaja`),
  FOREIGN KEY (`iDProducto`) REFERENCES Producto(`iDProducto`),
  FOREIGN KEY (`iDProveedor`) REFERENCES Proveedor(`iDProveedor`)
);





