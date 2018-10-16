"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bigInt = require("big-integer");
function getPrime(length) {
    length = Math.round(length / 32);
    let q = bigInt(4);
    while (!q.isProbablePrime() || q.bitLength().toJSNumber() != length * 32) {
        let array = new Uint32Array(length);
        let randomData = window.crypto.getRandomValues(array);
        let number = '';
        for (let x = 0; x < randomData.length; x++) {
            number = number.concat(randomData[x].toString(16));
        }
        q = bigInt(number, 16);
    }
    return q;
}
exports.getPrime = getPrime;
function expConMod(base, exp, mod) {
    return base.modPow(exp, mod);
}
exports.expConMod = expConMod;
class PublicKey {
    encrypt(message) {
        return expConMod(message, this.keyNumber, this.mod);
    }
    verify(message) {
        return expConMod(message, this.keyNumber, this.mod);
    }
}
exports.PublicKey = PublicKey;
class PrivateKey {
    decrypt(message) {
        return expConMod(message, this.keyNumber, this.mod);
    }
    sign(message) {
        return expConMod(message, this.keyNumber, this.mod);
    }
}
exports.PrivateKey = PrivateKey;
function generateKeys(length) {
    let result = new PrivateKey();
    let p = getPrime(length / 2);
    let q = getPrime(length / 2);
    ;
    let phi = p.subtract(1).multiply(q.subtract(1));
    let n = p.multiply(q);
    while (p == q || n.bitLength().toJSNumber() != length || phi.bitLength().toJSNumber() != length) {
        p = getPrime(length / 2);
        q = getPrime(length / 2);
        phi = p.subtract(1).multiply(q.subtract(1));
        n = p.multiply(q);
    }
    let publicKeyNum = bigInt('65537');
    result.keyNumber = publicKeyNum.modInv(phi);
    result.mod = n;
    result.phi = phi;
    result.publicKey = new PublicKey();
    result.publicKey.mod = n;
    result.publicKey.keyNumber = publicKeyNum;
    console.log(result);
    return result;
}
exports.generateKeys = generateKeys;
