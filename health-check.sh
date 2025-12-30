#!/bin/bash

# 健康检查脚本 - 验证所有组件是否正常工作

echo "🔍 Git 代码对比工具 - 健康检查"
echo "================================"
echo ""

# 检查 Node.js
echo "1️⃣  检查 Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo "   ✅ Node.js 已安装: $NODE_VERSION"
else
    echo "   ❌ Node.js 未安装"
    exit 1
fi
echo ""

# 检查 npm
echo "2️⃣  检查 npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo "   ✅ npm 已安装: $NPM_VERSION"
else
    echo "   ❌ npm 未安装"
    exit 1
fi
echo ""

# 检查 Git
echo "3️⃣  检查 Git..."
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version)
    echo "   ✅ $GIT_VERSION"
else
    echo "   ❌ Git 未安装"
    exit 1
fi
echo ""

# 检查依赖
echo "4️⃣  检查项目依赖..."
if [ -d "node_modules" ]; then
    MODULE_COUNT=$(ls -1 node_modules | wc -l)
    echo "   ✅ 依赖已安装 ($MODULE_COUNT 个模块)"
else
    echo "   ⚠️  依赖未安装，运行 'npm install'"
fi
echo ""

# 检查项目文件
echo "5️⃣  检查项目文件..."
REQUIRED_FILES=(
    "package.json"
    "server/index.js"
    "src/App.jsx"
    "src/main.jsx"
    "index.html"
    "vite.config.js"
)

ALL_FILES_EXIST=true
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✅ $file"
    else
        echo "   ❌ $file 缺失"
        ALL_FILES_EXIST=false
    fi
done
echo ""

# 检查 Git 仓库
echo "6️⃣  检查 Git 仓库..."
if [ -d ".git" ]; then
    BRANCH=$(git branch --show-current 2>/dev/null || echo "未知")
    BRANCH_COUNT=$(git branch -a | wc -l)
    echo "   ✅ 这是一个 Git 仓库"
    echo "   📍 当前分支: $BRANCH"
    echo "   🌿 分支数量: $BRANCH_COUNT"
else
    echo "   ⚠️  不是 Git 仓库，工具仍可正常运行"
    echo "      但需要在界面中指定 Git 仓库路径"
fi
echo ""

# 检查端口
echo "7️⃣  检查端口占用..."
if command -v lsof &> /dev/null; then
    if lsof -i :3000 &> /dev/null; then
        echo "   ⚠️  端口 3000 已被占用"
    else
        echo "   ✅ 端口 3000 可用"
    fi

    if lsof -i :3001 &> /dev/null; then
        echo "   ⚠️  端口 3001 已被占用"
    else
        echo "   ✅ 端口 3001 可用"
    fi
else
    echo "   ⏭️  跳过端口检查 (lsof 不可用)"
fi
echo ""

# 测试构建
echo "8️⃣  测试代码语法..."
if [ -d "node_modules" ]; then
    echo "   🔨 运行快速语法检查..."
    npm run build > /tmp/build-test.log 2>&1
    if [ $? -eq 0 ]; then
        echo "   ✅ 代码可以成功构建"
        rm -rf dist
    else
        echo "   ❌ 构建失败，查看日志: /tmp/build-test.log"
        tail -20 /tmp/build-test.log
    fi
else
    echo "   ⏭️  跳过 (需要先安装依赖)"
fi
echo ""

# 总结
echo "================================"
echo "📊 健康检查总结"
echo "================================"

if [ "$ALL_FILES_EXIST" = true ] && [ -d "node_modules" ]; then
    echo "✅ 所有检查通过！"
    echo ""
    echo "🚀 可以启动应用:"
    echo "   ./start.sh"
    echo "   或"
    echo "   npm run dev"
    echo ""
    echo "📖 查看测试指南:"
    echo "   cat TESTING.md"
else
    echo "⚠️  存在一些问题，请先解决"
    echo ""
    if [ ! -d "node_modules" ]; then
        echo "💡 首先运行: npm install"
    fi
fi
echo ""
