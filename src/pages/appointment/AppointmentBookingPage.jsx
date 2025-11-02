import { useState } from 'react';
import { showToast } from '../../Toast';
import SectionHeader from '../../components/SectionHeader';
import FormPanel from '../../components/FormPanel';
import FormGroup from '../../components/FormGroup';
import ListItem from '../../components/ListItem';
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
      <SectionHeader 
        title="预约咨询"
        actions={
          <button className="btn primary" onClick={() => setShowBooking(!showBooking)}>
            {showBooking ? '取消' : '+ 新建预约'}
          </button>
        }
      />

      {showBooking && (
        <FormPanel 
          title="选择医生和时段"
          actions={
            <>
              <button className="btn" onClick={() => setShowBooking(false)}>取消</button>
              <button className="btn primary" onClick={bookAppointment}>确认预约</button>
            </>
          }
        >
          <div className="form-grid">
            <FormGroup label="科室">
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
          </div>
        </FormPanel>
      )}

      <div className="appointment-list">
        <h3>我的预约 ({appointments.length})</h3>
        <div className="appointment-items">
          {appointments.map((apt) => (
            <ListItem
              key={apt.id}
              iconType="hospital"
              title={apt.doctor}
              subtitle={apt.department}
              details={`${apt.date} ${apt.time}`}
              status={apt.status === '已预约' ? 'confirmed' : ''}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

