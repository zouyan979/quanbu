// 健康小助手 - 主应用逻辑

// 状态管理
const state = {
  reminders: {
    water: true,
    move: true,
    eyes: true,
    sleep: true,
  },
  dndStart: '23:00',
  dndEnd: '07:00',
  healthData: {
    steps: 0,
    calories: 0,
    distance: 0,
    activeMinutes: 0,
  },
  streak: 3,
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  setupEventListeners();
  checkNotificationPermission();
  startReminders();
  updateHealthData();
});

// 加载设置
function loadSettings() {
  const saved = localStorage.getItem('health-reminder-settings');
  if (saved) {
    const settings = JSON.parse(saved);
    state.reminders = settings.reminders || state.reminders;
    state.dndStart = settings.dndStart || state.dndStart;
    state.dndEnd = settings.dndEnd || state.dndEnd;
    state.streak = settings.streak || 3;
  }
  
  // 恢复开关状态
  document.getElementById('toggle-water').checked = state.reminders.water;
  document.getElementById('toggle-move').checked = state.reminders.move;
  document.getElementById('toggle-eyes').checked = state.reminders.eyes;
  document.getElementById('toggle-sleep').checked = state.reminders.sleep;
  document.getElementById('dnd-start').value = state.dndStart;
  document.getElementById('dnd-end').value = state.dndEnd;
  document.getElementById('streak-days').textContent = state.streak;
}

// 保存设置
function saveSettings() {
  localStorage.setItem('health-reminder-settings', JSON.stringify({
    reminders: state.reminders,
    dndStart: state.dndStart,
    dndEnd: state.dndEnd,
    streak: state.streak,
  }));
}

// 设置事件监听
function setupEventListeners() {
  // 通知权限
  document.getElementById('enable-notification').addEventListener('click', requestNotificationPermission);
  
  // 提醒开关
  document.getElementById('toggle-water').addEventListener('change', (e) => {
    state.reminders.water = e.target.checked;
    saveSettings();
  });
  document.getElementById('toggle-move').addEventListener('change', (e) => {
    state.reminders.move = e.target.checked;
    saveSettings();
  });
  document.getElementById('toggle-eyes').addEventListener('change', (e) => {
    state.reminders.eyes = e.target.checked;
    saveSettings();
  });
  document.getElementById('toggle-sleep').addEventListener('change', (e) => {
    state.reminders.sleep = e.target.checked;
    saveSettings();
  });
  
  // 免打扰时间
  document.getElementById('dnd-start').addEventListener('change', (e) => {
    state.dndStart = e.target.value;
    saveSettings();
  });
  document.getElementById('dnd-end').addEventListener('change', (e) => {
    state.dndEnd = e.target.value;
    saveSettings();
  });
  
  // 同步健康数据
  document.getElementById('sync-health').addEventListener('click', syncHealthData);
}

// 检查通知权限
function checkNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'granted') {
    document.getElementById('notification-banner').classList.add('hidden');
  }
}

// 请求通知权限
async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    showToast('❌ 您的浏览器不支持通知', 'warning');
    return;
  }
  
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    document.getElementById('notification-banner').classList.add('hidden');
    showToast('✅ 通知已开启', 'success');
    
    // 发送测试通知
    new Notification('健康小助手', {
      body: '通知已开启！我会按时提醒你保持健康 💪',
      icon: '/icon-192.png',
    });
  } else {
    showToast('❌ 通知权限被拒绝', 'warning');
  }
}

// 发送通知
function sendNotification(title, body) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body: body,
      icon: '/icon-192.png',
      tag: 'health-reminder',
    });
  }
}

// 检查是否在免打扰时段
function isDndMode() {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  const [dndStartH, dndStartM] = state.dndStart.split(':').map(Number);
  const [dndEndH, dndEndM] = state.dndEnd.split(':').map(Number);
  
  const startTime = dndStartH * 60 + dndStartM;
  const endTime = dndEndH * 60 + dndEndM;
  
  if (startTime > endTime) {
    // 跨天情况（如 23:00 - 07:00）
    return currentTime >= startTime || currentTime < endTime;
  } else {
    return currentTime >= startTime && currentTime < endTime;
  }
}

// 启动提醒
function startReminders() {
  // 喝水提醒 - 每 2 小时
  if (state.reminders.water) {
    setInterval(() => {
      if (!isDndMode()) {
        sendNotification('💧 喝水时间到！', '起来喝杯水吧，保持身体水分充足～');
        showToast('💧 喝水时间到！', 'success');
      }
    }, 2 * 60 * 60 * 1000);
  }
  
  // 起身活动 - 每 1 小时
  if (state.reminders.move) {
    setInterval(() => {
      if (!isDndMode()) {
        sendNotification('🧘 起来活动一下！', '久坐伤身，站起来走走，伸展一下身体～');
        showToast('🧘 起来活动一下！', 'success');
      }
    }, 60 * 60 * 1000);
  }
  
  // 眼睛休息 - 每 30 分钟
  if (state.reminders.eyes) {
    setInterval(() => {
      if (!isDndMode()) {
        sendNotification('👁️ 让眼睛休息一下', '看看远处，放松眼部肌肉，20-20-20 法则：每 20 分钟看 20 英尺外 20 秒');
        showToast('👁️ 让眼睛休息一下', 'success');
      }
    }, 30 * 60 * 1000);
  }
  
  // 睡觉提醒 - 晚上 11 点
  if (state.reminders.sleep) {
    const sleepTime = new Date();
    sleepTime.setHours(23, 0, 0, 0);
    const now = new Date();
    let delay = sleepTime - now;
    if (delay < 0) delay += 24 * 60 * 60 * 1000;
    
    setTimeout(() => {
      sendNotification('😴 该睡觉啦！', '早睡早起身体好，明天继续加油！');
      showToast('😴 该睡觉啦！', 'success');
      
      // 每天重复
      setInterval(() => {
        if (!isDndMode()) {
          sendNotification('😴 该睡觉啦！', '早睡早起身体好，明天继续加油！');
        }
      }, 24 * 60 * 60 * 1000);
    }, delay);
  }
}

// 更新健康数据（模拟）
function updateHealthData() {
  // 实际项目中这里会调用 Apple HealthKit API
  // 现在用模拟数据
  state.healthData = {
    steps: Math.floor(Math.random() * 5000) + 3000,
    calories: Math.floor(Math.random() * 300) + 200,
    distance: (Math.random() * 5 + 2).toFixed(1),
    activeMinutes: Math.floor(Math.random() * 60) + 30,
  };
  
  renderHealthData();
}

// 渲染健康数据
function renderHealthData() {
  document.getElementById('steps-count').textContent = state.healthData.steps.toLocaleString();
  document.getElementById('calories-count').textContent = state.healthData.calories + ' kcal';
  document.getElementById('distance-count').textContent = state.healthData.distance + ' km';
  document.getElementById('active-minutes').textContent = state.healthData.activeMinutes + ' min';
}

// 同步健康数据
async function syncHealthData() {
  const btn = document.getElementById('sync-health');
  btn.textContent = '🔄 同步中...';
  btn.disabled = true;
  
  // 模拟同步延迟
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // 实际项目中这里会调用 Apple HealthKit Web API
  updateHealthData();
  
  btn.textContent = '✅ 同步成功';
  setTimeout(() => {
    btn.textContent = '🔄 同步健康数据';
    btn.disabled = false;
  }, 2000);
  
  showToast('✅ 健康数据已更新', 'success');
}

// 显示提示
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `notification-toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// 注册 Service Worker（PWA 离线支持）
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(() => console.log('Service Worker 已注册'))
    .catch(err => console.error('Service Worker 注册失败:', err));
}
