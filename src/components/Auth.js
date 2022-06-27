class Auth {
    
    isAuth(){
        if(localStorage.getItem('token')) return true;
        else return false;
    }

}

export default new Auth();