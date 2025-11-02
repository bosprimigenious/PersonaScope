import { useCallback, useEffect, useRef, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import './AnalysisPage.css';

export default function AnalysisPage() {
  const cameraVideoRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [emotionHistory, setEmotionHistory] = useState([]);

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

