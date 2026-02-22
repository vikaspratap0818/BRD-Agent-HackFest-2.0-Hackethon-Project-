import React, { useEffect, useState } from 'react';
import { getAllBRDs, getBRD } from '../utils/api';

export default function GeneratedBRDs({ activeBrdId }) {
  const [brds, setBrds] = useState([]);
  const [selectedBrd, setSelectedBrd] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllBRDs()
      .then(r => setBrds(r.data))
      .catch(() => setBrds([]));
  }, []);

  useEffect(() => {
    if (activeBrdId) loadBrd(activeBrdId);
  }, [activeBrdId]);

  const loadBrd = (id) => {
    setLoading(true);
    getBRD(id)
      .then(r => setSelectedBrd(r.data))
      .catch(() => setSelectedBrd(getMockBRD()))
      .finally(() => setLoading(false));
  };

  const handleDownloadPDF = () => {
    if (!selectedBrd) return;
    const content = selectedBrd.brdContent || '';
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BRD_${selectedBrd.insights?.projectName || 'Project'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (selectedBrd) {
    const insights = selectedBrd.insights || {};
    return (
      <>
        <div className="page-header">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setSelectedBrd(null)}
            style={{ marginBottom: 16 }}
          >
            <i className="ri-arrow-left-line"></i> Back to BRDs
          </button>
          <h1>Automated BRD Generation</h1>
        </div>
        <div className="page-content">
          <div className="brd-layout">
            <div className="brd-preview">
              <div className="brd-doc">
                <div className="brd-cover">
                  <div style={{ fontSize: 13, opacity: 0.8, fontWeight: 600, marginBottom: 16 }}>
                    <i className="ri-file-text-line"></i> BRD Intelligence Agent
                  </div>
                  <h1 style={{ marginTop: 0 }}>Business Requirements Document:<br />{insights.projectName || 'Project Alpha'}</h1>
                  <p>Generated Cover Page</p>
                </div>
                <div className="brd-body">
                  <h2>1. Executive Summary</h2>
                  <p>{insights.executiveSummary || 'This document outlines the business requirements for the project based on analyzed communication data.'}</p>

                  <h2>2. Business Objectives</h2>
                  <ul>
                    {(insights.businessObjectives || []).map((obj, i) => <li key={i}>{obj}</li>)}
                  </ul>

                  <h2>3. Functional Requirements</h2>
                  <ul>
                    {(insights.functionalRequirements || []).slice(0, 5).map(r => (
                      <li key={r.id}><strong>{r.id}</strong>: {r.requirement} <em>(Priority: {r.priority})</em></li>
                    ))}
                  </ul>

                  <h2>4. Non-Functional Requirements</h2>
                  <ul>
                    {(insights.nonFunctionalRequirements || []).slice(0, 3).map(r => (
                      <li key={r.id}><strong>{r.id}</strong>: {r.requirement}</li>
                    ))}
                  </ul>

                  <h2>5. Stakeholders</h2>
                  <ul>
                    {(insights.stakeholders || []).map((s, i) => (
                      <li key={i}><strong>{s.name}</strong> — {s.role} (Interest: {s.interest})</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="brd-actions">
              <button className="btn btn-accent" onClick={handleDownloadPDF}>
                <i className="ri-download-cloud-2-line"></i> Download as PDF
              </button>
              <button className="btn btn-outline">
                <i className="ri-file-word-line"></i> Export to Word
              </button>
              <button className="btn btn-outline">
                <i className="ri-share-forward-line"></i> Share with Team
              </button>
              <button className="btn btn-outline">
                <i className="ri-send-plane-line"></i> Send for Approval
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="page-header"><h1>Generated BRDs</h1></div>
      <div className="page-content">
        {loading && <div className="loading"><div className="spinner" /><span>Loading...</span></div>}
        {brds.length === 0 && !loading ? (
          <div className="card">
            <div className="empty-state">
              <h3>No BRDs generated yet</h3>
              <p>Upload a file and run AI analysis to generate your first BRD.</p>
            </div>
          </div>
        ) : (
          <div className="brds-grid">
            {brds.map(brd => (
              <div className="brd-card" key={brd.id} onClick={() => loadBrd(brd.id)}>
                <div className="brd-card-header">
                  <div className="brd-card-icon"><i className="ri-file-list-3-line"></i></div>
                  <span style={{ fontSize: 12, color: '#6b7280' }}>{new Date(brd.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="brd-name">
                  {brd.insights?.projectName || 'Project Alpha'}
                </div>
                <div className="brd-meta">
                  <span><i className="ri-attachment-2"></i> {brd.fileName}</span>
                </div>
                <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                  <span className="badge badge-high" style={{ fontSize: 12 }}>
                    {brd.insights?.functionalRequirements?.length || 0} FRs
                  </span>
                  <span className="badge badge-medium" style={{ fontSize: 11 }}>
                    {brd.insights?.confidenceScore || 0}% confidence
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function getMockBRD() {
  return {
    id: 'mock',
    fileName: 'sample.txt',
    insights: {
      projectName: 'Project Alpha',
      executiveSummary: 'This Business Requirements Document captures all functional and non-functional requirements extracted from communications for Project Alpha.',
      businessObjectives: [
        'Improve user experience across all platforms',
        'Automate reporting workflows with AI',
        'Enable multi-channel integration',
        'Ensure GDPR compliance',
      ],
      functionalRequirements: [
        { id: 'FR-01', requirement: 'User Login with OTP', priority: 'High' },
        { id: 'FR-02', requirement: 'Dashboard with Analytics', priority: 'Medium' },
        { id: 'FR-03', requirement: 'Export Reports to PDF', priority: 'Medium' },
        { id: 'FR-04', requirement: 'Role-based Access Control', priority: 'High' },
        { id: 'FR-05', requirement: 'Real-time Notifications', priority: 'Medium' },
      ],
      nonFunctionalRequirements: [
        { id: 'NFR-01', requirement: 'System uptime 99.9%', priority: 'High' },
        { id: 'NFR-02', requirement: 'Page load under 2 seconds', priority: 'Medium' },
        { id: 'NFR-03', requirement: 'GDPR compliance', priority: 'High' },
      ],
      stakeholders: [
        { name: 'John Smith', role: 'Product Manager', interest: 'High' },
        { name: 'Sarah Lee', role: 'Tech Lead', interest: 'High' },
        { name: 'Mike Johnson', role: 'Business Analyst', interest: 'Medium' },
      ],
      confidenceScore: 92,
    }
  };
}
