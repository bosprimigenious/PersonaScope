import Carousel from '../components/Carousel';
import StatCard from '../components/StatCard';
import ActionCard from '../components/ActionCard';
import FeatureCard from '../components/FeatureCard';
import Badge from '../components/Badge';
import ActivityItem from '../components/ActivityItem';
import './HomePage.css';

export default function HomePage() {
  const stats = [
    { label: '总分析次数', value: '1,234', iconType: 'stats', color: '#2563eb' },
    { label: '今日活跃', value: '89', iconType: 'users', color: '#10b981' },
    { label: '平均准确率', value: '87%', iconType: 'target', color: '#f59e0b' },
    { label: '在线用户', value: '12', iconType: 'network', color: '#8b5cf6' },
  ];

  const quickActions = [
    { title: '健康看板', desc: '实时监测心率、血压、情绪等健康指标', link: '/dashboard', iconType: 'dashboard' },
    { title: '抑郁症筛查', desc: 'PHQ-9标准量表，专业评估抑郁风险', link: '/screening', iconType: 'hospital' },
    { title: '症状记录', desc: '记录身体症状，辅助医生诊断', link: '/symptoms', iconType: 'note' },
    { title: '用药提醒', desc: '设置用药提醒，确保按时服药', link: '/medication', iconType: 'medication' },
    { title: '预约咨询', desc: '在线预约医生，方便快捷', link: '/appointment', iconType: 'calendar' },
    { title: '实时分析', desc: '使用摄像头进行实时MBTI与情绪分析', link: '/analysis', iconType: 'video' },
    { title: '健康报告', desc: '生成完整的心理健康综合报告', link: '/report', iconType: 'report' },
  ];

  const trustedBadges = [
    { iconType: 'trophy', text: 'NMPA认证', link: '/partners' },
    { iconType: 'lock', text: 'ISO认证', link: '/partners' },
    { iconType: 'hospital', text: '12+合作医院', link: '/partners' },
    { iconType: 'university', text: '8+合作院校', link: '/partners' },
  ];

  const carouselItems = [
    {
      title: '多模态AI分析',
      description: '融合视觉、语音、文本多维度分析，准确率高达87.5%',
      iconType: 'ai',
      link: '/analysis',
    },
    {
      title: '抑郁症筛查',
      description: '基于PHQ-9国际标准量表，专业可靠的抑郁风险评估',
      iconType: 'hospital',
      link: '/screening',
    },
    {
      title: '临床验证',
      description: '12+家三甲医院验证，已在10,000+病例中证明有效性',
      iconType: 'check',
      link: '/partners',
    },
    {
      title: '智能健康报告',
      description: '生成个性化心理健康报告，提供专业建议和治疗方案',
      iconType: 'report',
      link: '/report',
    },
    {
      title: '实时监测',
      description: '24/7实时监测心理健康指标，早期发现异常',
      iconType: 'chart',
      link: '/dashboard',
    },
  ];

  return (
    <div className="home-page">
      <div className="welcome-banner">
        <h2>欢迎使用 PersonaScope</h2>
        <p>基于多模态AI的智能心理健康平台 | 早期筛查 · 辅助诊断 · 治疗监测</p>
        <div className="trusted-badges">
          {trustedBadges.map((badge, i) => (
            <Badge key={i} iconType={badge.iconType} text={badge.text} link={badge.link} />
          ))}
        </div>
      </div>

      {/* 轮播图 */}
      <div className="carousel-section">
        <Carousel items={carouselItems} autoPlay={true} interval={4000} />
      </div>

      <div className="stats-grid">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="quick-actions">
        <h3>快捷功能</h3>
        <div className="actions-grid">
          {quickActions.map((action, i) => (
            <ActionCard key={i} {...action} />
          ))}
        </div>
      </div>

      <div className="recent-activity">
        <h3>最近活动</h3>
        <div className="activity-list">
          <ActivityItem time="2小时前" text="完成了实时情绪分析，结果为 ENFP" />
          <ActivityItem time="5小时前" text="上传了视频文件进行分析" />
          <ActivityItem time="昨天" text="生成了个人成长报告" />
        </div>
      </div>

      <div className="features-showcase">
        <h3>平台优势</h3>
        <div className="features-grid">
          <FeatureCard iconType="ai" title="AI技术" description="基于MindSpore的多模态AI，融合视觉、语音、文本分析" />
          <FeatureCard iconType="hospital" title="临床验证" description="12+家三甲医院临床验证，准确率达87.5%" />
          <FeatureCard iconType="stats" title="科学评估" description="采用PHQ-9等国际标准量表，专业可靠" />
          <FeatureCard iconType="security" title="隐私安全" description="符合等保三级标准，数据加密存储" />
        </div>
      </div>
    </div>
  );
}

