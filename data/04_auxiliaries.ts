import { type Question } from '../types';

const questions: Question[] = [
  // select
  { id: 40002, category: '助動詞【その他】', type: 'select', question: '次の文の( )に適切な語を入れなさい: ( ) I use your pen?', options: ['May', 'Must', 'Will', 'Should'], answer: 'May' },
  { id: 40004, category: '助動詞【その他】', type: 'select', question: '次の文の( )に適切な語を入れなさい: You ( ) help your mother.', options: ['should', 'must', 'can', 'may'], answer: 'should' },
  { id: 40005, category: '助動詞【その他】', type: 'select', question: '次の文の( )に適切な語を入れなさい: I ( ) play the piano.', options: ['can', 'must', 'should', 'will'], answer: 'can' },
  { id: 40008, category: '助動詞【その他】', type: 'select', question: '次の文の( )に適切な語を入れなさい: It ( ) be cloudy in Tokyo now.', options: ['may', 'must', 'can', 'will'], answer: 'may' },
  { id: 40009, category: '助動詞【その他】', type: 'select', question: '次の文の( )に適切な語を入れなさい: ( ) I make dinner for you?', options: ['Shall', 'Will', 'Must', 'May'], answer: 'Shall' },
  { id: 40011, category: '助動詞【その他】', type: 'select', question: '次の文の( )に適切な語を入れなさい: He ( ) speak English very well.', options: ['can', 'must', 'should', 'will'], answer: 'can' },
  { id: 40012, category: '助動詞【その他】', type: 'select', question: '次の文の( )に適切な語を入れなさい: You ( ) go to bed early.', options: ['should', 'must', 'can', 'may'], answer: 'should' },
  { id: 40013, category: '助動詞【その他】', type: 'select', question: '「〜してもよい」という許可を表す助動詞は？', options: ['may', 'must', 'will', 'should'], answer: 'may' },
  { id: 40017, category: '助動詞【その他】', type: 'select', question: '次の文の( )に適切な語を入れなさい: ( ) we go shopping?', options: ['Shall', 'Will', 'Must', 'May'], answer: 'Shall' },
  { id: 40019, category: '助動詞【その他】', type: 'select', question: '次の文の( )に適切な語を入れなさい: You ( ) be kind to old people.', options: ['should', 'must', 'can', 'may'], answer: 'should' },
  { id: 40020, category: '助動詞【その他】', type: 'select', question: '次の文の( )に適切な語を入れなさい: ( ) you pass me the salt?', options: ['Can', 'Must', 'Shall', 'May'], answer: 'Can' },
  
  // input
  { id: 40022, category: '助動詞【その他】', type: 'input', question: '次の日本語を英語に訳しなさい: 私は泳ぐことができます。', answer: 'I can swim.' },
  { id: 40024, category: '助動詞【その他】', type: 'input', question: '次の日本語を英語に訳しなさい: あなたはもっと野菜を食べるべきだ。', answer: 'You should eat more vegetables.' },
  { id: 40025, category: '助動詞【その他】', type: 'input', question: '次の日本語を英語に訳しなさい: ドアを開けてもいいですか？', answer: 'May I open the door?' },
  { id: 40027, category: '助動詞【その他】', type: 'input', question: '「can」の過去形を答えなさい。', answer: 'could' },
  { id: 40029, category: '助動詞【その他】', type: 'input', question: '次の日本語を英語に訳しなさい: 彼は明日、来られないかもしれない。', answer: 'He may not come tomorrow.' },
  { id: 40030, category: '助動詞【その他】', type: 'input', question: '「〜しましょうか？」と提案する表現を Shall I を使って書きなさい。', answer: 'Shall I ~?' },
  { id: 40031, category: '助動詞【その他】', type: 'input', question: '次の文を疑問文にしなさい: She can play the guitar.', answer: 'Can she play the guitar?' },
  { id: 40033, category: '助動詞【その他】', type: 'input', question: '次の日本語を英語に訳しなさい: あなたはその映画を見るべきです。', answer: 'You should watch that movie.' },
  { id: 40036, category: '助動詞【その他】', type: 'input', question: '次の日本語を英語に訳しなさい: 駅への道を教えていただけますか？', answer: 'Could you tell me the way to the station?' },
  { id: 40037, category: '助動詞【その他】', type: 'input', question: '「〜するべきだったのに（しなかった）」という後悔を表す表現を should を使って書きなさい。', answer: 'should have + 過去分詞' },
  { id: 40039, category: '助動詞【その他】', type: 'input', question: '次の日本語を英語に訳しなさい: 彼はその知らせに驚いたかもしれない。', answer: 'He may have been surprised at the news.' },
  
  // sort
  { id: 40042, category: '助動詞【その他】', type: 'sort', question: '語句を並べ替えて「私はあなたのラケットの一つを借りてもいいですか。」という文を完成させなさい。', options: ['of', 'I', 'rackets', 'one', 'May', 'your', 'borrow', '?'], answer: ['May', 'I', 'borrow', 'one', 'of', 'your', 'rackets', '?'] },
  { id: 40044, category: '助動詞【その他】', type: 'sort', question: '語句を並べ替えて「私があなたに夕食を作りましょうか。」という文を完成させなさい。', options: ['for', 'I', 'dinner', 'Shall', 'you', 'make', '?'], answer: ['Shall', 'I', 'make', 'dinner', 'for', 'you', '?'] },
  { id: 40046, category: '助動詞【その他】', type: 'sort', question: '語句を並べ替えて「彼はとても速く走ることができる。」という文を完成させなさい。', options: ['can', 'He', 'run', 'very', 'fast', '.'], answer: ['He', 'can', 'run', 'very', 'fast', '.'] },
  { id: 40048, category: '助動詞【その他】', type: 'sort', question: '語句を並べ替えて「彼はパーティーに来ないかもしれない。」という文を完成させなさい。', options: ['may', 'He', 'come', 'not', 'to', 'the', 'party', '.'], answer: ['He', 'may', 'not', 'come', 'to', 'the', 'party', '.'] },
  { id: 40049, category: '助動詞【その他】', type: 'sort', question: '語句を並べ替えて「私たちはもっと運動すべきです。」という文を完成させなさい。', options: ['should', 'We', 'exercise', 'more', '.'], answer: ['We', 'should', 'exercise', 'more', '.'] },
  { id: 40051, category: '助動詞【その他】', type: 'sort', question: '語句を並べ替えて「彼はピアノを弾けなかった。」という文を完成させなさい。', options: ['couldn\'t', 'He', 'play', 'the', 'piano', '.'], answer: ['He', 'couldn\'t', 'play', 'the', 'piano', '.'] },
  { id: 40052, category: '助動詞【その他】', type: 'sort', question: '語句を並べ替えて「あなたの電話を使ってもいいですか？」という文を完成させなさい。', options: ['I', 'use', 'May', 'your', 'phone', '?'], answer: ['May', 'I', 'use', 'your', 'phone', '?'] },
  { id: 40053, category: '助動詞【その他】', type: 'sort', question: '語句を並べ替えて「あなたはそんなに一生懸命働くべきではない。」という文を完成させなさい。', options: ['shouldn\'t', 'You', 'work', 'so', 'hard', '.'], answer: ['You', 'shouldn\'t', 'work', 'so', 'hard', '.'] },
  { id: 40055, category: '助動詞【その他】', type: 'sort', question: '語句を並べ替えて「一緒に映画を見に行きませんか？」という文を完成させなさい。', options: ['we', 'go', 'to', 'the', 'movies', 'Shall', '?'], answer: ['Shall', 'we', 'go', 'to', 'the', 'movies', '?'] },
  { id: 40058, category: '助動詞【その他】', type: 'sort', question: '語句を並べ替えて「彼らはそのニュースを知っているかもしれない。」という文を完成させなさい。', options: ['may', 'They', 'know', 'the', 'news', '.'], answer: ['They', 'may', 'know', 'the', 'news', '.'] },
  { id: 40060, category: '助動詞【その他】', type: 'sort', question: '語句を並べ替えて「彼は彼女のパーティーに来ることができた。」という文を完成させなさい。', options: ['was', 'He', 'able', 'to', 'come', 'to', 'her', 'party', '.'], answer: ['He', 'was', 'able', 'to', 'come', 'to', 'her', 'party', '.'] },
  { id: 40061, category: '助動詞【その他】', type: 'sort', question: '語句を並べ替えて「あなたはもっと野菜を食べるべきだ。」という文を完成させなさい。', options: ['You', 'should', 'eat', 'more', 'vegetables', '.'], answer: ['You', 'should', 'eat', 'more', 'vegetables', '.'] },
  { id: 40062, category: '助動詞【その他】', type: 'sort', question: '語句を並べ替えて「ドアを開けてもいいですか？」という文を完成させなさい。', options: ['May', 'I', 'open', 'the', 'door', '?'], answer: ['May', 'I', 'open', 'the', 'door', '?'] },
  { id: 40063, category: '助動詞【その他】', type: 'sort', question: '語句を並べ替えて「彼女はギターを弾けますか？」という文を完成させなさい。', options: ['Can', 'she', 'play', 'the', 'guitar', '?'], answer: ['Can', 'she', 'play', 'the', 'guitar', '?'] },
  { id: 40064, category: '助動詞【その他】', type: 'sort', question: '語句を並べ替えて「あなたはその映画を見るべきです。」という文を完成させなさい。', options: ['You', 'should', 'watch', 'that', 'movie', '.'], answer: ['You', 'should', 'watch', 'that', 'movie', '.'] },
  { id: 40065, category: '助動詞【その他】', type: 'sort', question: '語句を並べ替えて「駅への道を教えていただけますか？」という文を完成させなさい。', options: ['Could', 'you', 'tell', 'me', 'the', 'way', 'to', 'the', 'station', '?'], answer: ['Could', 'you', 'tell', 'me', 'the', 'way', 'to', 'the', 'station', '?'] },
  { id: 40066, category: '助動詞【その他】', type: 'sort', question: '語句を並べ替えて「ここから美しい山を見ることができます。」という文を完成させなさい。', options: ['We', 'can', 'see', 'the', 'beautiful', 'mountain', 'from', 'here', '.'], answer: ['We', 'can', 'see', 'the', 'beautiful', 'mountain', 'from', 'here', '.'] },
  { id: 40067, category: '助動詞【その他】', type: 'sort', question: '語句を並べ替えて「今日の午後は雨が降るかもしれない。」という文を完成させなさい。', options: ['It', 'may', 'rain', 'this', 'afternoon', '.'], answer: ['It', 'may', 'rain', 'this', 'afternoon', '.'] },
  { id: 40068, category: '助動詞【その他】', type: 'sort', question: '語句を並べ替えて「あなたは嘘をつくべきではない。」という文を完成させなさい。', options: ['You', 'should', 'not', 'tell', 'a', 'lie', '.'], answer: ['You', 'should', 'not', 'tell', 'a', 'lie', '.'] },
  { id: 40069, category: '助動詞【その他】', type: 'sort', question: '語句を並べ替えて「私は泳ぐことができます。」という文を完成させなさい。', options: ['I', 'can', 'swim', '.'], answer: ['I', 'can', 'swim', '.'] },
];

export default questions;