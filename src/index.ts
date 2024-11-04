import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

// Define the type definitions for Product Management
const typeDefs = `#graphql
  # The "Product" type defines the queryable fields for every product.
  type Product {
    id: ID
    name: String
    price: Float
    stock: Int
  }

  # The "Query" type lists all available queries.
  type Query {
    products: [Product]
    product(id: ID!): Product
  }

  # The "Mutation" type lists all available mutations.
  type Mutation {
    addProduct(name: String!, price: Float!, stock: Int!): Product
    updateProduct(id: ID!, name: String, price: Float, stock: Int): Product
    deleteProduct(id: ID!): Product
  }
`;

// In-memory data store for products
let products = [
  {
    id: '1',
    name: 'Laptop',
    price: 999.99,
    stock: 50,
  },
  {
    id: '2',
    name: 'Smartphone',
    price: 599.99,
    stock: 100,
  },
];

// Define resolvers for handling queries and mutations
const resolvers = {
  Query: {
    products: () => products,
    product: (_, { id }) => products.find(product => product.id === id),
  },
  Mutation: {
    addProduct: (_, { name, price, stock }) => {
      const newProduct = {
        id: (products.length + 1).toString(), // Generate a simple unique ID
        name,
        price,
        stock,
      };
      products.push(newProduct);
      return newProduct;
    },
    updateProduct: (_, { id, name, price, stock }) => {
      const productIndex = products.findIndex(product => product.id === id);
      if (productIndex === -1) return null;

      const updatedProduct = {
        ...products[productIndex],
        ...(name !== undefined && { name }),
        ...(price !== undefined && { price }),
        ...(stock !== undefined && { stock }),
      };

      products[productIndex] = updatedProduct;
      return updatedProduct;
    },
    deleteProduct: (_, { id }) => {
      const productIndex = products.findIndex(product => product.id === id);
      if (productIndex === -1) return null;

      const [deletedProduct] = products.splice(productIndex, 1);
      return deletedProduct;
    },
  },
};

// Create and start the Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
