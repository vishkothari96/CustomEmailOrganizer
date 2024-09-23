const formatSearchCriteria = (email) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const formattedDate = oneWeekAgo.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }).replace(/ /g, '-');

    return [
        ['TO', email],
        ['SINCE', formattedDate]
    ];
};

module.exports = { formatSearchCriteria };
