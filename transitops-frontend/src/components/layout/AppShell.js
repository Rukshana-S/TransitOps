'use client';

import Sidebar from './Sidebar';
import Topbar from './Topbar';

const css = `
  .td-shell {
    display: flex;
    min-height: 100vh;
    background: #060910;
  }
  .td-shell-right {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    background: #060910;
  }
  .td-shell-main {
    flex: 1;
    overflow-y: auto;
    color: #E8EAF0;
  }
`;

export default function AppShell({ children }) {
  return (
    <>
      <style>{css}</style>
      <div className="td-shell">
        <Sidebar />
        <div className="td-shell-right">
          <Topbar />
          <main className="td-shell-main">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
