import { useState } from 'react';

function Header({ repoPath, onSetRepoPath, onRefresh, onExportMarkdown, canExport }) {
  const [showPathInput, setShowPathInput] = useState(false);
  const [inputPath, setInputPath] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputPath.trim()) {
      onSetRepoPath(inputPath.trim());
      setShowPathInput(false);
      setInputPath('');
    }
  };

  return (
    <header className="bg-vscode-sidebar border-b border-vscode-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            <div>
              <h1 className="text-xl font-bold text-vscode-text">Git 代码对比工具</h1>
              <p className="text-xs text-vscode-text-dim mt-0.5">可视化分支差异对比</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* 仓库路径显示 */}
          <div className="flex items-center gap-2 bg-vscode-panel px-4 py-2 rounded border border-vscode-border">
            <svg className="w-4 h-4 text-vscode-text-dim" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <span className="text-sm text-vscode-text-dim font-mono">
              {repoPath.length > 50 ? '...' + repoPath.slice(-50) : repoPath}
            </span>
            <button
              onClick={() => setShowPathInput(!showPathInput)}
              className="ml-2 text-blue-400 hover:text-blue-300 transition-colors"
              title="更改仓库路径"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>

          {/* 导出按钮 */}
          <button
            onClick={onExportMarkdown}
            disabled={!canExport}
            className={`px-4 py-2 rounded border transition-colors flex items-center gap-2 ${
              canExport
                ? 'bg-green-600 hover:bg-green-700 border-green-600 text-white cursor-pointer'
                : 'bg-vscode-panel border-vscode-border text-vscode-text-dim cursor-not-allowed opacity-50'
            }`}
            title={canExport ? '导出对比报告为Markdown' : '请先选择两个分支'}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-sm font-medium">导出报告</span>
          </button>

          {/* 刷新按钮 */}
          <button
            onClick={onRefresh}
            className="bg-vscode-panel hover:bg-vscode-border px-4 py-2 rounded border border-vscode-border transition-colors flex items-center gap-2"
            title="刷新"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="text-sm">刷新</span>
          </button>
        </div>
      </div>

      {/* 路径输入表单 */}
      {showPathInput && (
        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <input
            type="text"
            value={inputPath}
            onChange={(e) => setInputPath(e.target.value)}
            placeholder="输入Git仓库的绝对路径..."
            className="flex-1 bg-vscode-panel border border-vscode-border text-vscode-text px-4 py-2 rounded focus:outline-none focus:border-blue-500 font-mono text-sm"
            autoFocus
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition-colors"
          >
            确定
          </button>
          <button
            type="button"
            onClick={() => {
              setShowPathInput(false);
              setInputPath('');
            }}
            className="bg-vscode-panel hover:bg-vscode-border border border-vscode-border text-vscode-text px-6 py-2 rounded transition-colors"
          >
            取消
          </button>
        </form>
      )}
    </header>
  );
}

export default Header;
