const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');

const router = express.Router();

// @route   GET /api/reference/track/:referenceNo
// @desc    Track application status by reference number
// @access  Public
router.get('/track/:referenceNo', [
  body('referenceNo').notEmpty().withMessage('Reference number is required'),
], async (req, res) => {
  try {
    const { referenceNo } = req.params;

    if (!referenceNo) {
      return res.status(400).json({
        success: false,
        message: 'Reference number is required'
      });
    }

    // Find reference entry
    const [references] = await pool.execute(
      'SELECT * FROM reference_entries WHERE reference_no = ?',
      [referenceNo]
    );

    if (references.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Reference number not found'
      });
    }

    const reference = references[0];

    // Get application details based on type
    let application = null;
    let applicationDetails = null;

    if (reference.application_type === 'planting') {
      const [plantingApps] = await pool.execute(
        `SELECT 
          pa.*, u.first_name, u.last_name, u.email
        FROM planting_applications pa
        LEFT JOIN users u ON pa.user_id = u.id
        WHERE pa.id = ?`,
        [reference.application_id]
      );

      if (plantingApps.length > 0) {
        application = plantingApps[0];
        applicationDetails = {
          type: 'Planting Subsidy Application',
          file_no: application.file_no,
          owner_name: application.owner_name,
          estate_name: application.estate_name,
          ti_range: application.ti_range,
          division: application.division,
          field_no: application.field_no,
          plan_no: application.plan_no,
          planting_type: application.planting_type,
          approved_extent: application.approved_extent,
          x1_coordinate: application.x1_coordinate,
          x2_coordinate: application.x2_coordinate,
          plants_per_ha: application.plants_per_ha,
          approved_plants: application.approved_plants,
          amount_per_plant: application.amount_per_plant,
          total_approved_amount: application.total_approved_amount,
          applicant_name: `${application.first_name || ''} ${application.last_name || ''}`.trim(),
          applicant_email: application.email
        };
      }
    } else if (reference.application_type === 'replanting') {
      const [replantingApps] = await pool.execute(
        `SELECT 
          ra.*, u.first_name, u.last_name, u.email
        FROM replanting_applications ra
        LEFT JOIN users u ON ra.user_id = u.id
        WHERE ra.id = ?`,
        [reference.application_id]
      );

      if (replantingApps.length > 0) {
        application = replantingApps[0];
        applicationDetails = {
          type: 'Replanting Subsidy Application',
          file_no: application.file_no,
          owner_name: application.owner_name,
          estate_name: application.estate_name,
          ti_range: application.ti_range,
          division: application.division,
          field_no: application.field_no,
          plan_no: application.plan_no,
          replanting_type: application.replanting_type,
          approved_extent: application.approved_extent,
          x1_coordinate: application.x1_coordinate,
          x2_coordinate: application.x2_coordinate,
          plants_per_ha: application.plants_per_ha,
          approved_plants: application.approved_plants,
          amount_per_plant: application.amount_per_plant,
          total_approved_amount: application.total_approved_amount,
          applicant_name: `${application.first_name || ''} ${application.last_name || ''}`.trim(),
          applicant_email: application.email
        };
      }
    }

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application details not found'
      });
    }

    // Get status timeline
    const statusTimeline = [
      {
        status: 'pending',
        description: 'Application submitted and under review',
        date: application.created_at,
        completed: ['pending', 'processing', 'approved', 'rejected'].includes(application.status)
      },
      {
        status: 'processing',
        description: 'Application is being processed by SLTB officers',
        date: application.status === 'processing' ? application.updated_at : null,
        completed: ['processing', 'approved', 'rejected'].includes(application.status)
      },
      {
        status: 'approved',
        description: 'Application has been approved',
        date: application.status === 'approved' ? application.updated_at : null,
        completed: application.status === 'approved'
      },
      {
        status: 'rejected',
        description: 'Application has been rejected',
        date: application.status === 'rejected' ? application.updated_at : null,
        completed: application.status === 'rejected'
      }
    ];

    res.json({
      success: true,
      data: {
        reference_no: reference.reference_no,
        application_type: reference.application_type,
        status: application.status,
        comments: reference.comments,
        submitted_date: application.created_at,
        last_updated: application.updated_at,
        application_details: applicationDetails,
        status_timeline: statusTimeline
      }
    });

  } catch (error) {
    console.error('Track reference error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while tracking reference'
    });
  }
});

// @route   POST /api/reference/search
// @desc    Search applications by various criteria
// @access  Public
router.post('/search', [
  body('searchType').isIn(['reference_no', 'file_no', 'owner_name', 'estate_name']).withMessage('Invalid search type'),
  body('searchValue').notEmpty().withMessage('Search value is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { searchType, searchValue } = req.body;

    let results = [];

    if (searchType === 'reference_no') {
      // Search by reference number
      const [references] = await pool.execute(
        'SELECT * FROM reference_entries WHERE reference_no LIKE ?',
        [`%${searchValue}%`]
      );

      for (const ref of references) {
        if (ref.application_type === 'planting') {
          const [apps] = await pool.execute(
            'SELECT id, file_no, owner_name, estate_name, status, created_at FROM planting_applications WHERE id = ?',
            [ref.application_id]
          );
          if (apps.length > 0) {
            results.push({
              reference_no: ref.reference_no,
              application_type: 'Planting',
              ...apps[0]
            });
          }
        } else if (ref.application_type === 'replanting') {
          const [apps] = await pool.execute(
            'SELECT id, file_no, owner_name, estate_name, status, created_at FROM replanting_applications WHERE id = ?',
            [ref.application_id]
          );
          if (apps.length > 0) {
            results.push({
              reference_no: ref.reference_no,
              application_type: 'Replanting',
              ...apps[0]
            });
          }
        }
      }
    } else {
      // Search in planting applications
      const [plantingApps] = await pool.execute(
        `SELECT 
          pa.id, pa.file_no, pa.owner_name, pa.estate_name, pa.status, pa.created_at, pa.reference_no
        FROM planting_applications pa
        WHERE pa.${searchType} LIKE ?`,
        [`%${searchValue}%`]
      );

      plantingApps.forEach(app => {
        results.push({
          reference_no: app.reference_no,
          application_type: 'Planting',
          id: app.id,
          file_no: app.file_no,
          owner_name: app.owner_name,
          estate_name: app.estate_name,
          status: app.status,
          created_at: app.created_at
        });
      });

      // Search in replanting applications
      const [replantingApps] = await pool.execute(
        `SELECT 
          ra.id, ra.file_no, ra.owner_name, ra.estate_name, ra.status, ra.created_at, ra.reference_no
        FROM replanting_applications ra
        WHERE ra.${searchType} LIKE ?`,
        [`%${searchValue}%`]
      );

      replantingApps.forEach(app => {
        results.push({
          reference_no: app.reference_no,
          application_type: 'Replanting',
          id: app.id,
          file_no: app.file_no,
          owner_name: app.owner_name,
          estate_name: app.estate_name,
          status: app.status,
          created_at: app.created_at
        });
      });
    }

    res.json({
      success: true,
      data: {
        results,
        count: results.length
      }
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while searching'
    });
  }
});

// @route   GET /api/reference/statistics
// @desc    Get application statistics
// @access  Public
router.get('/statistics', async (req, res) => {
  try {
    // Get planting application statistics
    const [plantingStats] = await pool.execute(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'processing' THEN 1 ELSE 0 END) as processing,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected,
        SUM(total_approved_amount) as total_amount
      FROM planting_applications
    `);

    // Get replanting application statistics
    const [replantingStats] = await pool.execute(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'processing' THEN 1 ELSE 0 END) as processing,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected,
        SUM(total_approved_amount) as total_amount
      FROM replanting_applications
    `);

    // Get recent applications
    const [recentPlanting] = await pool.execute(`
      SELECT reference_no, owner_name, estate_name, status, created_at
      FROM planting_applications
      ORDER BY created_at DESC
      LIMIT 5
    `);

    const [recentReplanting] = await pool.execute(`
      SELECT reference_no, owner_name, estate_name, status, created_at
      FROM replanting_applications
      ORDER BY created_at DESC
      LIMIT 5
    `);

    const totalStats = {
      total_applications: plantingStats[0].total + replantingStats[0].total,
      total_pending: plantingStats[0].pending + replantingStats[0].pending,
      total_processing: plantingStats[0].processing + replantingStats[0].processing,
      total_approved: plantingStats[0].approved + replantingStats[0].approved,
      total_rejected: plantingStats[0].rejected + replantingStats[0].rejected,
      total_amount: (plantingStats[0].total_amount || 0) + (replantingStats[0].total_amount || 0)
    };

    res.json({
      success: true,
      data: {
        planting: plantingStats[0],
        replanting: replantingStats[0],
        total: totalStats,
        recent_applications: {
          planting: recentPlanting,
          replanting: recentReplanting
        }
      }
    });

  } catch (error) {
    console.error('Statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics'
    });
  }
});

module.exports = router; 