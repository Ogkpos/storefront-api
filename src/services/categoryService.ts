import prisma from "../prismaClient/prismaClient";

export class CategoryService {
  async createCategory(
    data: { name: string; description?: string },
    userId: string
  ) {
    await this.verifyAdmin(userId);
    const slug = data.name.toLowerCase().replace(/\s+/g, "-");
    return prisma.category.create({
      data: {
        ...data,
        slug,
      },
    });
  }

  async verifyAdmin(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || user.role !== "admin") {
      throw new Error("Admin privileges required");
    }
  }

  async updateCategory(
    id: string,
    data: { name?: string; description?: string },
    userId: string
  ) {
    await this.verifyAdmin(userId);

    const updateData: {
      name?: string;
      description?: string;
      slug?: string;
    } = { ...data };

    if (data.name) {
      updateData.slug = data.name.toLowerCase().replace(/\s+/g, "-");
    }

    return prisma.category.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteCategory(id: string, userId: string) {
    await this.verifyAdmin(userId);

    const productsCount = await prisma.product.count({
      where: { categoryId: id },
    });

    if (productsCount > 0) {
      throw new Error("Cannot delete category with existing products");
    }

    return prisma.category.delete({
      where: { id },
    });
  }

  async getAllCategories() {
    return prisma.category.findMany({
      include: {
        products: {
          where: { stock: { gt: 0 } },
        },
      },
      orderBy: { name: "asc" },
    });
  }

  async getCategoryById(id: string) {
    return prisma.category.findUnique({
      where: { id },
      include: {
        products: {
          where: { stock: { gt: 0 } },
        },
      },
    });
  }
}
