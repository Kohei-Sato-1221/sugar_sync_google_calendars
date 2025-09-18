/**
 * 同期元のカレンダーに存在するが、同期先に存在しない予定を作成します。
 */
function processSourceEvents(sourceCalendarIds, destCalendar, privatePlan, startTime, endTime) {
  sourceCalendarIds.forEach(sourceCalendarId => {
    const sourceCalendar = CalendarApp.getCalendarById(sourceCalendarId);
    const events = sourceCalendar.getEvents(startTime, endTime);

    events.forEach(event => {
      if (isExcludedEvent(event)) {
        return;
      }
      
      const originalTitle = event.getTitle();
      let originalDescription = event.getDescription();
      const eventStartTime = event.getStartTime();
      const eventEndTime = event.getEndTime();

      let newTitle;
      let newDescription;
      const eventHash = Utilities.base64Encode(
        Utilities.newBlob(
          originalTitle + eventStartTime.getTime() + eventEndTime.getTime() + sourceCalendarId
        ).getBytes()
      );
      
      if (privatePlan) {
        newTitle = '🙅‍♂️ Block_synced';
        newDescription = `_hash:${eventHash}_`;
      } else {
        newTitle = originalTitle + '_synced';
        
        const attendees = event.getGuestList();
        const attendeeEmails = attendees.map(attendee => attendee.getEmail());
        const attendeesString = '----------------------\n【参加者】:\n' + attendeeEmails.join(', ');

        if (originalDescription) {
          newDescription = originalDescription + '\n\n' + attendeesString;
        } else {
          newDescription = attendeesString;
        }
      }

      // 既存のイベントの存在チェック（タイトル/ハッシュ値による重複判定）
      const existingEvents = destCalendar.getEvents(eventStartTime, eventEndTime);
      const eventExists = existingEvents.some(existingEvent => {
        if (privatePlan) {
          return existingEvent.getDescription() && existingEvent.getDescription().includes(`_hash:${eventHash}_`);
        } else {
          const syncedTitle = originalTitle + '_synced';
          return existingEvent.getTitle() === syncedTitle && existingEvent.getStartTime().getTime() === eventStartTime.getTime();
        }
      });
      
      // 同じ時間帯の予定がすでに存在するかをチェックする新しいロジック
      const sameTimeEventExists = existingEvents.some(existingEvent => {
        const existingStartTime = existingEvent.getStartTime().getTime();
        const existingEndTime = existingEvent.getEndTime().getTime();
        const newStartTime = eventStartTime.getTime();
        const newEndTime = eventEndTime.getTime();
        
        // 既存の予定が新しい予定の開始・終了時刻と完全に一致する場合
        return existingStartTime === newStartTime && existingEndTime === newEndTime;
      });

      if (!eventExists && !sameTimeEventExists) {
        destCalendar.createEvent(newTitle, eventStartTime, eventEndTime, {
          description: newDescription,
          visibility: privatePlan ? CalendarApp.Visibility.PRIVATE : CalendarApp.Visibility.PUBLIC
        });
        Logger.log(`Created event: ${newTitle} from ${eventStartTime} to ${eventEndTime} on calendar: ${destCalendar.getId()}`);
      } else if (sameTimeEventExists) {
        // 同じ時間帯の予定が既に存在するためスキップ
        Logger.log(`Skipped event '${newTitle}' due to time conflict from ${eventStartTime} to ${eventEndTime}`);
      }
    });
  });
}