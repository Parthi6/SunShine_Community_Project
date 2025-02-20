import express from 'express';
import { 
    createAlbum,
    uploadPhotos,
    getAllAlbums,
    getAlbumById,
    deleteAlbum,
    deletePhotos
} from '../controllers/galleryController.js';
import { isAdminAuthenticated } from '../middlewares/auth.js';

const router = express.Router();

// Admin routes
router.post('/create', isAdminAuthenticated, createAlbum);
router.post('/:id/upload', isAdminAuthenticated, uploadPhotos);
router.get('/all', getAllAlbums);
router.get('/:id', getAlbumById);
router.delete('/:id', isAdminAuthenticated, deleteAlbum);
router.post('/:id/delete-photos', isAdminAuthenticated, deletePhotos);

export default router; 