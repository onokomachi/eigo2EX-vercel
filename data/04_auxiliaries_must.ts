import { type Question } from '../types';

const questions: Question[] = [
  // select
  { id: 42001, category: '助動詞【must】', type: 'select', question: '次の文の( )に適切な語を入れなさい: You ( ) be quiet in the library.', options: ['must', 'can', 'will', 'may'], answer: 'must' },
  { id: 42002, category: '助動詞【must】', type: 'select', question: '次の文の( )に適切な語を入れなさい: You ( ) not swim in this river.', options: ['must', 'can\'t', 'don\'t have to', 'may not'], answer: 'must' },
  { id: 42003, category: '助動詞【must】', type: 'select', question: '次の文の( )に適切な語を入れなさい: We ( ) wait for thirty minutes.', options: ['must', 'can', 'will', 'may'], answer: 'must' },
  { id: 42004, category: '助動詞【must】', type: 'select', question: '次の文の( )に適切な語を入れなさい: He ( ) be sick. He looks pale.', options: ['must', 'may', 'can', 'will'], answer: 'must' },
  { id: 42005, category: '助動詞【must】', type: 'select', question: '「〜に違いない」という強い推量を表す助動詞は？', options: ['must', 'may', 'can', 'will'], answer: 'must' },
  
  // input
  { id: 42021, category: '助動詞【must】', type: 'input', question: '次の日本語を英語に訳しなさい: あなたは宿題をしなければなりません。', answer: 'You must do your homework.' },
  { id: 42022, category: '助動詞【must】', type: 'input', question: '次の日本語を英語に訳しなさい: ここで写真を撮ってはいけません。', answer: 'You must not take pictures here.' },
  { id: 42023, category: '助動詞【must】', type: 'input', question: '次の文をほぼ同じ意味の文に書き換えなさい: You must get up early.', answer: 'You have to get up early.' },
  { id: 42024, category: '助動詞【must】', type: 'input', question: '次の日本語を英語に訳しなさい: 私たちは規則に従わなければならない。', answer: 'We must follow the rules.' },
  { id: 42025, category: '助動詞【must】', type: 'input', question: '次の日本語を英語に訳しなさい: 彼はその時、とても忙しかったに違いない。', answer: 'He must have been very busy then.' },
  
  // sort
  { id: 42041, category: '助動詞【must】', type: 'sort', question: '語句を並べ替えて「私たちは30分間待たなければならない。」という文を完成させなさい。', options: ['for', 'must', 'minutes', 'We', 'thirty', 'wait', '.'], answer: ['We', 'must', 'wait', 'for', 'thirty', 'minutes', '.'] },
  { id: 42042, category: '助動詞【must】', type: 'sort', question: '語句を並べ替えて「あなたは失敗を恐れてはいけない。」という文を完成させなさい。', options: ['afraid', 'must', 'be', 'the', 'mistake', 'You', 'of', 'not', '.'], answer: ['You', 'must', 'not', 'be', 'afraid', 'of', 'the', 'mistake', '.'] },
  { id: 42043, category: '助動詞【must】', type: 'sort', question: '語句を並べ替えて「あなたはそのテストに合格しなければならない。」という文を完成させなさい。', options: ['must', 'You', 'pass', 'the', 'test', '.'], answer: ['You', 'must', 'pass', 'the', 'test', '.'] },
  { id: 42044, category: '助動詞【must】', type: 'sort', question: '語句を並べ替えて「あなたは授業に遅れてはいけない。」という文を完成させなさい。', options: ['must', 'You', 'not', 'be', 'late', 'for', 'class', '.'], answer: ['You', 'must', 'not', 'be', 'late', 'for', 'class', '.'] },
  { id: 42045, category: '助動詞【must】', type: 'sort', question: '語句を並べ替えて「彼は良い医者に違いありません。」という文を完成させなさい。', options: ['He', 'must', 'be', 'a', 'good', 'doctor', '.'], answer: ['He', 'must', 'be', 'a', 'good', 'doctor', '.'] },
  { id: 42046, category: '助動詞【must】', type: 'sort', question: '語句を並べ替えて「あなたは宿題をしなければなりません。」という文を完成させなさい。', options: ['You', 'must', 'do', 'your', 'homework', '.'], answer: ['You', 'must', 'do', 'your', 'homework', '.'] },
  { id: 42047, category: '助動詞【must】', type: 'sort', question: '語句を並べ替えて「ここで写真を撮ってはいけません。」という文を完成させなさい。', options: ['You', 'must', 'not', 'take', 'pictures', 'here', '.'], answer: ['You', 'must', 'not', 'take', 'pictures', 'here', '.'] },
  { id: 42048, category: '助動詞【must】', type: 'sort', question: '語句を並べ替えて「私たちは規則に従わなければならない。」という文を完成させなさい。', options: ['We', 'must', 'follow', 'the', 'rules', '.'], answer: ['We', 'must', 'follow', 'the', 'rules', '.'] },
  { id: 42049, category: '助動詞【must】', type: 'sort', question: '語句を並べ替えて「図書館では静かにしなければなりません。」という文を完成させなさい。', options: ['You', 'must', 'be', 'quiet', 'in', 'the', 'library', '.'], answer: ['You', 'must', 'be', 'quiet', 'in', 'the', 'library', '.'] },
  { id: 42050, category: '助動詞【must】', type: 'sort', question: '語句を並べ替えて「私は今日この仕事を終えなければなりませんか？」という文を完成させなさい。', options: ['Must', 'I', 'finish', 'this', 'work', 'today', '?'], answer: ['Must', 'I', 'finish', 'this', 'work', 'today', '?'] },
  { id: 42051, category: '助動詞【must】', type: 'sort', question: '語句を並べ替えて「彼は疲れているに違いない。」という文を完成させなさい。', options: ['He', 'must', 'be', 'tired', '.'], answer: ['He', 'must', 'be', 'tired', '.'] },
  { id: 42052, category: '助動詞【must】', type: 'sort', question: '語句を並べ替えて「彼女は医者に違いない。」という文を完成させなさい。', options: ['She', 'must', 'be', 'a', 'doctor', '.'], answer: ['She', 'must', 'be', 'a', 'doctor', '.'] },
  { id: 42053, category: '助動詞【must】', type: 'sort', question: '語句を並べ替えて「その絵に触れてはいけません。」という文を完成させなさい。', options: ['You', 'must', 'not', 'touch', 'the', 'painting', '.'], answer: ['You', 'must', 'not', 'touch', 'the', 'painting', '.'] },
  { id: 42054, category: '助動詞【must】', type: 'sort', question: '語句を並べ替えて「私は今、家に帰らなければならない。」という文を完成させなさい。', options: ['I', 'must', 'go', 'home', 'now', '.'], answer: ['I', 'must', 'go', 'home', 'now', '.'] },
  { id: 42055, category: '助動詞【must】', type: 'sort', question: '語句を並べ替えて「彼らは部屋を掃除しなければならない。」という文を完成させなさい。', options: ['They', 'must', 'clean', 'their', 'room', '.'], answer: ['They', 'must', 'clean', 'their', 'room', '.'] },
  { id: 42056, category: '助動詞【must】', type: 'sort', question: '語句を並べ替えて「私たちは学校に遅れてはいけない。」という文を完成させなさい。', options: ['We', 'must', 'not', 'be', 'late', 'for', 'school', '.'], answer: ['We', 'must', 'not', 'be', 'late', 'for', 'school', '.'] },
  { id: 42057, category: '助動詞【must】', type: 'sort', question: '語句を並べ替えて「彼女はその真実を知っているに違いない。」という文を完成させなさい。', options: ['She', 'must', 'know', 'the', 'truth', '.'], answer: ['She', 'must', 'know', 'the', 'truth', '.'] },
  { id: 42058, category: '助動詞【must】', type: 'sort', question: '語句を並べ替えて「彼はその時とても忙しかったに違いない。」という文を完成させなさい。', options: ['He', 'must', 'have', 'been', 'very', 'busy', 'then', '.'], answer: ['He', 'must', 'have', 'been', 'very', 'busy', 'then', '.'] },
  { id: 42059, category: '助動詞【must】', type: 'sort', question: '語句を並べ替えて「劇場では携帯電話の電源を切らなければならない。」という文を完成させなさい。', options: ['You', 'must', 'turn', 'off', 'your', 'phone', 'in', 'the', 'theater', '.'], answer: ['You', 'must', 'turn', 'off', 'your', 'phone', 'in', 'the', 'theater', '.'] },
  { id: 42060, category: '助動詞【must】', type: 'sort', question: '語句を並べ替えて「私は毎日ピアノを練習しなければならない。」という文を完成させなさい。', options: ['I', 'must', 'practice', 'the', 'piano', 'every', 'day', '.'], answer: ['I', 'must', 'practice', 'the', 'piano', 'every', 'day', '.'] },
];

export default questions;