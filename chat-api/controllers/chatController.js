const axios = require('axios');
const prisma = require('../prisma');
require('dotenv').config();

exports.chatHandler = async (req, res) => {
  const { messages, sessionId } = req.body;

  try {
    const userMessage = messages[messages.length - 1];

    for (const message of messages) {
      const content =
        message.content.startsWith('Uploaded file:')
          ? message.content.split('\n')[0]
          : message.content;

      await prisma.message.create({
        data: {
          sessionId: sessionId,
          role: message.role,
          content: content,
        },
      });
    }

    const systemMessage = {
      role: 'system',
      content: process.env.AZURE_OPENAI_PROMPT,
    };

    const maxTokens = process.env.AZURE_OPENAI_MAX_TOKENS || 3000;

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
        max_tokens: Number(maxTokens),
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

    response.data.on('end', async () => {
      await prisma.message.create({
        data: {
          sessionId: sessionId,
          role: 'assistant',
          content: assistantContent,
        },
      });
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

exports.getMessages = async (req, res) => {
  const sessionId = req.params.sessionId;

  try {
    const messages = await prisma.message.findMany({
      where: { sessionId: Number(sessionId) },
      orderBy: { createdAt: 'asc' },
      select: {
        role: true,
        content: true,
        createdAt: true,
      },
    });

    if (messages.length === 0) {
      console.log(`No messages found for session ID: ${sessionId}`);
      return res.status(404).json({ error: 'No messages found for this session' });
    }

    console.log(`Fetched messages for session ID: ${sessionId}`);
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error.message);
    res.status(500).json({ error: error.message });
  }
};
