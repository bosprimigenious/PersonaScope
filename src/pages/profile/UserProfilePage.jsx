import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { showToast } from '../../Toast';
import './UserProfilePage.css';

export default function UserProfilePage() {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    avatar: '',
    bio: '',
    address: '',
    occupation: '',
    emergencyContact: '',
    emergencyPhone: '',
    bloodType: '',
    height: '',
    weight: '',
    medicalHistory: '',
    currentMedications: '',
    allergies: '',
    insuranceNumber: '',
    idNumber: '',
  });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        age: user.age || '',
        gender: user.gender || '',
        avatar: user.avatar || '',
        bio: user.bio || '心理健康关注者',
        address: user.address || '',
        occupation: user.occupation || '',
        emergencyContact: user.emergencyContact || '',
        emergencyPhone: user.emergencyPhone || '',
        bloodType: user.bloodType || 'A',
        height: user.height || 175,
        weight: user.weight || 70,
        medicalHistory: user.medicalHistory || '无',
        currentMedications: user.currentMedications || '无',
        allergies: user.allergies || '无',
        insuranceNumber: user.insuranceNumber || '',
        idNumber: user.idNumber || '',
      });
    }
  }, [user]);

  const handleSave = () => {
    updateUser(userData);
    showToast('信息已保存', 'success');
    setEditing(false);
  };

  const handleCancel = () => {
    // 恢复原始数据
    if (user) {
      setUserData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        age: user.age || '',
        gender: user.gender || '',
        avatar: user.avatar || '',
        bio: user.bio || '心理健康关注者',
        address: user.address || '',
        occupation: user.occupation || '',
        emergencyContact: user.emergencyContact || '',
        emergencyPhone: user.emergencyPhone || '',
        bloodType: user.bloodType || 'A',
        height: user.height || 175,
        weight: user.weight || 70,
        medicalHistory: user.medicalHistory || '无',
        currentMedications: user.currentMedications || '无',
        allergies: user.allergies || '无',
        insuranceNumber: user.insuranceNumber || '',
        idNumber: user.idNumber || '',
      });
    }
    setEditing(false);
    showToast('已取消编辑', 'info');
  };

  // 如果用户未登录，会由ProtectedRoute重定向
  if (!user) {
    return null;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h2>个人资料</h2>
        <div className="profile-actions">
          {editing ? (
            <>
              <button className="btn secondary" onClick={handleCancel}>取消</button>
              <button className="btn primary" onClick={handleSave}>保存</button>
            </>
          ) : (
            <>
              <button 
                className="btn secondary" 
                onClick={() => {
                  logout();
                  navigate('/');
                }}
              >
                退出登录
              </button>
              <button className="btn primary" onClick={() => setEditing(true)}>编辑</button>
            </>
          )}
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-avatar-section">
          <div className="avatar-container">
            {userData.avatar && userData.avatar.startsWith('data:') ? (
              <img src={userData.avatar} alt={userData.name || '用户'} className="avatar-image-display" />
            ) : (
              <div className="avatar-placeholder">
                {userData.name ? userData.name.charAt(0) : user?.name?.charAt(0) || '👤'}
              </div>
            )}
          </div>
          {editing && (
            <>
              <input
                type="file"
                accept="image/*"
                id="avatar-upload"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (file.size > 5 * 1024 * 1024) {
                      showToast('图片大小不能超过5MB', 'warning');
                      return;
                    }
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      const base64String = reader.result;
                      setUserData({ ...userData, avatar: base64String });
                      showToast('头像已更新', 'success');
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <label htmlFor="avatar-upload" className="btn small">
                更换头像
              </label>
            </>
          )}
        </div>

        <div className="profile-sections">
          {/* 基本信息 */}
          <div className="profile-section">
            <h3>基本信息</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>姓名</label>
                {editing ? (
                  <input
                    type="text"
                    className="input"
                    value={userData.name}
                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                  />
                ) : (
                  <div className="info-display">{userData.name}</div>
                )}
              </div>
              <div className="form-group">
                <label>邮箱</label>
                {editing ? (
                  <input
                    type="email"
                    className="input"
                    value={userData.email}
                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                  />
                ) : (
                  <div className="info-display">{userData.email}</div>
                )}
              </div>
              <div className="form-group">
                <label>手机号</label>
                {editing ? (
                  <input
                    type="tel"
                    className="input"
                    value={userData.phone}
                    onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                  />
                ) : (
                  <div className="info-display">{userData.phone}</div>
                )}
              </div>
              <div className="form-group">
                <label>年龄</label>
                {editing ? (
                  <input
                    type="number"
                    className="input"
                    value={userData.age}
                    onChange={(e) => setUserData({ ...userData, age: parseInt(e.target.value) })}
                  />
                ) : (
                  <div className="info-display">{userData.age} 岁</div>
                )}
              </div>
              <div className="form-group">
                <label>性别</label>
                {editing ? (
                  <select
                    className="input"
                    value={userData.gender}
                    onChange={(e) => setUserData({ ...userData, gender: e.target.value })}
                  >
                    <option value="male">男</option>
                    <option value="female">女</option>
                    <option value="other">其他</option>
                  </select>
                ) : (
                  <div className="info-display">{userData.gender === 'male' ? '男' : userData.gender === 'female' ? '女' : '其他'}</div>
                )}
              </div>
              <div className="form-group">
                <label>居住地址</label>
                {editing ? (
                  <input
                    type="text"
                    className="input"
                    value={userData.address}
                    onChange={(e) => setUserData({ ...userData, address: e.target.value })}
                  />
                ) : (
                  <div className="info-display">{userData.address || '未填写'}</div>
                )}
              </div>
              <div className="form-group">
                <label>职业</label>
                {editing ? (
                  <input
                    type="text"
                    className="input"
                    value={userData.occupation}
                    onChange={(e) => setUserData({ ...userData, occupation: e.target.value })}
                  />
                ) : (
                  <div className="info-display">{userData.occupation || '未填写'}</div>
                )}
              </div>
              <div className="form-group full-width">
                <label>个人简介</label>
                {editing ? (
                  <textarea
                    className="input textarea"
                    rows="3"
                    value={userData.bio}
                    onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                    placeholder="介绍一下自己..."
                  />
                ) : (
                  <div className="info-display">{userData.bio || '暂无简介'}</div>
                )}
              </div>
            </div>
          </div>

          {/* 健康信息 */}
          <div className="profile-section">
            <h3>健康信息</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>血型</label>
                {editing ? (
                  <select
                    className="input"
                    value={userData.bloodType}
                    onChange={(e) => setUserData({ ...userData, bloodType: e.target.value })}
                  >
                    <option value="A">A型</option>
                    <option value="B">B型</option>
                    <option value="AB">AB型</option>
                    <option value="O">O型</option>
                  </select>
                ) : (
                  <div className="info-display">{userData.bloodType}型</div>
                )}
              </div>
              <div className="form-group">
                <label>身高 (cm)</label>
                {editing ? (
                  <input
                    type="number"
                    className="input"
                    value={userData.height}
                    onChange={(e) => setUserData({ ...userData, height: parseInt(e.target.value) })}
                  />
                ) : (
                  <div className="info-display">{userData.height} cm</div>
                )}
              </div>
              <div className="form-group">
                <label>体重 (kg)</label>
                {editing ? (
                  <input
                    type="number"
                    className="input"
                    value={userData.weight}
                    onChange={(e) => setUserData({ ...userData, weight: parseInt(e.target.value) })}
                  />
                ) : (
                  <div className="info-display">{userData.weight} kg</div>
                )}
              </div>
              <div className="form-group full-width">
                <label>既往病史</label>
                {editing ? (
                  <textarea
                    className="input textarea"
                    rows="2"
                    value={userData.medicalHistory}
                    onChange={(e) => setUserData({ ...userData, medicalHistory: e.target.value })}
                    placeholder="如：高血压、糖尿病等"
                  />
                ) : (
                  <div className="info-display">{userData.medicalHistory || '无'}</div>
                )}
              </div>
              <div className="form-group full-width">
                <label>当前用药</label>
                {editing ? (
                  <textarea
                    className="input textarea"
                    rows="2"
                    value={userData.currentMedications}
                    onChange={(e) => setUserData({ ...userData, currentMedications: e.target.value })}
                    placeholder="如：降压药、抗抑郁药等"
                  />
                ) : (
                  <div className="info-display">{userData.currentMedications || '无'}</div>
                )}
              </div>
              <div className="form-group full-width">
                <label>过敏史</label>
                {editing ? (
                  <textarea
                    className="input textarea"
                    rows="2"
                    value={userData.allergies}
                    onChange={(e) => setUserData({ ...userData, allergies: e.target.value })}
                    placeholder="如：青霉素、花粉等"
                  />
                ) : (
                  <div className="info-display">{userData.allergies || '无'}</div>
                )}
              </div>
            </div>
          </div>

          {/* 紧急联系人 */}
          <div className="profile-section">
            <h3>紧急联系人</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>联系人姓名</label>
                {editing ? (
                  <input
                    type="text"
                    className="input"
                    value={userData.emergencyContact}
                    onChange={(e) => setUserData({ ...userData, emergencyContact: e.target.value })}
                  />
                ) : (
                  <div className="info-display">{userData.emergencyContact || '未填写'}</div>
                )}
              </div>
              <div className="form-group">
                <label>联系电话</label>
                {editing ? (
                  <input
                    type="tel"
                    className="input"
                    value={userData.emergencyPhone}
                    onChange={(e) => setUserData({ ...userData, emergencyPhone: e.target.value })}
                  />
                ) : (
                  <div className="info-display">{userData.emergencyPhone || '未填写'}</div>
                )}
              </div>
            </div>
          </div>

          {/* 其他信息 */}
          <div className="profile-section">
            <h3>其他信息</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>身份证号</label>
                {editing ? (
                  <input
                    type="text"
                    className="input"
                    value={userData.idNumber}
                    onChange={(e) => setUserData({ ...userData, idNumber: e.target.value })}
                    placeholder="用于医疗记录"
                  />
                ) : (
                  <div className="info-display">{userData.idNumber ? userData.idNumber.replace(/(\d{6})\d{8}(\d{4})/, '$1********$2') : '未填写'}</div>
                )}
              </div>
              <div className="form-group">
                <label>医保号</label>
                {editing ? (
                  <input
                    type="text"
                    className="input"
                    value={userData.insuranceNumber}
                    onChange={(e) => setUserData({ ...userData, insuranceNumber: e.target.value })}
                  />
                ) : (
                  <div className="info-display">{userData.insuranceNumber || '未填写'}</div>
                )}
              </div>
            </div>
          </div>

          {/* 账号统计 */}
          <div className="profile-section">
            <h3>账号统计</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-label">注册时间</div>
                <div className="stat-value">2024-01-01</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">总评估次数</div>
                <div className="stat-value">24</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">健康报告</div>
                <div className="stat-value">8</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">预约次数</div>
                <div className="stat-value">5</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

