//=============================================================================
//  EmailとKeyのマップ定義
//=============================================================================

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