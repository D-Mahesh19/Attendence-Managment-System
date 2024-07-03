import React, { useState,useEffect } from 'react'
import logo from '../Assets/bird_2.jpg'
import{useNavigate} from 'react-router-dom'
import axios from'axios';

export default function LogIn() {
const[cap,setCap]=useState('');
const navigate=useNavigate()
const[inputcap,setInputcap]=useState('');
const  [invalid,setInvalid]=useState('');
const[Email,setEmail]=useState('');
const[Password,setPassword]=useState('');
const[Data,setData]=useState({});



  function captch(n)
  {
    const char='abcdefghijklmnopqrrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0987654321'
    let capcha='';

    for(let i=0;i<n;i++)
      {
        capcha+=char[(Math.floor(Math.random()*char.length))];
      }
      setCap(capcha);

    
  }

  useEffect(() => {
    captch(6);
  }, []);
  useEffect(() => {
    axios.get('http://localhost:8081/Employeget',{ params: { Email }})
    .then((response)=>{
      console.log(response.data);
      setData(response.data)
      
    })
    .catch((err)=>{
      console.log(err);
    });
  }, [Email]);
  const calc=(e)=>{
    e.preventDefault();
   
    if(Data && Email===Data.Email && Password===Data.Password )
      { 

        if(inputcap===cap)
        {
          const email=Data.Email;
          navigate(`/Dashbord/${Email}`);
        }
        else
        {
          setInvalid('Enter a valid captcha')
          setInputcap('')
        }
      }
      else{
        setInvalid("Enter a valid Email and Password")
          setEmail('');
          setPassword('');
      }
     

  }

 
  
  return (
    <div className='LogIn'>
      <div className='log-form'>
      <h1>Employee LogIn</h1>
         <img src={logo}alt="Image Logo" /> 
         <button className='h_btn'><b>Help! </b>
        </button>
        
        
        <form onSubmit={calc}>
        <p className='edisplay'>{invalid}</p>
          <p>Login Id: <br /><input type="text" placeholder='Enter your Id ' required value={Email}  onChange={e=>{setEmail(e.target.value)}}/></p>
          <p>Password :<br/><input type="password" placeholder='Enter your password' required value={Password} onChange={e=>{setPassword(e.target.value)}}/></p>
          <p className='captch'>{cap}  </p>
          <p className='re-icon'><i class="fa-solid fa-arrows-rotate" onClick={()=>{captch(6)}}></i></p>
          <input className="cap-input"type="text" placeholder='Enter the Captcha' value={inputcap} onChange={e=>{setInputcap(e.target.value)}}/>
          <button type='submit' >LogIn</button>
          
          
        </form> 
        
        
      </div>
        
    </div>
  )
}
