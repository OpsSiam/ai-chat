const axios = require('axios');
const db = require('../db/database');
require('dotenv').config();

exports.chatHandler = async (req, res) => {
  const { messages, sessionId } = req.body;

  try {
    const userMessage = messages[messages.length - 1];

    messages.forEach(message => {
      if (message.content.startsWith('Uploaded file:')) {
        const firstLine = message.content.split('\n')[0];
        db.run(
          'INSERT INTO messages (session_id, role, content) VALUES (?, ?, ?)',
          [sessionId, message.role, firstLine]
        );
      } else {
        db.run(
          'INSERT INTO messages (session_id, role, content) VALUES (?, ?, ?)',
          [sessionId, message.role, message.content]
        );
      }
    });

    const systemMessage = {
      role: 'system',
      content: process.env.AZURE_OPENAI_PROMPT,
    };

    const messageHistory = [systemMessage, ...messages];

    const response = await axios({
      method: 'post',
      url: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}/chat/completions?api-version=${process.env.AZURE_OPENAI_API_VERSION}`,
      headers: {
        'api-key': process.env.AZURE_OPENAI_API_KEY,
        'Content-Type': 'application/json',
      },
      data: {
        messages: messageHistory,
        stream: true,
      },
      responseType: 'stream',
    });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    let buffer = '';
    let assistantContent = '';

    response.data.on('data', (chunk) => {
      buffer += chunk.toString();
      const payloads = buffer.split('\n\n');

      for (let i = 0; i < payloads.length - 1; i++) {
        const payload = payloads[i];
        buffer = payloads[payloads.length - 1];

        if (payload.includes('[DONE]')) {
          res.write('data: [DONE]\n\n');
          res.end();
          return;
        }

        if (payload.startsWith('data:')) {
          try {
            const data = JSON.parse(payload.replace('data: ', ''));
            const delta = data.choices[0]?.delta?.content;

            if (delta) {
              assistantContent += delta;
              res.write(`data: ${JSON.stringify({ content: delta })}\n\n`);
            }
          } catch (error) {
            console.error('JSON parse error:', error.message);
          }
        }
      }
    });

    response.data.on('end', () => {
      db.run(
        'INSERT INTO messages (session_id, role, content) VALUES (?, ?, ?)',
        [sessionId, 'assistant', assistantContent]
      );
      res.write('data: [DONE]\n\n');
      res.end();
    });

    response.data.on('error', (err) => {
      console.error('Streaming error:', err);
      res.end();
    });

  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).send('Error processing the request');
  }
};

exports.getMessages = (req, res) => {
  const sessionId = req.params.sessionId;

  db.all(
    'SELECT role, content, created_at FROM messages WHERE session_id = ? ORDER BY created_at ASC',
    [sessionId],
    (err, rows) => {
      if (err) {
        console.error('Error fetching messages:', err.message);
        res.status(500).json({ error: err.message });
      } else if (rows.length === 0) {
        console.log(`No messages found for session ID: ${sessionId}`);
        res.status(404).json({ error: 'No messages found for this session' });
      } else {
        console.log(`Fetched messages for session ID: ${sessionId}`);
        res.json(rows);
      }
    }
  );
};