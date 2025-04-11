const jwt = require('jsonwebtoken');

module.exports = (req, res, next)=>{
try{
const token = req.headers.authorization.split(' ')[1]; // to get the second element in the array.
const decodedToken = jwt.verify(token, process.env.Secret_Key); // {User_id}// this function will return a userID by itself.
// if the token is valid.

req.body.userId = decodedToken.userId
next();
}catch(error){
res.send({
    message: error.message,
    success: false
})
}

}