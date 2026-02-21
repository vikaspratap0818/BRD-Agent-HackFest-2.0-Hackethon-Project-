import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import UploadData from './pages/UploadData';
import Processing from './pages/Processing';
import Insights from './pages/Insights';
import GeneratedBRDs from './pages/GeneratedBRDs';
import Login from './pages/Login';
import Register from './pages/Register';

export default function App() {
  const [auth, setAuth] = useState(null);
  const [activePage, setActivePage] = useState('Dashboard');
  const [analysisState, setAnalysisState] = useState(null);
  const [currentBrdId, setCurrentBrdId] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setAuth(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setAuth(null);
    setActivePage('login');
  };

  const handleAnalysisStart = (data) => {
    setAnalysisState(data);
    setActivePage('__processing__');
  };

  const handleAnalysisComplete = (brdId) => {
    setCurrentBrdId(brdId);
    setActivePage('Insights');
  };

  const navPage = (page) => {
    setActivePage(page);
    if (page !== '__processing__') setAnalysisState(null);
  };

  const renderPage = () => {
    if (activePage === '__processing__' && analysisState) {
      return (
        <Processing
          analysisId={analysisState.analysisId}
          steps={analysisState.steps}
          fileName={analysisState.fileName}
          onComplete={handleAnalysisComplete}
        />
      );
    }

    switch (activePage) {
      case 'Dashboard':
        return <Dashboard setActivePage={navPage} />;
      case 'Upload Data':
        return <UploadData onAnalysisStart={handleAnalysisStart} />;
      case 'Generated BRDs':
        return <GeneratedBRDs activeBrdId={currentBrdId} />;
      case 'Insights':
        return <Insights brdId={currentBrdId} />;
      default:
        return <Dashboard setActivePage={navPage} />;
    }
  };

  const displayPage = activePage === '__processing__' ? 'Upload Data' : activePage;

  if (!auth) {
    if (activePage === 'register') {
      return <Register setAuth={setAuth} navigateTo={setActivePage} />;
    }
    return <Login setAuth={setAuth} navigateTo={setActivePage} />;
  }

  return (
    <div className="app-layout">
      <Navbar activePage={displayPage} setActivePage={navPage} user={auth} onLogout={handleLogout} />
      <div className="main-wrapper">
        <header className="topbar">
          <div className="topbar-search">
            <i className="ri-search-line"></i>
            <input type="text" placeholder="Search..." />
          </div>
          <div className="topbar-right">
            <div className="topbar-icon"><i className="ri-mail-line"></i></div>
            <div className="topbar-icon"><i className="ri-notification-3-line"></i></div>
            <div className="user-profile">
              <div className="user-avatar">{auth ? auth.name[0].toUpperCase() : 'U'}</div>
              <div className="user-name" style={{ marginLeft: 8, fontSize: 13, fontWeight: 600 }}>{auth ? auth.name : 'User'}</div>
              <i className="ri-arrow-down-s-line" style={{ color: 'var(--text-muted)', marginLeft: 8 }}></i>
            </div>
          </div>
        </header>
        <main className="content-area">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
