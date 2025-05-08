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
exports.ProductService = void 0;
const prismaClient_1 = __importDefault(require("../prismaClient/prismaClient"));
class ProductService {
    verifyCategoryExists(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield prismaClient_1.default.category.findUnique({
                where: { id: categoryId },
            });
            if (!category) {
                throw new Error("Category does not exist");
            }
        });
    }
    getProductsByCategory(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.verifyCategoryExists(categoryId);
            return yield prismaClient_1.default.product.findMany({
                where: { categoryId, stock: { gt: 0 } },
                include: {
                    category: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                        },
                    },
                },
                orderBy: { name: "asc" },
            });
        });
    }
    getProductById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield prismaClient_1.default.product.findUnique({
                where: { id },
                include: {
                    category: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                        },
                    },
                },
            });
            if (!product) {
                throw new Error("Product not found");
            }
            return product;
        });
    }
    verifyAdmin(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prismaClient_1.default.user.findUnique({
                where: { id: userId },
                select: { role: true },
            });
            if (!user || user.role !== "admin") {
                throw new Error("Admin privileges required");
            }
        });
    }
    createProduct(data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.verifyAdmin(userId);
            yield this.verifyCategoryExists(data.categoryId);
            const slug = data.name.toLowerCase().replace(/\s+/g, "-");
            return prismaClient_1.default.product.create({
                data: Object.assign(Object.assign({}, data), { slug,
                    userId }),
                include: {
                    category: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            });
        });
    }
    updateProduct(id, data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.verifyAdmin(userId);
            if (data.categoryId) {
                yield this.verifyCategoryExists(data.categoryId);
            }
            const updateData = Object.assign({}, data);
            if (data.name) {
                updateData.slug = data.name.toLowerCase().replace(/\s+/g, "-");
            }
            return prismaClient_1.default.product.update({
                where: { id },
                data: updateData,
                include: {
                    category: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            });
        });
    }
    deleteProduct(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.verifyAdmin(userId);
            const product = yield prismaClient_1.default.product.findUnique({
                where: { id },
            });
            if (!product) {
                throw new Error("Product not found");
            }
            return prismaClient_1.default.product.delete({
                where: { id },
            });
        });
    }
}
exports.ProductService = ProductService;
