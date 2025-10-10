//=============================================================================
//  syncCalendarEvents 複数のGoogleカレンダーの予定を同期する
//  ※ こちらの関数Apps Scriptのトリガーから定期実行することを想定している。
//=============================================================================
function syncCalendarEvents() {
  const destCalendarEmail = getEmailByKey(SOURCE_CALENDAR_KEY);
  if (!destCalendarEmail) {
    Logger.log('Failed to get destCalendarEmail!!');
    return;
  }

  const sourceCalendarEmails = DEST_CALENDAR_KEYS.map(key => getEmailByKey(key));
  
  if (!sourceCalendarEmails) {
    Logger.log('Failed to get sourceCalendarEmails!!');
    return;
  }

  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date();
  endDate.setDate(endDate.getDate() + SYNC_DAYS);
  endDate.setHours(23, 59, 59, 999);

  const destCalendar = CalendarApp.getCalendarById(destCalendarEmail);

  // 同期元の全イベントを処理し、新規作成する
  processSourceEvents(sourceCalendarEmails, destCalendar, PRIVATE_PLAN, startDate, endDate);
  
  // 同期元から削除されたイベントを同期先から削除する
  deleteOrphanedEvents(sourceCalendarEmails, destCalendar, PRIVATE_PLAN, startDate, endDate);
}