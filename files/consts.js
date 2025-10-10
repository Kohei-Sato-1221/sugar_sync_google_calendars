//=============================================================================
//  EmailとKeyのマップ定義
//
// こちらのファイルは各アカウントに合わせて修正を行なった上で使用すること。
// 修正対象：
// - SOURCE_CALENDAR_KEY
// - DEST_CALENDAR_KEYS
// - KEY_EMAIL_PAIRS
// - SYNC_DAYS
// - PRIVATE_PLAN
//=============================================================================

/**
 * 同期元のカレンダーKey
 * @type {string}
 */
const SOURCE_CALENDAR_KEY = 'sample01';

/**
 * 同期先のカレンダーKey
 * @type {string[]}
 */
const DEST_CALENDAR_KEYS = ['sample02', 'sample03'];

/**
 * 何日分先まで同期をするか
 * @type {number}
 */
const SYNC_DAYS = 30;

/**
 * プライベートプラン設定
 * true: 予定のタイトルや説明を隠してターゲットのカレンダーに予定を作成。タイトルは「🙅‍♂️ Block_xxx_synced」となる。
 * false: タイトルや説明をそのままコピーしてターゲットのカレンダーに予定を作成。
 * @type {boolean}
 */
const PRIVATE_PLAN = true;

/**
 * KeyとEmailのマッピング配列
 * 各要素は[key, email]の形式
 * @type {Array<Array<string>>}
 */
const KEY_EMAIL_PAIRS = [
  ['sample01', 'sample-01@sample.com'],
  ['sample02', 'sample-02@sample.com'],
  ['sample03', 'sample-03@sample.com']
];

/**
 * KeyからEmailを取得する関数
 * @param {string} key - キー
 * @return {string|null} - 対応するメールアドレス、見つからない場合はnull
 */
function getEmailByKey(key) {
  for (const [k, email] of KEY_EMAIL_PAIRS) {
    if (k === key) {
      return email;
    }
  }
  return null;
}

/**
 * EmailからKeyを取得する関数
 * @param {string} email - メールアドレス
 * @return {string|null} - 対応するキー、見つからない場合はnull
 */
function getKeyByEmail(email) {
  for (const [key, e] of KEY_EMAIL_PAIRS) {
    if (e === email) {
      return key;
    }
  }
  return null;
}