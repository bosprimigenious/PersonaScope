import ReactECharts from 'echarts-for-react';
import './TrajectoryPage.css';

export default function TrajectoryPage() {
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

