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
exports.productRouter = void 0;
const express_1 = __importDefault(require("express"));
const productService_1 = require("../services/productService");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
exports.productRouter = router;
const productService = new productService_1.ProductService();
router.get("/api/product/category/:categoryId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield productService.getProductsByCategory(req.params.categoryId);
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.get("/api/product/:id", 
//@ts-ignore
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield productService.getProductById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.post("/api/product/create", authMiddleware_1.authMiddleware, (0, authMiddleware_1.requireRole)("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, price, stock, categoryId } = req.body;
        const product = yield productService.createProduct({ name, description, price, stock, categoryId }, req.currentUser.id);
        res.status(201).json(product);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}));
router.put("/api/product/update/:id", authMiddleware_1.authMiddleware, (0, authMiddleware_1.requireRole)("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield productService.updateProduct(req.params.id, req.body, req.currentUser.id);
        res.json(product);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}));
router.delete("/api/product/delete/:id", authMiddleware_1.authMiddleware, (0, authMiddleware_1.requireRole)("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield productService.deleteProduct(req.params.id, req.currentUser.id);
        res.status(204).send();
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}));
