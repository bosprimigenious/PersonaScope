import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { BrowserRouter, Link, NavLink, Route, Routes } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';
import { useTheme } from './theme.jsx';
import { showToast } from './Toast.jsx';
import LoginPage from './pages/auth/LoginPage';
import UserProfilePage from './pages/profile/UserProfilePage';
import PartnersPage from './pages/about/PartnersPage';
import HomePage from './pages/HomePage';
import AnalysisPage from './pages/analysis/AnalysisPage';
import HistoryPage from './pages/history/HistoryPage';
import TrajectoryPage from './pages/trajectory/TrajectoryPage';
import DepressionScreeningPage from './pages/screening/DepressionScreeningPage';
import PathologyAnalysisPage from './pages/pathology/PathologyAnalysisPage';
import MentalHealthReportPage from './pages/report/MentalHealthReportPage';
import MedicationReminderPage from './pages/medication/MedicationReminderPage';
import AppointmentBookingPage from './pages/appointment/AppointmentBookingPage';
import MBTITestPage from './pages/mbti-test/MBTITestPage';
import SettingsPage from './pages/settings/SettingsPage';
import UserAvatar from './components/UserAvatar';
import ProtectedRoute from './components/ProtectedRoute';
import HealthIcon from './components/HealthIcon';
import { useAuth } from './contexts/AuthContext';

// ========== Demo Page ==========
function DemoPage() {
  const userVideoRef = useRef(null);
  const cameraVideoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  
  const [videoUrl, setVideoUrl] = useState('');
  const [objectUrl, setObjectUrl] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [recording, setRecording] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [screenshots, setScreenshots] = useState([]);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setObjectUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
    setVideoUrl(url);
  }, []);

  const handleUrlSubmit = useCallback((e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const url = String(form.get('videoUrl') || '').trim();
    if (url) {
      setObjectUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return '';
      });
      setVideoUrl(url);
    }
  }, []);

  const startCamera = useCallback(async () => {
    setErrorMsg('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: false,
      });
      streamRef.current = stream;
      if (cameraVideoRef.current) {
        cameraVideoRef.current.srcObject = stream;
        await cameraVideoRef.current.play();
      }
      setCameraActive(true);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : '无法访问摄像头');
      setCameraActive(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (cameraVideoRef.current) {
      cameraVideoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setRecording(false);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const captureScreenshot = useCallback(() => {
    if (cameraVideoRef.current && cameraVideoRef.current.srcObject) {
      const canvas = canvasRef.current || document.createElement('canvas');
      canvas.width = cameraVideoRef.current.videoWidth;
      canvas.height = cameraVideoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(cameraVideoRef.current, 0, 0);
      const url = canvas.toDataURL('image/png');
      setScreenshots((prev) => [...prev, { url, time: new Date().toLocaleTimeString() }]);
    }
  }, []);

  const startRecording = useCallback(() => {
    if (!streamRef.current) return;
    try {
      const chunks = [];
      const recorder = new MediaRecorder(streamRef.current);
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setRecording(true);
    } catch (err) {
      setErrorMsg('录制失败: ' + err.message);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
      setRecording(false);
    }
  }, []);

  useEffect(() => () => {
    stopCamera();
    setObjectUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return '';
    });
  }, [stopCamera]);

  return (
    <main className="content">
      <section className="panel">
        <div className="panel-header">
          <h2>用户观看视频</h2>
          <div className="actions">
            <form className="url-form" onSubmit={handleUrlSubmit}>
              <input name="videoUrl" type="url" placeholder="输入视频URL" className="input" />
              <button type="submit" className="btn">加载URL</button>
            </form>
            <label className="file-btn">
              选择本地视频
              <input type="file" accept="video/*" onChange={handleFileChange} hidden />
            </label>
          </div>
        </div>
        <div className="video-wrap">
          {videoUrl ? (
            <video ref={userVideoRef} className="video" src={videoUrl} controls playsInline />
          ) : (
            <div className="placeholder">请选择本地视频或输入URL</div>
          )}
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>摄像头实时视频</h2>
          <div className="actions">
            {!cameraActive ? (
              <button type="button" className="btn primary" onClick={startCamera}>启动摄像头</button>
            ) : (
              <>
                <button type="button" className="btn" onClick={stopCamera}>停止</button>
                <button type="button" className="btn" onClick={captureScreenshot}>截图</button>
                {!recording ? (
                  <button type="button" className="btn primary" onClick={startRecording}>开始录制</button>
                ) : (
                  <button type="button" className="btn danger" onClick={stopRecording}>停止录制</button>
                )}
              </>
            )}
          </div>
        </div>
        <div className="video-wrap">
          <video ref={cameraVideoRef} className="video" autoPlay muted playsInline />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          {errorMsg ? <div className="error">{errorMsg}</div> : null}
          {recording && <div className="recording-indicator">🔴 录制中</div>}
        </div>
        {screenshots.length > 0 && (
          <div className="screenshots-panel">
            <h3>截图历史 ({screenshots.length})</h3>
            <div className="screenshots-grid">
              {screenshots.map((s, i) => (
                <div key={i} className="screenshot-item">
                  <img src={s.url} alt={`截图 ${i + 1}`} />
                  <span>{s.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

// ========== Home Page (Old - will be replaced) ==========
function HomePageOld() {
  const stats = [
    { label: '总分析次数', value: '1,234', icon: '📊', color: '#2563eb' },
    { label: '今日活跃', value: '89', icon: '👥', color: '#10b981' },
    { label: '平均准确率', value: '87%', icon: '🎯', color: '#f59e0b' },
    { label: '在线用户', value: '12', icon: '🌐', color: '#8b5cf6' },
  ];

  const quickActions = [
    { title: '健康看板', desc: '实时监测心率、血压、情绪等健康指标', link: '/dashboard', icon: '📊' },
    { title: '抑郁症筛查', desc: 'PHQ-9标准量表，专业评估抑郁风险', link: '/screening', icon: '🏥' },
    { title: '症状记录', desc: '记录身体症状，辅助医生诊断', link: '/symptoms', icon: '📝' },
    { title: '用药提醒', desc: '设置用药提醒，确保按时服药', link: '/medication', icon: '💊' },
    { title: '预约咨询', desc: '在线预约医生，方便快捷', link: '/appointment', icon: '📅' },
    { title: '实时分析', desc: '使用摄像头进行实时MBTI与情绪分析', link: '/analysis', icon: '🎥' },
    { title: '健康报告', desc: '生成完整的心理健康综合报告', link: '/report', icon: '📋' },
  ];

  return (
    <div className="home-page">
      <div className="welcome-banner">
        <h2>欢迎使用 PersonaScope</h2>
        <p>基于多模态AI的智能心理健康平台 | 早期筛查 · 辅助诊断 · 治疗监测</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card" style={{ borderLeftColor: stat.color }}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="quick-actions">
        <h3>快捷功能</h3>
        <div className="actions-grid">
          {quickActions.map((action, i) => (
            <Link key={i} to={action.link} className="action-card">
              <div className="action-icon">{action.icon}</div>
              <div className="action-title">{action.title}</div>
              <div className="action-desc">{action.desc}</div>
            </Link>
          ))}
        </div>
      </div>

      <div className="recent-activity">
        <h3>最近活动</h3>
        <div className="activity-list">
          <div className="activity-item">
            <span className="activity-time">2小时前</span>
            <span className="activity-text">完成了实时情绪分析，结果为 ENFP</span>
          </div>
          <div className="activity-item">
            <span className="activity-time">5小时前</span>
            <span className="activity-text">上传了视频文件进行分析</span>
          </div>
          <div className="activity-item">
            <span className="activity-time">昨天</span>
            <span className="activity-text">生成了个人成长报告</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ========== Analysis Page (Old - replaced) ==========
function AnalysisPageOld() {
  const cameraVideoRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [emotionHistory, setEmotionHistory] = useState([]);

  // 模拟实时分析数据（实际应通过WebSocket接收）
  useEffect(() => {
    if (cameraActive) {
      const interval = setInterval(() => {
        const now = new Date();
        const emotions = ['happy', 'neutral', 'sad', 'angry', 'surprised'];
        const newData = {
          emotion: emotions[Math.floor(Math.random() * emotions.length)],
          mbti: { E: 65, I: 35, N: 72, S: 28, T: 45, F: 55, J: 60, P: 40 },
          confidence: Math.random() * 0.3 + 0.7,
          timestamp: now.toLocaleTimeString(),
        };
        setAnalysisData(newData);
        setEmotionHistory((prev) => [...prev.slice(-19), { time: now.toLocaleTimeString(), value: Math.random() * 100 }]);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [cameraActive]);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (cameraVideoRef.current) {
        cameraVideoRef.current.srcObject = stream;
        await cameraVideoRef.current.play();
      }
      setCameraActive(true);
    } catch (err) {
      console.error('Camera error:', err);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (cameraVideoRef.current) {
      cameraVideoRef.current.srcObject = null;
    }
    setCameraActive(false);
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);

  const emotionChartOption = {
    backgroundColor: 'transparent',
    textStyle: { color: '#e0e7ff' },
    title: {
      text: '实时情绪曲线',
      left: 'center',
      textStyle: { fontSize: 16, color: '#e0e7ff', fontWeight: 'bold' },
    },
    grid: { backgroundColor: 'transparent', borderColor: 'rgba(99, 102, 241, 0.3)' },
    xAxis: {
      type: 'category',
      data: emotionHistory.map((h) => h.time),
      axisLine: { lineStyle: { color: 'rgba(99, 102, 241, 0.5)' } },
      axisLabel: { color: '#9ca3af' },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      axisLine: { lineStyle: { color: 'rgba(99, 102, 241, 0.5)' } },
      axisLabel: { color: '#9ca3af' },
      splitLine: { lineStyle: { color: 'rgba(99, 102, 241, 0.1)' } },
    },
    series: [{
      data: emotionHistory.map((h) => h.value),
      type: 'line',
      smooth: true,
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(99, 102, 241, 0.4)' },
            { offset: 1, color: 'rgba(99, 102, 241, 0.05)' },
          ],
        },
      },
      lineStyle: { color: '#6366f1', width: 3 },
      itemStyle: { color: '#818cf8', borderColor: '#6366f1', borderWidth: 2 },
      symbol: 'circle',
      symbolSize: 6,
    }],
  };

  const mbtiChartOption = analysisData ? {
    backgroundColor: 'transparent',
    textStyle: { color: '#e0e7ff' },
    title: {
      text: 'MBTI 四维分析',
      left: 'center',
      textStyle: { fontSize: 16, color: '#e0e7ff', fontWeight: 'bold' },
    },
    radar: {
      indicator: [
        { name: '外向(E)', max: 100 },
        { name: '内向(I)', max: 100 },
        { name: '直觉(N)', max: 100 },
        { name: '实感(S)', max: 100 },
        { name: '思考(T)', max: 100 },
        { name: '情感(F)', max: 100 },
        { name: '判断(J)', max: 100 },
        { name: '感知(P)', max: 100 },
      ],
      axisName: { color: '#9ca3af' },
      splitArea: {
        areaStyle: {
          color: ['rgba(99, 102, 241, 0.05)', 'rgba(99, 102, 241, 0.1)'],
        },
      },
      axisLine: { lineStyle: { color: 'rgba(99, 102, 241, 0.5)' } },
      splitLine: { lineStyle: { color: 'rgba(99, 102, 241, 0.3)' } },
    },
    series: [{
      type: 'radar',
      data: [{
        value: [
          analysisData.mbti.E,
          analysisData.mbti.I,
          analysisData.mbti.N,
          analysisData.mbti.S,
          analysisData.mbti.T,
          analysisData.mbti.F,
          analysisData.mbti.J,
          analysisData.mbti.P,
        ],
        name: '当前状态',
        areaStyle: {
          color: {
            type: 'radial',
            x: 0.5,
            y: 0.5,
            r: 0.8,
            colorStops: [
              { offset: 0, color: 'rgba(99, 102, 241, 0.4)' },
              { offset: 1, color: 'rgba(168, 85, 247, 0.2)' },
            ],
          },
        },
        lineStyle: { color: '#6366f1', width: 3 },
        itemStyle: { color: '#818cf8' },
      }],
    }],
  } : {};

  return (
    <div className="analysis-page">
      <div className="analysis-main">
        <div className="analysis-video-panel">
          <div className="panel-header">
            <h2>实时视频流</h2>
            <div className="actions">
              {!cameraActive ? (
                <button className="btn primary" onClick={startCamera}>启动分析</button>
              ) : (
                <button className="btn" onClick={stopCamera}>停止</button>
              )}
            </div>
          </div>
          <div className="video-wrap">
            <video ref={cameraVideoRef} className="video" autoPlay muted playsInline />
            {analysisData && (
              <div className="overlay-info">
                <div className="emotion-badge">{analysisData.emotion}</div>
                <div className="confidence-badge">置信度: {(analysisData.confidence * 100).toFixed(1)}%</div>
              </div>
            )}
          </div>
        </div>

        <div className="analysis-charts">
          <div className="chart-panel">
            <ReactECharts option={emotionChartOption} style={{ height: '250px' }} />
          </div>
          {analysisData && (
            <div className="chart-panel">
              <ReactECharts option={mbtiChartOption} style={{ height: '300px' }} />
            </div>
          )}
        </div>
      </div>

      {analysisData && (
        <div className="analysis-details">
          <div className="detail-card">
            <h3>当前情绪</h3>
            <div className="emotion-display">{analysisData.emotion.toUpperCase()}</div>
          </div>
          <div className="detail-card">
            <h3>MBTI 预测</h3>
            <div className="mbti-display">
              {analysisData.mbti.E > analysisData.mbti.I ? 'E' : 'I'}
              {analysisData.mbti.N > analysisData.mbti.S ? 'N' : 'S'}
              {analysisData.mbti.T > analysisData.mbti.F ? 'T' : 'F'}
              {analysisData.mbti.J > analysisData.mbti.P ? 'J' : 'P'}
            </div>
          </div>
          <div className="detail-card">
            <h3>更新时间</h3>
            <div>{analysisData.timestamp}</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ========== History Page (Old - replaced) ==========
function HistoryPageOld() {
  const [history, setHistory] = useState([
    { id: 1, date: '2024-01-15 14:30', type: '实时分析', mbti: 'ENFP', emotion: 'happy', duration: '5分钟' },
    { id: 2, date: '2024-01-15 10:20', type: '视频分析', mbti: 'INTJ', emotion: 'neutral', duration: '2分钟' },
    { id: 3, date: '2024-01-14 16:45', type: '实时分析', mbti: 'ISFP', emotion: 'calm', duration: '8分钟' },
  ]);
  const [filter, setFilter] = useState('all');

  const filteredHistory = filter === 'all' 
    ? history 
    : history.filter(h => h.type === filter);

  return (
    <div className="history-page">
      <div className="history-header">
        <h2>历史记录</h2>
        <div className="filter-tabs">
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>全部</button>
          <button className={filter === '实时分析' ? 'active' : ''} onClick={() => setFilter('实时分析')}>实时分析</button>
          <button className={filter === '视频分析' ? 'active' : ''} onClick={() => setFilter('视频分析')}>视频分析</button>
        </div>
      </div>

      <div className="history-list">
        {filteredHistory.map((item) => (
          <div key={item.id} className="history-item">
            <div className="history-info">
              <div className="history-date">{item.date}</div>
              <div className="history-type">{item.type}</div>
            </div>
            <div className="history-results">
              <span className="mbti-badge">{item.mbti}</span>
              <span className="emotion-badge-small">{item.emotion}</span>
              <span className="duration-badge">{item.duration}</span>
            </div>
            <div className="history-actions">
              <button className="btn small">查看详情</button>
              <button className="btn small">下载报告</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


// ========== Trajectory Page (Old - replaced) ==========
function TrajectoryPageOld() {
  const trajectoryData = {
    dates: ['1月1日', '1月5日', '1月10日', '1月15日'],
    mbtiScores: [65, 70, 68, 72],
    emotionScores: [60, 75, 80, 85],
  };

  const trajectoryOption = {
    title: { text: '个人成长轨迹', left: 'center' },
    tooltip: { trigger: 'axis' },
    legend: { data: ['MBTI倾向', '情绪稳定性'], top: 30 },
    xAxis: { type: 'category', data: trajectoryData.dates },
    yAxis: { type: 'value', min: 0, max: 100 },
    series: [
      { name: 'MBTI倾向', type: 'line', data: trajectoryData.mbtiScores },
      { name: '情绪稳定性', type: 'line', data: trajectoryData.emotionScores },
    ],
  };

  return (
    <div className="trajectory-page">
      <h2>个人成长轨迹</h2>
      <div className="trajectory-chart">
        <ReactECharts option={trajectoryOption} style={{ height: '400px' }} />
      </div>
      <div className="trajectory-insights">
        <div className="insight-card">
          <h3>📈 趋势分析</h3>
          <p>你的MBTI倾向在过去两周内呈现稳定上升趋势，从65%提升到72%。</p>
        </div>
        <div className="insight-card">
          <h3>😊 情绪状态</h3>
          <p>情绪稳定性持续改善，目前达到85%的良好水平。</p>
        </div>
      </div>
    </div>
  );
}

// ========== Depression Screening Page (Old - replaced) ==========
function DepressionScreeningPageOld() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [severity, setSeverity] = useState('');

  const phq9Questions = [
    '做事时提不起劲或没有兴趣',
    '感到心情低落、沮丧或绝望',
    '入睡困难、难以熟睡或睡眠过多',
    '感到疲倦或没有活力',
    '食欲不振或吃太多',
    '觉得自己很糟或觉得自己很失败，或让自己或家人失望',
    '对事物专注有困难，例如阅读报纸或看电视时',
    '动作或说话速度缓慢到别人已经察觉，或正好相反：烦躁或坐立不安、动来动去的情况比平常更严重',
    '有不如死掉或用某种方式伤害自己的念头',
  ];

  const handleAnswer = (index, value) => {
    setAnswers((prev) => ({ ...prev, [index]: parseInt(value) }));
  };

  const calculateScore = () => {
    const total = Object.values(answers).reduce((sum, val) => sum + (val || 0), 0);
    setScore(total);
    if (total <= 4) setSeverity('无或轻微');
    else if (total <= 9) setSeverity('轻度');
    else if (total <= 14) setSeverity('中度');
    else if (total <= 19) setSeverity('中重度');
    else setSeverity('重度');
    setSubmitted(true);
  };

  const severityColors = {
    '无或轻微': '#10b981',
    '轻度': '#3b82f6',
    '中度': '#f59e0b',
    '中重度': '#ef4444',
    '重度': '#dc2626',
  };

  return (
    <div className="screening-page">
      <div className="screening-header">
        <h2>抑郁症筛查评估 (PHQ-9)</h2>
        <p className="subtitle">请根据过去两周的情况，选择最符合你状态的选项</p>
      </div>

      {!submitted ? (
        <div className="questionnaire">
          {phq9Questions.map((q, i) => (
            <div key={i} className="question-item">
              <div className="question-text">
                {i + 1}. {q}
              </div>
              <div className="answer-options">
                {[0, 1, 2, 3].map((val) => (
                  <label key={val} className="radio-label">
                    <input
                      type="radio"
                      name={`q${i}`}
                      value={val}
                      checked={answers[i] === val}
                      onChange={(e) => handleAnswer(i, e.target.value)}
                    />
                    <span>
                      {val === 0 && '完全没有'}
                      {val === 1 && '好几天'}
                      {val === 2 && '一半以上时间'}
                      {val === 3 && '几乎每天'}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button className="btn primary large" onClick={calculateScore}>
            提交评估
          </button>
        </div>
      ) : (
        <div className="screening-results">
          <div className="result-card" style={{ borderLeftColor: severityColors[severity] }}>
            <h3>评估结果</h3>
            <div className="score-display">
              <div className="score-value">{score}</div>
              <div className="score-label">总分 (0-27)</div>
            </div>
            <div className="severity-badge" style={{ backgroundColor: severityColors[severity] + '20', color: severityColors[severity] }}>
              严重程度: {severity}
            </div>
            <div className="result-interpretation">
              {severity === '无或轻微' && (
                <p>你的抑郁症状非常轻微。继续保持健康的生活方式，定期进行心理健康检查。</p>
              )}
              {severity === '轻度' && (
                <p>你可能有轻度抑郁症状。建议增加运动、改善睡眠、保持社交活动。如症状持续，考虑咨询心理健康专业人士。</p>
              )}
              {severity === '中度' && (
                <p>你可能存在中度抑郁症状。强烈建议咨询心理健康专业人士进行评估和治疗。可以尝试认知行为疗法(CBT)或咨询精神科医生。</p>
              )}
              {(severity === '中重度' || severity === '重度') && (
                <p>
                  <strong>你的症状较为严重，强烈建议立即寻求专业帮助。</strong>
                  <br />
                  请联系：精神科医生、心理咨询师或拨打心理健康热线。
                  <br />
                  不要独自承受，专业的治疗可以显著改善你的状况。
                </p>
              )}
            </div>
            <button className="btn" onClick={() => { setSubmitted(false); setAnswers({}); setScore(0); }}>
              重新评估
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ========== Pathology Analysis Page (Old - replaced) ==========
function PathologyAnalysisPageOld() {
  const [symptoms, setSymptoms] = useState({
    mood: false,
    sleep: false,
    appetite: false,
    energy: false,
    concentration: false,
    anxiety: false,
    social: false,
  });
  const [riskLevel, setRiskLevel] = useState('');
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const analyzePathology = () => {
    const count = Object.values(symptoms).filter(Boolean).length;
    if (count <= 2) setRiskLevel('低风险');
    else if (count <= 4) setRiskLevel('中风险');
    else setRiskLevel('高风险');
    setAnalysisComplete(true);
  };

  const treatmentRecommendations = {
    '低风险': [
      '保持规律作息，确保充足睡眠',
      '适度运动，每周至少150分钟中等强度运动',
      '保持社交联系，与朋友家人多交流',
      '练习正念冥想或放松技巧',
    ],
    '中风险': [
      '上述所有建议',
      '考虑咨询心理咨询师进行预防性干预',
      '使用认知行为疗法(CBT)自助资源',
      '定期进行心理健康检查',
      '如有需要，可咨询家庭医生评估',
    ],
    '高风险': [
      '立即咨询精神科医生或心理健康专业人士',
      '考虑药物治疗（如SSRI类抗抑郁药）',
      '接受专业心理治疗（CBT、人际治疗等）',
      '建立支持网络，告知家人或朋友',
      '制定安全计划，如出现自伤想法立即寻求帮助',
      '定期随访，监测症状变化',
    ],
  };

  return (
    <div className="pathology-page">
      <div className="pathology-header">
        <h2>病理学分析评估</h2>
        <p>基于多模态AI分析，结合症状评估，提供个性化治疗建议</p>
      </div>

      <div className="pathology-content">
        <div className="symptoms-panel">
          <h3>症状评估</h3>
          <div className="symptoms-grid">
            {[
              { key: 'mood', label: '情绪低落或易怒' },
              { key: 'sleep', label: '睡眠障碍（失眠/嗜睡）' },
              { key: 'appetite', label: '食欲变化（增加/减少）' },
              { key: 'energy', label: '精力不足或疲劳' },
              { key: 'concentration', label: '注意力不集中' },
              { key: 'anxiety', label: '焦虑或紧张' },
              { key: 'social', label: '社交回避或退缩' },
            ].map((s) => (
              <label key={s.key} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={symptoms[s.key]}
                  onChange={(e) => setSymptoms((prev) => ({ ...prev, [s.key]: e.target.checked }))}
                />
                <span>{s.label}</span>
              </label>
            ))}
          </div>
          <button className="btn primary" onClick={analyzePathology} disabled={analysisComplete}>
            {analysisComplete ? '分析完成' : '开始分析'}
          </button>
        </div>

        {analysisComplete && (
          <div className="analysis-results">
            <div className="risk-indicator" style={{ 
              backgroundColor: riskLevel === '低风险' ? '#dcfce7' : riskLevel === '中风险' ? '#fef3c7' : '#fee2e2',
              color: riskLevel === '低风险' ? '#166534' : riskLevel === '中风险' ? '#92400e' : '#991b1b',
            }}>
              <h3>风险等级: {riskLevel}</h3>
            </div>

            <div className="treatment-plan">
              <h3>治疗建议</h3>
              <ul>
                {treatmentRecommendations[riskLevel].map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>

            <div className="clinical-notes">
              <h3>临床说明</h3>
              <p>
                本评估基于症状自评，不能替代专业医疗诊断。
                {riskLevel === '高风险' && (
                  <strong> 如你感到绝望或有自伤想法，请立即拨打紧急热线或前往医院急诊科。</strong>
                )}
              </p>
              <div className="resources">
                <h4>专业资源</h4>
                <ul>
                  <li>全国心理援助热线: 400-161-9995</li>
                  <li>北京市心理危机干预热线: 010-82951332</li>
                  <li>紧急情况请拨打: 120 或 110</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ========== Mental Health Report Page (Old - replaced) ==========
function MentalHealthReportPageOld() {
  const reportData = {
    date: new Date().toLocaleDateString('zh-CN'),
    mbti: 'INFP',
    emotionStability: 75,
    depressionRisk: '低',
    anxietyLevel: '中等',
    recommendations: [
      '保持规律的作息时间，每天7-9小时睡眠',
      '每周至少进行3次有氧运动，每次30分钟以上',
      '尝试正念冥想，每天10-15分钟',
      '保持社交活动，与朋友定期联系',
    ],
  };

  const reportChartOption = {
    title: { text: '心理健康综合评估', left: 'center' },
    tooltip: { trigger: 'axis' },
    radar: {
      indicator: [
        { name: '情绪稳定性', max: 100 },
        { name: '社会功能', max: 100 },
        { name: '压力管理', max: 100 },
        { name: '自我认知', max: 100 },
        { name: '适应能力', max: 100 },
      ],
    },
    series: [{
      type: 'radar',
      data: [{
        value: [reportData.emotionStability, 80, 65, 70, 75],
        name: '当前状态',
      }],
    }],
  };

  return (
    <div className="report-page">
      <div className="report-header">
        <h2>心理健康综合报告</h2>
        <p>生成日期: {reportData.date}</p>
      </div>

      <div className="report-content">
        <div className="report-summary">
          <div className="summary-card">
            <h3>MBTI人格类型</h3>
            <div className="mbti-display-small">{reportData.mbti}</div>
          </div>
          <div className="summary-card">
            <h3>情绪稳定性</h3>
            <div className="score-circle">{reportData.emotionStability}%</div>
          </div>
          <div className="summary-card">
            <h3>抑郁风险</h3>
            <div className="risk-badge low">{reportData.depressionRisk}</div>
          </div>
        </div>

        <div className="report-chart">
          <ReactECharts option={reportChartOption} style={{ height: '400px' }} />
        </div>

        <div className="report-recommendations">
          <h3>个性化建议</h3>
          <ul>
            {reportData.recommendations.map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        </div>

        <div className="report-actions">
          <button className="btn primary">下载PDF报告</button>
          <button className="btn">分享给医生</button>
          <button className="btn">保存到历史</button>
        </div>
      </div>
    </div>
  );
}

// ========== About Page ==========
function AboutPage() {
  return (
    <div className="about-page">
      <div className="about-hero">
        <h2>PersonaScope</h2>
        <p className="tagline">让AI不仅看见你的表情，更读懂你的内心</p>
      </div>

      <div className="about-sections">
        <section>
          <h3>🎯 项目简介</h3>
          <p>
            PersonaScope 是一个基于多模态AI技术的智能心理健康分析平台，通过分析文字、图像、视频和语音，
            实时预测用户的MBTI人格类型和情绪状态，并提供抑郁症筛查、病理学分析等临床应用功能。
            我们的目标是将AI技术应用于心理健康领域，帮助人们更好地了解自己，早期识别心理问题，获得专业建议。
          </p>
        </section>

        <section>
          <h3>🏥 临床应用价值</h3>
          <ul>
            <li><strong>早期筛查:</strong> 通过多模态AI分析，早期识别抑郁、焦虑等心理问题风险</li>
            <li><strong>辅助诊断:</strong> 为精神科医生提供客观的评估数据，辅助临床诊断</li>
            <li><strong>治疗监测:</strong> 追踪治疗效果，评估干预措施的有效性</li>
            <li><strong>个性化建议:</strong> 基于分析结果，提供个性化的心理健康建议</li>
            <li><strong>远程监测:</strong> 支持远程心理健康监测，降低医疗成本</li>
          </ul>
        </section>

        <section>
          <h3>🔧 技术栈</h3>
          <ul>
            <li>前端：React + Vite + ECharts</li>
            <li>AI框架：昇思 MindSpore</li>
            <li>部署：Orange Pi + MindSpore Lite</li>
            <li>可视化：ECharts + WebRTC</li>
            <li>评估量表：PHQ-9、GAD-7等标准化量表</li>
          </ul>
        </section>

        <section>
          <h3>📧 联系方式</h3>
          <p>如有问题或建议，欢迎通过以下方式联系：</p>
          <p>📮 Email: support@personascope.ai</p>
          <p>🌐 GitHub: github.com/personascope</p>
        </section>
      </div>
    </div>
  );
}

// ========== Health Dashboard Page ==========
function HealthDashboardPage() {
  const [healthData, setHealthData] = useState({
    heartRate: { value: 72, status: 'normal', trend: 'stable' },
    bloodPressure: { systolic: 120, diastolic: 80, status: 'normal' },
    moodScore: 75,
    sleepHours: 7.5,
    steps: 8432,
  });

  const weeklyData = {
    dates: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    mood: [70, 75, 68, 80, 78, 72, 75],
    sleep: [7, 7.5, 6.5, 8, 7.5, 8.5, 7],
  };

  const healthChartOption = {
    backgroundColor: 'transparent',
    textStyle: { color: 'var(--text)' },
    title: {
      text: '一周健康趋势',
      left: 'center',
      textStyle: { fontSize: 16, color: 'var(--text)', fontWeight: 'bold' },
    },
    tooltip: { trigger: 'axis', backgroundColor: 'var(--panel)', borderColor: 'var(--border)' },
    legend: { data: ['情绪分数', '睡眠时长'], top: 30, textStyle: { color: 'var(--text)' } },
    xAxis: {
      type: 'category',
      data: weeklyData.dates,
      axisLine: { lineStyle: { color: 'var(--border)' } },
      axisLabel: { color: 'var(--muted)' },
    },
    yAxis: [
      {
        type: 'value',
        name: '情绪分数',
        min: 0,
        max: 100,
        axisLine: { lineStyle: { color: 'var(--border)' } },
        axisLabel: { color: 'var(--muted)' },
        splitLine: { lineStyle: { color: 'var(--border)', opacity: 0.2 } },
      },
      {
        type: 'value',
        name: '睡眠(小时)',
        min: 0,
        max: 10,
        axisLine: { lineStyle: { color: 'var(--border)' } },
        axisLabel: { color: 'var(--muted)' },
      },
    ],
    series: [
      {
        name: '情绪分数',
        type: 'line',
        smooth: true,
        data: weeklyData.mood,
        lineStyle: { color: '#6366f1', width: 3 },
        areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(99, 102, 241, 0.3)' }, { offset: 1, color: 'rgba(99, 102, 241, 0.05)' }] } },
      },
      {
        name: '睡眠时长',
        type: 'line',
        smooth: true,
        yAxisIndex: 1,
        data: weeklyData.sleep,
        lineStyle: { color: '#a855f7', width: 3 },
      },
    ],
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h2>健康数据看板</h2>
        <p>实时监测您的身心健康指标</p>
      </div>

      <div className="health-cards-grid">
        <div className="health-card">
          <HealthIcon type="heart" size={48} className="health-icon" />
          <div className="health-info">
            <div className="health-label">心率</div>
            <div className="health-value">{healthData.heartRate.value} <span>bpm</span></div>
            <div className="health-status normal">正常</div>
          </div>
        </div>
        <div className="health-card">
          <HealthIcon type="stethoscope" size={48} className="health-icon" />
          <div className="health-info">
            <div className="health-label">血压</div>
            <div className="health-value">{healthData.bloodPressure.systolic}/{healthData.bloodPressure.diastolic}</div>
            <div className="health-status normal">正常</div>
          </div>
        </div>
        <div className="health-card">
          <HealthIcon type="mood" size={48} className="health-icon" />
          <div className="health-info">
            <div className="health-label">情绪分数</div>
            <div className="health-value">{healthData.moodScore} <span>/100</span></div>
            <div className="health-status good">良好</div>
          </div>
        </div>
        <div className="health-card">
          <HealthIcon type="sleep" size={48} className="health-icon" />
          <div className="health-info">
            <div className="health-label">睡眠时长</div>
            <div className="health-value">{healthData.sleepHours} <span>小时</span></div>
            <div className="health-status normal">充足</div>
          </div>
        </div>
        <div className="health-card">
          <HealthIcon type="steps" size={48} className="health-icon" />
          <div className="health-info">
            <div className="health-label">今日步数</div>
            <div className="health-value">{healthData.steps.toLocaleString()}</div>
            <div className="health-status good">达标</div>
          </div>
        </div>
      </div>

      <div className="health-chart-panel">
        <ReactECharts option={healthChartOption} style={{ height: '400px' }} />
      </div>
    </div>
  );
}

// ========== Symptom Tracker Page ==========
function SymptomTrackerPage() {
  const [symptoms, setSymptoms] = useState([]);
  const [newSymptom, setNewSymptom] = useState({ name: '', severity: 3, notes: '', date: new Date().toISOString().split('T')[0] });

  const addSymptom = () => {
    if (!newSymptom.name.trim()) {
      showToast('请输入症状名称', 'warning');
      return;
    }
    setSymptoms([...symptoms, { ...newSymptom, id: Date.now() }]);
    setNewSymptom({ name: '', severity: 3, notes: '', date: new Date().toISOString().split('T')[0] });
    showToast('症状记录已添加', 'success');
  };

  const deleteSymptom = (id) => {
    setSymptoms(symptoms.filter(s => s.id !== id));
    showToast('记录已删除', 'success');
  };

  return (
    <div className="symptom-page">
      <div className="symptom-header">
        <h2>症状记录</h2>
        <p>记录您的身体症状，帮助医生更好地了解您的健康状况</p>
      </div>

      <div className="symptom-form-panel">
        <h3>添加新症状</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>症状名称</label>
            <input
              type="text"
              className="input"
              placeholder="如：头痛、疲劳等"
              value={newSymptom.name}
              onChange={(e) => setNewSymptom({ ...newSymptom, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>严重程度 (1-5)</label>
            <input
              type="range"
              min="1"
              max="5"
              value={newSymptom.severity}
              onChange={(e) => setNewSymptom({ ...newSymptom, severity: parseInt(e.target.value) })}
              className="range-input"
            />
            <div className="severity-display">{newSymptom.severity}/5</div>
          </div>
          <div className="form-group">
            <label>日期</label>
            <input
              type="date"
              className="input"
              value={newSymptom.date}
              onChange={(e) => setNewSymptom({ ...newSymptom, date: e.target.value })}
            />
          </div>
        </div>
        <div className="form-group">
          <label>备注</label>
          <textarea
            className="input textarea"
            placeholder="补充说明..."
            value={newSymptom.notes}
            onChange={(e) => setNewSymptom({ ...newSymptom, notes: e.target.value })}
            rows="3"
          />
        </div>
        <button className="btn primary" onClick={addSymptom}>添加记录</button>
      </div>

      <div className="symptom-list-panel">
        <h3>历史记录 ({symptoms.length})</h3>
        {symptoms.length === 0 ? (
          <div className="empty-state">暂无记录</div>
        ) : (
          <div className="symptom-list">
            {symptoms.map((s) => (
              <div key={s.id} className="symptom-item">
                <div className="symptom-main">
                  <div className="symptom-name">{s.name}</div>
                  <div className="symptom-date">{s.date}</div>
                </div>
                <div className="symptom-details">
                  <div className="severity-badge-item">严重程度: {s.severity}/5</div>
                  {s.notes && <div className="symptom-notes">{s.notes}</div>}
                </div>
                <button className="btn small danger" onClick={() => deleteSymptom(s.id)}>删除</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


// ========== Login Page (Old - will be replaced) ==========
function LoginPageOld() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isRegister, setIsRegister] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: '', age: '', gender: '', phone: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegister) {
      if (!formData.email || !formData.password || !userInfo.name) {
        showToast('请填写完整信息', 'warning');
        return;
      }
      showToast('注册成功！', 'success');
      setTimeout(() => {
        setIsRegister(false);
        setFormData({ email: '', password: '' });
      }, 1500);
    } else {
      if (!formData.email || !formData.password) {
        showToast('请输入邮箱和密码', 'warning');
        return;
      }
      showToast('登录成功！', 'success');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h2>{isRegister ? '注册账号' : '登录账号'}</h2>
          <p>{isRegister ? '创建您的账号以开始使用' : '欢迎回来'}</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <div className="form-group">
                <label>姓名 *</label>
                <input
                  type="text"
                  className="input"
                  placeholder="请输入您的姓名"
                  value={userInfo.name}
                  onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>年龄</label>
                <input
                  type="number"
                  className="input"
                  placeholder="请输入年龄"
                  min="1"
                  max="120"
                  value={userInfo.age}
                  onChange={(e) => setUserInfo({ ...userInfo, age: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>性别</label>
                <select
                  className="input"
                  value={userInfo.gender}
                  onChange={(e) => setUserInfo({ ...userInfo, gender: e.target.value })}
                >
                  <option value="">请选择</option>
                  <option value="male">男</option>
                  <option value="female">女</option>
                  <option value="other">其他</option>
                </select>
              </div>
              <div className="form-group">
                <label>手机号</label>
                <input
                  type="tel"
                  className="input"
                  placeholder="请输入手机号"
                  value={userInfo.phone}
                  onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label>邮箱 *</label>
            <input
              type="email"
              className="input"
              placeholder="请输入邮箱地址"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>密码 *</label>
            <input
              type="password"
              className="input"
              placeholder={isRegister ? '至少8位密码' : '请输入密码'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={isRegister ? 8 : undefined}
            />
          </div>

          {isRegister && (
            <div className="form-group">
              <label>确认密码 *</label>
              <input
                type="password"
                className="input"
                placeholder="再次输入密码"
                required
              />
            </div>
          )}

          <button type="submit" className="btn primary large full-width">
            {isRegister ? '注册' : '登录'}
          </button>
        </form>

        <div className="auth-footer">
          <button
            type="button"
            className="link-button"
            onClick={() => {
              setIsRegister(!isRegister);
              setFormData({ email: '', password: '' });
            }}
          >
            {isRegister ? '已有账号？去登录' : '没有账号？立即注册'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ========== User Profile Page (Old - will be replaced) ==========
function UserProfilePageOld() {
  const [userData, setUserData] = useState({
    name: '张三',
    email: 'zhangsan@example.com',
    phone: '138****8888',
    age: 28,
    gender: 'male',
    avatar: '',
    bio: '心理健康关注者',
  });
  const [editing, setEditing] = useState(false);

  const handleSave = () => {
    showToast('信息已保存', 'success');
    setEditing(false);
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h2>个人资料</h2>
        <button className="btn primary" onClick={() => editing ? handleSave() : setEditing(true)}>
          {editing ? '保存' : '编辑'}
        </button>
      </div>

      <div className="profile-content">
        <div className="profile-avatar-section">
          <div className="avatar-container">
            <div className="avatar-placeholder">
              {userData.name.charAt(0)}
            </div>
          </div>
          {editing && (
            <button className="btn small">更换头像</button>
          )}
        </div>

        <div className="profile-form-panel">
          <h3>基本信息</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>姓名</label>
              {editing ? (
                <input
                  type="text"
                  className="input"
                  value={userData.name}
                  onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                />
              ) : (
                <div className="info-display">{userData.name}</div>
              )}
            </div>
            <div className="form-group">
              <label>邮箱</label>
              {editing ? (
                <input
                  type="email"
                  className="input"
                  value={userData.email}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                />
              ) : (
                <div className="info-display">{userData.email}</div>
              )}
            </div>
            <div className="form-group">
              <label>手机号</label>
              {editing ? (
                <input
                  type="tel"
                  className="input"
                  value={userData.phone}
                  onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                />
              ) : (
                <div className="info-display">{userData.phone}</div>
              )}
            </div>
            <div className="form-group">
              <label>年龄</label>
              {editing ? (
                <input
                  type="number"
                  className="input"
                  value={userData.age}
                  onChange={(e) => setUserData({ ...userData, age: parseInt(e.target.value) })}
                />
              ) : (
                <div className="info-display">{userData.age} 岁</div>
              )}
            </div>
            <div className="form-group">
              <label>性别</label>
              {editing ? (
                <select
                  className="input"
                  value={userData.gender}
                  onChange={(e) => setUserData({ ...userData, gender: e.target.value })}
                >
                  <option value="male">男</option>
                  <option value="female">女</option>
                  <option value="other">其他</option>
                </select>
              ) : (
                <div className="info-display">{userData.gender === 'male' ? '男' : userData.gender === 'female' ? '女' : '其他'}</div>
              )}
            </div>
          </div>
          <div className="form-group">
            <label>个人简介</label>
            {editing ? (
              <textarea
                className="input textarea"
                rows="3"
                value={userData.bio}
                onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                placeholder="介绍一下自己..."
              />
            ) : (
              <div className="info-display">{userData.bio || '暂无简介'}</div>
            )}
          </div>
        </div>

        <div className="profile-stats-panel">
          <h3>账号统计</h3>
          <div className="stats-grid-small">
            <div className="stat-item">
              <div className="stat-label">注册时间</div>
              <div className="stat-value">2024-01-01</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">总评估次数</div>
              <div className="stat-value">24</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">健康报告</div>
              <div className="stat-value">8</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


// ========== Layout ==========
function Layout({ children }) {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="page">
      <header className="header">
        <div className="header-top">
          <h1>PersonaScope 医疗平台</h1>
          <div className="header-actions">
            <UserAvatar />
            <button className="theme-toggle" onClick={toggleTheme} title="切换主题">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
        <nav className="nav">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>首页</NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>健康看板</NavLink>
          <NavLink to="/screening" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>抑郁筛查</NavLink>
          <NavLink to="/pathology" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>病理分析</NavLink>
          <NavLink to="/analysis" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>实时分析</NavLink>
          <NavLink to="/symptoms" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>症状记录</NavLink>
          <NavLink to="/medication" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>用药提醒</NavLink>
          <NavLink to="/appointment" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>预约咨询</NavLink>
          <NavLink to="/report" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>健康报告</NavLink>
          <NavLink to="/history" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>历史记录</NavLink>
          <NavLink to="/mbti-test" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>MBTI测试</NavLink>
          <NavLink to="/partners" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>合作伙伴</NavLink>
          <NavLink to="/settings" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>设置</NavLink>
        </nav>
      </header>
      {children}
    </div>
  );
}

// ========== Main App ==========
export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={<div style={{ padding: 16 }}>加载中...</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route 
              path="/login" 
              element={
                <ProtectedRoute inverted={true}>
                  <LoginPage />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <UserProfilePage />
                </ProtectedRoute>
              } 
            />
            <Route path="/demo" element={<DemoPage />} />
            <Route path="/dashboard" element={<HealthDashboardPage />} />
            <Route path="/screening" element={<DepressionScreeningPage />} />
            <Route path="/pathology" element={<PathologyAnalysisPage />} />
            <Route path="/analysis" element={<AnalysisPage />} />
            <Route path="/symptoms" element={<SymptomTrackerPage />} />
            <Route path="/medication" element={<MedicationReminderPage />} />
            <Route path="/appointment" element={<AppointmentBookingPage />} />
            <Route path="/report" element={<MentalHealthReportPage />} />
            <Route path="/trajectory" element={<TrajectoryPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/mbti-test" element={<MBTITestPage />} />
            <Route path="/partners" element={<PartnersPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}
