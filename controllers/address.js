const Address = require("../models/address");


const createAddress = async (req, res) => {
  try {
    const userId = req.user._id;

    const existing = await Address.findOne({ user_id: userId });
    if (existing) {
      return res.status(400).json({ 
        message: "User already has an address" 
    });
    }

    const address = new Address({
      user_id: userId,
      ...req.body,
    });

    await address.save();
    res.status(201).json(address);
  } catch (error) {
    res.status(500).json({ 
        message: error.message 
    });
  }
};




const getAddress = async (req, res) => {
  try {
    const address = await Address.findOne({ user_id: req.user._id });
    if (!address) {
      return res.status(404).json({ 
        message: "Address not found" 
    });
    }
    res.json(address);
  } catch (error) {
    res.status(500).json({ 
        message: error.message 
    });
  }
};




const updateAddress = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);
    if (!address) return res.status(404).json({
         message: "Address not found" 
        });

    if (address.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
         message: "Not authorized" 
        });
    }

    Object.assign(address, req.body);
    await address.save();

    res.json(address);
  } catch (error) {
    res.status(500).json({ 
        message: error.message 
    });
  }
};



const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);
    if (!address) return res.status(404).json({ 
        message: "Address not found" 
    });

    if (address.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
         message: "Not authorized" 
        });
    }

    await address.deleteOne();
    res.json({ message: "Address deleted successfully" });
  } catch (error) {
    res.status(500).json({
         message: error.message 
        });
  }
};

module.exports = {createAddress,getAddress,updateAddress,deleteAddress};
