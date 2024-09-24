import { OrderResolver } from "./order.resolver";
import { Order } from "../models/order.model";
import { User } from "../models/user.model";
import { Product } from "../models/product.model";
import "reflect-metadata";

// Mocking TypeORM methods
jest.mock("../models/order.model", () => ({
  Order: {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock("../models/user.model", () => ({
  User: {
    findOneBy: jest.fn(),
  },
}));

jest.mock("../models/product.model", () => ({
  Product: {
    findOneBy: jest.fn(),
  },
}));

describe("OrderResolver", () => {
  let resolver: OrderResolver;

  beforeEach(() => {
    resolver = new OrderResolver();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getOrders", () => {
    it("should return all orders with relations", async () => {
      const mockOrders = [{ id: 1, user: {}, product: {} }];
      (Order.find as jest.Mock).mockResolvedValue(mockOrders);

      const result = await resolver.getOrders();

      expect(Order.find).toHaveBeenCalledWith({
        relations: ["user", "product"],
      });
      expect(result).toEqual(mockOrders);
    });
  });

  describe("getOrder", () => {
    it("should return a single order by ID", async () => {
      const mockOrder = { id: 1, user: {}, product: {} };
      (Order.findOne as jest.Mock).mockResolvedValue(mockOrder);

      const result = await resolver.getOrder(1);

      expect(Order.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ["user", "product"],
      });
      expect(result).toEqual(mockOrder);
    });
  });

  describe("createOrder", () => {
    it("should create a new order", async () => {
      const mockUser = { id: 1 };
      const mockProduct = { id: 1 };
      const mockOrder = {
        id: 1,
        user: mockUser,
        product: mockProduct,
        totalPrice: 100,
        status: "pending",
      };

      (User.findOneBy as jest.Mock).mockResolvedValue(mockUser);
      (Product.findOneBy as jest.Mock).mockResolvedValue(mockProduct);
      (Order.create as jest.Mock).mockReturnValue(mockOrder);
      (Order.save as jest.Mock).mockResolvedValue(mockOrder);

      const result = await resolver.createOrder(1, 1, 100, "pending");

      expect(User.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(Product.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(Order.create).toHaveBeenCalledWith({
        user: mockUser,
        product: mockProduct,
        totalPrice: 100,
        status: "pending",
      });
      expect(Order.save).toHaveBeenCalled();
      expect(result).toEqual(mockOrder);
    });
  });

  describe("updateOrder", () => {
    it("should update an existing order", async () => {
      const mockOrder = {
        id: 1,
        totalPrice: 100,
        status: "pending",
        save: jest.fn(),
      };
      (Order.findOneBy as jest.Mock).mockResolvedValue(mockOrder);

      const result = await resolver.updateOrder(1, 150, "shipped");

      expect(Order.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockOrder.totalPrice).toBe(150);
      expect(mockOrder.status).toBe("shipped");
      expect(mockOrder.save).toHaveBeenCalled();
      expect(result).toEqual(mockOrder);
    });
  });

  describe("deleteOrder", () => {
    it("should delete an order", async () => {
      (Order.delete as jest.Mock).mockResolvedValue({ affected: 1 });

      const result = await resolver.deleteOrder(1);

      expect(Order.delete).toHaveBeenCalledWith(1);
      expect(result).toBe(true);
    });
  });
});
