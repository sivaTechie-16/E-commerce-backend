import express, { Request, Response } from 'express';
import cors from 'cors';
import { checkConnection } from './dbConfig';
import { ApolloServer } from 'apollo-server-express';
import { UserResolver } from './Resolvers/user.resolver';
import { ProductResolver } from './Resolvers/product.resolver';
import { OrderResolver } from './Resolvers/order.resolver';
import { buildSchema } from 'type-graphql';
import { typeDefs } from './schema';
require('dotenv').config();



const startServer = async () => {
    const port = process.env.PORT || 3000
    const app = express();
    app.use(cors());

    app.get('/',(req,res)=>{
        res.json('welcome to our project')
    })

    const schema = await buildSchema({
        resolvers: [UserResolver,ProductResolver,OrderResolver],
        
    });

    const server = new ApolloServer({ schema,typeDefs});

    await server.start();

    server.applyMiddleware({ app: app as any, path: '/e-commerce' });

    app.listen(port, () => {
        console.log(`Server is running on port ${port}..😜`);
        checkConnection();
    });
};

startServer();
