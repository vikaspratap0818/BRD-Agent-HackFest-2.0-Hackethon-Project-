import React, { useEffect, useState } from 'react';

export default function Dashboard({ setActivePage }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   
    setTimeout(() => {
      setData({
        totalBrds: { value: '30', sub: 'Check carried out' },
        timeSaved: { value: '24h', sub: 'This month' },
        drafts: { value: '50', sub: 'Pending Review' },
        completion: { value: '98%', sub: 'Success Rate' },
        storage: {
          projects: 680,
          files: 900,
          usedPercent: 75
        },
        recentActivity: [
          { id: '#12345', project: 'Project Phoenix', date: 'feb 18, 2026 10:30 AM', status: 'Completed', owner: 'testUser' },
          { id: '#12346', project: 'Skynet Integration', date: 'feb 20, 2026 11:00 AM', status: 'In Review', owner: 'Vikas Pratap' },
          { id: '#12347', project: 'T-800 Specs', date: 'feb 22, 2026 09:15 AM', status: 'Drafting', owner: 'Abhishek Misrha' },
        ]
      });
      setLoading(false);
    }, 500);
  }, []);

  if (loading) return (
    <div className="loading"><div className="spinner" /></div>
  );

  return (
    <>
      <div className="page-title">Dashboard Overview</div>
      
      <div className="dash-stats-row">
        <div className="dash-stat-card grad-purple">
          <div className="stat-content">
            <div className="stat-label">Total BRDs</div>
            <div className="stat-value">{data.totalBrds.value}</div>
            <div className="stat-sub">{data.totalBrds.sub}</div>
          </div>
          <div className="stat-icon"><i className="ri-checkbox-circle-line"></i></div>
        </div>
        
        <div className="dash-stat-card grad-cyan">
          <div className="stat-content">
            <div className="stat-label">Time Saved</div>
            <div className="stat-value">{data.timeSaved.value}</div>
            <div className="stat-sub">{data.timeSaved.sub}</div>
          </div>
          <div className="stat-icon"><i className="ri-time-line"></i></div>
        </div>
        
        <div className="dash-stat-card grad-blue">
          <div className="stat-content">
            <div className="stat-label">Drafts</div>
            <div className="stat-value">{data.drafts.value}</div>
            <div className="stat-sub">{data.drafts.sub}</div>
          </div>
          <div className="stat-icon"><i className="ri-file-text-line"></i></div>
        </div>
        
        <div className="dash-stat-card grad-orange">
          <div className="stat-content">
            <div className="stat-label">Completion</div>
            <div className="stat-value">{data.completion.value}</div>
            <div className="stat-sub">{data.completion.sub}</div>
          </div>
          <div className="stat-icon"><i className="ri-bar-chart-2-line"></i></div>
        </div>
      </div>

      <div className="dash-middle-row">
        <div className="dash-chart-card">
          <div className="card-header">
            <div className="card-title">Generations Overview</div>
            <div className="chart-legend">
              <span className="legend-item"><span className="dot dot-orange"></span> Requests</span>
              <span className="legend-item"><span className="dot dot-purple"></span> Completed</span>
            </div>
          </div>
          <div className="chart-mockup">
            <div className="chart-line-orange"></div>
            <div className="chart-line-purple"></div>
            <div className="chart-fill-purple"></div>
          </div>
        </div>

        <div className="dash-storage-card">
          <div className="card-title">Storage</div>
          <div className="storage-stats">
            <div className="storage-item">
              <div className="storage-value">{data.storage.projects}</div>
              <div className="storage-label">Projects</div>
            </div>
            <div className="storage-item">
              <div className="storage-value">{data.storage.files}</div>
              <div className="storage-label">Files</div>
            </div>
          </div>
          <div className="storage-progress-container">
            <div className="storage-progress-label">Space Used <span>{data.storage.usedPercent}%</span></div>
            <div className="storage-progress-bar">
              <div className="storage-progress-fill" style={{ width: `${data.storage.usedPercent}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="dash-activity-card">
        <div className="card-header" style={{ marginBottom: 24 }}>
          <div className="card-title">Recent Activity</div>
          <button className="icon-btn"><i className="ri-add-line"></i></button>
        </div>
        <table className="activity-table">
          <thead>
            <tr>
              <th>Case ID</th>
              <th>Project Name</th>
              <th>Date & Time</th>
              <th>Status</th>
              <th>Owner</th>
            </tr>
          </thead>
          <tbody>
            {data.recentActivity.map((item, i) => (
              <tr key={i}>
                <td style={{ color: 'var(--text-muted)' }}>{item.id}</td>
                <td style={{ color: 'var(--text-main)', fontWeight: 600 }}>{item.project}</td>
                <td style={{ color: 'var(--text-muted)' }}>{item.date}</td>
                <td>
                  <span className={`status-pill status-${item.status.toLowerCase().replace(' ', '-')}`}>
                    {item.status}
                  </span>
                </td>
                <td style={{ color: 'var(--text-main)' }}>{item.owner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
