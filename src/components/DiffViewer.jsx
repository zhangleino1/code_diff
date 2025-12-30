import { useMemo, useState } from 'react';
import { parseDiff } from '../utils/diffParser';

function DiffViewer({ diffData, selectedFile, loading, branch1, branch2 }) {
  const [viewMode, setViewMode] = useState('unified'); // unified 或 split

  const parsedDiff = useMemo(() => {
    if (!diffData) return null;
    const parsed = parseDiff(diffData);
    return parsed[0]; // 取第一个文件的diff
  }, [diffData]);

  if (!selectedFile) {
    return (
      <div className="bg-vscode-sidebar border border-vscode-border rounded-lg h-full flex items-center justify-center">
        <div className="text-center text-vscode-text-dim">
          <svg className="w-20 h-20 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-lg">选择一个文件查看差异</p>
          <p className="text-sm mt-2">从左侧文件列表中选择文件</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-vscode-sidebar border border-vscode-border rounded-lg h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-vscode-text-dim">加载差异中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-vscode-sidebar border border-vscode-border rounded-lg flex flex-col h-full">
      {/* 头部 */}
      <div className="p-4 border-b border-vscode-border">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-sm font-semibold text-vscode-text truncate font-mono">
                {selectedFile.file}
              </h3>
            </div>

            <div className="flex items-center gap-4 text-xs text-vscode-text-dim">
              <div className="flex items-center gap-2">
                <span className="text-green-400">+{selectedFile.insertions} 行</span>
                <span className="text-red-400">-{selectedFile.deletions} 行</span>
                <span className="text-vscode-text-dim">共 {selectedFile.changes} 处变更</span>
              </div>
            </div>
          </div>

          {/* 视图模式切换 */}
          <div className="flex items-center gap-2 bg-vscode-panel rounded border border-vscode-border p-1">
            <button
              onClick={() => setViewMode('unified')}
              className={`px-3 py-1.5 rounded text-xs transition-colors ${
                viewMode === 'unified'
                  ? 'bg-blue-600 text-white'
                  : 'text-vscode-text-dim hover:text-vscode-text'
              }`}
            >
              统一视图
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1.5 rounded text-xs transition-colors ${
                viewMode === 'split'
                  ? 'bg-blue-600 text-white'
                  : 'text-vscode-text-dim hover:text-vscode-text'
              }`}
            >
              并排视图
            </button>
          </div>
        </div>
      </div>

      {/* 差异内容 */}
      <div className="flex-1 overflow-auto">
        {!parsedDiff || !parsedDiff.hunks || parsedDiff.hunks.length === 0 ? (
          <div className="flex items-center justify-center h-full text-vscode-text-dim">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>没有差异</p>
            </div>
          </div>
        ) : viewMode === 'unified' ? (
          <UnifiedDiffView parsedDiff={parsedDiff} branch1={branch1} branch2={branch2} />
        ) : (
          <SplitDiffView parsedDiff={parsedDiff} branch1={branch1} branch2={branch2} />
        )}
      </div>
    </div>
  );
}

// 统一视图
function UnifiedDiffView({ parsedDiff, branch1, branch2 }) {
  return (
    <div className="font-mono text-sm">
      {parsedDiff.hunks.map((hunk, hunkIndex) => (
        <div key={hunkIndex} className="border-b border-vscode-border last:border-b-0">
          {/* Hunk 头部 */}
          <div className="bg-vscode-panel px-4 py-2 text-vscode-text-dim sticky top-0 z-10 border-b border-vscode-border">
            <span className="select-none">
              @@ -{hunk.oldStart},{hunk.oldLines} +{hunk.newStart},{hunk.newLines} @@
            </span>
            {hunk.heading && <span className="ml-2">{hunk.heading}</span>}
          </div>

          {/* Hunk 内容 */}
          <div>
            {hunk.lines.map((line, lineIndex) => (
              <div
                key={lineIndex}
                className={`flex hover:bg-vscode-panel ${
                  line.type === 'add'
                    ? 'bg-green-900/20'
                    : line.type === 'delete'
                    ? 'bg-red-900/20'
                    : ''
                }`}
              >
                {/* 行号 */}
                <div className="flex">
                  <div className="diff-line-number bg-vscode-panel w-12 text-right select-none">
                    {line.oldLineNumber || ''}
                  </div>
                  <div className="diff-line-number bg-vscode-panel w-12 text-right select-none border-r-2 border-vscode-border">
                    {line.newLineNumber || ''}
                  </div>
                </div>

                {/* 变更标记 */}
                <div
                  className={`w-8 flex-shrink-0 flex items-center justify-center select-none ${
                    line.type === 'add'
                      ? 'bg-green-900/30 text-green-400'
                      : line.type === 'delete'
                      ? 'bg-red-900/30 text-red-400'
                      : 'bg-vscode-panel text-vscode-text-dim'
                  }`}
                >
                  {line.type === 'add' ? '+' : line.type === 'delete' ? '-' : ' '}
                </div>

                {/* 代码内容 */}
                <div className="diff-code flex-1 whitespace-pre-wrap break-all">
                  {line.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// 并排视图
function SplitDiffView({ parsedDiff, branch1, branch2 }) {
  return (
    <div className="font-mono text-sm">
      {parsedDiff.hunks.map((hunk, hunkIndex) => (
        <div key={hunkIndex} className="border-b border-vscode-border last:border-b-0">
          {/* Hunk 头部 */}
          <div className="bg-vscode-panel px-4 py-2 text-vscode-text-dim sticky top-0 z-10 border-b border-vscode-border grid grid-cols-2 gap-2">
            <div>
              <span className="font-semibold text-vscode-text">{branch1}</span>
              <span className="ml-2 select-none">
                @@ -{hunk.oldStart},{hunk.oldLines} @@
              </span>
            </div>
            <div>
              <span className="font-semibold text-vscode-text">{branch2}</span>
              <span className="ml-2 select-none">
                @@ +{hunk.newStart},{hunk.newLines} @@
              </span>
            </div>
          </div>

          {/* Hunk 内容 - 并排 */}
          <div className="grid grid-cols-2 gap-0">
            {/* 左侧（删除） */}
            <div className="border-r border-vscode-border">
              {hunk.lines
                .filter((line) => line.type !== 'add')
                .map((line, lineIndex) => (
                  <div
                    key={lineIndex}
                    className={`flex hover:bg-vscode-panel ${
                      line.type === 'delete' ? 'bg-red-900/20' : ''
                    }`}
                  >
                    <div className="diff-line-number bg-vscode-panel w-12 text-right select-none border-r-2 border-vscode-border">
                      {line.oldLineNumber || ''}
                    </div>
                    <div
                      className={`w-6 flex-shrink-0 flex items-center justify-center select-none ${
                        line.type === 'delete'
                          ? 'bg-red-900/30 text-red-400'
                          : 'bg-vscode-panel text-vscode-text-dim'
                      }`}
                    >
                      {line.type === 'delete' ? '-' : ' '}
                    </div>
                    <div className="diff-code flex-1 whitespace-pre-wrap break-all">
                      {line.content}
                    </div>
                  </div>
                ))}
            </div>

            {/* 右侧（新增） */}
            <div>
              {hunk.lines
                .filter((line) => line.type !== 'delete')
                .map((line, lineIndex) => (
                  <div
                    key={lineIndex}
                    className={`flex hover:bg-vscode-panel ${
                      line.type === 'add' ? 'bg-green-900/20' : ''
                    }`}
                  >
                    <div className="diff-line-number bg-vscode-panel w-12 text-right select-none border-r-2 border-vscode-border">
                      {line.newLineNumber || ''}
                    </div>
                    <div
                      className={`w-6 flex-shrink-0 flex items-center justify-center select-none ${
                        line.type === 'add'
                          ? 'bg-green-900/30 text-green-400'
                          : 'bg-vscode-panel text-vscode-text-dim'
                      }`}
                    >
                      {line.type === 'add' ? '+' : ' '}
                    </div>
                    <div className="diff-code flex-1 whitespace-pre-wrap break-all">
                      {line.content}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default DiffViewer;
