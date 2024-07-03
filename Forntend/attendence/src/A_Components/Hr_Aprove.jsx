import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function Hr_Aprove() {
const {Email}=useParams();
const[FullName,setFullName]=useState([]);
const navigate=useNavigate();
const[vbtn,setVbtn]=useState('checkbox hidden')
const[radiobtn,setRadiobtn]=useState('radio visible')
const [selectedEmployee, setSelectedEmployee] = useState('');
const[selectCheckbox,setSelectCheckbox]=useState([]);
const [SwipeInCheckbox, setSwipeInCheckbox] = useState(false);
const [SwipeOutCheckbox, setSwipeOutCheckbox] = useState(false);
const[AbsentCheckbox ,setAbsentCheckbox]=useState(false)
const[loading,setLoading]=useState(true)



useEffect(()=>{
  axios.get('http://localhost:8081/Fullget')
    .then((response)=>{
      setFullName(response.data)
      setLoading(false)
      
    })
    .catch((err)=>{
      console.log(err);
      setLoading(false)
    });
  
},[]);
const  emp=(Email)=>{
  setRadiobtn('radio visible')
  setVbtn('checkbox hidden')
  if(selectedEmployee !=='')
  {navigate(`/Emp_Layout/${selectedEmployee}`)}
  else{
    alert("Select a Employee")
  }
}
const handleCheckboxChange=(Email)=>
{
  setSelectedEmployee(Email)
}
const handleCheckbox = (Email) => {
  if (selectCheckbox.includes(Email)) {
    setSelectCheckbox(selectCheckbox.filter(item => item !== Email));
  } else {
    setSelectCheckbox([...selectCheckbox, Email]);
  }
  
};
const handleSwipeIn = () => {
  
  setRadiobtn('radio hidden')
  setVbtn('checkbox visible')
  setSwipeInCheckbox(true);
  setSwipeOutCheckbox(false);
  setAbsentCheckbox(false)
  setSelectCheckbox([]);
 
};

const handleSwipeOut = () => {
  
  setRadiobtn('radio hidden')
  setVbtn('checkbox visible')
  setSwipeOutCheckbox(true);
  setSwipeInCheckbox(false);
  setAbsentCheckbox(false)
  setSelectCheckbox([]);
  
};
const handleAbsent = () => {
  
  setRadiobtn('radio hidden')
  setVbtn('checkbox visible')
  setAbsentCheckbox(true);
  setSwipeOutCheckbox(false);
  setSwipeInCheckbox(false);
  setSelectCheckbox([]);
  
};

const dataSubmit = () => {
  const date = new Date();
  const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  const formattedDate = `${date.getDate()}:${date.getMonth() + 1}:${date.getFullYear()}`;
  let temp=0;
  const promises = []; 
  
  if (SwipeInCheckbox) {
    let count = 0;
    // console.log(SwipeInCheckbox);

    selectCheckbox.forEach((Email) => {
      const promise = axios.get('http://localhost:8081/Employeget',{params:{Email}})
        .then((response) => {
          const currentDaysPresent = response.data.Days_Present || 0;
          const updatedDaysPresent = currentDaysPresent + 1;
          const totalWorking = response.data.Total_Working_days || 0;
          const Total_Working_days = totalWorking + 1;
          const attendanceRecords = response.data.attendanceRecords || [];
          const alreadyLoggedIn = attendanceRecords.some(record => {
            const [day, month, year] = record.Date.split(':').map(Number);
            const recordDate = new Date(year, month - 1, day);
            return (
              recordDate.getDate() === date.getDate() &&
              recordDate.getMonth() === date.getMonth() &&
              recordDate.getFullYear() === date.getFullYear()
            );
          });
          
          if (!alreadyLoggedIn) {
            return axios.post('http://localhost:8081/Working', { Email, Total_Working_days })
              .then((response) => {
                return axios.post('http://localhost:8081/EmpAttendence', {
                  Date: formattedDate,
                  Email,
                  LogIn_Time: time,
                  Days_Present: updatedDaysPresent,
                });
              });
          } else {
            count++;
            return Promise.resolve();
          }
        })
        .catch((err) => {
          console.log(err);
          return Promise.resolve();
        });

      promises.push(promise);
    });

    Promise.all(promises)
      .then(() => {
        if (count === 0) {
          alert("Swipe In Successfully");
        } else {
          alert(`Already you are logged in on ${formattedDate}`);
        }
        setSelectCheckbox([]);
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error processing promises:', error);
        setSelectCheckbox([]);
        window.location.reload();
      });
  }
  
  else if (SwipeOutCheckbox) {
    selectCheckbox.forEach((Email) => {
      const promise = axios.get('http://localhost:8081/Employeget',{params:{Email}})
        .then((response) => {
          const attendanceRecords = response.data.attendanceRecords || [];
          const alreadyLoggedout = attendanceRecords.some(record => {
            const [day, month, year] = record.Date.split(':').map(Number);
            const recordDate = new Date(year, month - 1, day);
            return (
              recordDate.getDate() === date.getDate() &&
              recordDate.getMonth() === date.getMonth() &&
              recordDate.getFullYear() === date.getFullYear()&&
              record.LogOut_Time 
            );
          });
          if(!alreadyLoggedout)
            {return axios.post(`http://localhost:8081/EmpAttendence`, {
              Date: formattedDate,
              Email,
              LogOut_Time: time
            })
            .catch((error) => {
              console.log(`Error saving LogOut_Time for ${Email}`, error);
            }); 
            }
            else
            { temp++;
              return Promise.resolve(); 
            }
        })
        .catch((err) => {
          return Promise.resolve(); 
        });
  
      promises.push(promise); 
    });
 
    Promise.all(promises)
    .then(() => {
      if (temp === 0) {
        alert("Swipe out Successfully");
      }
      else{
        alert(`Already you are logged out on ${formattedDate}`);
      }
      setSelectCheckbox([]);
      window.location.reload();
    })
    .catch((error) => {
      console.error('Error processing promises:', error);
      setSelectCheckbox([]);
      window.location.reload();
    });
   
  }
  else if(AbsentCheckbox)
    {
      selectCheckbox.forEach((Email) => {
         axios.get('http://localhost:8081/Employeget',{params:{Email}})
        .then((response) => {
          const AbsentDays=response.data.Days_Absent + 1;
          const  Total_Working=response.data. Total_Working_days || 0;
          const Total_Working_days=Total_Working +1;
          axios.post('http://localhost:8081/Working',{Email,Total_Working_days})
          axios.post(`http://localhost:8081/AbsentDays/${Email}`,{Days_Absent : AbsentDays,formattedDate})
        .then(()=>{
          setSelectCheckbox([]);
          window.location.reload();
        })
        .catch(()=>{console.log("error");})
      })
      .catch()
      })
      alert(`Absent Marked Sucsessfully`)
          
    }


};
if(SwipeInCheckbox)
  {
    document.getElementById('l1').innerHTML=" SwipeIn "
  }
  else if(SwipeOutCheckbox)
    {
      document.getElementById('l1').innerHTML=" SwipeOut "
    }
    else if(AbsentCheckbox)
      {
        document.getElementById('l1').innerHTML=" Absent Mark "
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
    <div className='Hr_Aprove'>
        <div className='Emp_list2'>
            <h1>Employee list <p id='l1'></p></h1>
            <button onClick={e=>{Out(Email)}}><h3>log out</h3></button>
            <div className='Aprove_list'>
            {loading ? (<h3>Loading...</h3>) : (
          FullName.filter(employee => employee.Designation !== 'HR').map((names) => (
            <h3  className='listName'>
             {names.Name} : ({names.Email})
              {SwipeInCheckbox && (
                <input
                  type='checkbox'
                  onChange={() => handleCheckbox(names.Email)}
                  className={vbtn}
                />
              )}
              {SwipeOutCheckbox && (
                <input
                  type='checkbox'
                  onChange={() => handleCheckbox(names.Email)}
                  className={vbtn}
                />
              )}
               {AbsentCheckbox && (
                <input
                  type='checkbox'
                  onChange={() => handleCheckbox(names.Email)}
                  className={vbtn}
                />
              )}
              <input
                type='radio'
                name='selectRadio'
                onChange={() => handleCheckboxChange(names.Email)}
                className={radiobtn}
              />
            </h3>
          )))}
        </div>
        </div>
        <button id='savebtn' onClick={dataSubmit}><h3>Save</h3></button>
       
        <div className="Hr_features">
            <button onClick={()=>{handleSwipeIn()}}><h2>Swipe In </h2></button>
            <button onClick={()=>{handleSwipeOut()}}><h2>Swipe Out </h2></button>
            <button onClick={()=>{handleAbsent()}}><h2>Mark Absent </h2></button>
            <button onClick={()=>{emp(Email)}}><h2>Go To Emp </h2></button>
            
        </div>
        
    </div>
  )
}
