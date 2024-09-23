require('dotenv').config();             // Loads environment variables
const express = require('express');     // Required module
const fetchEmails = require('./emailFetcher');
const { formatSearchCriteria } = require('./config');
const { simpleParser } = require('mailparser');

const app = express();

const config = {
    imap: {
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASS,
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        tls: true,                // Enable TLS
        tlsOptions: {
            rejectUnauthorized: false // Allow self-signed certificates (if needed)
        },       
        authTimeout: 3000
    }
};

// Get search criteria
const searchCriteria = formatSearchCriteria('campus.placement.2025@iith.ac.in');

// Fetch emails
fetchEmails(config, searchCriteria)
    .then(messages => {
        const emailPromises = messages.map(item => {
            const all = item.parts.find(part => part.which === 'TEXT');
            const id = item.attributes.uid;
            const idHeader = `Imap-Id: ${id}\r\n`;

            // Parse the email
            return new Promise((resolve, reject) => {
                simpleParser(idHeader + all.body, (err, mail) => {
                    if (err) return reject(err);
                    resolve({
                        from: mail.from.value[0].address,
                        subject: mail.subject,
                        text: mail.text
                    });
                });
            });
        });

        // Wait for all email promises to resolve
        Promise.all(emailPromises)
            .then(emails => {
                console.log('Fetched Emails:', emails);
            })
            .catch(err => {
                console.log('Error parsing emails:', err);
            });
    })
    .catch(err => {
        console.log('Error fetching emails:', err);
    });

// Start the server (if needed for other routes)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
