// routes/qwenRoutes.js
import express from 'express';
import axios from 'axios';

const router = express.Router();

// POST /api/qwen/chat
router.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body; // 格式: [{role: "user", content: "你好"}]

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    const response = await axios.post(
      'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
      {
        model: process.env.QWEN_MODEL, // 可选: qwen-plus, qwen-turbo
        input: {
          messages: messages
        },
        parameters: {
          result_format: 'message'
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.DASHSCOPE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30秒超时
      }
    );

    const reply = response.data.output.choices[0].message.content;
    res.json({ reply });

  } catch (error) {
    console.error('Qwen API Error:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to get response from Qwen',
      details: error.response?.data?.message || error.message
    });
  }
});

export default router;