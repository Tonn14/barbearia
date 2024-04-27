export default {
    hourToMinutes: (hourMinute) => {
        // 1:20
        const [hour, minutes] = hourMinute.split(':');
        return parseInt(parseInt(hour)* 60 + parseInt(minutes));
    },
};