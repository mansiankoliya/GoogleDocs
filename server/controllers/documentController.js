import Document from '../models/Document.js';
import User from '../models/User.js';
import fs from 'fs';
import { marked } from 'marked';

// Create document
export const createDocument = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const document = new Document({
      title: title || 'Untitled Document',
      content: content || '',
      owner: req.user.userId
    });
    const savedDoc = await document.save();
    res.status(201).json(savedDoc);
  } catch (error) {
    next(error);
  }
};

// Rename document / Update content
export const updateDocument = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const doc = await Document.findById(req.params.id);
    
    if (!doc) {
      res.status(404);
      throw new Error('Document not found');
    }
    
    if (doc.owner.toString() !== req.user.userId && !doc.sharedWith.includes(req.user.userId)) {
      res.status(403);
      throw new Error('Not authorized to edit this document');
    }
    
    if (title !== undefined) doc.title = title;
    if (content !== undefined) doc.content = content;
    
    const updatedDoc = await doc.save();
    res.json(updatedDoc);
  } catch (error) {
    next(error);
  }
};

// Get document by id
export const getDocumentById = async (req, res, next) => {
  try {
    const doc = await Document.findById(req.params.id)
      .populate('owner', 'username')
      .populate('sharedWith', 'username');
      
    if (!doc) {
      res.status(404);
      throw new Error('Document not found');
    }
    
    if (doc.owner._id.toString() !== req.user.userId && !doc.sharedWith.some(u => u._id.toString() === req.user.userId)) {
      res.status(403);
      throw new Error('Not authorized to view this document');
    }
    
    res.json(doc);
  } catch (error) {
    next(error);
  }
};

// Get all documents (owned and shared)
export const getAllDocuments = async (req, res, next) => {
  try {
    const owned = await Document.find({ owner: req.user.userId }).sort({ updatedAt: -1 });
    const shared = await Document.find({ sharedWith: req.user.userId }).sort({ updatedAt: -1 });
    res.json({ owned, shared });
  } catch (error) {
    next(error);
  }
};

// Share document with another user
export const shareDocument = async (req, res, next) => {
  try {
    const { username } = req.body;
    if (!username) {
      res.status(400);
      throw new Error('Username is required to share');
    }
    
    const doc = await Document.findById(req.params.id);
    if (!doc) {
      res.status(404);
      throw new Error('Document not found');
    }
    
    if (doc.owner.toString() !== req.user.userId) {
      res.status(403);
      throw new Error('Only the owner can share this document');
    }
    
    const userToShare = await User.findOne({ username });
    if (!userToShare) {
      res.status(404);
      throw new Error('User not found');
    }
    
    if (!doc.sharedWith.includes(userToShare._id)) {
      doc.sharedWith.push(userToShare._id);
      await doc.save();
    }
    
    res.json({ message: 'Document shared successfully', document: doc });
  } catch (error) {
    next(error);
  }
};

// Upload .txt or .md file
export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('No file uploaded');
    }
    
    const filePath = req.file.path;
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const title = req.file.originalname;
    
    let htmlContent = fileContent;
    if (title.endsWith('.md')) {
      htmlContent = marked.parse(fileContent);
    } else if (title.endsWith('.txt')) {
      htmlContent = `<p>${fileContent.replace(/\\n/g, '<br>')}</p>`;
    } else {
      fs.unlinkSync(filePath);
      res.status(400);
      throw new Error('Invalid file type. Only .txt and .md allowed');
    }
    
    const document = new Document({
      title,
      content: htmlContent,
      owner: req.user.userId
    });
    
    const savedDoc = await document.save();
    fs.unlinkSync(filePath);
    
    res.status(201).json(savedDoc);
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};
