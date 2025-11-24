const { Voucher } = require('../models');

class VoucherController {
  // Validate voucher code
  async validateVoucher(req, res) {
    try {
      const { code, cart_total } = req.body;

      if (!code) {
        return res.status(400).json({
          success: false,
          message: 'Voucher code is required'
        });
      }

      // Find voucher by code
      const voucher = await Voucher.findOne({
        where: {
          code: code.toUpperCase()
        }
      });

      if (!voucher) {
        return res.status(404).json({
          success: false,
          message: 'Invalid voucher code'
        });
      }

      // Check if voucher is active (within date range)
      const now = new Date();
      if (voucher.start_at && now < voucher.start_at) {
        return res.status(400).json({
          success: false,
          message: 'Voucher is not yet active'
        });
      }

      if (voucher.end_at && now > voucher.end_at) {
        return res.status(400).json({
          success: false,
          message: 'Voucher has expired'
        });
      }

      // Calculate discount
      const discountPercent = voucher.discount_percent;
      const discountAmount = (parseFloat(cart_total) * discountPercent) / 100;

      res.json({
        success: true,
        message: 'Voucher is valid',
        discount: discountAmount,
        discount_type: 'percentage',
        discount_value: discountPercent,
        voucher: {
          id: voucher.id,
          code: voucher.code,
          discount_percent: voucher.discount_percent,
          start_at: voucher.start_at,
          end_at: voucher.end_at
        }
      });

    } catch (error) {
      console.error('Validate voucher error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to validate voucher'
      });
    }
  }

  // Get all vouchers (admin only)
  async getVouchers(req, res) {
    try {
      const vouchers = await Voucher.findAll({
        order: [['created_at', 'DESC']]
      });

      res.json({
        success: true,
        data: vouchers
      });
    } catch (error) {
      console.error('Get vouchers error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get vouchers'
      });
    }
  }

  // Create voucher (admin only)
  async createVoucher(req, res) {
    try {
      const { code, discount_percent, start_at, end_at } = req.body;

      if (!code || !discount_percent) {
        return res.status(400).json({
          success: false,
          message: 'Code and discount percent are required'
        });
      }

      const voucher = await Voucher.create({
        code: code.toUpperCase(),
        discount_percent: parseInt(discount_percent),
        start_at: start_at || null,
        end_at: end_at || null
      });

      res.status(201).json({
        success: true,
        message: 'Voucher created successfully',
        data: voucher
      });
    } catch (error) {
      console.error('Create voucher error:', error);
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
          success: false,
          message: 'Voucher code already exists'
        });
      }
      res.status(500).json({
        success: false,
        message: 'Failed to create voucher'
      });
    }
  }

  // Update voucher (admin only)
  async updateVoucher(req, res) {
    try {
      const { id } = req.params;
      const { code, discount_percent, start_at, end_at } = req.body;

      const voucher = await Voucher.findByPk(id);
      if (!voucher) {
        return res.status(404).json({
          success: false,
          message: 'Voucher not found'
        });
      }

      await voucher.update({
        code: code ? code.toUpperCase() : voucher.code,
        discount_percent: discount_percent ? parseInt(discount_percent) : voucher.discount_percent,
        start_at: start_at || voucher.start_at,
        end_at: end_at || voucher.end_at
      });

      res.json({
        success: true,
        message: 'Voucher updated successfully',
        data: voucher
      });
    } catch (error) {
      console.error('Update voucher error:', error);
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
          success: false,
          message: 'Voucher code already exists'
        });
      }
      res.status(500).json({
        success: false,
        message: 'Failed to update voucher'
      });
    }
  }

  // Delete voucher (admin only)
  async deleteVoucher(req, res) {
    try {
      const { id } = req.params;

      const voucher = await Voucher.findByPk(id);
      if (!voucher) {
        return res.status(404).json({
          success: false,
          message: 'Voucher not found'
        });
      }

      await voucher.destroy();

      res.json({
        success: true,
        message: 'Voucher deleted successfully'
      });
    } catch (error) {
      console.error('Delete voucher error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete voucher'
      });
    }
  }
}

module.exports = new VoucherController();