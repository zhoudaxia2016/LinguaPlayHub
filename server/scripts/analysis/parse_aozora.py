from bs4 import BeautifulSoup
import requests
import sys
import re
import json
sys.path.append('../../')
from analysis import analysis

base = 'https://www.aozora.gr.jp/'
file = 'aozora'
category = sys.argv[1]
page_num = 1
if len(sys.argv) > 2:
    page_num = int(sys.argv[2])

def parse_html(path):
    r = requests.get(base + path)
    return BeautifulSoup(r.content, 'html.parser')


soup = parse_html('')
table = soup.find(lambda tag: tag.name == 'table' and tag.has_attr('summary') and tag['summary'] == "作品リスト")
page = table.find(lambda tag: tag.name == 'a' and tag.text == category)['href']

soup = parse_html(page)
table = soup.findAll('table')
if len(table) < 3:
    print('解析失败')
table = table[2]
pages = [page] + ['index_pages/' + a['href'] for a in table.findAll('a')]

works = []
for p in pages[:page_num]:
    print(f'正在解析: {p}')
    soup = parse_html(p)
    table = soup.find('table', {'class': 'list'})
    if not table:
        continue
    pages = [{'title': a.text, 'path': re.sub(r'\.\./', '', a['href'])} for a in table.findAll('a')]
    for p in pages:
        title = p['title']
        print(f'正在解析作品: {title}')
        soup = parse_html(p['path'])
        table = soup.find('table', {'class': 'download'})
        a = table.find(lambda x: x.name == 'a' and re.match(r'.*html$', x['href']))
        if a:
            path = re.sub(r'^\.', '', a['href'])
            path = re.match(r'(cards/\d+).*', p['path'])[1] + path
            works.append({'title': title, 'path': path})

for w in works:
    print('正在分析作品：', w['title'])
    soup = parse_html(w['path'])
    main = soup.find('div', {'class': 'main_text'})
    if not main:
        print('找不到文章, path为', w['path'])
        print('title: ', w['title'])
        continue
    result = analysis(main.text)
    w['analysis'] = result

with open(file + '_' + category + '.json', 'w') as f:
    f.write(json.dumps(works))
