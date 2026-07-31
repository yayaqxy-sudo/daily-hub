# 部署到 GitHub Pages 指南

## 前置条件
- 你需要有一个 GitHub 账号
- 在你的电脑上安装 Git（如果没有，去 https://git-scm.com 下载）

---

## 第一步：在 GitHub 上创建新仓库

1. 打开 https://github.com/new
2. Repository name 填入：`daily-hub`
3. 选择 **Public**（公开，GitHub Pages 免费版需要公开仓库）
4. 不要勾选 "Add a README file"
5. 点击 **Create repository**

## 第二步：把项目推送到 GitHub

打开终端（Windows 用 Git Bash），依次执行以下命令：

```bash
# 进入项目目录
cd "C:/Users/fanta/WorkBuddy/2026-07-31-13-30-41/daily-hub"

# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 提交
git commit -m "个人工作台 PWA 初始版本"

# 把下面的 YOUR_USERNAME 替换成你的 GitHub 用户名
git remote add origin https://github.com/YOUR_USERNAME/daily-hub.git

# 推送
git branch -M main
git push -u origin main
```

## 第三步：开启 GitHub Pages

1. 打开你的仓库页面：`https://github.com/YOUR_USERNAME/daily-hub`
2. 点击 **Settings**（设置）
3. 在左侧菜单找到 **Pages**
4. 在 **Source** 下拉菜单选择 **Deploy from a branch**
5. 在 **Branch** 下选择 **main**，文件夹选 **/ (root)**
6. 点击 **Save**

等待 1-2 分钟后，你的应用就会上线到：

```
https://YOUR_USERNAME.github.io/daily-hub/
```

## 第四步：在 iPhone 上安装为 App

1. 用 iPhone 的 **Safari** 打开上面的链接
2. 点击底部「分享」按钮
3. 选择「添加到主屏幕」
4. 它就会像原生 App 一样出现在桌面上

---

## 后续更新代码

每次修改代码后，只需要：

```bash
cd "C:/Users/fanta/WorkBuddy/2026-07-31-13-30-41/daily-hub"
git add .
git commit -m "更新描述"
git push
```

GitHub Pages 会在 1-2 分钟内自动更新。

---

## 注意事项

- GitHub Pages 的链接是永久免费的，只要你不删除仓库
- PWA 支持离线使用，第一次加载后即使断网也能使用大部分功能
- 数据存储在 localStorage 中，换手机前记得用「导出数据」功能备份
- 如果上传照片较多，localStorage 可能有容量限制（约 5-10MB），建议定期导出清理
