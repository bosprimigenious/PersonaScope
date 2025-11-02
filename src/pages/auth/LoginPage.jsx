import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { showToast } from '../../Toast';
import './LoginPage.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isRegister, setIsRegister] = useState(false);
  const [userInfo, setUserInfo] = useState({ 
    name: '', 
    age: '', 
    gender: '', 
    phone: '',
    address: '',
    occupation: '',
    emergencyContact: '',
    emergencyPhone: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegister) {
      if (!formData.email || !formData.password || !userInfo.name) {
        showToast('请填写完整信息', 'warning');
        return;
      }
      // 注册时也自动登录
      const userData = {
        name: userInfo.name,
        email: formData.email,
        avatar: '',
        age: userInfo.age,
        gender: userInfo.gender,
        phone: userInfo.phone,
        address: userInfo.address,
        occupation: userInfo.occupation,
        emergencyContact: userInfo.emergencyContact,
        emergencyPhone: userInfo.emergencyPhone,
      };
      login(userData);
      showToast('注册成功！', 'success');
      setTimeout(() => {
        navigate(location.state?.from || '/', { replace: true });
      }, 500);
    } else {
      if (!formData.email || !formData.password) {
        showToast('请输入邮箱和密码', 'warning');
        return;
      }
      // 模拟登录，实际应该调用API
      const userData = {
        name: formData.email.split('@')[0] || '用户',
        email: formData.email,
        avatar: '',
      };
      login(userData);
      showToast('登录成功！', 'success');
      setTimeout(() => {
        navigate(location.state?.from || '/', { replace: true });
      }, 500);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h2>{isRegister ? '创建账号' : '欢迎回来'}</h2>
          <p>{isRegister ? '填写信息以开始使用 PersonaScope' : '登录您的账号以继续使用服务'}</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label>姓名 *</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="请输入您的姓名"
                    value={userInfo.name}
                    onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>年龄</label>
                  <input
                    type="number"
                    className="input"
                    placeholder="请输入年龄"
                    min="1"
                    max="120"
                    value={userInfo.age}
                    onChange={(e) => setUserInfo({ ...userInfo, age: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>性别</label>
                  <select
                    className="input"
                    value={userInfo.gender}
                    onChange={(e) => setUserInfo({ ...userInfo, gender: e.target.value })}
                  >
                    <option value="">请选择</option>
                    <option value="male">男</option>
                    <option value="female">女</option>
                    <option value="other">其他</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>手机号</label>
                  <input
                    type="tel"
                    className="input"
                    placeholder="请输入手机号"
                    value={userInfo.phone}
                    onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>居住地址</label>
                <input
                  type="text"
                  className="input"
                  placeholder="请输入居住地址"
                  value={userInfo.address}
                  onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>职业</label>
                <input
                  type="text"
                  className="input"
                  placeholder="请输入您的职业"
                  value={userInfo.occupation}
                  onChange={(e) => setUserInfo({ ...userInfo, occupation: e.target.value })}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>紧急联系人</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="紧急联系人姓名"
                    value={userInfo.emergencyContact}
                    onChange={(e) => setUserInfo({ ...userInfo, emergencyContact: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>紧急联系电话</label>
                  <input
                    type="tel"
                    className="input"
                    placeholder="紧急联系电话"
                    value={userInfo.emergencyPhone}
                    onChange={(e) => setUserInfo({ ...userInfo, emergencyPhone: e.target.value })}
                  />
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label>邮箱 *</label>
            <input
              type="email"
              className="input"
              placeholder="请输入邮箱地址"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>密码 *</label>
            <input
              type="password"
              className="input"
              placeholder={isRegister ? '至少8位密码' : '请输入密码'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={isRegister ? 8 : undefined}
            />
          </div>

          {isRegister && (
            <div className="form-group">
              <label>确认密码 *</label>
              <input
                type="password"
                className="input"
                placeholder="再次输入密码"
                required
              />
            </div>
          )}

          <button type="submit" className="btn-primary large full-width">
            {isRegister ? '注册' : '登录'}
          </button>
        </form>

        <div className="login-footer">
          <button
            type="button"
            className="link-button"
            onClick={() => {
              setIsRegister(!isRegister);
              setFormData({ email: '', password: '' });
            }}
          >
            {isRegister ? '已有账号？去登录' : '没有账号？立即注册'}
          </button>
        </div>
      </div>
    </div>
  );
}

