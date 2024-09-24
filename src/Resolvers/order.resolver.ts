import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { Order } from "../models/order.model";
import { User } from "../models/user.model";
import { Product } from "../models/product.model";

@Resolver((of) => Order)
export class OrderResolver {
  @Query(() => [Order])
  async getOrders() {
    return await Order.find({ relations: ["user", "product"] });
  }

  @Query(() => Order, { nullable: true })
  async getOrder(@Arg("id") id: number) {
    return await Order.findOne({
      where: { id },
      relations: ["user", "product"],
    });
  }

  @Mutation(() => Order)
  async createOrder(
    @Arg("userId") userId: number,
    @Arg("productId") productId: number,
    @Arg("totalPrice") totalPrice: number,
    @Arg("status") status: string
  ): Promise<Order> {
    const user = await User.findOneBy({ id: userId });
    if (!user) throw new Error("User not found");

    const product = await Product.findOneBy({ id: productId });
    if (!product) throw new Error("Product not found");

    const order = Order.create({ user, product, totalPrice, status });
    return await order.save();
  }

  @Mutation(() => Order, { nullable: true })
  async updateOrder(
    @Arg("id") id: number,
    @Arg("totalPrice") totalPrice: number,
    @Arg("status") status: string,
    @Arg("productId", { nullable: true }) productId?: number,
    @Arg("userId", { nullable: true }) userId?: number
  ): Promise<Order | null> {
    const order = await Order.findOneBy({ id });
    if (!order) return null;

    if (totalPrice !== undefined) order.totalPrice = totalPrice;
    if (status !== undefined) order.status = status;

    if (productId !== undefined) {
      const product = await Product.findOneBy({ id: productId });
      if (!product) throw new Error("Product not found");
      order.product = product;
    }

    if (userId !== undefined) {
      const user = await User.findOneBy({ id: userId });
      if (!user) throw new Error("User not found");
      order.user = user;
    }

    await order.save();
    return order;
  }

  @Mutation(() => Boolean)
  async deleteOrder(@Arg("id") id: number): Promise<boolean> {
    const result = await Order.delete(id);
    return result.affected !== 0;
  }
}
