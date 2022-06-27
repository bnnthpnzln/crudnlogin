import ThemeProvider from 'react-bootstrap/ThemeProvider'
import Container from 'react-bootstrap/Container'
import { Row, Col} from 'react-bootstrap'
import  Card  from "react-bootstrap/card"
import Form from 'react-bootstrap/form'
import { useNavigate } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { useState, useEffect } from "react"
import axios from "axios"
import auth from './Auth'
import user from '../img/user1.png'

const Login = (props) => {

    const navigate = useNavigate();

    useEffect(() => {
        if(auth.isAuth()) return navigate('/userlist');
    }, []);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');
    const [error2, setError2] = useState('');

    const handleSubmitLogin = (e) => {
        e.preventDefault()
        axios( {
            headers:{
                "Content-Type": "multipart/form-data"
            },
            method:'POST', 
            url:'https://marketplace2.unified.ph/Login',
            data:{
                username: username,
                password: password
            }
        })
        .then(result=>{
            let res = result.data
            console.log(JSON.stringify(res))
            if(res.status){
                localStorage.setItem('token', res.token)
                localStorage.setItem('username', username)
                localStorage.setItem('password', password)
                if(auth.isAuth() === null) return;
                navigate("/userlist")
            }else if( username === "" || password === ""){
                setError('*Fields are required');
            }else{
                setError2('*Invalid Inputs!');
            }
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
                                        Username:
                                    </Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        placeholder="Username"
                                        value={username}
                                        onChange={(e) =>setUsername(e.target.value)}
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
                                    >
                                    </Form.Control>
                                </Form.Group>
                                <Button 
                                    type = "submit"
                                    style={{ margin: 10 }}
                                    className='btn1 bg-color-white'
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

export default Login