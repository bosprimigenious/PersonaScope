import { useState } from 'react';
import { showToast } from '../../Toast';
import SectionHeader from '../../components/SectionHeader';
import FormPanel from '../../components/FormPanel';
import FormGroup from '../../components/FormGroup';
import ListItem from '../../components/ListItem';
import HealthIcon from '../../components/HealthIcon';
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
      <SectionHeader 
        title="用药提醒" 
        actions={
          <button className="btn primary" onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? '取消' : '+ 添加提醒'}
          </button>
        }
      />

      {showAddForm && (
        <FormPanel 
          title="添加用药提醒"
          actions={
            <>
              <button className="btn" onClick={() => setShowAddForm(false)}>取消</button>
              <button className="btn primary" onClick={addMedication}>保存</button>
            </>
          }
        >
          <div className="form-grid">
            <FormGroup label="药物名称" required>
              <input
                type="text"
                className="input"
                placeholder="如：阿司匹林"
                value={newMed.name}
                onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
              />
            </FormGroup>
            <FormGroup label="用量">
              <input
                type="text"
                className="input"
                placeholder="如：1片"
                value={newMed.dosage}
                onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
              />
            </FormGroup>
            <FormGroup label="提醒时间">
              <input
                type="time"
                className="input"
                value={newMed.time}
                onChange={(e) => setNewMed({ ...newMed, time: e.target.value })}
              />
            </FormGroup>
            <FormGroup label="频率">
              <select
                className="input"
                value={newMed.frequency}
                onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
              >
                <option>每天</option>
                <option>每周</option>
                <option>按需服用</option>
              </select>
            </FormGroup>
          </div>
        </FormPanel>
      )}

      <div className="medication-list">
        {medications.map((med) => (
          <ListItem
            key={med.id}
            iconType="medication"
            title={med.name}
            details={`${med.dosage} · ${med.time} · ${med.frequency}`}
            checked={med.enabled}
            onToggle={(checked) => toggleMedication(med.id)}
          />
        ))}
      </div>
    </div>
  );
}

