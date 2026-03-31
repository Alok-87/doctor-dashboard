import moment from "moment";

/**
 * Formats a UTC date string into a readable date (e.g. "12 Oct 2025")
 */
export function formatDateFromUTC(utcDate: string | Date | null): string {
    if (!utcDate) return "-";
    return moment.utc(utcDate).local().format("DD MMM YYYY");
}

/**
 * Formats a UTC date/time string into 12-hour format with AM/PM (e.g. "02:45 PM")
 */
export function formatTimeFromUTC(utcDate: string | Date | null): string {
    if (!utcDate) return "-";
    return moment.utc(utcDate).local().format("hh:mm A");
}

/**
 * Combines both date and time for full readability (e.g. "12 Oct 2025, 02:45 PM")
 */
export function formatDateTimeFromUTC(utcDate: string | Date | null): string {
    if (!utcDate) return "-";
    return moment.utc(utcDate).local().format("DD MMM YYYY, hh:mm A");
}

/**
 * Returns a relative time string (e.g. "3 hours ago")
 */
export function formatTimeAgo(utcDate: string | Date | null): string {
    if (!utcDate) return "-";
    return moment.utc(utcDate).local().fromNow();
}

export const calculateAge = (dob?: string): string => {
    console.log(dob)
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) return 'N/A'; // invalid date

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return `${age} years`;
};