export const findUTCOffset = gmt => {
  console.clear();
  const diff = gmt / 3600;
  console.log(Math.floor(diff) < diff < Math.ceil(diff)); // True for float zones, false for int zones
  console.log((diff - Math.floor(diff))*60); // 30/45 for float zones, 0 for int zones
  return diff;
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