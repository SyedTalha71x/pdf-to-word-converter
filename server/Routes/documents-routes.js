// backend/routes/pdfRoutes.js
import express from 'express';
import multer from 'multer';
import { uploadPdf } from '../Controller/document-controller.js';
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'backend/pdf'); 
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); 
    },
});

const upload = multer({ storage });


router.post('/upload', upload.single('pdf'), uploadPdf);

export default router;
