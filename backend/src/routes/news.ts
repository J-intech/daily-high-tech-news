import { Router, Request, Response } from 'express';
import { validationResult, query, body } from 'express-validator';
import News from '../models/News';

const router = Router();

// Get all news with pagination and filtering
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const category = req.query.category as string;
    const search = req.query.search as string;

    let filter: any = {};

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (search) {
      filter.$text = { $search: search };
    }

    const skip = (page - 1) * limit;

    const news = await News.find(filter)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await News.countDocuments(filter);

    res.json({
      success: true,
      data: news,
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

// Get single news by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const newsItem = await News.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!newsItem) {
      return res.status(404).json({ success: false, message: 'News not found' });
    }

    res.json({ success: true, data: newsItem });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get trending news
router.get('/trending/hot', async (req: Request, res: Response) => {
  try {
    const trending = await News.find()
      .sort({ views: -1, likes: -1 })
      .limit(10);

    res.json({ success: true, data: trending });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create news
router.post('/', async (req: Request, res: Response) => {
  try {
    const newsItem = new News(req.body);
    await newsItem.save();
    res.status(201).json({ success: true, data: newsItem });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update news
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const newsItem = await News.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!newsItem) {
      return res.status(404).json({ success: false, message: 'News not found' });
    }

    res.json({ success: true, data: newsItem });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete news
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const newsItem = await News.findByIdAndDelete(req.params.id);

    if (!newsItem) {
      return res.status(404).json({ success: false, message: 'News not found' });
    }

    res.json({ success: true, message: 'News deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Like news
router.patch('/:id/like', async (req: Request, res: Response) => {
  try {
    const newsItem = await News.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!newsItem) {
      return res.status(404).json({ success: false, message: 'News not found' });
    }

    res.json({ success: true, data: newsItem });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
