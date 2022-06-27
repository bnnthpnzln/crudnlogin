import React from 'react'
import auth from './Auth';
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from "react"
import ReactDOM from 'react-dom/client'
import Modal from 'react-bootstrap/Modal'
import warning from '../img/warning.png'
import _, { forEach } from 'lodash';
import axios from "axios"
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';


const UserList = (props) => {
    const navigate = useNavigate();

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const Logout = () => {
        localStorage.removeItem('token');
        navigate('/');
    }
    const [data,setData] = useState([])
    useEffect(()=>{
       reloadTable();
        if(!auth.isAuth()) return navigate('/');
       
    },[])

    const [validated,setValidated] = useState(false)   
    const [id, setId]=useState('');
    const [username, setUsername]=useState('');
    const [password, setPassword]=useState('');
    const [firstName, setFirstName]=useState('');
    const [middleName, setMiddleName]=useState('');
    const [lastName, setLastName]=useState('');
    const [email, setEmail]=useState('');
    
    const deleteItem = (id) =>{
        var config = {
            method: 'delete',
            url: 'https://marketplace2.unified.ph/admin-list/${id}',
            headers: { 
              'Authorization': `Bearer ${localStorage.getItem('token')}`, 
            }
        };
        axios(config).then(( response )=>{
           if(response) reloadTable();
        });
    }
     
    const reloadTable = () => {
        var config = {
            method: 'get',
            url: 'https://marketplace2.unified.ph/admin-list',
            headers: { 
              'Authorization': `Bearer ${localStorage.getItem('token')}`, 
            }
        };
        axios(config).then((response)=>{
            setData(response.data)
        });
    }
    
   

    const handleCreateUser = (e) =>{
        
        const form = e.currentTarget;
        console.log(form)
        if(form.checkValidity() === false){
            e.preventDefault();
            e.stopPropagation();
        }else{

        }
        setValidated(true);
        e.preventDefault();
        axios( {
            headers:{
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('token')}`, 
            },
            method:'POST', 
            url:'https://marketplace2.unified.ph/admin-register',
            data:{
                id: id,
                username: username,
                password: password,
                fname: firstName,
                mname: middleName,
                lname: lastName,
                email: email
            }
        })
        .then(result=>{
            let res = result.data
            console.log(JSON.stringify(res))
            if(result)reloadTable();
        }).catch((err)=>{
            console.log(err)
        })
    }

  return (
    <div className='container position-relative overflow'>
        <Button 
            variant="danger" 
            className='btn1' 
            onClick={handleShow}
        >
            Logout
        </Button>

        <Modal 
            show={show} 
            onHide={handleClose} 
            {...props}
            size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >
            <Modal.Body className='text-center'>
                <img src={warning} alt="warning icon" />
                <h4>Are you sure you want to logout?</h4>
                <Button 
                    type='submit'
                    variant="success" 
                    className='m-px btn1' 
                    onClick={Logout}
                >
                    Yes
                </Button>
                <Button 
                    type='submit'
                    variant="danger" 
                    className='m-px btn1' 
                    onClick={handleClose}
                >
                    No
                </Button>
            </Modal.Body>
        </Modal>

        <div className='shadow bg-gray-100 p-px border-radius'>

            <Table className='text-left' id='table-list' responsive>

                <thead> 
                    <tr className='font-bold'>
                        <td>ID</td>
                        <td>First Name</td>
                        <td>Middle Name</td>
                        <td>Last Name</td>
                        <td>Email</td>
                        <td>Action</td>
                    </tr>
                </thead>

                <tbody id="table-list-body">
                    

                    {data.map((u)=>(

                    <tr key={u.id}>
                        <td>{u.id}</td>
                        <td>{u.fname}</td>
                        <td>{u.mname}</td>
                        <td>{u.lname}</td>
                        <td>{u.email}</td>
                        <td>
                            <span>
                                <Button
                                    variant="primary" 
                                    className='m-px btn1'
                                >
                                    Edit
                                </Button>
                            </span>
                            <span>
                                <Button 
                                    onClick={()=>{deleteItem(u.id)}}
                                    variant="danger"
                                    className='m-px btn1'
                                >
                                    Delete
                                </Button>
                            </span>
                        </td>
                    
                    </tr>
                    ))}
                </tbody>
            </Table>
        </div>

        <div className='shadow bg-gray-100 p-px'>
                <Form noValidate onSubmit={handleCreateUser} validated={validated} {...props}>

                    <Form.Group>
                        <Form.Label className='text-left'>Username</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Username"
                            required
                            onChange={(e) =>setUsername(e.target.value)} 
                            value={username}>
                        </Form.Control>
                        <Form.Control.Feedback type='invalid'>Please input ID!</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label className='font-bold'>
                            Password
                        </Form.Label>
                        <Form.Control 
                            type="password" 
                            required
                            placeholder="Password"
                            value={password}
                            onChange={(e) =>setPassword(e.target.value)}
                        >
                        </Form.Control>
                        <Form.Control.Feedback type='invalid'>Please input valid password!</Form.Control.Feedback>
                    </Form.Group>
                    
                    <Form.Group>
                        <Form.Label className='text-left'>Firstname</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Firstname"
                            required
                            onChange={(e) =>setFirstName(e.target.value)} 
                            value={firstName}>
                        </Form.Control>
                    </Form.Group>
                    
                    <Form.Group>
                        <Form.Label className='text-left'>Middlename</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Middlename"
                            required
                            onChange={(e) =>setMiddleName(e.target.value)} 
                            value={middleName}>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label className='text-left'>Lastname</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Lastname"
                            required
                            onChange={(e) =>setLastName(e.target.value)} 
                            value={lastName}>
                        </Form.Control>
                    </Form.Group>
                    
                    <Form.Group>
                        <Form.Label className='text-left'>Email</Form.Label>
                        <Form.Control 
                            type="email" 
                            placeholder="Email"
                            required
                            onChange={(e) =>setEmail(e.target.value)} 
                            value={email}>
                        </Form.Control>
                    </Form.Group>
                    
                    <Button type="submit">Create</Button>
                </Form>
            </div>

    </div>
  )
}

export default UserList