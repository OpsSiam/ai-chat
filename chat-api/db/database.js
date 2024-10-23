const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const { exec } = require('child_process');

const dbPath = './mnt/chat_history.db';

if (!fs.existsSync(dbPath)) {
  console.log('Database file not located. Executing setup.js to initialize the database...');
  
  exec('node ./db/setup.js', (err, stdout, stderr) => {
    if (err) {
      console.error('Error executing setup.js', err);
      return;
    }
    console.log(`${dbPath}.db has been created successfully.`);
    console.log(stdout);
  });
}
else {
  console.log('Database file is present.');
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to establish a connection to the database', err);
  } else {
    console.log('Successfully connected to the SQLite database');
  }
});

module.exports = db;
