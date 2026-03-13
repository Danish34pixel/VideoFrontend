import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Video as VideoIcon, LogOut, Loader2, Trash2, Settings, BarChart2, Users } from 'lucide-react';
import api from '../services/api';
import axios from 'axios';

const AdminDashboard = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videos, setVideos] = useState([]);
  const [users, setUsers] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'A';

  useEffect(() => { 
    fetchVideos(); 
    fetchUsers();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data } = await api.get('/videos');
      setVideos(data);
    } catch (err) {
      console.error('Failed to fetch videos');
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users');
    }
  };

  const handleApprove = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await api.put(`/users/approve/${id}`, { 
        isApproved: newStatus,
        paymentStatus: newStatus ? 'paid' : 'pending'
      });
      setSuccessMsg(newStatus ? 'User approved!' : 'User access revoked.');
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a video file');

    const MAX_SIZE = 100 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return alert(
        `File too large (${(file.size / (1024 * 1024)).toFixed(1)}MB).\n\n` +
        "Cloudinary Free Plan limit is 100MB. Please compress or upgrade your plan."
      );
    }

    setLoading(true);
    setUploadProgress(0);
    setSuccessMsg('');

    try {
      const { data: signData } = await api.get('/videos/sign');

      const uploadFile = async (item, type) => {
        const uniqueId = Math.random().toString(36).substring(2, 11) + Date.now().toString(36);

        if (type === 'image') {
          const formData = new FormData();
          formData.append('file', item);
          formData.append('api_key', signData.apiKey);
          formData.append('timestamp', signData.timestamp);
          formData.append('signature', signData.signature);
          formData.append('folder', 'company_assets');
          const res = await axios.post(`https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`, formData);
          return res.data;
        }

        const chunkSize = 6 * 1024 * 1024;
        const totalChunks = Math.ceil(item.size / chunkSize);
        let lastRes = null;

        for (let i = 0; i < totalChunks; i++) {
          const start = i * chunkSize;
          const end = Math.min(start + chunkSize, item.size);
          const chunk = item.slice(start, end);
          const formData = new FormData();
          formData.append('file', chunk);
          formData.append('api_key', signData.apiKey);
          formData.append('timestamp', signData.timestamp);
          formData.append('signature', signData.signature);
          formData.append('folder', 'company_assets');
          const headers = {
            'X-Unique-Upload-Id': uniqueId,
            'Content-Range': `bytes ${start}-${end - 1}/${item.size}`,
          };
          lastRes = await axios.post(
            `https://api.cloudinary.com/v1_1/${signData.cloudName}/video/upload`,
            formData,
            {
              headers,
              onUploadProgress: (progressEvent) => {
                const chunkProgress = (progressEvent.loaded / progressEvent.total) * 100;
                const overall = Math.round(((i * 100) + chunkProgress) / totalChunks);
                setUploadProgress(overall);
              }
            }
          );
        }
        return lastRes.data;
      };

      let thumbRes = null;
      if (thumbnail) thumbRes = await uploadFile(thumbnail, 'image');
      const videoRes = await uploadFile(file, 'video');

      await api.post('/videos/record', {
        title,
        description,
        cloudinaryUrl: videoRes.secure_url,
        cloudinaryPublicId: videoRes.public_id,
        thumbnailUrl: thumbRes ? thumbRes.secure_url : '',
        thumbnailPublicId: thumbRes ? thumbRes.public_id : '',
      });

      setSuccessMsg('🎉 Video uploaded successfully!');
      setTitle('');
      setDescription('');
      setFile(null);
      setThumbnail(null);
      setUploadProgress(0);
      fetchVideos();
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || err.message || 'Upload failed.';
      alert(`Upload Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this video? This cannot be undone.')) return;
    try {
      await api.delete(`/videos/${id}`);
      setSuccessMsg('Video deleted successfully.');
      fetchVideos();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete video');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <>
      <div className="page-bg" />
      <div className="dashboard-root">

        {/* ── Navbar ── */}
        <nav className="navbar glass">
          <div className="navbar-brand">
            <div className="navbar-icon">⚙️</div>
            <div className="navbar-brand-text">
              <h1>True Online Earning</h1>
              <p>Admin Control Panel</p>
            </div>
          </div>
          <div className="navbar-right">
            <span className="badge badge-amber">
              <Settings size={10} /> Admin
            </span>
            <div className="user-pill">
              <div className="user-avatar">{initials}</div>
              <span>{user?.fullName}</span>
            </div>
            <button
              id="admin-logout-btn"
              onClick={handleLogout}
              className="btn btn-ghost btn-sm"
              title="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </nav>

        {/* ── Stats Bar ── */}
        <div className="stats-bar">
          <div className="stat-card glass">
            <div className="stat-icon purple"><VideoIcon size={20} /></div>
            <div className="stat-info">
              <h3>{videos.length}</h3>
              <p>Total Videos</p>
            </div>
          </div>
          <div className="stat-card glass">
            <div className="stat-icon amber"><BarChart2 size={20} /></div>
            <div className="stat-info">
              <h3>Live</h3>
              <p>Platform Status</p>
            </div>
          </div>
            <div className="stat-card glass">
            <div className="stat-icon green"><Users size={20} /></div>
            <div className="stat-info">
              <h3>{users.length - 1}</h3>
              <p>Active Students</p>
            </div>
          </div>
        </div>

        {/* ── Main Grid ── */}
        <div className="content-split">

          {/* Upload Form */}
          <div className="upload-panel glass">
            <div className="panel-title">
              <div className="panel-title-icon"><Upload size={16} /></div>
              Upload New Video
            </div>

            <form onSubmit={handleUpload}>
              <div className="input-group">
                <label>Video Title</label>
                <input
                  type="text"
                  id="video-title"
                  className="no-icon"
                  placeholder="e.g. Introduction to React Hooks"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label>Description</label>
                <textarea
                  id="video-description"
                  className="no-icon"
                  placeholder="What will students learn in this lesson?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ paddingLeft: '1rem' }}
                />
              </div>

              <div className="input-group">
                <label>Thumbnail Image <span style={{ color: 'var(--text-subtle)', fontWeight: 400 }}>(optional)</span></label>
                <input
                  type="file"
                  id="video-thumbnail"
                  accept="image/*"
                  onChange={(e) => setThumbnail(e.target.files[0])}
                />
              </div>

              <div className="input-group">
                <label>Video File <span style={{ color: '#ef4444', fontSize: '0.72rem' }}>Max 100MB (Cloudinary Free)</span></label>
                <input
                  type="file"
                  id="video-file"
                  accept="video/*"
                  onChange={(e) => setFile(e.target.files[0])}
                  required
                />
              </div>

              {successMsg && <div className="success-msg">{successMsg}</div>}

              <button type="submit" className="btn" id="upload-btn" disabled={loading}>
                {loading
                  ? <><Loader2 size={18} className="animate-spin" /> Uploading...</>
                  : <><Upload size={18} /> Upload to Cloud</>
                }
              </button>

              {loading && (
                <div className="progress-wrap">
                  <div className="progress-labels">
                    <span>Uploading to Cloudinary...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="progress-bar-track">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginTop: '0.5rem', textAlign: 'center' }}>
                    Large files may take a few minutes. Please keep this tab open.
                  </p>
                </div>
              )}
            </form>
          </div>

          {/* Video Manager */}
          <div className="upload-panel glass">
            <div className="panel-title">
              <div className="panel-title-icon"><VideoIcon size={16} /></div>
              Manage Videos
              <span className="badge badge-purple" style={{ marginLeft: 'auto' }}>{videos.length}</span>
            </div>

            {videos.length === 0 ? (
              <div className="empty-state">
                <VideoIcon size={48} style={{ opacity: 0.3, display: 'block', margin: '0 auto 1rem' }} />
                <p>No videos uploaded yet.</p>
              </div>
            ) : (
              <div className="admin-video-list">
                {videos.map((vid) => (
                  <div key={vid._id} className="admin-video-item" id={`admin-vid-${vid._id}`}>
                    <div className="admin-video-icon">
                      <VideoIcon size={18} />
                    </div>
                    <div className="admin-video-meta">
                      <p>{vid.title}</p>
                      <span>{new Date(vid.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(vid._id)}
                      title="Delete video"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User Manager */}
          <div className="upload-panel glass">
            <div className="panel-title">
              <div className="panel-title-icon"><Users size={16} /></div>
              Manage Users
              <span className="badge badge-green" style={{ marginLeft: 'auto' }}>
                {users.filter(u => u.role !== 'admin').length}
              </span>
            </div>

            {users.filter(u => u.role !== 'admin').length === 0 ? (
              <div className="empty-state">
                <Users size={48} style={{ opacity: 0.3, display: 'block', margin: '0 auto 1rem' }} />
                <p>No students registered yet.</p>
              </div>
            ) : (
              <div className="admin-video-list">
                {users.filter(u => u.role !== 'admin').map((u) => (
                  <div key={u._id} className="admin-video-item" style={{ gap: '1rem' }}>
                    <div className="admin-video-icon" style={{ background: u.isApproved ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)' }}>
                      <Users size={18} color={u.isApproved ? '#10b981' : '#f59e0b'} />
                    </div>
                    <div className="admin-video-meta">
                      <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {u.fullName}
                        <span className={`badge ${u.isApproved ? 'badge-green' : 'badge-amber'}`} style={{ fontSize: '0.6rem', padding: '0.1rem 0.3rem' }}>
                          {u.isApproved ? 'Approved' : 'Pending'}
                        </span>
                      </p>
                      <span>{u.email}</span>
                    </div>
                    <button
                      className="btn btn-sm"
                      onClick={() => handleApprove(u._id, u.isApproved)}
                      style={{ 
                        marginLeft: 'auto', 
                        padding: '0.4rem 0.8rem', 
                        fontSize: '0.75rem',
                        background: u.isApproved ? '#ef4444' : '#10b981',
                        border: 'none',
                        color: 'white',
                        borderRadius: '0.5rem',
                        cursor: 'pointer'
                      }}
                    >
                      {u.isApproved ? 'Revoke' : 'Approve'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
