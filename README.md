# Git 代码对比工具

一个功能强大的可视化Git代码对比工具，专为对比两个代码仓库的分支差异而设计。采用类似VSCode的界面风格，提供直观、美观的代码差异查看体验。

## 📚 文档导航

| 文档 | 说明 | 适用场景 |
|------|------|----------|
| **[QUICKSTART.md](QUICKSTART.md)** | 5分钟快速上手 | 首次使用、快速入门 |
| **[EXPORT_GUIDE.md](EXPORT_GUIDE.md)** | 导出功能详细指南 | 学习如何导出和使用对比报告 |
| **[TESTING.md](TESTING.md)** | 测试场景与故障排查 | 遇到问题、验证功能 |
| **本文档 (README.md)** | 完整功能文档 | 了解所有功能和技术细节 |

**新用户推荐路径**: QUICKSTART.md → 使用工具 → EXPORT_GUIDE.md

---

## 功能特性

- **📄 文件级对比模式**: 基于文件最终状态的对比，而非commit维度，直观展示两个分支的完整差异
- **📥 Markdown导出**: 一键导出详细的对比报告，包含统计信息、文件列表和完整代码差异（支持离线查看和分享）
- **🔀 双分支对比**: 在同一仓库中对比任意两个分支的代码差异
- **🎨 可视化界面**: 类似VSCode的深色主题，美观且专业
- **👁️ 双视图模式**:
  - 统一视图：传统的Git diff显示方式
  - 并排视图：左右对比，更清晰地查看变更
- **📋 文件列表**: 显示所有变更文件，包含新增、删除、修改标记
- **🔍 实时搜索**: 快速过滤和查找文件
- **📊 详细统计**: 显示每个文件的新增/删除行数
- **⚡ 性能优化**: 支持大型代码库，流畅的滚动和加载体验
- **🔄 仓库切换**: 灵活配置和切换不同的Git仓库

## 技术栈

### 后端
- **Node.js** + **Express**: 提供RESTful API服务
- **simple-git**: Git操作库，用于执行Git命令
- **diff**: 差异解析库

### 前端
- **React 18**: 现代化的UI框架
- **Vite**: 快速的构建工具
- **Tailwind CSS**: 实用优先的CSS框架
- **自定义Diff解析器**: 高性能的差异解析和渲染

## 安装

### 前置要求

- Node.js >= 16.0.0
- npm 或 yarn
- Git

### 安装步骤

```bash
# 克隆仓库
git clone <repository-url>
cd code_diff

# 安装依赖
npm install

# 或使用 yarn
yarn install
```

## 使用方法

### 1. 启动开发模式

```bash
npm run dev
```

这将同时启动：
- 后端服务器（端口 3001）
- 前端开发服务器（端口 3000）

访问 http://localhost:3000 即可使用工具。

### 2. 单独启动服务

```bash
# 仅启动后端
npm run server:dev

# 仅启动前端
npm run client:dev
```

### 3. 生产环境部署

```bash
# 构建前端
npm run build

# 启动生产服务器
npm start
```

## 使用场景

### 场景1: 对比公司仓库和客户仓库

1. 将两个仓库的代码合并到一个Git仓库中，使用不同的分支：
   ```bash
   # 在一个新的Git仓库中
   git remote add company <公司仓库URL>
   git remote add customer <客户仓库URL>

   git fetch company
   git fetch customer

   # 创建本地分支
   git checkout -b company-main company/main
   git checkout -b customer-main customer/main
   ```

2. 在工具中选择两个分支进行对比
3. 查看所有差异文件和详细的代码变更

### 场景2: 对比功能分支和主分支

1. 确保仓库已有多个分支
2. 在工具中选择主分支（如 main）和功能分支（如 feature/new-feature）
3. 查看功能开发中的所有变更

### 场景3: 切换不同仓库对比

1. 点击头部的仓库路径编辑按钮
2. 输入新的Git仓库绝对路径
3. 选择该仓库的分支进行对比

### 场景4: 导出对比报告

1. 选择需要对比的两个分支
2. 点击顶部的"导出报告"按钮（绿色按钮）
3. 自动生成并下载Markdown格式的详细对比报告
4. 报告包含：
   - 分支基本信息和最新提交
   - 变更统计数据
   - 按类型分组的文件列表（新增/删除/修改）
   - 所有文件的完整代码差异
5. 可用于：
   - 离线查看和分析
   - 团队分享和讨论
   - 代码审查文档
   - 项目交付报告

## 界面说明

### 主要区域

1. **顶部导航栏**
   - 显示当前仓库路径
   - 仓库切换按钮
   - **导出报告按钮**（绿色）：导出Markdown格式的详细对比报告
   - 刷新按钮

2. **分支选择器**
   - 左侧：基准分支（通常是主分支）
   - 右侧：目标分支（要对比的分支）
   - 中间显示对比方向
   - 右上角标签：显示当前为"文件级对比模式"

3. **文件列表（左侧栏）**
   - 显示所有变更文件
   - 文件类型图标
   - 变更类型标记（新增/删除/修改）
   - 新增和删除行数统计
   - 搜索框用于过滤文件

4. **差异查看器（主区域）**
   - 文件名和路径
   - 变更统计信息
   - 视图模式切换按钮
   - 代码差异显示区域

### 视图模式

**统一视图**
- 单列显示所有变更
- 绿色背景：新增的行
- 红色背景：删除的行
- 显示行号和变更标记（+/-）

**并排视图**
- 左右分栏显示
- 左侧：原始代码（基准分支）
- 右侧：变更后代码（目标分支）
- 更清晰地对比相同位置的差异

## 性能优化

本工具针对大型代码库进行了多项优化：

1. **按需加载**: 只在选择文件时加载对应的diff数据
2. **数据缓存**: API响应缓存，减少重复请求
3. **虚拟滚动**: 处理包含大量行的文件时保持流畅
4. **懒渲染**: 差异块按需渲染，提升初始加载速度
5. **代码分割**: 使用Vite的代码分割优化打包体积

## API 接口

后端提供以下REST API接口：

- `POST /api/set-repo` - 设置仓库路径
- `GET /api/repo-path` - 获取当前仓库路径
- `GET /api/branches` - 获取所有分支列表
- `POST /api/diff` - 获取两个分支之间的差异
- `POST /api/changed-files` - 获取变更文件列表
- `POST /api/file-content` - 获取特定文件内容
- `POST /api/checkout` - 切换分支
- `POST /api/log` - 获取提交历史

## 配置选项

默认配置可以在以下文件中修改：

- **后端端口**: `server/index.js` 中的 `PORT` 常量
- **前端端口**: `vite.config.js` 中的 `server.port`
- **主题颜色**: `tailwind.config.js` 中的 `theme.extend.colors`
- **样式**: `src/styles/index.css`

## 故障排除

### 问题1: 无法连接到后端

**解决方案**:
- 确保后端服务器正在运行（端口 3001）
- 检查防火墙设置
- 查看控制台错误信息

### 问题2: 分支列表为空

**解决方案**:
- 确认仓库路径正确
- 确认该路径是有效的Git仓库
- 运行 `git branch -a` 确认仓库有分支

### 问题3: Diff 显示不正确

**解决方案**:
- 刷新页面重新加载
- 检查Git仓库状态
- 确认选择的两个分支确实存在差异

## 开发

### 项目结构

```
code_diff/
├── server/              # 后端代码
│   └── index.js        # Express 服务器
├── src/                # 前端代码
│   ├── components/     # React 组件
│   │   ├── Header.jsx
│   │   ├── BranchSelector.jsx
│   │   ├── FileList.jsx
│   │   └── DiffViewer.jsx
│   ├── utils/          # 工具函数
│   │   ├── api.js
│   │   └── diffParser.js
│   ├── styles/         # 样式文件
│   │   └── index.css
│   ├── App.jsx         # 主应用组件
│   └── main.jsx        # 入口文件
├── public/             # 静态资源
├── package.json        # 项目配置
├── vite.config.js      # Vite 配置
└── tailwind.config.js  # Tailwind 配置
```

### 添加新功能

1. Fork 本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

MIT License

## 贡献

欢迎贡献代码、报告问题或提出新功能建议！

## 联系方式

如有问题或建议，请提交 Issue。
