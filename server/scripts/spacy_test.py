import sys
import spacy
from spacy import displacy

nlp = spacy.load("ja_core_news_lg")
doc = nlp(sys.argv[1])
for token in doc:
    print(token, token.tag_, token.pos_, token.morph, token.lemma_)
displacy.serve(doc, style="dep", auto_select_port=True)
