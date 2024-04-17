import re
import pandas as pd
import sys
import MeCab
import ipadic
sys.path.append('../../')
from models import connect 
from models.textbook_dict import TextbookWord, WordType

CHASEN_ARGS = r' -F "%m\t%f[7]\t%f[6]\t%F-[0,1,2,3]\t%f[4]\t%f[5]\n"'
CHASEN_ARGS += r' -U "%m\t%m\t%m\t%F-[0,1,2,3]\t\t\n"'
tagger1 = MeCab.Tagger(ipadic.MECAB_ARGS + CHASEN_ARGS)
tagger2 = MeCab.Tagger("-Owakati")

def analysis(text):
    word_list = list(filter(lambda x: re.match(r'\w+', x), tagger2.parse(text).split(' ')))
    stop_words = ['た', 'の', 'つ', 'て', 'に', 'ゝ', 'し', 'が', 'は', 'を', 'ん', 'です', 'う', 'ない']
    word_list = list(filter(lambda x: x not in stop_words, word_list))

    def unique(l1):
        l2 = []
        for i in l1:
            if i not in l2:
                l2.append(i)
        return l2

    word_list = unique(word_list)
    word_list = list(map(lambda x: tagger1.parse(x).split('\t')[2], word_list))

    # 读取词汇表，标记了是否认识
    sheet = pd.read_excel('新标日初级和中级词汇-辞书形.xlsx', sheet_name=0)
    my_dict = {}
    for i in range(1, len(sheet)):
        if sheet.iloc[i, 0] == '中级':
            break
        my_dict[sheet.iloc[i, 2]] = {
            'translation': sheet.iloc[i, 4],
            'know': sheet.iloc[i, 5] == 1,
            'lesson': sheet.iloc[i, 1],
        }

    search_result = []
    for w in word_list:
        if w in my_dict:
            search_result.append(my_dict[w])

    score = 0
    for w in search_result:
        score += 1 if w['know'] else 0.5

    return {'all_words': len(word_list), 'textbook_words': len(search_result), 'score': round(100 * score / len(word_list), 2)}
