export const formatDateDisplay = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Reset time to compare dates only
  const resetTime = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const resetDate = resetTime(date);
  const resetToday = resetTime(today);
  const resetYesterday = resetTime(yesterday);

  if (resetDate.getTime() === resetToday.getTime()) {
    return 'Today';
  } else if (resetDate.getTime() === resetYesterday.getTime()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  }
};