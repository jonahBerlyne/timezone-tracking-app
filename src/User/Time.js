export const findUTCOffset = gmt => {
  const initDiff = gmt / 3600;
  const roundedDiff = Math.floor(initDiff);
  return roundedDiff;
}

export const formatAMPM = diff => {
 const date = new Date();
 let hours = date.getUTCHours() + diff;
 if (hours > 23) {
  const hoursDiff = 24 - date.getUTCHours();
  diff = diff - hoursDiff;
  hours = diff;
 }
 const ampm = hours >= 12 ? 'pm' : 'am';
 hours = hours % 12;
 hours = hours ? hours : 12;
 let minutes = date.getMinutes();
 minutes = minutes < 10 ? `0${minutes}` : minutes;
 const strTime = `${hours}:${minutes}${ampm}`;
 return strTime;
}