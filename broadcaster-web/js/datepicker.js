/*
 * Refactor JSX
 * From https://medium.com/swlh/build-a-date-picker-in-15mins-using-javascript-react-from-scratch-f6932c77db09
 * Into vanilla JS for project
 */
let afterdate ;
let aftertimestamp;
  days = [
    "П",
    "В",
    "С",
    "Ч",
    "П",
    "С",
    "Н"
  ],
  months = [
    "Січень",
    "Лютий",
    "Березень",
    "Квітень",
    "Травень",
    "Червень",
    "Липень",
    "Серпень",
    "Вересень",
    "Жовтень",
    "Листопад",
    "Грудень"
  ];

let oneDay = 60 * 60 * 24 * 1000;
function getTimestampfromday(datestring){
  return new Date(datestring).getTime() - ( new Date(datestring).getTime()  % oneDay) + new Date().getTimezoneOffset() * 1000 * 60;
}
let todayTimestamp =
  Date.now() -
  (Date.now() % oneDay) +
  new Date().getTimezoneOffset() * 1000 * 60
  let selectedDay = todayTimestamp;

// console.log(selectedDay); // Str in millisec

// Get num of days in month
// month param 0-11
const getNumberOfDays = (year, month) => {
  return 40 - new Date(year, month, 40).getDate();
};
// getNumberOfDays(2023, 1);

// Calc day details
function datepicker_init(calendar, input, calMonthTitle, calYearTitle,calDays){
  
  if (aftertimestamp === undefined){
    console.log("no timestamp");
  }else{
    console.log(aftertimestamp);
    selectedDay = aftertimestamp;
    todayTimestamp = aftertimestamp;
  }
const getDayDetails = (args) => {
  let date = args.index - args.firstDay;
  let day = args.index % 7;
  // console.log(day)
  let prevMonth = args.month - 1;
  let prevYear = args.year;
  if (prevMonth < 0) {
    prevMonth = 11;
    prevYear--;
  }
  let prevMonthNumberOfDays = getNumberOfDays(prevYear, prevMonth);

  let _date =
    (date < 0 ? prevMonthNumberOfDays + date : date % args.numberOfDays) + 1;
  //console.log(_date)
  let month = date < 0 ? -1 : date >= args.numberOfDays ? 1 : 0;
  let timestamp = new Date(args.year, args.month, _date).getTime();
  // console.log(timestamp)
  return {
    date: _date,
    day,
    month,
    timestamp,
    dayString: days[day]
  };
};

// [{}] each {} with details for each day of month
const getMonthDetails = (year, month) => {
  let firstDay = new Date(year, month).getDay();
  let numberOfDays = getNumberOfDays(year, month);
  let monthArray = [];
  let rows = 5;
  let currentDay = null;
  let index = 0;
  let cols = 7;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      currentDay = getDayDetails({
        index,
        numberOfDays,
        firstDay,
        year,
        month
      });
      monthArray.push(currentDay);
      index++;
    }
  }
  return monthArray;
};
// getMonthDetails(2023, 3)

// Variables that get updated with "state" changes
let date;
if (aftertimestamp === undefined){
date = new Date();}
else{
date = new Date(afterdate);
}
let year = date.getFullYear();
let month = date.getMonth();
let monthDetails = getMonthDetails(year, month);

const isCurrentDay = (day, cell) => {
  if (day.timestamp === todayTimestamp) {
    cell.classList.add("active");
    cell.classList.add("isSelected");

  }
};

// Checks if day is one selected
const isSelectedDay = (day, cell) => {
  if (day.timestamp === selectedDay) {
    cell.classList.add("active");
    cell.classList.add("isSelected");
  }
};

// Get month str
const getMonthStr = (month) =>
  months[Math.max(Math.min(11, month), 0)] || "Month";
// console.log(getMonthStr(month))

// Set year using arrows
const setHeaderNav = (offset) => {
  month = month + offset;
  if (month === -1) {
    month = 11;
    year--;
  } else if (month === 12) {
    month = 0;
    year++;
  }
  monthDetails = getMonthDetails(year, month);
  // console.log(getMonthDetails(year, month))
  return {
    year,
    month,
    monthDetails
  };
};
const setYear = (offset) => {
  year+= offset;
   monthDetails = getMonthDetails(year, month);
  // console.log(getMonthDetails(year, month))
  return {
    year,
    month,
    monthDetails
  };
}

// Set dynamic calendar header
const setHeader = (year, month) => {
  calMonthTitle.innerHTML = getMonthStr(month);
  calYearTitle.innerHTML = year
};

// Set calendar header
setHeader(year, month);

// 1677139200000 => "2023-02-23"
const getDateStringFromTimestamp = (timestamp) => {
  let dateObject = new Date(timestamp);
  let month = dateObject.getMonth() + 1;
  if (month < 10) { month = "0" + month}
  let date = dateObject.getDate();
  if (date < 10) {date = "0" + date}
  let year = dateObject.getFullYear();
  aftertimestamp = timestamp;
afterdate = year+"-"+month +"-"+date;
  // return (
  //   dateObject.getFullYear() +
  //   "-" +
  //   (month < 10 ? "0" + month : month) +
  //   "-" +
  //   (date < 10 ? "0" + date : date)
  // );
  return afterdate ;
};

const setDateToInput = (timestamp) => {
  let dateString = getDateStringFromTimestamp(timestamp);
  $("#date").val(dateString)
};
if (afterdate === undefined){
setDateToInput(todayTimestamp);}
else{
  input.value = afterdate;
}

// Add days row to calendar
for (let i = 0; i < days.length; i++) {
  let div = document.createElement("div"),
    span = document.createElement("span");

  div.classList.add("cell_wrapper");
  // div.classList.add("cal_days");
  span.classList.add("cell_item");

  span.innerText = days[i].slice(0, 2);

  div.appendChild(span);
  calDays.appendChild(div);
}

// Add dates to calendar
const setCalBody = (monthDetails) => {
  // Add dates to calendar
  for (let i = 0; i < monthDetails.length; i++) {
    let div = document.createElement("div"),
      span = document.createElement("span");

    div.classList.add("cell_wrapper");
    div.classList.add("cal_date");
    monthDetails[i].month === 0 && div.classList.add("current");
    monthDetails[i].month === 0 && isCurrentDay(monthDetails[i], div);
    span.classList.add("cell_item");

    span.innerText = monthDetails[i].date;

    div.appendChild(span);
    calendar.appendChild(div);
  }
};

setCalBody(monthDetails);

const updateCalendar = (btn) => {
  let newCal, offset;
  if (btn.classList.contains("back")) {
    // let { year, month, monthDetails } = setHeaderNav(-1);
    offset = -1;
      newCal = setHeaderNav(offset);

  } else if (btn.classList.contains("front")) {
    // let { year, month, monthDetails } = setHeaderNav(1);
    offset = 1;
      newCal = setHeaderNav(offset);

  }else if (btn.classList.contains("back-year")){
    newCal = setYear(-1);
  }
  else if (btn.classList.contains("front-year")){
    newCal = setYear(1);
  }
  // console.log(monthDetails)
  setHeader(newCal.year, newCal.month);
  calendar.innerHTML = "";
  setCalBody(newCal.monthDetails);
};

// Only one calendar date is selected
const selectOnClick = () => {
  document.querySelectorAll(".cell_wrapper").forEach((cell) => {
    cell.classList.contains("isSelected") && cell.classList.remove("active");

  
  });
};


const updateInput = () => {
  let currentDay = document.querySelector(".isCurrent");

  // Update input based on clicked cell
  document.querySelectorAll(".cell_wrapper").forEach((cell) => {
    if (cell.classList.contains("current")) {
      cell.addEventListener("click", (e) => {
        let cell_date = e.target.textContent;


        for (let i = 0; i < monthDetails.length; i++) {
          if (monthDetails[i].month === 0) {
            if (monthDetails[i].date.toString() === cell_date) {
              selectedDay = monthDetails[i].timestamp;
              setDateToInput(selectedDay);
              selectOnClick();
              isSelectedDay(monthDetails[i], cell);
              
              cell.querySelector('span').classList.contains('inactive_indicator') 
              && cell.querySelector('span').classList.remove('inactive_indicator');
            }
          }
        }
      });
    }
  });
};

updateInput();

// Set header nav actions
document.querySelectorAll(".cal-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    updateCalendar(btn);
    updateInput();
  });
});

input.addEventListener('click', () => {

  document.querySelector('#date').classList.toggle('onFocus');
});
}