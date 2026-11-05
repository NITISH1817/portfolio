import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  RotateCcw,
  Sparkles,
  Cpu,
  Layers,
  Database,
  Code2,
  Terminal,
  Activity,
  CheckCircle2,
  Sliders,
  ChevronRight,
  TrendingDown
} from 'lucide-react';

export default function TechLabModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('dsa'); // 'dsa' | 'java' | 'python' | 'aiml' | 'db'

  // =========================================================================
  // LAB 1: DSA SORTING & SEARCHING VISUALIZER STATE
  // =========================================================================
  const defaultArray = [45, 18, 72, 30, 95, 12, 60, 38, 85, 24];
  const [sortArray, setSortArray] = useState([...defaultArray]);
  const [comparing, setComparing] = useState([]);
  const [isSorting, setIsSorting] = useState(false);
  const [selectedAlgo, setSelectedAlgo] = useState('bubble'); // 'bubble' | 'binarySearch'
  const [searchTarget, setSearchTarget] = useState(60);
  const [searchRange, setSearchRange] = useState({ low: 0, high: 9, mid: 4, found: false });

  // Bubble sort step-by-step
  const runBubbleSort = async () => {
    setIsSorting(true);
    const arr = [...sortArray];
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        setComparing([j, j + 1]);
        await new Promise((r) => setTimeout(r, 240));
        if (arr[j] > arr[j + 1]) {
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          setSortArray([...arr]);
          await new Promise((r) => setTimeout(r, 200));
        }
      }
    }
    setComparing([]);
    setIsSorting(false);
  };

  const resetSortArray = () => {
    setSortArray([...defaultArray]);
    setComparing([]);
    setIsSorting(false);
    setSearchRange({ low: 0, high: 9, mid: 4, found: false });
  };

  // Binary search step
  const sortedForSearch = [12, 18, 24, 30, 38, 45, 60, 72, 85, 95];
  const runBinarySearchStep = async () => {
    let low = 0;
    let high = sortedForSearch.length - 1;
    setSearchRange({ low, high, mid: Math.floor((low + high) / 2), found: false });

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      setSearchRange({ low, high, mid, found: false });
      await new Promise((r) => setTimeout(r, 700));

      if (sortedForSearch[mid] === searchTarget) {
        setSearchRange({ low, high, mid, found: true });
        break;
      } else if (sortedForSearch[mid] < searchTarget) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
  };

  // =========================================================================
  // LAB 2: JAVA OOP & JVM MEMORY SIMULATOR STATE
  // =========================================================================
  const [javaMode, setJavaMode] = useState('polymorphism'); // 'polymorphism' | 'jvm'
  const [selectedVehicleType, setSelectedVehicleType] = useState('OffRoader');

  // =========================================================================
  // LAB 3: PYTHON & ML GRADIENT DESCENT SIMULATOR STATE
  // =========================================================================
  const [learningRate, setLearningRate] = useState(0.1);
  const [gdStep, setGdStep] = useState(0);
  const [currentLoss, setCurrentLoss] = useState(14.8);

  const stepGradientDescent = () => {
    setGdStep((prev) => prev + 1);
    setCurrentLoss((prev) => Math.max(0.12, parseFloat((prev * (1 - learningRate * 0.45)).toFixed(3))));
  };

  const resetGradientDescent = () => {
    setGdStep(0);
    setCurrentLoss(14.8);
  };

  // =========================================================================
  // LAB 4: AI/ML K-MEANS & CLUSTERING STATE
  // =========================================================================
  const [clusterIteration, setClusterIteration] = useState(1);
  const stepKMeans = () => {
    setClusterIteration((prev) => (prev % 5) + 1);
  };

  // =========================================================================
  // LAB 5: DATABASE SQL QUERY EXECUTION STATE
  // =========================================================================
  const sampleDatabase = [
    { id: 1, name: 'Nitish Priyan R S', role: 'Full Stack / AI Engineer', cgpa: 7.79, batch: '2028' },
    { id: 2, name: 'Lexora Platform', role: 'AI Legal Research', cgpa: 9.2, batch: '2024' },
    { id: 3, name: 'AI Govt Scheme', role: 'Citizen Eligibility', cgpa: 8.9, batch: '2024' },
    { id: 4, name: 'Project Zero', role: 'Security Diagnostics', cgpa: 8.5, batch: '2024' }
  ];
  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM candidates WHERE cgpa >= 7.5;');
  const [sqlResults, setSqlResults] = useState(sampleDatabase);

  const executeSql = () => {
    const q = sqlQuery.toLowerCase();
    if (q.includes('where') && q.includes('8')) {
      setSqlResults(sampleDatabase.filter((row) => row.cgpa >= 8.5));
    } else if (q.includes('candidates')) {
      setSqlResults(sampleDatabase);
    } else {
      setSqlResults(sampleDatabase);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      data-modal-active="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(7, 4, 13, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)'
      }}
      className="p-3 sm:p-6 select-none font-inter animate-in fade-in duration-200"
    >
      <div
        style={{
          width: 'min(1100px, 94vw)',
          maxHeight: '85vh',
          borderRadius: '20px'
        }}
        className="relative bg-[#120B22] text-slate-100 shadow-[0_0_60px_rgba(56,189,248,0.25),0_25px_60px_rgba(0,0,0,0.9)] border border-cyan-400/50 overflow-hidden flex flex-col"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-500/25 bg-[#0C0717] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-orange-400 animate-ping shadow-[0_0_10px_#FF9A45]" />
            <div>
              <h1 className="font-space text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                INTERACTIVE TECHNOLOGY LABORATORY
              </h1>
              <p className="text-xs text-purple-300/80 font-medium font-inter">
                Live CSE simulation sandbox demonstrating Java, Python, AI/ML, SQL, and DSA
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 sm:p-2.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 text-purple-200 hover:text-white border border-purple-500/30 shadow-md transition-all active:scale-95 flex items-center gap-1.5 text-xs font-mono font-bold"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">ESC</span>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-purple-500/20 bg-[#0F0820] overflow-x-auto shrink-0">
          {[
            { id: 'dsa', label: 'DSA & ALGORITHMS', icon: <TrendingDown className="w-4 h-4 text-cyan-400" /> },
            { id: 'java', label: 'JAVA & JVM LAB', icon: <Code2 className="w-4 h-4 text-orange-400" /> },
            { id: 'python', label: 'PYTHON & ML LOSS', icon: <Sliders className="w-4 h-4 text-pink-400" /> },
            { id: 'aiml', label: 'AI/ML CLUSTERING', icon: <Cpu className="w-4 h-4 text-purple-400" /> },
            { id: 'db', label: 'SQL DATABASE LAB', icon: <Database className="w-4 h-4 text-emerald-400" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-space font-bold uppercase tracking-wider transition-all shrink-0 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-900 to-cyan-950 text-white border border-cyan-400/60 shadow-[0_0_15px_rgba(56,189,248,0.25)]'
                  : 'text-purple-300/70 hover:text-white hover:bg-purple-950/40 border border-transparent'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto game-modal-scroll space-y-6 flex-1 bg-[#120B22]">
          {/* TAB 1: DSA SORTING & SEARCHING */}
          {activeTab === 'dsa' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-[#170E2D] border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-space text-lg font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" /> Bubble Sort Step Visualizer
                  </h3>
                  <p className="text-xs text-purple-300 font-inter mt-1">
                    Watch comparisons and adjacent swaps in real-time ($O(n^2)$ time complexity, in-place).
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={runBubbleSort}
                    disabled={isSorting}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-slate-950 font-space font-bold text-xs shadow-md transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isSorting ? 'SORTING...' : 'RUN SORT'}</span>
                  </button>
                  <button
                    onClick={resetSortArray}
                    disabled={isSorting}
                    className="p-2 rounded-xl bg-purple-950 border border-purple-500/40 text-purple-200 hover:text-white"
                    title="Reset Array"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Bar Visualization Display */}
              <div className="h-48 p-6 rounded-2xl bg-[#0B0616] border border-purple-500/30 flex items-end justify-center gap-3 sm:gap-5">
                {sortArray.map((val, idx) => {
                  const isComp = comparing.includes(idx);
                  return (
                    <div key={idx} className="flex flex-col items-center gap-2 flex-1 max-w-[45px]">
                      <span className="text-[10px] font-mono font-bold text-purple-300">{val}</span>
                      <div
                        style={{ height: `${val * 1.3}px` }}
                        className={`w-full rounded-t-lg transition-all duration-200 ${
                          isComp
                            ? 'bg-gradient-to-t from-orange-500 to-pink-500 shadow-[0_0_15px_#FF6B00]'
                            : 'bg-gradient-to-t from-cyan-600 to-blue-400 shadow-[0_0_10px_rgba(56,189,248,0.3)]'
                        }`}
                      />
                      <span className="text-[9px] font-mono text-purple-400/60">[{idx}]</span>
                    </div>
                  );
                })}
              </div>

              {/* Binary Search Section */}
              <div className="p-5 rounded-2xl bg-[#170E2D] border border-purple-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-space text-sm font-bold text-white uppercase tracking-wider">
                      Binary Search on Sorted Dataset ($O(\log n)$)
                    </h3>
                    <p className="text-xs text-purple-300 font-inter">
                      Target: {searchTarget} | Low: {searchRange.low}, Mid: {searchRange.mid}, High: {searchRange.high}
                    </p>
                  </div>
                  <button
                    onClick={runBinarySearchStep}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 text-white font-space font-bold text-xs shadow-md"
                  >
                    STEP SEARCH
                  </button>
                </div>

                <div className="flex items-center justify-between gap-1 sm:gap-2">
                  {sortedForSearch.map((val, idx) => {
                    const isMid = searchRange.mid === idx;
                    const isWithin = idx >= searchRange.low && idx <= searchRange.high;
                    const isTargetFound = isMid && searchRange.found;

                    return (
                      <div
                        key={idx}
                        className={`flex-1 py-3 text-center rounded-xl font-mono text-xs font-bold border transition-all ${
                          isTargetFound
                            ? 'bg-emerald-500/30 border-emerald-400 text-emerald-300 shadow-[0_0_15px_#10B981]'
                            : isMid
                            ? 'bg-orange-500/25 border-orange-400 text-orange-300'
                            : isWithin
                            ? 'bg-purple-950/60 border-purple-500/40 text-white'
                            : 'bg-[#0A0514]/40 border-slate-800 text-slate-600'
                        }`}
                      >
                        {val}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: JAVA LAB & JVM */}
          {activeTab === 'java' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* OOP Polymorphism */}
                <div className="p-5 rounded-2xl bg-[#170E2D] border border-purple-500/30 space-y-4">
                  <h3 className="font-space text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-orange-400" /> Polymorphism & Dynamic Dispatch
                  </h3>
                  <p className="text-xs text-purple-200 font-inter">
                    Select a subclass to observe runtime method binding:
                  </p>

                  <div className="flex gap-2">
                    {['OffRoader', 'CyberCar', 'NitroDrifter'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setSelectedVehicleType(type)}
                        className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
                          selectedVehicleType === type
                            ? 'bg-orange-500 text-slate-950 shadow-md'
                            : 'bg-[#0B0616] text-purple-300 border border-purple-500/30'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl bg-[#090412] border border-purple-500/20 font-mono text-xs text-cyan-300 space-y-1">
                    <div>Vehicle v = new {selectedVehicleType}();</div>
                    <div className="text-slate-400">// Invoking dynamic overridden method:</div>
                    <div className="text-emerald-400">v.accelerate();</div>
                    <div className="text-purple-300 pt-1">
                      &rarr; Output: "{selectedVehicleType === 'OffRoader' ? 'Torque distributed across 4WD differential!' : selectedVehicleType === 'CyberCar' ? 'Dual electric motors spun to 18,000 RPM!' : 'Twin-turbo nitrous oxide injected into combustion!'}"
                    </div>
                  </div>
                </div>

                {/* JVM Architecture */}
                <div className="p-5 rounded-2xl bg-[#170E2D] border border-purple-500/30 space-y-4">
                  <h3 className="font-space text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-cyan-400" /> JVM Memory Architecture
                  </h3>
                  <div className="space-y-2 text-xs font-inter">
                    <div className="p-3 rounded-xl bg-[#0B0616] border border-cyan-500/30 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white">Heap Memory (Young/Tenured)</div>
                        <div className="text-slate-400 text-[11px]">Object allocations & GC sweeps</div>
                      </div>
                      <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950 px-2 py-1 rounded">ACTIVE</span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#0B0616] border border-purple-500/30 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white">Java Thread Stacks</div>
                        <div className="text-slate-400 text-[11px]">Stack frames, primitives & references</div>
                      </div>
                      <span className="text-[10px] font-mono text-purple-300 bg-purple-950 px-2 py-1 rounded">THREAD SAFE</span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#0B0616] border border-pink-500/30 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white">Metaspace (Native)</div>
                        <div className="text-slate-400 text-[11px]">Loaded class metadata & bytecode</div>
                      </div>
                      <span className="text-[10px] font-mono text-pink-300 bg-pink-950 px-2 py-1 rounded">NATIVE</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PYTHON & ML LOSS */}
          {activeTab === 'python' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-[#170E2D] border border-purple-500/30 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-space text-lg font-bold text-white flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-pink-400" /> Gradient Descent Step Simulator
                    </h3>
                    <p className="text-xs text-purple-300 font-inter">
                      Adjust learning rate &alpha; and step through iterations to minimize loss J(&theta;) = (1/2m) &Sigma; (h(x) - y)&sup2;.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={stepGradientDescent}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-space font-bold text-xs shadow-md"
                    >
                      STEP OPTIMIZER
                    </button>
                    <button
                      onClick={resetGradientDescent}
                      className="p-2 rounded-xl bg-purple-950 border border-purple-500/40 text-purple-300"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Telemetry Pod */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-[#0B0616] border border-purple-500/30 text-center">
                    <div className="text-[10px] font-mono uppercase text-slate-400">EPOCH / STEP</div>
                    <div className="text-xl font-space font-bold text-white mt-1">{gdStep}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#0B0616] border border-pink-500/30 text-center">
                    <div className="text-[10px] font-mono uppercase text-slate-400">LEARNING RATE (\alpha)</div>
                    <div className="text-xl font-space font-bold text-pink-400 mt-1">{learningRate}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#0B0616] border border-cyan-500/30 text-center">
                    <div className="text-[10px] font-mono uppercase text-slate-400">CURRENT LOSS (MSE)</div>
                    <div className="text-xl font-space font-bold text-cyan-300 mt-1">{currentLoss}</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#090412] border border-purple-500/20 font-mono text-xs text-slate-300 space-y-1">
                  <span className="text-pink-400">def</span> gradient_step(weights, X, y, lr={learningRate}):<br />
                  &nbsp;&nbsp;predictions = X.dot(weights)<br />
                  &nbsp;&nbsp;gradient = (2/len(X)) * X.T.dot(predictions - y)<br />
                  &nbsp;&nbsp;return weights - lr * gradient
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AI/ML CLUSTERING */}
          {activeTab === 'aiml' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-[#170E2D] border border-purple-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-space text-lg font-bold text-white flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-purple-400" /> K-Means Unsupervised Clustering
                    </h3>
                    <p className="text-xs text-purple-300 font-inter">
                      Centroid convergence iteration: {clusterIteration}/5 ($k=3$)
                    </p>
                  </div>
                  <button
                    onClick={stepKMeans}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-space font-bold text-xs"
                  >
                    NEXT ITERATION
                  </button>
                </div>

                {/* 2D Cluster Canvas Simulation */}
                <div className="h-44 rounded-xl bg-[#0B0616] border border-purple-500/30 relative overflow-hidden flex items-center justify-around p-4">
                  {/* Cluster 1: NLP Embeddings */}
                  <div className="text-center space-y-1">
                    <div className="w-12 h-12 rounded-full bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center font-mono text-xs font-bold text-cyan-300 animate-pulse">
                      C1
                    </div>
                    <div className="text-[10px] font-mono text-cyan-400">NLP Vectors</div>
                  </div>

                  {/* Cluster 2: Vision Features */}
                  <div className="text-center space-y-1">
                    <div className="w-12 h-12 rounded-full bg-pink-500/20 border-2 border-pink-400 flex items-center justify-center font-mono text-xs font-bold text-pink-300 animate-pulse">
                      C2
                    </div>
                    <div className="text-[10px] font-mono text-pink-400">Vision Embeddings</div>
                  </div>

                  {/* Cluster 3: Tabular Nodes */}
                  <div className="text-center space-y-1">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center font-mono text-xs font-bold text-emerald-300 animate-pulse">
                      C3
                    </div>
                    <div className="text-[10px] font-mono text-emerald-400">Structured Data</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: DATABASE SQL QUERY */}
          {activeTab === 'db' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-[#170E2D] border border-purple-500/30 space-y-4">
                <h3 className="font-space text-lg font-bold text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-400" /> Relational SQL Query Console
                </h3>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={sqlQuery}
                    onChange={(e) => setSqlQuery(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-[#0B0616] border border-purple-500/40 text-xs font-mono text-emerald-300 focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    onClick={executeSql}
                    className="px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-space font-bold text-xs"
                  >
                    RUN QUERY
                  </button>
                </div>

                {/* Table Viewer */}
                <div className="overflow-x-auto rounded-xl border border-purple-500/30">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-[#0C0617] text-purple-300 uppercase border-b border-purple-500/30">
                      <tr>
                        <th className="p-3">ID</th>
                        <th className="p-3">Name / Entity</th>
                        <th className="p-3">Role / Focus</th>
                        <th className="p-3">Metric / CGPA</th>
                        <th className="p-3">Batch</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-500/20 bg-[#0B0616]">
                      {sqlResults.map((row) => (
                        <tr key={row.id} className="hover:bg-purple-950/30 text-slate-200">
                          <td className="p-3 text-cyan-400 font-bold">{row.id}</td>
                          <td className="p-3 font-semibold text-white">{row.name}</td>
                          <td className="p-3">{row.role}</td>
                          <td className="p-3 text-emerald-400 font-bold">{row.cgpa}</td>
                          <td className="p-3 text-purple-300">{row.batch}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
