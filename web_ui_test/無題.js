function callJobScriptAPI() {
  const token = ScriptApp.getOAuthToken();
  const projectScriptId = '1CT6apmOdLxkcV-JOecI9RrWI-BXF5Gg-Eh8CJOGRjZdo75Vdb5WKuzAy';
  const functionName = 'myFunction';
  const url = `https://script.googleapis.com/v1/scripts/${projectScriptId}:run`;

  const payload = {
    function: functionName,
    parameters: [], // 必要があれば引数を渡す
    devMode: true
  };

  const options = {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    const json = JSON.parse(response.getContentText());
    Logger.log(json);

    // const isSuccess = response.getResponseCode() === 200 && !json.error;
    // const newStatus = isSuccess ? "WAIT" : "ERROR";
    // const nextDate = computeNextDate();  // 後述の関数で次回日付を算出
    // const now = new Date();
    // const formattedTime = Utilities.formatDate(now, Session.getScriptTimeZone(), "HH:mm");

    // // ステータス・日付・時間を更新
    // sheet.getRange(rowIndex, 6).setValue(newStatus);       // F列：ステータス
    // sheet.getRange(rowIndex, 4).setValue(nextDate);        // D列：次回日付
    // sheet.getRange(rowIndex, 3).setValue(formattedTime);   // C列：次回時間（例として今と同じ時刻）

    // Logger.log(`Job ${functionName} executed: ${newStatus}`);
  } catch (e) {
    sheet.getRange(rowIndex, 6).setValue("ERROR: " + e.message);
  }
}
