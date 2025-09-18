# sugar_sync_google_calendars
複数のGoogleカレンダーを同期するためのGoogle Script

## How to use it
- 同期先のGoogleカレンダー(destCalendar)にて、同期元のカレンダー(sourceCalendar)が参照できるようにしておく。（参考：https://support.google.com/calendar/answer/37082?hl=ja ）
- Apps Scriptにてfiles配下にあるgsファイルをすべてコピーする。
- `main.gs`の`destCalendarId`,`sourceCalendarIds`,`privatePlan`を適切な値に設定する。
- `syncCalendarEvents`をトリガーで定期実行するように設定する。

## Remarks
- `privatePlan`をtrueにしておくと他人からは予定の詳細を見られないようにできるので、企業内で利用するGoogleアカウントでは原則trueを使うことを推奨。
- 複数アカウント間で、相互に同期したい場合はそれぞれのGoogleアカウントで上記の設定が必要となっている。また、相互に設定した場合でも問題なく運用できるように設計している。
