# sugar_sync_google_calendars
複数のGoogleカレンダーを同期するためのGoogle Script

## How to use it
- 同期先のGoogleカレンダー(destCalendar)にて、同期元のカレンダー(sourceCalendar)が参照できるようにしておく。（参考：https://support.google.com/calendar/answer/37082?hl=ja ）
- Apps Scriptにてfiles配下にあるgsファイルをすべてコピーする。
- `main.gs`の`destCalendarId`,`sourceCalendarIds`,`privatePlan`を適切な値に設定する。
- `syncCalendarEvents`をトリガーで定期実行するように設定する。

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
