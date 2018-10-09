import * as bigNum from 'bignum'
import { randomBytes } from 'crypto';
import {BigNumCompatible} from 'bignum';


export function expConMod(base: BigNumCompatible, exp: BigNumCompatible, mod: BigNumCompatible): BigNumCompatible {
    return bigNum.powm(base,exp,mod);
}

export async function generateKeys(length:number): Promise<PrivateKey> {
    let result = new PrivateKey();
    let p = bigNum.default.sub(await generatePrime(length/2),0);
    let q = bigNum.default.sub(await generatePrime(length/2),0);
    let phi = bigNum.mul(p.sub(1),q.sub(1))
    let n = bigNum.mul(p,q)
    while(p==q||n.bitLength()!=1024||phi.bitLength()!=1024){
        p = bigNum.default.sub(await generatePrime(length/2),0);
        q = bigNum.default.sub(await generatePrime(length/2),0);
        phi = bigNum.mul(p.sub(1),q.sub(1))
        n = bigNum.mul(p,q)
    }
    let publicKeyNum = new bigNum.default('65537');
    result.keyNumber = bigNum.default.invertm(publicKeyNum,phi);
    result.mod = n;
    result.phi = phi;
    result.publicKey = new PublicKey();
    result.publicKey.mod = n;
    result.publicKey.keyNumber = publicKeyNum;
    return new Promise<PrivateKey>((value)=>{value(result)});
}

export async function generatePrime(length: number): Promise<BigNumCompatible> {
    length = Math.round(length / 8);
    let numberBig = new bigNum.default(8);

    while (!numberBig.probPrime()==true||numberBig.bitLength()!=length*8) {
        numberBig = bigNum.default.fromBuffer( await randomBytes(length));
    }
    return new Promise<BigNumCompatible>((resolve) => {

        resolve(numberBig)
    });
}

export function messageToBigNum(message:string):BigNumCompatible{
    let buffer = new Buffer(message);
    return bigNum.default.fromBuffer(buffer);
}

export function bigNumToMessage(number:BigNumCompatible):string{
    let num = bigNum.sub(number,0);
    return num.toBuffer().toString();
}

export class PublicKey {
    mod: BigNumCompatible;
    keyNumber: BigNumCompatible;

    async encrypt(message:BigNumCompatible):Promise<BigNumCompatible>{
        return new Promise<BigNumCompatible>((value)=>{value(expConMod(message,this.keyNumber,this.mod))});
    }

    async verify(message:BigNumCompatible):Promise<BigNumCompatible>{
        return new Promise<BigNumCompatible>((value)=>{value(expConMod(message,this.keyNumber,this.mod))});
    }
}

export class PrivateKey {
    mod: BigNumCompatible;
    keyNumber: BigNumCompatible;
    publicKey: PublicKey;
    phi: BigNumCompatible;

    async decrypt(message:BigNumCompatible):Promise<BigNumCompatible>{
        return new Promise<BigNumCompatible>((value)=>{value(expConMod(message,this.keyNumber,this.mod))});
    }

    async sign(message:BigNumCompatible):Promise<BigNumCompatible>{
        return new Promise<BigNumCompatible>((value)=>{value(expConMod(message,this.keyNumber,this.mod))});
    }
    
}

(async () => {
    generateKeys(1024);
})();
