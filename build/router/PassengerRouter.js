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
class PassengerRoutes extends BaseRouter_1.default {
    routes() {
        // CREATE PASSENGER
        this.router.post("", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log(req.body);
                const result = yield db_1.default.query("SELECT * FROM passengers WHERE email = $1", [req.body.email]);
                console.log(result.rows.length);
                if (result.rows.length === 1) {
                    res.status(409).json({
                        message: "Email already in use.",
                    });
                    throw new Error("Email in use");
                }
                else {
                    const hash = yield bcrypt_1.default.hash(req.body.passwordHash, 10);
                    const results = yield db_1.default.query("INSERT INTO passengers (birthDate, email, passwordHash, phoneNumber, firstName, lastName, userStatus, carPool, rating, schedule) \
              VALUES ($1, $2, $3, $4, $5, $6, 0, $7, NULL, NULL) returning *", [
                        req.body.birthDate,
                        req.body.email,
                        hash,
                        req.body.phoneNumber,
                        req.body.firstName,
                        req.body.lastName,
                        req.body.carPool,
                    ]);
                    res.status(201).json({
                        status: "success",
                        data: {
                            passengers: results.rows[0],
                        },
                    });
                }
                // console.log(req.body);
            }
            catch (err) {
                console.log(err);
            }
        }));
        // GET BY ID
        this.router.get("/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log(req.params.id);
                const results = yield db_1.default.query("SELECT * FROM passengers WHERE id = $1", [req.params.id]);
                res.status(200).json({
                    status: "success",
                    data: {
                        passenger: results.rows[0],
                    },
                });
            }
            catch (err) {
                console.log(err);
            }
        }));
        // DELETE
        this.router.delete("/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log(req.params.id);
                const results = yield db_1.default.query("DELETE FROM passengers WHERE id = $1", [req.params.id]);
                res.status(204).json({
                    status: "success",
                });
            }
            catch (err) {
                console.log(err);
            }
        }));
        // GET ALL
        this.router.get("", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const results = yield db_1.default.query("SELECT * FROM passengers");
                // console.log(results);
                res.status(200).json({
                    status: "success",
                    results: results.rows.length,
                    data: {
                        passengers: results.rows,
                    },
                });
            }
            catch (err) {
                console.log(err);
            }
        }));
        // UPDATE
        this.router.put("/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const results = yield db_1.default.query("UPDATE passengers SET birthdate = $2, email = $3, phonenumber = $4, carpool = $7 WHERE id = $1 returning *", [
                    req.body.id,
                    req.body.birthDate,
                    req.body.email,
                    req.body.phoneNumber,
                    req.body.firstName,
                    req.body.lastName,
                    req.body.carPool,
                ]);
                // console.log(req.params.id);
                // console.log(req.body);
                console.log(results);
                res.status(200).json({
                    status: "success",
                    data: {
                        passenger: results.rows[0],
                    },
                });
            }
            catch (err) {
                console.log(err);
            }
        }));
    }
}
exports.default = new PassengerRoutes().router;
