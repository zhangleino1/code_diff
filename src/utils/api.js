const API_BASE = '/api';

export const api = {
  // 设置仓库路径
  async setRepoPath(path) {
    const response = await fetch(`${API_BASE}/set-repo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path })
    });
    return response.json();
  },

  // 获取当前仓库路径
  async getRepoPath() {
    const response = await fetch(`${API_BASE}/repo-path`);
    return response.json();
  },

  // 获取所有分支
  async getBranches() {
    const response = await fetch(`${API_BASE}/branches`);
    return response.json();
  },

  // 获取两个分支之间的差异
  async getDiff(branch1, branch2, filePath = null) {
    const response = await fetch(`${API_BASE}/diff`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ branch1, branch2, filePath })
    });
    return response.json();
  },

  // 获取变更的文件列表
  async getChangedFiles(branch1, branch2) {
    const response = await fetch(`${API_BASE}/changed-files`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ branch1, branch2 })
    });
    return response.json();
  },

  // 获取文件内容
  async getFileContent(branch, filePath) {
    const response = await fetch(`${API_BASE}/file-content`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ branch, filePath })
    });
    return response.json();
  },

  // 切换分支
  async checkout(branch) {
    const response = await fetch(`${API_BASE}/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ branch })
    });
    return response.json();
  },

  // 获取提交历史
  async getLog(branch, maxCount = 50) {
    const response = await fetch(`${API_BASE}/log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ branch, maxCount })
    });
    return response.json();
  },

  // 导出对比报告
  async exportReport(branch1, branch2) {
    const response = await fetch(`${API_BASE}/export-report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ branch1, branch2 })
    });
    return response.json();
  }
};
