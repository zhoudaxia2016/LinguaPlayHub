# LinguaPlayHub

探索利用编程学习自然语言的方式

## 构建

### 前端
```bash
cd client
pnpm i
yarn start
```
### 数据库
使用mysql
创建database LinguaPlayHub

### 服务端
首先下载mdx字典文件，在[https://mdx.mdict.org/](https://mdx.mdict.org/)有很多资源。

将mdx文件放到`server/dicts`


```bash
apt-get install liblzo2-dev
pip install python-lzo
python -m spacy download ja_core_news_lg
cd server
# 创表，首次需要
user=xxx password=xxx python create.py
pip install -r requirements.txt
user=xxx password=xxx python server.py
```

浏览器打开`http://localhost:3000/`


## TODOS
- [ ] 查词，初步实现，待完善
- [ ] 语言游戏
- [ ] 背词
- [ ] 阅读材料分析（生词分析，语法汇总等）

## 资源
- https://forum.freemdict.com/ mdict交流社区
- https://mdx.mdict.org/ mdict字典资源
