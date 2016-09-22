var moment = require('moment');

/*
 * A função recebe um codigo de 44 digitos e expande em um de 47 (formato digitavel)
 */
function expandBarCodeTo47(barcode) {

    var campo1 = barcode.substring(0,4) + barcode.substring(19,20) + '.' + barcode.substring(20,24);
    //console.log('Campo 1: ' + campo1);
    var campo2 = barcode.substring(24,29) + '.' + barcode.substring(29,34);
    //console.log('Campo 2: ' + campo2);
    var campo3 = barcode.substring(34,39) + '.' + barcode.substring(39,44);
    //console.log('Campo 3: ' + campo3);
    var campo4 = barcode.substring(4,5); // Digito verificador
    //console.log('Campo 4: ' + campo4);
    var campo5 = barcode.substring(5,19); // Vencimento + Valor
    //console.log('Campo 5: ' + campo5); 

    return campo1 + modulo10(campo1) + ' ' +
           campo2 + modulo10(campo2) + ' ' +
           campo3 + modulo10(campo3) + ' ' + 
           campo4 + ' ' + campo5;
}

/*
 * A função recebe um codigo de 44 digitos e expande em um de 48 (formato digitavel)
 */
function expandBarCodeTo48(barcode) {

    var campo1 = barcode.substring(0,11);
    //console.log('Campo 1: ' + campo1);
    var campo2 = barcode.substring(11,22);
    //console.log('Campo 2: ' + campo2);
    var campo3 = barcode.substring(22,33);
    //console.log('Campo 3: ' + campo3);
    var campo4 = barcode.substring(33,44);
    //console.log('Campo 4: ' + campo4);

    var dv = barcode.substring(3,4);
    //console.log('DV: ' + campo4);

    return campo1 + '-' + modulo10(campo1) + ' ' +
           campo2 + '-' + modulo10(campo2) + ' ' +
           campo3 + '-' + modulo10(campo3) + ' ' + 
           campo4 + '-' + modulo10(campo4);
}

/*
 * A função recebe um codigo de 48 digitos e gera os 44 digitos correspondentes
 */
function decode48To44(barcode) {
   	barcode = barcode.replace(/\D/g,"");

    var campo1 = barcode.substring(0,11);
    //console.log('Campo 1: ' + campo1);
    var campo2 = barcode.substring(12,23);
    //console.log('Campo 2: ' + campo2);
    var campo3 = barcode.substring(24,35);
    //console.log('Campo 3: ' + campo3);
    var campo4 = barcode.substring(36,47);
    //console.log('Campo 4: ' + campo4);

    return campo1 + campo2 + campo3 + campo4;
}

/*
 * A função recebe um codigo de 47 digitos e gera os 44 digitos correspondentes
 */
function decode47To44(barcode) {
  	barcode = barcode.replace(/\D/g,"");

    var campo1 = barcode.substring(0,4);
    //console.log('Campo 1: ' + campo1);
    var campo2 = barcode.substring(4,9) ;
    //console.log('Campo 2: ' + campo2);
    var campo3 = barcode.substring(10,20);
    //console.log('Campo 3: ' + campo3);
    var campo4 = barcode.substring(21,31);
    //console.log('Campo 4: ' + campo4);
    var campo5 = barcode.substring(33,47); // Vencimento + Valor
    //console.log('Campo 5: ' + campo5);
    var dv = barcode.substring(32,33);

    return campo1 + dv + campo5 + campo2 + campo3 + campo4;
}

/*
 * Calcula o modulo 10 de uma cadeia de caracteres representando um numero
 */
function modulo10(number) {
   	number = number.replace(/\D/g,"");
    //console.log('Vou calcular o modulo 10 de: ' + number);
    var soma  = 0;
    var peso  = 2;
    var contador = number.length - 1;
    
    while (contador >= 0) {
        var multiplicacao = ( number.substring(contador,contador+1) ) * peso;
        if (multiplicacao >= 10) {
            multiplicacao = 1 + (multiplicacao-10);
        }
        soma = soma + multiplicacao;
        if (peso == 2) {
            peso = 1;
        } else {
            peso = 2;
        }
        contador = contador - 1;
    }
    var digito = 10 - (soma % 10);
    if (digito == 10)
        digito = 0;

    return digito;
}

/*
 * Calcula o modulo 11 de uma cadeia de caracteres representando um numero
 */
function modulo11(number) {
    number = number.replace(/\D/g,"");
    //console.log('Vou calcular o modulo 11 de: ' + number);
    var soma  = 0;
    var peso  = 2;
    var base  = 9;
    var contador = number.length - 1;
    for (var i = contador; i >= 0; i--) {
        soma = soma + ( (number.substring(i,i+1)) * peso);
        if (peso < base) {
            peso++;
        } else {
            peso = 2;
        }
    }
    var digito = 11 - (soma % 11);
    if (digito >  9) 
        digito = 0;
    /* Utilizar o dígito 1(um) sempre que o resultado do cálculo padrão for igual a 0(zero), 1(um) ou 10(dez). */
    if (digito == 0) 
        digito = 1;
    
    return digito;
}
/*
 * A função recebe um barcode e uma funcao de callback.
 * Caso identifique e valide o codigo recebido retorna no segundo parametro
 * do callback um objeto com as informações do barcode, dataVencimento e valorDocumento,
 * caso existam. Se acontecer um erro, um mensagem é retornada no primeiro parametro
 * do callback e tambem no objeto do segundo parametro.
 */
function parseBarCode(barcode, callback) {
    if (validateBarCode48(barcode)) {
        //processa o bar code
        
        //declara o objeto de resposta
        var objResposta = {
            "status": "OK",
            "mensagem": "Barcode eh um documento de concessionaria",
            "codigoBarras": decode48To44(barcode),
	        "dataVencimento": getDataVencimentoBarCode48(barcode),
	        "valorDocumento": getValueBarCode48(barcode)
        }

	    callback(null, objResposta);
    } else if (validateBarCode47(barcode)) {
        //processa o bar code
     
        //declara o objeto de resposta
        var objResposta = {
            "status": "OK",
            "mensagem": "Barcode eh um documento boleto",
            "codigoBarras": decode47To44(barcode),
	        "dataVencimento": getDataVencimentoBarCode47(barcode),
	        "valorDocumento": getValueBarCode47(barcode)
        }

	    callback(null, objResposta);
    } else if (validateConcessionaria44(barcode)) {
        //todo a ser implementando
    } else if (validateBoleto44(barcode)) {
        //todo a ser implementado.
    } else {
        //declara o objeto de resposta
        var objResposta = {
            "status": "Error",
            "mensagem": "Barcode inválido",
            "codigoBarras": barcode
        }
        callback('Barcode Inválido', objResposta);
    }
}

/*
 * A função recebe um codigo de 44 digitos e verifica se ele é um 
 * documento de concessionaria, ou seja, se pode ser expandido para
 * 48 digitos digitaveis.
 */
function validateConcessionaria44(barcode) {
    // o codigo original precisa ter 44 digitos.
    if (barcode && barcode.length == 44) {
	var reference = barcode.substring(2,3);
	//console.log('A referencia eh: ' + reference);
	if (reference == '6' || reference == '7') {
            if (modulo10(barcode.substr(0,3) + barcode.substr(4,99)) == barcode.substring(3,4) ) {
		return true;
	    }
	} else if (reference == '8' || reference == '9') {
            if (modulo11(barcode.substr(0,3) + barcode.substr(4,99)) == barcode.substring(3,4) ) {
		return true;
	    }	    
	}
    }

    return false;
}

/*
 * A função recebe um codigo de 44 digitos e verifica se ele é um 
 * documento de boleto, ou seja, se pode ser expandido para
 * 47 digitos digitaveis.
 */
function validateBoleto44(barcode) {
    // o codigo original precisa ter 44 digitos.
    if (barcode && barcode.length == 44) {
        if (modulo11(barcode.substring(0,4) + barcode.substring(5,99) ) == barcode.substring(4,5) ) {
	        return true;
	    }
    }

    return false;
}

/*
 * A função recebe um codigo de 44 digitos e verifica se ele é um 
 * documento de concessionaria ou boleto. Se for de concessionaria volta 48,
 * se for boleto volta 47
 */
function identifyBarCode(barcode) {

    if (barcode != null) {
        barcode = barcode.replace(/\D/g,"");
	    var size = barcode.length;
        //console.log('O barcode tem o tamanho: ' + size);

        if (validateConcessionaria44(barcode)) {
            return 48;
        } else {
            if (validateBoleto44(barcode)) {
                return 47;
            }
        }        
    }
    
    return null;
}

/*
 * A função recebe um codigo de 44 digitos, identifica o tipo de documento
 * retorna os digitos correspondentes a linha digitavel correta, se for 
 * documento de concessionaria com 48 digitos, se for boleto 47 digitos.
 */
function expandBarCode(barcode) {
    
    var barcodeExpandedSize = identifyBarCode(barcode);
    //console.log('O barcode tem o tamanho: ' + barcodeExpandedSize);
    
    if (barcodeExpandedSize == 47)
        return expandBarCodeTo47(barcode);
    else if (barcodeExpandedSize == 48)
        return expandBarCodeTo48(barcode); 

}

/*
 * Obtem a data de vencimento do barcode de 48 digitos
 */
function getDataVencimentoBarCode48(barcode) {
    if (barcode != null) {
      	barcode = barcode.replace(/\D/g,"");

        var campo1 = barcode.substring(0,11);
        var campo2 = barcode.substring(12,23);
        var campo3 = barcode.substring(24,35);
        var campo4 = barcode.substring(36,47);
        var campos = campo1 + campo2 + campo3 + campo4;

        var dateAsString = campos.substring(19, 27);
        var dateAsMoment = moment(dateAsString,'YYYYMMDD');

        if (dateAsMoment.isValid()) {
            return dateAsMoment.format('YYYYMMDD')
        } else {
            return null;
        }
    }
    return null;
}

/*
 * Obtem o valor do barcode de 48 digitos
 */
function getValueBarCode48(barcode) {
    if (barcode != null) {
      	barcode = barcode.replace(/\D/g,"");
    
        var campo1 = barcode.substring(0,11);
        var campo2 = barcode.substring(12,23);
        var campos = campo1 + campo2;
        return parseFloat(campos.substring(4,15))/100;
    }

    return null;
}

/*
 * Valida um barcode de 48 digitos, concessionaria
 */
function validateBarCode48(barcode) {

    if (barcode != null) {
        barcode = barcode.replace(/\D/g,"");
        //console.log('Barcode: ' + barcode);

        if (barcode.length == 48) {
            var reference = barcode.substring(2,3);
            //console.log('Reference: ' + reference);

            var campo1 = barcode.substring(0,11);
            // if (reference == '6' || reference == '7') {
            //     console.log('Campo 1: ' + campo1 + ' ' + modulo10(campo1));
            // } else if (reference == '7' || reference == '8') {
            //     console.log('Campo 1: ' + campo1 + ' ' + modulo11(campo1));
            // }

            var campo2 = barcode.substring(12,23);
            // if (reference == '6' || reference == '7') {
            //     console.log('Campo 2: ' + campo2 + ' ' + modulo10(campo2));
            // } else if (reference == '8' || reference == '9') {
            //     console.log('Campo 2: ' + campo2 + ' ' + modulo11(campo2));
            // }

            var campo3 = barcode.substring(24,35);
            // if (reference == '6' || reference == '7') {
            //     console.log('Campo 3: ' + campo3 + ' ' + modulo10(campo3));
            // } else if (reference == '8' || reference == '9') {
            //     console.log('Campo 3: ' + campo3 + ' ' + modulo11(campo3));
            // }

            var campo4 = barcode.substring(36,47);
            // if (reference == '6' || reference == '7') {
            //     console.log('Campo 4: ' + campo4 + ' ' + modulo10(campo4));  
            // } else if (reference == '8' || reference == '9') {
            //     console.log('Campo 4: ' + campo4 + ' ' + modulo11(campo4));  
            // }

            if (reference == '6' || reference == '7') {
                
                return  barcode.substring(11,12) == modulo10(campo1) &&
                        barcode.substring(23,24) == modulo10(campo2) &&
                        barcode.substring(35,36) == modulo10(campo3) &&
                        barcode.substring(47,48) == modulo10(campo4)
            
            } else if (reference == '8' || reference == '9') {
            
                return  barcode.substring(11,12) == modulo11(campo1) &&
                        barcode.substring(23,24) == modulo11(campo2) &&
                        barcode.substring(35,36) == modulo11(campo3) &&
                        barcode.substring(47,48) == modulo11(campo4)
            }
        }
    }

    return false;
}

/*
 * Obtem a data de vencimento do barcode de 47 digitos
 */
function getDataVencimentoBarCode47(barcode) {
    if (barcode != null) {
      	barcode = barcode.replace(/\D/g,"");

        var fatorVencimento = barcode.substring(33, 37);
        var dateAsMoment = moment('19971007','YYYYMMDD').add(fatorVencimento,'days');

        if (dateAsMoment.isValid()) {
            return dateAsMoment.format('YYYYMMDD')
        }
    }
    return null;
}

/*
 * Obtem o valor do barcode de 47 digitos
 */
function getValueBarCode47(barcode) {
    if (barcode != null) {
      	barcode = barcode.replace(/\D/g,"");
        return parseFloat(barcode.substring(37,47))/100;
    }

    return null;
}

/*
 * Valida um barcode de 47 digitos, boleto
 */
function validateBarCode47(barcode) {

    if (barcode != null) {
	barcode = barcode.replace(/\D/g,"");

	if (barcode.length == 47) {

	    var campo1 = barcode.substring(0,9);
	    //console.log('Campo 1: ' + campo1 + ' ' + modulo10(campo1));
	    var campo2 = barcode.substring(10,20);
	    //console.log('Campo 2: ' + campo2 + ' ' + modulo10(campo2));
	    var campo3 = barcode.substring(21,31);
	    //console.log('Campo 3: ' + campo3 + ' ' + modulo10(campo3));
	    var campo4 = barcode.substring(32,33); // Digito verificador
	    //console.log('Campo 4: ' + campo4);
	    var campo5 = barcode.substring(0,4) + barcode.substring(33,34) + 
                     barcode.substring(34,48) + barcode.substring(4, 9) +
                     campo2 + campo3 ;
	    //console.log('Campo 5: ' + campo5 + ' ' + modulo11(campo5)); 

	    //console.log(barcode.substring(9,10) + barcode.substring(20,21) + barcode.substring(31,32));

	    return  barcode.substring(9,10) == modulo10(campo1) &&
		        barcode.substring(20,21) == modulo10(campo2) &&
		        barcode.substring(31,32) == modulo10(campo3) &&
		        modulo11(campo5) == campo4;
	}
    }

    return false;
}

module.exports = {
    parseBarCode,
    expandBarCode,
    identifyBarCode,
    validateBarCode48,
    validateBarCode47
}
