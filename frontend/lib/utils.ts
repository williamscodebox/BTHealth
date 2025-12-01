// this function will convert the createdAt to this format: "May 2023"

export function formatMemberSince(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return ""; // handle invalid date
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  });
  return formatter.format(date);
}

// this function will convert the createdAt to this format: "May 15, 2023"

export function formatPublishDate(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return ""; // handle invalid date
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return formatter.format(date);
}
