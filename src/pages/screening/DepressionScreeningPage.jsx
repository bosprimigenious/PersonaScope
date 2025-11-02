import { useState } from 'react';
import SectionHeader from '../../components/SectionHeader';
import SummaryCard from '../../components/SummaryCard';
import './DepressionScreeningPage.css';

export default function DepressionScreeningPage() {
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
      <SectionHeader 
        title="抑郁症筛查评估 (PHQ-9)" 
        description="请根据过去两周的情况，选择最符合你状态的选项" 
      />

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
          <SummaryCard title="评估结果">
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

