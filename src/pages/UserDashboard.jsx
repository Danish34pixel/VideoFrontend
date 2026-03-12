import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, LogOut, BookOpen, Clock, Flame } from 'lucide-react';
import api from '../services/api';

const UserDashboard = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data } = await api.get('/videos');
      setVideos(data);
    } catch (err) {
      console.error('Failed to fetch videos');
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
            <div className="navbar-icon">🎓</div>
            <div className="navbar-brand-text">
              <h1>Aijaz Khan Tutorials</h1>
              <p>Premium Learning</p>
            </div>
          </div>

          <div className="navbar-right">
            <div className="user-pill">
              <div className="user-avatar">{initials}</div>
              <span>{user?.fullName}</span>
            </div>
            <button
              id="logout-btn"
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
            <div className="stat-icon purple"><BookOpen size={20} /></div>
            <div className="stat-info">
              <h3>{videos.length}</h3>
              <p>Total Lessons</p>
            </div>
          </div>
          <div className="stat-card glass">
            <div className="stat-icon amber"><Flame size={20} /></div>
            <div className="stat-info">
              <h3>{selectedVideo ? '1' : '0'}</h3>
              <p>Now Playing</p>
            </div>
          </div>
          <div className="stat-card glass">
            <div className="stat-icon green"><Clock size={20} /></div>
            <div className="stat-info">
              <h3>∞</h3>
              <p>Access</p>
            </div>
          </div>
        </div>

        {/* ── Main Content ── */}
        {selectedVideo ? (
          /* Split view — player + playlist */
          <div className="content-split">
            {/* Player */}
            <div className="player-panel glass">
              <div className="video-container">
                <video
                  key={selectedVideo._id}
                  src={selectedVideo.cloudinaryUrl}
                  controls
                  controlsList="nodownload"
                  onContextMenu={(e) => e.preventDefault()}
                  autoPlay
                />
              </div>
              <div className="video-info">
                <span className="badge badge-purple" style={{ marginBottom: '0.6rem' }}>
                  <Play size={10} /> Now Playing
                </span>
                <h2>{selectedVideo.title}</h2>
                <p>{selectedVideo.description}</p>
              </div>
            </div>

            {/* Playlist sidebar */}
            <div className="playlist-panel glass">
              <div className="panel-title">
                <div className="panel-title-icon"><BookOpen size={16} /></div>
                Course Playlist
              </div>
              <div className="playlist-list">
                {videos.map((vid, idx) => (
                  <div
                    key={vid._id}
                    id={`playlist-item-${vid._id}`}
                    className={`playlist-item ${selectedVideo?._id === vid._id ? 'active' : ''}`}
                    onClick={() => setSelectedVideo(vid)}
                  >
                    <div className="playlist-thumb">
                      {vid.thumbnailUrl
                        ? <img src={vid.thumbnailUrl} alt={vid.title} />
                        : <Play size={14} style={{ color: 'var(--primary-light)' }} />
                      }
                    </div>
                    <div className="playlist-item-info">
                      <h4>{vid.title}</h4>
                      <p>Lesson {idx + 1}</p>
                    </div>
                    {selectedVideo?._id === vid._id && (
                      <span className="badge badge-purple" style={{ padding: '0.15rem 0.4rem', fontSize: '0.65rem' }}>▶</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Video grid (no video selected) */
          <div>
            <div className="section-header">
              <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.25rem', fontWeight: 700 }}>
                📚 Your Courses
              </h2>
              <span className="badge badge-purple">{videos.length} Lessons</span>
            </div>

            {videos.length === 0 ? (
              <div className="glass empty-state" style={{ borderRadius: '1.75rem', padding: '4rem 2rem' }}>
                <BookOpen size={52} style={{ margin: '0 auto 1rem', display: 'block', opacity: 0.3 }} />
                <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text)' }}>No videos yet</p>
                <p style={{ marginTop: '0.4rem', fontSize: '0.85rem' }}>
                  The instructor will upload lessons soon. Check back later!
                </p>
              </div>
            ) : (
              <div className="video-grid">
                {videos.map((vid, idx) => (
                  <div
                    key={vid._id}
                    id={`video-card-${vid._id}`}
                    className="video-card"
                    onClick={() => setSelectedVideo(vid)}
                    style={{ animationDelay: `${idx * 0.07}s` }}
                  >
                    <div className="video-card-thumb">
                      {vid.thumbnailUrl ? (
                        <>
                          <img src={vid.thumbnailUrl} alt={vid.title} />
                          <div className="play-overlay">
                            <div className="play-overlay-icon">
                              <Play size={20} color="white" />
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="play-icon">
                          <Play size={22} color="white" />
                        </div>
                      )}
                    </div>
                    <div className="video-card-body">
                      <span className="badge badge-purple" style={{ marginBottom: '0.5rem', fontSize: '0.68rem' }}>
                        Lesson {idx + 1}
                      </span>
                      <h3>{vid.title}</h3>
                      <p>{vid.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default UserDashboard;
