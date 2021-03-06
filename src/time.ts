export const findUTCOffset = (gmt: number): number => {
  const diff = gmt / 3600;
  return diff;
}

export const formatAMPM = (diff: number): string => {
 const date = new Date();
 const utcHours = date.getUTCHours();
 const timezoneMinutes = diff % 1;
 const hoursDiff = diff - timezoneMinutes;
 let hoursSum = utcHours + hoursDiff;
 if (hoursSum < 0) hoursSum = 24 + hoursSum;
 let hours: string | number = hoursSum % 12;
 const utcMinutes = date.getUTCMinutes();
 const minutesOnClock = timezoneMinutes * 60;
 const minutesDiff = utcMinutes + minutesOnClock;
 let minutes: string | number = 0;
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
 if ((hoursCount > 12 && hoursCount < 23) || (hoursCount === 0 && minutesDiff < 0) || (hoursCount === 11 && minutesDiff >= 60) || (hoursCount === 12 && minutesDiff >= 0) || (hoursCount === 23 && minutesDiff < 60)) {
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

export const formatMT = (diff: number): string => {
  const date = new Date();
  const utcHours = date.getUTCHours();
  const timezoneMinutes = diff % 1;
  const hoursDiff = diff - timezoneMinutes;
  let hoursSum = utcHours + hoursDiff;
  if (hoursSum < 0) hoursSum = 24 + hoursSum;
  let hours: string | number = hoursSum % 24;
  const utcMinutes = date.getUTCMinutes();
  const minutesOnClock = timezoneMinutes * 60;
  const minutesDiff = utcMinutes + minutesOnClock;
  let minutes: string | number = 0;
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