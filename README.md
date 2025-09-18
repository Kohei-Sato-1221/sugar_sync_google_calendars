# sugar_sync_google_calendars
複数のGoogleカレンダーを同期するためのGoogle Script

## How to use it
- 同期先のGoogleカレンダー(destCalendar)にて、同期元のカレンダー(sourceCalendar)が参照できるようにしておく。（参考：https://support.google.com/calendar/answer/37082?hl=ja）
- Apps Scriptにてfiles配下にあるgsファイルをすべてコピーする。
- `main.gs`の`destCalendarId`,`sourceCalendarIds`,`privatePlan`を適切な値に設定する。
- `syncCalendarEvents`をトリガーで定期実行するように設定する。