  import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, CreateDateColumn, BaseEntity} from 'typeorm';
  import { User } from './user.model';
  import { Product } from './product.model';
  import { Field, ObjectType } from 'type-graphql';
  @ObjectType()
  @Entity()
  export class Order extends BaseEntity {
      @Field()
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    totalPrice: number;

    @Field()
    @Column()
    status: string; 

    @Field()
    @CreateDateColumn()
    createdAt: Date;

  
    @ManyToOne(() => User, user => user.orders)
    user: User; 

    @ManyToOne(() => Product, product => product.orders)
    product: Product; 
    
    @Column()
    userId:number;

    @Column()
    productId:number
  }
