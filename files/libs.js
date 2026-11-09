/**
 * 予定が同期の対象外であるかを判定します。
 */
 function isExcludedEvent(event, myKey) {
	const title = event.getTitle();
	const prefixes = ['info_', '非同期_', 'todo_'];
	const suffixes = ['_info', '_非同期', '_todo', '_' + myKey + '_synced'];
  
	if (event.isAllDayEvent()) {
	  Logger.log(`Skipped all-day event: ${title}`);
	  return true;
	}

	// 30分単位から1分ずらした予定（xx:01・xx:31開始、xx:29・xx:59終了）は同期しない
	if (event.getStartTime().getMinutes() % 30 === 1 || event.getEndTime().getMinutes() % 30 === 29) {
	  Logger.log(`Skipped event shifted by 1 minute: ${title}`);
	  return true;
	}

	for (const prefix of prefixes) {
	  if (title.startsWith(prefix)) {
		Logger.log(`Skipped event with prefix '${prefix}': ${title}`);
		return true;
	  }
	}
  
	for (const suffix of suffixes) {
		if (title.endsWith(suffix)) {
		Logger.log(`Skipped event with suffix '${suffix}': ${title}`);
		return true;
	  }
	}
  
	return false;
  }

  function getHashedDescriptionForPrivatePlan(originalTitle, eventStartTime, eventEndTime, sourceCalendarEmail) {
    const eventHash = Utilities.base64Encode(
      Utilities.newBlob(
        originalTitle + eventStartTime.getTime() + eventEndTime.getTime() + sourceCalendarEmail
          ).getBytes()
      );
    return `_hash:${eventHash}_`;
  }