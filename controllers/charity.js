const Charity = require("../models/charity")

const { uploadToCloudinary } = require("../utils/cloudinary")

//post method
async function createCharity(req, res) {
    try {
        const { name, description, charity_email, start_date, end_date, platform_fee, donation_fee, profit, status } = req.body

        if (req.user.role !== "admin" && req.user.role !== "super_admin") {
            return res.status(403).json({
                status: "Failed",
                message: "Only admin and super admin can create a charity"
            });
        }

        if (!req.file || !req.file.buffer) {
            return res.status(400).json({
                status: "Failed",
                message: "Banner is required"
            })
        }

        if (Number(platform_fee) + Number(donation_fee) + Number(profit) > 100) {
            return res.status(400).json({
                status: "Failed",
                message: "Sum of donation fee + platform fee + profit should not exceed 100"
            })
        }

        const bannerURL = await uploadToCloudinary(req.file.buffer)

        const newCharity = {
            name, description,
            banner: bannerURL,
            user_id: req.user._id,
            charity_email,
            start_date, end_date,
            platform_fee, donation_fee, profit,
            status
        }

        const data = await Charity.create(newCharity)

        return res.status(201).json({
            status: "Success",
            message: "Charity created successfully",
            data: data
        })


    } catch (err) {
        return res.status(500).json({
            status: "Failed",
            message: err.message
        })
    }
}

//get method
async function getAllCharities(req, res) {
    try {
        const data = await Charity.find()
        return res.status(200).json({
            status: "success",
            message: "Here is all the charities",
            data: data
        })

    } catch (err) {
        return res.status(500).json({
            status: "Failed",
            message: err.message
        })
    }
}


//get/admin 
//populate  is used to get the full user details like name and email instead of just their id in the charity data
async function getCharitiesOfAdmin(req, res) {
    try {
        if (req.user.role == "admin") {

            const admin_data = await Charity.find({ user_id: req.user._id }).populate({
                path: "user_id",
                selected: "name"
            })
            return res.status(200).json({
                status: "success",
                data: admin_data
            })
        } else if (req.user.role == "super_admin") {
            const data = await Charity.find().populate({
                path: "user_id",
                selected: "name"
            })
            return res.status(200).json({
                status: "success",
                message: "Here is all the charities",
                data: data
            })
        } else {
            return res.status(403).json({
                status: "Failed",
                message: "Not authorized"
            })
        }
    } catch (err) {
        return res.status(500).json({
            status: "Failed",
            message: err.message
        })
    }
}

//get/:id 
async function getCharityById(req, res) {
    try {
        const { id } = req.params;
        const charity = await Charity.findById(id).populate({
            path: "user_id",
            select: "name email"
        });

        if (!charity) {
            return res.status(404).json({
                status: "Failed",
                message: "Charity not found"
            });
        }

        return res.status(200).json({
            status: "Success",
            data: charity
        });

    } catch (err) {
        return res.status(500).json({
            status: "Failed",
            message: err.message
        });
    }
}

//get/admin/:id
async function getCharityByIdForAdmin(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const role = req.user.role;

        const charity = await Charity.findById(id).populate({
            path: "user_id",
            select: "name email"
        });

        if (!charity) {
            return res.status(404).json({
                status: "Failed",
                message: "Charity not found"
            });
        }

        if (role === "admin" && charity.user_id._id.toString() !== userId.toString())//If the logged in user is an admin and the charity was created by another user then do not  allow them to access or update it
         {
            return res.status(403).json({
                status: "Failed",
                message: "Not authorized to view this charity"
            });
        }

        return res.status(200).json({
            status: "Success",
            data: charity
        });

    } catch (err) {
        return res.status(500).json({
            status: "Failed",
            message: err.message
        });
    }
}

//put/id
async function updateCharity(req, res) {
    try {
        const { id: charityId } = req.params;
        const { role, _id: userId } = req.user;

        const charity = await Charity.findById(charityId);
        if (!charity) {
            return res.status(404).json({
                status: "Failed",
                message: "Charity not found"
            });
        }

        // allow only the owner or super_admin to update
        const isOwner = charity.user_id.toString() === userId.toString();
        const isSuperAdmin = role === "super_admin";

        if (!isOwner && !isSuperAdmin) {  //normal admin can only update their own charities and  super_admin can update any charity
            return res.status(403).json({
                status: "Failed",
                message: "Not authorized to update this charity"
            });
        }

        const {name,description,charity_email,start_date,end_date,platform_fee,donation_fee,profit,status} = req.body;

        const totalFee = Number(platform_fee)+Number(donation_fee)+Number(profit);
        if (totalFee > 100) {
            return res.status(400).json({
                status: "Failed",
                message: "Sum of platform fee,donation fee and profit cannot exceed 100"
            });
        }

        if (req.file?.buffer) {
            const bannerURL = await uploadToCloudinary(req.file.buffer);
            charity.banner = bannerURL;
        }
//updates only provided fields so using ??
        charity.name = name ?? charity.name;
        charity.description = description ?? charity.description;
        charity.charity_email = charity_email ?? charity.charity_email;
        charity.start_date = start_date ?? charity.start_date;
        charity.end_date = end_date ?? charity.end_date;
        charity.platform_fee = platform_fee ?? charity.platform_fee;
        charity.donation_fee = donation_fee ?? charity.donation_fee;
        charity.profit = profit ?? charity.profit;
        charity.status = status ?? charity.status;

        const updatedCharity = await charity.save();//it saves the updated charity details to the database and stores the saved result in updated Charity

        return res.status(200).json({
            status: "Success",
            message: "charity updated successfully",
            data: updatedCharity
        });

    } catch (err) {
        return res.status(500).json({
            status: "Failed",
            message: err.message
        });
    }
}



module.exports = { createCharity, getAllCharities, getCharitiesOfAdmin, getCharityById,getCharityByIdForAdmin,updateCharity}