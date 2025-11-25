import { type Question } from '../types';

const questions: Question[] = [
  // select
  { id: 41001, category: '助動詞【have to】', type: 'select', question: '次の文の( )に適切な語を入れなさい: You ( ) go to school on Sundays.', options: ['don\'t have to', 'must not', 'should not', 'cannot'], answer: 'don\'t have to' },
  { id: 41002, category: '助動詞【have to】', type: 'select', question: '次の文の( )に適切な語を入れなさい: He ( ) get up early tomorrow.', options: ['has to', 'have to', 'must to', 'should'], answer: 'has to' },
  { id: 41003, category: '助動詞【have to】', type: 'select', question: '次の文の( )に適切な語を入れなさい: ( ) I have to finish this today?', options: ['Do', 'Have', 'Am', 'Must'], answer: 'Do' },
  { id: 41004, category: '助動詞【have to】', type: 'select', question: '次の文の( )に適切な語を入れなさい: She didn\'t ( ) go to the meeting yesterday.', options: ['have to', 'had to', 'has to', 'must'], answer: 'have to' },
  { id: 41005, category: '助動詞【have to】', type: 'select', question: '「〜する必要はない」を意味する表現は？', options: ['don\'t have to', 'must not', 'should not', 'cannot'], answer: 'don\'t have to' },

  // input
  { id: 41021, category: '助動詞【have to】', type: 'input', question: '次の日本語を英語に訳しなさい: あなたは急ぐ必要はありません。', answer: 'You don\'t have to hurry.' },
  { id: 41022, category: '助動詞【have to】', type: 'input', question: '次の日本語を英語に訳しなさい: 彼は明日、早く起きなければなりません。', answer: 'He has to get up early tomorrow.' },
  { id: 41023, category: '助動詞【have to】', type: 'input', question: '次の日本語を英語に訳しなさい: 私は昨日、宿題を終えなければならなかった。', answer: 'I had to finish my homework yesterday.' },
  { id: 41024, category: '助動詞【have to】', type: 'input', question: '次の文を疑問文にしなさい: She has to clean her room.', answer: 'Does she have to clean her room?' },
  { id: 41025, category: '助動詞【have to】', type: 'input', question: '次の文を否定文にしなさい: We had to wait for a long time.', answer: 'We didn\'t have to wait for a long time.' },

  // sort
  { id: 41041, category: '助動詞【have to】', type: 'sort', question: '語句を並べ替えて「あなたはその本を読む必要はありません。」という文を完成させなさい。', options: ['you', 'don\'t', 'read', 'to', 'have', 'that', 'book', '.'], answer: ['You', 'don\'t', 'have', 'to', 'read', 'that', 'book', '.'] },
  { id: 41042, category: '助動詞【have to】', type: 'sort', question: '語句を並べ替えて「彼はその鍵を見つけなければならなかった。」という文を完成させなさい。', options: ['had', 'He', 'to', 'find', 'the', 'key', '.'], answer: ['He', 'had', 'to', 'find', 'the', 'key', '.'] },
  { id: 41043, category: '助動詞【have to】', type: 'sort', question: '語句を並べ替えて「私は彼にもう一度電話する必要があった。」という文を完成させなさい。', options: ['I', 'to', 'had', 'call', 'him', 'again', '.'], answer: ['I', 'had', 'to', 'call', 'him', 'again', '.'] },
  { id: 41044, category: '助動詞【have to】', type: 'sort', question: '語句を並べ替えて「あなたは今、そこに行く必要はありません。」という文を完成させなさい。', options: ['have', 'don\'t', 'You', 'to', 'go', 'there', 'now', '.'], answer: ['You', 'don\'t', 'have', 'to', 'go', 'there', 'now', '.'] },
  { id: 41045, category: '助動詞【have to】', type: 'sort', question: '語句を並べ替えて「彼女は毎日、犬の散歩をしなくてはなりませんか？」という文を完成させなさい。', options: ['Does', 'she', 'have', 'to', 'walk', 'her', 'dog', 'every', 'day', '?'], answer: ['Does', 'she', 'have', 'to', 'walk', 'her', 'dog', 'every', 'day', '?'] },
  { id: 41046, category: '助動詞【have to】', type: 'sort', question: '語句を並べ替えて「彼は明日、早く起きなければなりません。」という文を完成させなさい。', options: ['He', 'has', 'to', 'get', 'up', 'early', 'tomorrow', '.'], answer: ['He', 'has', 'to', 'get', 'up', 'early', 'tomorrow', '.'] },
  { id: 41047, category: '助動詞【have to】', type: 'sort', question: '語句を並べ替えて「私は昨日、宿題を終えなければならなかった。」という文を完成させなさい。', options: ['I', 'had', 'to', 'finish', 'my', 'homework', 'yesterday', '.'], answer: ['I', 'had', 'to', 'finish', 'my', 'homework', 'yesterday', '.'] },
  { id: 41048, category: '助動詞【have to】', type: 'sort', question: '語句を並べ替えて「彼女は部屋を掃除しなければなりませんか？」という文を完成させなさい。', options: ['Does', 'she', 'have', 'to', 'clean', 'her', 'room', '?'], answer: ['Does', 'she', 'have', 'to', 'clean', 'her', 'room', '?'] },
  { id: 41049, category: '助動詞【have to】', type: 'sort', question: '語句を並べ替えて「私たちは長い間待つ必要はなかった。」という文を完成させなさい。', options: ['We', 'didn\'t', 'have', 'to', 'wait', 'for', 'a', 'long', 'time', '.'], answer: ['We', 'didn\'t', 'have', 'to', 'wait', 'for', 'a', 'long', 'time', '.'] },
  { id: 41050, category: '助動詞【have to】', type: 'sort', question: '語句を並べ替えて「あなたは急ぐ必要はありません。」という文を完成させなさい。', options: ['You', 'don\'t', 'have', 'to', 'hurry', '.'], answer: ['You', 'don\'t', 'have', 'to', 'hurry', '.'] },
  { id: 41051, category: '助動詞【have to】', type: 'sort', question: '語句を並べ替えて「私は今日、銀行に行かなければならない。」という文を完成させなさい。', options: ['I', 'have', 'to', 'go', 'to', 'the', 'bank', 'today', '.'], answer: ['I', 'have', 'to', 'go', 'to', 'the', 'bank', 'today', '.'] },
  { id: 41052, category: '助動詞【have to】', type: 'sort', question: '語句を並べ替えて「彼は土曜日に働かなければなりませんか？」という文を完成させなさい。', options: ['Does', 'he', 'have', 'to', 'work', 'on', 'Saturday', '?'], answer: ['Does', 'he', 'have', 'to', 'work', 'on', 'Saturday', '?'] },
  { id: 41053, category: '助動詞【have to】', type: 'sort', question: '語句を並べ替えて「彼らはその旅行をキャンセルしなければならなかった。」という文を完成させなさい。', options: ['They', 'had', 'to', 'cancel', 'the', 'trip', '.'], answer: ['They', 'had', 'to', 'cancel', 'the', 'trip', '.'] },
  { id: 41054, category: '助動詞【have to】', type: 'sort', question: '語句を並べ替えて「あなたはその代金を支払う必要はありません。」という文を完成させなさい。', options: ['You', 'don\'t', 'have', 'to', 'pay', 'for', 'it', '.'], answer: ['You', 'don\'t', 'have', 'to', 'pay', 'for', 'it', '.'] },
  { id: 41055, category: '助動詞【have to】', type: 'sort', question: '語句を並べ替えて「彼女は妹の面倒を見なければならない。」という文を完成させなさい。', options: ['She', 'has', 'to', 'take', 'care', 'of', 'her', 'little', 'sister', '.'], answer: ['She', 'has', 'to', 'take', 'care', 'of', 'her', 'little', 'sister', '.'] },
  { id: 41056, category: '助動詞【have to】', type: 'sort', question: '語句を並べ替えて「私たちは学校で制服を着なければならない。」という文を完成させなさい。', options: ['We', 'have', 'to', 'wear', 'a', 'uniform', 'at', 'school', '.'], answer: ['We', 'have', 'to', 'wear', 'a', 'uniform', 'at', 'school', '.'] },
  { id: 41057, category: '助動詞【have to】', type: 'sort', question: '語句を並べ替えて「あなたは雨の中、外出しなければなりませんでしたか？」という文を完成させなさい。', options: ['Did', 'you', 'have', 'to', 'go', 'out', 'in', 'the', 'rain', '?'], answer: ['Did', 'you', 'have', 'to', 'go', 'out', 'in', 'the', 'rain', '?'] },
  { id: 41058, category: '助動詞【have to】', type: 'sort', question: '語句を並べ替えて「彼はその質問に答える必要はない。」という文を完成させなさい。', options: ['He', 'doesn\'t', 'have', 'to', 'answer', 'the', 'question', '.'], answer: ['He', 'doesn\'t', 'have', 'to', 'answer', 'the', 'question', '.'] },
  { id: 41059, category: '助動詞【have to】', type: 'sort', question: '語句を並べ替えて「私は新しいノートを買わなければならない。」という文を完成させなさい。', options: ['I', 'have', 'to', 'buy', 'a', 'new', 'notebook', '.'], answer: ['I', 'have', 'to', 'buy', 'a', 'new', 'notebook', '.'] },
  { id: 41060, category: '助動詞【have to】', type: 'sort', question: '語句を並べ替えて「彼女はバイオリンを練習しなければならない。」という文を完成させなさい。', options: ['She', 'has', 'to', 'practice', 'the', 'violin', '.'], answer: ['She', 'has', 'to', 'practice', 'the', 'violin', '.'] },
];

export default questions;