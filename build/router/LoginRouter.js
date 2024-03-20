"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseRouter_1 = __importDefault(require("./base/BaseRouter"));
const db_1 = __importDefault(require("../db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const verifyPassword = (password, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    return bcrypt_1.default.compare(password, hashedPassword);
});
class LoginRouter extends BaseRouter_1.default {
    routes() {
        this.router.post("", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db_1.default.query("SELECT * FROM passengers WHERE email = $1", [req.body.email]);
                const isValid = yield verifyPassword(req.body.passwordHash, result.rows[0].passwordhash);
                if (!isValid) {
                    res.status(401).json({ message: "Authentication failed", token: -1 });
                }
                else {
                    const token1 = "200";
                    const newResults = yield db_1.default.query("SELECT birthDate, email, phoneNumber, firstName, lastName, userStatus, carPool FROM passengers WHERE email = $1", [req.body.email]);
                    res.status(200).json({
                        token: token1,
                        passenger: newResults.rows[0],
                        message: "Success",
                    });
                    console.log("LOGIN: SUCCESS");
                }
            }
            catch (err) {
                console.log(err);
            }
        }));
    }
}
exports.default = new LoginRouter().router;
