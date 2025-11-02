import { useState } from 'react';
import { showToast } from '../../Toast';
import SectionHeader from '../../components/SectionHeader';
import FormPanel from '../../components/FormPanel';
import FormGroup from '../../components/FormGroup';
import MedicationCard from '../../components/MedicationCard';
import StatCard from '../../components/StatCard';
import FilterTabs from '../../components/FilterTabs';
import HealthIcon from '../../components/HealthIcon';
import './MedicationReminderPage.css';

export default function MedicationReminderPage() {
  const [medications, setMedications] = useState([
    { 
      id: 1, 
      name: '维生素D', 
      dosage: '1片', 
      time: '08:00', 
      frequency: '每天', 
      enabled: true,
      note: '饭后服用，有助于钙吸收',
      remindersThisMonth: 28,
      completionRate: 95
    },
    { 
      id: 2, 
      name: '复合维生素', 
      dosage: '1片', 
      time: '12:00', 
      frequency: '每天', 
      enabled: true,
      note: '随餐服用',
      remindersThisMonth: 25,
      completionRate: 89
    },
    {
      id: 3,
      name: '褪黑素',
      dosage: '2片',
      time: '22:00',
      frequency: '每天',
      enabled: true,
      note: '睡前30分钟服用',
      remindersThisMonth: 30,
      completionRate: 100
    },
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMed, setEditingMed] = useState(null);
  const [newMed, setNewMed] = useState({ name: '', dosage: '', time: '08:00', frequency: '每天', note: '' });

  const [filter, setFilter] = useState('all');

  const addMedication = () => {
    if (!newMed.name.trim()) {
      showToast('请输入药物名称', 'warning');
      return;
    }
    const med = {
      ...newMed,
      id: editingMed ? editingMed.id : Date.now(),
      enabled: editingMed ? editingMed.enabled : true,
      remindersThisMonth: editingMed ? editingMed.remindersThisMonth : 0,
      completionRate: editingMed ? editingMed.completionRate : 0,
    };
    
    if (editingMed) {
      setMedications(medications.map(m => m.id === editingMed.id ? med : m));
      showToast('用药提醒已更新', 'success');
      setEditingMed(null);
    } else {
      setMedications([...medications, med]);
      showToast('用药提醒已添加', 'success');
    }
    
    setNewMed({ name: '', dosage: '', time: '08:00', frequency: '每天', note: '' });
    setShowAddForm(false);
  };

  const toggleMedication = (id, enabled) => {
    setMedications(medications.map(m => m.id === id ? { ...m, enabled } : m));
    showToast(enabled ? '提醒已开启' : '提醒已关闭', 'success');
  };

  const editMedication = (medication) => {
    setEditingMed(medication);
    setNewMed({
      name: medication.name,
      dosage: medication.dosage,
      time: medication.time,
      frequency: medication.frequency,
      note: medication.note || '',
    });
    setShowAddForm(true);
  };

  const deleteMedication = (id) => {
    if (window.confirm('确定要删除这个用药提醒吗？')) {
      setMedications(medications.filter(m => m.id !== id));
      showToast('用药提醒已删除', 'success');
    }
  };

  const filteredMedications = filter === 'all' 
    ? medications 
    : filter === 'active' 
    ? medications.filter(m => m.enabled)
    : medications.filter(m => !m.enabled);

  const stats = {
    total: medications.length,
    active: medications.filter(m => m.enabled).length,
    upcoming: medications.filter(m => {
      const now = new Date();
      const [hours, minutes] = m.time.split(':').map(Number);
      const medTime = new Date();
      medTime.setHours(hours, minutes, 0, 0);
      return medTime > now && m.enabled;
    }).length,
    completionRate: Math.round(
      medications.reduce((sum, m) => sum + (m.completionRate || 0), 0) / medications.length
    ) || 0,
  };

  return (
    <div className="medication-page">
      <SectionHeader 
        title="用药提醒管理" 
        description="设置和管理您的用药提醒，确保按时服药"
        actions={
          <button 
            className="btn primary" 
            onClick={() => {
              setShowAddForm(!showAddForm);
              setEditingMed(null);
              setNewMed({ name: '', dosage: '', time: '08:00', frequency: '每天', note: '' });
            }}
          >
            {showAddForm ? '取消' : '+ 添加提醒'}
          </button>
        }
      />

      <div className="medication-stats">
        <StatCard label="总提醒数" value={stats.total} iconType="medication" color="#2563eb" />
        <StatCard label="启用中" value={stats.active} iconType="check" color="#10b981" />
        <StatCard label="即将提醒" value={stats.upcoming} iconType="calendar" color="#f59e0b" />
        <StatCard label="完成率" value={`${stats.completionRate}%`} iconType="target" color="#8b5cf6" />
      </div>

      {showAddForm && (
        <FormPanel 
          title={editingMed ? '编辑用药提醒' : '添加用药提醒'}
          actions={
            <>
              <button className="btn" onClick={() => {
                setShowAddForm(false);
                setEditingMed(null);
                setNewMed({ name: '', dosage: '', time: '08:00', frequency: '每天', note: '' });
              }}>取消</button>
              <button className="btn primary" onClick={addMedication}>
                {editingMed ? '更新' : '保存'}
              </button>
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
                placeholder="如：1片、10ml、2粒"
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
            <FormGroup label="备注说明">
              <textarea
                className="input"
                placeholder="如：饭后服用、与牛奶同服等"
                value={newMed.note}
                onChange={(e) => setNewMed({ ...newMed, note: e.target.value })}
                rows={3}
              />
            </FormGroup>
          </div>
        </FormPanel>
      )}

      <div className="medication-filters">
        <FilterTabs
          filters={[
            { value: 'all', label: `全部 (${medications.length})` },
            { value: 'active', label: `启用中 (${stats.active})` },
            { value: 'inactive', label: `已暂停 (${medications.length - stats.active})` },
          ]}
          activeFilter={filter}
          onFilterChange={setFilter}
        />
      </div>

      <div className="medication-list">
        {filteredMedications.length === 0 ? (
          <div className="empty-state">
            <HealthIcon type="medication" size={64} />
            <p>暂无用药提醒</p>
            <button className="btn primary" onClick={() => setShowAddForm(true)}>
              添加第一个提醒
            </button>
          </div>
        ) : (
          filteredMedications.map((med) => (
            <MedicationCard
              key={med.id}
              medication={med}
              onToggle={toggleMedication}
              onEdit={editMedication}
              onDelete={deleteMedication}
            />
          ))
        )}
      </div>
    </div>
  );
}

