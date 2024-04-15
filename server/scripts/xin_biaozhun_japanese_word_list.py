"""
新版中日交流【标准日本语】词汇表
词汇xlsx资源：
https://pan.baidu.com/s/1bppul2gSZgNl25C9dbQM9g?pwd=mksd
读取后存到数据库
"""
import pandas as pd
import re
from sqlalchemy.orm import sessionmaker
import sys
import MeCab
import ipadic
sys.path.append('../')
from models import connect 
from models.textbook_dict import TextbookWord, WordType

sheet = pd.read_excel('新标日初级和中级词汇.xlsx', sheet_name=0)
word_set = set()
engine = connect()
DBSession = sessionmaker(engine)
session = DBSession()
bookname = '新版中日交流【标准日本语】'
wordTypeMap = {
    '名': WordType.noun,
    '代': WordType.pron,
    '形1': WordType.adj1,
    '形2': WordType.adj2,
    '动1': WordType.verb1,
    '动2': WordType.verb2,
    '动3': WordType.verb3,
    '副': WordType.adv,
    '连': WordType.conj,
    '连体': WordType.siam,
    '叹': WordType.wow,
    '疑': WordType.ques,
}

CHASEN_ARGS = r' -F "%m\t%f[7]\t%f[6]\t%F-[0,1,2,3]\t%f[4]\t%f[5]\n"'
CHASEN_ARGS += r' -U "%m\t%m\t%m\t%F-[0,1,2,3]\t\t\n"'
tagger = MeCab.Tagger(ipadic.MECAB_ARGS + CHASEN_ARGS)

def get_original_form(word):
    return ''.join(tagger.parse(word).split('\t')[2:-6:5])

def get_word_list(start, end):
    for i in range(start, end + 1):
        # 不收录短语（单词应该都有词性）
        if pd.isna(sheet.iloc[i, 3]) or sheet.iloc[i, 3] == '专':
            continue
        match = re.match(r'([^（(]+)?((（|\()(.+)(）|\)))?', sheet.iloc[i, 2])
        lesson = int(re.match(r'第(\d+)课', sheet.iloc[i, 1]).group(1))
        hirakana = match.group(1).strip()
        entry = (match.group(4) if match.group(4) else hirakana).strip()
        translation = sheet.iloc[i, 4]
        wordtype = wordTypeMap[sheet.iloc[i, 3]]
        if len(entry) > 16 or len(hirakana) > 16:
            continue
        if wordtype in [WordType.verb1, WordType.verb2]:
            if entry == hirakana:
                entry = get_original_form(entry)
                hirakana = entry
            else:
                entry = get_original_form(entry)
                hirakana = get_original_form(hirakana)
        if wordtype == WordType.verb3:
            if entry in ['します', 'きます']:
                continue
            entry = re.sub(r'(～|します)$', '', entry)
            hirakana = re.sub(r'します$', '', hirakana)
        if entry not in word_set:
            word_set.add(entry)
            session.add(TextbookWord(entry=entry, hirakana=hirakana, translation=translation, lesson=lesson, bookname=bookname, wordtype=wordtype))


get_word_list(0, 2142)
get_word_list(2144, 6037)
session.commit()
session.close()
