// MongoDB initialization script
// This script runs when the MongoDB container starts for the first time

// Switch to the express-api-starter database
db = db.getSiblingDB('express-api-starter');

// Create collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'email', 'password'],
      properties: {
        name: {
          bsonType: 'string',
          description: 'User name - required'
        },
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
          description: 'Valid email address - required'
        },
        password: {
          bsonType: 'string',
          minLength: 6,
          description: 'Password - required, minimum 6 characters'
        },
        isActive: {
          bsonType: 'bool',
          description: 'User active status'
        }
      }
    }
  }
});

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ isActive: 1 });

// Insert a default admin user (optional)
// Note: In production, you should change this password
db.users.insertOne({
  name: 'Admin User',
  email: 'admin@example.com',
  password: '$2b$10$rQZ8K9mX2nL1pQ3sT5uV7w', // This is a placeholder - use proper bcrypt hash
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

print('✅ MongoDB database initialized successfully');
print('📊 Database: express-api-starter');
print('👥 Collection: users (with validation and indexes)');
print('🔐 Default admin user created'); 