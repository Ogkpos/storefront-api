"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const authRoutes_1 = require("./routes/authRoutes");
const categoryRoute_1 = require("./routes/categoryRoute");
const productRoute_1 = require("./routes/productRoute");
const app = (0, express_1.default)();
exports.app = app;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_session_1.default)({
    signed: false,
    secure: false,
}));
app.use((0, morgan_1.default)("dev"));
app.use(authRoutes_1.authRouter);
app.use(categoryRoute_1.categoryRouter);
app.use(productRoute_1.productRouter);
