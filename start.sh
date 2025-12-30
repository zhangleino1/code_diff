#!/bin/bash

# Git 代码对比工具 - 快速启动脚本

echo "🚀 启动 Git 代码对比工具..."
echo ""

# 检查是否安装了依赖
if [ ! -d "node_modules" ]; then
  echo "📦 检测到未安装依赖，正在安装..."
  npm install
  echo ""
fi

# 检查 Git 仓库
if [ ! -d ".git" ]; then
  echo "⚠️  警告: 当前目录不是 Git 仓库"
  echo "   工具将以当前目录作为仓库路径"
  echo ""
fi

# 显示当前分支
if [ -d ".git" ]; then
  CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || echo "未知")
  echo "📁 当前仓库路径: $(pwd)"
  echo "🌿 当前分支: $CURRENT_BRANCH"
  echo "🌿 可用分支:"
  git branch -a | head -5
  echo ""
fi

echo "================================"
echo "🎯 启动服务..."
echo "================================"
echo ""
echo "前端服务: http://localhost:3000"
echo "后端服务: http://localhost:3001"
echo ""
echo "按 Ctrl+C 停止服务"
echo ""

# 启动应用
npm run dev
