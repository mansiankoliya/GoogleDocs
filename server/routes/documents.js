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
import os from 'os';

const router = express.Router();
// Configure multer to save files to the /tmp directory (Vercel requires this)
const upload = multer({ dest: os.tmpdir() + '/uploads/' });

// Apply auth middleware to all document routes
router.use(auth);

router.get('/', getAllDocuments);
router.post('/', createDocument);
router.get('/:id', getDocumentById);
router.put('/:id', updateDocument);
router.post('/:id/share', shareDocument);
router.post('/upload', upload.single('file'), uploadFile);

export default router;
