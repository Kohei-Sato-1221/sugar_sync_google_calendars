/**
 * 同期元から削除された予定を、同期先から削除します。
 */
function deleteOrphanedEvents(sourceCalendarIds, destCalendar, privatePlan, startTime, endTime) {
  const myEmail = Session.getActiveUser().getEmail(); // スクリプト実行者のメールアドレスを取得
  const sourceEventIdentifiers = new Set();
  
  sourceCalendarIds.forEach(sourceCalendarId => {
    const sourceCalendar = CalendarApp.getCalendarById(sourceCalendarId);
    const events = sourceCalendar.getEvents(startTime, endTime);

    events.forEach(event => {
      if (isExcludedEvent(event)) {
        return;
      }

      const originalTitle = event.getTitle();
      const eventStartTime = event.getStartTime();
      const eventEndTime = event.getEndTime();

      if (privatePlan) {
        const eventHash = Utilities.base64Encode(
          Utilities.newBlob(
            originalTitle + eventStartTime.getTime() + eventEndTime.getTime() + sourceCalendarId
          ).getBytes()
        );
        sourceEventIdentifiers.add(`_hash:${eventHash}_`);
      } else {
        sourceEventIdentifiers.add(originalTitle + '_synced');
      }
    });
  });

  const existingEvents = destCalendar.getEvents(startTime, endTime);
  existingEvents.forEach(existingEvent => {
    // 自分以外の参加者がいるか確認
    const hasOtherAttendees = existingEvent.getGuestList().some(guest => {
      // ゲストのメールアドレスが自分のメールアドレスと異なり、かつゲストが招待済みの場合
      return guest.getEmail() !== myEmail && guest.getEmail() !== destCalendar.getId() && guest.getGuestStatus() !== CalendarApp.GuestStatus.NO;
    });

    // 他の参加者がいる場合は削除しない
    if (hasOtherAttendees) {
      Logger.log(`Skipped deletion of event '${existingEvent.getTitle()}' because it has other attendees.`);
      return;
    }
    
    let identifier;
    let isSyncedEvent = false;

    if (privatePlan) {
      const description = existingEvent.getDescription();
      if (description && description.startsWith('_hash:') && description.endsWith('_')) {
        identifier = description;
        // privatePlanの同期済みイベントのタイトルは '🙅‍♂️ Block_synced' なので、それを確認
        isSyncedEvent = existingEvent.getTitle() === '🙅‍♂️ Block_synced';
      }
    } else {
      identifier = existingEvent.getTitle();
      // publicPlanの同期済みイベントのタイトルは '_synced' で終わるので、それを確認
      isSyncedEvent = existingEvent.getTitle().endsWith('_synced');
    }
    
    // 同期元のリストに存在せず、かつ同期済みイベントと判定できる場合に削除
    if (isSyncedEvent && identifier && !sourceEventIdentifiers.has(identifier)) {
        existingEvent.deleteEvent();
        Logger.log(`Deleted event: ${existingEvent.getTitle()} from calendar: ${destCalendar.getId()}`);
    }
  });
}