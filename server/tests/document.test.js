import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { jest } from '@jest/globals';
import documentRoutes from '../routes/documents.js';
import Document from '../models/Document.js';

const app = express();
app.use(express.json());

// Mock auth middleware for testing
app.use('/api/documents', (req, res, next) => {
  req.user = { userId: new mongoose.Types.ObjectId().toString() };
  next();
}, documentRoutes);

describe('Document API', () => {
  it('should create a new document', async () => {
    // Mock mongoose save
    Document.prototype.save = jest.fn().mockResolvedValue({
      title: 'Untitled Document',
      content: '',
      _id: 'mockId'
    });
    
    const res = await request(app)
      .post('/api/documents')
      .send({ title: 'Test Doc' });
      
    expect(res.statusCode).toEqual(200);
    expect(res.body.title).toEqual('Untitled Document');
  });
});
