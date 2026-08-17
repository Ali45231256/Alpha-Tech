const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Get Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, password } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update Name
    if (name) {
      user.name = name;
    }

    // Update Password (Optional)
    if (password && password.trim() !== "") {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.json({
      success: true,
      message: "Profile Updated Successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// ==========================
// Change Password
// ==========================
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      oldPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Old Password is incorrect",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    res.json({
      success: true,
      message: "Password Changed Successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
exports.addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.addresses.push(req.body);

    await user.save();

    res.json({
      success: true,
      message: "Address Added Successfully",
      addresses: user.addresses,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
exports.getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    res.json({
      success: true,
      addresses: user.addresses,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
exports.deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    user.addresses = user.addresses.filter(
      (item) => item._id.toString() !== req.params.addressId
    );

    await user.save();

    res.json({
      success: true,
      message: "Address Deleted",
      addresses: user.addresses,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
exports.updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    const address = user.addresses.id(req.params.addressId);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    Object.assign(address, req.body);

    await user.save();

    res.json({
      success: true,
      message: "Address Updated",
      addresses: user.addresses,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};