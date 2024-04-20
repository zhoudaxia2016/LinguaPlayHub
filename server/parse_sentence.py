import spacy
import jaconv
import time

import MeCab
import ipadic
CHASEN_ARGS = r' -F "%m\t%f[7]\t%f[6]\t%F-[0,1,2,3]\t%f[4]\t%f[5]\n"'
CHASEN_ARGS += r' -U "%m\t%m\t%m\t%F-[0,1,2,3]\t\t\n"'
tagger1 = MeCab.Tagger(ipadic.MECAB_ARGS + CHASEN_ARGS)

nlp = spacy.load("ja_core_news_lg")

skip_heads = ['advcl', 'obj', 'nmod', 'acl', 'obl', 'cc', 'cop', 'nsubj']
skip_heads2 = ['compound']

def handle_token(token):
    result = tagger1.parse(token.text).split('\t')
    info = result[3]
    if token.tag == 'VERB':
        info = info + result[4].split('・')[0]
    return {
        'text': token.text,
        'tag1': info,
        'tag2': token.pos_,
        'base1': result[2],
        'base2': token.lemma_,
        'kana': jaconv.kata2hira(result[1]),
    }


def parse(text):
    sections = []
    doc = nlp(text)
    size = len(doc)
    i = 0
    while i < size:
        token = doc[i]
        head = token.head
        if token.pos_ == 'SPACE':
            pass
        elif token.dep_ in skip_heads or token == head or (token.dep_ in skip_heads2 and abs(head.i - i) > 1):
            sections.append({'tokens': [token], 'i': i})
        elif head.i > i:
            tokens = []
            for k in range(i, head.i + 1):
                tokens.append(doc[k])
            sections.append({'tokens': tokens, 'i': i})
            i = head.i
        else:
            j = len(sections) - 1
            merge = [token]
            while j > -1:
                merge = sections[j]['tokens'] + merge
                if sections[j]['i'] <= head.i:
                    break
                j = j - 1
            sections = sections[:j]
            sections.append({'tokens': merge, 'i': merge[0].i})
        i = i + 1

    for i in range(0, len(sections)):
        section = sections[i]
        section['tokens'] = list(map(handle_token, section['tokens']))
    return sections
