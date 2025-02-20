import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Container } from 'react-bootstrap';
import './Gallery.css';
import { FaCalendar, FaCamera, FaArrowLeft, FaArrowRight, FaTimes } from 'react-icons/fa';

const FIXED_PHOTOS = [
    {
        _id: 'fixed1',
        url: '/albums/1.jpeg',
        albumTitle: 'School Activities',
        category: 'Activities',
        createdAt: new Date('2024-01-15')
    },
    {
        _id: 'fixed2',
        url: '/albums/2.jpeg',
        albumTitle: 'School Events',
        category: 'Events',
        createdAt: new Date('2024-01-16')
    },
    {
        _id: 'fixed3',
        url: '/albums/3.jpeg',
        albumTitle: 'Celebrations',
        category: 'Celebrations',
        createdAt: new Date('2024-01-17')
    },
    {
        _id: 'fixed4',
        url: '/albums/4.jpeg',
        albumTitle: 'School Activities',
        category: 'Activities',
        createdAt: new Date('2024-01-18')
    },
    {
        _id: 'fixed5',
        url: '/albums/5.jpeg',
        albumTitle: 'Field Trips',
        category: 'Field Trips',
        createdAt: new Date('2024-01-19')
    },
    {
        _id: 'fixed6',
        url: '/albums/6.jpeg',
        albumTitle: 'School Events',
        category: 'Events',
        createdAt: new Date('2024-01-20')
    },
    {
        _id: 'fixed7',
        url: '/albums/7.jpeg',
        albumTitle: 'Celebrations',
        category: 'Celebrations',
        createdAt: new Date('2024-01-21')
    },
    {
        _id: 'fixed8',
        url: '/albums/8.jpeg',
        albumTitle: 'Field Trips',
        category: 'Field Trips',
        createdAt: new Date('2024-01-22')
    },
    {
        _id: 'fixed9',
        url: '/albums/9.jpeg',
        albumTitle: 'School Activities',
        category: 'Activities',
        createdAt: new Date('2024-01-23')
    },
    {
        _id: 'fixed10',
        url: '/albums/10.jpeg',
        albumTitle: 'School Events',
        category: 'Events',
        createdAt: new Date('2024-01-24')
    },
    {
        _id: 'fixed9',
        url: '/albums/11.jpeg',
        albumTitle: 'School Activities',
        category: 'Activities',
        createdAt: new Date('2024-01-23')
    },
    {
        _id: 'fixed10',
        url: '/albums/12.jpeg',
        albumTitle: 'School Events',
        category: 'Events',
        createdAt: new Date('2024-01-24')
    }
];

const Gallery = () => {
    const [albums, setAlbums] = useState([]);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('All Photos');
    const [loading, setLoading] = useState(true);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [viewType, setViewType] = useState('photos');
    const [selectedPhoto, setSelectedPhoto] = useState(null);

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
            if (selectedPhoto) {
                if (e.key === 'ArrowRight') {
                    handleSinglePhotoNext(e);
                } else if (e.key === 'ArrowLeft') {
                    handleSinglePhotoPrev(e);
                } else if (e.key === 'Escape') {
                    setSelectedPhoto(null);
                }
            } else if (selectedAlbum) {
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
    }, [selectedPhoto, selectedAlbum, isFullscreen]);

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

    const categories = ['All Photos','All Albums', 'Events', 'Activities', 'Celebrations', 'Field Trips', 'Other'];
    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        // Set view type based on category
        if (category === 'All Photos') {
            setViewType('photos');
        } else {
            setViewType('albums');
        }
    };

    const getFilteredContent = () => {
        if (selectedCategory === 'All Albums') {
            return albums;
        }
        
        if (selectedCategory === 'All Photos') {
            // For fixed photos, we'll only return these initially
            return FIXED_PHOTOS;
            
            // Once backend is ready, uncomment this to include album photos
            /*
            const albumPhotos = albums.flatMap(album => 
                album.photos.map(photo => ({
                    ...photo,
                    albumTitle: album.title,
                    category: album.category,
                    createdAt: album.createdAt
                }))
            );
            
            return [...FIXED_PHOTOS, ...albumPhotos]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            */
        }
        
        return albums.filter(album => album.category === selectedCategory);
    };

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

    const handlePhotoClick = (photo) => {
        if (selectedCategory === 'All Photos') {
            setSelectedPhoto(photo);
        } else {
            // Existing album photo click logic
            const album = albums.find(a => 
                a.photos.some(p => p._id === photo._id || p.url === photo.url)
            );
            
            if (album) {
                setSelectedAlbum(album);
                const photoIndex = album.photos.findIndex(p => 
                    p._id === photo._id || p.url === photo.url
                );
                setCurrentPhotoIndex(photoIndex);
            }
        }
    };

    const handleSinglePhotoNext = (e) => {
        e.stopPropagation();
        const allPhotos = getFilteredContent();
        const currentIndex = allPhotos.findIndex(p => p._id === selectedPhoto._id);
        const nextIndex = currentIndex === allPhotos.length - 1 ? 0 : currentIndex + 1;
        setSelectedPhoto(allPhotos[nextIndex]);
    };

    const handleSinglePhotoPrev = (e) => {
        e.stopPropagation();
        const allPhotos = getFilteredContent();
        const currentIndex = allPhotos.findIndex(p => p._id === selectedPhoto._id);
        const prevIndex = currentIndex === 0 ? allPhotos.length - 1 : currentIndex - 1;
        setSelectedPhoto(allPhotos[prevIndex]);
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
                    {categories.map(category => (
                        <button
                            key={category}
                            className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                            onClick={() => handleCategoryChange(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {viewType === 'albums' ? (
                <div className="albums-container">
                    {getFilteredContent().map(album => (
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
            ) : (
                <div className="photos-grid">
                    {getFilteredContent().map((photo, index) => (
                        <div 
                            key={photo._id || index} 
                            className={`photo-item ${selectedCategory === 'All Photos' ? 'no-hover-info' : ''}`}
                            onClick={() => handlePhotoClick(photo)}
                        >
                            <img 
                                src={photo.url} 
                                alt={photo.albumTitle}
                                onError={(e) => {
                                    console.error(`Failed to load image: ${photo.url}`);
                                    e.target.src = '/placeholder.jpg';
                                }}
                            />
                            {selectedCategory !== 'All Photos' && (
                                <div className="photo-info">
                                    <span className="photo-album">{photo.albumTitle}</span>
                                    <span className="photo-category">{photo.category}</span>
                                    <span className="photo-date">
                                        {new Date(photo.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {selectedPhoto && (
                <div className="single-photo-view" onClick={() => setSelectedPhoto(null)}>
                    <button className="close-btn" onClick={() => setSelectedPhoto(null)}>
                        <FaTimes />
                    </button>
                    <button className="nav-btn prev" onClick={handleSinglePhotoPrev}>
                        <FaArrowLeft />
                    </button>
                    <img 
                        src={selectedPhoto.url} 
                        alt={selectedPhoto.albumTitle}
                        onClick={(e) => e.stopPropagation()}
                    />
                    <button className="nav-btn next" onClick={handleSinglePhotoNext}>
                        <FaArrowRight />
                    </button>
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