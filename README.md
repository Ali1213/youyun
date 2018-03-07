# 云解析 简历识别模块

详情见[官网](http://www.youyun.com/index/about)
因为官网没有提供nodejs包，所以自己封装了一个

## 如何使用

### 安装

`npm install youyun --save`

### 设置

自行注册youyun，并获取`secret_key`，替换`settings.json`中对应的值

### 使用

```javascript
const { fetchBalance, resumeParse } = require('youyun');

// 获取账户余额
// return Promise
fetchBalance().then( r => console.log(r))

// 上传简历解析
// return Promise
resumeParse(filepath).then( r => console.log(r))

```




## 目前测试的简历识别准确度

### 中文简历

识别度还可以
集中出现的问题

+ 项目经验有偶发性丢失条目
+ 职业技能可能是直接全局匹配，不是特别准确
+ 如果项目名称为中英文混合的或者带了特殊符号`（`等的，无法准确识别

### 英文简历

识别度较差

+ 项目经验和工作经验基本上无法识别
+ 识别学校中带了`,` 以及其他分隔符的很容易只识别带了school，university，college的部分
+ 国外电话无法识别
+ 其他


## 识别格式

### 支持格式

目前测过 PDF DOC

### 暂时有问题的格式

图片
目前确认无法识别大于2M的图片文件

目前图片均无法识别，已经联系官方售前解决。
