const barcode = require('./barcode');

function setup(app, handlers) {

    app.get('/barras', function(request, response) {
     
        barcode.parseBarCode(request.query.codigo, function(err, data) {            
            response.json(data);
        });
    });
}

exports.setup = setup;