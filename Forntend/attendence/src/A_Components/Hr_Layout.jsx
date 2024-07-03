import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'


export default function Hr_Layout() {
  const {Email}=useParams();
  const[Data,setData]=useState({});
  const[date,setDate]=useState(new Date());
  const[FullName,setFullName]=useState([]);
  const navigate=useNavigate();
  
  useEffect(()=>{
    
    axios.get('http://localhost:8081/Employeget',{params:{Email}})
    .then((response)=>{
      setData(response.data)
    })
    .catch((err)=>{
      console.log(err);
    });
    axios.get('http://localhost:8081/Fullget')
    .then((response)=>{
      setFullName(response.data)
    })
    .catch((err)=>{
      console.log(err);
    });
  });
  const report=()=>
  {
    navigate(`/Emp_Data`)
  }
  const swipeIn=(Email)=>
    {
      navigate(`/Hr_Aprove/${Email}`)
    }

 
  
  return (
    <div className='Hr_Layout'>
      <h1>Good Morning {Data.Name}..! | {Data.Last_Login_Time} </h1>
      <div className="Emp_list"> 
        <h2>Employee List :</h2>
        <div className="Emp_data">
        {FullName.filter(employee=>employee.Designation !== 'HR').map((names)=>(<h3 className='FullName'>{names.Name} : ({names.Email}) </h3>))}
        </div>
      </div>
      <div className="Emp_feautre">
        <button onClick={()=>{swipeIn(Email)}}><h1>Mass Swipe</h1></button>
        <button onClick={()=>{report()}}><h1>Reports</h1></button>
        <button  onClick={()=>{navigate('/E_Create')}}><h1>Create and edit user</h1></button>
      </div>
    </div>
  )
}
