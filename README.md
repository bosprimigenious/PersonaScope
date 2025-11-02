# PersonaScope - 多模态AI心理健康评估平台

基于 React + Vite + MindSpore 构建的智能心理健康评估平台，融合视觉、语音、文本多维度分析，提供早期筛查、辅助诊断和治疗监测功能。

## 功能特性

- 🎯 **多模态AI分析** - 基于MindSpore的多模态AI，融合视觉、语音、文本分析
- 📊 **健康看板** - 实时监测心率、血压、情绪等健康指标
- 🏥 **抑郁症筛查** - PHQ-9标准量表，专业评估抑郁风险
- 📝 **MBTI测试** - 丰富的题库，支持选择题和AI问答
- 💊 **用药提醒** - 智能用药提醒功能
- 📅 **预约咨询** - 在线预约医生，方便快捷
- 📈 **病理分析** - 基于症状评估，提供个性化治疗建议
- 📋 **健康报告** - 生成完整的心理健康综合报告
- 🤝 **合作伙伴** - 展示合作医院和院校

## 技术栈

- **前端框架**: React 19.2.0
- **构建工具**: Vite 7.1.12
- **路由**: React Router DOM 7.9.5
- **图表**: ECharts 5.6.0
- **AI框架**: MindSpore (后端)

## 项目结构

```
src/
├── components/          # 可复用组件
│   ├── StatCard.jsx    # 统计卡片
│   ├── ActionCard.jsx  # 功能卡片
│   ├── FeatureCard.jsx # 特性卡片
│   ├── SectionHeader.jsx # 页面头部
│   ├── Badge.jsx       # 徽章
│   ├── ActivityItem.jsx # 活动项
│   ├── SummaryCard.jsx # 摘要卡片
│   ├── RiskBadge.jsx   # 风险标签
│   └── RecommendationsList.jsx # 建议列表
├── pages/              # 页面组件
│   ├── HomePage.jsx   # 首页
│   ├── analysis/      # 实时分析
│   ├── screening/     # 抑郁筛查
│   ├── pathology/     # 病理分析
│   ├── report/        # 健康报告
│   └── ...
├── contexts/          # Context上下文
├── theme.jsx          # 主题管理
└── App.jsx            # 主应用组件
```

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 设计特色

- 🎨 **科幻+清新** 的设计风格，让人信任
- 🌓 **深色/浅色** 主题切换
- ✨ **流畅动画** 和过渡效果
- 📱 **响应式设计**，适配各种设备
- 🎯 **组件化架构**，易于维护和扩展

## 组件化优势

- **代码复用**: 减少重复代码，提高开发效率
- **一致性**: UI样式统一，用户体验一致
- **可维护性**: 组件化便于维护和更新
- **可扩展性**: 新页面可直接使用现有组件

## License

MIT

