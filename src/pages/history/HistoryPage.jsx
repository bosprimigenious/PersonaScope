import { useState } from 'react';
import SectionHeader from '../../components/SectionHeader';
import './HistoryPage.css';

export default function HistoryPage() {
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
      <SectionHeader title="历史记录" />
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

