# 健康小助手 - Health Reminder App 🏃

一个现代化的健康提醒 PWA 应用，帮助你养成健康的生活习惯。

**🌐 在线访问：** https://zouyan979.github.io/quanbu/

---

## ✨ 功能特性

### 📱 用户系统
- 🔐 邮箱注册/登录
- 👤 个人账号管理
- 💾 数据本地存储
- 🔄 退出登录

### ⏰ 智能提醒
- 💧 **喝水提醒** - 每 2 小时提醒你喝水
- 🧘 **起身活动** - 每 1 小时提醒活动身体
- 👁️ **眼睛休息** - 每 30 分钟提醒看远处
- 😴 **睡觉提醒** - 晚上 11 点提醒睡觉
- 🌙 **免打扰时段** - 设置休息时间，避免打扰

### 📊 健康数据
- 🚶 步数统计
- 🔥 卡路里消耗
- 📏 运动距离
- ⏱️ 活动时长
- 🎯 目标进度环
- 📈 周统计图表

### 🎨 界面设计
- 现代渐变风格
- 流畅动画效果
- 响应式布局
- 暗黑模式支持（即将推出）

---

## 🚀 快速开始

### 在线使用（推荐）
直接访问：**https://zouyan979.github.io/quanbu/**

### 本地运行

#### 方法 1：直接打开
```bash
# 双击 index.html 文件即可
```

#### 方法 2：本地服务器
```bash
cd health-reminder-app

# Python
python -m http.server 8080

# Node.js
npx serve .

# 访问 http://localhost:8080
```

---

## 📱 在 iPhone 上使用

1. **用 Safari 打开** https://zouyan979.github.io/quanbu/
2. **点击底部「分享」按钮**
3. **选择「添加到主屏幕」**
4. **点击「添加」**

现在桌面会出现应用图标，支持：
- ✅ 全屏显示
- ✅ 离线使用
- ✅ 通知提醒

---

## 🛠️ 技术栈

- **前端**：HTML5 + CSS3 + JavaScript (ES6+)
- **PWA**：Service Worker + Manifest
- **存储**：LocalStorage
- **字体**：Inter (Google Fonts)
- **部署**：GitHub Pages

---

## 📁 文件结构

```
health-reminder-app/
├── index.html          # 主页面（登录 + 应用）
├── style.css           # 样式文件
├── app.js              # 应用逻辑
├── sw.js               # Service Worker
├── manifest.json       # PWA 配置
├── README.md           # 说明文档
└── start.bat           # Windows 启动脚本
```

---

## 🔐 账号系统说明

### 数据存储
- 账号信息存储在浏览器 LocalStorage
- 密码未加密（演示用途，生产环境需加密）
- 数据仅保存在本地设备

### 创建账号
1. 点击「创建新账号」
2. 输入昵称、邮箱、密码
3. 完成注册自动登录

### 登录
1. 输入注册时的邮箱和密码
2. 点击登录即可

---

## 🎨 自定义

### 修改主题色
编辑 `style.css` 中的 CSS 变量：
```css
:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### 修改提醒间隔
编辑 `app.js` 中的 `startReminders()` 函数。

---

## 📋 开发计划

### 已完成 ✅
- [x] 用户登录/注册系统
- [x] 现代化 UI 设计
- [x] 健康数据展示
- [x] 目标进度环
- [x] 周统计图表
- [x] PWA 离线支持
- [x] 通知提醒

### 进行中 🚧
- [ ] Apple HealthKit 接入
- [ ] 数据云同步
- [ ] 暗黑模式

### 计划中 📅
- [ ] 体重记录
- [ ] 运动计划
- [ ] 成就系统
- [ ] 数据导出
- [ ] 多语言支持

---

## 🔒 安全提示

### 当前版本
- ⚠️ 密码未加密存储（仅演示）
- ⚠️ 数据本地存储（清除缓存会丢失）
- ⚠️ 无后端验证

### 生产环境建议
- ✅ 使用 HTTPS
- ✅ 密码加密（bcrypt）
- ✅ 后端 API + 数据库
- ✅ JWT 认证
- ✅ 数据备份

---

## 📝 注意事项

- PWA 通知需要 HTTPS 环境（localhost 除外）
- iOS 上 PWA 通知需要 iOS 16.4+
- Apple HealthKit Web API 需要 iOS 16+
- 建议使用最新版 Safari/Chrome

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 许可证

MIT License

---

## 💖 致谢

Made with ❤️ for your health

**版本：** v1.1.0  
**最后更新：** 2026-03-01
