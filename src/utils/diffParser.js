/**
 * 解析Git diff输出为结构化数据
 */
export function parseDiff(diffText) {
  if (!diffText || diffText.trim() === '') {
    return [];
  }

  const files = [];
  const fileRegex = /^diff --git a\/(.*) b\/(.*)$/gm;
  const lines = diffText.split('\n');

  let currentFile = null;
  let currentHunk = null;
  let lineIndex = 0;

  while (lineIndex < lines.length) {
    const line = lines[lineIndex];

    // 新文件开始
    if (line.startsWith('diff --git')) {
      if (currentFile) {
        files.push(currentFile);
      }

      const match = line.match(/^diff --git a\/(.*) b\/(.*)$/);
      currentFile = {
        oldPath: match[1],
        newPath: match[2],
        hunks: [],
        additions: 0,
        deletions: 0
      };
      currentHunk = null;
    }
    // 文件模式变化
    else if (line.startsWith('new file mode') || line.startsWith('deleted file mode')) {
      if (currentFile) {
        currentFile.type = line.startsWith('new') ? 'add' : 'delete';
      }
    }
    // Hunk头部
    else if (line.startsWith('@@')) {
      const hunkMatch = line.match(/@@ -(\d+),?(\d*) \+(\d+),?(\d*) @@(.*)/);
      if (hunkMatch && currentFile) {
        currentHunk = {
          oldStart: parseInt(hunkMatch[1]),
          oldLines: parseInt(hunkMatch[2] || 1),
          newStart: parseInt(hunkMatch[3]),
          newLines: parseInt(hunkMatch[4] || 1),
          lines: [],
          heading: hunkMatch[5].trim()
        };
        currentFile.hunks.push(currentHunk);
      }
    }
    // Hunk内容
    else if (currentHunk && (line.startsWith('+') || line.startsWith('-') || line.startsWith(' '))) {
      const type = line[0] === '+' ? 'add' : line[0] === '-' ? 'delete' : 'normal';
      const content = line.substring(1);

      currentHunk.lines.push({
        type,
        content,
        oldLineNumber: type !== 'add' ? currentHunk.oldStart + currentHunk.lines.filter(l => l.type !== 'add').length : null,
        newLineNumber: type !== 'delete' ? currentHunk.newStart + currentHunk.lines.filter(l => l.type !== 'delete').length : null
      });

      if (type === 'add') currentFile.additions++;
      if (type === 'delete') currentFile.deletions++;
    }

    lineIndex++;
  }

  // 添加最后一个文件
  if (currentFile) {
    files.push(currentFile);
  }

  return files;
}

/**
 * 根据文件扩展名获取语言
 */
export function getLanguageFromFilename(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  const languageMap = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    py: 'python',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
    h: 'c',
    cs: 'csharp',
    go: 'go',
    rs: 'rust',
    php: 'php',
    rb: 'ruby',
    swift: 'swift',
    kt: 'kotlin',
    scala: 'scala',
    html: 'html',
    css: 'css',
    scss: 'scss',
    less: 'less',
    json: 'json',
    xml: 'xml',
    yaml: 'yaml',
    yml: 'yaml',
    md: 'markdown',
    sh: 'shell',
    bash: 'shell',
    sql: 'sql',
    vue: 'vue',
    dockerfile: 'dockerfile'
  };

  return languageMap[ext] || 'plaintext';
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * 获取变更类型的显示文本和颜色
 */
export function getChangeTypeInfo(type) {
  const types = {
    add: { text: '新增', color: 'text-green-400', bgColor: 'bg-green-900/30' },
    delete: { text: '删除', color: 'text-red-400', bgColor: 'bg-red-900/30' },
    modify: { text: '修改', color: 'text-blue-400', bgColor: 'bg-blue-900/30' },
    rename: { text: '重命名', color: 'text-yellow-400', bgColor: 'bg-yellow-900/30' }
  };
  return types[type] || types.modify;
}
