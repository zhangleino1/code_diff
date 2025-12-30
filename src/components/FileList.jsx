function FileList({ files, selectedFile, onFileSelect, loading, filterText, onFilterChange }) {
  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    const iconColors = {
      js: 'text-yellow-400',
      jsx: 'text-blue-400',
      ts: 'text-blue-500',
      tsx: 'text-blue-500',
      json: 'text-yellow-300',
      css: 'text-pink-400',
      html: 'text-orange-400',
      md: 'text-gray-400',
      py: 'text-blue-300',
      java: 'text-red-400',
    };

    return iconColors[ext] || 'text-gray-400';
  };

  const getChangeIcon = (file) => {
    if (file.insertions > 0 && file.deletions === 0) {
      return (
        <div className="flex items-center gap-1 text-green-400 text-xs">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          <span>新增</span>
        </div>
      );
    }
    if (file.deletions > 0 && file.insertions === 0) {
      return (
        <div className="flex items-center gap-1 text-red-400 text-xs">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
          <span>删除</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1 text-blue-400 text-xs">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
        </svg>
        <span>修改</span>
      </div>
    );
  };

  return (
    <div className="bg-vscode-sidebar border border-vscode-border rounded-lg flex flex-col h-full">
      {/* 头部 */}
      <div className="p-4 border-b border-vscode-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-vscode-text">变更文件</h3>
          <span className="bg-vscode-panel px-2 py-1 rounded text-xs text-vscode-text-dim">
            {files.length} 个文件
          </span>
        </div>

        {/* 搜索框 */}
        <div className="relative">
          <input
            type="text"
            value={filterText}
            onChange={(e) => onFilterChange(e.target.value)}
            placeholder="搜索文件..."
            className="w-full bg-vscode-panel border border-vscode-border text-vscode-text px-3 py-2 pl-9 rounded text-sm focus:outline-none focus:border-blue-500"
          />
          <svg
            className="w-4 h-4 text-vscode-text-dim absolute left-3 top-2.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* 文件列表 */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : files.length === 0 ? (
          <div className="text-center p-8 text-vscode-text-dim">
            <svg className="w-16 h-16 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm">
              {filterText ? '没有匹配的文件' : '没有变更的文件'}
            </p>
          </div>
        ) : (
          <div className="py-2">
            {files.map((file, index) => (
              <button
                key={index}
                onClick={() => onFileSelect(file)}
                className={`w-full text-left px-4 py-3 file-item border-l-2 ${
                  selectedFile?.file === file.file
                    ? 'active border-l-blue-500 bg-vscode-border'
                    : 'border-l-transparent hover:bg-vscode-panel'
                }`}
              >
                <div className="flex items-start gap-3">
                  <svg
                    className={`w-4 h-4 flex-shrink-0 mt-0.5 ${getFileIcon(file.file)}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>

                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-vscode-text font-mono truncate mb-1">
                      {file.file}
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      {getChangeIcon(file)}

                      <div className="flex items-center gap-2">
                        {file.insertions > 0 && (
                          <span className="text-green-400">+{file.insertions}</span>
                        )}
                        {file.deletions > 0 && (
                          <span className="text-red-400">-{file.deletions}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FileList;
