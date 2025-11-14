import express from 'express';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';
import FileHistory from '../models/FileHistory.js';

const router = express.Router();

// @route   GET /api/user/profile
// @desc    Get user profile with statistics
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Get file statistics
    const totalFiles = await FileHistory.countDocuments({ user: req.user.id });
    const completedFiles = await FileHistory.countDocuments({ 
      user: req.user.id, 
      status: 'completed' 
    });

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        company: user.company,
        role: user.role,
        filesProcessed: user.filesProcessed,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      },
      statistics: {
        totalFiles,
        completedFiles,
        failedFiles: totalFiles - completedFiles
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
});

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, company } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (company !== undefined) updateData.company = company;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        company: user.company
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
});

// @route   GET /api/user/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const totalFiles = await FileHistory.countDocuments({ user: req.user.id });
    
    const recentFiles = await FileHistory.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('originalFileName statistics status createdAt');

    // Calculate total rows processed
    const filesWithStats = await FileHistory.find({ 
      user: req.user.id,
      status: 'completed'
    }).select('statistics');

    const totalRowsProcessed = filesWithStats.reduce((sum, file) => {
      return sum + (file.statistics.originalRows || 0);
    }, 0);

    const totalRowsCleaned = filesWithStats.reduce((sum, file) => {
      return sum + (file.statistics.cleanedRows || 0);
    }, 0);

    res.json({
      success: true,
      statistics: {
        totalFiles,
        totalRowsProcessed,
        totalRowsCleaned,
        totalRowsRemoved: totalRowsProcessed - totalRowsCleaned
      },
      recentFiles
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
});

export default router;
