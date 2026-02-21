import React, { useState, useRef } from 'react';
import { uploadFile, startAnalysis } from '../utils/api';

const channels = [
  { id: 'email', label: 'Email', icon: <i className="ri-mail-line"></i> },
  { id: 'meeting', label: 'Meeting Transcript', icon: <i className="ri-file-list-3-line"></i> },
  { id: 'chat', label: 'Chat Messages', icon: <i className="ri-chat-4-line"></i> },
  { id: 'api', label: 'API Integration', icon: <i className="ri-settings-4-line"></i> },
];

export default function UploadData({ onAnalysisStart }) {
  const [activeChannel, setActiveChannel] = useState('email');
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState(null);
  const [autoLang, setAutoLang] = useState(true);
  const [channelTag, setChannelTag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  };

  const handleFileInput = (e) => {
    if (e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleAnalyze = async () => {
    if (!file) { setError('Please select a file first.'); return; }
    setError('');
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('channel', activeChannel);
      fd.append('autoLanguage', autoLang);
      fd.append('channelTagging', channelTag);

      const uploadRes = await uploadFile(fd);
      const { fileId } = uploadRes.data;

      const analysisRes = await startAnalysis(fileId);
      const { analysisId, steps } = analysisRes.data;

      onAnalysisStart({ analysisId, steps, fileName: file.name });
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-header"><h1>Multi-Channel Input</h1></div>
      <div className="page-content">
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="upload-layout">
            {/* Sidebar */}
            <div className="channel-list">
              {channels.map(c => (
                <div
                  key={c.id}
                  className={`channel-item ${activeChannel === c.id ? 'active' : ''}`}
                  onClick={() => setActiveChannel(c.id)}
                >
                  <span className="channel-icon">{c.icon}</span>
                  {c.label}
                </div>
              ))}
            </div>

            {/* Upload zone */}
            <div className="upload-zone-area">
              <div
                className={`dropzone ${dragOver ? 'drag-over' : ''}`}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  style={{ display: 'none' }}
                  accept=".txt,.pdf,.docx,.csv"
                  onChange={handleFileInput}
                />
                <div className="dropzone-icon"><i className="ri-upload-cloud-2-line"></i></div>
                <div className="dropzone-text">
                  Drop files here or <span className="dropzone-link">Browse Files</span>
                </div>
                <div className="dropzone-sub">Supported: .txt, .pdf, .docx, .csv</div>
              </div>

              {file && (
                <div className="file-attached">
                  <i className="ri-attachment-2"></i> {file.name}
                  <button
                    style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  >✕</button>
                </div>
              )}

              <div className="toggle-row">
                <button className={`toggle ${autoLang ? 'on' : ''}`} onClick={() => setAutoLang(!autoLang)} />
                <span>Auto language detection</span>
                <span className="info-icon" title="Automatically detect the language of the uploaded content"><i className="ri-information-line"></i></span>
              </div>

              <div className="toggle-row">
                <button className={`toggle ${channelTag ? 'on' : ''}`} onClick={() => setChannelTag(!channelTag)} />
                <span>Channel tagging</span>
                <span className="info-icon" title="Tag requirements by communication channel"><i className="ri-information-line"></i></span>
              </div>

              {error && (
                <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: 8, fontSize: 13 }}>
                  ⚠️ {error}
                </div>
              )}

              <button className="btn btn-accent" onClick={handleAnalyze} disabled={loading}>
                {loading ? <><i className="ri-loader-4-line ri-spin"></i> Processing...</> : <><i className="ri-rocket-line"></i> Start AI Analysis</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
