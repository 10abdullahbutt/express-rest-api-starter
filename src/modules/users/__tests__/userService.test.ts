import { UserService } from '../services/userService';

describe('UserService', () => {
  const testUserData = {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
  };

  describe('createUser', () => {
    it('should create a new user', async () => {
      const user = await UserService.createUser(testUserData);

      expect(user.name).toBe(testUserData.name);
      expect(user.email).toBe(testUserData.email);
      expect(user.password).toBe(testUserData.password);
      expect(user.isActive).toBe(true);
      expect(user._id).toBeDefined();
    });
  });

  describe('getAllUsers', () => {
    it('should return all active users', async () => {
      await UserService.createUser(testUserData);
      await UserService.createUser({
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password123',
      });

      const users = await UserService.getAllUsers();

      expect(users).toHaveLength(2);
      expect(users[0]?.isActive).toBe(true);
      expect(users[1]?.isActive).toBe(true);
    });

    it('should not return inactive users', async () => {
      const user = await UserService.createUser(testUserData);
      await UserService.deleteUser((user as any)._id.toString());

      const users = await UserService.getAllUsers();

      expect(users).toHaveLength(0);
    });
  });

  describe('getUserById', () => {
    it('should return user by ID', async () => {
      const createdUser = await UserService.createUser(testUserData);
      const user = await UserService.getUserById((createdUser as any)._id.toString());

      expect(user).toBeDefined();
      expect(user?.name).toBe(testUserData.name);
      expect(user?.email).toBe(testUserData.email);
    });

    it('should return null for non-existent user', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const user = await UserService.getUserById(fakeId);

      expect(user).toBeNull();
    });
  });

  describe('getUserByEmail', () => {
    it('should return user by email', async () => {
      await UserService.createUser(testUserData);
      const user = await UserService.getUserByEmail(testUserData.email);

      expect(user).toBeDefined();
      expect(user?.name).toBe(testUserData.name);
      expect(user?.email).toBe(testUserData.email);
    });

    it('should return null for non-existent email', async () => {
      const user = await UserService.getUserByEmail('nonexistent@example.com');

      expect(user).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update user data', async () => {
      const user = await UserService.createUser(testUserData);
      const updateData = { name: 'Updated Name' };

      const updatedUser = await UserService.updateUser((user as any)._id.toString(), updateData);

      expect(updatedUser).toBeDefined();
      expect(updatedUser?.name).toBe(updateData.name);
      expect(updatedUser?.email).toBe(testUserData.email);
    });

    it('should return null for non-existent user', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const updatedUser = await UserService.updateUser(fakeId, { name: 'Updated Name' });

      expect(updatedUser).toBeNull();
    });
  });

  describe('deleteUser', () => {
    it('should soft delete user', async () => {
      const user = await UserService.createUser(testUserData);
      const deletedUser = await UserService.deleteUser((user as any)._id.toString());

      expect(deletedUser).toBeDefined();
      expect(deletedUser?.isActive).toBe(false);

      // Verify user is not returned in getAllUsers
      const allUsers = await UserService.getAllUsers();
      expect(allUsers).toHaveLength(0);
    });
  });

  describe('hardDeleteUser', () => {
    it('should permanently delete user', async () => {
      const user = await UserService.createUser(testUserData);
     
      const deletedUser = await UserService.hardDeleteUser((user as any)._id.toString());

      expect(deletedUser).toBeDefined();

      // Verify user is completely removed
      const foundUser = await UserService.getUserById((user as any)._id.toString());
      expect(foundUser).toBeNull();
    });
  });
}); 