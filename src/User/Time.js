export const findUTCOffset = gmt => {
  // console.clear();
  const diff = gmt / 3600;
  // console.log(Math.floor(diff) < diff < Math.ceil(diff)); // True for float zones, false for int zones
  // console.log((diff - Math.floor(diff))*60); // 30/45 for float zones, 0 for int zones
  return diff;
}

export const formatAMPM = diff => {
 const date = new Date();
 const utcHours = date.getUTCHours();
 const timezoneMinutes = diff % 1;
 const hoursDiff = diff - timezoneMinutes;
 const hoursSum = utcHours + hoursDiff;
 let hours = hoursSum % 12;
 const utcMinutes = date.getUTCMinutes();
 const minutesOnClock = timezoneMinutes * 60;
 const minutesDiff = utcMinutes + minutesOnClock;
 let minutes = 0;
 if (utcMinutes !== minutesDiff) {
   if (minutesDiff >= 60) {
     minutes = minutesDiff - 60;
     hours++;
    } else if (minutesDiff < 0) {
      minutes = 60 + minutesDiff;
      hours > 0 ? hours-- : hours = 11;
    } else {
      minutes = minutesDiff;
    }
 } else {
   minutes = utcMinutes;
 }
 const hoursCount = hoursSum % 24;
 let ampm = "";
 if ((hoursCount > 12 && hoursCount < 23) || (hoursCount === 0 && minutesDiff < 0) || (hoursCount === 12 && minutesDiff >= 0) || (hoursCount === 23 && minutesDiff < 60)) {
  ampm = "pm";
 } else {
   ampm = "am";
 }
 if (hours === 0) hours = 12;
 hours = hours < 10 ? `0${hours}` : hours;
 minutes = minutes < 10 ? `0${minutes}` : minutes;
 const strTime = `${hours}:${minutes}${ampm}`;
 return strTime;
}

export const formatMT = diff => {
  const date = new Date();
  const utcHours = date.getUTCHours();
  const timezoneMinutes = diff % 1;
  const hoursDiff = diff - timezoneMinutes;
  const hoursSum = utcHours + hoursDiff;
  let hours = hoursSum % 24;
  const utcMinutes = date.getUTCMinutes();
  const minutesOnClock = timezoneMinutes * 60;
  const minutesDiff = utcMinutes + minutesOnClock;
  let minutes = 0;
  if (utcMinutes !== minutesDiff) {
   if (minutesDiff >= 60) {
     minutes = minutesDiff - 60;
     hours++;
    } else if (minutesDiff < 0) {
      minutes = 60 + minutesDiff;
      hours > 0 ? hours-- : hours = 23;
    } else {
      minutes = minutesDiff;
    }
  } else {
    minutes = utcMinutes;
  }
  if (hours === 24) hours = 0;
  hours = hours < 10 ? `0${hours}` : hours;
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  const strTime = `${hours}:${minutes}`;
  return strTime;
}