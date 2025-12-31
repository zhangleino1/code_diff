import express from 'express';
import cors from 'cors';
import { simpleGit } from 'simple-git';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Git仓库路径配置
let repoPath = process.cwd();

// 设置仓库路径
app.post('/api/set-repo', async (req, res) => {
  try {
    const { path: newPath } = req.body;
    if (!newPath) {
      return res.status(400).json({ error: '请提供仓库路径' });
    }

    repoPath = newPath;
    const git = simpleGit(repoPath);

    // 验证是否是有效的Git仓库
    const isRepo = await git.checkIsRepo();
    if (!isRepo) {
      return res.status(400).json({ error: '无效的Git仓库路径' });
    }

    res.json({ success: true, path: repoPath });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取当前仓库路径
app.get('/api/repo-path', (req, res) => {
  res.json({ path: repoPath });
});

// 获取所有分支
app.get('/api/branches', async (req, res) => {
  try {
    const git = simpleGit(repoPath);
    const branches = await git.branch();

    res.json({
      current: branches.current,
      all: branches.all,
      branches: branches.branches
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取两个分支之间的差异
app.post('/api/diff', async (req, res) => {
  try {
    const { branch1, branch2, filePath } = req.body;

    if (!branch1 || !branch2) {
      return res.status(400).json({ error: '请提供两个分支名称' });
    }

    const git = simpleGit(repoPath);

    // 获取diff
    const diffOptions = ['--unified=5', '--no-color'];
    if (filePath) {
      diffOptions.push('--', filePath);
    }

    const diff = await git.diff([`${branch1}...${branch2}`, ...diffOptions]);

    res.json({ diff });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取两个分支之间变更的文件列表
app.post('/api/changed-files', async (req, res) => {
  try {
    const { branch1, branch2 } = req.body;

    if (!branch1 || !branch2) {
      return res.status(400).json({ error: '请提供两个分支名称' });
    }

    const git = simpleGit(repoPath);

    // 获取文件变更统计
    const diffSummary = await git.diffSummary([`${branch1}...${branch2}`]);

    res.json({
      files: diffSummary.files.map(file => ({
        file: file.file,
        changes: file.changes,
        insertions: file.insertions,
        deletions: file.deletions,
        binary: file.binary
      })),
      total: {
        files: diffSummary.files.length,
        insertions: diffSummary.insertions,
        deletions: diffSummary.deletions,
        changes: diffSummary.changed
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取特定文件在某个分支的内容
app.post('/api/file-content', async (req, res) => {
  try {
    const { branch, filePath } = req.body;

    if (!branch || !filePath) {
      return res.status(400).json({ error: '请提供分支名称和文件路径' });
    }

    const git = simpleGit(repoPath);

    try {
      const content = await git.show([`${branch}:${filePath}`]);
      res.json({ content });
    } catch (error) {
      // 文件可能在该分支不存在
      res.json({ content: '', error: '文件在该分支不存在' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 切换分支
app.post('/api/checkout', async (req, res) => {
  try {
    const { branch } = req.body;

    if (!branch) {
      return res.status(400).json({ error: '请提供分支名称' });
    }

    const git = simpleGit(repoPath);
    await git.checkout(branch);

    res.json({ success: true, branch });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取提交历史
app.post('/api/log', async (req, res) => {
  try {
    const { branch, maxCount = 50 } = req.body;

    const git = simpleGit(repoPath);
    const options = { maxCount };

    if (branch) {
      options.from = branch;
    }

    const log = await git.log(options);

    res.json({
      total: log.total,
      latest: log.latest,
      all: log.all
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 生成对比报告的Markdown内容
app.post('/api/export-report', async (req, res) => {
  try {
    const { branch1, branch2 } = req.body;

    if (!branch1 || !branch2) {
      return res.status(400).json({ error: '请提供两个分支名称' });
    }

    const git = simpleGit(repoPath);

    // 获取文件变更统计
    const diffSummary = await git.diffSummary([`${branch1}...${branch2}`]);

    // 获取完整的diff
    const fullDiff = await git.diff([`${branch1}...${branch2}`, '--unified=5', '--no-color']);

    // 获取分支信息
    const branch1Info = await git.log([branch1, '-1']);
    const branch2Info = await git.log([branch2, '-1']);

    // 生成Markdown报告
    const reportData = {
      branch1,
      branch2,
      branch1LatestCommit: branch1Info.latest,
      branch2LatestCommit: branch2Info.latest,
      summary: {
        totalFiles: diffSummary.files.length,
        insertions: diffSummary.insertions,
        deletions: diffSummary.deletions,
        changes: diffSummary.changed
      },
      files: diffSummary.files.map(file => ({
        file: file.file,
        changes: file.changes,
        insertions: file.insertions,
        deletions: file.deletions,
        binary: file.binary
      })),
      fullDiff
    };

    res.json(reportData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Git代码对比工具服务器运行在 http://localhost:${PORT}`);
  console.log(`📁 当前仓库路径: ${repoPath}`);
});
