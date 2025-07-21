function signup(req , res){
    res.render("signUp")
}

function login(req , res){
    res.render("login")
}

module.exports ={
  signup,
  login
}