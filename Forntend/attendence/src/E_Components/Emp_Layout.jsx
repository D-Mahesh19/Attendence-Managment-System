import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import CalendarComponent from '../Calender';

export default function Emp_Layout() {
    const{Email}=useParams();
    const[Data,setData]=useState({});
    const[lbtn,setlbtn]=useState('')
    const[lbalance,setLbalance]=useState('');
    const[Hr,setHr]=useState(true);
    const navigate=useNavigate();
    
    useEffect(()=>{
    axios.get('http://localhost:8081/Employeget',{ params:{Email}})
    .then((response)=>{
      setData(response.data)
        call();
      
    })
    .catch((err)=>{
      console.log(err);
    });
    },)
     function call(){
        const btn= Data.Designation
     
        setLbalance(Data.No_OfLeaves - Data.Leaves_Taken)
        if(btn ==='HR'){
            setlbtn("Aprove Leave");
            setHr(true)
           
            
        }
        else{
            setHr(false)
             setlbtn('Apply for Leave')
            
        }
       
    };
    const lpage=()=>{
        if(lbtn==="Aprove Leave")
            {
                navigate('/Hr_LeaveAprove')
            }
            else{
                navigate(`/Emp_Leave/${Email}`)
            }
    }
    const In=(e)=>{
        e.preventDefault();
        if(lbtn==="Aprove Leave")
            {
                navigate(`/Hr_Aprove/${Email}`);
            }
        }
    const Out=(Email)=>{
        const date=new Date();
        const LogOut_Time=`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        const formattedDate= `${date.getDate()}:${date.getMonth()+1}:${date.getFullYear()}`;
            axios.post(`http://localhost:8081/EmpAttendence/${Email}`,{Date:formattedDate,LogOut_Time,})
             .then((response)=>{
             navigate('/LogIn');
              })
             .catch((error)=>{
             console.log(error);
             })    
        
    }
  
  return (
    <div  className='Emp_Layout'>
        <div className="Elayout">
            <div className="Elayout-data">
                <h2>Employee ID    : <span className='span_data'>{Data.Email} </span></h2>
                <h2>Employee Name  : <span className='span_data'>{Data.Name} </span></h2>
                <h2>Employee Grade : <span className='span_data'>{Data.Grade} </span></h2>
                <h2>No. of Leaves  : <span className='span_data'>{Data.No_OfLeaves} </span></h2>
            </div>
            <div className="Elayout-data">
                <h2>Earned Leaves : <span className='span_data'>{Data.Earned_Leaves} </span></h2>
                <h2>Unpaid Leaves : <span className='span_data'>{Data.Unpaid_leaves} </span></h2>
                <h2>Others : <span className='span_data'>{Data.Others} </span> </h2>
                <h2>Leave Balance : <span className='span_data'>{lbalance} </span></h2>
            </div>
        </div>
        <button className='policies-btn' onClick={e=>{navigate('/Policy')}}><h2>Company Policies</h2> </button><br />
         <button className='Holidays-btn' onClick={e=>{navigate('/holiday')}}><h2>List of Holidays</h2></button><br />
        <button className='In-btn' onClick={In} disabled={!Hr}><h2>Swipe In</h2></button><br />
        <button className='Out-btn' onClick={()=>{Out(Data.Email)}}><h2>Swipe Out</h2></button><br />
        <button className='Leave-btn' onClick={lpage}><h2>{lbtn}</h2></button><br /> 

        <div className='cal'>
        <CalendarComponent Email={Email} />
        </div>
        <div className="cal-data">
       <h3><div id='c1'></div>Present Days</h3>
       <h3><div id='c2'></div>Absent Days</h3>
       <h3><div id='c3'></div>Leave Taken Days</h3>
       <h3><div id='c4'></div>National Holidays </h3>
        
        </div>
        </div>
  )
}
