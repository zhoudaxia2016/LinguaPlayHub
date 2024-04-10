from readmdict import MDX
import sys
import re
import os

dicts = []

def loadDict(activeDictIndex):
    activeDict = dicts[activeDictIndex]
    mdx = activeDict['mdx']
    headwords = [*mdx]
    items = [*mdx.items()]
    activeDict.update({'items': items, 'headwords': headwords})

def loadDictsMetaInfo():
    dictDir = './dicts'
    dictFiles = os.listdir(dictDir)
    for dict in dictFiles:
        dict_path = os.path.join(dictDir, dict)
        dicts.append({'mdx': MDX(dict_path)})

def queryWord(word, activeDictIndex):
    global dicts
    activeDict = dicts[activeDictIndex]
    if 'items' not in activeDict:
        mdx = activeDict['mdx']
        headwords = [*mdx]
        items = [*mdx.items()]
        activeDict.update({'items': items, 'headwords': headwords})
    word = word.encode()
    if word not in activeDict['headwords']:
        return ''
    wordIndex = activeDict['headwords'].index(word)
    word, html = activeDict['items'][wordIndex]
    word, html = word.decode(), html.decode('utf-8')
    match = re.match(r'@@@LINK=([^\r\n]+)', html)
    if match:
        word = match.group(1)
        return queryWord(word, activeDictIndex)
    return re.sub(r'(<link rel="stylesheet" href=")([^"]+)(" type="text/css"\s*>)', '', html)

def getAllDictInfo():
    return [{'name': x['mdx'].header[b'Title'], 'id': i} for i, x in enumerate(dicts)]
