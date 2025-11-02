import { useState, useEffect } from 'react';
import { showToast } from '../../Toast';
import './MBTITestPage.css';

// MBTI 题库 - 按标签、难度、自由度分类
const questionBank = [
  // 职业倾向 - 简单 - 选择题
  {
    id: 1,
    question: '在团队项目中，你更倾向于？',
    type: 'choice',
    options: ['独立完成任务', '与他人协作', '主导整个项目', '跟随团队安排'],
    tags: ['职业倾向'],
    difficulty: '简单',
    freedom: 'low',
    dimension: 'E/I'
  },
  {
    id: 2,
    question: '做决策时，你更依赖？',
    type: 'choice',
    options: ['逻辑和分析', '直觉和感觉', '他人建议', '过往经验'],
    tags: ['决策风格'],
    difficulty: '简单',
    freedom: 'low',
    dimension: 'T/F'
  },
  // 社交风格 - 中等 - 选择题
  {
    id: 3,
    question: '参加聚会后，你的感受是？',
    type: 'choice',
    options: ['精力充沛，还想继续', '感到疲惫，需要独处', '取决于聚会质量', '感觉一般'],
    tags: ['社交风格'],
    difficulty: '中等',
    freedom: 'low',
    dimension: 'E/I'
  },
  {
    id: 4,
    question: '面对新的挑战，你的第一反应是？',
    type: 'choice',
    options: ['立即行动', '先规划再行动', '寻求帮助', '观察他人做法'],
    tags: ['行为模式'],
    difficulty: '中等',
    freedom: 'low',
    dimension: 'J/P'
  },
  // 开放式问题 - 高自由度
  {
    id: 5,
    question: '描述一下你理想中的工作环境。',
    type: 'open',
    options: [],
    tags: ['职业倾向'],
    difficulty: '困难',
    freedom: 'high',
    dimension: 'E/I'
  },
  {
    id: 6,
    question: '当你感到压力时，你会如何处理？',
    type: 'open',
    options: [],
    tags: ['情绪管理'],
    difficulty: '困难',
    freedom: 'high',
    dimension: 'T/F'
  },
  // 更多题目...
  {
    id: 7,
    question: '在制定计划时，你更倾向于？',
    type: 'choice',
    options: ['制定详细的时间表', '保持灵活性', '结合两者', '临时决定'],
    tags: ['行为模式'],
    difficulty: '简单',
    freedom: 'low',
    dimension: 'J/P'
  },
  {
    id: 8,
    question: '你对新信息的处理方式是？',
    type: 'choice',
    options: ['关注细节和事实', '关注整体和可能性', '两者兼顾', '视情况而定'],
    tags: ['认知风格'],
    difficulty: '中等',
    freedom: 'low',
    dimension: 'S/N'
  },
  {
    id: 9,
    question: '在完成工作项目时，你更倾向于？',
    type: 'choice',
    options: ['提前完成并多次检查', '在截止日期前完成', '按计划稳步推进', '根据实际情况调整'],
    tags: ['工作风格'],
    difficulty: '简单',
    freedom: 'low',
    dimension: 'J/P'
  },
  {
    id: 10,
    question: '面对冲突时，你的处理方式是？',
    type: 'open',
    options: [],
    tags: ['人际关系'],
    difficulty: '困难',
    freedom: 'high',
    dimension: 'T/F'
  },
  {
    id: 11,
    question: '你更喜欢的学习方式是？',
    type: 'choice',
    options: ['通过实践和操作', '通过阅读和思考', '通过讨论和交流', '通过观察和模仿'],
    tags: ['学习风格'],
    difficulty: '中等',
    freedom: 'low',
    dimension: 'S/N'
  },
  {
    id: 12,
    question: '描述一下你理想中的生活节奏。',
    type: 'open',
    options: [],
    tags: ['生活方式'],
    difficulty: '困难',
    freedom: 'high',
    dimension: 'J/P'
  },
  {
    id: 13,
    question: '在做重要决定时，你更看重？',
    type: 'choice',
    options: ['客观事实和逻辑', '个人感受和价值观', '他人意见和建议', '直觉和预感'],
    tags: ['决策风格'],
    difficulty: '简单',
    freedom: 'low',
    dimension: 'T/F'
  },
  {
    id: 14,
    question: '你如何处理日常生活中的变化？',
    type: 'open',
    options: [],
    tags: ['适应性'],
    difficulty: '中等',
    freedom: 'high',
    dimension: 'J/P'
  },
  {
    id: 15,
    question: '在社交场合中，你更倾向于？',
    type: 'choice',
    options: ['主动与多人交流', '与少数人深度交流', '观察他人行为', '寻找安静角落'],
    tags: ['社交风格'],
    difficulty: '简单',
    freedom: 'low',
    dimension: 'E/I'
  },
  {
    id: 16,
    question: '你对未来的规划是怎样的？',
    type: 'open',
    options: [],
    tags: ['规划能力'],
    difficulty: '困难',
    freedom: 'high',
    dimension: 'J/P'
  }
];

export default function MBTITestPage() {
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState('全部');
  const [selectedFreedom, setSelectedFreedom] = useState('全部');
  const [filteredQuestions, setFilteredQuestions] = useState(questionBank);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [openAnswers, setOpenAnswers] = useState({});
  const [aiAnalysis, setAiAnalysis] = useState({});
  const [loading, setLoading] = useState(false);

  // 获取所有标签
  const allTags = [...new Set(questionBank.flatMap(q => q.tags))];
  const difficulties = ['全部', '简单', '中等', '困难'];
  const freedoms = ['全部', 'low', 'medium', 'high'];

  // 筛选题目
  useEffect(() => {
    let filtered = questionBank;
    
    if (selectedTags.length > 0) {
      filtered = filtered.filter(q => q.tags.some(tag => selectedTags.includes(tag)));
    }
    
    if (selectedDifficulty !== '全部') {
      filtered = filtered.filter(q => q.difficulty === selectedDifficulty);
    }
    
    if (selectedFreedom !== '全部') {
      filtered = filtered.filter(q => q.freedom === selectedFreedom);
    }
    
    setFilteredQuestions(filtered);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setOpenAnswers({});
  }, [selectedTags, selectedDifficulty, selectedFreedom]);

  const currentQuestion = filteredQuestions[currentQuestionIndex];

  const handleChoiceAnswer = (option) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: option
    });
  };

  const handleOpenAnswer = (text) => {
    setOpenAnswers({
      ...openAnswers,
      [currentQuestion.id]: text
    });
  };

  const handleCustomAnswer = async () => {
    if (!openAnswers[currentQuestion.id]) {
      showToast('请输入你的想法', 'warning');
      return;
    }

    setLoading(true);
    // 模拟 AI 分析（实际应该调用 API）
    setTimeout(() => {
      const analysis = {
        dimension: currentQuestion.dimension,
        insight: `根据你的回答，你在 ${currentQuestion.dimension} 维度上表现出较强的倾向。你的回答体现了对${currentQuestion.tags[0]}的深度思考。`,
        recommendation: '建议你在日常决策中更关注这方面的特质。'
      };
      setAiAnalysis({
        ...aiAnalysis,
        [currentQuestion.id]: analysis
      });
      setLoading(false);
      showToast('AI 分析完成', 'success');
    }, 1500);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      showToast('测试完成！', 'success');
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const getProgress = () => {
    const total = filteredQuestions.length;
    const answered = Object.keys({...answers, ...openAnswers}).length;
    return total > 0 ? (answered / total) * 100 : 0;
  };

  return (
    <div className="mbti-test-page">
      <div className="mbti-header">
        <h2>MBTI 性格测试</h2>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${getProgress()}%` }}></div>
        </div>
        <div className="progress-text">
          {currentQuestionIndex + 1} / {filteredQuestions.length}
        </div>
      </div>

      <div className="mbti-filters">
        <div className="filter-section">
          <h3>标签</h3>
          <div className="filter-tags">
            {allTags.map(tag => (
              <button
                key={tag}
                className={`filter-tag ${selectedTags.includes(tag) ? 'active' : ''}`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        <div className="filter-section">
          <h3>难度</h3>
          <div className="filter-buttons">
            {difficulties.map(diff => (
              <button
                key={diff}
                className={`filter-btn ${selectedDifficulty === diff ? 'active' : ''}`}
                onClick={() => setSelectedDifficulty(diff)}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
        <div className="filter-section">
          <h3>自由度</h3>
          <div className="filter-buttons">
            {freedoms.map(free => (
              <button
                key={free}
                className={`filter-btn ${selectedFreedom === free ? 'active' : ''}`}
                onClick={() => setSelectedFreedom(free)}
              >
                {free === 'low' ? '选择题' : free === 'high' ? '问答题' : free === 'medium' ? '混合' : free}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredQuestions.length === 0 ? (
        <div className="no-questions">
          <p>没有找到符合条件的题目，请调整筛选条件</p>
        </div>
      ) : (
        <div className="question-container">
          <div className="question-card">
            <div className="question-header">
              <span className="question-type">
                {currentQuestion.type === 'choice' ? '📝 选择题' : '💭 问答题'}
              </span>
              <span className="question-meta">
                {currentQuestion.tags.join(', ')} · {currentQuestion.difficulty}
              </span>
            </div>
            
            <h3 className="question-text">{currentQuestion.question}</h3>

            {currentQuestion.type === 'choice' ? (
              <div className="choice-options">
                {currentQuestion.options.map((option, idx) => (
                  <button
                    key={idx}
                    className={`choice-option ${
                      answers[currentQuestion.id] === option ? 'selected' : ''
                    }`}
                    onClick={() => handleChoiceAnswer(option)}
                  >
                    {option}
                  </button>
                ))}
                <button
                  className="choice-option custom-answer"
                  onClick={() => {
                    const customText = prompt('请说出你的想法：');
                    if (customText) {
                      handleOpenAnswer(customText);
                      handleCustomAnswer();
                    }
                  }}
                >
                  💬 以上选项都不符合，说出我的想法...
                </button>
              </div>
            ) : (
              <div className="open-answer-section">
                <textarea
                  className="open-answer-input"
                  placeholder="请详细描述你的想法..."
                  value={openAnswers[currentQuestion.id] || ''}
                  onChange={(e) => handleOpenAnswer(e.target.value)}
                  rows={6}
                />
                <button
                  className="btn primary analyze-btn"
                  onClick={handleCustomAnswer}
                  disabled={loading || !openAnswers[currentQuestion.id]}
                >
                  {loading ? '分析中...' : '🤖 AI 分析'}
                </button>
                {aiAnalysis[currentQuestion.id] && (
                  <div className="ai-analysis">
                    <h4>AI 分析结果</h4>
                    <p>{aiAnalysis[currentQuestion.id].insight}</p>
                    <p className="recommendation">{aiAnalysis[currentQuestion.id].recommendation}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="question-nav">
            <button
              className="btn secondary"
              onClick={prevQuestion}
              disabled={currentQuestionIndex === 0}
            >
              上一题
            </button>
            <button
              className="btn primary"
              onClick={nextQuestion}
              disabled={currentQuestionIndex === filteredQuestions.length - 1}
            >
              {currentQuestionIndex === filteredQuestions.length - 1 ? '完成测试' : '下一题'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

