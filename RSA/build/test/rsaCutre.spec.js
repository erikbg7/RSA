"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai_1 = require("chai");
const src_1 = require("../src");
const bigNum = __importStar(require("bignum"));
describe('test del objeto rsaCutre', () => {
    let user1 = new src_1.PrivateKey();
    user1.keyNumber = new bigNum.default('314082567765085892950146723820903205');
    user1.mod = new bigNum.default('644681300498619888408807985830174569');
    user1.phi = new bigNum.default('644681300498619880556038893765872196');
    user1.publicKey = new src_1.PublicKey();
    user1.publicKey.mod = user1.mod;
    user1.publicKey.keyNumber = new bigNum.default(65537);
    let user2 = new src_1.PrivateKey();
    user2.keyNumber = new bigNum.default('424066677481442193977145250950415073');
    user2.mod = new bigNum.default('820187629986757477587598236238963847');
    user2.phi = new bigNum.default('820187629986757475776307165752909920');
    user2.publicKey = new src_1.PublicKey();
    user2.publicKey.mod = user2.mod;
    user2.publicKey.keyNumber = new bigNum.default(65537);
    it('prueba la funcion expConMod', () => {
        chai_1.expect(src_1.expConMod(3, 4, 16).toString()).to.equal('1');
    });
    it('pruba de la funcion generatePrime', () => __awaiter(this, void 0, void 0, function* () {
        let n = yield src_1.generatePrime(1024);
        n = bigNum.add(n, 0);
        chai_1.expect(n.bitLength()).to.be.closeTo(1024, 3);
        chai_1.expect(n.probPrime()).to.be.equal(true);
    }));
    it('pruba de la funcion generatekey', () => __awaiter(this, void 0, void 0, function* () {
        const keys = yield src_1.generateKeys(1024);
        chai_1.expect(bigNum.add(keys.mod, 0).bitLength()).to.be.closeTo(1024, 20);
        chai_1.expect(bigNum.add(keys.phi, 0).bitLength()).to.be.closeTo(1024, 20);
        chai_1.expect(keys.mod).to.be.equal(keys.publicKey.mod);
        chai_1.expect(bigNum.add(keys.keyNumber, 0).powm(keys.phi, keys.mod).toNumber()).to.be.equal(1);
        chai_1.expect(bigNum.add(keys.publicKey.keyNumber, 0).powm(keys.phi, keys.mod).toNumber()).to.be.equal(1);
    }));
    it('prueba de la funcion messageToBigNum', () => __awaiter(this, void 0, void 0, function* () {
        chai_1.expect(src_1.messageToBigNum('HOLA paTiTO!')).to.be.deep.equal(bigNum.add('22378785948114938758920687393', 0));
    }));
    it('prueba de la funcion bigNumToMessage', () => __awaiter(this, void 0, void 0, function* () {
        chai_1.expect(src_1.bigNumToMessage('22378785948114938758920687393')).to.be.deep.equal('HOLA paTiTO!');
    }));
    it('prueba de la funcion encrypt', () => __awaiter(this, void 0, void 0, function* () {
        let encripted = yield user1.publicKey.encrypt(src_1.messageToBigNum("hello node!"));
        chai_1.expect(encripted.toString()).to.be.equal('505440789974123141460027844142835956');
    }));
    it('prueba de la funcion decrypt', () => __awaiter(this, void 0, void 0, function* () {
        let decrypted = yield user1.decrypt(new bigNum.default('505440789974123141460027844142835956'));
        chai_1.expect(src_1.bigNumToMessage(decrypted)).to.be.equal('hello node!');
    }));
    it('prueba la funcion sign', () => __awaiter(this, void 0, void 0, function* () {
        let signed = yield user2.sign('505440789974123141460027844142835956');
        chai_1.expect(signed.toString()).to.be.equal('644713203552166444474272534666011733');
    }));
    it('prueba la funcion verify', () => __awaiter(this, void 0, void 0, function* () {
        let verified = yield user2.publicKey.verify('644713203552166444474272534666011733');
        chai_1.expect(verified.toString()).to.be.equal('505440789974123141460027844142835956');
    }));
    it('encrypt-sign-verify-decript', () => __awaiter(this, void 0, void 0, function* () {
        let encrypted = yield user1.publicKey.encrypt(src_1.messageToBigNum("hi my friend"));
        let signed = yield user2.sign(encrypted);
        let verified = yield user2.publicKey.verify(signed);
        let decrypted = yield user1.decrypt(verified);
        let message = src_1.bigNumToMessage(decrypted);
        chai_1.expect(message).to.be.equal('hi my friend');
    }));
});
