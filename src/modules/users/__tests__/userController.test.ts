import request from 'supertest';
import app from '../../../test/app';
import { User } from '../models/User';

describe('User Controller', () => {
  const testUser = {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
  };

  describe('POST /api/v1/users', () => {
    it('should create a new user with valid data', async () => {
      const response = await request(app)
        .post('/api/v1/users')
        .send(testUser)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(testUser.name);
      expect(response.body.data.email).toBe(testUser.email);
      expect(response.body.data.password).toBeUndefined(); // Password should be hidden
    });

    it('should return 400 for invalid email', async () => {
      const invalidUser = { ...testUser, email: 'invalid-email' };
      const response = await request(app)
        .post('/api/v1/users')
        .send(invalidUser)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Validation failed');
    });

    it('should return 400 for short password', async () => {
      const invalidUser = { ...testUser, password: '123' };
      const response = await request(app)
        .post('/api/v1/users')
        .send(invalidUser)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Validation failed');
    });
  });

  describe('GET /api/v1/users', () => {
    it('should return all active users', async () => {
      // Create test users
      await User.create(testUser);
      await User.create({
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password123',
      });

      const response = await request(app)
        .get('/api/v1/users')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.count).toBe(2);
    });
  });

  describe('GET /api/v1/users/:id', () => {
    it('should return user by ID', async () => {
      const user = await User.create(testUser);

      const response = await request(app)
        .get(`/api/v1/users/${user._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe((user as any)._id.toString());
      expect(response.body.data.name).toBe(testUser.name);
    });

    it('should return 404 for non-existent user', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .get(`/api/v1/users/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('User not found');
    });
  });

  describe('PUT /api/v1/users/:id', () => {
    it('should update user with valid data', async () => {
      const user = await User.create(testUser);
      const updateData = { name: 'Updated Name' };

      const response = await request(app)
        .put(`/api/v1/users/${user._id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.email).toBe(testUser.email);
    });

    it('should return 404 for non-existent user', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .put(`/api/v1/users/${fakeId}`)
        .send({ name: 'Updated Name' })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('User not found');
    });
  });

  describe('DELETE /api/v1/users/:id', () => {
    it('should soft delete user', async () => {
      const user = await User.create(testUser);

      const response = await request(app)
        .delete(`/api/v1/users/${user._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('User deleted successfully');

      // Verify user is soft deleted
      const deletedUser = await User.findById(user._id);
      expect(deletedUser?.isActive).toBe(false);
    });

    it('should return 404 for non-existent user', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
     

      const response = await request(app)
        .delete(`/api/v1/users/${fakeId}`)
        .then(res => res.body);

      expect(response.success).toBe(false);
      expect(response.error.message).toBe('User not found');
    });
  });
}); 