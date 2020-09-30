export const toDate = date => {
  const d = new Date(date);
  const options = {year: 'numeric', month: 'short', day: '2-digit'};
  return d.toLocaleDateString("en-IN", options);
}