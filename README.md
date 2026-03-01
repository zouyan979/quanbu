# 健康小助手 - Health Reminder App 🏃

一个简约的健康提醒 PWA 应用，帮助你养成健康的生活习惯。

## ✨ 功能特性

- 💧 **喝水提醒** - 每 2 小时提醒你喝水
- 🧘 **起身活动** - 每 1 小时提醒活动身体
- 👁️ **眼睛休息** - 每 30 分钟提醒看远处（20-20-20 法则）
- 😴 **睡觉提醒** - 晚上 11 点提醒睡觉
- 🌙 **免打扰时段** - 设置休息时间，避免打扰
- 📊 **健康数据** - 显示步数、卡路里等数据（需接入 Apple Health）
- 📈 **统计追踪** - 记录连续达标天数

## 🚀 快速开始

### 方法 1：本地运行（开发测试）

1. **用浏览器打开**
   ```
   直接双击打开 index.html 文件
   ```

2. **或使用本地服务器**（推荐，支持完整 PWA 功能）
   ```bash
   # 如果有 Python
   cd health-reminder-app
   python -m http.server 8080
   
   # 或有 Node.js
   npx serve .
   ```
   
   然后访问 http://localhost:8080

### 方法 2：部署到网络（推荐）

#### GitHub Pages（免费）
1. 创建 GitHub 仓库
2. 上传所有文件
3. 启用 GitHub Pages
4. 访问生成的链接

#### Vercel（免费，更简单）
1. 访问 https://vercel.com
2. 导入 GitHub 仓库或直接上传文件
3. 自动部署，获得 HTTPS 链接

## 📱 在 iPhone 上使用

1. **用 Safari 打开应用链接**
2. **点击底部「分享」按钮**
3. **选择「添加到主屏幕」**
4. **命名后点击「添加」**

现在桌面会出现应用图标，点开就是全屏体验！

## 🔔 通知权限

首次使用会请求通知权限，点击「允许」以接收健康提醒。

如果错过了，可以在：
- iPhone 设置 → Safari → 通知 → 允许

## 🍎 接入 Apple Health（下一步）

目前健康数据是模拟的，后续可以接入真实的 Apple Health 数据：

```javascript
// 需要 iOS 16+ 和 Safari
if ('HealthKit' in window) {
  // 请求健康数据权限
  // 读取步数、运动等数据
}
```

## 📁 文件结构

```
health-reminder-app/
├── index.html      # 主页面
├── style.css       # 样式
├── app.js          # 应用逻辑
├── sw.js           # Service Worker（离线支持）
├── manifest.json   # PWA 配置
├── icon-192.png    # 应用图标
└── icon-512.png    # 应用图标
```

## 🎨 自定义

### 修改提醒间隔
编辑 `app.js` 中的 `startReminders()` 函数：
```javascript
// 喝水提醒间隔（毫秒）
2 * 60 * 60 * 1000  // 2 小时

// 起身活动间隔
60 * 60 * 1000  // 1 小时

// 眼睛休息间隔
30 * 60 * 1000  // 30 分钟
```

### 修改默认睡觉时间
编辑 `app.js` 中的睡觉提醒部分：
```javascript
sleepTime.setHours(23, 0, 0, 0);  // 改为你的睡觉时间
```

## 🛠️ 下一步开发计划

1. ✅ 基础提醒功能
2. ✅ PWA 离线支持
3. ⏳ 接入 Apple HealthKit
4. ⏳ 数据可视化图表
5. ⏳ 成就系统
6. ⏳ iCloud 数据同步

## 📝 注意事项

- PWA 通知需要 HTTPS 环境（本地 localhost 除外）
- iOS 上 PWA 通知需要 iOS 16.4+
- Apple HealthKit Web API 需要 iOS 16+

## 🎉 开始使用吧！

选择一个部署方式，马上开始你的健康管理之旅！

---

Made with ❤️ for your health
