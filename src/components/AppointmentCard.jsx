import React from 'react';
import HealthIcon from './HealthIcon';
import Badge from './Badge';
import './AppointmentCard.css';

export default function AppointmentCard({ appointment, onEdit, onCancel, className = '' }) {
  const getStatusVariant = (status) => {
    const statusMap = {
      '已预约': 'primary',
      '已完成': 'success',
      '已取消': 'warning',
      '待确认': 'warning',
    };
    return statusMap[status] || 'default';
  };

  const getDaysUntil = (date) => {
    const today = new Date();
    const aptDate = new Date(date);
    const diffTime = aptDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return '已过期';
    if (diffDays === 0) return '今天';
    if (diffDays === 1) return '明天';
    if (diffDays <= 7) return `${diffDays}天后`;
    return `${Math.floor(diffDays / 7)}周后`;
  };

  const isUpcoming = () => {
    const today = new Date();
    const aptDate = new Date(appointment.date);
    return aptDate >= today && appointment.status === '已预约';
  };

  return (
    <div className={`appointment-card ${isUpcoming() ? 'upcoming' : ''} ${className}`}>
      <div className="appointment-card-header">
        <div className="appointment-card-avatar">
          <HealthIcon type="hospital" size={32} />
        </div>
        <div className="appointment-card-info">
          <div className="appointment-card-top">
            <h3 className="appointment-card-doctor">{appointment.doctor}</h3>
            <Badge 
              variant={getStatusVariant(appointment.status)} 
              size="small" 
              text={appointment.status}
            />
          </div>
          <div className="appointment-card-department">
            <HealthIcon type="hospital" size={14} />
            <span>{appointment.department}</span>
          </div>
        </div>
        {isUpcoming() && (
          <div className="appointment-card-badge">
            <Badge variant="success" size="small" text={getDaysUntil(appointment.date)} />
          </div>
        )}
      </div>

      <div className="appointment-card-body">
        <div className="appointment-card-time">
          <div className="time-item">
            <HealthIcon type="calendar" size={18} />
            <div className="time-content">
              <div className="time-label">日期</div>
              <div className="time-value">{new Date(appointment.date).toLocaleDateString('zh-CN', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                weekday: 'long'
              })}</div>
            </div>
          </div>
          <div className="time-item">
            <HealthIcon type="calendar" size={18} />
            <div className="time-content">
              <div className="time-label">时间</div>
              <div className="time-value">{appointment.time}</div>
            </div>
          </div>
        </div>

        {appointment.location && (
          <div className="appointment-card-location">
            <HealthIcon type="network" size={16} />
            <span>{appointment.location}</span>
          </div>
        )}

        {appointment.note && (
          <div className="appointment-card-note">
            <HealthIcon type="note" size={16} />
            <span>{appointment.note}</span>
          </div>
        )}

        {appointment.symptoms && appointment.symptoms.length > 0 && (
          <div className="appointment-card-symptoms">
            <div className="symptoms-label">主要症状：</div>
            <div className="symptoms-tags">
              {appointment.symptoms.map((symptom, idx) => (
                <span key={idx} className="symptom-tag">{symptom}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="appointment-card-actions">
        {isUpcoming() && (
          <>
            <button className="btn-icon" onClick={() => onEdit(appointment)} title="编辑">
              <HealthIcon type="note" size={18} />
            </button>
            <button className="btn-icon danger" onClick={() => onCancel(appointment.id)} title="取消预约">
              <HealthIcon type="security" size={18} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

