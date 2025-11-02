import { useState } from 'react';
import { showToast } from '../../Toast';
import './MedicationReminderPage.css';

export default function MedicationReminderPage() {
  const [medications, setMedications] = useState([
    { id: 1, name: '维生素D', dosage: '1片', time: '08:00', frequency: '每天', enabled: true },
    { id: 2, name: '复合维生素', dosage: '1片', time: '12:00', frequency: '每天', enabled: true },
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMed, setNewMed] = useState({ name: '', dosage: '', time: '08:00', frequency: '每天' });

  const addMedication = () => {
    if (!newMed.name.trim()) {
      showToast('请输入药物名称', 'warning');
      return;
    }
    setMedications([...medications, { ...newMed, id: Date.now(), enabled: true }]);
    setNewMed({ name: '', dosage: '', time: '08:00', frequency: '每天' });
    setShowAddForm(false);
    showToast('用药提醒已添加', 'success');
  };

  const toggleMedication = (id) => {
    setMedications(medications.map(m => m.id === id ? { ...m, enabled: !m.enabled } : m));
    showToast('提醒状态已更新', 'success');
  };

  return (
    <div className="medication-page">
      <div className="medication-header">
        <h2>用药提醒</h2>
        <button className="btn primary" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? '取消' : '+ 添加提醒'}
        </button>
      </div>

      {showAddForm && (
        <div className="medication-form-panel">
          <h3>添加用药提醒</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>药物名称</label>
              <input
                type="text"
                className="input"
                placeholder="如：阿司匹林"
                value={newMed.name}
                onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>用量</label>
              <input
                type="text"
                className="input"
                placeholder="如：1片"
                value={newMed.dosage}
                onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>提醒时间</label>
              <input
                type="time"
                className="input"
                value={newMed.time}
                onChange={(e) => setNewMed({ ...newMed, time: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>频率</label>
              <select
                className="input"
                value={newMed.frequency}
                onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
              >
                <option>每天</option>
                <option>每周</option>
                <option>按需服用</option>
              </select>
            </div>
          </div>
          <button className="btn primary" onClick={addMedication}>保存</button>
        </div>
      )}

      <div className="medication-list">
        {medications.map((med) => (
          <div key={med.id} className="medication-item">
            <div className="medication-icon">💊</div>
            <div className="medication-info">
              <div className="medication-name">{med.name}</div>
              <div className="medication-details">
                {med.dosage} · {med.time} · {med.frequency}
              </div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={med.enabled}
                onChange={() => toggleMedication(med.id)}
              />
              <span className="slider"></span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

