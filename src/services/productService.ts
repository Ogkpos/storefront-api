import prisma from "../prismaClient/prismaClient";

export class ProductService {
  private async verifyCategoryExists(categoryId: string): Promise<void> {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new Error("Category does not exist");
    }
  }
  async getProductsByCategory(categoryId: string) {
    await this.verifyCategoryExists(categoryId);

    return await prisma.product.findMany({
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
  }

  async getProductById(id: string) {
    const product = await prisma.product.findUnique({
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
  }

  private async verifyAdmin(userId: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    if (!user || user.role !== "admin") {
      throw new Error("Admin privileges required");
    }
  }

  async createProduct(
    data: {
      name: string;
      description?: string;
      price: number;
      stock: number;
      categoryId: string;
    },
    userId: string
  ) {
    await this.verifyAdmin(userId);
    await this.verifyCategoryExists(data.categoryId);
    const slug = data.name.toLowerCase().replace(/\s+/g, "-");
    return prisma.product.create({
      data: {
        ...data,
        slug,
        userId,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async updateProduct(
    id: string,
    data: {
      name?: string;
      description?: string;
      price?: number;
      stock?: number;
      categoryId?: string;
    },
    userId: string
  ) {
    await this.verifyAdmin(userId);

    if (data.categoryId) {
      await this.verifyCategoryExists(data.categoryId);
    }
    const updateData: any = { ...data };

    if (data.name) {
      updateData.slug = data.name.toLowerCase().replace(/\s+/g, "-");
    }

    return prisma.product.update({
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
  }
  async deleteProduct(id: string, userId: string) {
    await this.verifyAdmin(userId);

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    return prisma.product.delete({
      where: { id },
    });
  }
}
