/**
 * 同期元から削除された予定を、同期先から削除します。
 */
function deleteOrphanedEvents(sourceCalendarEmails, destCalendar, privatePlan, startTime, endTime) {
  const myEmail = Session.getActiveUser().getEmail(); // スクリプト実行者のメールアドレスを取得
  const myKey = getKeyByEmail(myEmail);
  const sourceEventIdentifiers = new Set();
  
  sourceCalendarEmails.forEach(sourceCalendarEmail => {
    const sourceCalendar = CalendarApp.getCalendarById(sourceCalendarEmail);
    if (!sourceCalendar) {
      return;
    }
    const sourceKey = getKeyByEmail(sourceCalendarEmail);
    const events = sourceCalendar.getEvents(startTime, endTime);

    events.forEach(event => {
      if (isExcludedEvent(event, myKey)) {
        return;
      }

      // 自身が不参加を表明しているイベントは同期元リストに追加しない
      // （これにより、不参加イベントは同期先から削除される）
      const myStatus = event.getMyStatus();
      if (myStatus === CalendarApp.GuestStatus.NO) {
        Logger.log(`Event declined, will be deleted from dest: ${event.getTitle()}`);
        return;
      }

      const originalTitle = event.getTitle();
      const eventStartTime = event.getStartTime();
      const eventEndTime = event.getEndTime();

      if (privatePlan) {
        description = getHashedDescriptionForPrivatePlan(originalTitle, eventStartTime, eventEndTime, sourceCalendarEmail)
        sourceEventIdentifiers.add(description);
      } else {
        sourceEventIdentifiers.add(originalTitle + '_' + sourceKey + '_synced');
      }
    });
  });

  const existingEvents = destCalendar.getEvents(startTime, endTime);
  existingEvents.forEach(existingEvent => {
    // syncedがサフィックスにない場合は削除対象外
    if (!existingEvent.getTitle().endsWith('_synced')) {
       Logger.log(`Skipped deletion of event '${existingEvent.getTitle()}' because it does not has _synced suffix`);
    }

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
      identifier = description;
      // privatePlanの同期済みイベントのタイトルは '🙅‍♂️ Block_xxxx_synced' なので、それを確認
      isSyncedEvent = existingEvent.getTitle().startsWith('🙅‍♂️ Block_') &&
        existingEvent.getTitle().endsWith('_synced') && 
        description &&
        description.startsWith('_hash:') &&
        description.endsWith('_');
    } else {
      identifier = existingEvent.getTitle();
      // publicPlanの同期済みイベントのタイトルは '_synced' で終わるので、それを確認
      isSyncedEvent = existingEvent.getTitle().endsWith('_synced');
    }
    
    // 同期元のリストに存在せず、かつ同期済みイベントと判定できる場合に削除
    if (isSyncedEvent && identifier && !sourceEventIdentifiers.has(identifier)) {
        existingEvent.deleteEvent();
        Logger.log(`😱 Deleted event:${existingEvent.getTitle()} from calendar:${destCalendar.getId()}/${existingEvent.getStartTime()}~${existingEvent.getEndTime()}...`);
    } else {
        Logger.log(`😜 Not in Delete targets event: ${existingEvent.getTitle()} from calendar: ${destCalendar.getId()}`);
    }
  });
}