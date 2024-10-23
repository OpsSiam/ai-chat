const db = require('../db/database');

exports.createSession = (req, res) => {
  const { title } = req.body;
  const createdAt = new Date().toISOString(); 

  db.run(
    'INSERT INTO sessions (title, created_at) VALUES (?, ?)',
    [title, createdAt],
    
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ id: this.lastID, title, created_at: createdAt }); 
      }
    }
  );
};

exports.getSessions = (req, res) => {
  db.all('SELECT * FROM sessions ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
};

exports.deleteSession = (req, res) => {
  const sessionId = req.params.sessionId;

  db.serialize(() => {
    db.run('DELETE FROM messages WHERE session_id = ?', [sessionId], function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      db.run('DELETE FROM sessions WHERE id = ?', [sessionId], function (err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Session deleted successfully' });
      });
    });
  });
};


exports.renameSession = (req, res) => {
  const sessionId = req.params.id;
  const { title } = req.body; 

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }

  db.run(
    'UPDATE sessions SET title = ? WHERE id = ?',
    [title, sessionId],

    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (this.changes === 0) {
        res.status(404).json({ error: 'Session not found' });
      } else {
        res.json({ id: sessionId, title });
      }
    }
  );
};
