import jwtDecode from 'jwt-decode';

class ExpireToken{
    
    ExpToken = () =>{
        let token = localStorage.getItem('token');
        if(!token) {
            return true;
        }
        let decoded = jwtDecode(token);
        // console.log(JSON.stringify(decoded));
        // console.log(Math.floor(Date.now()/1000));

        if(decoded.exp < Math.floor(Date.now()/1000)){
            return true;
        }else{
            return false;
        }
    }
}
export default new ExpireToken();