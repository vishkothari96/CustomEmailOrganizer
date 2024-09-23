const Imap = require('imap-simple');

const fetchEmails = async (config, criteria) => {
    const connection = await Imap.connect(config);
    await connection.openBox('INBOX');
    const fetchOptions = { bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)', 'TEXT'], markSeen: false };
    const messages = await connection.search(criteria, fetchOptions);
    return messages;
};

module.exports = fetchEmails;
