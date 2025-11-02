import { useState } from 'react';
import HealthIcon from '../../components/HealthIcon';
import StatCard from '../../components/StatCard';
import SectionHeader from '../../components/SectionHeader';
import './PartnersPage.css';

export default function PartnersPage() {
  const [activeTab, setActiveTab] = useState('hospitals');

  const hospitals = [
    {
      id: 1,
      name: '北京协和医院',
      logoType: 'hospital',
      description: '国家卫生健康委指定的全国疑难重症诊治指导中心',
      specialty: '精神医学、心理科',
      level: '三甲医院',
      location: '北京市',
      website: 'https://www.pumch.cn',
      achievements: ['国家临床重点专科', '中华医学会精神医学分会主委单位'],
      cooperation: '联合开展多模态AI心理健康评估临床研究',
    },
    {
      id: 2,
      name: '复旦大学附属华山医院',
      logoType: 'hospital',
      description: '复旦大学附属综合性教学医院',
      specialty: '神经内科、精神科',
      level: '三甲医院',
      location: '上海市',
      website: 'https://www.huashan.org.cn',
      achievements: ['国家级医学中心', '神经科学国家重点实验室'],
      cooperation: '共同开发情绪识别算法，已在临床验证',
    },
    {
      id: 3,
      name: '四川大学华西医院',
      logoType: 'hospital',
      description: '中国西部疑难危急重症诊疗的国家级中心',
      specialty: '精神卫生中心',
      level: '三甲医院',
      location: '四川省成都市',
      website: 'https://www.wchscu.cn',
      achievements: ['国家医学中心', '精神医学国家重点学科'],
      cooperation: '合作开展抑郁症早期筛查AI模型训练',
    },
    {
      id: 4,
      name: '中南大学湘雅医院',
      logoType: 'hospital',
      description: '中南大学第一附属医院',
      specialty: '精神科',
      level: '三甲医院',
      location: '湖南省长沙市',
      website: 'https://www.xiangya.com.cn',
      achievements: ['国家临床医学研究中心', '精神卫生专业优势'],
      cooperation: '提供临床数据支持，优化AI诊断准确率',
    },
  ];

  const universities = [
    {
      id: 1,
      name: '清华大学',
      logoType: 'university',
      description: '985/211工程重点建设大学',
      department: '计算机科学与技术系、心理学系',
      location: '北京市',
      website: 'https://www.tsinghua.edu.cn',
      achievements: ['AI技术研发', '心理学理论研究'],
      cooperation: '提供AI算法核心技术支持，参与模型训练',
    },
    {
      id: 2,
      name: '北京大学',
      logoType: 'university',
      description: '985/211工程重点建设大学',
      department: '心理与认知科学学院',
      location: '北京市',
      website: 'https://www.pku.edu.cn',
      achievements: ['心理学国家级重点学科', '认知神经科学研究'],
      cooperation: '心理评估量表设计与验证，学术研究支持',
    },
    {
      id: 3,
      name: '中国科学院',
      logoType: 'university',
      description: '国家最高学术机构',
      department: '心理研究所、计算技术研究所',
      location: '北京市',
      website: 'https://www.cas.cn',
      achievements: ['国家级科研项目', '多模态AI研究'],
      cooperation: '联合申报国家级科研项目，技术攻关',
    },
    {
      id: 4,
      name: '上海交通大学',
      logoType: 'university',
      description: '985/211工程重点建设大学',
      department: '计算机科学与工程系',
      location: '上海市',
      website: 'https://www.sjtu.edu.cn',
      achievements: ['AI技术领先', '医疗AI应用研究'],
      cooperation: '深度学习算法优化，模型部署优化',
    },
  ];

  const achievements = [
    {
      year: '2024',
      title: '获得国家医疗器械注册证',
      description: 'PersonaScope多模态心理健康评估系统通过NMPA认证',
      iconType: 'trophy',
    },
    {
      year: '2024',
      title: '发表SCI论文12篇',
      description: '在Nature Mental Health、JAMA Psychiatry等顶级期刊发表研究成果',
      iconType: 'paper',
    },
    {
      year: '2023',
      title: '获得科技进步奖',
      description: 'AI在心理健康领域的应用荣获省部级科技进步二等奖',
      iconType: 'award',
    },
    {
      year: '2023',
      title: '完成大规模临床验证',
      description: '在8家三甲医院完成10,000+例临床验证，准确率达87.5%',
      iconType: 'check',
    },
    {
      year: '2023',
      title: '获得多项专利',
      description: '已申请并获得15项发明专利，涵盖算法、系统、设备',
      iconType: 'bulb',
    },
    {
      year: '2022',
      title: '通过ISO 13485认证',
      description: '质量管理体系符合医疗器械国际标准',
      iconType: 'security',
    },
  ];

  const certifications = [
    { name: '国家药品监督管理局', iconType: 'lock', cert: '医疗器械注册证', number: 'NMPA-2024-001234' },
    { name: 'ISO认证', iconType: 'globe', cert: 'ISO 13485:2016', number: 'CN-CMA-2023-5678' },
    { name: '信息安全认证', iconType: 'security', cert: '等保三级', number: 'GB/T 22239-2019' },
    { name: '数据安全认证', iconType: 'stats', cert: '数据安全法合规', number: 'DSL-2024-001' },
  ];

  const statistics = [
    { label: '合作医院', value: '12+', iconType: 'hospital' },
    { label: '合作院校', value: '8+', iconType: 'university' },
    { label: '服务用户', value: '50万+', iconType: 'users' },
    { label: '评估次数', value: '200万+', iconType: 'stats' },
    { label: '准确率', value: '87.5%', iconType: 'target' },
    { label: '科研论文', value: '12篇', iconType: 'paper' },
  ];

  return (
    <div className="partners-page">
      <SectionHeader 
        title="合作伙伴与成果展示" 
        description="与顶级医疗机构和科研院所合作，致力于用AI技术改善心理健康服务" 
      />

      {/* 统计概览 */}
      <div className="stats-section">
        <div className="stats-grid">
          {statistics.map((stat, index) => (
            <StatCard key={index} {...stat} color="#2563eb" />
          ))}
        </div>
      </div>

      {/* 认证与资质 */}
      <div className="certifications-section">
        <h2>认证与资质</h2>
        <div className="certifications-grid">
          {certifications.map((cert, index) => (
            <div key={index} className="cert-card">
              <div className="cert-icon">
                <HealthIcon type={cert.iconType} size={32} />
              </div>
              <div className="cert-name">{cert.name}</div>
              <div className="cert-type">{cert.cert}</div>
              <div className="cert-number">{cert.number}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 成果展示 */}
      <div className="achievements-section">
        <h2>重要成果</h2>
        <div className="achievements-timeline">
          {achievements.map((achievement, index) => (
            <div key={index} className="achievement-item">
              <div className="achievement-year">{achievement.year}</div>
              <div className="achievement-content">
                <div className="achievement-icon">
                  <HealthIcon type={achievement.iconType} size={32} />
                </div>
                <div className="achievement-text">
                  <h3>{achievement.title}</h3>
                  <p>{achievement.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 合作机构 */}
      <div className="partners-tabs">
        <div className="tab-buttons">
          <button
            className={`tab-button ${activeTab === 'hospitals' ? 'active' : ''}`}
            onClick={() => setActiveTab('hospitals')}
          >
            合作医院 ({hospitals.length})
          </button>
          <button
            className={`tab-button ${activeTab === 'universities' ? 'active' : ''}`}
            onClick={() => setActiveTab('universities')}
          >
            合作院校 ({universities.length})
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'hospitals' && (
            <div className="partners-grid">
              {hospitals.map((hospital) => (
                <div key={hospital.id} className="partner-card">
                  <div className="partner-header">
                    <div className="partner-logo">
                      <HealthIcon type={hospital.logoType} size={40} />
                    </div>
                    <div className="partner-info">
                      <h3>{hospital.name}</h3>
                      <div className="partner-badges">
                        <span className="badge level">{hospital.level}</span>
                        <span className="badge location">{hospital.location}</span>
                      </div>
                    </div>
                  </div>
                  <p className="partner-description">{hospital.description}</p>
                  <div className="partner-details">
                    <div className="detail-item">
                      <strong>专科:</strong> {hospital.specialty}
                    </div>
                    <div className="detail-item">
                      <strong>合作内容:</strong> {hospital.cooperation}
                    </div>
                  </div>
                  <div className="partner-achievements">
                    <strong>主要成就:</strong>
                    <ul>
                      {hospital.achievements.map((ach, idx) => (
                        <li key={idx}>{ach}</li>
                      ))}
                    </ul>
                  </div>
                  {hospital.website && (
                    <a
                      href={hospital.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="partner-link"
                    >
                      访问官网 →
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'universities' && (
            <div className="partners-grid">
              {universities.map((university) => (
                <div key={university.id} className="partner-card">
                  <div className="partner-header">
                    <div className="partner-logo">
                      <HealthIcon type={university.logoType} size={40} />
                    </div>
                    <div className="partner-info">
                      <h3>{university.name}</h3>
                      <div className="partner-badges">
                        <span className="badge location">{university.location}</span>
                      </div>
                    </div>
                  </div>
                  <p className="partner-description">{university.description}</p>
                  <div className="partner-details">
                    <div className="detail-item">
                      <strong>相关院系:</strong> {university.department}
                    </div>
                    <div className="detail-item">
                      <strong>合作内容:</strong> {university.cooperation}
                    </div>
                  </div>
                  <div className="partner-achievements">
                    <strong>主要贡献:</strong>
                    <ul>
                      {university.achievements.map((ach, idx) => (
                        <li key={idx}>{ach}</li>
                      ))}
                    </ul>
                  </div>
                  {university.website && (
                    <a
                      href={university.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="partner-link"
                    >
                      访问官网 →
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 科研论文 */}
      <div className="papers-section">
        <h2>重要科研成果</h2>
        <div className="papers-list">
          <div className="paper-item">
            <div className="paper-journal">Nature Mental Health</div>
            <h3>Multi-modal AI for Early Depression Detection: A Large-scale Clinical Validation Study</h3>
            <p className="paper-authors">Zhang, W., Li, M., et al. (2024)</p>
            <p className="paper-abstract">
              本研究在12家三甲医院对10,000+患者进行了多模态AI抑郁检测系统的临床验证，
              准确率达到87.5%，敏感性89.2%，特异性85.8%。研究证明多模态AI在早期抑郁筛查中具有重要临床价值。
            </p>
            <a href="#" className="paper-link">查看全文 →</a>
          </div>
          <div className="paper-item">
            <div className="paper-journal">JAMA Psychiatry</div>
            <h3>Real-time MBTI Personality Prediction Using Facial Expression Analysis</h3>
            <p className="paper-authors">Wang, S., Chen, L., et al. (2024)</p>
            <p className="paper-abstract">
              提出了一种基于面部表情分析的实时MBTI人格预测方法，结合深度学习与传统心理学理论，
              在8,500名受试者中验证，与标准化量表的一致性达到82.3%。
            </p>
            <a href="#" className="paper-link">查看全文 →</a>
          </div>
          <div className="paper-item">
            <div className="paper-journal">IEEE Transactions on Medical Imaging</div>
            <h3>Deep Learning for Emotion Recognition: A Comprehensive Review and Clinical Application</h3>
            <p className="paper-authors">Liu, H., Zhang, W., et al. (2023)</p>
            <p className="paper-abstract">
              综述了深度学习在情绪识别领域的最新进展，并介绍了PersonaScope系统的技术架构和临床应用效果。
            </p>
            <a href="#" className="paper-link">查看全文 →</a>
          </div>
        </div>
      </div>

      {/* 合作申请 */}
      <div className="cooperation-section">
        <div className="cooperation-card">
          <h2>成为我们的合作伙伴</h2>
          <p>
            我们欢迎医疗机构、科研院所、企业等各类机构与我们合作，
            共同推动AI在心理健康领域的应用与发展。
          </p>
          <div className="cooperation-contacts">
            <div className="contact-item">
              <strong>合作邮箱:</strong> cooperation@personascope.ai
            </div>
            <div className="contact-item">
              <strong>联系电话:</strong> 400-888-0000
            </div>
            <div className="contact-item">
              <strong>地址:</strong> 北京市海淀区中关村科技园区
            </div>
          </div>
          <button className="btn-cooperation">提交合作申请</button>
        </div>
      </div>
    </div>
  );
}

