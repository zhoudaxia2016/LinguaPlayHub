import pandas as pd
import sys
sys.path.append('../')
from models import Vocab
from routers.utils import get_db

fn = sys.argv[1]
sheet = pd.read_excel(fn, sheet_name=0)
word_set = set()

db = next(get_db())
for i in range(1, len(sheet)):
    name = sheet.iloc[i, 0]
    if name in word_set or pd.isna(name) or db.query(Vocab).filter_by(name=name).count() > 0:
        word_set.add(name)
        continue
    word_set.add(name)
    kana = sheet.iloc[i, 1]
    if pd.isna(kana):
        kana = ''
    status = 100 if sheet.iloc[i, 2] else 10
    db.add(Vocab(name=name, kana=kana, status=status))

db.commit()
