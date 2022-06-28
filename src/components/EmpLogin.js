import ThemeProvider from 'react-bootstrap/ThemeProvider'
import Container from 'react-bootstrap/Container'
import { Row, Col} from 'react-bootstrap'
import  Card  from "react-bootstrap/card"
import Form from 'react-bootstrap/form'
import { useNavigate } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import Alert from 'react-bootstrap/Alert'
import { useState, useEffect } from "react"
import axios from "axios"
import auth from './Auth'
import user from '../img/user1.png'
import ExpireToken from './ExpireToken'
import Modal from 'react-bootstrap/Modal'
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';


const swal = withReactContent(Swal);

const EmpLogin = (props) => {

    const navigate = useNavigate();

    useEffect(() => {
        if(!ExpireToken.ExpToken()) return navigate('/Emplist');
    }, []);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');
    const [error2, setError2] = useState('');

    const [show, setShow] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleCloseSuccess = () => setShow(false);
    const handleShowSuccess = () => setShow(true);

    const validateLogin = (error) => {
        if(error){
            swal.fire({
                title:'Email and Password Mismatch',
                text:'Invalid Account.',
            });
            return false;
        }
        if(email.length === 0 || password.length === 0){
            swal.fire({
                title:'Invalid Input',
                text:'Text Fields cannot be empty.',
            });
            return false;
        }
        if(password.length <= 7){
            swal.fire({
                title:'Invalid Input',
                text:'Password should not be less than 8 characters.',
            });
            return false;
        }

        return true;
    };
    const handleSubmitLogin = (e) => {
        e.preventDefault();
        if(!validateLogin()){
            return
        };
        axios( {
            headers:{
                "Content-Type": "multipart/form-data"
            },
            method:'POST', 
            url:'https://gowtham-rest-api-crud.herokuapp.com/login',
            data:{
                email: email,
                password: password
            }
        })
        .then(result=>{
            let res = result.data
            console.log(JSON.stringify(res))
            if(res.status){
                localStorage.setItem('token', res.token);
                localStorage.setItem('email', email);
                swal.fire({
                    icon: 'success',
                    title:'Logged in.',
                    text:'User successfully logged in.',
                });
                if(auth.isAuth() === null) return;
                navigate("/Emplist");
            }
        })
        .catch(function (error){
            validateLogin(error);
            // console.log(error);
            // if(error.response.status === 401){
            //     setShow(true);
            // }
        })
    }

  return (
    <ThemeProvider
        breakpoints={['xxxl', 'xxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs']}
    >
        <Container>
            <Row>
                <Col style={{ margin:5 }}>

                <Card 
                        style={{ 
                            width: '25rem',
                            padding: '10px'
                        }}
                        className='card m-auto'
                    >
                        <h2 className="h2">Sign Up</h2>
                        <img src={user} alt="user logo" className='logo'/>
                        <Card.Body>
                            <Form onSubmit={handleSubmitLogin}>
                                
                                {/* <Alert show={show} variant="danger" onClose={() => setShow(false)} dismissible>
                                    <h5>
                                        Invalid Users!
                                    </h5>
                                </Alert> */}
                                {error && (
                                    <p
                                        severity="error" 
                                        onClick={() => 
                                        setError(null)}
                                        variant="danger"
                                        type='invalid'
                                        style={{color:'#d0342c'}}
                                    >
                                        {props.error || error}
                                    </p>
                                )}

                                {error2 && (
                                    <p
                                        severity="error2" 
                                        onClick={() => 
                                        setError2(null)}
                                        variant="danger"
                                        style={{color:'#d0342c'}}
                                    >
                                        {props.error2 || error2}
                                    </p>
                                )} 

                                <Form.Group style={{
                                    margin:5
                                }}>
                                    <Form.Label 
                                        className='font-bold' 
                                        style={{
                                            color: '#fff',
                                            fontSize: '18px',
                                            letterSpacing: '1px'
                                        }}
                                    >
                                        Email:
                                    </Form.Label>
                                    <Form.Control 
                                        type="email" 
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) =>setEmail(e.target.value)}
                                        className='form-control-input'
                                    >
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group style={{
                                    margin:5
                                }}>
                                    <Form.Label 
                                        className='font-bold'
                                        style={{
                                            color: '#fff',
                                            fontSize: '18px',
                                            letterSpacing: '1px'
                                        }}
                                    >
                                        Password:
                                    </Form.Label>
                                    <Form.Control 
                                        type="password" 
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) =>setPassword(e.target.value)}
                                        className='form-control-input'
                                        autoComplete=''
                                    >
                                    </Form.Control>
                                </Form.Group>
                                <Button 
                                    type = "submit"
                                    style={{ margin: 10 }}
                                    className='btn1 bg-color-white'
                                    // onClick={handleShowSuccess}
                                >
                                        Login
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    </ThemeProvider>
  )
}

export default EmpLogin