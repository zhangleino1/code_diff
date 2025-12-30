import { useState, useEffect, useCallback, useMemo } from 'react';
import BranchSelector from './components/BranchSelector';
import FileList from './components/FileList';
import DiffViewer from './components/DiffViewer';
import Header from './components/Header';
import { api } from './utils/api';
import './styles/index.css';

function App() {
  const [branches, setBranches] = useState([]);
  const [selectedBranch1, setSelectedBranch1] = useState('');
  const [selectedBranch2, setSelectedBranch2] = useState('');
  const [changedFiles, setChangedFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [diffData, setDiffData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [repoPath, setRepoPath] = useState('');
  const [filterText, setFilterText] = useState('');

  // 加载仓库信息
  const loadRepoInfo = useCallback(async () => {
    try {
      const pathData = await api.getRepoPath();
      setRepoPath(pathData.path);

      const branchData = await api.getBranches();
      setBranches(branchData.all || []);

      // 默认选择当前分支作为第一个分支
      if (branchData.current) {
        setSelectedBranch1(branchData.current);
      }
    } catch (err) {
      setError('加载仓库信息失败: ' + err.message);
    }
  }, []);

  useEffect(() => {
    loadRepoInfo();
  }, [loadRepoInfo]);

  // 当选择的分支改变时，加载变更的文件列表
  const loadChangedFiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSelectedFile(null);
    setDiffData(null);

    try {
      const data = await api.getChangedFiles(selectedBranch1, selectedBranch2);
      setChangedFiles(data.files || []);
    } catch (err) {
      setError('加载文件列表失败: ' + err.message);
      setChangedFiles([]);
    } finally {
      setLoading(false);
    }
  }, [selectedBranch1, selectedBranch2]);

  useEffect(() => {
    if (selectedBranch1 && selectedBranch2 && selectedBranch1 !== selectedBranch2) {
      loadChangedFiles();
    }
  }, [selectedBranch1, selectedBranch2, loadChangedFiles]);

  // 选择文件查看差异
  const handleFileSelect = useCallback(async (file) => {
    setSelectedFile(file);
    setLoading(true);
    setError(null);

    try {
      const data = await api.getDiff(selectedBranch1, selectedBranch2, file.file);
      setDiffData(data.diff);
    } catch (err) {
      setError('加载文件差异失败: ' + err.message);
      setDiffData(null);
    } finally {
      setLoading(false);
    }
  }, [selectedBranch1, selectedBranch2]);

  // 刷新数据
  const handleRefresh = useCallback(() => {
    loadRepoInfo();
    if (selectedBranch1 && selectedBranch2) {
      loadChangedFiles();
    }
  }, [loadRepoInfo, loadChangedFiles, selectedBranch1, selectedBranch2]);

  // 设置仓库路径
  const handleSetRepoPath = useCallback(async (newPath) => {
    try {
      setLoading(true);
      await api.setRepoPath(newPath);
      setRepoPath(newPath);
      await loadRepoInfo();
      setError(null);
    } catch (err) {
      setError('设置仓库路径失败: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [loadRepoInfo]);

  // 过滤文件
  const filteredFiles = useMemo(() =>
    changedFiles.filter(file =>
      file.file.toLowerCase().includes(filterText.toLowerCase())
    ), [changedFiles, filterText]
  );

  return (
    <div className="min-h-screen bg-vscode-bg text-vscode-text flex flex-col">
      <Header
        repoPath={repoPath}
        onSetRepoPath={handleSetRepoPath}
        onRefresh={handleRefresh}
      />

      <div className="flex-1 flex flex-col p-4 gap-4">
        {/* 分支选择器 */}
        <BranchSelector
          branches={branches}
          branch1={selectedBranch1}
          branch2={selectedBranch2}
          onBranch1Change={setSelectedBranch1}
          onBranch2Change={setSelectedBranch2}
        />

        {error && (
          <div className="bg-red-900/30 border border-red-500/50 text-red-300 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* 主内容区域 */}
        {selectedBranch1 && selectedBranch2 && selectedBranch1 !== selectedBranch2 ? (
          <div className="flex-1 flex gap-4 min-h-0">
            {/* 文件列表 */}
            <div className="w-80 flex-shrink-0">
              <FileList
                files={filteredFiles}
                selectedFile={selectedFile}
                onFileSelect={handleFileSelect}
                loading={loading}
                filterText={filterText}
                onFilterChange={setFilterText}
              />
            </div>

            {/* 差异视图 */}
            <div className="flex-1 min-w-0">
              <DiffViewer
                diffData={diffData}
                selectedFile={selectedFile}
                loading={loading}
                branch1={selectedBranch1}
                branch2={selectedBranch2}
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-vscode-text-dim">
              <svg className="w-24 h-24 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12M8 12h12M8 17h12M3 7h.01M3 12h.01M3 17h.01" />
              </svg>
              <p className="text-xl mb-2">请选择两个不同的分支进行对比</p>
              <p className="text-sm">选择分支后将显示差异文件列表</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
