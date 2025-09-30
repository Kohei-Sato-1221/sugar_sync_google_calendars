/**
 * 同期元のカレンダーに存在するが、同期先に存在しない予定を作成します。
 */
function processSourceEvents(sourceCalendarEmails, destCalendar, privatePlan, startTime, endTime) {
  const myEmail = Session.getActiveUser().getEmail(); // スクリプト実行者のメールアドレスを取得
  const myKey = getKeyByEmail(myEmail);
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
      
      const originalTitle = event.getTitle();
      let originalDescription = event.getDescription();
      const eventStartTime = event.getStartTime();
      const eventEndTime = event.getEndTime();

      let newTitle;
      let newDescription;
      
      if (privatePlan) {
        newTitle = '🙅‍♂️ Block' + '_' + sourceKey + '_synced';
        newDescription = getHashedDescriptionForPrivatePlan(originalTitle, eventStartTime, eventEndTime, sourceCalendarEmail)
      } else {
        newTitle = originalTitle + '_' + sourceKey + '_synced';
        
        const attendees = event.getGuestList();
        const attendeeEmails = attendees.map(attendee => attendee.getEmail());
        const attendeesString = '----------------------\n【参加者】:\n' + attendeeEmails.join(', ');

        if (originalDescription) {
          newDescription = originalDescription + '\n\n' + attendeesString;
        } else {
          newDescription = attendeesString;
        }
      }

      const existingEvents = destCalendar.getEvents(eventStartTime, eventEndTime);
      
      // 同じ時間帯の予定がすでに存在するかをチェックする新しいロジック
      const sameTimeEventExists = existingEvents.some(existingEvent => {
        const existingStartTime = existingEvent.getStartTime().getTime();
        const existingEndTime = existingEvent.getEndTime().getTime();
        const newStartTime = eventStartTime.getTime();
        const newEndTime = eventEndTime.getTime();
        
        // 既存の予定が新しい予定の開始・終了時刻と完全に一致する場合
        return existingStartTime === newStartTime && existingEndTime === newEndTime;
      });

      if (!sameTimeEventExists) {
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
