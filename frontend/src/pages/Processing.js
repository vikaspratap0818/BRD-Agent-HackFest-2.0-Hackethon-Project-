import React, { useEffect, useState } from 'react';
import { getAnalysisStatus } from '../utils/api';

export default function Processing({ analysisId, steps, fileName, onComplete }) {
  const [completedSteps, setCompletedSteps] = useState([]);
  const [confidence, setConfidence] = useState(0);
  const [status, setStatus] = useState('processing');

  useEffect(() => {
    let interval;
    const poll = async () => {
      try {
        const res = await getAnalysisStatus(analysisId);
        const data = res.data;
        setCompletedSteps(data.completedSteps || []);
        setConfidence(data.confidence || 0);
        if (data.status === 'complete') {
          clearInterval(interval);
          setStatus('complete');
          setTimeout(() => onComplete(data.brdId), 1000);
        }
      } catch (e) {}
    };
    poll();
    interval = setInterval(poll, 1000);
    return () => clearInterval(interval);
  }, [analysisId]);

  const allSteps = steps || [
    'Ingesting Communication',
    'Reconstructing Context',
    'Filtering Noise',
    'Extracting Requirements',
    'Mapping Stakeholders',
    'Generating BRD'
  ];

  return (
    <>
      <div className="page-header"><h1>AI Processing</h1></div>
      <div className="page-content">
        <div className="card processing-card">
          {fileName && (
            <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>
              <i className="ri-attachment-2"></i> Analyzing: <strong>{fileName}</strong>
            </p>
          )}
          <div className="confidence-score">
            AI Confidence Score: <span>{confidence}%</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${confidence}%` }}>
              {confidence > 10 ? `${confidence}%` : ''}
            </div>
          </div>

          <ul className="steps-list">
            {allSteps.map((step, i) => {
              const done = completedSteps.includes(step);
              const active = !done && completedSteps.length === i && status === 'processing';
              return (
                <li className="step-item" key={step}>
                  <div className={`step-dot ${done ? 'completed' : ''} ${active ? 'active' : ''}`}>
                    {done ? <i className="ri-check-line"></i> : active ? <i className="ri-donut-chart-line ri-spin"></i> : ''}
                  </div>
                  <span className={`step-label ${active ? 'active-label' : ''}`}>{step}</span>
                </li>
              );
            })}
          </ul>

          {status === 'complete' && (
            <div style={{ marginTop: 24, padding: '14px 20px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, color: '#16a34a', fontWeight: 600 }}>
              <i className="ri-checkbox-circle-fill"></i> Analysis complete! Redirecting to results...
            </div>
          )}
        </div>
      </div>
    </>
  );
}
