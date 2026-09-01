/**
 * Produce nail — 予約フォーム受信用 Google Apps Script
 *
 * サイトの予約フォーム(index.html の #reservationForm)から送られた内容を受け取り、
 * このスクリプトを実行しているGoogleアカウントのメインカレンダーに予約を登録します。
 *
 * セットアップ手順は同フォルダの README.md を参照してください。
 */

// ▼ 新規予約が入るたびにメール通知を受け取りたいアドレス。不要なら空文字 '' にしてください。
var OWNER_EMAIL = 'your-email@gmail.com';

// ▼ 営業時間・メニューごとの所要時間(サイトの表示内容と合わせています)
//   定休日は不定休のため固定の曜日チェックはせず、ダブルブッキング確認(下記)のみで判定します。
var WEEKDAY_OPEN_HOUR = 10, WEEKDAY_OPEN_MIN = 0;    // 平日 営業開始 10:00
var WEEKDAY_CLOSE_HOUR = 21, WEEKDAY_CLOSE_MIN = 30; // 平日 営業終了 21:30
var WEEKEND_OPEN_HOUR = 9, WEEKEND_OPEN_MIN = 30;    // 土日祝 営業開始 9:30
var WEEKEND_CLOSE_HOUR = 20, WEEKEND_CLOSE_MIN = 0;  // 土日祝 営業終了 20:00

var MENU_DURATIONS = {
  'ワンカラー': 90,
  'フレンチ・グラデーション': 105,
  'デザインアート': 120,
  '甘皮ケア&ハンドマッサージ': 40,
  'パラフィンパック': 20
};

function doPost(e) {
  var output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);

  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error('リクエストが不正です。');
    }
    var data = JSON.parse(e.postData.contents);

    var name = (data.name || '').toString().trim();
    var phone = (data.phone || '').toString().trim();
    var email = (data.email || '').toString().trim();
    var menu = (data.menu || '').toString().trim();
    var dateStr = (data.date || '').toString().trim();
    var timeStr = (data.time || '').toString().trim();
    var notes = (data.notes || '').toString().trim();

    if (!name || !phone || !email || !menu || !dateStr || !timeStr) {
      throw new Error('必須項目が入力されていません。');
    }

    var start = new Date(dateStr + 'T' + timeStr + ':00+09:00');
    if (isNaN(start.getTime())) {
      throw new Error('日時の形式が正しくありません。');
    }

    // 過去日時は不可
    if (start.getTime() < Date.now()) {
      throw new Error('過去の日時は指定できません。');
    }

    // 営業時間チェック(土日祝は時間が異なるが、祝日はこのスクリプトだけでは判定できないため土日のみで判定)
    var day = start.getDay(); // 0=日, 6=土
    var isWeekend = day === 0 || day === 6;
    var openHour = isWeekend ? WEEKEND_OPEN_HOUR : WEEKDAY_OPEN_HOUR;
    var openMin = isWeekend ? WEEKEND_OPEN_MIN : WEEKDAY_OPEN_MIN;
    var closeHour = isWeekend ? WEEKEND_CLOSE_HOUR : WEEKDAY_CLOSE_HOUR;
    var closeMin = isWeekend ? WEEKEND_CLOSE_MIN : WEEKDAY_CLOSE_MIN;

    var h = start.getHours();
    var m = start.getMinutes();
    var afterOpen = h > openHour || (h === openHour && m >= openMin);
    var beforeClose = h < closeHour || (h === closeHour && m <= closeMin);
    if (!afterOpen || !beforeClose) {
      throw new Error('営業時間外です(平日10:00〜21:30・土日祝9:30〜20:00)。');
    }

    var durationMin = MENU_DURATIONS[menu] || 60;
    var end = new Date(start.getTime() + durationMin * 60000);

    // このスクリプトを実行しているアカウントのメインカレンダーを使用
    var cal = CalendarApp.getDefaultCalendar();

    // ダブルブッキング確認
    var conflicts = cal.getEvents(start, end);
    if (conflicts.length > 0) {
      throw new Error('その時間帯はすでにご予約が入っています。別の時間をお選びください。');
    }

    var title = '【WEB予約】' + name + '様 / ' + menu;
    var descLines = [
      'お名前: ' + name,
      '電話番号: ' + phone,
      'メール: ' + email,
      'メニュー: ' + menu
    ];
    if (notes) descLines.push('備考: ' + notes);
    var description = descLines.join('\n');

    cal.createEvent(title, start, end, { description: description });

    var formattedDate = Utilities.formatDate(start, 'Asia/Tokyo', 'yyyy/MM/dd HH:mm');

    // お客様への確認メール
    MailApp.sendEmail({
      to: email,
      subject: 'ご予約を承りました - Produce nail',
      body: name + ' 様\n\n' +
            'この度はご予約いただき誠にありがとうございます。\n' +
            '下記内容にて承りました。\n\n' +
            '日時: ' + formattedDate + ' 〜\n' +
            'メニュー: ' + menu + '\n\n' +
            '当日のご来店を心よりお待ちしております。\n\n' +
            'Produce nail'
    });

    // オーナーへの新規予約通知
    if (OWNER_EMAIL) {
      MailApp.sendEmail({
        to: OWNER_EMAIL,
        subject: '【新規WEB予約】' + name + '様 / ' + menu,
        body: description + '\n\n日時: ' + formattedDate + ' 〜'
      });
    }

    output.setContent(JSON.stringify({ result: 'success' }));
  } catch (err) {
    output.setContent(JSON.stringify({ result: 'error', message: err.message }));
  }

  return output;
}
