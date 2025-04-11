const Users = require('./../models/usermodel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
exports.signup = async (req, res) =>{
    try{
        console.log(req.body)
    ////1. checking if the user exists
   const user = await Users.findOne({email: req.body.email})
   
   /// 2. if he exists
   if(user){
    return res.send({
        status: 400,
        message: 'The User already Exist..',

     })
   }
    
     ///3. encrypting the password before saving it
     const hashedpassword = await bcrypt.hash(req.body.password, 10);
     req.body.password = hashedpassword;

     /// 4. Creating a new user into the database 
     const newUser = new Users(req.body);
     await newUser.save(); /// saving the user into the database
     console.log("Signup successful.");
    return res.status(201).json({
        success: true,
        message: 'User Created Successfully!',
        user: {
            newUser
        }
     })
      
    }catch(err){
      return res.send({
            message: err.message,
            sucsess: false
        })
    }
}

// LOGIN API
exports.login = async (req, res) =>{
try{
    /// 1. Checking of the user exits
    const authHeader = req.headers.authorization;
 //console.log("Authorization Header:", authHeader);
    console.log(req.body)
    const reqemail = req.body.email;
    const user = await Users.findOne({email: reqemail})
    if(!user){
       return res.send({
            success: false,
            message: 'User does not exits'
        })
    }

    /// 2. Checking if the passwoed is correct
      const isvalid = await bcrypt.compare(req.body.password, user.password); // this function is async and it returns a promise.
      if(!isvalid){
       return res.send({
            success: false,
            message: 'Password is Invalid please try again'
        })
      }
/// 3 if the Password Exist and user exist then assign the JWT here.
    const token = jwt.sign({userId: user._id},process.env.Secret_Key,{expiresIn: '1d'})
    console.log("Login successful.");
   return res.send({
        success: true,
        message: "User Logged In Successfully.",
        token
      
    })
    
    }catch(error){
    return res.send({
    success: false,
    message: 'User failed to login'
})
}
}
