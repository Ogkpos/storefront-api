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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prismaClient_1 = __importDefault(require("../prismaClient/prismaClient"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
class AuthService {
    register(email, password, role) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield prismaClient_1.default.user.findUnique({ where: { email } });
            if (existingUser) {
                throw new Error("Email already in use");
            }
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            const user = yield prismaClient_1.default.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    role,
                },
            });
            return {
                id: user.id.toString(),
                email: user.email,
                role: user.role,
                token: (0, authMiddleware_1.generateToken)(user.id.toString(), user.email, user.role),
            };
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prismaClient_1.default.user.findUnique({ where: { email } });
            if (!user) {
                throw new Error("Invalid credentials");
            }
            const isMatch = yield bcryptjs_1.default.compare(password, user.password);
            if (!isMatch) {
                throw new Error("Invalid credentials");
            }
            return {
                id: user.id.toString(),
                email: user.email,
                role: user.role,
                token: (0, authMiddleware_1.generateToken)(user.id.toString(), user.email, user.role),
            };
        });
    }
}
exports.default = new AuthService();
