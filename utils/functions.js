export const toDate = date => {
  const d = new Date(date);
  const options = {year: 'numeric', month: 'short', day: '2-digit'};
  return d.toLocaleDateString("en-IN", options);
}

export const toDays = (date1, date2) => {
  const Difference_In_Time = date2.getTime() - date1.getTime();
  return parseInt(Math.floor(Difference_In_Time / (1000 * 3600 * 24)));
}