const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/dashboard/overview
// @desc    Get user dashboard overview
// @access  Private
router.get('/overview', authenticateToken, async (req, res) => {
  try {
    // Get user's planting applications summary
    const [plantingSummary] = await pool.execute(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'processing' THEN 1 ELSE 0 END) as processing,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected,
        SUM(total_approved_amount) as total_amount
      FROM planting_applications
      WHERE user_id = ?
    `, [req.user.id]);

    // Get user's replanting applications summary
    const [replantingSummary] = await pool.execute(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'processing' THEN 1 ELSE 0 END) as processing,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected,
        SUM(total_approved_amount) as total_amount
      FROM replanting_applications
      WHERE user_id = ?
    `, [req.user.id]);

    // Get recent applications
    const [recentPlanting] = await pool.execute(`
      SELECT 
        id, file_no, owner_name, estate_name, status, reference_no, 
        total_approved_amount, created_at
      FROM planting_applications
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 5
    `, [req.user.id]);

    const [recentReplanting] = await pool.execute(`
      SELECT 
        id, file_no, owner_name, estate_name, status, reference_no, 
        total_approved_amount, created_at
      FROM replanting_applications
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 5
    `);

    // Calculate totals
    const totalApplications = (plantingSummary[0].total || 0) + (replantingSummary[0].total || 0);
    const totalPending = (plantingSummary[0].pending || 0) + (replantingSummary[0].pending || 0);
    const totalProcessing = (plantingSummary[0].processing || 0) + (replantingSummary[0].processing || 0);
    const totalApproved = (plantingSummary[0].approved || 0) + (replantingSummary[0].approved || 0);
    const totalRejected = (plantingSummary[0].rejected || 0) + (replantingSummary[0].rejected || 0);
    const totalAmount = (plantingSummary[0].total_amount || 0) + (replantingSummary[0].total_amount || 0);

    res.json({
      success: true,
      data: {
        summary: {
          total_applications: totalApplications,
          total_pending: totalPending,
          total_processing: totalProcessing,
          total_approved: totalApproved,
          total_rejected: totalRejected,
          total_amount: totalAmount
        },
        planting: {
          summary: plantingSummary[0],
          recent: recentPlanting
        },
        replanting: {
          summary: replantingSummary[0],
          recent: recentReplanting
        }
      }
    });

  } catch (error) {
    console.error('Dashboard overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard overview'
    });
  }
});

// @route   GET /api/dashboard/applications
// @desc    Get user's all applications with pagination
// @access  Private
router.get('/applications', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const type = req.query.type; // 'planting' or 'replanting'
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE user_id = ?';
    let params = [req.user.id];

    if (status) {
      whereClause += ' AND status = ?';
      params.push(status);
    }

    let applications = [];
    let totalCount = 0;

    if (!type || type === 'planting') {
      const [plantingApps] = await pool.execute(`
        SELECT 
          id, file_no, owner_name, estate_name, status, reference_no,
          total_approved_amount, created_at, 'planting' as type
        FROM planting_applications
        ${whereClause}
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `, [...params, limit, offset]);

      const [plantingCount] = await pool.execute(`
        SELECT COUNT(*) as count
        FROM planting_applications
        ${whereClause}
      `, params);

      applications.push(...plantingApps);
      totalCount += plantingCount[0].count;
    }

    if (!type || type === 'replanting') {
      const [replantingApps] = await pool.execute(`
        SELECT 
          id, file_no, owner_name, estate_name, status, reference_no,
          total_approved_amount, created_at, 'replanting' as type
        FROM replanting_applications
        ${whereClause}
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `, [...params, limit, offset]);

      const [replantingCount] = await pool.execute(`
        SELECT COUNT(*) as count
        FROM replanting_applications
        ${whereClause}
      `, params);

      applications.push(...replantingApps);
      totalCount += replantingCount[0].count;
    }

    // Sort by created_at descending
    applications.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    res.json({
      success: true,
      data: {
        applications,
        pagination: {
          page,
          limit,
          total: totalCount,
          pages: Math.ceil(totalCount / limit)
        }
      }
    });

  } catch (error) {
    console.error('Dashboard applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching applications'
    });
  }
});

// @route   GET /api/dashboard/statistics
// @desc    Get detailed statistics for dashboard
// @access  Private
router.get('/statistics', authenticateToken, async (req, res) => {
  try {
    // Get monthly statistics for the current year
    const currentYear = new Date().getFullYear();

    // Planting applications by month
    const [plantingMonthly] = await pool.execute(`
      SELECT 
        MONTH(created_at) as month,
        COUNT(*) as count,
        SUM(total_approved_amount) as amount
      FROM planting_applications
      WHERE user_id = ? AND YEAR(created_at) = ?
      GROUP BY MONTH(created_at)
      ORDER BY month
    `, [req.user.id, currentYear]);

    // Replanting applications by month
    const [replantingMonthly] = await pool.execute(`
      SELECT 
        MONTH(created_at) as month,
        COUNT(*) as count,
        SUM(total_approved_amount) as amount
      FROM replanting_applications
      WHERE user_id = ? AND YEAR(created_at) = ?
      GROUP BY MONTH(created_at)
      ORDER BY month
    `, [req.user.id, currentYear]);

    // Status distribution
    const [statusDistribution] = await pool.execute(`
      SELECT 
        'planting' as type,
        status,
        COUNT(*) as count
      FROM planting_applications
      WHERE user_id = ?
      GROUP BY status
      UNION ALL
      SELECT 
        'replanting' as type,
        status,
        COUNT(*) as count
      FROM replanting_applications
      WHERE user_id = ?
      GROUP BY status
    `, [req.user.id, req.user.id]);

    // Top estates by application count
    const [topEstates] = await pool.execute(`
      SELECT 
        estate_name,
        COUNT(*) as application_count,
        SUM(total_approved_amount) as total_amount
      FROM (
        SELECT estate_name, total_approved_amount FROM planting_applications WHERE user_id = ?
        UNION ALL
        SELECT estate_name, total_approved_amount FROM replanting_applications WHERE user_id = ?
      ) combined
      GROUP BY estate_name
      ORDER BY application_count DESC
      LIMIT 5
    `, [req.user.id, req.user.id]);

    res.json({
      success: true,
      data: {
        monthly: {
          planting: plantingMonthly,
          replanting: replantingMonthly
        },
        status_distribution: statusDistribution,
        top_estates: topEstates
      }
    });

  } catch (error) {
    console.error('Dashboard statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics'
    });
  }
});

// @route   GET /api/dashboard/notifications
// @desc    Get user notifications (recent updates, status changes, etc.)
// @access  Private
router.get('/notifications', authenticateToken, async (req, res) => {
  try {
    // Get recent status changes
    const [recentUpdates] = await pool.execute(`
      SELECT 
        'planting' as type,
        id,
        file_no,
        estate_name,
        status,
        updated_at,
        reference_no
      FROM planting_applications
      WHERE user_id = ? AND updated_at > DATE_SUB(NOW(), INTERVAL 30 DAY)
      UNION ALL
      SELECT 
        'replanting' as type,
        id,
        file_no,
        estate_name,
        status,
        updated_at,
        reference_no
      FROM replanting_applications
      WHERE user_id = ? AND updated_at > DATE_SUB(NOW(), INTERVAL 30 DAY)
      ORDER BY updated_at DESC
      LIMIT 20
    `, [req.user.id, req.user.id]);

    // Get pending applications that might need attention
    const [pendingApplications] = await pool.execute(`
      SELECT 
        'planting' as type,
        id,
        file_no,
        estate_name,
        created_at,
        reference_no
      FROM planting_applications
      WHERE user_id = ? AND status = 'pending' AND created_at < DATE_SUB(NOW(), INTERVAL 7 DAY)
      UNION ALL
      SELECT 
        'replanting' as type,
        id,
        file_no,
        estate_name,
        created_at,
        reference_no
      FROM replanting_applications
      WHERE user_id = ? AND status = 'pending' AND created_at < DATE_SUB(NOW(), INTERVAL 7 DAY)
      ORDER BY created_at ASC
    `, [req.user.id, req.user.id]);

    res.json({
      success: true,
      data: {
        recent_updates: recentUpdates,
        pending_attention: pendingApplications
      }
    });

  } catch (error) {
    console.error('Dashboard notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching notifications'
    });
  }
});

module.exports = router; 