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
exports.CategoryService = void 0;
const prismaClient_1 = __importDefault(require("../prismaClient/prismaClient"));
class CategoryService {
    createCategory(data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.verifyAdmin(userId);
            const slug = data.name.toLowerCase().replace(/\s+/g, "-");
            return prismaClient_1.default.category.create({
                data: Object.assign(Object.assign({}, data), { slug }),
            });
        });
    }
    verifyAdmin(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prismaClient_1.default.user.findUnique({ where: { id: userId } });
            if (!user || user.role !== "admin") {
                throw new Error("Admin privileges required");
            }
        });
    }
    updateCategory(id, data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.verifyAdmin(userId);
            const updateData = Object.assign({}, data);
            if (data.name) {
                updateData.slug = data.name.toLowerCase().replace(/\s+/g, "-");
            }
            return prismaClient_1.default.category.update({
                where: { id },
                data: updateData,
            });
        });
    }
    deleteCategory(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.verifyAdmin(userId);
            const productsCount = yield prismaClient_1.default.product.count({
                where: { categoryId: id },
            });
            if (productsCount > 0) {
                throw new Error("Cannot delete category with existing products");
            }
            return prismaClient_1.default.category.delete({
                where: { id },
            });
        });
    }
    getAllCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            return prismaClient_1.default.category.findMany({
                include: {
                    products: {
                        where: { stock: { gt: 0 } },
                    },
                },
                orderBy: { name: "asc" },
            });
        });
    }
    getCategoryById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return prismaClient_1.default.category.findUnique({
                where: { id },
                include: {
                    products: {
                        where: { stock: { gt: 0 } },
                    },
                },
            });
        });
    }
}
exports.CategoryService = CategoryService;
