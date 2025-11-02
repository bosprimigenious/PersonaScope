import ReactECharts from 'echarts-for-react';
import SectionHeader from '../../components/SectionHeader';
import SummaryCard from '../../components/SummaryCard';
import RiskBadge from '../../components/RiskBadge';
import RecommendationsList from '../../components/RecommendationsList';
import './MentalHealthReportPage.css';

export default function MentalHealthReportPage() {
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
      <SectionHeader 
        title="心理健康综合报告" 
        description={`生成日期: ${reportData.date}`} 
      />

      <div className="report-content">
        <div className="report-summary">
          <SummaryCard title="MBTI人格类型">
            <div className="mbti-display-small">{reportData.mbti}</div>
          </SummaryCard>
          <SummaryCard title="情绪稳定性">
            <div className="score-circle">{reportData.emotionStability}%</div>
          </SummaryCard>
          <SummaryCard title="抑郁风险">
            <RiskBadge level={reportData.depressionRisk} />
          </SummaryCard>
        </div>

        <div className="report-chart">
          <ReactECharts option={reportChartOption} style={{ height: '400px' }} />
        </div>

        <RecommendationsList items={reportData.recommendations} title="个性化建议" />

        <div className="report-actions">
          <button className="btn primary">下载PDF报告</button>
          <button className="btn">分享给医生</button>
          <button className="btn">保存到历史</button>
        </div>
      </div>
    </div>
  );
}

