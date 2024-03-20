"use strict";
// yarn build
// yarn dev
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const PassengerRouter_1 = __importDefault(require("./router/PassengerRouter"));
const ClassInfoRouter_1 = __importDefault(require("./router/ClassInfoRouter"));
const LoginRouter_1 = __importDefault(require("./router/LoginRouter"));
const ForgotPassword_1 = __importDefault(require("./router/ForgotPassword"));
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
        this.routes();
    }
    plugins() {
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
    }
    routes() {
        this.app.route("/").get((req, res) => {
            res.send("welcome home");
        });
        this.app.use("/api/v1/passengers", PassengerRouter_1.default);
        this.app.use("/api/v1/classInfo", ClassInfoRouter_1.default);
        this.app.use("/api/v1/login", LoginRouter_1.default);
        this.app.use("/api", ForgotPassword_1.default);
    }
}
const port = 8000;
const app = new App().app;
app.listen(port, () => {
    console.log(`[server]: ✅ Server is running at http://localhost:${port}`);
});
