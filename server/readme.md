# Bee Web采集系统服务端相关配置

## 概述

基于 OpenResty。

- nginx.conf  nginx 配置
- bee_access.lua  用于计算日志文件名
- bee.lua  用户取上报数据
- bee20200201.log  log文件实例

## 基本功能

前端数据上报后，通过 OpenResty 进行接收。并写入相关日志文件。
日志文件按天分割。

1. nginx 接受请求
2. 计算日志名(bee + 当前日期 + .log)
3. 取请求体 + ua + ip + 当前时间
4. 写入日志
