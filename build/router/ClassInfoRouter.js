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
class ClassInfoRoutes extends BaseRouter_1.default {
    routes() {
        this.router.get("", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const results = yield db_1.default.query("SELECT \
                    cl.className,\
                    d.daysofweek,\
                    b.buildingName,\
                    s.section,\
                    ti.starttime,\
                    ti.endtime \
                    FROM classInfo ci \
                    JOIN classes cl ON cl.id = ci.classid \
                    JOIN daysofweek d ON d.id = ci.daysofweekid \
                    JOIN buildings b ON b.id = ci.buildingid \
                    JOIN section s ON s.id = ci.sectionid \
                    JOIN term t ON t.id = ci.termid \
                    JOIN timeinformation ti ON ti.id = ci.timeinfoid;");
                console.log(results.rows);
                res.status(200).json({
                    status: "success",
                    results: results.rows.length,
                    data: {
                        classes: results.rows
                    },
                });
            }
            catch (err) {
                console.log(err);
            }
            ;
        }));
    }
}
exports.default = new ClassInfoRoutes().router;
