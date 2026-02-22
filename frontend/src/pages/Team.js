import React, { useState } from 'react';

const mockTeam = [
  { id: 1, name: 'Alice Smith', email: 'alice@company.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Bob Jones', email: 'bob@company.com', role: 'Editor', status: 'Active' },
  { id: 3, name: 'Charlie Davis', email: 'charlie@company.com', role: 'Viewer', status: 'Pending' }
];

export default function Team() {
  const [team, setTeam] = useState(mockTeam);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Viewer');

  const handleInvite = (e) => {
    e.preventDefault();
    if (!inviteEmail) return;
    
    const newMember = {
      id: Date.now(),
      name: 'Invited User',
      email: inviteEmail,
      role: inviteRole,
      status: 'Pending'
    };
    
    setTeam([...team, newMember]);
    setInviteEmail('');
    setShowInviteModal(false);
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <>
      <div className="page-header-flex">
        <div className="page-title" style={{ marginBottom: 0 }}>
          Team Management
          <p style={{ fontSize: '14px', fontWeight: '400', color: 'var(--text-muted)', marginTop: '8px', fontFamily: '"Inter", sans-serif' }}>
            Manage your team members and their access levels.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowInviteModal(true)}>
          <i className="ri-user-add-line"></i> Invite Member
        </button>
      </div>

      <div className="team-grid mt-4">
        {team.map(member => (
          <div key={member.id} className="team-card gradient-border">
            <div className="team-card-inner">
              <div className="team-member-header">
                <div className="team-avatar">{getInitials(member.name)}</div>
                <div className="team-status">
                  <span className={`status-badge ${member.status.toLowerCase()}`}>
                    {member.status}
                  </span>
                </div>
              </div>
              <div className="team-member-info">
                <h3>{member.name}</h3>
                <p className="team-email">{member.email}</p>
                <div className="team-role-badge">
                  <i className="ri-shield-user-line"></i> {member.role}
                </div>
              </div>
              <div className="team-actions">
                <button className="icon-btn" title="Edit Role"><i className="ri-edit-line"></i></button>
                <button className="icon-btn text-error" title="Remove Member"><i className="ri-delete-bin-line"></i></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showInviteModal && (
        <div className="modal-backdrop">
          <div className="modal-content glass-dark">
            <div className="modal-header">
              <h3 className="outfit-font">Invite Team Member</h3>
              <button className="icon-btn" onClick={() => setShowInviteModal(false)}>
                <i className="ri-close-line"></i>
              </button>
            </div>
            <form onSubmit={handleInvite} className="modal-body">
              <div className="form-group">
                <label>Email Address</label>
                <div className="input-with-icon">
                  <i className="ri-mail-line"></i>
                  <input 
                    type="email" 
                    className="form-control"
                    placeholder="colleague@company.com" 
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Role</label>
                <div className="select-wrapper">
                  <i className="ri-shield-user-line select-icon"></i>
                  <select className="form-control" value={inviteRole} onChange={(e) => setInviteRole(e.target.value)} required>
                    <option value="Admin">Admin</option>
                    <option value="Editor">Editor</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                  <i className="ri-arrow-down-s-line select-arrow"></i>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowInviteModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Send Invite</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
