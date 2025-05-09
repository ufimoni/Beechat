const Users = require('./../models/usermodel');
const cloudinary = require('./../cloudinary');

exports.getUserDetail = async (req, res) => {
    try {
        if (!req.body.userId) {
            return res.status(400).json({
                message: 'userId is required',
                success: false
            });
        }
        const user = await Users.findOne({ _id: req.body.userId }).select('-password')
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                success: false
            });
        }
        res.status(200).json({
            message: 'User is fetched successfully',
            success: true,
            data: user
        });


    } catch(error) {
        res.status(400).json({
            message: error.message,
            success: false
        });
    }
};
/* this code will ensures that all users 
are returned except the logged in user.*/
exports.getAllUsers = async (req, res) => {
    try {
        if (!req.body.userId) {
            return res.status(400).json({
                message: 'userId is required',
                success: false
            });
        }
        const userid = req.body.userId; // store the id inside the variable
        const allusers = await Users.find({ _id: { $ne: userid }}).select('-password')
        res.json({
            message: 'All Users fetched successfully',
            success: true,
            data: allusers
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
            success: false
        });
    }
};
/// to uplaod profile pic from ui to cloudinary
exports.uploadProfilePic = async (req, res) =>{
try{
 const image = req.body.image;
/// UPLOAD THE IMAGE TO CLOUDINARY
const uploadedImage = await cloudinary.uploader.upload(image, {
    folder: 'bee-chat',
    format: 'jpg',
    transformation: [
        { width: 800, height: 800, crop: "limit" }
    ]
})  

/// UPDATE THE USER MODEL & SET THE PROFILE PIC PROPERTY
const user = await Users.findByIdAndUpdate({
                     _id: req.body.userId},
                    {profilePic: uploadedImage.secure_url },
                    {new: true})

res.send({
    message: 'Profile Picture Uploaded Successfully..',
    success: true,
    data: user
})
}catch(error){
    res.send({
        message: error.message,
        sucess: false
    })
}
};