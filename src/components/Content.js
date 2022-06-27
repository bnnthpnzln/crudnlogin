import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import React, {useState, useEffect} from 'react';
import {Button} from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom'
import auth from './Auth'
import warning from '../img/warning.png'

// getting the values of local storage
const getDatafromLS = () => {
    const data = localStorage.getItem('userData');
    if(data){
        return JSON.parse(data);
    }
    else{
        return []
    }
}

const Content = (props) => {
    const navigate = useNavigate();

    const Logout = () => {
        localStorage.removeItem('token');
        navigate('/');
    }
    //for modal
    const [show, setShow] = useState(false);
    const [show1, setShow1] = useState(false);
    const [show2, setShow2] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleClose1 = () => setShow1(false);
    const handleShow1 = () => setShow1(true);

    const handleClose2 = () => setShow2(false);
    const handleShow2 = () => setShow2(true);

    //main array of objects state
    const [userData, setUserData]=useState(getDatafromLS());

    //input field states
    const [id, setId]=useState('');
    const [firstName, setFirstName]=useState('');
    const [middleName, setMiddleName]=useState('');
    const [lastName, setLastName]=useState('');
    const [email, setEmail]=useState('');
    const [contactNumber, setContactNumber]=useState('');

    //validation
    const [validated, setValidated] = useState(false);

    //form submit event
    const handleSubmit=(e)=>{
        const form = e.currentTarget;
        if (form.checkValidity() === false){
        e.preventDefault();
        e.stopPropagation();
        } else if (form.checkValidity() === true) {
            let users={
                id: id,
                firstName: firstName,
                middleName: middleName,
                lastName: lastName,
                email: email,
                contactNumber: contactNumber
            }
            setUserData([...userData, users]);
            setId('');
            setFirstName('');
            setMiddleName('');
            setLastName('');
            setEmail('');
            setContactNumber('');
        }
        setValidated(true);
    }

    //delete data from local storage
    const deleteUserData=(id)=>{
        const filteredUser=userData.filter((element)=>{
            return element.id !== id
        })
        setUserData(filteredUser);
    }

    //edit form
    const [editForm, setEditForm]=useState(false);

    //update data from local storage
    const editUserData=(users, index)=>{
        setEditForm(true);
        setId(index);
        setFirstName(users.firstName);
        setMiddleName(users.middleName);
        setLastName(users.lastName);
        setEmail(users.email);
        setContactNumber(users.contactNumber);
    }

    // edit user submit
    const handleEditSubmit=(e)=>{
        const form = e.currentTarget;
        if (form.checkValidity() === false){
        e.preventDefault();
        e.stopPropagation();
        } else if (form.checkValidity() === true){
            let items = [...userData];
            let item = items[id];
            item.firstName = firstName;
            item.middleName = middleName;
            item.lastName = lastName;
            item.email = email;
            item.contactNumber = contactNumber;
            setId('');
            setFirstName('');
            setMiddleName('');
            setLastName('');
            setEmail('');
            setContactNumber('');
            setEditForm(false);
        }
        setValidated(true);
    }

    //saving data to local storage
    useEffect(()=>{
        localStorage.setItem('userData',JSON.stringify(userData));
        if(!auth.isAuth()) return navigate('/');
    },[userData])

    return (
        <div className='container position-relative overflow'>
            <Button 
                variant="danger" 
                className='ml btn1' 
                onClick={handleShow1}
            >
                Logout
            </Button>

            <Modal 
                show={show1} 
                onHide={handleClose1} 
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
                        onClick={handleClose1}
                    >
                        No
                    </Button>
                </Modal.Body>
            </Modal>

            <div className='shadow bg-gray-100 p-px border-radius'>
                    <div className='flex'>
                        <h2>User</h2>
                        <Button 
                            onClick={handleShow} 
                            variant="secondary" 
                            className='ml btn1 bg-color-white'
                        >
                            Create
                        </Button>
                    </div>

                {userData.length > 0 && <>
                
                    <Table className='text-left' responsive>

                        <thead> 
                            <tr className='font-bold'>
                                <td>ID</td>
                                <td>First Name</td>
                                <td>Middle Name</td>
                                <td>Last Name</td>
                                <td>Email</td>
                                <td>Contact Number</td>
                                <td>Action</td>
                            </tr>
                        </thead>

                        <tbody>
                            {userData.map((users,index)=>(
                                <tr key={users.id}>
                                    <td>{users.id}</td>
                                    <td>{users.firstName}</td>
                                    <td>{users.middleName}</td>
                                    <td>{users.lastName}</td>
                                    <td>{users.email}</td>
                                    <td>{users.contactNumber}</td>
                                    <td>
                                        <span>
                                            <Button 
                                                onClick={()=>{editUserData(users, index); handleShow2();}} 
                                                variant="primary" 
                                                className='m-px btn1'
                                            >
                                                Edit
                                            </Button>
                                        </span>
                                        <span>
                                            <Button 
                                                onClick={()=>deleteUserData(users.id)} 
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
                </>}

                {userData.length < 1 && 
                    
                    <Table className='text-left border-radius' responsive>
                        <thead> 
                            <tr className='font-bold'>
                                <td>ID</td>
                                <td>First Name</td>
                                <td>Middle Name</td>
                                <td>Last Name</td>
                                <td>Email</td>
                                <td>Contact Number</td>
                                <td>Action</td>
                            </tr>
                        </thead>
                    </Table>
                }
            </div>

            {/* create form */}
            {editForm===false&&(
                <Modal 
                    show={show} 
                    onHide={handleClose} 
                    {...props}
                    size="md"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    backdrop="static"
                >
                    <Form 
                        noValidate 
                        validated={validated} 
                        onSubmit={handleSubmit}
                    >

                        <Modal.Header closeButton>
                            <Modal.Title className='font-bold'>Create User</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <Form.Group>
                                <Form.Label className='font-bold'>ID</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="ID" 
                                    onChange={(e) =>setId(e.target.value)} 
                                    value={id}
                                    name="id"
                                    required
                                    className='mb-px input-box'
                                >
                                </Form.Control>
                                <Form.Control.Feedback type='valid'>Looks good!</Form.Control.Feedback>
                                <Form.Control.Feedback type='invalid'>Please input ID!</Form.Control.Feedback>
                            </Form.Group>
                            
                            <Form.Group>
                                <Form.Label className='font-bold'>First Name</Form.Label>
                                <Form.Control 
                                    type="text"
                                    pattern="[A-Za-z]{1,50}"
                                    placeholder="Firstname"
                                    onChange={(e) =>setFirstName(e.target.value)} 
                                    value={firstName}
                                    name="firstName"
                                    required
                                    className='mb-px'
                                >
                                </Form.Control>
                                <Form.Control.Feedback type='valid'>Looks good!</Form.Control.Feedback>
                                <Form.Control.Feedback type='invalid'>Please input First Name!</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label className='font-bold'>Middle Name</Form.Label>
                                <Form.Control 
                                    type="text"
                                    pattern="[A-Za-z]{1,50}"
                                    placeholder="Middlename"
                                    onChange={(e) =>setMiddleName(e.target.value)} 
                                    value={middleName}
                                    name="middleName"
                                    required
                                    className='mb-px'
                                >
                                </Form.Control>
                                <Form.Control.Feedback type='valid'>Looks good!</Form.Control.Feedback>
                                <Form.Control.Feedback type='invalid'>Please input Middle Name!</Form.Control.Feedback>
                            </Form.Group>
                            
                            <Form.Group>
                                <Form.Label className='font-bold'>Last Name</Form.Label>
                                <Form.Control 
                                    type="text"
                                    pattern="[A-Za-z]{1,50}"
                                    placeholder="Lastname"
                                    onChange={(e) =>setLastName(e.target.value)} 
                                    value={lastName}
                                    name="lastName"
                                    required
                                    className='mb-px'
                                >
                                </Form.Control>
                                <Form.Control.Feedback type='valid'>Looks good!</Form.Control.Feedback>
                                <Form.Control.Feedback type='invalid'>Please input Last Name!</Form.Control.Feedback>
                            </Form.Group>
                            
                            <Form.Group>
                                <Form.Label className='font-bold'>Email</Form.Label>
                                <Form.Control 
                                    type="email"
                                    pattern='[A-Z-a-z0-9._%+-]+@[A-Z-a-z0-9.-]+\.[A-Z-a-z]{2,}$'
                                    placeholder="Email"
                                    onChange={(e) =>setEmail(e.target.value)} 
                                    value={email}
                                    name="email"
                                    required
                                    className='mb-px'
                                >
                                </Form.Control>
                                <Form.Control.Feedback type='valid'>Looks good!</Form.Control.Feedback>
                                <Form.Control.Feedback type='invalid'>Please input valid Email Address!</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label className='font-bold'>Contact Number</Form.Label>
                                <Form.Control 
                                    type="text"
                                    pattern='^(09|\+639)\d{9}$'
                                    placeholder="Contact Number (09)-(9)"
                                    onChange={(e) =>setContactNumber(e.target.value)} 
                                    value={contactNumber}
                                    name="contactNumber"
                                    required
                                    className='mb-px'
                                >
                                </Form.Control>
                                <Form.Control.Feedback type='valid'>Looks good!</Form.Control.Feedback>
                                <Form.Control.Feedback type='invalid'>Please input valid Contact Number!</Form.Control.Feedback>
                            </Form.Group>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button  type="submit" className='btn1' variant='primary'>Add User</Button>
                        </Modal.Footer>
                    </Form>
                    
                </Modal>
            )}
            
            {/* edit form */}
            {editForm===true&&(

                <Modal 
                    show={show2} 
                    onHide={handleClose2} 
                    {...props}
                    size="md"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    backdrop="static"
                >
                    <Form 
                        noValidate 
                        validated={validated} 
                        onSubmit={handleEditSubmit}
                    >

                        <Modal.Header>
                            <Modal.Title className='font-bold'>Edit User</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <Form.Group>
                                <Form.Label className='font-bold'>ID</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="ID" 
                                    onChange={(e) =>setId(e.target.value)} 
                                    value={id}
                                    name="id"
                                    required
                                    className='mb-px'
                                >
                                </Form.Control>
                                <Form.Control.Feedback type='valid'>Looks good!</Form.Control.Feedback>
                                <Form.Control.Feedback type='invalid'>Please input ID!</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label className='font-bold'>First Name</Form.Label>
                                <Form.Control 
                                    type="text"
                                    pattern="[A-Za-z]{1,50}"
                                    placeholder="Firstname"
                                    onChange={(e) =>setFirstName(e.target.value)} 
                                    value={firstName}
                                    name="firstName"
                                    required
                                    className='mb-px'
                                >
                                </Form.Control>
                                <Form.Control.Feedback type='valid'>Looks good!</Form.Control.Feedback>
                                <Form.Control.Feedback type='invalid'>Please input First Name!</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label className='font-bold'>Middle Name</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    pattern="[A-Za-z]{1,50}"
                                    placeholder="Middlename"
                                    onChange={(e) =>setMiddleName(e.target.value)} 
                                    value={middleName}
                                    name="middleName"
                                    required
                                    className='mb-px'
                                >
                                </Form.Control>
                                <Form.Control.Feedback type='valid'>Looks good!</Form.Control.Feedback>
                                <Form.Control.Feedback type='invalid'>Please input Middle Name!</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label className='font-bold'>Last Name</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    pattern="[A-Za-z]{1,50}"
                                    placeholder="Lastname"
                                    onChange={(e) =>setLastName(e.target.value)} 
                                    value={lastName}
                                    name="lastName"
                                    required
                                    className='mb-px'
                                >
                                </Form.Control>
                                <Form.Control.Feedback type='valid'>Looks good!</Form.Control.Feedback>
                                <Form.Control.Feedback type='invalid'>Please input Last Name!</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label className='font-bold'>Email</Form.Label>
                                <Form.Control 
                                    type="email" 
                                    pattern='[A-Z-a-z0-9._%+-]+@[A-Z-a-z0-9.-]+\.[A-Z-a-z]{2,}$'
                                    placeholder="Email"
                                    onChange={(e) =>setEmail(e.target.value)} 
                                    value={email}
                                    name="email"
                                    required
                                    className='mb-px'
                                >
                                </Form.Control>
                                <Form.Control.Feedback type='valid'>Looks good!</Form.Control.Feedback>
                                <Form.Control.Feedback type='invalid'>Please input valid Email Address!</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label className='font-bold'>Contact Number</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    pattern='^(09|\+639)\d{9}$'
                                    placeholder="Contact Number"
                                    onChange={(e) =>setContactNumber(e.target.value)} 
                                    value={contactNumber}
                                    name="contactNumber"
                                    required
                                    className='mb-px'
                                >
                                </Form.Control>
                                <Form.Control.Feedback type='valid'>Looks good!</Form.Control.Feedback>
                                <Form.Control.Feedback type='invalid'>Please input valid Contact Number!</Form.Control.Feedback>
                            </Form.Group>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button type="submit" onClick={handleClose2} className='btn1' variant='primary'>Edit User</Button>
                        </Modal.Footer>
                    </Form>
                    
                </Modal>

            )}

        </div>
    )
}

export default Content