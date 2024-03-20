"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const nodemailer_1 = __importDefault(require("nodemailer"));
const otpDatabase = {};
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
class ForgotPasswordRoute extends BaseRouter_1.default {
    routes() {
        this.router.post('/send-otp', (req, res) => __awaiter(this, void 0, void 0, function* () {
            // req: { body: { email: any; }; }, res: { json: (arg0: { message: string; }) => void; status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error: string; }): void; new(): any; }; }; }
            const email = req.body.email;
            const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
            otpDatabase[email] = otp; // Store OTP
            try {
                console.log(email);
                yield transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: 'Your OTP',
                    text: `Your OTP is: ${otp}`,
                });
                res.json({ message: 'OTP sent successfully.' });
            }
            catch (error) {
                console.error('Error sending email:', error);
                res.status(500).json({ error: 'Failed to send OTP.' });
            }
        }));
        this.router.post('/verify-otp', (req, res) => {
            // req: { body: { email: any; otp: any; }; }, res: { json: (arg0: { message: string; }) => void; status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error: string; }): void; new(): any; }; }; }
            // const { email, otp } = req.body;
            const email = req.body.email;
            const otp = req.body.otp;
            if (otpDatabase[email] && otpDatabase[email] === otp) {
                // OTP matches
                delete otpDatabase[email]; // Consider deleting the OTP after successful verification
                res.json({ message: 'OTP verified successfully.' });
            }
            else {
                // OTP does not match
                res.status(400).json({ error: 'OTP verification failed.' });
            }
        });
    }
}
exports.default = new ForgotPasswordRoute().router;
