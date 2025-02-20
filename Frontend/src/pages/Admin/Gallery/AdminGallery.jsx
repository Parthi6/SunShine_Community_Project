import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import AdminLayout from '../../../components/AdminLayout';
import './AdminGallery.css';
import { FaTrash, FaEdit, FaUpload, FaEye, FaTimes, FaUndo, FaTimesCircle } from 'react-icons/fa';

const AdminGallery = () => {
    const [albums, setAlbums] = useState([]);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [newAlbum, setNewAlbum] = useState({
        title: '',
        description: '',
        category: 'Events'
    });
    const [editingAlbum, setEditingAlbum] = useState(null);
    const [selectedPhotosToDelete, setSelectedPhotosToDelete] = useState([]);
    const [viewingAlbum, setViewingAlbum] = useState(null);

    useEffect(() => {
        fetchAlbums();
    }, []);

    const fetchAlbums = async () => {
        try {
            const { data } = await axios.get('http://localhost:4000/api/v1/gallery/all', {
                withCredentials: true
            });
            setAlbums(data.albums);
        } catch (error) {
            toast.error('Error fetching albums');
        }
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(files);

        // Create preview URLs
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                // You could store previews in state if you want to show them
            };
            reader.readAsDataURL(file);
        });
    };

    const handleNewAlbum = async (e) => {
        e.preventDefault();
        setIsUploading(true);

        try {
            const albumResponse = await axios.post(
                'http://localhost:4000/api/v1/gallery/create',
                newAlbum,
                { withCredentials: true }
            );

            if (selectedFiles.length > 0) {
                const formData = new FormData();
                selectedFiles.forEach(file => {
                    formData.append('photos', file);
                });

                await axios.post(
                    `http://localhost:4000/api/v1/gallery/${albumResponse.data.album._id}/upload`,
                    formData,
                    {
                        withCredentials: true,
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
            }

            toast.success('Album created successfully');
            setNewAlbum({ title: '', description: '', category: 'Events' });
            setSelectedFiles([]);
            setSelectedAlbum(null);
            fetchAlbums();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error creating album');
        } finally {
            setIsUploading(false);
        }
    };

    const handlePhotoUpload = async (e, albumId) => {
        const files = Array.from(e.target.files);
        setIsUploading(true);

        try {
            const formData = new FormData();
            files.forEach(file => {
                formData.append('photos', file);
            });

            const { data } = await axios.post(
                `http://localhost:4000/api/v1/gallery/${albumId}/upload`,
                formData,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            setAlbums(albums.map(album => 
                album._id === albumId ? data.album : album
            ));
            toast.success('Photos uploaded successfully');
        } catch (error) {
            console.error('Upload error:', error);
            toast.error(error.response?.data?.message || 'Error uploading photos');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeleteAlbum = async (albumId) => {
        if (window.confirm('Are you sure you want to delete this album? This action cannot be undone.')) {
            try {
                await axios.delete(
                    `http://localhost:4000/api/v1/gallery/${albumId}`,
                    { withCredentials: true }
                );
                
                toast.success('Album deleted successfully');
                setAlbums(albums.filter(album => album._id !== albumId));
            } catch (error) {
                toast.error(error.response?.data?.message || 'Error deleting album');
            }
        }
    };

    const handleEditAlbum = async (e) => {
        e.preventDefault();
        try {
            await axios.put(
                `http://localhost:4000/api/v1/gallery/${editingAlbum._id}`,
                {
                    title: editingAlbum.title,
                    description: editingAlbum.description,
                    category: editingAlbum.category
                },
                { withCredentials: true }
            );
            
            toast.success('Album updated successfully');
            setEditingAlbum(null);
            fetchAlbums();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating album');
        }
    };

    const handleDeletePhotos = async (albumId) => {
        if (selectedPhotosToDelete.length === 0) return;

        if (!window.confirm(`Are you sure you want to delete ${selectedPhotosToDelete.length} photo(s)?`)) {
            return;
        }

        try {
            await axios.post(
                `http://localhost:4000/api/v1/gallery/${albumId}/delete-photos`,
                { photoIds: selectedPhotosToDelete },
                { withCredentials: true }
            );
            
            // Update the editingAlbum state to remove deleted photos
            setEditingAlbum(prevAlbum => ({
                ...prevAlbum,
                photos: prevAlbum.photos.filter(photo => !selectedPhotosToDelete.includes(photo._id))
            }));

            // Update the albums state to reflect the changes
            setAlbums(prevAlbums => 
                prevAlbums.map(album => 
                    album._id === albumId 
                        ? {
                            ...album,
                            photos: album.photos.filter(photo => !selectedPhotosToDelete.includes(photo._id))
                          }
                        : album
                )
            );
            
            toast.success('Photos deleted successfully');
            setSelectedPhotosToDelete([]); // Clear selected photos
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error deleting photos');
        }
    };

    // Update the photo selection handler
    const handlePhotoSelection = (photoId) => {
        setSelectedPhotosToDelete(prev => 
            prev.includes(photoId)
                ? prev.filter(id => id !== photoId)
                : [...prev, photoId]
        );
    };

    return (
        <AdminLayout>
            <div className="admin-gallery">
                <div className="gallery-header">
                    <h1>Gallery Management</h1>
                    <button 
                        className="new-album-btn"
                        onClick={() => setSelectedAlbum('new')}
                    >
                        Create New Album
                    </button>
                </div>

                {selectedAlbum === 'new' && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h2>Create New Album</h2>
                                <button 
                                    className="close-modal-btn"
                                    onClick={() => setSelectedAlbum(null)}
                                >
                                    ×
                                </button>
                            </div>
                            <form onSubmit={handleNewAlbum}>
                                <div className="form-group">
                                    <label>Album Title</label>
                                    <input
                                        type="text"
                                        value={newAlbum.title}
                                        onChange={(e) => setNewAlbum({
                                            ...newAlbum,
                                            title: e.target.value
                                        })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Category</label>
                                    <select
                                        value={newAlbum.category}
                                        onChange={(e) => setNewAlbum({
                                            ...newAlbum,
                                            category: e.target.value
                                        })}
                                    >
                                        <option value="Events">Events</option>
                                        <option value="Activities">Activities</option>
                                        <option value="Celebrations">Celebrations</option>
                                        <option value="Field Trips">Field Trips</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea
                                        value={newAlbum.description}
                                        onChange={(e) => setNewAlbum({
                                            ...newAlbum,
                                            description: e.target.value
                                        })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Upload Photos</label>
                                    <div className="file-upload-container">
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleFileSelect}
                                            className="file-input"
                                        />
                                        <div className="selected-files">
                                            {selectedFiles.length > 0 && (
                                                <span>{selectedFiles.length} files selected</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    type="submit" 
                                    className="submit-btn"
                                    disabled={isUploading}
                                >
                                    {isUploading ? 'Creating Album...' : 'Create Album'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                <div className="albums-grid">
                    {albums.map(album => (
                        <div key={album._id} className="album-card">
                            <div className="album-header">
                                <h3>{album.title}</h3>
                                <div className="album-actions-top">
                                    <button 
                                        className="edit-album-btn"
                                        onClick={() => setEditingAlbum(album)}
                                    >
                                        <FaEdit />
                                    </button>
                                    <button 
                                        className="delete-album-btn"
                                        onClick={() => handleDeleteAlbum(album._id)}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                            <span className="album-category">{album.category}</span>
                            <div className="album-photos">
                                {album.photos.slice(0, 4).map((photo, index) => (
                                    <img 
                                        key={index}
                                        src={photo.url} 
                                        alt={`Album preview ${index + 1}`}
                                    />
                                ))}
                            </div>
                            <div className="album-actions">
                                <input
                                    type="file"
                                    id={`photo-upload-${album._id}`}
                                    multiple
                                    accept="image/*"
                                    onChange={(e) => handlePhotoUpload(e, album._id)}
                                    style={{ display: 'none' }}
                                />
                                <label 
                                    htmlFor={`photo-upload-${album._id}`}
                                    className="action-btn upload-btn"
                                >
                                    <FaUpload /> Upload Photos
                                </label>
                                <button 
                                    className="action-btn view-btn"
                                    onClick={() => setViewingAlbum(album)}
                                >
                                    <FaEye /> View Album
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {editingAlbum && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h2>Edit Album</h2>
                                <button 
                                    className="close-modal-btn"
                                    onClick={() => setEditingAlbum(null)}
                                >
                                    <FaTimes />
                                </button>
                            </div>
                            <form onSubmit={handleEditAlbum}>
                                <div className="form-group">
                                    <label>Album Title</label>
                                    <input
                                        type="text"
                                        value={editingAlbum.title}
                                        onChange={(e) => setEditingAlbum({
                                            ...editingAlbum,
                                            title: e.target.value
                                        })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Category</label>
                                    <select
                                        value={editingAlbum.category}
                                        onChange={(e) => setEditingAlbum({
                                            ...editingAlbum,
                                            category: e.target.value
                                        })}
                                    >
                                        <option value="Events">Events</option>
                                        <option value="Activities">Activities</option>
                                        <option value="Celebrations">Celebrations</option>
                                        <option value="Field Trips">Field Trips</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea
                                        value={editingAlbum.description}
                                        onChange={(e) => setEditingAlbum({
                                            ...editingAlbum,
                                            description: e.target.value
                                        })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Photos</label>
                                    <div className="photos-grid">
                                        {editingAlbum.photos.map((photo) => (
                                            <div 
                                                key={photo._id} 
                                                className={`photo-item ${
                                                    selectedPhotosToDelete.includes(photo._id) ? 'selected' : ''
                                                }`}
                                            >
                                                <img src={photo.url} alt="Album photo" />
                                                <div className="photo-actions">
                                                    <button
                                                        type="button"
                                                        className="photo-action-btn delete"
                                                        onClick={() => handlePhotoSelection(photo._id)}
                                                    >
                                                        {selectedPhotosToDelete.includes(photo._id) ? 
                                                            <FaUndo /> : <FaTrash />}
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {selectedPhotosToDelete.length > 0 && (
                                        <button
                                            type="button"
                                            className="delete-selected-btn"
                                            onClick={() => handleDeletePhotos(editingAlbum._id)}
                                        >
                                            Delete Selected Photos ({selectedPhotosToDelete.length})
                                        </button>
                                    )}
                                </div>
                                <div className="form-actions">
                                    <button type="submit" className="submit-btn">
                                        Update Album
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {viewingAlbum && (
                    <div className="modal-overlay">
                        <div className="album-view-modal">
                            <div className="album-view-header">
                                <h2>{viewingAlbum.title}</h2>
                                <button 
                                    className="close-view-btn"
                                    onClick={() => setViewingAlbum(null)}
                                >
                                    <FaTimesCircle />
                                </button>
                            </div>
                            <div className="album-view-details">
                                <p><strong>Category:</strong> {viewingAlbum.category}</p>
                                {viewingAlbum.description && (
                                    <p><strong>Description:</strong> {viewingAlbum.description}</p>
                                )}
                                <p><strong>Total Photos:</strong> {viewingAlbum.photos.length}</p>
                            </div>
                            <div className="album-view-photos">
                                {viewingAlbum.photos.map((photo, index) => (
                                    <div key={photo._id || index} className="album-view-photo">
                                        <img 
                                            src={photo.url} 
                                            alt={`Photo ${index + 1}`}
                                            loading="lazy"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminGallery; 