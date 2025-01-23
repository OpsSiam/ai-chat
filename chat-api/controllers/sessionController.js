const prisma = require('../prisma'); 

exports.createSession = async (req, res) => {
  const { title } = req.body;

  try {
    const session = await prisma.session.create({
      data: {
        title,
      },
    });
    res.json({ id: session.id, title: session.title, createdAt: session.createdAt });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSessions = async (req, res) => {
  try {
    const sessions = await prisma.session.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteSession = async (req, res) => {
  const sessionId = parseInt(req.params.sessionId, 10);

  try {
    await prisma.message.deleteMany({
      where: {
        sessionId: sessionId,
      },
    });

    await prisma.session.delete({
      where: {
        id: sessionId,
      },
    });

    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.renameSession = async (req, res) => {
  const sessionId = parseInt(req.params.id, 10);
  const { title } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    const updatedSession = await prisma.session.update({
      where: {
        id: sessionId,
      },
      data: {
        title,
      },
    });

    res.json({ id: updatedSession.id, title: updatedSession.title });
  } catch (error) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Session not found' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};
