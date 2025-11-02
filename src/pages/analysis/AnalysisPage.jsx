import { useCallback, useEffect, useRef, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import SectionHeader from '../../components/SectionHeader';
import VideoPlayer from '../../components/VideoPlayer';
import StatCard from '../../components/StatCard';
import HealthIcon from '../../components/HealthIcon';
import './AnalysisPage.css';

export default function AnalysisPage() {
  const cameraVideoRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [emotionHistory, setEmotionHistory] = useState([]);
  
  // 测试视频列表 - 使用公开可用的示例视频
  const testVideos = [
    { 
      id: 1, 
      name: '标准情绪表达测试', 
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 
      description: '包含多种基本情绪表达的测试视频' 
    },
    { 
      id: 2, 
      name: '社交互动场景', 
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', 
      description: '模拟真实社交场景的互动视频' 
    },
    { 
      id: 3, 
      name: '压力反应测试', 
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 
      description: '测试压力环境下的情绪反应' 
    },
  ];
  const [selectedVideo, setSelectedVideo] = useState(null);

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
      <SectionHeader 
        title="多模态AI实时分析" 
        description="使用测试视频或摄像头进行实时情绪和MBTI分析"
      />

      <div className="analysis-layout">
        {/* 左侧：测试视频 */}
        <div className="analysis-left">
          <div className="analysis-video-section">
            <div className="video-section-header">
              <h3>测试视频</h3>
              <select 
                className="video-select"
                value={selectedVideo?.id || ''}
                onChange={(e) => {
                  const video = testVideos.find(v => v.id === parseInt(e.target.value));
                  setSelectedVideo(video || null);
                }}
              >
                <option value="">选择测试视频</option>
                {testVideos.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>
            <VideoPlayer 
              title={selectedVideo?.name}
              src={selectedVideo?.src}
            />
            {selectedVideo && (
              <p className="video-description">{selectedVideo.description}</p>
            )}
          </div>
        </div>

        {/* 右侧：摄像头输入 */}
        <div className="analysis-right">
          <div className="analysis-camera-section">
            <div className="camera-section-header">
              <h3>实时摄像头</h3>
              <div className="camera-actions">
                {!cameraActive ? (
                  <button className="btn primary" onClick={startCamera}>
                    <HealthIcon type="video" size={18} />
                    启动摄像头
                  </button>
                ) : (
                  <button className="btn" onClick={stopCamera}>
                    <HealthIcon type="security" size={18} />
                    停止
                  </button>
                )}
              </div>
            </div>
            <div className="camera-video-wrap">
              <video ref={cameraVideoRef} className="camera-video" autoPlay muted playsInline />
              {!cameraActive && (
                <div className="camera-placeholder">
                  <HealthIcon type="video" size={64} />
                  <p>点击"启动摄像头"开始实时分析</p>
                </div>
              )}
              {analysisData && cameraActive && (
                <div className="camera-overlay">
                  <div className="emotion-badge">{analysisData.emotion}</div>
                  <div className="confidence-badge">置信度: {(analysisData.confidence * 100).toFixed(1)}%</div>
                </div>
              )}
            </div>
          </div>

          {/* 分析结果 */}
          {analysisData && (
            <div className="analysis-results">
              <div className="results-stats">
                <StatCard 
                  label="当前情绪" 
                  value={analysisData.emotion.toUpperCase()} 
                  iconType="mood" 
                  color="#10b981" 
                />
                <StatCard 
                  label="MBTI预测" 
                  value={
                    `${analysisData.mbti.E > analysisData.mbti.I ? 'E' : 'I'}${
                      analysisData.mbti.N > analysisData.mbti.S ? 'N' : 'S'}${
                      analysisData.mbti.T > analysisData.mbti.F ? 'T' : 'F'}${
                      analysisData.mbti.J > analysisData.mbti.P ? 'J' : 'P'}`
                  } 
                  iconType="ai" 
                  color="#8b5cf6" 
                />
                <StatCard 
                  label="置信度" 
                  value={`${(analysisData.confidence * 100).toFixed(1)}%`} 
                  iconType="target" 
                  color="#f59e0b" 
                />
                <StatCard 
                  label="更新时间" 
                  value={analysisData.timestamp} 
                  iconType="calendar" 
                  color="#2563eb" 
                />
              </div>

              <div className="results-charts">
                <div className="chart-panel">
                  <ReactECharts option={emotionChartOption} style={{ height: '300px' }} />
                </div>
                <div className="chart-panel">
                  <ReactECharts option={mbtiChartOption} style={{ height: '350px' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

