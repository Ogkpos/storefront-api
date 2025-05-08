"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.generateToken = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    var _a;
    console.log("Auth middleware triggered for:", req.method, req.originalUrl);
    if (!((_a = req.session) === null || _a === void 0 ? void 0 : _a.jwt)) {
        throw new Error("Not authorized");
    }
    try {
        const payload = jsonwebtoken_1.default.verify(req.session.jwt, process.env.JWT_SECRET);
        req.currentUser = payload;
        console.log(payload);
        next();
    }
    catch (error) {
        if (error.name === "JsonWebTokenError") {
            return res
                .status(400)
                .json({ message: "Invalid token, please log in again! " });
        }
        if (error.name === "TokenExpiredError") {
            return res
                .status(400)
                .json({ message: "Your token has expired login again " });
        }
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.authMiddleware = authMiddleware;
const generateToken = (id, email, role) => {
    return jsonwebtoken_1.default.sign({ id, email, role }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
};
exports.generateToken = generateToken;
const requireRole = (...roles) => {
    return (req, res, next) => {
        try {
            const user = req.currentUser;
            if (!user) {
                return res.status(401).json({ message: "Not Authorized" });
            }
            if (!roles.includes(user.role)) {
                res.status(403).send(`Requires ${roles.join(" or ")} role. You have ${user.role} 
        role.`);
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.requireRole = requireRole;
