import { screens } from "./screens.js";
const deadlineFormElement = document.getElementById('date-input-form');
deadlineFormElement.addEventListener('submit', handleDeadlineSubmit);

const deadline = {
  type: 'dateTime',
};

function handleDeadlineSubmit(event) {
  event.preventDefault();
  const DEADLINE_MINIMUM_MILISECONDS = 60 * 60 * 1000;
  deadline.dateTime = new Date(event.target.elements.deadlineDate.value);
  deadline.title = event.target.elements.deadlineTitle.value;

  if (
    deadline.dateTime.getTime() - Date.now() <
    DEADLINE_MINIMUM_MILISECONDS
  ) {
    alert(
      'Please submit a deadline more than an hour into the future',
    );
    return;
  }

  window.scrollTo(0, 0);
  renderTimers();
}

function renderTimers() {
  //add css class used to hide date picker and show countdown timers
  document.body.classList.add('has-deadline');

  const countdownContainerElement = document.getElementById(
    'countdown-container',
  );

  const updaterFunctionList = [];

  screens.forEach((screen) => {
    const { screenElement, updateElement } = createScreen(screen);
    countdownContainerElement.append(screenElement);
    updaterFunctionList.push(updateElement);
  });

  const lastElement = createAboutScreen();
  countdownContainerElement.append(lastElement);

  tick(updaterFunctionList);
  setInterval(() => tick(updaterFunctionList), 1000);
}

function createScreen(item) {
  const screenElement = document
    .getElementById('screen-template')
    .content.firstElementChild.cloneNode(true);

  let itemToInsert = item.type === 'userDeadline' ? deadline : item;

  screenElement.querySelector('.screen-title').textContent =
    itemToInsert.title;
  const counterElement = screenElement.querySelector('.screen-counter');

  if (itemToInsert.type === 'text') {
    counterElement.remove();
    return { screenElement, updateElement: () => {} };
  }

  if (itemToInsert.type === 'deadlineTimeAddition') {
    itemToInsert.dateTime = new Date(
      deadline.dateTime.getTime() + itemToInsert.additionSeconds,
    );
  }

  function updateElement(dateTimeNow) {
    const secondsBetween = getSecondsBetween(
      dateTimeNow,
      itemToInsert.dateTime,
    );
    counterElement.textContent = formatSeconds(secondsBetween);
  }

  return { screenElement, updateElement };
}

function createAboutScreen() {
  const aboutScreenElement = document
    .getElementById('link-container-template')
    .content.firstElementChild.cloneNode(true);

  return aboutScreenElement;
}

function tick(updaterFunctionList) {
  updaterFunctionList.forEach((updaterFunction) =>
    updaterFunction(new Date()),
  );
}

function getSecondsBetween(dateNow, dateToCompare) {
  const MILISECONDS_PER_SECOND = 1000;
  const result = Math.floor(
    (dateToCompare.getTime() - dateNow.getTime()) / MILISECONDS_PER_SECOND,
  );
  
  return Math.abs(result);
}

function formatSeconds(timeString) {
  const SECONDS_PER_MINUTE = 60;
  const MINUTES_PER_HOUR = 60;
  const SECONDS_PER_HOUR = SECONDS_PER_MINUTE * MINUTES_PER_HOUR;

  const hours = Math.floor(timeString / SECONDS_PER_HOUR);
  const minutes = Math.floor(
    (timeString / SECONDS_PER_MINUTE) % MINUTES_PER_HOUR,
  );
  const seconds = Math.floor(timeString % SECONDS_PER_MINUTE);

  return `
    ${hours.toLocaleString()} hours | 
    ${minutes.toString().padStart(2, '0')} minutes | 
    ${seconds.toString().padStart(2, '0')} seconds
  `;
}