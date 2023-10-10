function dateConverter(dateFormat){
    const originalDate = new Date(dateFormat.toString());

    // Format the date as "Month Day Year"
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = originalDate.toLocaleDateString(undefined, options);

    // Format the time as "hh:mm am/pm"
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
    const formattedTime = originalDate.toLocaleTimeString(undefined, timeOptions);

    return formattedDate + ' ' +  formattedTime;
}

module.exports = dateConverter;