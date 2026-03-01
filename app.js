// 健康小助手 - 主应用逻辑 (v1.1.0)
// 包含用户登录系统

// ===== 状态管理 =====
const state = {
  user: null,
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

// ===== 用户系统 =====
const UserSystem = {
  // 模拟用户数据库（实际项目应使用后端）
  users: [],
  
  // 初始化
  init() {
    const savedUsers = localStorage.getItem('health-app-users');
    if (savedUsers) {
      this.users = JSON.parse(savedUsers);
    }
    
    // 检查当前登录状态
    const currentUser = localStorage.getItem('health-app-current-user');
    if (currentUser) {
      state.user = JSON.parse(currentUser);
      this.showApp();
    } else {
      this.showLogin();
    }
  },
  
  // 保存用户数据
  saveUsers() {
    localStorage.setItem('health-app-users', JSON.stringify(this.users));
  },
  
  // 注册
  register(name, email, password) {
    // 检查邮箱是否已存在
    const existing = this.users.find(u => u.email === email);
    if (existing) {
      throw new Error('该邮箱已被注册');
    }
    
    const user = {
      id: Date.now().toString(),
      name,
      email,
      password, // 实际项目应该加密
      createdAt: new Date().toISOString(),
      healthData: {
        steps: 0,
        calories: 0,
        distance: 0,
        activeMinutes: 0,
      },
      streak: 0,
    };
    
    this.users.push(user);
    this.saveUsers();
    return user;
  },
  
  // 登录
  login(email, password) {
    const user = this.users.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('邮箱或密码错误');
    }
    return user;
  },
  
  // 设置当前用户
  setCurrentUser(user) {
    state.user = user;
    localStorage.setItem('health-app-current-user', JSON.stringify(user));
  },
  
  // 退出登录
  logout() {
    state.user = null;
    localStorage.removeItem('health-app-current-user');
    this.showLogin();
  },
  
  // 更新用户健康数据
  updateHealthData(data) {
    if (!state.user) return;
    
    const userIndex = this.users.findIndex(u => u.id === state.user.id);
    if (userIndex !== -1) {
      this.users[userIndex].healthData = { ...data };
      this.saveUsers();
      state.healthData = data;
    }
  },
  
  // 显示登录页面
  showLogin() {
    document.getElementById('login-page').classList.remove('hidden');
    document.getElementById('register-page').classList.add('hidden');
    document.getElementById('app-page').classList.add('hidden');
  },
  
  // 显示注册页面
  showRegister() {
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('register-page').classList.remove('hidden');
    document.getElementById('app-page').classList.add('hidden');
  },
  
  // 显示应用页面
  showApp() {
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('register-page').classList.add('hidden');
    document.getElementById('app-page').classList.remove('hidden');
    
    // 更新用户信息
    if (state.user) {
      document.getElementById('user-name').textContent = state.user.name;
      document.getElementById('user-avatar').textContent = state.user.name.charAt(0).toUpperCase();
      
      // 设置问候语
      const hour = new Date().getHours();
      let greeting = '晚上好';
      if (hour < 6) greeting = '夜深了';
      else if (hour < 12) greeting = '早上好';
      else if (hour < 18) greeting = '下午好';
      
      document.querySelector('.greeting').textContent = greeting;
    }
    
    // 加载用户数据
    this.loadUserData();
  },
  
  // 加载用户数据
  loadUserData() {
    if (state.user) {
      const userIndex = this.users.findIndex(u => u.id === state.user.id);
      if (userIndex !== -1) {
        const userData = this.users[userIndex];
        state.healthData = userData.healthData || state.healthData;
        state.streak = userData.streak || 0;
        renderHealthData();
        updateProgress();
      }
    }
  },
};

// ===== 页面切换 =====
document.getElementById('show-register')?.addEventListener('click', () => {
  UserSystem.showRegister();
});

document.getElementById('show-login')?.addEventListener('click', () => {
  UserSystem.showLogin();
});

document.getElementById('logout-btn')?.addEventListener('click', () => {
  if (confirm('确定要退出登录吗？')) {
    UserSystem.logout();
  }
});

// ===== 登录表单 =====
document.getElementById('login-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const btn = e.target.querySelector('button[type="submit"]');
  
  // 显示加载状态
  btn.disabled = true;
  btn.querySelector('.btn-text').classList.add('hidden');
  btn.querySelector('.btn-loader').classList.remove('hidden');
  
  try {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = UserSystem.login(email, password);
    UserSystem.setCurrentUser(user);
    UserSystem.showApp();
    
    showToast('✅ 登录成功', 'success');
  } catch (error) {
    showToast('❌ ' + error.message, 'error');
  } finally {
    btn.disabled = false;
    btn.querySelector('.btn-text').classList.remove('hidden');
    btn.querySelector('.btn-loader').classList.add('hidden');
  }
});

// ===== 注册表单 =====
document.getElementById('register-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const confirm = document.getElementById('register-confirm').value;
  const btn = e.target.querySelector('button[type="submit"]');
  
  // 验证
  if (password !== confirm) {
    showToast('❌ 两次输入的密码不一致', 'error');
    return;
  }
  
  if (password.length < 6) {
    showToast('❌ 密码至少 6 位', 'error');
    return;
  }
  
  // 显示加载状态
  btn.disabled = true;
  btn.querySelector('.btn-text').classList.add('hidden');
  btn.querySelector('.btn-loader').classList.remove('hidden');
  
  try {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = UserSystem.register(name, email, password);
    UserSystem.setCurrentUser(user);
    UserSystem.showApp();
    
    showToast('✅ 账号创建成功', 'success');
  } catch (error) {
    showToast('❌ ' + error.message, 'error');
  } finally {
    btn.disabled = false;
    btn.querySelector('.btn-text').classList.remove('hidden');
    btn.querySelector('.btn-loader').classList.add('hidden');
  }
});

// ===== 应用初始化 =====
document.addEventListener('DOMContentLoaded', () => {
  UserSystem.init();
  setupEventListeners();
  checkNotificationPermission();
  startReminders();
  updateDate();
});

// ===== 设置事件监听 =====
function setupEventListeners() {
  // 通知权限
  document.getElementById('enable-notification')?.addEventListener('click', requestNotificationPermission);
  
  // 提醒开关
  document.getElementById('toggle-water')?.addEventListener('change', (e) => {
    state.reminders.water = e.target.checked;
    updateActiveRemindersCount();
    saveSettings();
  });
  document.getElementById('toggle-move')?.addEventListener('change', (e) => {
    state.reminders.move = e.target.checked;
    updateActiveRemindersCount();
    saveSettings();
  });
  document.getElementById('toggle-eyes')?.addEventListener('change', (e) => {
    state.reminders.eyes = e.target.checked;
    updateActiveRemindersCount();
    saveSettings();
  });
  document.getElementById('toggle-sleep')?.addEventListener('change', (e) => {
    state.reminders.sleep = e.target.checked;
    updateActiveRemindersCount();
    saveSettings();
  });
  
  // 免打扰时间
  document.getElementById('dnd-start')?.addEventListener('change', (e) => {
    state.dndStart = e.target.value;
    saveSettings();
  });
  document.getElementById('dnd-end')?.addEventListener('change', (e) => {
    state.dndEnd = e.target.value;
    saveSettings();
  });
  
  // 同步健康数据
  document.getElementById('sync-health')?.addEventListener('click', syncHealthData);
  
  // 统计筛选
  document.getElementById('stats-filter')?.addEventListener('change', updateStatsChart);
}

// ===== 更新日期 =====
function updateDate() {
  const now = new Date();
  const options = { month: 'long', day: 'numeric', weekday: 'long' };
  document.getElementById('current-date').textContent = now.toLocaleDateString('zh-CN', options);
}

// ===== 加载设置 =====
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
  const waterToggle = document.getElementById('toggle-water');
  const moveToggle = document.getElementById('toggle-move');
  const eyesToggle = document.getElementById('toggle-eyes');
  const sleepToggle = document.getElementById('toggle-sleep');
  const dndStart = document.getElementById('dnd-start');
  const dndEnd = document.getElementById('dnd-end');
  
  if (waterToggle) waterToggle.checked = state.reminders.water;
  if (moveToggle) moveToggle.checked = state.reminders.move;
  if (eyesToggle) eyesToggle.checked = state.reminders.eyes;
  if (sleepToggle) sleepToggle.checked = state.reminders.sleep;
  if (dndStart) dndStart.value = state.dndStart;
  if (dndEnd) dndEnd.value = state.dndEnd;
  
  updateActiveRemindersCount();
}

// ===== 保存设置 =====
function saveSettings() {
  localStorage.setItem('health-reminder-settings', JSON.stringify({
    reminders: state.reminders,
    dndStart: state.dndStart,
    dndEnd: state.dndEnd,
    streak: state.streak,
  }));
}

// ===== 更新活跃提醒数量 =====
function updateActiveRemindersCount() {
  const count = Object.values(state.reminders).filter(v => v).length;
  const badge = document.getElementById('active-reminders-count');
  if (badge) {
    badge.textContent = count + '个开启';
  }
}

// ===== 检查通知权限 =====
function checkNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'granted') {
    const banner = document.getElementById('notification-banner');
    if (banner) banner.classList.add('hidden');
  }
}

// ===== 请求通知权限 =====
async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    showToast('❌ 您的浏览器不支持通知', 'warning');
    return;
  }
  
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    const banner = document.getElementById('notification-banner');
    if (banner) banner.classList.add('hidden');
    showToast('✅ 通知已开启', 'success');
    
    new Notification('健康小助手', {
      body: '通知已开启！我会按时提醒你保持健康 💪',
      icon: '/icon-192.png',
    });
  } else {
    showToast('❌ 通知权限被拒绝', 'warning');
  }
}

// ===== 发送通知 =====
function sendNotification(title, body) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body: body,
      icon: '/icon-192.png',
      tag: 'health-reminder',
    });
  }
}

// ===== 检查免打扰模式 =====
function isDndMode() {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  const [dndStartH, dndStartM] = state.dndStart.split(':').map(Number);
  const [dndEndH, dndEndM] = state.dndEnd.split(':').map(Number);
  
  const startTime = dndStartH * 60 + dndStartM;
  const endTime = dndEndH * 60 + dndEndM;
  
  if (startTime > endTime) {
    return currentTime >= startTime || currentTime < endTime;
  } else {
    return currentTime >= startTime && currentTime < endTime;
  }
}

// ===== 启动提醒 =====
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
        sendNotification('👁️ 让眼睛休息一下', '看看远处，放松眼部肌肉～');
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
      if (!isDndMode()) {
        sendNotification('😴 该睡觉啦！', '早睡早起身体好，明天继续加油！');
        showToast('😴 该睡觉啦！', 'success');
      }
      setInterval(() => {
        if (!isDndMode()) {
          sendNotification('😴 该睡觉啦！', '早睡早起身体好，明天继续加油！');
        }
      }, 24 * 60 * 60 * 1000);
    }, delay);
  }
}

// ===== 更新健康数据 =====
function updateHealthData() {
  // 模拟数据（实际项目调用 Apple HealthKit API）
  state.healthData = {
    steps: Math.floor(Math.random() * 5000) + 3000,
    calories: Math.floor(Math.random() * 300) + 200,
    distance: (Math.random() * 5 + 2).toFixed(1),
    activeMinutes: Math.floor(Math.random() * 60) + 30,
  };
  
  // 保存到用户数据
  UserSystem.updateHealthData(state.healthData);
  
  renderHealthData();
  updateProgress();
}

// ===== 渲染健康数据 =====
function renderHealthData() {
  const stepsEl = document.getElementById('steps-count');
  const caloriesEl = document.getElementById('calories-count');
  const distanceEl = document.getElementById('distance-count');
  const activeEl = document.getElementById('active-minutes');
  
  if (stepsEl) stepsEl.textContent = state.healthData.steps.toLocaleString();
  if (caloriesEl) caloriesEl.textContent = state.healthData.calories + ' kcal';
  if (distanceEl) distanceEl.textContent = state.healthData.distance;
  if (activeEl) activeEl.textContent = state.healthData.activeMinutes + ' min';
}

// ===== 更新进度环 =====
function updateProgress() {
  const stepsGoal = 8000;
  const caloriesGoal = 500;
  
  const stepsPercent = Math.min(100, Math.round((state.healthData.steps / stepsGoal) * 100));
  const caloriesPercent = Math.min(100, Math.round((state.healthData.calories / caloriesGoal) * 100));
  
  const stepsPercentEl = document.getElementById('steps-percent');
  const caloriesPercentEl = document.getElementById('calories-percent');
  const stepsProgress = document.getElementById('steps-progress');
  const caloriesProgress = document.getElementById('calories-progress');
  
  if (stepsPercentEl) stepsPercentEl.textContent = stepsPercent + '%';
  if (caloriesPercentEl) caloriesPercentEl.textContent = caloriesPercent + '%';
  
  // 更新 SVG 圆环
  const circumference = 2 * Math.PI * 52;
  if (stepsProgress) {
    stepsProgress.style.strokeDasharray = circumference;
    stepsProgress.style.strokeDashoffset = circumference - (stepsPercent / 100) * circumference;
  }
  if (caloriesProgress) {
    caloriesProgress.style.strokeDasharray = circumference;
    caloriesProgress.style.strokeDashoffset = circumference - (caloriesPercent / 100) * circumference;
  }
}

// ===== 同步健康数据 =====
async function syncHealthData() {
  const btn = document.getElementById('sync-health');
  if (btn) {
    btn.disabled = true;
    btn.style.transform = 'rotate(360deg)';
    btn.style.transition = 'transform 1s ease';
  }
  
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  updateHealthData();
  
  if (btn) {
    btn.disabled = false;
    btn.style.transform = 'rotate(0deg)';
  }
  
  showToast('✅ 健康数据已更新', 'success');
}

// ===== 更新统计图表 =====
function updateStatsChart() {
  const filter = document.getElementById('stats-filter')?.value;
  // 实际项目根据筛选类型更新图表
  console.log('更新统计图表:', filter);
}

// ===== Toast 通知 =====
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icon = type === 'success' ? '✅' : type === 'warning' ? '⚠️' : '❌';
  
  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-message">${message}</span>
  `;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideDown 0.3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ===== Service Worker 注册 =====
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(() => console.log('Service Worker 已注册'))
    .catch(err => console.error('Service Worker 注册失败:', err));
}
