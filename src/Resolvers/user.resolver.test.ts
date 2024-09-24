import { UserResolver } from './user.resolver';
import { User } from '../models/user.model';
import { hash, compare } from 'bcryptjs';
import { AuthenticationError } from 'apollo-server-express';

// Mock the User model methods
jest.mock('../models/user.model', () => ({
  User: {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('UserResolver', () => {
  let userResolver: UserResolver;

  beforeEach(() => {
    userResolver = new UserResolver();
  });

  describe('getUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [{ id: 1, name: 'John',email:'john123@gmail.com',role:'admin' }];
      (User.find as jest.Mock).mockResolvedValue(mockUsers);

      const result = await userResolver.getUsers();
      expect(result).toEqual(mockUsers);
    });
  });

  describe('getUser', () => {
    it('should return a user by id', async () => {
      const mockUser = { id: 1, name: 'John' };
      (User.findOneBy as jest.Mock).mockResolvedValue(mockUser);

      const result = await userResolver.getUser(1);
      expect(result).toEqual(mockUser);
    });

    it('should return null if user is not found', async () => {
      (User.findOneBy as jest.Mock).mockResolvedValue(null);

      const result = await userResolver.getUser(1);
      expect(result).toBeNull();
    });
  });

  describe('register', () => {
    it('should create and return a new user', async () => {
      const mockUser = { id: 1, name: 'John', email: 'john@example.com',role:'admin', save: jest.fn() };
      (User.findOneBy as jest.Mock).mockResolvedValue(null);
      (User.create as jest.Mock).mockReturnValue(mockUser);
      (hash as jest.Mock).mockResolvedValue('hashedPassword');

      const result = await userResolver.register('John', 'john@example.com', 'password','admin');
      expect(result).toEqual(mockUser);
      expect(mockUser.save).toHaveBeenCalled();
    });

    it('should throw an error if user already exists', async () => {
      (User.findOneBy as jest.Mock).mockResolvedValue({ id: 1, email: 'john@example.com' });

      await expect(userResolver.register('John', 'john@example.com', 'password','admin')).rejects.toThrow(
        'User with this email already exists.'
      );
    });
  });

  describe('login', () => {
    it('should return the user if login is successful', async () => {
      const mockUser = { id: 1, email: 'john@example.com', password: 'hashedPassword' };
      (User.findOneBy as jest.Mock).mockResolvedValue(mockUser);
      (compare as jest.Mock).mockResolvedValue(true);

      const result = await userResolver.login('john@example.com', 'password');
      expect(result).toEqual(mockUser);
    });

    it('should throw an error if email is invalid', async () => {
      (User.findOneBy as jest.Mock).mockResolvedValue(null);

      await expect(userResolver.login('john@example.com', 'password')).rejects.toThrow(
        AuthenticationError
      );
    });

    it('should throw an error if password is invalid', async () => {
      const mockUser = { id: 1, email: 'john@example.com', password: 'hashedPassword' };
      (User.findOneBy as jest.Mock).mockResolvedValue(mockUser);
      (compare as jest.Mock).mockResolvedValue(false);

      await expect(userResolver.login('john@example.com', 'password')).rejects.toThrow(
        AuthenticationError
      );
    });
  });

  describe('updateUser', () => {
    it('should update and return the user', async () => {
      const mockUser = { id: 1, name: 'John', save: jest.fn() };
      (User.findOneBy as jest.Mock).mockResolvedValue(mockUser);
      (hash as jest.Mock).mockResolvedValue('newHashedPassword');

      const result = await userResolver.updateUser(1, 'Jane', 'jane@example.com', 'newpassword');
      expect(result).toEqual(mockUser);
      expect(mockUser.name).toBe('Jane');
     
      expect(mockUser.save).toHaveBeenCalled();
    });

    it('should return null if the user is not found', async () => {
      (User.findOneBy as jest.Mock).mockResolvedValue(null);

      const result = await userResolver.updateUser(1, 'Jane', 'jane@example.com', 'newpassword');
      expect(result).toBeNull();
    });
  });

  describe('deleteUser', () => {
    it('should return true if user is deleted', async () => {
      (User.delete as jest.Mock).mockResolvedValue({ affected: 1 });

      const result = await userResolver.deleteUser(1);
      expect(result).toBe(true);
    });

    it('should return false if user is not deleted', async () => {
      (User.delete as jest.Mock).mockResolvedValue({ affected: 0 });

      const result = await userResolver.deleteUser(1);
      expect(result).toBe(false);
    });
  });
});
