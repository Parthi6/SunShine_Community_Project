import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Container } from 'react-bootstrap';
import './Gallery.css';
import { FaCalendar, FaCamera, FaArrowLeft, FaArrowRight, FaTimes } from 'react-icons/fa';

const Gallery = () => {
    const [albums, setAlbums] = useState([]);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [loading, setLoading] = useState(true);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        fetchAlbums();
    }, []);

    useEffect(() => {
        if (selectedAlbum) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }

        return () => {
            document.body.classList.remove('modal-open');
        };
    }, [selectedAlbum]);

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (selectedAlbum) {
                if (e.key === 'ArrowRight') {
                    handleNextPhoto(e);
                } else if (e.key === 'ArrowLeft') {
                    handlePrevPhoto(e);
                } else if (e.key === 'Escape') {
                    if (isFullscreen) {
                        setIsFullscreen(false);
                    } else {
                        setSelectedAlbum(null);
                    }
                }
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [selectedAlbum, isFullscreen]);

    const fetchAlbums = async () => {
        try {
            const { data } = await axios.get('http://localhost:4000/api/v1/gallery/all');
            if (data.success && data.albums) {
                // Sort albums by creation date (newest first)
                const sortedAlbums = data.albums.sort((a, b) => 
                    new Date(b.createdAt) - new Date(a.createdAt)
                );
                setAlbums(sortedAlbums);
            }
        } catch (error) {
            console.error('Error loading gallery:', error);
            toast.error('Error loading gallery');
        } finally {
            setLoading(false);
        }
    };

    const categories = ['Events', 'Activities', 'Celebrations', 'Field Trips', 'Other'];
    const filteredAlbums = selectedCategory === 'all' 
        ? albums 
        : albums.filter(album => album.category === selectedCategory);

    const handleNextPhoto = (e) => {
        e.stopPropagation();
        if (selectedAlbum) {
            setCurrentPhotoIndex((prev) => 
                prev === selectedAlbum.photos.length - 1 ? 0 : prev + 1
            );
        }
    };

    const handlePrevPhoto = (e) => {
        e.stopPropagation();
        if (selectedAlbum) {
            setCurrentPhotoIndex((prev) => 
                prev === 0 ? selectedAlbum.photos.length - 1 : prev - 1
            );
        }
    };

    const handleAlbumClick = (album) => {
        setSelectedAlbum(album);
        setCurrentPhotoIndex(0);
    };

    if (loading) {
        return (
            <div className="gallery-loading">
                <div className="loading-spinner"></div>
                <p>Loading gallery...</p>
            </div>
        );
    }

    return (
        <Container fluid className="gallery-page">
            <div className="gallery-header">
                <h1>Our Gallery</h1>
                <p className="gallery-subtitle">Explore our memorable moments and activities</p>
                
                <div className="category-filter">
                    <button 
                        className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                        onClick={() => setSelectedCategory('all')}
                    >
                        All
                    </button>
                    {categories.map(category => (
                        <button
                            key={category}
                            className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {filteredAlbums.length === 0 ? (
                <div className="no-albums">
                    <p>No albums found in this category.</p>
                </div>
            ) : (
                <div className="albums-container">
                    {filteredAlbums.map(album => (
                        <div key={album._id} className="album-preview" onClick={() => handleAlbumClick(album)}>
                            <div className="album-cover">
                                {album.photos[0] ? (
                                    <img src={album.photos[0].url} alt={album.title} />
                                ) : (
                                    <div className="no-photos">No photos yet</div>
                                )}
                            </div>
                            <div className="album-info">
                                <div className="album-title-container" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                    <h3>{album.title}</h3>
                                    <span className="album-category-tag" style={{marginLeft: '-5px'}}>{album.category}</span>
                                </div>
                                {album.description && (
                                    <p className="album-description">{album.description}</p>
                                )}
                                <div className="album-meta">
                                    <span className="album-date">
                                        <FaCalendar />
                                        {new Date(album.createdAt).toLocaleDateString()}
                                    </span>
                                    <span className="photo-count">
                                        <FaCamera />
                                        {album.photos.length} photos
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedAlbum && (
                <div className="photo-modal" onClick={() => setSelectedAlbum(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="close-btn" onClick={() => setSelectedAlbum(null)}>
                            <FaTimes />
                        </button>
                        <div className="modal-header">
                            <h2 style={{marginLeft: '30px',marginTop: '30px'}}>{selectedAlbum.title}</h2>
                            <span className="modal-category" style={{marginTop: '40px',marginLeft: '30px'}}>{selectedAlbum.category}</span>
                        </div>
                        <div className="photo-counter" style={{marginBottom: '-15px', color: 'black',outline: 'none', border: 'none', background: 'none', fontSize: '1.2rem', fontWeight: 'bold', textAlign: 'center', width: '100%'}}>
                                {currentPhotoIndex + 1} / {selectedAlbum.photos.length}
                            </div>
                        
                        <div className="photo-slider">
                            <div className="photo-display">
                                <button className="nav-btn prev" onClick={handlePrevPhoto}>
                                    <FaArrowLeft />
                                </button>
                                <img 
                                    src={selectedAlbum.photos[currentPhotoIndex].url} 
                                    alt={`${selectedAlbum.title} - Photo ${currentPhotoIndex + 1}`}
                                    onClick={() => setIsFullscreen(true)}
                                    style={{ cursor: 'pointer' }}
                                />
                                <button className="nav-btn next" onClick={handleNextPhoto}>
                                    <FaArrowRight />
                                </button>
                            </div>
                        </div>

                        <div className="photo-thumbnails">
                            {selectedAlbum.photos.map((photo, index) => (
                                <div 
                                    key={index}
                                    className={`thumbnail ${index === currentPhotoIndex ? 'active' : ''}`}
                                    onClick={() => setCurrentPhotoIndex(index)}
                                >
                                    <img 
                                        src={photo.url} 
                                        alt={`Thumbnail ${index + 1}`}
                                        loading="lazy"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {isFullscreen && selectedAlbum && (
                <div 
                    className="fullscreen-view"
                    onClick={() => setIsFullscreen(false)}
                >
                    <button 
                        className="close-btn fullscreen-close"
                        onClick={() => setIsFullscreen(false)}
                    >
                        <FaTimes />
                    </button>
                    <button 
                        className="nav-btn prev fullscreen-nav"
                        onClick={handlePrevPhoto}
                    >
                        <FaArrowLeft />
                    </button>
                    <img 
                        src={selectedAlbum.photos[currentPhotoIndex].url}
                        alt={`${selectedAlbum.title} - Photo ${currentPhotoIndex + 1}`}
                        onClick={(e) => e.stopPropagation()}
                    />
                    <button 
                        className="nav-btn next fullscreen-nav"
                        onClick={handleNextPhoto}
                    >
                        <FaArrowRight />
                    </button>
                    <div className="fullscreen-counter">
                        {currentPhotoIndex + 1} / {selectedAlbum.photos.length}
                    </div>
                </div>
            )}
        </Container>
    );
};

export default Gallery; 