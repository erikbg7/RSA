import 'mocha';
import { expect } from 'chai';
import { PrivateKey, PublicKey, expConMod,generateKeys,generatePrime,bigNumToMessage,messageToBigNum} from '../src'
import * as bigNum from 'bignum'

describe('test del objeto rsaCutre',()=>{

    let user1 = new PrivateKey();
    user1.keyNumber = new bigNum.default('314082567765085892950146723820903205');
    user1.mod = new bigNum.default('644681300498619888408807985830174569')
    user1.phi = new bigNum.default('644681300498619880556038893765872196');
    user1.publicKey = new PublicKey();
    user1.publicKey.mod = user1.mod;
    user1.publicKey.keyNumber = new bigNum.default(65537);

    let user2 = new PrivateKey();
    user2.keyNumber = new bigNum.default('424066677481442193977145250950415073');
    user2.mod = new bigNum.default('820187629986757477587598236238963847')
    user2.phi = new bigNum.default('820187629986757475776307165752909920');
    user2.publicKey = new PublicKey();
    user2.publicKey.mod = user2.mod;
    user2.publicKey.keyNumber = new bigNum.default(65537);

    it('prueba la funcion expConMod',()=>{
        expect(expConMod(3,4,16).toString()).to.equal('1');
    })
    it('pruba de la funcion generatePrime',async ()=>{
        let n = await generatePrime(1024);
        n = bigNum.add(n,0);
        expect(n.bitLength()).to.be.closeTo(1024,0);
        expect(n.probPrime()).to.be.equal(true);
    })
    it('pruba de la funcion generatekey',async ()=>{
        const keys = await generateKeys(1024);
        expect(bigNum.add(keys.mod,0).bitLength()).to.be.closeTo(1024,20);
        expect(bigNum.add(keys.phi,0).bitLength()).to.be.closeTo(1024,20);
        expect(keys.mod).to.be.equal(keys.publicKey.mod);
        expect(bigNum.add(keys.keyNumber,0).powm(keys.phi,keys.mod).toNumber()).to.be.equal(1)
        expect(bigNum.add(keys.publicKey.keyNumber,0).powm(keys.phi,keys.mod).toNumber()).to.be.equal(1)

    })
    it('prueba de la funcion messageToBigNum',async()=>{
        expect(messageToBigNum('HOLA paTiTO!')).to.be.deep.equal(bigNum.add('22378785948114938758920687393',0));
    })
    it('prueba de la funcion bigNumToMessage',async()=>{
        expect(bigNumToMessage('22378785948114938758920687393')).to.be.deep.equal('HOLA paTiTO!');
    })
    it('prueba de la funcion encrypt',async()=>{
        let encripted = await user1.publicKey.encrypt(messageToBigNum("hello node!"));
        expect(encripted.toString()).to.be.equal('505440789974123141460027844142835956');
    })
    it('prueba de la funcion decrypt',async()=>{
        let decrypted = await user1.decrypt(new bigNum.default('505440789974123141460027844142835956'));
        expect(bigNumToMessage(decrypted)).to.be.equal('hello node!');
    })
    it('prueba la funcion sign',async()=>{
        let signed = await user2.sign('505440789974123141460027844142835956');
        expect(signed.toString()).to.be.equal('644713203552166444474272534666011733');

    })
    it('prueba la funcion verify',async()=>{
        let verified = await user2.publicKey.verify('644713203552166444474272534666011733');
        expect(verified.toString()).to.be.equal('505440789974123141460027844142835956');
    })
    it('encrypt-sign-verify-decript',async()=>{
        let encrypted = await user1.publicKey.encrypt(messageToBigNum("hi my friend"));
        let signed = await user2.sign(encrypted);
        let verified = await user2.publicKey.verify(signed);
        let decrypted = await user1.decrypt(verified);
        let message = bigNumToMessage(decrypted);
        expect(message).to.be.equal('hi my friend');


    })

})