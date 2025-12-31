function BranchSelector({ branches, branch1, branch2, onBranch1Change, onBranch2Change }) {
  return (
    <div className="bg-vscode-sidebar border border-vscode-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          <h2 className="text-lg font-semibold text-vscode-text">分支对比</h2>
        </div>
        <div className="flex items-center gap-2 bg-blue-900/30 border border-blue-500/50 px-3 py-1.5 rounded">
          <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-xs text-blue-300 font-medium">文件级对比模式</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* 分支 1 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-vscode-text-dim font-medium">基准分支</label>
          <select
            value={branch1}
            onChange={(e) => onBranch1Change(e.target.value)}
            className="bg-vscode-panel border border-vscode-border text-vscode-text px-4 py-2.5 rounded focus:outline-none focus:border-blue-500 cursor-pointer hover:bg-vscode-border transition-colors"
          >
            <option value="">-- 选择分支 --</option>
            {branches.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>
          {branch1 && (
            <div className="flex items-center gap-2 text-xs text-green-400">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              已选择
            </div>
          )}
        </div>

        {/* 对比箭头 */}
        <div className="flex justify-center">
          <div className="bg-vscode-panel border border-vscode-border rounded-full p-3">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </div>

        {/* 分支 2 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-vscode-text-dim font-medium">目标分支</label>
          <select
            value={branch2}
            onChange={(e) => onBranch2Change(e.target.value)}
            className="bg-vscode-panel border border-vscode-border text-vscode-text px-4 py-2.5 rounded focus:outline-none focus:border-blue-500 cursor-pointer hover:bg-vscode-border transition-colors"
          >
            <option value="">-- 选择分支 --</option>
            {branches.map((branch) => (
              <option key={branch} value={branch} disabled={branch === branch1}>
                {branch}
              </option>
            ))}
          </select>
          {branch2 && (
            <div className="flex items-center gap-2 text-xs text-green-400">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              已选择
            </div>
          )}
        </div>
      </div>

      {/* 提示信息 */}
      {branch1 && branch2 && branch1 === branch2 && (
        <div className="mt-4 bg-yellow-900/30 border border-yellow-500/50 text-yellow-300 px-4 py-3 rounded flex items-start gap-2">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="text-sm">请选择两个不同的分支进行对比</span>
        </div>
      )}

      {branch1 && branch2 && branch1 !== branch2 && (
        <div className="mt-4 bg-blue-900/30 border border-blue-500/50 text-blue-300 px-4 py-3 rounded flex items-start gap-2">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span className="text-sm">
            对比 <code className="bg-vscode-panel px-2 py-0.5 rounded font-mono">{branch1}</code> 和{' '}
            <code className="bg-vscode-panel px-2 py-0.5 rounded font-mono">{branch2}</code> 之间的差异
          </span>
        </div>
      )}
    </div>
  );
}

export default BranchSelector;
