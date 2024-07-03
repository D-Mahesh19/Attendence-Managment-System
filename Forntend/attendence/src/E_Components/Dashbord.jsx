import React, { useEffect, useState } from 'react'
import Hr from '../Assets/Hr.jpg'
import Employe from '../Assets/Employe.jpg'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';

export default function Dashbord() {
  const navigate = useNavigate();
  const[Data,setData]=useState({});
  const[Hrdata,setHrdata]=useState('');
  const {Email}=useParams();

useEffect(()=>{
    
    axios.get('http://localhost:8081/Employeget',{params:{Email}})
    .then((response)=>{
      
      setData(response.data)
      
    })
    .catch((err)=>{
      console.log(err);
    });
  },[Email]);

  
  


  const handleAdmin=()=>{
    if(Data.Designation==='HR')
      {
         const date=new Date();
        const LogIn_Time=`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        const formattedDate= `${date.getDate()}:${date.getMonth()+1}:${date.getFullYear()}`;
        const Last_Login_Time=`${formattedDate} / ${LogIn_Time}`
        console.log(Last_Login_Time);
            axios.post(`http://localhost:8081/EmpAttendence/${Email}`,{Last_Login_Time,Date:formattedDate,LogIn_Time,})
             .then((response)=>{
              console.log("hii");
              const totalWorking = response.data.Total_Working_days || 0;
              console.log(response.data.Total_Working_days);
              const Total_Working_days = totalWorking + 1;
              console.log(Total_Working_days);
              return axios.post('http://localhost:8081/Working', { Email, Total_Working_days })
             .then((response)=>{
              navigate(`/Hr_Layout/${Email}`)
             })
              
              })
             .catch((error)=>{
             console.log(error);
             })  
        
    
      }
      else{
        setHrdata("You are not a Admin")
      }
    
  }
  const handleEmployee=()=>{
    navigate(`/Emp_Layout/${Email}`)
  }
 
  return (
    <div className='Dashbord'>
      <h1 className='header'>
         {Data.Designation || 'Loading...'}
         <h3 className='company'> Evernote Software Solutions </h3> 
         {Data.Email}
         </h1>
      
      <p className='hdata'>{Hrdata}</p>
  <div className='dash-img'>
    <img src={Hr} alt="HR" />
    <img src={Employe} alt="Employee" />
    </div>
    <div className="dash-btn">
      <button onClick={handleAdmin}><h2>Admin Login</h2></button>
       
      <button onClick={handleEmployee}><h2>Employee Login</h2></button>
    </div>
    </div>
  )
}
