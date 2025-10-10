# sugar_sync_google_calendars
複数のGoogleカレンダーを同期するためのGoogle Script

## How to use it
- 同期先のGoogleカレンダー(destCalendar)にて、同期元のカレンダー(sourceCalendar)が参照できるようにしておく。（参考：https://support.google.com/calendar/answer/37082?hl=ja ）
- Google App Scriptのプロジェクトを作成し、Google Apps Script APIを有効化しておく。
- consts.jsを自身の設定に合わせて修正をしておく。（const.jsの修正は原則commitしないこと）
- 後述するclaspによりデプロイを行うこと。

## 予定の公開に関して
- `privatePlan`をtrueにしておくと他人からは予定の詳細を見られないようにできるので、企業内で利用するGoogleアカウントでは原則trueを使うことを推奨。

## 予定同期の仕様
- 同期されない予定
  - 終日の予定となっている予定は同期されない。予定の開始時刻と終了時刻が設定されているイベントのみ同期の対象
  - 以下のプレフィックスを持つ予定は同期されない。`info_`,`非同期_`,`synced_`
  - 以下のサフィックスを持つ予定は同期されない。`_info`, `_非同期`, `_synced`
  - 同期元で”不参加”を表明している予定は同期の対象から外れる
- 予定が変更になった場合
  - 同期元の予定が削除された、または出欠が不参加に変更になった場合は、同期先の予定を削除する仕組みが内包されている

## Remarks
- 複数アカウント間で、相互に同期したい場合はそれぞれのGoogleアカウントで上記の設定が必要となっている。また、相互に設定した場合でも問題なく運用できるように設計している。
- n個のアカウントがある場合でも$\text{}_{n}\mathrm{C}_{2}$分の設定をしないといけないわけではない。メインのアカウントを決めておいて、メインのアカウントと各サブアカウント同士で同期の設定を行っておけばよい。

## claspによるGoogle App Scriptのデプロイ

### 前提条件
- Node.jsがインストールされていること
- Google Apps Script APIが有効化されていること（https://script.google.com/home/usersettings）

### 初回セットアップ

#### 1. claspのインストール
```bash
make prepare
```
または
```bash
npm i @google/clasp -g
```

#### 2. Googleアカウントでログイン
```bash
make login
```
または
```bash
clasp login
```
ブラウザが開くので、使用するGoogleアカウントでログインし、claspへのアクセスを許可してください。

#### 3. Google Apps Scriptプロジェクトのクローン
Google Apps Scriptのプロジェクトを作成済みの場合、スクリプトIDを使ってクローンします。
```bash
make clone id=<your_script_id>
```
または
```bash
cd workspace
clasp clone <your_script_id>
```

**スクリプトIDの取得方法:**
1. Google Apps Scriptのエディタを開く（https://script.google.com/）
2. 対象のプロジェクトを開く
3. 「プロジェクトの設定」をクリック
4. 「スクリプトID」をコピー

### デプロイ方法

#### 1. consts.jsの設定
`files/consts.js`を自身の環境に合わせて編集します。
```javascript
// 同期元のカレンダーKey
const SOURCE_CALENDAR_KEY = 'sample01';

// 同期先のカレンダーKey（複数指定可能）
const DEST_CALENDAR_KEYS = ['sample02', 'sample03'];

// 同期する日数
const SYNC_DAYS = 30;

// プライベートモード
const PRIVATE_PLAN = true;

// KeyとEmailのマッピング
const KEY_EMAIL_PAIRS = [
  ['sample01', 'sample-01@sample.com'],
  ['sample02', 'sample-02@sample.com'],
  ['sample03', 'sample-03@sample.com']
];
```

#### 2. デプロイの実行
```bash
make deploy
```

#### 3. トリガーの設定
Google Apps Scriptのエディタで以下の手順でトリガーを設定します:
1. Google Apps Scriptのエディタを開く
2. 左メニューの「トリガー」（時計アイコン）をクリック
3. 「トリガーを追加」をクリック
4. 以下の設定を行う:
   - 実行する関数: `syncCalendarEvents`
   - イベントのソース: `時間主導型`
   - 時間ベースのトリガー: `分ベースのタイマー` → `15分おき`（または任意の間隔）
5. 「保存」をクリック

### トラブルシューティング

#### Apps Script APIが有効になっていないエラー
```
User has not enabled the Apps Script API.
```
→ https://script.google.com/home/usersettings にアクセスして「Google Apps Script API」を有効化し、数分待ってから再試行してください。

#### ログインエラー
```bash
make login
```
を実行して再ログインしてください。

#### デプロイ確認
デプロイ後、Google Apps Scriptのエディタで各ファイルが更新されていることを確認してください。