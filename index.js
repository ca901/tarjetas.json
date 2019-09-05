var contentful = require('contentful')
const fse = require('fs-extra')

var client = contentful.createClient({
    space: '9cds0lha1plv',
    accessToken: '7d2b95ab7da57baf4f3a4f555b0cb2cf4e5b9d1c8e0721b49dbbb154bac8a771'
})

function printToConsole(data) {
  console.log(JSON.stringify(data, null, 2))
}

function createFile(data) {
  fs.writeFile('tarjetas.json', JSON.stringify(data, null, 4));
}

function failureCallback(error) {
  console.log("Error generating file: " + error);
}


client.getEntries({
  'content_type': 'producto',
  include: 4
})
.then(function (entries) {
  const PRODUCTOS = { tarjetas: [] }
  entries.items
    .filter(e => e.fields.pais.fields.title === "Costa Rica")
    .map(p =>
      p.fields.variacion.map(variacion =>
        PRODUCTOS.tarjetas.push({
          nombre: variacion.fields.titulo,
          emisor: variacion.fields.emisor.fields.nombre,
          color: variacion.fields.color.fields.titulo,
        })
      )
    );
  // printToConsole(PRODUCTOS)
  fse.outputFile('dist/tarjetas.json', JSON.stringify(PRODUCTOS, null, 4), (err, result) => { if(err) console.log('error', err)});
})
.catch(failureCallback);