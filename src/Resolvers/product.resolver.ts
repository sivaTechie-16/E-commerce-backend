import { Resolver, Query, Mutation, Arg } from 'type-graphql';
import { Product } from '../models/product.model'; 

@Resolver(of => Product)
export class ProductResolver {
  @Query(() => [Product])
  async getProducts() {
    return await Product.find();
  }

  @Query(() => Product, { nullable: true })
  async getProduct(@Arg('id') id: number) {
    return await Product.findOneBy({id:id});
  }

  @Mutation(() => Product)
  async createProduct(
    @Arg('name') name: string,
    @Arg('description', { nullable: true }) description: string,
    @Arg('price') price: number,
    @Arg('imageUrl', { nullable: true }) imageUrl: string
  ): Promise<Product> {
    const product = Product.create({ name, description, price, imageUrl });
    return await product.save();
  }

  @Mutation(() => Product, { nullable: true })
  async updateProduct(
    @Arg('id') id: number,
    @Arg('name', { nullable: true }) name: string,
    @Arg('description', { nullable: true }) description: string,
    @Arg('price', { nullable: true }) price: number,
    @Arg('imageUrl', { nullable: true }) imageUrl: string
  ): Promise<Product | null> {
    const product = await Product.findOneBy({id:id});
    if (!product) return null;

    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (imageUrl) product.imageUrl = imageUrl;

    await product.save();
    return product;
  }

  @Mutation(() => Boolean)
  async deleteProduct(@Arg('id') id: number): Promise<boolean> {
    const result = await Product.delete(id);
    return result.affected !== 0; 
  }
}
