import { useState } from 'react';
import { showToast } from '../../Toast';
import SectionHeader from '../../components/SectionHeader';
import FormPanel from '../../components/FormPanel';
import FormGroup from '../../components/FormGroup';
import AppointmentCard from '../../components/AppointmentCard';
import StatCard from '../../components/StatCard';
import FilterTabs from '../../components/FilterTabs';
import HealthIcon from '../../components/HealthIcon';
import './AppointmentBookingPage.css';

export default function AppointmentBookingPage() {
  const [appointments, setAppointments] = useState([
    { 
      id: 1, 
      doctor: '张医生', 
      department: '精神科', 
      date: '2024-01-20', 
      time: '10:00', 
      status: '已预约',
      location: '门诊楼3楼A区',
      note: '首次就诊，请携带身份证和医保卡',
      symptoms: ['焦虑', '失眠']
    },
    {
      id: 2,
      doctor: '李医生',
      department: '心理科',
      date: '2024-01-25',
      time: '14:00',
      status: '已预约',
      location: '门诊楼2楼B区',
      note: '复诊，请携带上次的检查报告',
      symptoms: []
    },
  ]);
  const [showBooking, setShowBooking] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [filter, setFilter] = useState('all');
  const [bookingForm, setBookingForm] = useState({ 
    doctor: '', 
    department: '', 
    date: '', 
    time: '',
    location: '',
    note: '',
    symptoms: []
  });

  const departments = ['精神科', '心理科', '神经内科', '全科'];
  const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

  const bookAppointment = () => {
    if (!bookingForm.doctor || !bookingForm.date || !bookingForm.time) {
      showToast('请填写完整信息', 'warning');
      return;
    }
    
    const apt = {
      ...bookingForm,
      id: editingAppointment ? editingAppointment.id : Date.now(),
      status: editingAppointment ? editingAppointment.status : '已预约',
    };
    
    if (editingAppointment) {
      setAppointments(appointments.map(a => a.id === editingAppointment.id ? apt : a));
      showToast('预约信息已更新', 'success');
      setEditingAppointment(null);
    } else {
      setAppointments([...appointments, apt]);
      showToast('预约成功！', 'success');
    }
    
    setBookingForm({ doctor: '', department: '', date: '', time: '', location: '', note: '', symptoms: [] });
    setShowBooking(false);
  };

  const editAppointment = (appointment) => {
    setEditingAppointment(appointment);
    setBookingForm({
      doctor: appointment.doctor,
      department: appointment.department,
      date: appointment.date,
      time: appointment.time,
      location: appointment.location || '',
      note: appointment.note || '',
      symptoms: appointment.symptoms || [],
    });
    setShowBooking(true);
  };

  const cancelAppointment = (id) => {
    if (window.confirm('确定要取消这个预约吗？')) {
      setAppointments(appointments.map(a => 
        a.id === id ? { ...a, status: '已取消' } : a
      ));
      showToast('预约已取消', 'success');
    }
  };

  const filteredAppointments = filter === 'all' 
    ? appointments 
    : appointments.filter(a => {
      if (filter === 'upcoming') {
        const today = new Date();
        const aptDate = new Date(a.date);
        return aptDate >= today && a.status === '已预约';
      }
      return a.status === filter;
    });

  const stats = {
    total: appointments.length,
    upcoming: appointments.filter(a => {
      const today = new Date();
      const aptDate = new Date(a.date);
      return aptDate >= today && a.status === '已预约';
    }).length,
    completed: appointments.filter(a => a.status === '已完成').length,
    cancelled: appointments.filter(a => a.status === '已取消').length,
  };

  const commonSymptoms = ['焦虑', '抑郁', '失眠', '头痛', '疲劳', '注意力不集中', '情绪波动'];

  return (
    <div className="appointment-page">
      <SectionHeader 
        title="预约咨询管理"
        description="在线预约医生，管理您的就诊安排"
        actions={
          <button 
            className="btn primary" 
            onClick={() => {
              setShowBooking(!showBooking);
              setEditingAppointment(null);
              setBookingForm({ doctor: '', department: '', date: '', time: '', location: '', note: '', symptoms: [] });
            }}
          >
            {showBooking ? '取消' : '+ 新建预约'}
          </button>
        }
      />

      <div className="appointment-stats">
        <StatCard label="总预约数" value={stats.total} iconType="calendar" color="#2563eb" />
        <StatCard label="待就诊" value={stats.upcoming} iconType="target" color="#10b981" />
        <StatCard label="已完成" value={stats.completed} iconType="check" color="#f59e0b" />
        <StatCard label="已取消" value={stats.cancelled} iconType="security" color="#ef4444" />
      </div>

      {showBooking && (
        <FormPanel 
          title={editingAppointment ? '编辑预约信息' : '新建预约'}
          actions={
            <>
              <button 
                className="btn" 
                onClick={() => {
                  setShowBooking(false);
                  setEditingAppointment(null);
                  setBookingForm({ doctor: '', department: '', date: '', time: '', location: '', note: '', symptoms: [] });
                }}
              >
                取消
              </button>
              <button className="btn primary" onClick={bookAppointment}>
                {editingAppointment ? '更新预约' : '确认预约'}
              </button>
            </>
          }
        >
          <div className="form-grid">
            <FormGroup label="科室" required>
              <select
                className="input"
                value={bookingForm.department}
                onChange={(e) => setBookingForm({ ...bookingForm, department: e.target.value })}
              >
                <option value="">请选择科室</option>
                {departments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </FormGroup>
            <FormGroup label="医生姓名" required>
              <input
                type="text"
                className="input"
                placeholder="输入医生姓名"
                value={bookingForm.doctor}
                onChange={(e) => setBookingForm({ ...bookingForm, doctor: e.target.value })}
              />
            </FormGroup>
            <FormGroup label="日期" required>
              <input
                type="date"
                className="input"
                value={bookingForm.date}
                onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
              />
            </FormGroup>
            <FormGroup label="时间" required>
              <select
                className="input"
                value={bookingForm.time}
                onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
              >
                <option value="">选择时间</option>
                {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </FormGroup>
            <FormGroup label="就诊地点">
              <input
                type="text"
                className="input"
                placeholder="如：门诊楼3楼A区"
                value={bookingForm.location}
                onChange={(e) => setBookingForm({ ...bookingForm, location: e.target.value })}
              />
            </FormGroup>
            <FormGroup label="主要症状">
              <div className="symptoms-selector">
                {commonSymptoms.map(symptom => (
                  <label key={symptom} className="symptom-checkbox">
                    <input
                      type="checkbox"
                      checked={bookingForm.symptoms.includes(symptom)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setBookingForm({ ...bookingForm, symptoms: [...bookingForm.symptoms, symptom] });
                        } else {
                          setBookingForm({ ...bookingForm, symptoms: bookingForm.symptoms.filter(s => s !== symptom) });
                        }
                      }}
                    />
                    <span>{symptom}</span>
                  </label>
                ))}
              </div>
            </FormGroup>
            <FormGroup label="备注说明">
              <textarea
                className="input"
                placeholder="如：首次就诊、复诊、需要检查等"
                value={bookingForm.note}
                onChange={(e) => setBookingForm({ ...bookingForm, note: e.target.value })}
                rows={3}
              />
            </FormGroup>
          </div>
        </FormPanel>
      )}

      <div className="appointment-filters">
        <FilterTabs
          filters={[
            { value: 'all', label: `全部 (${appointments.length})` },
            { value: 'upcoming', label: `待就诊 (${stats.upcoming})` },
            { value: '已完成', label: `已完成 (${stats.completed})` },
            { value: '已取消', label: `已取消 (${stats.cancelled})` },
          ]}
          activeFilter={filter}
          onFilterChange={setFilter}
        />
      </div>

      <div className="appointment-list">
        {filteredAppointments.length === 0 ? (
          <div className="empty-state">
            <HealthIcon type="calendar" size={64} />
            <p>暂无预约记录</p>
            <button className="btn primary" onClick={() => setShowBooking(true)}>
              创建第一个预约
            </button>
          </div>
        ) : (
          filteredAppointments.map((apt) => (
            <AppointmentCard
              key={apt.id}
              appointment={apt}
              onEdit={editAppointment}
              onCancel={cancelAppointment}
            />
          ))
        )}
      </div>
    </div>
  );
}

