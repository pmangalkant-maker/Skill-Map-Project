import json
from pathlib import Path
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

ROOT=Path(__file__).resolve().parent
rows=[json.loads(x) for x in (ROOT/'training_dataset.jsonl').read_text().splitlines()]
texts=[r['text'] for r in rows]
y=[r['intent'] for r in rows]
vec=TfidfVectorizer(lowercase=True, ngram_range=(1,2), sublinear_tf=True)
X=vec.fit_transform(texts)
clf=LogisticRegression(max_iter=2000, C=4.0)
clf.fit(X,y)
model={
 'type':'tfidf_logistic_regression',
 'version':1,
 'vocabulary':vec.vocabulary_,
 'idf':vec.idf_.tolist(),
 'classes':clf.classes_.tolist(),
 'coef':clf.coef_.tolist(),
 'intercept':clf.intercept_.tolist(),
 'feature_count':len(vec.vocabulary_)
}
(ROOT/'model.json').write_text(json.dumps(model,separators=(',',':')))
print('trained',len(rows),'examples,',len(vec.vocabulary_),'features,',len(clf.classes_),'intents')
