import React from 'react';
import HealthIcon from './HealthIcon';
import ToggleSwitch from './ToggleSwitch';
import Badge from './Badge';
import './MedicationCard.css';

export default function MedicationCard({ medication, onToggle, onEdit, onDelete, className = '' }) {
  const getFrequencyBadgeVariant = (frequency) => {
    if (frequency === '每天') return 'primary';
    if (frequency === '每周') return 'success';
    return 'warning';
  };

  const isUpcoming = () => {
    const now = new Date();
    const [hours, minutes] = medication.time.split(':').map(Number);
    const medTime = new Date();
    medTime.setHours(hours, minutes, 0, 0);
    return medTime > now && medication.enabled;
  };

  return (
    <div className={`medication-card ${medication.enabled ? 'active' : 'inactive'} ${isUpcoming() ? 'upcoming' : ''} ${className}`}>
      <div className="medication-card-header">
        <div className="medication-card-icon">
          <HealthIcon type="medication" size={40} />
        </div>
        <div className="medication-card-title-group">
          <h3 className="medication-card-name">{medication.name}</h3>
          <div className="medication-card-meta">
            <Badge 
              variant={getFrequencyBadgeVariant(medication.frequency)} 
              size="small" 
              text={medication.frequency}
            />
            {isUpcoming() && (
              <Badge variant="success" size="small" text="即将提醒" />
            )}
          </div>
        </div>
        <div className="medication-card-switch">
          <ToggleSwitch 
            checked={medication.enabled} 
            onChange={(e) => onToggle(medication.id, e.target.checked)} 
          />
        </div>
      </div>
      
      <div className="medication-card-body">
        <div className="medication-card-details">
          <div className="detail-item">
            <HealthIcon type="medication" size={16} />
            <span className="detail-label">用量：</span>
            <span className="detail-value">{medication.dosage}</span>
          </div>
          <div className="detail-item">
            <HealthIcon type="calendar" size={16} />
            <span className="detail-label">时间：</span>
            <span className="detail-value time-highlight">{medication.time}</span>
          </div>
          {medication.note && (
            <div className="detail-item note-item">
              <HealthIcon type="note" size={16} />
              <span className="detail-note">{medication.note}</span>
            </div>
          )}
        </div>

        <div className="medication-card-stats">
          <div className="stat-item">
            <div className="stat-label">本月已提醒</div>
            <div className="stat-value">{medication.remindersThisMonth || 0}次</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">完成率</div>
            <div className="stat-value">{medication.completionRate || 0}%</div>
          </div>
        </div>
      </div>

      <div className="medication-card-actions">
        <button className="btn-icon" onClick={() => onEdit(medication)} title="编辑">
          <HealthIcon type="note" size={18} />
        </button>
        <button className="btn-icon danger" onClick={() => onDelete(medication.id)} title="删除">
          <HealthIcon type="security" size={18} />
        </button>
      </div>
    </div>
  );
}

