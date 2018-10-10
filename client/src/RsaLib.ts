import * as bigInt from 'big-integer';
import {BigInteger} from 'big-integer'

export function getPrime(length:number):BigInteger{
    length = Math.round(length/32)
    let q = bigInt(4);
    while(!q.isProbablePrime()||q.bitLength().toJSNumber()!= length*32)
    {
        let array = new Uint32Array(length);
        let randomData = window.crypto.getRandomValues<Uint32Array>(array);
        let number = '';
        for(let x=0;x<randomData.length;x++){
            number = number.concat(randomData[x].toString(16));
        }
        q = bigInt(number,16);
    }
    return q;
}

export function expConMod(base:BigInteger,exp:BigInteger,mod:BigInteger):BigInteger{
    return base.modPow(exp,mod);
}

export class PublicKey {
    mod: BigInteger;
    keyNumber: BigInteger;

    encrypt(message:BigInteger):BigInteger{
        return expConMod(message,this.keyNumber,this.mod);
    }

    verify(message:BigInteger):BigInteger{
        return expConMod(message,this.keyNumber,this.mod);
    }
}

export class PrivateKey {
    mod: BigInteger;
    keyNumber: BigInteger;
    publicKey: PublicKey;
    phi: BigInteger;

    decrypt(message:BigInteger):BigInteger{
        return expConMod(message,this.keyNumber,this.mod);
    }

    sign(message:BigInteger):BigInteger{
        return expConMod(message,this.keyNumber,this.mod);
    }
    
}

export async function generateKeys(length:number): Promise<PrivateKey> {
    let result = new PrivateKey();
    let p = await getPrime(length/2);
    let q = await getPrime(length/2);;
    let phi = p.subtract(1).multiply(q.subtract(1));
    let n = p.multiply(q);
    while(p==q||n.bitLength().toJSNumber()!=length||phi.bitLength().toJSNumber()!=length){
        p = await getPrime(length/2);
        q = await getPrime(length/2);
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
    return new Promise<PrivateKey>((value)=>{value(result)});
}