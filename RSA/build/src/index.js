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
const bigNum = __importStar(require("bignum"));
const crypto_1 = require("crypto");
function expConMod(base, exp, mod) {
    return bigNum.powm(base, exp, mod);
}
exports.expConMod = expConMod;
function generateKeys(length) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = new PrivateKey();
        let p = bigNum.default.sub(yield generatePrime(length / 2), 0);
        let q = bigNum.default.sub(yield generatePrime(length / 2), 0);
        let n;
        let phi;
        while (p == q /*||n.bitLength()!=1024||phi.bitLength()!=1024*/) {
            p = bigNum.default.sub(yield generatePrime(length / 2), 0);
            q = bigNum.default.sub(yield generatePrime(length / 2), 0);
            phi = bigNum.mul(p.sub(1), q.sub(1));
            n = bigNum.mul(p, q);
        }
        let publicKeyNum = new bigNum.default('65537');
        result.keyNumber = publicKeyNum.invertm(bigNum.default.sub(phi, 0));
        result.mod = n;
        result.phi = phi;
        result.publicKey = new PublicKey();
        result.publicKey.mod = n;
        result.publicKey.keyNumber = publicKeyNum;
        return new Promise((value) => { value(result); });
    });
}
exports.generateKeys = generateKeys;
function generatePrime(length) {
    return __awaiter(this, void 0, void 0, function* () {
        length = Math.round(length / 8);
        let numberBig = new bigNum.default(8);
        while (!numberBig.probPrime() == true) {
            let prime = yield crypto_1.randomBytes(length);
            numberBig = new bigNum.default(0);
            for (let x = 0; x < length; x++) {
                if (x != 0) {
                    numberBig = numberBig.shiftLeft(8);
                }
                numberBig = numberBig.add(prime.readInt8(x)).abs();
            }
        }
        return new Promise((resolve) => {
            resolve(numberBig);
        });
    });
}
exports.generatePrime = generatePrime;
function messageToBigNum(message) {
    let buffer = new Buffer(message);
    return bigNum.default.fromBuffer(buffer);
}
exports.messageToBigNum = messageToBigNum;
function bigNumToMessage(number) {
    let num = bigNum.sub(number, 0);
    return num.toBuffer().toString();
}
exports.bigNumToMessage = bigNumToMessage;
class PublicKey {
    encrypt(message) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((value) => { value(expConMod(message, this.keyNumber, this.mod)); });
        });
    }
    verify(message) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((value) => { value(expConMod(message, this.keyNumber, this.mod)); });
        });
    }
}
exports.PublicKey = PublicKey;
class PrivateKey {
    decrypt(message) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((value) => { value(expConMod(message, this.keyNumber, this.mod)); });
        });
    }
    sign(message) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((value) => { value(expConMod(message, this.keyNumber, this.mod)); });
        });
    }
}
exports.PrivateKey = PrivateKey;
(() => __awaiter(this, void 0, void 0, function* () {
    generateKeys(1024);
}))();
