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
exports.categoryRouter = void 0;
const express_1 = __importDefault(require("express"));
const categoryService_1 = require("../services/categoryService");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
exports.categoryRouter = router;
const categoryService = new categoryService_1.CategoryService();
router.get("/api/categories", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield categoryService.getAllCategories();
        res.json(categories);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
//@ts-ignore
router.get("/api/category/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield categoryService.getCategoryById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json(category);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.post("/api/createCategory", authMiddleware_1.authMiddleware, (0, authMiddleware_1.requireRole)("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description } = req.body;
        const category = yield categoryService.createCategory({ name, description }, req.currentUser.id);
        res.status(201).json(category);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}));
router.put("/api/updateCategory/:id", (0, authMiddleware_1.requireRole)("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield categoryService.updateCategory(req.params.id, req.body, req.currentUser.id);
        res.json(category);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}));
router.delete("/api/deleteCategory/:id", (0, authMiddleware_1.requireRole)("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield categoryService.deleteCategory(req.params.id, req.currentUser.id);
        res.status(204).send();
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}));
