const sizes = {
    mobileL: '425px',
    tablet: '768px',
    laptopL: '1440px',
};

export const devices = {
    mobileL: `(min-width: ${sizes.mobileL})`,
    tablet: `(min-width: ${sizes.tablet})`,
    laptopL: `(min-width: ${sizes.laptopL})`,
};


export const saveToLocalStorage = (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value))
}

export const getFromLocalStorage = (key: string) => {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
}

export const parseDateTime = (dateTimeString: string) => {

    const [time, date] = dateTimeString.split('•');
    if (!time || !date) return parseDate(dateTimeString);
    const parsedDate = parseDate(date.trim());
    //Is there a need for more precise time? -> hours and minutes
    return `${parsedDate}`;
};

export const parseDate = (dateString: string | number | Date) => {
    const dateObj = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = dateObj.toLocaleDateString('en-US', options);
    return formattedDate;
};

export const parseTodayToDate = () => {
    const today = new Date();
    return parseDateTime(today.toISOString().slice(0, 10));
}

export const parseYesterdayToDate = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return parseDateTime(yesterday.toISOString().slice(0, 10));
}

export const getTimePeriodFilters = () => {
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const today = new Date();
    const timePeriodFilters = ['Today', 'Yesterday'];

    const currentMonth = today.getMonth();
    for (let i = 0; i < 5; i++) {
        timePeriodFilters.push(monthNames[(currentMonth - i + 12) % 12]);
    }

    timePeriodFilters.push('This year', 'Last year', 'All')

    return timePeriodFilters;
};

export const getCurrentMonthName = () => {
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    const today = new Date();
    const currentMonth = today.getMonth();
    return monthNames[currentMonth];
}