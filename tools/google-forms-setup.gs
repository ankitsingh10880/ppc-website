/**
 * Public Policy Club website: Google Forms setup
 *
 * Creates the two forms the website posts to:
 *   - "PPC Website: Contact"     (Name, Email, Topic, Message)
 *   - "PPC Website: Newsletter"  (Email)
 * links each one to its own response Sheet, and emails every Contact
 * message to the club inbox with Reply-To set to the sender.
 *
 * HOW TO RUN (from the club Google account):
 *   1. Go to script.google.com > New project. Paste this whole file in place
 *      of the sample code. Name the project "PPC Website Forms".
 *   2. Choose setupForms in the function menu at the top > Run.
 *   3. Allow the permissions Google asks for (Advanced > Go to project > Allow).
 *   4. The execution log (and an email to you) shows the setup details.
 *      Send them to whoever updates the website.
 *
 * Safe to run again: it reuses the forms it already made instead of making
 * new ones. Do not rename or delete the questions in either form; the email
 * below reads them by title and the website by their entry IDs.
 */

var CLUB_INBOX = "publicpolicyclub@fms.edu";

// Must match the <option>s of the Topic dropdown in contact.html exactly.
var TOPICS = [
  "General question",
  "Joining the club",
  "Speaking at an event",
  "Partnership or sponsorship",
  "Writing for the journal"
];

/* ---------- Run this once ---------- */
function setupForms() {
  var props = PropertiesService.getScriptProperties();
  var contact = getOrCreate_(props, "CONTACT_FORM_ID", buildContactForm_);
  var newsletter = getOrCreate_(props, "NEWSLETTER_FORM_ID", buildNewsletterForm_);
  installContactTrigger_(contact);

  var details = {
    contact: describe_(contact, {
      Name: "Test name", Email: "test@example.com", Topic: TOPICS[0], Message: "Test message"
    }),
    newsletter: describe_(newsletter, { Email: "test@example.com" })
  };
  var text = JSON.stringify(details, null, 2);
  Logger.log(text);

  var me = Session.getActiveUser().getEmail() || CLUB_INBOX;
  MailApp.sendEmail(me, "PPC website forms: setup details",
    "Both forms are ready. Send the details below to whoever updates the website.\n\n" + text);
}

/* ---------- Runs automatically on every Contact submission ---------- */
function onContactSubmit(e) {
  var d = {};
  e.response.getItemResponses().forEach(function (r) {
    d[r.getItem().getTitle()] = r.getResponse();
  });
  var name = d.Name || "Someone";
  var email = d.Email || "";
  var topic = d.Topic || "General question";
  var mail = {
    to: CLUB_INBOX,
    name: "PPC Website",
    subject: "Website message: " + topic + " — " + name,
    body: "Name: " + name + "\nEmail: " + email + "\nTopic: " + topic +
          "\n\n" + (d.Message || "") +
          "\n\n—\nSent from the Contact form on the PPC website. Reply to this email to answer " + name + "."
  };
  if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) mail.replyTo = email;
  MailApp.sendEmail(mail);
}

/* ---------- Form definitions ---------- */
function buildContactForm_() {
  var form = FormApp.create("PPC Website: Contact");
  form.setDescription("Messages from the Contact page of the Public Policy Club website. " +
    "Don't rename or delete these questions: the website and the email alert depend on them.");
  form.addTextItem().setTitle("Name").setRequired(true);
  form.addTextItem().setTitle("Email").setRequired(true);
  form.addListItem().setTitle("Topic").setChoiceValues(TOPICS).setRequired(false);
  form.addParagraphTextItem().setTitle("Message").setRequired(true);
  form.setConfirmationMessage("Thanks, your message has been sent. We'll reply within a week.");
  applySettings_(form, "PPC Website: Contact (responses)");
  return form;
}

function buildNewsletterForm_() {
  var form = FormApp.create("PPC Website: Newsletter");
  form.setDescription("Sign-ups for the Article of the Week from the Public Policy Club website footer. " +
    "Don't rename or delete the question: the website depends on it.");
  form.addTextItem().setTitle("Email").setRequired(true);
  form.setConfirmationMessage("You're subscribed. Look out for the next Article of the Week.");
  applySettings_(form, "PPC Website: Newsletter (responses)");
  return form;
}

// Settings the website needs: anyone can submit, no sign-in, no Google-collected email.
function applySettings_(form, sheetName) {
  try { form.setEmailCollectionType(FormApp.EmailCollectionType.DO_NOT_COLLECT); }
  catch (err) { form.setCollectEmail(false); }
  try { form.setRequireLogin(false); } catch (err) {}   // only exists on Workspace accounts
  try { form.setPublished(true); } catch (err) {}       // newer accounts create forms unpublished
  form.setLimitOneResponsePerUser(false);
  form.setAllowResponseEdits(false);
  form.setAcceptingResponses(true);
  var sheet = SpreadsheetApp.create(sheetName);
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());
}

/* ---------- Helpers ---------- */
function getOrCreate_(props, key, build) {
  var id = props.getProperty(key);
  if (id) {
    try { return FormApp.openById(id); } catch (err) { /* deleted: make a new one */ }
  }
  var form = build();
  props.setProperty(key, form.getId());
  return form;
}

function installContactTrigger_(form) {
  var exists = ScriptApp.getProjectTriggers().some(function (t) {
    return t.getHandlerFunction() === "onContactSubmit" && t.getTriggerSourceId() === form.getId();
  });
  if (!exists) ScriptApp.newTrigger("onContactSubmit").forForm(form).onFormSubmit().create();
}

// Builds a pre-filled link (nothing is submitted) to read each question's entry ID.
function describe_(form, sample) {
  var response = form.createResponse();
  form.getItems().forEach(function (item) {
    var value = sample[item.getTitle()];
    if (value == null) return;
    var type = item.getType();
    if (type === FormApp.ItemType.TEXT) response.withItemResponse(item.asTextItem().createResponse(value));
    else if (type === FormApp.ItemType.PARAGRAPH_TEXT) response.withItemResponse(item.asParagraphTextItem().createResponse(value));
    else if (type === FormApp.ItemType.LIST) response.withItemResponse(item.asListItem().createResponse(value));
  });
  var prefilled = response.toPrefilledUrl();
  var fields = {};
  prefilled.replace(/entry\.(\d+)=([^&]*)/g, function (match, id, raw) {
    var value = decodeURIComponent(raw.replace(/\+/g, " "));
    Object.keys(sample).forEach(function (title) {
      if (sample[title] === value) fields[title] = "entry." + id;
    });
  });
  return {
    action: form.getPublishedUrl().replace(/\/viewform.*$/, "/formResponse"),
    fields: fields,
    editForm: form.getEditUrl(),
    responsesSheet: SpreadsheetApp.openById(form.getDestinationId()).getUrl(),
    prefilledLink: prefilled
  };
}
