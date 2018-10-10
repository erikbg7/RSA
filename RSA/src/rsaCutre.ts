import  bigNum from 'bignum'
import { randomBytes } from 'crypto';



export function expConMod(base: bigNum, exp: bigNum, mod: bigNum): bigNum {
    return bigNum.powm(base,exp,mod);
}

export async function generateKeys(length:number): Promise<PrivateKey> {
    let result = new PrivateKey();
    let p = await generatePrime(length/2);
    let q = await generatePrime(length/2);
    let phi = bigNum.mul(p.sub(1),q.sub(1))
    let n = bigNum.mul(p,q)
    while(p==q||n.bitLength()!=1024||phi.bitLength()!=1024){
        p = await generatePrime(length/2);
        q = await generatePrime(length/2);
        phi = bigNum.mul(p.sub(1),q.sub(1))
        n = bigNum.mul(p,q)
    }
    let publicKeyNum = new bigNum('65537');
    result.keyNumber = publicKeyNum.invertm(phi);
    result.mod = n;
    result.phi = phi;
    result.publicKey = new PublicKey();
    result.publicKey.mod = n;
    result.publicKey.keyNumber = publicKeyNum;
    return new Promise<PrivateKey>((value)=>{value(result)});
}

export async function generatePrime(length: number): Promise<bigNum> {
    length = Math.round(length / 8);
    let numberBig = new bigNum(8);

    while (!numberBig.probPrime()==true||numberBig.bitLength()!=length*8) {
        numberBig = bigNum.fromBuffer( await randomBytes(length));
    }
    return new Promise<bigNum>((resolve) => {

        resolve(numberBig)
    });
}

export function messageToBigNum(message:string):bigNum{
    let buffer = new Buffer(message);
    return bigNum.fromBuffer(buffer);
}

export function bigNumToMessage(number:bigNum):string{
    let num = bigNum.sub(number,0);
    return num.toBuffer().toString();
}

export class PublicKey {
    mod: bigNum;
    keyNumber: bigNum;

    encrypt(message:bigNum):bigNum{
        return expConMod(message,this.keyNumber,this.mod);
    }

    verify(message:bigNum):bigNum{
        return expConMod(message,this.keyNumber,this.mod);
    }
}

export class PrivateKey {
    mod: bigNum;
    keyNumber: bigNum;
    publicKey: PublicKey;
    phi: bigNum;

    decrypt(message:bigNum):bigNum{
        return expConMod(message,this.keyNumber,this.mod);
    }

    sign(message:bigNum):bigNum{
        return expConMod(message,this.keyNumber,this.mod);
    }
    
}

(async () => {
    generateKeys(1024);
})();
