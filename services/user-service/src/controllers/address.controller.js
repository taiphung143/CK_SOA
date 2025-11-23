const { Address } = require('../models');

class AddressController {
  async getAddresses(req, res, next) {
    try {
      const addresses = await Address.findAll({
        where: { user_id: req.user.userId },
        order: [['is_default', 'DESC'], ['created_at', 'DESC']]
      });

      res.json({
        success: true,
        data: addresses
      });
    } catch (error) {
      next(error);
    }
  }

  async getAddress(req, res, next) {
    try {
      const { id } = req.params;
      
      const address = await Address.findOne({
        where: { 
          id, 
          user_id: req.user.userId 
        }
      });

      if (!address) {
        return res.status(404).json({
          success: false,
          message: 'Address not found'
        });
      }

      res.json({
        success: true,
        data: address
      });
    } catch (error) {
      next(error);
    }
  }

  async createAddress(req, res, next) {
    try {
      const { 
        recipient_name, 
        phone, 
        street_address, 
        city, 
        state, 
        postal_code, 
        country,
        is_default 
      } = req.body;

      // If setting as default, unset other defaults
      if (is_default) {
        await Address.update(
          { is_default: false },
          { where: { user_id: req.user.userId } }
        );
      }

      const address = await Address.create({
        user_id: req.user.userId,
        recipient_name,
        phone,
        street_address,
        city,
        state,
        postal_code,
        country: country || 'Vietnam',
        is_default: is_default || false
      });

      res.status(201).json({
        success: true,
        message: 'Address created successfully',
        data: address
      });
    } catch (error) {
      next(error);
    }
  }

  async updateAddress(req, res, next) {
    try {
      const { id } = req.params;
      const { 
        recipient_name, 
        phone, 
        street_address, 
        city, 
        state, 
        postal_code, 
        country,
        is_default 
      } = req.body;

      const address = await Address.findOne({
        where: { 
          id, 
          user_id: req.user.userId 
        }
      });

      if (!address) {
        return res.status(404).json({
          success: false,
          message: 'Address not found'
        });
      }

      // If setting as default, unset other defaults
      if (is_default) {
        await Address.update(
          { is_default: false },
          { where: { user_id: req.user.userId } }
        );
      }

      await address.update({
        recipient_name: recipient_name || address.recipient_name,
        phone: phone || address.phone,
        street_address: street_address || address.street_address,
        city: city || address.city,
        state: state || address.state,
        postal_code: postal_code || address.postal_code,
        country: country || address.country,
        is_default: is_default !== undefined ? is_default : address.is_default
      });

      res.json({
        success: true,
        message: 'Address updated successfully',
        data: address
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteAddress(req, res, next) {
    try {
      const { id } = req.params;

      const address = await Address.findOne({
        where: { 
          id, 
          user_id: req.user.userId 
        }
      });

      if (!address) {
        return res.status(404).json({
          success: false,
          message: 'Address not found'
        });
      }

      await address.destroy();

      res.json({
        success: true,
        message: 'Address deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async setDefaultAddress(req, res, next) {
    try {
      const { id } = req.params;

      const address = await Address.findOne({
        where: { 
          id, 
          user_id: req.user.userId 
        }
      });

      if (!address) {
        return res.status(404).json({
          success: false,
          message: 'Address not found'
        });
      }

      // Unset all defaults
      await Address.update(
        { is_default: false },
        { where: { user_id: req.user.userId } }
      );

      // Set this as default
      await address.update({ is_default: true });

      res.json({
        success: true,
        message: 'Default address updated successfully',
        data: address
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AddressController();
