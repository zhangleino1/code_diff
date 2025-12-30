# 测试指南

## 快速测试

### 方法1: 使用启动脚本（推荐）

```bash
./start.sh
```

这将自动检查依赖并启动前后端服务。

### 方法2: 手动启动

```bash
# 安装依赖（首次运行）
npm install

# 启动服务
npm run dev
```

## 测试当前仓库

由于这个工具本身就是一个Git仓库，您可以直接测试：

1. 访问 http://localhost:3000
2. 工具会自动加载当前仓库（code_diff）
3. 选择两个分支进行对比，例如：
   - 基准分支: `claude/code-comparison-tool-D5rm8`
   - 目标分支: 如果有其他分支的话

## 创建测试分支

如果当前仓库只有一个分支，可以创建一个测试分支：

```bash
# 创建并切换到新分支
git checkout -b test-branch

# 修改一些文件
echo "# Test" >> test.txt
echo "console.log('test');" >> src/test.js

# 提交更改
git add .
git commit -m "test: 添加测试文件"

# 切换回原分支
git checkout claude/code-comparison-tool-D5rm8
```

现在您可以在工具中对比这两个分支了。

## 测试两个不同的仓库

### 场景: 对比公司仓库和客户仓库

假设您有两个仓库：
- `/path/to/company-repo`
- `/path/to/customer-repo`

#### 步骤1: 创建对比仓库

```bash
# 在合适的位置创建新目录
mkdir ~/code-comparison
cd ~/code-comparison
git init

# 添加两个远程仓库
git remote add company /path/to/company-repo
git remote add customer /path/to/customer-repo

# 拉取代码
git fetch company
git fetch customer

# 创建本地分支
git checkout -b company-main company/main
git checkout -b customer-main customer/main
```

#### 步骤2: 在工具中使用

1. 启动工具
2. 点击顶部的仓库路径编辑按钮
3. 输入: `~/code-comparison` （或完整路径）
4. 选择分支:
   - 基准分支: `company-main`
   - 目标分支: `customer-main`
5. 查看所有差异

## 功能测试清单

### 基础功能
- [ ] 页面正常加载
- [ ] 显示当前仓库路径
- [ ] 显示分支列表
- [ ] 选择两个不同的分支

### 文件列表
- [ ] 显示变更的文件列表
- [ ] 显示新增/删除/修改标记
- [ ] 显示每个文件的新增和删除行数
- [ ] 搜索框能过滤文件

### 差异查看
- [ ] 点击文件显示差异
- [ ] 统一视图正常显示
- [ ] 并排视图正常显示
- [ ] 行号正确显示
- [ ] 颜色标记正确（绿色=新增，红色=删除）

### 交互功能
- [ ] 切换视图模式（统一/并排）
- [ ] 刷新按钮工作正常
- [ ] 更改仓库路径功能正常
- [ ] 滚动流畅，无卡顿

### 错误处理
- [ ] 选择相同分支时显示提示
- [ ] 无效仓库路径时显示错误
- [ ] 网络错误时有友好提示

## 性能测试

### 大文件测试

1. 选择包含大文件变更的分支
2. 检查是否能流畅滚动
3. 检查内存使用是否合理

### 多文件测试

1. 选择包含大量文件变更的分支
2. 检查文件列表是否快速加载
3. 检查搜索功能是否快速响应

## 常见问题排查

### 后端无法启动

```bash
# 检查端口是否被占用
lsof -i :3001

# 或者更改端口
# 编辑 server/index.js，修改 PORT 常量
```

### 前端无法启动

```bash
# 检查端口是否被占用
lsof -i :3000

# 或者更改端口
# 编辑 vite.config.js，修改 server.port
```

### 无法获取分支列表

1. 确认当前目录是有效的Git仓库
2. 运行 `git branch -a` 确认有分支
3. 检查控制台错误信息

### 差异显示不正确

1. 刷新页面
2. 重新选择分支
3. 检查Git仓库状态: `git status`
4. 查看浏览器控制台错误

## 自动化测试（未来）

当前版本暂未包含自动化测试。如需添加测试：

```bash
# 安装测试依赖
npm install -D vitest @testing-library/react @testing-library/jest-dom

# 添加测试脚本到 package.json
"scripts": {
  "test": "vitest",
  "test:ui": "vitest --ui"
}
```

## 报告问题

如果发现bug或有改进建议：

1. 记录重现步骤
2. 截图或录屏
3. 查看浏览器控制台错误
4. 查看后端日志
5. 提交Issue

## 预期输出示例

### 成功启动后端
```
🚀 Git代码对比工具服务器运行在 http://localhost:3001
📁 当前仓库路径: /home/user/code_diff
```

### 成功启动前端
```
  VITE v5.4.21  ready in 234 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### 正常的API响应

**GET /api/branches**
```json
{
  "current": "claude/code-comparison-tool-D5rm8",
  "all": ["claude/code-comparison-tool-D5rm8", "main"],
  "branches": { ... }
}
```

**POST /api/changed-files**
```json
{
  "files": [
    {
      "file": "src/App.jsx",
      "changes": 10,
      "insertions": 8,
      "deletions": 2,
      "binary": false
    }
  ],
  "total": {
    "files": 1,
    "insertions": 8,
    "deletions": 2,
    "changes": 10
  }
}
```
