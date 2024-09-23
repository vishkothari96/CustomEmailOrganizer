const { simpleParser } = require('mailparser');

const parseEmail = (emailBody) => {
    return new Promise((resolve, reject) => {
        simpleParser(emailBody, (err, mail) => {
            if (err) return reject(err);
            resolve(mail);
        });
    });
};

module.exports = parseEmail;
