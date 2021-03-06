declare const TrelloPowerUp: any;
declare const moment: any;
declare const Pikaday: any;
declare const axios: any;

import { setItems, getUsers } from './trello-util';

const t = TrelloPowerUp.iframe();
const checklistItems = t.arg('checklistItems');
const index = t.arg('index');
const now = moment().toDate();
let picker;
const TIME_FORMAT = 'LT';

const url = 'https://checklist-notifications.herokuapp.com';

const resize = function (): void {
  t.sizeTo('.dpicker-widget');
};

// To change the names of the buttons (as they were too long)
const i18n = {
  previousMonth: 'Prev',
  nextMonth: 'Next',
  months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
};

// https://gist.github.com/jed/982883
const generateUuid = function (): string { return ("" + 1e7 + -1e3 + -4e3 + -8e3 + -1e11).replace(/1|0/g, function () { return (0 | Math.random() * 16).toString(16); }); };

t.render(function () {
  const dueDate = checklistItems[index].dueDate;
  if (dueDate) {
    document.getElementById('remove-btn').classList.remove('u-hidden');
  }

  if (!picker) {
    const defaultDate = dueDate ? moment.unix(dueDate / 1000).toDate() : now;
    console.log('duedate', dueDate);

    if (dueDate) {
      const timeInput = document.getElementById('time-input') as HTMLInputElement;
      timeInput.value = moment(dueDate).format(TIME_FORMAT);
    }

    picker = new Pikaday({
      bound: false,
      format: 'MM/DD/YYYY',
      defaultDate,
      setDefaultDate: true,
      container: document.getElementById('datepicker'),
      field: document.getElementById('date-input'),
      keyboardInput: false, // otherwise all arrow key presses while pop-up is open change the date
      i18n,
      onDraw: function (): void {
        resize();
      }
    });
  }

  getUsers(t).then((users) => {
    if (users && users.length > 0) {
      document.getElementById('set-notifications').style.display = 'block';
      document.getElementById('notification-settings').style.display = 'block';
    } else {
      document.getElementById('notification-setup').style.display = 'block';
    }
  });
});

const getNotificationTime = (dueDate: number, minutes: number): string | null => {
  const notificationTime = (dueDate - minutes * 60 * 1000);
  if (moment.utc().valueOf() < notificationTime) {
    return notificationTime.toString();
  } else {
    return null; // Return null if the notification time was in the past
  }
};

const getAndSetNotification = (dueTimeInSeconds: number, minutes: number): Promise<void> => {
  const username = checklistItems[index].username;

  if (minutes > -1 && username) {
    const { userId, text, id } = checklistItems[index];
    const { card: cardId, board: boardId } = t.getContext();

    const itemId = id ? id : generateUuid();

    const dueTime = dueTimeInSeconds * 1000;

    const notificationTime: string | null = getNotificationTime(dueTime, minutes);
    if (notificationTime !== null) {
      const data = new URLSearchParams({ itemId, cardId, boardId, username, userId, item: text, dueTime: dueTime.toString(), notificationTime });
      return axios({ method: 'post', url: `${url}/notification`, data });
    }
  }

  return Promise.resolve();
};

document.getElementById('time-input').onblur = (): void => {
  const timeInput = document.getElementById('time-input') as HTMLTextAreaElement;
  if (!moment(timeInput.value, TIME_FORMAT).isValid()) {
    timeInput.value = '12:00 PM';
  }
};

document.getElementById('save-btn').addEventListener('click', function () {
  const timeInput = document.getElementById('time-input') as HTMLTextAreaElement;
  let timeMoment = moment(timeInput.value, TIME_FORMAT);
  if (!timeMoment.isValid()) {
    timeMoment = moment('12:00 PM', TIME_FORMAT);
  }
  const unixTimeInSeconds = picker.getMoment().hour(timeMoment.hour()).minute(timeMoment.minute()).unix();

  const displayDate = picker.getMoment().hour(timeMoment.hour()).minute(timeMoment.minute()).format('D MMM h:mm A');
  checklistItems[index].dueDate = unixTimeInSeconds * 1000;
  checklistItems[index].dueDateFriendly = displayDate;

  const select = document.getElementById('reminder-select') as HTMLSelectElement;
  checklistItems[index].notificationOffset = select.value;

  getAndSetNotification(unixTimeInSeconds, parseInt(select.value, 10)).then(() => {
    setItems(t, checklistItems).then(() => {
      t.closePopup();
    });
  }).catch(() => {
    console.log("Error setting notification");
    // TODO: error handling for notification failure (?)
  });
});

document.getElementById('remove-btn').addEventListener('click', function () {
  checklistItems[index].dueDate = undefined;
  checklistItems[index].dueDateFriendly = undefined;

  setItems(t, checklistItems).then(() => {
    t.closePopup();
  });
});

const notificationsModal = function () {
  return t.modal({
    url: './notifications.html',
    height: 360,
    fullscreen: false,
    title: 'Checklist+ Notifications'
  });
};

document.getElementById('notification-setup').addEventListener('click', notificationsModal);
document.getElementById('notification-settings').addEventListener('click', notificationsModal);

