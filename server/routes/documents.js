import express from 'express';
import multer from 'multer';
import { auth } from '../middleware/auth.js';
import {
  createDocument,
  updateDocument,
  getDocumentById,
  getAllDocuments,
  shareDocument,
  uploadFile
} from '../controllers/documentController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Apply auth middleware to all document routes
router.use(auth);

router.get('/', getAllDocuments);
router.post('/', createDocument);
router.get('/:id', getDocumentById);
router.put('/:id', updateDocument);
router.post('/:id/share', shareDocument);
router.post('/upload', upload.single('file'), uploadFile);

export default router;
