
function authenticated(req , res , next){
  if(req.session.user){
    res.redirect('/');
  }else{
    next();
  }
}

function login(req , res){
    res.render("login")
}

module.exports ={
  authenticated,
  login
}