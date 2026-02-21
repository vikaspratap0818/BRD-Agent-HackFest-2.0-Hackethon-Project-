import React, { useEffect, useState } from 'react';
import { getBRDInsights } from '../utils/api';

const TABS = ['Functional Requirements', 'Non-Functional Requirements', 'Key Decisions', 'Stakeholder Mapping', 'Timeline Reconstruction'];

export default function Insights({ brdId }) {
  const [activeTab, setActiveTab] = useState(0);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!brdId) {
      setInsights(getMockInsights());
      setLoading(false);
      return;
    }
    getBRDInsights(brdId)
      .then(r => setInsights(r.data))
      .catch(() => setInsights(getMockInsights()))
      .finally(() => setLoading(false));
  }, [brdId]);

  const priorityBadge = (p) => (
    <span className={`badge badge-${(p || 'medium').toLowerCase()}`}>{p || 'Medium'}</span>
  );

  const renderContent = () => {
    if (!insights) return null;

    if (activeTab === 0) {
      const rows = insights.functionalRequirements || [];
      return (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th className="checkbox-col"><input type="checkbox" /></th>
                <th>ID <i className="ri-expand-up-down-line"></i></th>
                <th>Requirement <i className="ri-expand-up-down-line"></i></th>
                <th>Priority <i className="ri-expand-up-down-line"></i></th>
                <th>Source <i className="ri-expand-up-down-line"></i></th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id}>
                  <td><input type="checkbox" /></td>
                  <td style={{ fontFamily: 'DM Mono, monospace', fontWeight: 600 }}>{r.id}</td>
                  <td>{r.requirement}</td>
                  <td>{priorityBadge(r.priority)}</td>
                  <td style={{ color: '#6b7280' }}>{r.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (activeTab === 1) {
      const rows = insights.nonFunctionalRequirements || [];
      return (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th className="checkbox-col"><input type="checkbox" /></th>
                <th>ID</th>
                <th>Requirement</th>
                <th>Priority</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id}>
                  <td><input type="checkbox" /></td>
                  <td style={{ fontFamily: 'DM Mono, monospace', fontWeight: 600 }}>{r.id}</td>
                  <td>{r.requirement}</td>
                  <td>{priorityBadge(r.priority)}</td>
                  <td style={{ color: '#6b7280' }}>{r.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    if (activeTab === 2) {
      const rows = insights.keyDecisions || [];
      return (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Decision</th>
                <th>Made By</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id}>
                  <td style={{ fontFamily: 'DM Mono, monospace', fontWeight: 600 }}>{r.id}</td>
                  <td>{r.decision}</td>
                  <td>{r.madeBy}</td>
                  <td style={{ color: '#6b7280' }}>{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (activeTab === 3) {
      const rows = insights.stakeholders || [];
      return (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Interest Level</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{r.name}</td>
                  <td>{r.role}</td>
                  <td>{priorityBadge(r.interest)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (activeTab === 4) {
      const rows = insights.timeline || [];
      const statusClass = (s) => {
        if (s === 'Completed') return 'status-completed';
        if (s === 'In Progress') return 'status-progress';
        return 'status-planned';
      };
      return (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Milestone</th>
                <th>Target Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{r.milestone}</td>
                  <td style={{ color: '#6b7280' }}>{r.date}</td>
                  <td><span className={`status-badge ${statusClass(r.status)}`}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
  };

  return (
    <>
      <div className="page-header"><h1>Extracted Insights</h1></div>
      <div className="page-content">
        <div className="card">
          {loading ? (
            <div className="loading"><div className="spinner" /><span>Loading insights...</span></div>
          ) : (
            <>
              <div className="tabs">
                {TABS.map((t, i) => (
                  <button
                    key={t}
                    className={`tab-btn ${activeTab === i ? 'active' : ''}`}
                    onClick={() => setActiveTab(i)}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="table-actions">
                <button className="sort-btn"><i className="ri-filter-3-line"></i> Filter</button>
                <button className="sort-btn"><i className="ri-arrow-up-down-line"></i> Sort <i className="ri-arrow-down-s-line"></i></button>
              </div>
              {renderContent()}
            </>
          )}
        </div>
      </div>
    </>
  );
}

function getMockInsights() {
  return {
    functionalRequirements: [
      { id: 'FR-01', requirement: 'User Login with OTP', priority: 'High', source: 'Meeting #3' },
      { id: 'FR-02', requirement: 'Dashboard with Analytics', priority: 'Medium', source: 'Email Thread' },
      { id: 'FR-03', requirement: 'Export Reports to PDF', priority: 'Medium', source: 'Email Thread' },
      { id: 'FR-04', requirement: 'Role-based Access Control', priority: 'High', source: 'Email Thread' },
      { id: 'FR-05', requirement: 'User Login with OTP (v2)', priority: 'Medium', source: 'Email Thread' },
      { id: 'FR-06', requirement: 'Dashboard with Analytics (v2)', priority: 'Medium', source: 'Email Thread' },
      { id: 'FR-07', requirement: 'Audit Trail Logging', priority: 'High', source: 'Email Thread' },
      { id: 'FR-08', requirement: 'Multi-language Support', priority: 'Medium', source: 'Meeting #3' },
      { id: 'FR-09', requirement: 'Dashboard with Advanced Analytics', priority: 'Medium', source: 'Email Thread' },
    ],
    nonFunctionalRequirements: [
      { id: 'NFR-01', requirement: 'System uptime 99.9%', priority: 'High', source: 'SLA Document' },
      { id: 'NFR-02', requirement: 'Page load under 2 seconds', priority: 'Medium', source: 'Email Thread' },
      { id: 'NFR-03', requirement: 'GDPR compliance required', priority: 'High', source: 'Legal Team' },
      { id: 'NFR-04', requirement: 'Mobile responsive design', priority: 'Medium', source: 'Meeting #2' },
      { id: 'NFR-05', requirement: 'Data encryption at rest', priority: 'High', source: 'Security Audit' },
    ],
    keyDecisions: [
      { id: 'KD-01', decision: 'Use cloud-based infrastructure', madeBy: 'Tech Lead', date: '2024-01-15' },
      { id: 'KD-02', decision: 'Adopt microservices architecture', madeBy: 'CTO', date: '2024-01-20' },
      { id: 'KD-03', decision: 'Mobile-first design approach', madeBy: 'Product Manager', date: '2024-02-01' },
      { id: 'KD-04', decision: 'Integrate Gemini AI for automation', madeBy: 'AI Team', date: '2024-02-10' },
    ],
    stakeholders: [
      { name: 'John Smith', role: 'Product Manager', interest: 'High' },
      { name: 'Sarah Lee', role: 'Tech Lead', interest: 'High' },
      { name: 'Mike Johnson', role: 'Business Analyst', interest: 'Medium' },
      { name: 'Lisa Chen', role: 'End User Representative', interest: 'Medium' },
    ],
    timeline: [
      { milestone: 'Requirements Gathering', date: '2024-01-31', status: 'Completed' },
      { milestone: 'Design Phase', date: '2024-02-28', status: 'Completed' },
      { milestone: 'Development Sprint 1', date: '2024-03-31', status: 'In Progress' },
      { milestone: 'UAT & Launch', date: '2024-04-30', status: 'Planned' },
    ]
  };
}
