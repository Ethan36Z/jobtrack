export type FollowUpStatus = "overdue" | "today" | "upcoming" | "no-date";

export function getFollowUpStatus(followUpDate: string | null): FollowUpStatus {
  if (!followUpDate) {
    return "no-date";
  }

  const followUpDay = parseApiDateAsLocalDay(followUpDate);
  const today = startOfLocalDay(new Date());

  if (followUpDay.getTime() < today.getTime()) {
    return "overdue";
  }

  if (followUpDay.getTime() === today.getTime()) {
    return "today";
  }

  return "upcoming";
}

export function getFollowUpLabel(status: FollowUpStatus) {
  const labels: Record<FollowUpStatus, string> = {
    overdue: "Overdue",
    today: "Today",
    upcoming: "Upcoming",
    "no-date": "No date"
  };

  return labels[status];
}

export function compareFollowUps(aDate: string | null, bDate: string | null) {
  const statusOrder: Record<FollowUpStatus, number> = {
    overdue: 0,
    today: 1,
    upcoming: 2,
    "no-date": 3
  };
  const aStatus = getFollowUpStatus(aDate);
  const bStatus = getFollowUpStatus(bDate);
  const statusDifference = statusOrder[aStatus] - statusOrder[bStatus];

  if (statusDifference !== 0) {
    return statusDifference;
  }

  if (!aDate && !bDate) {
    return 0;
  }

  if (!aDate) {
    return 1;
  }

  if (!bDate) {
    return -1;
  }

  return parseApiDateAsLocalDay(aDate).getTime() - parseApiDateAsLocalDay(bDate).getTime();
}

function startOfLocalDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function parseApiDateAsLocalDay(date: string) {
  const [year, month, day] = date.slice(0, 10).split("-").map(Number);

  return new Date(year, month - 1, day);
}
