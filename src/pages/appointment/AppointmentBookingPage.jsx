import { useState } from 'react';
import { showToast } from '../../Toast';
import './AppointmentBookingPage.css';

export default function AppointmentBookingPage() {
  const [appointments, setAppointments] = useState([
    { id: 1, doctor: '张医生', department: '精神科', date: '2024-01-20', time: '10:00', status: '已预约' },
  ]);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingForm, setBookingForm] = useState({ doctor: '', department: '', date: '', time: '' });

  const departments = ['精神科', '心理科', '神经内科', '全科'];
  const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

  const bookAppointment = () => {
    if (!bookingForm.doctor || !bookingForm.date || !bookingForm.time) {
      showToast('请填写完整信息', 'warning');
      return;
    }
    setAppointments([...appointments, { ...bookingForm, id: Date.now(), status: '已预约' }]);
    setBookingForm({ doctor: '', department: '', date: '', time: '' });
    setShowBooking(false);
    showToast('预约成功！', 'success');
  };

  return (
    <div className="appointment-page">
      <div className="appointment-header">
        <h2>预约咨询</h2>
        <button className="btn primary" onClick={() => setShowBooking(!showBooking)}>
          {showBooking ? '取消' : '+ 新建预约'}
        </button>
      </div>

      {showBooking && (
        <div className="appointment-form-panel">
          <h3>选择医生和时段</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>科室</label>
              <select
                className="input"
                value={bookingForm.department}
                onChange={(e) => setBookingForm({ ...bookingForm, department: e.target.value })}
              >
                <option value="">请选择科室</option>
                {departments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>医生姓名</label>
              <input
                type="text"
                className="input"
                placeholder="输入医生姓名"
                value={bookingForm.doctor}
                onChange={(e) => setBookingForm({ ...bookingForm, doctor: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>日期</label>
              <input
                type="date"
                className="input"
                value={bookingForm.date}
                onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="form-group">
              <label>时间</label>
              <select
                className="input"
                value={bookingForm.time}
                onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
              >
                <option value="">选择时间</option>
                {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <button className="btn primary" onClick={bookAppointment}>确认预约</button>
        </div>
      )}

      <div className="appointment-list">
        <h3>我的预约 ({appointments.length})</h3>
        {appointments.map((apt) => (
          <div key={apt.id} className="appointment-item">
            <div className="appointment-main">
              <div className="appointment-doctor">👨‍⚕️ {apt.doctor}</div>
              <div className="appointment-department">{apt.department}</div>
            </div>
            <div className="appointment-time">
              <div>{apt.date}</div>
              <div>{apt.time}</div>
            </div>
            <div className={`appointment-status ${apt.status === '已预约' ? 'confirmed' : ''}`}>
              {apt.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

