import re
import pandas as pd
from sqlalchemy.orm import sessionmaker
import sys
import MeCab
import ipadic
sys.path.append('../')
from models import connect 
from models.textbook_dict import TextbookWord, WordType

CHASEN_ARGS = r' -F "%m\t%f[7]\t%f[6]\t%F-[0,1,2,3]\t%f[4]\t%f[5]\n"'
CHASEN_ARGS += r' -U "%m\t%m\t%m\t%F-[0,1,2,3]\t\t\n"'
tagger1 = MeCab.Tagger(ipadic.MECAB_ARGS + CHASEN_ARGS)
tagger2 = MeCab.Tagger("-Owakati")

engine = connect()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

text = """
秋は深くなつた。落葉ががら／＼と家の周囲を廻つて通る。朝から障子に日が当つて、雀がチヤ／＼と鳴いて居る。芭蕉の葉は既に萎（しほ）れた。 　栗の実を拾ひに、競つて朝早く子供等の起きたのはつい此間であつたが、今は落葉が深く積つて、それを掃く音が高く聞える。朝焼火（たきび）をした火が午後まで消えずに残つて、プス／＼と細い煙を立てゝ居ることなどもある。近所の工場の物音も手に取るやうに聞えて、黒い煙が晴れた空にくつきりと靡（なび）く。  　私の家は林の蔭にある。 　風の日には、樹の鳴る音が波のやうに聞える。ことに大きい欅（けやき）の樹が多いので、普通の林などでは想像されぬやうな遠い高い音がする。大い樹と言ふものは動いて居る時にも、静まつて居る時にも立派なものだなどと私は思ふ。 　その欅の木の側（そば）を通つて、右に曲つて、私はよく此処に遣つて来た。其頃、私の此家（や）は丁度半分出来上つて、瓦師が書斎の屋根に瓦を載せて居た。あたりは大抵畑で、森には雑草が生茂つて、名も知らぬ蔓の色附いたのが薄く午後の日影に照されて居た。私は根太板の張られたばかりの書斎に上つて、いろ／＼なことを考へた。徒らに過ぎ去つた自分の半生――三人の人の親となつて、かうした郊外に家を定（き）めやうとする境遇が染々思遣られた。『静かに読書しよう、静かに筆を執らう』私は唯かう思つた。 　それから三年はもう過ぎた。  　周囲は非常に変つた。もう畑など見られぬほどの屋敷町になつて了つた。到る処の新しい家の庭を彩つてコスモスが咲いて居る。夜は、瓦斯（がす）の光が家々から洩れて、村の垣（かきね）道を明るくした。 　庭では、植木屋が昨日の野分に吹倒された垣を修繕して居る。 『さうですな、建仁寺垣（がき）は、正直の処三年位しか持ちませんな』と其時言つた三年がもう来たのである。鋤や鍬が朝日に光つて、張つた縄の向ふに、通が見える。通には煮豆屋が鈴を鳴して通つて行く。  　銀杏（いてふ）が一本、毎日通ふ道の角にあつた。 『銀杏は美しいものですねえ』とある日私が言ふと、 『そら、彼処（あすこ）に一本好いのがありますね、丁度先生の通る処に』 　かうお貞（てい）さんが言つた。 『あなたもさう思つて居たんですか……あれが実際綺麗なんですよ。夕方、帰つて来て、そら、彼処の橋のある処があるでせう。あの上の処から此方がよく見えるが、彼処から見ると、櫟や栗や庭樹などの暗く暮れかゝつた中にあれが一本はつきりと鮮かに出て居るんですよ。実に何とも言はれない、秋は今其一本にその名残の色を留めてゐるといふやうな気がしたですよ』 　その銀杏も昨日見た時には、葉はもう残り少くなつて、空しい枝が蒼く澄んだ空にさびしさうに見えて居た。秋はもう暮れ近い。 　凩が凄じく立つた。 　硝子戸がガタ／＼鳴る。新しく張り更へた障子の中の室は常よりも明るく、床には茶の花が生けてある。 　此頃、野に出ると、空の色、森の落葉、青々とした大根畑、心を惹くやうな景色が到る処にある。と、かう思ひながら、私は毎日電車の停留場の方に出て行つた。停留場に居る人は大抵知つた顔が多かつた。垣の角でよく邂逅（めぐりあは）す軍人や、田畝（たんぼ）で一所になるハイカラな若い男や、お茶の水に通ふ肥（ふと）つた娘や、勿論口を利いたことは一度も無いが、互に顔だけは知つて居て、あゝあの人は彼処に居るんだなゝどとよく思つた。 　電車が停留場を出て、速力を早めたと思ふ頃、丁度代々木野が一面に見渡される。丘から丘に連つた新建の家屋の上に富士が白く見える
"""
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

print(len(word_list))
print(len(search_result))

score = 0
for w in search_result:
    score += 1 if w['know'] else 0.5
print('score', round(100 * score / len(word_list), 2))
