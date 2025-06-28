/**
 * GETアクセス時の処理
 */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('ui')
    .setTitle("業務ポータル")
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * ジョブリストを取得する
 * @returns 業務一覧のデータ
 */
function getJobList() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("業務一覧");
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const jobs = data.slice(1).map(row => {
    return {
      classification: row[0], // 業務分類
      id: row[1],             // 業務ID
      name: row[2],           // 業務名
      description: row[3],    // 説明
      api: row[4],            // API
      url: row[5],            // API_URL
    };
  });
  return jobs;
}

/**
 * 入力定義を取得する
 * @param {string} jobId
 * @returns 入力定義s
 */
function getInputDefinition(jobId) {
  const sheet = SpreadsheetApp.getActive().getSheetByName("業務入力定義");
  const values = sheet.getDataRange().getValues().slice(1);
  return values.filter(row => row[0] === jobId).map(row => ({
    field: row[1],
    label: row[2],
    type: row[3],
    required: row[4] === "○",
    options: row[5] ? row[5].split(",") : []
  }));
}


function executeJob(jobId, inputs) {
  const sheet = SpreadsheetApp.getActive().getSheetByName("業務一覧");
  const values = sheet.getDataRange().getValues();
  const header = values[0];
  const rows = values.slice(1);

  const apiIndex = header.indexOf("API_URL");
  const idIndex = header.indexOf("業務ID");

  const targetRow = rows.find(row => row[idIndex] === jobId);
  if (!targetRow) throw new Error("業務IDが見つかりません");

  const apiUrl = targetRow[apiIndex]; // ここが Web Apps の URL
  Logger.log(apiUrl);

  const response = UrlFetchApp.fetch(apiUrl, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(inputs),
    muteHttpExceptions: true,
    headers: {
      Authorization: `Bearer ${ScriptApp.getOAuthToken()}`
    }
  });
  Logger.log(response);

  const json = JSON.parse(response.getContentText());
  return typeof json.result === 'string' ? json.result : JSON.stringify(json.result, null, 2);

}



