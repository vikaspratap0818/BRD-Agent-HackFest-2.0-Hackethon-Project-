import React, { useState } from 'react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('Profile');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    updates: true,
  });
  const [profile, setProfile] = useState({
    name: 'Demo User',
    email: 'user@company.com',
  });

  const handleToggle = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const tabs = ['Profile', 'Appearance', 'Notifications'];

  return (
    <>
      <div className="page-header-flex">
        <div className="page-title" style={{ marginBottom: 0 }}>
          Settings
          <p style={{ fontSize: '14px', fontWeight: '400', color: 'var(--text-muted)', marginTop: '8px', fontFamily: '"Inter", sans-serif' }}>
            Manage your account preferences and application settings.
          </p>
        </div>
        <button className="btn btn-primary">Save Changes</button>
      </div>

      <div className="settings-layout mt-4">
        <div className="settings-sidebar card">
          <ul className="settings-nav">
            {tabs.map((tab) => (
              <li key={tab}>
                <button
                  className={`settings-nav-link ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === 'Profile' && <i className="ri-user-line"></i>}
                  {tab === 'Appearance' && <i className="ri-palette-line"></i>}
                  {tab === 'Notifications' && <i className="ri-notification-3-line"></i>}
                  {tab}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="settings-content card flex-1">
          {activeTab === 'Profile' && (
            <div className="settings-section">
              <h3 className="outfit-font section-title">Profile Information</h3>
              <p className="text-muted mb-4">Update your account's profile information and email address.</p>

              <div className="form-group">
                <label>Display Name</label>
                <div className="input-with-icon">
                  <i className="ri-user-line"></i>
                  <input
                    type="text"
                    className="form-control"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group mt-4">
                <label>Email Address</label>
                <div className="input-with-icon">
                  <i className="ri-mail-line"></i>
                  <input
                    type="email"
                    className="form-control"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Appearance' && (
            <div className="settings-section">
              <h3 className="outfit-font section-title">Theme Preferences</h3>
              <p className="text-muted mb-4">Customize how the application looks.</p>

              <div className="theme-options">
                <div className="theme-card active">
                  <div className="theme-preview dark-theme-preview"></div>
                  <span>Dark Mode</span>
                </div>
                <div className="theme-card disabled" title="Coming soon">
                  <div className="theme-preview light-theme-preview"></div>
                  <span>Light Mode</span>
                </div>
                <div className="theme-card disabled" title="Coming soon">
                  <div className="theme-preview system-theme-preview"></div>
                  <span>System</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Notifications' && (
            <div className="settings-section">
              <h3 className="outfit-font section-title">Email & Push Notifications</h3>
              <p className="text-muted mb-4">Choose what updates you want to receive.</p>

              <div className="toggle-list">
                <div className="toggle-item">
                  <div className="toggle-info">
                    <h4>Email Notifications</h4>
                    <p>Receive daily digest of generated BRDs.</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={notifications.email}
                      onChange={() => handleToggle('email')}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>

                <div className="toggle-item">
                  <div className="toggle-info">
                    <h4>Push Notifications</h4>
                    <p>Get notified instantly when a BRD finishes processing.</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={notifications.push}
                      onChange={() => handleToggle('push')}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>

                <div className="toggle-item border-none">
                  <div className="toggle-info">
                    <h4>Product Updates</h4>
                    <p>Receive emails about new features and improvements.</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={notifications.updates}
                      onChange={() => handleToggle('updates')}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
