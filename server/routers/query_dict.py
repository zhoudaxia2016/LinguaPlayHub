from readmdict import MDX
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
        startWith = []
        contains = []
        for w in dict['headwords']:
            if w.startswith(word):
                startWith.append(w)
            elif word in w:
                contains.append(w)
        if len(startWith) > 0 or len(contains) > 0:
            return {'startsWith': startWith, 'contains': contains}
        else:
            return ''
    wordIndex = dict['headwords'].index(word)
    word, html = dict['items'][wordIndex]
    word, html = word.decode(), html.decode('utf-8')
    match = re.match(r'@@@LINK=([^\r\n]+)', html)
    if match:
        word = match.group(1)
        return queryWord(word, dictInfo)
    link_href_pat = r'(<link rel="stylesheet"[^>]*\s*>)'
    return re.sub(link_href_pat, '', html)
