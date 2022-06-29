import React from 'react'
import { Button, Row, Col, Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from "react"
import Modal from 'react-bootstrap/Modal'
import warning from '../img/warning.png'
import axios from "axios"
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import ExpireToken from './ExpireToken';
import _ from 'lodash';
import empty from '../img/empty.jpg';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { FaTrashAlt, FaEdit} from 'react-icons/fa';


const swal = withReactContent(Swal);
const EmpList = (props) => {

    const navigate = useNavigate();
    
    const [show, setShow] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showViewEditModal, setShowViewEditModal] = useState(false);
    const [showDelete, setShowDeleteModal] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleEditClose = () => setShowViewEditModal(false);
    const handleShowEdit = () => setShowViewEditModal(true);

    const handleCreateClose = () =>{ 
        setName('');
        setPhone('');
        setEmail('');
        setLocation('');
        setEmpId('');
        setCompany('');
        setShowCreateModal(false);
    }
    const handleShowCreate = () => setShowCreateModal(true);

    const handleCloseDelete = () => setShowDeleteModal(false);


    const [editForm, setEditForm]=useState(false);

    const Logout = () => {
        localStorage.removeItem('token');
        swal.fire({
            icon: 'success',
            title:'Logged out.',
            text:'User successfully logged out.',
        });
        navigate('/');
    }

    const invalidTokenAlert = () => {
        swal.fire({
            icon: 'warning',
            title:'Logged out.',
            text:'Token Expired, Please Login again.',
        });
    }

    const [data, setData] = useState([])

    useEffect(()=>{
        reloadTable();
    },[]);
    

    const [validated,setValidated] = useState(false);
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [location, setLocation] = useState('');
    const [emp_id, setEmpId] = useState('');
    const [company, setCompany] = useState('');
    const [deleteId, setDeleteId] = useState('');
    // const [created_at, setCreatedAt] = useState('');
    // const [updated_at, setUpdatedAt] = useState('');
     
    const reloadTable = () => {
        if(ExpireToken.ExpToken()){
             navigate('/');
             return invalidTokenAlert();
        }
        var config = {
            method: 'get',
            url: 'https://gowtham-rest-api-crud.herokuapp.com/employees',
            headers: { 
                'Authorization': `Bearer ${localStorage.getItem('token')}`, 
            }
        };
        axios(config)
        .then((response)=>{
            const _ = require("lodash");
            let res = response.data
            let employeeList = res.data.employees
            let sort = _.orderBy(employeeList, ['created_at'], ['desc'])
            setData(sort)
        });
    }
    
   const openView = (id) => {
         if(ExpireToken.ExpToken()){
             navigate('/');
             return invalidTokenAlert();
        }
        axios( {
            headers:{
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('token')}`, 
            },
            method:'GET', 
            url:`https://gowtham-rest-api-crud.herokuapp.com/employees/${id}`,
            data:{
                name: name,
                phone: phone,
                email: email,
                location: location,
                emp_id: emp_id,
                company: company,
            }
        })
        .then(result=>{
            if(!result) return;
            let employee = result.data.employee;
            setEditForm(true)
            setId(employee.id)
            setName(employee.name)
            setPhone(employee.phone)
            setEmail(employee.email)
            setLocation(employee.location)
            setEmpId(employee.emp_id)
            setCompany(employee.company)

        }).catch((err)=>{
            console.log(err)
        })
   }

    const handleCreateUser = (e) =>{
         if(ExpireToken.ExpToken()){
            navigate('/');
            return invalidTokenAlert();
        }
        const form = e.currentTarget;
        // console.log(form)
        if(form.checkValidity() === false){
            e.preventDefault();
            e.stopPropagation();
        }
        else{
            setName('');
            setPhone('');
            setEmail('');
            setLocation('');
            setEmpId('');
            setCompany('');
            swal.fire({
                icon: 'success',
                text:'Successfully Added.',
                showConfirmButton: false,
                timer: 2000,
            });
        }
        setEditForm(false);
        setValidated(true);
        e.preventDefault();
        axios( {
            headers:{
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('token')}`, 
            },
            method:'POST', 
            url:'https://gowtham-rest-api-crud.herokuapp.com/employees',
            data:{
                name: name,
                phone: phone,
                email: email,
                location: location,
                emp_id: emp_id,
                company: company,
            }
        })
        .then(result=>{
            if (result) {
                reloadTable();
                handleCreateClose();
            }
        }).catch((err)=>{
                console.log(err)
        })
    }

    const handleShowDelete = (id) =>{
         if(ExpireToken.ExpToken()){
            navigate('/');
            return invalidTokenAlert();
        }
        if(!id) return;
        setShowDeleteModal(true);
        setDeleteId(id);
        
    }

    const deleteItem = () => {
        var config = {
            method: 'delete',
            url: `https://gowtham-rest-api-crud.herokuapp.com/employees/${deleteId}`,
            headers: { 
              'Authorization': `Bearer ${localStorage.getItem('token')}`, 
            }
        };
        axios(config).then(( response )=>{
            if(!response)return;
            reloadTable() ;
            setDeleteId('');
            swal.fire({
                icon: 'success',
                text:'Successfully Deleted.',
                showConfirmButton: false,
                timer: 2000,
            });
            setShowDeleteModal(false);
        }).catch(err=>{
            console.error(err);
        });
    }

    const handleEditSubmit = (e) => {
         if(ExpireToken.ExpToken()){
            navigate('/');
            return invalidTokenAlert();
        }
        const formEdit = e.currentTarget;
        // console.log(formEdit)
        if(formEdit.checkValidity() === false){
            e.preventDefault();
            e.stopPropagation();
        }else{
            setName('');
            setPhone('');
            setEmail('');
            setLocation('');
            setEmpId('');
            setCompany('');
            swal.fire({
                icon: 'success',
                text:'Successfully Updated.',
                showConfirmButton: false,
                timer: 2000,
            });
        }
        setEditForm(false);
        setValidated(true);
        e.preventDefault();
        axios( {
            headers:{
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('token')}`, 
            },
            method:'PUT', 
            url:`https://gowtham-rest-api-crud.herokuapp.com/employees/${id}`,
            data:{
                name: name,
                phone: phone,
                email: email,
                location: location,
                emp_id: emp_id,
                company: company,
            }
        })
        .then(result=>{
            // console.log(data)
            if(result) 
            reloadTable();
            handleEditClose();
        })
        .catch(error =>{
            alert('invalid token', error)
        })
    }

  return (
    <div className='position-relative overflow' style={{padding: '5%'}}>
        <Button 
            variant="danger" 
            className='btn1 bg-color-white' 
            onClick={handleShow}
        >
            Logout
        </Button>

        {/* Logout Modal */}
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
                    type='button'
                    variant="danger" 
                    className='m-px btn1' 
                    onClick={handleClose}
                >
                    No
                </Button>
            </Modal.Body>
        </Modal>

        {/* Update Confirmation Modal */}
        <Modal 
            show={showViewEditModal} 
            onHide={handleEditClose} 
            {...props}
            size="ml"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >
            <Modal.Header closeButton>
                <Modal.Title className='font-bold'>Confirm Information</Modal.Title>
            </Modal.Header>
                <Form.Control 
                    type="text" 
                    placeholder="ID" 
                    onChange={(e) =>setId(e.target.value)} 
                    value={id}
                    name="name"
                    required
                    className='form-control-input'
                    hidden
            ></Form.Control>
            
            <Modal.Body>
                <Form.Group className='m-px'>
                    <div className='flex'>
                        <Form.Label className='font-bold m-px'>Name : </Form.Label>
                        <div className='m-px'>{name}</div>
                    </div>
                </Form.Group>

                <Form.Group className='m-px'>
                    <div className='flex'>
                        <Form.Label className='font-bold m-px'>Phone : </Form.Label>
                        <div className='m-px'>{phone}</div>
                    </div>
                </Form.Group>
                
                <Form.Group className='m-px'>
                    <div className='flex'>
                        <Form.Label className='font-bold m-px'>Email : </Form.Label>
                        <div className='m-px'>{email}</div>
                    </div>
                </Form.Group>
                
                <Form.Group className='m-px'>
                    <div className='flex'>
                        <Form.Label className='font-bold m-px'>Location : </Form.Label>
                        <div className='m-px'>{location}</div>
                    </div>
                </Form.Group>

                <Form.Group className='m-px'>
                    <div className='flex'>
                        <Form.Label className='font-bold m-px'>Employee ID : </Form.Label>
                        <div className='m-px'>{emp_id}</div>
                    </div>
                </Form.Group>
                
                <Form.Group className='m-px'>
                    <div className='flex'>
                        <Form.Label className='font-bold m-px'>Company : </Form.Label>
                        <div className='m-px'>{company}</div>
                    </div>
                </Form.Group>

            </Modal.Body>
            <Modal.Footer>
                <Button 
                    type='submit'
                    variant="primary" 
                    className='m-px btn1' 
                    onClick={(e)=>handleEditSubmit(e)}
                >
                    Submit
                </Button>

                <Button 
                    type='button'
                    variant="danger" 
                    className='m-px btn1' 
                    onClick={handleEditClose}
                >
                    Retry
                </Button>
            </Modal.Footer>    
            
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal 
            show={showDelete} 
            onHide={handleCloseDelete} 
            {...props}
            size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >
            <Modal.Body className='text-center'>
                <img src={warning} alt="warning icon" />
                <h4>Are you sure you want to Delete this?</h4>

                <Button 
                    type='submit'
                    variant="success" 
                    className='m-px btn1' 
                    onClick={()=>deleteItem()}
                    data-id={deleteId}
                >
                    Yes
                </Button>
                <Button 
                    type='button'
                    variant="danger" 
                    className='m-px btn1' 
                    onClick={handleCloseDelete}
                >
                    No
                </Button>
            </Modal.Body>
        </Modal>
        
        {/* Create Confirmation Modal */}
        <Modal 
            show={showCreateModal} 
            onHide={handleCreateClose} 
            
            {...props}
            size="ml"
            aria-labelledby="contained-modal-title-vcenter"
            centered
    
        >
            <Modal.Body>

                    <Modal.Header closeButton>
                        <Modal.Title className='font-bold'>Confirm Information</Modal.Title>
                    </Modal.Header>
                        <Form.Control 
                            type="text" 
                            placeholder="ID" 
                            onChange={(e) =>setId(e.target.value)} 
                            value={id}
                            name="name"
                            required
                            className='form-control-input'
                            hidden
                        ></Form.Control>
                    <Modal.Body>
                        <Form.Group className='m-px'>
                            <div className='flex'>
                                <Form.Label className='font-bold m-px'>Name : </Form.Label>
                                <div className='m-px'>{name}</div>
                            </div>
                        </Form.Group>

                        <Form.Group className='m-px'>
                            <div className='flex'>
                                <Form.Label className='font-bold m-px'>Phone : </Form.Label>
                                <div className='m-px'>{phone}</div>
                            </div>
                        </Form.Group>
                        
                        <Form.Group className='m-px'>
                            <div className='flex'>
                                <Form.Label className='font-bold m-px'>Email : </Form.Label>
                                <div className='m-px'>{email}</div>
                            </div>
                        </Form.Group>
                        
                        <Form.Group className='m-px'>
                            <div className='flex'>
                                <Form.Label className='font-bold m-px'>Location : </Form.Label>
                                <div className='m-px'>{location}</div>
                            </div>
                        </Form.Group>

                        <Form.Group className='m-px'>
                            <div className='flex'>
                                <Form.Label className='font-bold m-px'>Employee ID : </Form.Label>
                                <div className='m-px'>{emp_id}</div>
                            </div>
                        </Form.Group>
                        
                        <Form.Group className='m-px'>
                            <div className='flex'>
                                <Form.Label className='font-bold m-px'>Company : </Form.Label>
                                <div className='m-px'>{company}</div>
                            </div>
                        </Form.Group>

                    </Modal.Body>

                    <Modal.Footer>
                        <Button  
                            type="button" 
                            onClick={(e)=>handleCreateUser(e)} 
                            className='btn1' 
                            variant='primary'
                        >
                            Submit
                        </Button>
                        <Button  
                            type="button" 
                            onClick={handleCreateClose} 
                            className='btn1' 
                            variant='danger'
                        >
                            Retry
                        </Button>


                    </Modal.Footer>
            </Modal.Body>
        </Modal>

        <Row>
            <Col className='m-px' style={{width:'75%'}}>
                <div className='shadow bg-gray-100 p-px border-radius'>
                
                {data.length > 0 && <>
                    <Table responsive>
                        <thead> 
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Email</th>
                                <th>Location</th>
                                <th>Employee ID</th>
                                <th>Company</th>
                                <th>Created At</th>
                                <th>Updated At</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody >
                            
                            {data.map((u)=>(

                            <tr key={u.id}>
                                <td>{u.id}</td>
                                <td>{u.name}</td>
                                <td>{u.phone}</td>
                                <td>{u.email}</td>
                                <td>{u.location}</td>
                                <td>{u.emp_id}</td>
                                <td>{u.company}</td>
                                <td>{u.created_at}</td>
                                <td>{u.updated_at}</td>
                                <td>
                                    <div className='flex'>
                                        <Button
                                            variant="primary" 
                                            className='m-px btn1 bg-color-white'
                                            onClick={()=>{openView(u.id) }}
                                        >
                                            <FaEdit/>
                                        </Button>
                                        <Button 
                                            onClick={()=>{handleShowDelete(u.id)}}
                                            variant="danger"
                                            className='m-px btn1'
                                        >
                                            <FaTrashAlt/>
                                        </Button>
                                    </div>
                                </td>
                            
                            </tr>
                            ))}
                        </tbody>
                    </Table>
                </>}
                
                {data.length < 1 && 
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <h1>Empty Data</h1>
                        <img src={empty} alt='empty pic' style={{width: '300px', height: '300px'}}></img>
                    </div>
                            
                }

                </div>
            </Col>
            
            <Col className='m-px' style={{width:'25%'}}>
                <div className='form-inputs shadow bg-gray-100 p-px border-radius m-auto'>
                    
                    {/* Create Employee */}
                    {editForm===false&&(
                    <>
                        <h2 className='font-bold color-white'>Create Employee</h2>
                        
                        <Form noValidate validated={validated} {...props}>
                            <Form.Group className='m-px'>
                                <Form.Label className='m-px font-px font-bold color-white'>Name :</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Name"
                                    pattern="[a-zA-Z0-9\s]+"
                                    required
                                    onChange={(e) =>setName(e.target.value)} 
                                    value={name}
                                    className='form-control-input'
                                >
                                </Form.Control>
                                    <Form.Control.Feedback type='invalid'>Please input valid Name!</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className='m-px'>
                                <Form.Label className='m-px font-px font-bold color-white'>
                                    Phone :
                                </Form.Label>
                                <Form.Control 
                                    type="text" 
                                    required
                                    placeholder="Phone Number"
                                    pattern='^[0-9]+$'
                                    value={phone}
                                    onChange={(e) =>setPhone(e.target.value)}
                                    className='form-control-input'
                                >
                                </Form.Control>
                                    <Form.Control.Feedback type='invalid'>Phone must be a number!</Form.Control.Feedback>
                            </Form.Group>
                            
                            <Form.Group className='m-px'>
                                <Form.Label className='m-px font-px font-bold color-white'>Email :</Form.Label>
                                <Form.Control 
                                    type="email" 
                                    placeholder="Email"
                                    pattern='[A-Z-a-z0-9._%+-]+@[A-Z-a-z0-9.-]+\.[A-Z-a-z]{2,}$'
                                    required
                                    onChange={(e) =>setEmail(e.target.value)} 
                                    value={email}
                                    className='form-control-input'
                                >
                                </Form.Control>
                                <Form.Control.Feedback type='invalid'>Please input valid Email Address!</Form.Control.Feedback>
                            </Form.Group>
                            
                            <Form.Group className='m-px'>
                                <Form.Label className='m-px font-px font-bold color-white'>Location :</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Location"
                                    required
                                    onChange={(e) =>setLocation(e.target.value)} 
                                    value={location}
                                    className='form-control-input'
                                >
                                </Form.Control>
                                <Form.Control.Feedback type='invalid'>Please input valid Location!</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className='m-px'>
                                <Form.Label className='m-px font-px font-bold color-white'>Employee ID :</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Employee ID"
                                    pattern='^[0-9]+$'
                                    required
                                    onChange={(e) =>setEmpId(e.target.value)} 
                                    value={emp_id}
                                    className='form-control-input'
                                >
                                </Form.Control>
                                <Form.Control.Feedback type='invalid'>Employee ID must be a number!</Form.Control.Feedback>
                            </Form.Group>
                            
                            <Form.Group className='m-px'>
                                <Form.Label className='m-px font-px font-bold color-white'>Company :</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Company"
                                    required
                                    onChange={(e) =>setCompany(e.target.value)} 
                                    value={company}
                                    className='form-control-input'
                                >
                                </Form.Control>
                                <Form.Control.Feedback type='invalid'>Please input valid Company!</Form.Control.Feedback>
                            </Form.Group>
                            
                            <Button 
                                type="button" 
                                style={{ margin: 10 }}
                                className='btn1 bg-color-white flex'
                                variant='primary'
                                onClick={handleShowCreate}
                            >
                                Create
                            </Button>
                        </Form>
                    </>)}
                    
                    {/* Update Employee */}
                    {editForm===true&&(
                    <>
                        <h2 className='font-bold color-white'>Update Employee</h2>
                        
                        <Form noValidate onSubmit={handleEditSubmit} validated={validated} {...props}>

                            <Form.Group className='m-px'>
                                <Form.Label className='m-px font-px font-bold color-white'>Name : </Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Name"
                                    pattern="[a-zA-Z0-9\s]+"
                                    required
                                    onChange={(e) =>setName(e.target.value)} 
                                    value={name}
                                    className='form-control-input'
                                >
                                </Form.Control>
                                    <Form.Control.Feedback type='invalid'>Please input valid Name!</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className='m-px'>
                                <Form.Label className='m-px font-px font-bold color-white'>
                                    Phone :
                                </Form.Label>
                                <Form.Control 
                                    type="text" 
                                    required
                                    placeholder="Phone Number"
                                    // pattern='^[0-9]+$'
                                    value={phone}
                                    onChange={(e) =>setPhone(e.target.value)}
                                    className='form-control-input'
                                >
                                </Form.Control>
                                    <Form.Control.Feedback type='invalid'>Phone must be a number!</Form.Control.Feedback>
                            </Form.Group>
                            
                            <Form.Group className='m-px'>
                                <Form.Label className='m-px font-px font-bold color-white'>Email :</Form.Label>
                                <Form.Control 
                                    type="email" 
                                    placeholder="Email"
                                    pattern='[A-Z-a-z0-9._%+-]+@[A-Z-a-z0-9.-]+\.[A-Z-a-z]{2,}$'
                                    required
                                    onChange={(e) =>setEmail(e.target.value)} 
                                    value={email}
                                    className='form-control-input'
                                >
                                </Form.Control>
                                <Form.Control.Feedback type='invalid'>Please input valid Email Address!</Form.Control.Feedback>
                            </Form.Group>
                            
                            <Form.Group className='m-px'>
                                <Form.Label className='m-px font-px font-bold color-white'>Location :</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Location"
                                    required
                                    onChange={(e) =>setLocation(e.target.value)} 
                                    value={location}
                                    className='form-control-input'
                                >
                                </Form.Control>
                                <Form.Control.Feedback type='invalid'>Please input valid Location!</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className='m-px'>
                                <Form.Label className='m-px font-px font-bold color-white'>Employee ID :</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Employee ID"
                                    pattern='^[0-9]+$'
                                    required
                                    onChange={(e) =>setEmpId(e.target.value)} 
                                    value={emp_id}
                                    className='form-control-input'
                                >
                                </Form.Control>
                                <Form.Control.Feedback type='invalid'>Employee ID must be a number!</Form.Control.Feedback>
                            </Form.Group>
                            
                            <Form.Group className='m-px'>
                                <Form.Label className='m-px font-px font-bold color-white'>Company :</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Company"
                                    required
                                    onChange={(e) =>setCompany(e.target.value)} 
                                    value={company}
                                    className='form-control-input'
                                >
                                </Form.Control>
                                <Form.Control.Feedback type='invalid'>Please input valid Company!</Form.Control.Feedback>
                            </Form.Group>
                            
                            <Button 
                                type="button" 
                                style={{ margin: 10 }}
                                className='btn1 bg-color-white'
                                variant='primary'
                                onClick={()=>handleShowEdit()}
                            >
                                Update
                            </Button>
                        </Form>
                    </>)}
                </div>
            </Col>
        </Row>
    </div>
  )
}

export default EmpList