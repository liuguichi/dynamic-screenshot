# dynamic-screenshot
# 自动生成屏幕截图

# centos 环境设置
  1、curl -sL https://rpm.nodesource.com/setup_10.x | bash -
     如果没有权限就 curl -sL https://rpm.nodesource.com/setup_10.x | sudo bash -
  2、yum install nodejs
     如果没有权限就 sudo yum install nodejs

  3、npm install pm2 -g

# 程序启动
  进入项目根目录执行 pm2 ./app/index.js
