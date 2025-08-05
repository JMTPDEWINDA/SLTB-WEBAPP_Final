const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Generate reference number
const generateReferenceNo = () => {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SLTB-PLANT-${timestamp}${random}`;
};

// @route   POST /api/planting/apply
// @desc    Submit planting subsidy application
// @access  Private
router.post('/apply', authenticateToken, [
  body('file_no').notEmpty().withMessage('File number is required'),
  body('owner_name').notEmpty().withMessage('Owner name is required'),
  body('estate_name').notEmpty().withMessage('Estate name is required'),
  body('planting_type').notEmpty().withMessage('Planting type is required'),
  body('approved_extent').isFloat({ min: 0 }).withMessage('Approved extent must be a positive number'),
  body('plants_per_ha').isInt({ min: 1 }).withMessage('Plants per hectare must be a positive integer'),
  body('amount_per_plant').isFloat({ min: 0 }).withMessage('Amount per plant must be a positive number'),
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

    const {
      file_no,
      owner_name,
      estate_name,
      ti_range,
      division,
      field_no,
      plan_no,
      planting_type,
      approved_extent,
      x1_coordinate,
      x2_coordinate,
      plants_per_ha,
      approved_plants,
      amount_per_plant
    } = req.body;

    // Check if file number already exists
    const [existingFiles] = await pool.execute(
      'SELECT id FROM planting_applications WHERE file_no = ?',
      [file_no]
    );

    if (existingFiles.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Application with this file number already exists'
      });
    }

    // Calculate total approved amount
    const total_approved_amount = approved_plants * amount_per_plant;

    // Generate reference number
    const reference_no = generateReferenceNo();

    // Insert application
    const [result] = await pool.execute(
      `INSERT INTO planting_applications (
        user_id, file_no, owner_name, estate_name, ti_range, division, 
        field_no, plan_no, planting_type, approved_extent, x1_coordinate, 
        x2_coordinate, plants_per_ha, approved_plants, amount_per_plant, 
        total_approved_amount, reference_no
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id, file_no, owner_name, estate_name, ti_range, division,
        field_no, plan_no, planting_type, approved_extent, x1_coordinate,
        x2_coordinate, plants_per_ha, approved_plants, amount_per_plant,
        total_approved_amount, reference_no
      ]
    );

    // Create reference entry
    await pool.execute(
      'INSERT INTO reference_entries (reference_no, application_type, application_id) VALUES (?, ?, ?)',
      [reference_no, 'planting', result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Planting application submitted successfully',
      data: {
        application_id: result.insertId,
        reference_no,
        total_approved_amount
      }
    });

  } catch (error) {
    console.error('Planting application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while submitting application'
    });
  }
});

// @route   GET /api/planting/applications
// @desc    Get user's planting applications
// @access  Private
router.get('/applications', authenticateToken, async (req, res) => {
  try {
    const [applications] = await pool.execute(
      `SELECT 
        id, file_no, owner_name, estate_name, ti_range, division,
        field_no, plan_no, planting_type, approved_extent, x1_coordinate,
        x2_coordinate, plants_per_ha, approved_plants, amount_per_plant,
        total_approved_amount, status, reference_no, created_at, updated_at
      FROM planting_applications 
      WHERE user_id = ? 
      ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json({
      success: true,
      data: {
        applications,
        count: applications.length
      }
    });

  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching applications'
    });
  }
});

// @route   GET /api/planting/applications/:id
// @desc    Get specific planting application
// @access  Private
router.get('/applications/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [applications] = await pool.execute(
      `SELECT 
        id, file_no, owner_name, estate_name, ti_range, division,
        field_no, plan_no, planting_type, approved_extent, x1_coordinate,
        x2_coordinate, plants_per_ha, approved_plants, amount_per_plant,
        total_approved_amount, status, reference_no, created_at, updated_at
      FROM planting_applications 
      WHERE id = ? AND user_id = ?`,
      [id, req.user.id]
    );

    if (applications.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.json({
      success: true,
      data: {
        application: applications[0]
      }
    });

  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching application'
    });
  }
});

// @route   PUT /api/planting/applications/:id
// @desc    Update planting application
// @access  Private
router.put('/applications/:id', authenticateToken, [
  body('owner_name').optional().notEmpty().withMessage('Owner name cannot be empty'),
  body('estate_name').optional().notEmpty().withMessage('Estate name cannot be empty'),
  body('approved_extent').optional().isFloat({ min: 0 }).withMessage('Approved extent must be a positive number'),
  body('amount_per_plant').optional().isFloat({ min: 0 }).withMessage('Amount per plant must be a positive number'),
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

    const { id } = req.params;
    const updateData = req.body;

    // Check if application exists and belongs to user
    const [applications] = await pool.execute(
      'SELECT id, status FROM planting_applications WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    if (applications.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    if (applications[0].status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update application that is not pending'
      });
    }

    // Build update query dynamically
    const updateFields = [];
    const updateValues = [];

    Object.keys(updateData).forEach(key => {
      if (key !== 'id' && key !== 'user_id' && key !== 'file_no' && key !== 'reference_no') {
        updateFields.push(`${key} = ?`);
        updateValues.push(updateData[key]);
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }

    // Recalculate total if amount_per_plant or approved_plants changed
    if (updateData.amount_per_plant || updateData.approved_plants) {
      const [currentApp] = await pool.execute(
        'SELECT amount_per_plant, approved_plants FROM planting_applications WHERE id = ?',
        [id]
      );
      
      const newAmountPerPlant = updateData.amount_per_plant || currentApp[0].amount_per_plant;
      const newApprovedPlants = updateData.approved_plants || currentApp[0].approved_plants;
      const newTotal = newAmountPerPlant * newApprovedPlants;
      
      updateFields.push('total_approved_amount = ?');
      updateValues.push(newTotal);
    }

    updateValues.push(id);

    const [result] = await pool.execute(
      `UPDATE planting_applications SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({
        success: false,
        message: 'Failed to update application'
      });
    }

    res.json({
      success: true,
      message: 'Application updated successfully'
    });

  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating application'
    });
  }
});

// @route   DELETE /api/planting/applications/:id
// @desc    Delete planting application
// @access  Private
router.delete('/applications/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if application exists and belongs to user
    const [applications] = await pool.execute(
      'SELECT id, status FROM planting_applications WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    if (applications.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    if (applications[0].status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete application that is not pending'
      });
    }

    // Delete application
    const [result] = await pool.execute(
      'DELETE FROM planting_applications WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({
        success: false,
        message: 'Failed to delete application'
      });
    }

    res.json({
      success: true,
      message: 'Application deleted successfully'
    });

  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting application'
    });
  }
});

module.exports = router; 