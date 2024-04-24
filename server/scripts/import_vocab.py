import pandas as pd
import sys
sys.path.append('../')
from models import Vocab
from routers.utils import get_db

fn = sys.argv[1]
sheet = pd.read_excel(fn, sheet_name=0)

db = next(get_db())
for i in range(1, 500):
    name = sheet.iloc[i, 0]
    if db.query(Vocab).filter_by(name=name).count() > 0:
        continue
    kana = sheet.iloc[i, 1]
    status = 100 if sheet.iloc[i, 2] else 10
    db.add(Vocab(name=name, kana=kana, status=status))

db.commit()
