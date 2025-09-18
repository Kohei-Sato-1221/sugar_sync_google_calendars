//=============================================================================
//  syncCalendarEvents 複数のGoogleカレンダーの予定を同期する
//  ※ こちらの関数Apps Scriptのトリガーから定期実行することを想定している。
//=============================================================================
function syncCalendarEvents() {
  const privatePlan = true; //true:予定のタイトルや説明を隠してターゲットのカレンダーに予定を作成。タイトルは「🙅‍♂️ Block_synced」となる。
  // const privatePlan = false; //false:タイトルや説明をそのままコピーしてターゲットのカレンダーに予定を作成。
  
  const destCalendarId = 'hogehoge@sample.com'; //予定を同期する先のカレンダーID or Email
  const sourceCalendarIds = [ //予定を同期する元のカレンダーID or Email（複数設定可能）
    'source01@sample.com',
    'source02@sample.com'
  ];

  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 30); //30日先の予定まで同期する
  endDate.setHours(23, 59, 59, 999);

  const destCalendar = CalendarApp.getCalendarById(destCalendarId);

  // 同期元の全イベントを処理し、新規作成する
  processSourceEvents(sourceCalendarIds, destCalendar, privatePlan, startDate, endDate);
  
  // 同期元から削除されたイベントを同期先から削除する
  deleteOrphanedEvents(sourceCalendarIds, destCalendar, privatePlan, startDate, endDate);
}
