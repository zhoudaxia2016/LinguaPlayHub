from readmdict import MDX
import sys
import re
import os

dicts = {}

def loadDict(filename):
    dictDir = './dicts'
    dict_path = os.path.join(dictDir, filename)
    dict = MDX(dict_path)
    return dict

def queryWord(word, dictInfo):
    global dicts
    if dictInfo.id not in dicts:
      mdx = loadDict(dictInfo.filename)
      dicts[dictInfo.id] = {'headwords': [*mdx], 'items': [*mdx.items()]}
    dict = dicts[dictInfo.id]
    word = word.encode()
    if word not in dict['headwords']:
        found = []
        for w in dict['headwords']:
            if word in w:
                found.append(w)
        if len(found) > 0:
            return '\n'.join([queryWord(w.decode(), dictInfo) for w in found])
        else:
            return ''
    wordIndex = dict['headwords'].index(word)
    word, html = dict['items'][wordIndex]
    word, html = word.decode(), html.decode('utf-8')
    match = re.match(r'@@@LINK=([^\r\n]+)', html)
    if match:
        word = match.group(1)
        return queryWord(word, dictInfo)
    return re.sub(r'(<link rel="stylesheet" href=")([^"]+)(" type="text/css"\s*>)', '', html)
