//=============================================================================
//  syncCalendarEvents 複数のGoogleカレンダーの予定を同期する
//  ※ こちらの関数Apps Scriptのトリガーから定期実行することを想定している。
//=============================================================================
function syncCalendarEvents() {
  const syncDays = 2; //何日分先まで同期をするか
  const privatePlan = true; //true:予定のタイトルや説明を隠してターゲットのカレンダーに予定を作成。タイトルは「🙅‍♂️ Block_synced」となる。
  // const privatePlan = false; //false:タイトルや説明をそのままコピーしてターゲットのカレンダーに予定を作成。
  
  const destCalendarEmail = getEmailByKey('sample01');
  if (!destCalendarEmail) {
    Logger.log('Failed to get destCalendarEmail!!');
    return;
  }
  
  const sourceCalendarEmails = [ //予定を同期する元のカレンダーEmail（複数設定可能）
    getEmailByKey('sample02'),
    getEmailByKey('sample03')
  ];
  if (!sourceCalendarEmails) {
    Logger.log('Failed to get sourceCalendarEmails!!');
    return;
  }

  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date();
  endDate.setDate(endDate.getDate() + syncDays);
  endDate.setHours(23, 59, 59, 999);

  const destCalendar = CalendarApp.getCalendarById(destCalendarEmail);

  // 同期元の全イベントを処理し、新規作成する
  processSourceEvents(sourceCalendarEmails, destCalendar, privatePlan, startDate, endDate);
  
  // 同期元から削除されたイベントを同期先から削除する
  deleteOrphanedEvents(sourceCalendarEmails, destCalendar, privatePlan, startDate, endDate);
}