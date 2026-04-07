function onOpen() {
  var ui = SpreadsheetApp.getUi();

  ui.createMenu("🎓 Registrar System")
    .addItem("➕ Add Student", "addStudentPrompt")
    .addItem("🆔 Generate ID", "generateID")
    .addSeparator()
    .addItem("📋 Check Missing Docs", "checkMissingDocs")
    .addItem("📧 Send Notifications", "sendNotifications")
    .addToUi();
}

function addStudentPrompt() {
  var ui = SpreadsheetApp.getUi();

  var name = ui.prompt("Enter Student Name").getResponseText();
  var grade = ui.prompt("Enter Grade").getResponseText();

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Students");

  sheet.appendRow([
    "", // ID (auto)
    name,
    grade,
    "",
    "NO", // Paid
    "NO", // Birth Cert
    "NO", // Form 137
    "NO"  // Good Moral
  ]);

  ui.alert("Student Added!");
}

function generateID() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Students");
  var lastRow = sheet.getLastRow();

  for (var i = 2; i <= lastRow; i++) {
    var idCell = sheet.getRange(i, 1);
    if (idCell.getValue() == "") {
      idCell.setValue("STU-" + i);
    }
  }

  SpreadsheetApp.getUi().alert("IDs Generated!");
}

function checkMissingDocs() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Students");
  var data = sheet.getDataRange().getValues();

  var result = "";

  for (var i = 1; i < data.length; i++) {
    var name = data[i][1];
    var paid = data[i][4];
    var birth = data[i][5];
    var form137 = data[i][6];
    var good = data[i][7];

    var missing = [];

    if (paid != "YES") missing.push("Not Paid");
    if (birth != "YES") missing.push("Birth Cert");
    if (form137 != "YES") missing.push("Form 137");
    if (good != "YES") missing.push("Good Moral");

    if (missing.length > 0) {
      result += name + " ➜ " + missing.join(", ") + "\n";
    }
  }

  if (result == "") {
    result = "All students are complete ✅";
  }

  SpreadsheetApp.getUi().alert(result);
}

function sendNotifications() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Students");
  var data = sheet.getDataRange().getValues();

  for (var i = 1; i < data.length; i++) {
    var name = data[i][1];
    var paid = data[i][4];

    if (paid != "YES") {
      MailApp.sendEmail({
        to: "parent@email.com", // replace with real column later
        subject: "Payment Reminder",
        body: "Hello! " + name + " has unpaid tuition."
      });
    }
  }

  SpreadsheetApp.getUi().alert("Notifications Sent!");
}
