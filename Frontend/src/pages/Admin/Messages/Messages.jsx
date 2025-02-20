import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEnvelope, FaEnvelopeOpen, FaTrash, FaPhone, FaUser, FaClock } from 'react-icons/fa';
import AdminLayout from '../../../components/AdminLayout';
import './Messages.css';

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all', 'read', 'unread'
    const [selectedMessage, setSelectedMessage] = useState(null);

    const fetchMessages = async () => {
        try {
            const { data } = await axios.get('http://localhost:4000/api/v1/message/all', {
                withCredentials: true
            });
            setMessages(data.messages);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching messages:', error);
            toast.error('Error fetching messages');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await axios.put(
                `http://localhost:4000/api/v1/message/${id}`,
                { status: newStatus },
                { withCredentials: true }
            );

            // Update local state
            setMessages(messages.map(msg => 
                msg._id === id ? { ...msg, status: newStatus } : msg
            ));

            // Update selected message if it's the one being modified
            if (selectedMessage && selectedMessage._id === id) {
                setSelectedMessage({ ...selectedMessage, status: newStatus });
            }

            toast.success(`Message marked as ${newStatus}`);
        } catch (error) {
            console.error('Error updating message status:', error);
            toast.error('Error updating message status');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(
                `http://localhost:4000/api/v1/message/${id}`,
                { withCredentials: true }
            );

            // Update local state
            setMessages(messages.filter(msg => msg._id !== id));
            if (selectedMessage && selectedMessage._id === id) {
                setSelectedMessage(null);
            }

            toast.success('Message deleted successfully');
        } catch (error) {
            console.error('Error deleting message:', error);
            toast.error('Error deleting message');
        }
    };

    const filteredMessages = messages.filter(msg => {
        if (filter === 'all') return true;
        return msg.status === filter;
    });

    const getTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + ' years ago';
        
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + ' months ago';
        
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + ' days ago';
        
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + ' hours ago';
        
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + ' minutes ago';
        
        return Math.floor(seconds) + ' seconds ago';
    };

    if (loading) return (
        <AdminLayout>
            <div>Loading...</div>
        </AdminLayout>
    );

    return (
        <AdminLayout>
            <div className="messages-dashboard">
                <div className="messages-sidebar">
                    <div className="messages-header">
                        <h2>Messages</h2>
                        <div className="filter-buttons">
                            <button 
                                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                                onClick={() => setFilter('all')}
                            >
                                All
                            </button>
                            <button 
                                className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
                                onClick={() => setFilter('unread')}
                            >
                                Unread
                            </button>
                            <button 
                                className={`filter-btn ${filter === 'read' ? 'active' : ''}`}
                                onClick={() => setFilter('read')}
                            >
                                Read
                            </button>
                        </div>
                    </div>

                    <div className="messages-list">
                        {filteredMessages.map(message => (
                            <div 
                                key={message._id}
                                className={`message-item ${selectedMessage?._id === message._id ? 'active' : ''} ${message.status === 'unread' ? 'unread' : ''}`}
                                onClick={() => setSelectedMessage(message)}
                            >
                                <div className="message-icon">
                                    {message.status === 'unread' ? <FaEnvelope /> : <FaEnvelopeOpen />}
                                </div>
                                <div className="message-preview">
                                    <div className="message-sender">{message.name}</div>
                                    <div className="message-excerpt">{message.message.substring(0, 50)}...</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="message-detail">
                    {selectedMessage ? (
                        <div className="message-content">
                            <div className="message-actions">
                                <button 
                                    onClick={() => handleStatusUpdate(
                                        selectedMessage._id, 
                                        selectedMessage.status === 'read' ? 'unread' : 'read'
                                    )}
                                    className="action-btn"
                                >
                                    Mark as {selectedMessage.status === 'read' ? 'Unread' : 'Read'}
                                </button>
                                <button 
                                    onClick={() => handleDelete(selectedMessage._id)}
                                    className="action-btn delete"
                                >
                                    Delete
                                </button>
                            </div>
                            <div className="message-header">
                                <h3>{selectedMessage.name}</h3>
                                <div className="message-info">
                                    <span><FaUser /> {selectedMessage.email}</span>
                                    <span><FaPhone /> {selectedMessage.phone}</span>
                                    <span><FaClock /> {new Date(selectedMessage.createdAt).toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="message-body">
                                {selectedMessage.message}
                            </div>
                        </div>
                    ) : (
                        <div className="no-message-selected">
                            <FaEnvelope />
                            <p>Select a message to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default Messages; 