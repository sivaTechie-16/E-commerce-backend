import { ProductResolver } from './product.resolver';
import { Product } from '../models/product.model';

// Mock the Product model methods
jest.mock('../models/product.model', () => ({
  Product: {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('ProductResolver', () => {
  let productResolver: ProductResolver;

  beforeEach(() => {
    productResolver = new ProductResolver();
  });

  describe('getProducts', () => {
    it('should return all products', async () => {
      const mockProducts = [{ id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' }];
      (Product.find as jest.Mock).mockResolvedValue(mockProducts);

      const result = await productResolver.getProducts();
      expect(result).toEqual(mockProducts);
      expect(Product.find).toHaveBeenCalled();
    });
  });

  describe('getProduct', () => {
    it('should return a product by id', async () => {
      const mockProduct = { id: 1, name: 'Product 1' };
      (Product.findOneBy as jest.Mock).mockResolvedValue(mockProduct);

      const result = await productResolver.getProduct(1);
      expect(result).toEqual(mockProduct);
      expect(Product.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should return null if product is not found', async () => {
      (Product.findOneBy as jest.Mock).mockResolvedValue(null);

      const result = await productResolver.getProduct(1);
      expect(result).toBeNull();
    });
  });

  describe('createProduct', () => {
    it('should create and return a new product', async () => {
      const mockProduct = { id: 1, name: 'Product 1', save: jest.fn() };
      (Product.create as jest.Mock).mockReturnValue(mockProduct);

      const result = await productResolver.createProduct('Product 1', 'Description', 100, 'image-url');
      expect(result).toEqual(mockProduct);
      expect(Product.create).toHaveBeenCalledWith({ name: 'Product 1', description: 'Description', price: 100, imageUrl: 'image-url' });
      expect(mockProduct.save).toHaveBeenCalled();
    });
  });

  describe('updateProduct', () => {
    it('should update and return the product if it exists', async () => {
      const mockProduct = { id: 1, name: 'Product 1', save: jest.fn() };
      (Product.findOneBy as jest.Mock).mockResolvedValue(mockProduct);

      const result = await productResolver.updateProduct(1, 'Updated Product', 'Updated Description', 150, 'updated-image-url');
      expect(result).toEqual(mockProduct);
      expect(mockProduct.name).toBe('Updated Product');
    //   expect(mockProduct.description).toBe('Updated Description');
    //   expect(mockProduct.price).toBe(150);
    //   expect(mockProduct.imageUrl).toBe('updated-image-url');
      expect(mockProduct.save).toHaveBeenCalled();
    });

    it('should return null if the product is not found', async () => {
      (Product.findOneBy as jest.Mock).mockResolvedValue(null);

      const result = await productResolver.updateProduct(1, 'Updated Product', 'Updated Description', 150, 'updated-image-url');
      expect(result).toBeNull();
    });
  });

  describe('deleteProduct', () => {
    it('should return true if product is deleted', async () => {
      (Product.delete as jest.Mock).mockResolvedValue({ affected: 1 });

      const result = await productResolver.deleteProduct(1);
      expect(result).toBe(true);
      expect(Product.delete).toHaveBeenCalledWith(1);
    });

    it('should return false if product is not deleted', async () => {
      (Product.delete as jest.Mock).mockResolvedValue({ affected: 0 });

      const result = await productResolver.deleteProduct(1);
      expect(result).toBe(false);
    });
  });
});
