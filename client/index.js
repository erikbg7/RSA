var bigInt = require("big-integer");

/**
 * 
 * @param {bigInt.BigInteger} base 
 * @param {bigInt.BigInteger} exp 
 * @param {bigInt.BigInteger} mod 
 */
function expConMod(base,exp,mod){
    return base.modPow(exp,mod);
}
/**
 * 
 * @param {number} length 
 */
function generatePrime(length){
    length = Math.round(length / 8);
    let numberBig = bigInt(8).subtract(0);
    while (!numberBig.isPrime()==true||numberBig.bitLength()!=length*8) {
        var byteArray = new Uint8Array(length);
        let values =  window.crypto.getRandomValues(byteArray);
        let numberString = '';
        for(let x=0;x<values.length;x++){
            numberString += values[x].toString(16);
        }
        numberBig = bigInt(numberString,16);
        console.log(numberBig);
    }
}
/**
 * 
 * @param {number} length 
 */
export async function generateKeys(length){
    let result = new PrivateKey();
    let p = bigInt(await generatePrime(length/2)).subtract(0);
    let q = bigInt(await generatePrime(length/2)).subtract(0);
    let phi = (p.minus(1)).multiply(q.minus(1));
    let n = p.multiply(q);
    while(p==q||n.bitLength()!=1024||phi.bitLength()!=1024){
        p = bigInt(await generatePrime(length/2)).subtract(0);
        q = bigInt(await generatePrime(length/2)).subtract(0);
        phi = (p.minus(1)).multiply(q.minus(1));
        n = p.multiply(q);
    }
    let publicKeyNum = bigInt('65537').subtract(0);
    result.keyNumber = publicKeyNum.modInv(phi);
    result.mod = n;
    result.phi = phi;
    result.publicKey = new PublicKey();
    result.publicKey.mod = n;
    result.publicKey.keyNumber = publicKeyNum;
    return new Promise((value)=>{value(result)});
}

export class PrivateKey {

    async decrypt(message){
        return new Promise((value)=>{value(expConMod(message,this.keyNumber,this.mod))});
    }

    async sign(message){
        return new Promise((value)=>{value(expConMod(message,this.keyNumber,this.mod))});
    }
    
}

export class PublicKey {

    async encrypt(message){
        return new Promise((value)=>{value(expConMod(message,this.keyNumber,this.mod))});
    }

    async verify(message){
        return new Promise((value)=>{value(expConMod(message,this.keyNumber,this.mod))});
    }
}