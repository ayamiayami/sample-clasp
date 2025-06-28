function runScheduledJobs() {

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("スケジュール");
  const data = sheet.getRange(2,1,sheet.getLastRow() - 1,sheet.getLastColumn()).getValues();
  const now = new Date();
  const currentTime = Utilities.formatDate(now, Session.getScriptTimeZone(), "HH:mm");
  const todayStr = Utilities.formatDate(now, Session.getScriptTimeZone(), "yyyy-MM-dd");

  for (let i = 1; i < data.length; i++) {
    let [jobId, type, scheduledTime, scheduledDate, repeat, status] = data[i];
    Logger.log(jobId);
    Logger.log(scheduledDate);
    if(scheduledDate == ''){
      scheduledDate = null;
    }else{
      scheduledDate = Utilities.formatDate(new Date(scheduledDate), Session.getScriptTimeZone(), "yyyy-MM-dd");
    }
    
    scheduledTime = Utilities.formatDate(new Date(scheduledTime), Session.getScriptTimeZone(), "HH:mm");
    Logger.log(`scheduledDate:${scheduledDate}`);
    Logger.log(`scheduledTime:${scheduledTime}`);

    // 実行済みはスキップ
    if (status === 'DONE') continue;

    // 実行条件チェック
    const isToday = scheduledDate == null || scheduledDate === todayStr;
    const isTimeMatch = scheduledTime === currentTime;
    Logger.log(`todayStrは${todayStr} / currentTimeは${currentTime}`);
    Logger.log(`isTodayは${isToday} / isTimeMatchは${isTimeMatch}`);

    if (type === 'time' && isToday && isTimeMatch) {
      try {
        // 業務実行関数を呼び出し（jobId = 関数名と仮定）
        const jobFunc = this[jobId];
        Logger.log(`${jobFunc} / ${typeof jobFunc}`);
        
        if (typeof jobFunc === 'function') {
          jobFunc(); // 関数呼び出し
          sheet.getRange(i + 1, 6).setValue("DONE");
        } else {
          sheet.getRange(i + 1, 6).setValue("ERROR: No such function");
        }

        // dailyの場合は再スケジュール
        if (repeat === 'daily') {
          sheet.getRange(i + 1, 6).setValue("WAIT"); // 実行フラグを戻す
        }

      } catch (e) {
        sheet.getRange(i + 1, 6).setValue("ERROR: " + e.message);
      }
    }
  }
}


function job_sendReport() {
  Logger.log("📤 レポート送信処理を実行中...");
  // ここに処理を書く（例：スプレッドシートをPDF化しメール送信など）
}

function job_backupDB() {
  Logger.log("💾 DBバックアップ処理を実行中...");
  // ここに処理を書く（例：Cloud Functions呼び出しなど）
}

