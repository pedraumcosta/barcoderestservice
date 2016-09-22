var should = require('should'); 
var assert = require('assert');
var request = require('supertest');  
var winston = require('winston');

describe('Rest Module for barcode module', function() {
  var url = 'http://localhost:3000';

  before(function(done) {
      //Nao é preciso fazer nada para preparar os testes
      //desde que o servidor esteja rodando na URL acima
      done();
  });

  
  it ('parse a valid concessionaria with format', function (done) {
        request(url)
            .get('/barras/?codigo=85870000006-5 70100328162-3 64010716258-7 02666500267-3')
            .send()
            // end handles the response
            .end(function(err, res) {
                if (err) {
                    throw err;
                }
                // this is should.js syntax, very clear
                res.status.should.be.equal(200);
                var body = res.body;
                body.mensagem.should.be.equal("Barcode eh um documento de concessionaria");
                body.status.should.be.equal('OK');
                body.codigoBarras.should.be.equal('85870000006701003281626401071625802666500267');
                assert.equal(body.dataVencimento, null);
                body.valorDocumento.should.be.equal(670.10);
                done();
            });
    });

    it ('parse a valid concessionaria without format', function (done) {
        request(url)
            .get('/barras/?codigo=817100000006000005212014608160116430695945600002')
            .send()
            // end handles the response
            .end(function(err, res) {
                if (err) {
                    throw err;
                }
                // this is should.js syntax, very clear
                res.status.should.be.equal(200);
                var body = res.body;
                body.mensagem.should.be.equal("Barcode eh um documento de concessionaria");
                body.status.should.be.equal('OK');
                body.codigoBarras.should.be.equal('81710000000000005212016081601164369594560000');
                body.dataVencimento.should.be.equal('20160816');
                body.valorDocumento.should.be.equal(0);
                done();
            });
    });


    it ('receive a valid boleto with format', function (done) {
        request(url)
            .get('/barras/?codigo=23790.44809 56168.623793 36011.058009 7 40430000124020')
            .send()
            // end handles the response
            .end(function(err, res) {
                if (err) {
                    throw err;
                }
                // this is should.js syntax, very clear
                res.status.should.be.equal(200);
                var body = res.body;
                body.mensagem.should.be.equal("Barcode eh um documento boleto");
                body.status.should.be.equal('OK');
                body.codigoBarras.should.be.equal('23797404300001240200448056168623793601105800');
                body.dataVencimento.should.be.equal('20081101');
                body.valorDocumento.should.be.equal(1240.20);
                done();
            });
    });

    it ('parse a valid boleto without format', function (done) {
        request(url)
            .get('/barras/?codigo=23792946029136237025542000479008169080000020000')
            .send()
            // end handles the response
            .end(function(err, res) {
                if (err) {
                    throw err;
                }
                // this is should.js syntax, very clear
                res.status.should.be.equal(200);
                var body = res.body;
                body.mensagem.should.be.equal("Barcode eh um documento boleto");
                body.status.should.be.equal('OK');
                body.codigoBarras.should.be.equal('23791690800000200002946091362370254200047900');
                body.dataVencimento.should.be.equal('20160905');
                body.valorDocumento.should.be.equal(200);
                done();
            });
    });

});