import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type User {
    id: ID
    name: String
    email: String
  }

  type Product {
    id: ID
    name: String
    description: String
    price: Float
    imageUrl: String
  }

  type Order {
    id: ID
    user: User
    products: Product
    totalPrice: Float
    status: String
  }

  type Query {
    getUsers: [User]
    getUser(id: ID): User
    getProducts: [Product]
    getProduct(id: ID): Product
    getOrders: [Order]
    getOrder(id: ID): Order
  }

  type Mutation {
    createUser(name: String, email: String): User
    createProduct(
      name: String
      description: String
      price: Float
      imageUrl: String
    ): Product
    createOrder(
      userId: ID
      productIds: ID
      totalPrice: Float
      status: String
    ): Order
    updateOrder(
      id: ID
      totalPrice: Float
      status: String
      productIds: [ID]
      userId: ID
    ): Order
    deleteOrder(id: ID): Boolean
  }
`;
