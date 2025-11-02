import { useState } from 'react';
import SectionHeader from '../../components/SectionHeader';
import RiskBadge from '../../components/RiskBadge';
import RecommendationsList from '../../components/RecommendationsList';
import SummaryCard from '../../components/SummaryCard';
import './PathologyAnalysisPage.css';

export default function PathologyAnalysisPage() {
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
      <SectionHeader 
        title="病理学分析评估" 
        description="基于多模态AI分析，结合症状评估，提供个性化治疗建议" 
      />

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
            <SummaryCard title="风险等级">
              <RiskBadge level={riskLevel} />
            </SummaryCard>

            <RecommendationsList 
              items={treatmentRecommendations[riskLevel]} 
              title="治疗建议" 
            />

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

