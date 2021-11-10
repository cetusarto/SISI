# SISI
Sistema de Inventarios Super Increible



# Para instalacion y uso

## Requerimientos
- Servidor MySQL
- node.js instalado

## Pasos para instalación
- Clonar el repositorio a una dirección local
- Ejecutar el comando `npm install` en la localización del repositorio
- Abrir el cliente de MySQL para el servidor elegido de las siguientes posibles formas:
  - Ejecutar el comando con la información del servidor `mysql -u [usuario] -p [contraseña]`
  - Abrir el ejecutable MySQL Command Line Client e ingresar la contraseña
- En el repositorio en la dirección database/DBcm.sql, se encuentran las querys para la tabla diseñada para el sistema. Copiar todo el texto de este archivo, pegarlo y correrlo en el cliente de MySQL.
- Ejecutar el comando `npm start` en la localización del repositorio
- En el browser desado, ir a la dirección <http://localhost:3000> y se encontrará el sistema funcionando
