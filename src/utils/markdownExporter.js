/**
 * 生成Markdown格式的对比报告
 */
export function generateMarkdownReport(reportData, repoPath) {
  const {
    branch1,
    branch2,
    branch1LatestCommit,
    branch2LatestCommit,
    summary,
    files,
    fullDiff
  } = reportData;

  const now = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });

  let markdown = `# Git 代码对比报告

## 基本信息

| 项目 | 内容 |
|------|------|
| **仓库路径** | \`${repoPath}\` |
| **基准分支** | \`${branch1}\` |
| **目标分支** | \`${branch2}\` |
| **生成时间** | ${now} |

## 分支信息

### 基准分支: ${branch1}

| 信息 | 内容 |
|------|------|
| **最新提交** | \`${branch1LatestCommit?.hash || 'N/A'}\` |
| **作者** | ${branch1LatestCommit?.author_name || 'N/A'} |
| **时间** | ${branch1LatestCommit?.date || 'N/A'} |
| **提交信息** | ${branch1LatestCommit?.message || 'N/A'} |

### 目标分支: ${branch2}

| 信息 | 内容 |
|------|------|
| **最新提交** | \`${branch2LatestCommit?.hash || 'N/A'}\` |
| **作者** | ${branch2LatestCommit?.author_name || 'N/A'} |
| **时间** | ${branch2LatestCommit?.date || 'N/A'} |
| **提交信息** | ${branch2LatestCommit?.message || 'N/A'} |

---

## 变更统计

| 统计项 | 数量 |
|--------|------|
| **变更文件数** | ${summary.totalFiles} |
| **新增行数** | <span style="color: green">+${summary.insertions}</span> |
| **删除行数** | <span style="color: red">-${summary.deletions}</span> |
| **总变更行数** | ${summary.changes} |

---

## 变更文件列表

`;

  // 按变更类型分组
  const addedFiles = files.filter(f => f.insertions > 0 && f.deletions === 0);
  const deletedFiles = files.filter(f => f.deletions > 0 && f.insertions === 0);
  const modifiedFiles = files.filter(f => f.insertions > 0 && f.deletions > 0);

  if (addedFiles.length > 0) {
    markdown += `### 新增文件 (${addedFiles.length})\n\n`;
    markdown += `| 文件路径 | 新增行数 |\n`;
    markdown += `|----------|----------|\n`;
    addedFiles.forEach(file => {
      markdown += `| \`${file.file}\` | <span style="color: green">+${file.insertions}</span> |\n`;
    });
    markdown += `\n`;
  }

  if (deletedFiles.length > 0) {
    markdown += `### 删除文件 (${deletedFiles.length})\n\n`;
    markdown += `| 文件路径 | 删除行数 |\n`;
    markdown += `|----------|----------|\n`;
    deletedFiles.forEach(file => {
      markdown += `| \`${file.file}\` | <span style="color: red">-${file.deletions}</span> |\n`;
    });
    markdown += `\n`;
  }

  if (modifiedFiles.length > 0) {
    markdown += `### 修改文件 (${modifiedFiles.length})\n\n`;
    markdown += `| 文件路径 | 新增 | 删除 | 总变更 |\n`;
    markdown += `|----------|------|------|--------|\n`;
    modifiedFiles.forEach(file => {
      markdown += `| \`${file.file}\` | <span style="color: green">+${file.insertions}</span> | <span style="color: red">-${file.deletions}</span> | ${file.changes} |\n`;
    });
    markdown += `\n`;
  }

  markdown += `---

## 详细差异

> **说明**: 以下是所有文件的详细代码差异

`;

  // 解析diff并格式化
  const diffSections = parseDiffToMarkdown(fullDiff);
  markdown += diffSections;

  markdown += `
---

## 报告说明

- 本报告由 **Git 代码对比工具** 自动生成
- 对比基于文件的最终状态，展示两个分支之间的所有差异
- 绿色表示新增内容，红色表示删除内容
- 如有疑问，请检查原始Git仓库

---

**报告生成时间**: ${now}
`;

  return markdown;
}

/**
 * 将Git diff转换为Markdown格式
 */
function parseDiffToMarkdown(diffText) {
  if (!diffText || diffText.trim() === '') {
    return '> 没有差异\n';
  }

  let markdown = '';
  const lines = diffText.split('\n');
  let currentFile = null;
  let inHunk = false;
  let codeBlock = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 新文件开始
    if (line.startsWith('diff --git')) {
      // 保存之前的代码块
      if (codeBlock.length > 0) {
        markdown += '```diff\n' + codeBlock.join('\n') + '\n```\n\n';
        codeBlock = [];
      }

      const match = line.match(/diff --git a\/(.*) b\/(.*)/);
      if (match) {
        currentFile = match[2];
        markdown += `### 📄 ${currentFile}\n\n`;
      }
      continue;
    }

    // 文件模式
    if (line.startsWith('new file mode') || line.startsWith('deleted file mode')) {
      continue;
    }

    // index 行
    if (line.startsWith('index ')) {
      continue;
    }

    // --- +++ 行
    if (line.startsWith('---') || line.startsWith('+++')) {
      continue;
    }

    // Hunk 头部
    if (line.startsWith('@@')) {
      if (codeBlock.length > 0) {
        markdown += '```diff\n' + codeBlock.join('\n') + '\n```\n\n';
        codeBlock = [];
      }
      inHunk = true;
      const hunkMatch = line.match(/@@ -(\d+),?(\d*) \+(\d+),?(\d*) @@(.*)/);
      if (hunkMatch) {
        const context = hunkMatch[5].trim();
        if (context) {
          markdown += `**${context}**\n\n`;
        }
      }
      continue;
    }

    // 代码行
    if (inHunk) {
      codeBlock.push(line);
    }
  }

  // 保存最后的代码块
  if (codeBlock.length > 0) {
    markdown += '```diff\n' + codeBlock.join('\n') + '\n```\n\n';
  }

  return markdown;
}

/**
 * 下载Markdown文件
 */
export function downloadMarkdown(content, filename) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
