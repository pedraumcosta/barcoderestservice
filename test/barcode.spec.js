const assert  = require('assert')
const expect  = require('chai').expect;

const barcode = require('../barcode');

describe('The barcode module', function() {
    it ('receive an empty value', function (done) {
        barcode.parseBarCode('', function(err, data) {
            if (err) { 
                assert.equal(err, 'Barcode Inválido');
                done();
            } else  {
                done("Teste falhou");
            }
        });
    });
    
    it ('receive an incomplete barcode', function (done) {
        barcode.parseBarCode('4444', function(err, data) {
            if (err) { 
                assert.equal(err, 'Barcode Inválido');
                done();
            } else  {
                done("Teste falhou");
            }
        });
    });

    it ('receive a barcode with letters', function (done) {
        barcode.parseBarCode('KJHKJHDISUBKJH', function(err, data) {
            if (err) { 
                assert.equal(err, 'Barcode Inválido');
                done();
            } else  {
                done("Teste falhou");
            }
        });
    });

    it ('receive an invalid barcode', function (done) {
        barcode.parseBarCode('01234567890123456789012345678901234567894444', function(err, data) {
            if (err) { 
                assert.equal(err, 'Barcode Inválido');
                done();
            } else  {
                done("Teste falhou");
            }
        });
    });

    it('expands a 44 barcode to a 47 one', function() {
        var result = barcode.expandBarCode("23797404300001240200448056168623793601105800");
        assert.equal(result, '23790.44809 56168.623793 36011.058009 7 40430000124020');
    });

    it('expands a 44 barcode to a 48 one', function() {
        var result = barcode.expandBarCode("84670000001435900240200240500024384221010811");
        assert.equal(result, '84670000001-7 43590024020-9 02405000243-5 84221010811-9');
    });

    it('identify a 44 barcode which can be transformed in a 47 barcode', function() {
        var result = barcode.identifyBarCode("23797404300001240200448056168623793601105800");
        assert.equal(result, 47);
    });

    it('expands a 44 barcode which can be transformed in a 48 barcode', function() {
        var result = barcode.identifyBarCode("84670000001435900240200240500024384221010811");
        assert.equal(result, 48);
    });

    it('validate a 48 barcode barcode', function() {
        var result = barcode.validateBarCode48("846700000017435900240209024050002435842210108119");
        assert.equal(result, true);
    });

    it('validate a 47 barcode barcode', function() {
        var result = barcode.validateBarCode47("23790448095616862379336011058009740430000124020");
        assert.equal(result, true);
    });

    it('validate a 48 barcode barcode', function() {
        var result = barcode.validateBarCode48("8587 0000 0065 7010 0328 1623 6401 0716 2587 0266 6500 2673");
        assert.equal(result, true);
    });

    it ('parse a valid concessionaria with format', function (done) {
        barcode.parseBarCode('85870000006-5 70100328162-3 64010716258-7 02666500267-3', function(err, data) {
            if (err) { 
                done(err);
            } else  {

                assert.equal(data.status, 'OK');
                assert.equal(data.mensagem, "Barcode eh um documento de concessionaria");
                assert.equal(data.codigoBarras, '85870000006701003281626401071625802666500267');
                assert.equal(data.dataVencimento, null);
                assert.equal(data.valorDocumento, 670.10);
                done();
            }
        });
    });

    it ('parse a valid concessionaria with format', function (done) {
        barcode.parseBarCode('846700000017435900240209024050002435842210108119', function(err, data) {
            if (err) { 
                done(err);
            } else  {

                assert.equal(data.status, 'OK');
                assert.equal(data.mensagem, "Barcode eh um documento de concessionaria");
                assert.equal(data.codigoBarras, '84670000001435900240200240500024384221010811');
                assert.equal(data.dataVencimento, null);
                assert.equal(data.valorDocumento, 143.59);
                done();
            }
        });
    });

    it ('parse a valid concessionaria with format', function (done) {
        barcode.parseBarCode('836000000015 707501380059 909033921117 080353171749', function(err, data) {
            if (err) { 
                done(err);
            } else  {

                assert.equal(data.status, 'OK');
                assert.equal(data.mensagem, "Barcode eh um documento de concessionaria");
                assert.equal(data.codigoBarras, '83600000001707501380059090339211108035317174');
                assert.equal(data.dataVencimento, '00590903');
                assert.equal(data.valorDocumento, 170.75);
                done();
            }
        });
    });

    it ('parse a valid concessionaria with format', function (done) {
        barcode.parseBarCode('817100000006 000005212014 608160116430 695945600002', function(err, data) {
            if (err) { 
                done(err);
            } else  {

                assert.equal(data.status, 'OK');
                assert.equal(data.mensagem, "Barcode eh um documento de concessionaria");
                assert.equal(data.codigoBarras, '81710000000000005212016081601164369594560000');
                assert.equal(data.dataVencimento, '20160816');
                assert.equal(data.valorDocumento, 0);
                done();
            }
        });
    });

    
    it ('receive a valid boleto with format', function (done) {
        barcode.parseBarCode('23790.44809 56168.623793 36011.058009 7 40430000124020', function(err, data) {
            if (err) { 
                done(err);
            } else  {

                assert.equal(data.status, 'OK');
                assert.equal(data.mensagem, "Barcode eh um documento boleto");
                assert.equal(data.codigoBarras, '23797404300001240200448056168623793601105800');
                assert.equal(data.dataVencimento, '20081101');
                assert.equal(data.valorDocumento, 1240.20);
                done();
            }
        });
    });

    it ('receive a valid boleto without format', function (done) {
        barcode.parseBarCode('23792946029136237025542000479008169080000020000', function(err, data) {
            if (err) { 
                done(err);
            } else  {

                assert.equal(data.status, 'OK');
                assert.equal(data.mensagem, "Barcode eh um documento boleto");
                assert.equal(data.codigoBarras, '23791690800000200002946091362370254200047900');
                assert.equal(data.dataVencimento, '20160905');
                assert.equal(data.valorDocumento, 200);
                done();
            }
        });
    });

    it ('receive a valid boleto with format', function (done) {
        barcode.parseBarCode('75691 44871 01000 129500 02427 380007 5 68740000095460', function(err, data) {
            if (err) { 
                done(err);
            } else  {

                assert.equal(data.status, 'OK');
                assert.equal(data.mensagem, "Barcode eh um documento boleto");
                assert.equal(data.codigoBarras, '75695687400000954601448701000129500242738000');
                assert.equal(data.dataVencimento, '20160802');
                assert.equal(data.valorDocumento, 954.6);
                done();
            }
        });
    });


    it ('receive a valid boleto with format', function (done) {
        barcode.parseBarCode('34191.57221 25541.503030 30221.400002 5 68770000080400', function(err, data) {
            if (err) { 
                done(err);
            } else  {

                assert.equal(data.status, 'OK');
                assert.equal(data.mensagem, "Barcode eh um documento boleto");
                assert.equal(data.codigoBarras, '34195687700000804001572225541503033022140000');
                assert.equal(data.dataVencimento, '20160805');
                assert.equal(data.valorDocumento, 804);
                done();
            }
        });
    });
});
