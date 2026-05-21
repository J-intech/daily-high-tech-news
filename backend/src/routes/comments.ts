import { Router, Request, Response } from 'express';
import { validationResult, body } from 'express-validator';
import Comment from '../models/Comment';
import News from '../models/News';

const router = Router();

// Get comments for a news item
router.get('/news/:newsId', async (req: Request, res: Response) => {
  try {
    const { newsId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const comments = await Comment.find({ newsId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Comment.countDocuments({ newsId });

    res.json({
      success: true,
      data: comments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create comment
router.post('/', async (req: Request, res: Response) => {
  try {
    const { newsId, username, email, content } = req.body;

    // Verify news exists
    const newsExists = await News.findById(newsId);
    if (!newsExists) {
      return res.status(404).json({ success: false, message: 'News not found' });
    }

    const comment = new Comment({
      newsId,
      username,
      email,
      content
    });
    await comment.save();

    res.status(201).json({ success: true, data: comment });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete comment
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    res.json({ success: true, message: 'Comment deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Like comment
router.patch('/:id/like', async (req: Request, res: Response) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    res.json({ success: true, data: comment });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
