import React, { useState, useRef } from 'react';
import { uploadFile, startAnalysis } from '../utils/api';

const channels = [
  { id: 'email', label: 'Email', icon: <i className="ri-mail-line"></i> },
  { id: 'meeting', label: 'Meeting Transcript', icon: <i className="ri-file-list-3-line"></i> },
  { id: 'chat', label: 'Chat Messages', icon: <i className="ri-chat-4-line"></i> },
  { id: 'api', label: 'API Integration', icon: <i className="ri-settings-4-line"></i> },
];

export default function UploadData({ onAnalysisStart }) {
  const [activeChannel, setActiveChannel] = useState('meeting');
  const [inputType, setInputType] = useState('file'); // 'file', 'text', 'url'
  const [dragOver, setDragOver] = useState(false);
  
  const [file, setFile] = useState(null);
  const [textData, setTextData] = useState('');
  const [urlData, setUrlData] = useState('');
  
  const [autoLang, setAutoLang] = useState(true);
  const [channelTag, setChannelTag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (inputType !== 'file') return;
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  };

  const handleFileInput = (e) => {
    if (e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleAnalyze = async () => {
    if (inputType === 'file' && !file) { setError('Please select a file first.'); return; }
    if (inputType === 'text' && !textData.trim()) { setError('Please enter some text.'); return; }
    if (inputType === 'url' && !urlData.trim()) { setError('Please enter a valid URL.'); return; }
    
    setError('');
    setLoading(true);
    try {
      let uploadRes;
      let displayFileName;

      if (inputType === 'file') {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('channel', activeChannel);
        fd.append('autoLanguage', autoLang);
        fd.append('channelTagging', channelTag);
        fd.append('inputType', inputType);
        uploadRes = await uploadFile(fd);
        displayFileName = file.name;
      } else {
        // Send as JSON for text/url
        const payload = {
          inputType,
          channel: activeChannel,
          autoLanguage: autoLang,
          channelTagging: channelTag,
          textData: inputType === 'text' ? textData : undefined,
          urlData: inputType === 'url' ? urlData : undefined
        };
        
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        uploadRes = { data: await res.json() };
        if (!res.ok) throw new Error(uploadRes.data.error || 'Upload failed');
        displayFileName = inputType === 'text' ? 'Pasted Text Snippet' : urlData;
      }

      const { fileId, fileName } = uploadRes.data;

      const analysisRes = await startAnalysis(fileId);
      const { analysisId, steps } = analysisRes.data;

      onAnalysisStart({ analysisId, steps, fileName: fileName || displayFileName });
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Processing failed. Make sure the backend is running.');
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

            {/* Input area */}
            <div className="upload-zone-area">
              
              <div className="tabs" style={{ marginBottom: '16px', borderBottom: '1px solid var(--border)' }}>
                <button className={`tab-btn ${inputType === 'file' ? 'active' : ''}`} onClick={() => setInputType('file')}>
                  <i className="ri-file-upload-line" style={{marginRight: 6}}></i> File Upload
                </button>
                <button className={`tab-btn ${inputType === 'text' ? 'active' : ''}`} onClick={() => setInputType('text')}>
                  <i className="ri-text" style={{marginRight: 6}}></i> Paste Text
                </button>
                <button className={`tab-btn ${inputType === 'url' ? 'active' : ''}`} onClick={() => setInputType('url')}>
                  <i className="ri-link" style={{marginRight: 6}}></i> Meeting URL
                </button>
              </div>

              {inputType === 'file' && (
                <>
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
                </>
              )}

              {inputType === 'text' && (
                <div className="form-group" style={{ flex: 1 }}>
                  <textarea 
                    className="form-control" 
                    style={{ flex: 1, minHeight: '200px', resize: 'vertical' }}
                    placeholder="Paste your meeting transcript, chat history, or raw requirements text here..."
                    value={textData}
                    onChange={e => setTextData(e.target.value)}
                  />
                </div>
              )}

              {inputType === 'url' && (
                <div className="form-group">
                  <label>Meeting or Document URL</label>
                  <div className="input-with-icon">
                    <i className="ri-link"></i>
                    <input 
                      type="url" 
                      className="form-control"
                      placeholder="https://zoom.us/rec/play/... or Google Docs URL" 
                      value={urlData}
                      onChange={e => setUrlData(e.target.value)}
                    />
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px' }}>
                    The AI will attempt to fetch and transcribe the content from the provided URL.
                  </p>
                </div>
              )}

              <div className="toggle-row mt-4">
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
                <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginTop: '12px' }}>
                  ⚠️ {error}
                </div>
              )}

              <button className="btn btn-accent" style={{ marginTop: '16px' }} onClick={handleAnalyze} disabled={loading}>
                {loading ? <><i className="ri-loader-4-line ri-spin"></i> Processing...</> : <><i className="ri-rocket-line"></i> Start AI Analysis</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
