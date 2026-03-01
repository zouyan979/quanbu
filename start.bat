@echo off
echo ========================================
echo   健康小助手 - 本地开发服务器
echo ========================================
echo.

REM 检查 Python 是否安装
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo [OK] 检测到 Python
    echo.
    echo 正在启动服务器...
    echo.
    echo 访问地址：http://localhost:8080
    echo.
    echo 按 Ctrl+C 停止服务器
    echo.
    cd /d "%~dp0"
    python -m http.server 8080
    goto :end
)

REM 检查 Node.js 是否安装
node --version >nul 2>&1
if %errorlevel% == 0 (
    echo [OK] 检测到 Node.js
    echo.
    echo 正在安装 serve 工具...
    npm install -g serve >nul 2>&1
    echo.
    echo 正在启动服务器...
    echo.
    echo 访问地址：http://localhost:3000
    echo.
    echo 按 Ctrl+C 停止服务器
    echo.
    cd /d "%~dp0"
    serve .
    goto :end
)

echo [错误] 未检测到 Python 或 Node.js
echo.
echo 请安装以下任一工具来运行本地服务器：
echo   1. Python: https://www.python.org/downloads/
echo   2. Node.js: https://nodejs.org/
echo.
echo 或者直接用浏览器打开 index.html 文件查看效果
echo.
pause

:end
