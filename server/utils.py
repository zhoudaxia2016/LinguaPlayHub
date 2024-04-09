from readmdict import MDX
import sys
import re

#filename = './大辞林第三版.mdx'
filename = './dicts/xsjrihanshuangjie.mdx'
mdx = MDX(filename)
headwords = [*mdx]
items = [*mdx.items()]
if len(headwords) == len(items):
    print(f'加载成功：共{len(headwords)}条')
else:
    print(f'加载识别：{len(headwords),{len(items)}}')

def queryWord(word):
    wordIndex = headwords.index(word.encode())
    word, html = items[wordIndex]
    word, html = word.decode(), html.decode('utf-8')
    match = re.match(r'@@@LINK=([^\r\n]+)', html)
    if match:
        word = match.group(1)
        return queryWord(word)
    print(html)
    return re.sub(r'(<link rel="stylesheet" href=")([^"]+)(" type="text/css"\s*>)', r'\1/static/\2\3', html)
