import { useState, useEffect } from 'react';
import { useTheme } from '../../theme';
import { showToast } from '../../Toast';
import SettingIcon from '../../components/SettingIcon';
import ToggleSwitch from '../../components/ToggleSwitch';
import './SettingsPage.css';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [cameraDevice, setCameraDevice] = useState('');
  const [devices, setDevices] = useState([]);
  const [emailSettings, setEmailSettings] = useState({
    analysisComplete: true,
    weeklyReport: true,
    appointmentReminder: true,
    medicationReminder: true,
    healthAlert: false,
  });
  const [notificationEmail, setNotificationEmail] = useState('user@example.com');
  const [privacySettings, setPrivacySettings] = useState({
    allowDataAnalysis: true,
    shareAnonymousData: false,
    enableBiometric: false,
    autoBackup: true,
  });
  const [notificationSettings, setNotificationSettings] = useState({
    pushEnabled: true,
    soundEnabled: true,
    vibrationEnabled: true,
    quietHours: false,
    quietStart: '22:00',
    quietEnd: '08:00',
  });
  const [displaySettings, setDisplaySettings] = useState({
    fontSize: 'medium',
    language: 'zh-CN',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '24h',
  });
  const [dataSettings, setDataSettings] = useState({
    autoSync: true,
    syncInterval: '1h',
    cacheSize: '500MB',
    clearCache: false,
  });

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devs) => {
      const videoDevices = devs.filter(d => d.kind === 'videoinput');
      setDevices(videoDevices);
      if (videoDevices.length > 0 && !cameraDevice) {
        setCameraDevice(videoDevices[0].deviceId);
      }
    });
  }, []);

  const handleEmailTest = () => {
    showToast('测试邮件已发送，请查收', 'success');
  };

  const handleThemeChange = (e) => {
    const newTheme = e.target.value;
    if (newTheme !== theme) {
      toggleTheme();
    }
  };

  const handleSave = () => {
    showToast('设置已保存', 'success');
  };

  const handleClearCache = () => {
    setDataSettings({ ...dataSettings, clearCache: true });
    showToast('缓存已清除', 'success');
    setTimeout(() => {
      setDataSettings({ ...dataSettings, clearCache: false });
    }, 2000);
  };

  const handleExportData = () => {
    showToast('数据导出功能开发中', 'info');
  };

  const handleImportData = () => {
    showToast('数据导入功能开发中', 'info');
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        <div className="settings-header">
          <h2>系统设置</h2>
          <p className="settings-subtitle">个性化配置您的 PersonaScope 体验</p>
        </div>

        <div className="settings-grid">
          {/* 外观设置 */}
          <div className="settings-section">
            <div className="section-header">
              <SettingIcon type="appearance" />
              <h3>外观设置</h3>
            </div>
            <div className="setting-item">
              <label>主题模式</label>
              <div className="setting-control">
                <select className="input" value={theme} onChange={handleThemeChange}>
                  <option value="dark">深色模式</option>
                  <option value="light">浅色模式</option>
                </select>
              </div>
              <span className="setting-desc">选择您偏好的界面主题</span>
            </div>
            <div className="setting-item">
              <label>字体大小</label>
              <div className="setting-control">
                <select 
                  className="input" 
                  value={displaySettings.fontSize}
                  onChange={(e) => setDisplaySettings({ ...displaySettings, fontSize: e.target.value })}
                >
                  <option value="small">小</option>
                  <option value="medium">中</option>
                  <option value="large">大</option>
                </select>
              </div>
            </div>
            <div className="setting-item">
              <label>日期格式</label>
              <div className="setting-control">
                <select 
                  className="input" 
                  value={displaySettings.dateFormat}
                  onChange={(e) => setDisplaySettings({ ...displaySettings, dateFormat: e.target.value })}
                >
                  <option value="YYYY-MM-DD">2024-01-01</option>
                  <option value="MM/DD/YYYY">01/01/2024</option>
                  <option value="DD/MM/YYYY">01/01/2024</option>
                </select>
              </div>
            </div>
            <div className="setting-item">
              <label>时间格式</label>
              <div className="setting-control">
                <select 
                  className="input" 
                  value={displaySettings.timeFormat}
                  onChange={(e) => setDisplaySettings({ ...displaySettings, timeFormat: e.target.value })}
                >
                  <option value="24h">24小时制 (14:30)</option>
                  <option value="12h">12小时制 (2:30 PM)</option>
                </select>
              </div>
            </div>
          </div>

          {/* 通知设置 */}
          <div className="settings-section">
            <div className="section-header">
              <SettingIcon type="notification" />
              <h3>通知设置</h3>
            </div>
            <div className="setting-item">
              <label>
                <ToggleSwitch
                  checked={notificationSettings.pushEnabled}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, pushEnabled: e.target.checked })}
                />
                启用推送通知
              </label>
              <span className="setting-desc">接收系统推送消息</span>
            </div>
            <div className="setting-item">
              <label>
                <ToggleSwitch
                  checked={notificationSettings.soundEnabled}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, soundEnabled: e.target.checked })}
                />
                声音提醒
              </label>
            </div>
            <div className="setting-item">
              <label>
                <ToggleSwitch
                  checked={notificationSettings.vibrationEnabled}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, vibrationEnabled: e.target.checked })}
                />
                震动提醒
              </label>
            </div>
            <div className="setting-item">
              <label>
                <ToggleSwitch
                  checked={notificationSettings.quietHours}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, quietHours: e.target.checked })}
                />
                免打扰时段
              </label>
              {notificationSettings.quietHours && (
                <div className="setting-control setting-control-inline" style={{ marginTop: '8px' }}>
                  <input
                    type="time"
                    className="input"
                    value={notificationSettings.quietStart}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, quietStart: e.target.value })}
                  />
                  <span style={{ color: 'var(--muted)' }}>至</span>
                  <input
                    type="time"
                    className="input"
                    value={notificationSettings.quietEnd}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, quietEnd: e.target.value })}
                  />
                </div>
              )}
            </div>
          </div>

          {/* 邮件通知设置 */}
          <div className="settings-section">
            <div className="section-header">
              <SettingIcon type="email" />
              <h3>邮件通知设置</h3>
            </div>
            <div className="setting-item">
              <label>通知邮箱</label>
              <div className="setting-control setting-control-inline">
                <input
                  type="email"
                  className="input"
                  value={notificationEmail}
                  onChange={(e) => setNotificationEmail(e.target.value)}
                  placeholder="输入接收通知的邮箱地址"
                />
                <button className="btn small" onClick={handleEmailTest}>发送测试</button>
              </div>
            </div>
            <div className="setting-item">
              <label>
                <ToggleSwitch
                  checked={emailSettings.analysisComplete}
                  onChange={(e) => setEmailSettings({ ...emailSettings, analysisComplete: e.target.checked })}
                />
                分析完成通知
              </label>
              <span className="setting-desc">每次完成心理健康分析后发送邮件通知</span>
            </div>
            <div className="setting-item">
              <label>
                <ToggleSwitch
                  checked={emailSettings.weeklyReport}
                  onChange={(e) => setEmailSettings({ ...emailSettings, weeklyReport: e.target.checked })}
                />
                周度健康报告
              </label>
              <span className="setting-desc">每周自动生成并发送健康报告</span>
            </div>
            <div className="setting-item">
              <label>
                <ToggleSwitch
                  checked={emailSettings.appointmentReminder}
                  onChange={(e) => setEmailSettings({ ...emailSettings, appointmentReminder: e.target.checked })}
                />
                预约提醒
              </label>
              <span className="setting-desc">预约前24小时发送提醒邮件</span>
            </div>
            <div className="setting-item">
              <label>
                <ToggleSwitch
                  checked={emailSettings.medicationReminder}
                  onChange={(e) => setEmailSettings({ ...emailSettings, medicationReminder: e.target.checked })}
                />
                用药提醒
              </label>
              <span className="setting-desc">每天用药时间前30分钟发送提醒</span>
            </div>
            <div className="setting-item">
              <label>
                <ToggleSwitch
                  checked={emailSettings.healthAlert}
                  onChange={(e) => setEmailSettings({ ...emailSettings, healthAlert: e.target.checked })}
                />
                健康异常预警
              </label>
              <span className="setting-desc">检测到健康指标异常时发送预警邮件</span>
            </div>
          </div>

          {/* 视频设置 */}
          <div className="settings-section">
            <div className="section-header">
              <SettingIcon type="video" />
              <h3>视频设置</h3>
            </div>
            <div className="setting-item">
              <label>视频比例</label>
              <div className="setting-control">
                <select className="input" value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)}>
                  <option value="16:9">16:9 (宽屏)</option>
                  <option value="4:3">4:3 (标准)</option>
                  <option value="1:1">1:1 (方形)</option>
                </select>
              </div>
            </div>
            <div className="setting-item">
              <label>摄像头设备</label>
              <div className="setting-control">
                <select className="input" value={cameraDevice} onChange={(e) => setCameraDevice(e.target.value)}>
                  {devices.length === 0 && <option value="">未检测到摄像头</option>}
                  {devices.map((d) => (
                    <option key={d.deviceId} value={d.deviceId}>{d.label || `摄像头 ${d.deviceId.slice(0, 8)}`}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="setting-item">
              <label>视频质量</label>
              <div className="setting-control">
                <select className="input" defaultValue="high">
                  <option value="low">低 (节省流量)</option>
                  <option value="medium">中 (平衡)</option>
                  <option value="high">高 (最佳质量)</option>
                </select>
              </div>
            </div>
          </div>

          {/* 隐私与安全 */}
          <div className="settings-section">
            <div className="section-header">
              <SettingIcon type="security" />
              <h3>隐私与安全</h3>
            </div>
            <div className="setting-item">
              <label>
                <ToggleSwitch
                  checked={privacySettings.allowDataAnalysis}
                  onChange={(e) => setPrivacySettings({ ...privacySettings, allowDataAnalysis: e.target.checked })}
                />
                允许数据分析用于改进服务
              </label>
              <span className="setting-desc">匿名数据分析帮助我们优化平台体验</span>
            </div>
            <div className="setting-item">
              <label>
                <ToggleSwitch
                  checked={privacySettings.shareAnonymousData}
                  onChange={(e) => setPrivacySettings({ ...privacySettings, shareAnonymousData: e.target.checked })}
                />
                分享匿名数据用于研究
              </label>
              <span className="setting-desc">为心理健康研究贡献匿名数据</span>
            </div>
            <div className="setting-item">
              <label>
                <ToggleSwitch
                  checked={privacySettings.enableBiometric}
                  onChange={(e) => setPrivacySettings({ ...privacySettings, enableBiometric: e.target.checked })}
                />
                启用生物识别登录
              </label>
              <span className="setting-desc">使用指纹或面部识别快速登录</span>
            </div>
            <div className="setting-item">
              <label>
                <ToggleSwitch
                  checked={privacySettings.autoBackup}
                  onChange={(e) => setPrivacySettings({ ...privacySettings, autoBackup: e.target.checked })}
                />
                自动备份数据
              </label>
              <span className="setting-desc">定期备份您的健康数据到云端</span>
            </div>
          </div>

          {/* 数据管理 */}
          <div className="settings-section">
            <div className="section-header">
              <SettingIcon type="data" />
              <h3>数据管理</h3>
            </div>
            <div className="setting-item">
              <label>
                <ToggleSwitch
                  checked={dataSettings.autoSync}
                  onChange={(e) => setDataSettings({ ...dataSettings, autoSync: e.target.checked })}
                />
                自动同步
              </label>
              <span className="setting-desc">自动同步数据到云端</span>
            </div>
            <div className="setting-item">
              <label>同步频率</label>
              <div className="setting-control">
                <select 
                  className="input" 
                  value={dataSettings.syncInterval}
                  onChange={(e) => setDataSettings({ ...dataSettings, syncInterval: e.target.value })}
                >
                  <option value="realtime">实时</option>
                  <option value="5m">每5分钟</option>
                  <option value="15m">每15分钟</option>
                  <option value="1h">每小时</option>
                  <option value="6h">每6小时</option>
                </select>
              </div>
            </div>
            <div className="setting-item">
              <label>缓存大小</label>
              <div className="setting-control">
                <div className="info-display">{dataSettings.cacheSize}</div>
              </div>
            </div>
            <div className="setting-item">
              <label>操作</label>
              <div className="setting-control setting-control-inline">
                <button className="btn secondary" onClick={handleClearCache}>清除缓存</button>
                <button className="btn secondary" onClick={handleExportData}>导出数据</button>
                <button className="btn secondary" onClick={handleImportData}>导入数据</button>
              </div>
            </div>
          </div>

          {/* 语言设置 */}
          <div className="settings-section">
            <div className="section-header">
              <SettingIcon type="language" />
              <h3>语言与地区</h3>
            </div>
            <div className="setting-item">
              <label>界面语言</label>
              <div className="setting-control">
                <select 
                  className="input" 
                  value={displaySettings.language}
                  onChange={(e) => setDisplaySettings({ ...displaySettings, language: e.target.value })}
                >
                  <option value="zh-CN">简体中文</option>
                  <option value="zh-TW">繁体中文</option>
                  <option value="en-US">English</option>
                  <option value="ja-JP">日本語</option>
                </select>
              </div>
            </div>
            <div className="setting-item">
              <label>时区</label>
              <div className="setting-control">
                <select className="input" defaultValue="Asia/Shanghai">
                  <option value="Asia/Shanghai">中国标准时间 (UTC+8)</option>
                  <option value="America/New_York">美国东部时间 (UTC-5)</option>
                  <option value="Europe/London">英国标准时间 (UTC+0)</option>
                  <option value="Asia/Tokyo">日本标准时间 (UTC+9)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="settings-actions">
          <button className="btn secondary" onClick={() => window.location.reload()}>重置默认</button>
          <button className="btn primary" onClick={handleSave}>保存设置</button>
        </div>
      </div>
    </div>
  );
}

