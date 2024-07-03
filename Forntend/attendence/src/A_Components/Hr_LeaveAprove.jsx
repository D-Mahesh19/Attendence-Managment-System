import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function Hr_LeaveAprove() {
 
  const [Leaves, setLeaves] = useState([]);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [Type,setType]=useState('');
  const date=new Date()

  useEffect(() => {
    axios.get('http://localhost:8081/Fullget')
      .then((response) => {
        const filterEmp = response.data.filter(employee => {
          return employee.leaveRecords.some(record => record.Aproved !== 'Aproved' && record.Rejected !== 'Rejected');
        });
        setLeaves(filterEmp);
      })
      .catch((err) => {
        console.log(err);
      });
  });
  // const handleCheckbox = (email, leaveRecordId) => {
  //   const key = `${email}-${leaveRecordId}`;
  //   if (selectedCheckboxes.includes(key)) {
  //     setSelectedCheckboxes(selectedCheckboxes.filter(item => item !== key));
  //   } else {
  //     setSelectedCheckboxes([...selectedCheckboxes, key]);
  //   }
  // };

  const handleCheckbox = (email, leaveRecordId) => {
    const key = `${email}-${leaveRecordId}`;
    setSelectedCheckboxes(prevSelected => {
      if (prevSelected.includes(key)) {
        return prevSelected.filter(item => item !== key);
      } else {
        return [...prevSelected, key];
      }
    });
  };

 
  const handleApproveSelected = () => {
    if(selectedCheckboxes.length>0)
   {selectedCheckboxes.forEach(key => {
      const [email, leaveRecordId] = key.split('-');
      handleApproval(email, leaveRecordId,Type);
    });
  }
  else{
    alert("Select / Nothing to Aprove")
  }
  if(selectedCheckboxes.length>0)
    {alert(`Leave approved `);
    setSelectedCheckboxes([]);}
  };


  const handleRejectSelected = () => {
    if(selectedCheckboxes.length>0)
    {selectedCheckboxes.forEach(key => {
      const [email, leaveRecordId] = key.split('-');
      handleRejection(email, leaveRecordId);
    });}
    else
    {
      alert("Select / Nothing to Reject")
    }
    if(selectedCheckboxes.length>0)
   { alert(`Leave rejected `);
    setSelectedCheckboxes([]);
   }
  };

  const handleApproval = (Email, leaveRecordId,Type) => {
    axios.get('http://localhost:8081/Employeget',{params:{Email}})
    .then((response)=>{
    axios.post(`http://localhost:8081/Aprove/${Email}`, { _id: leaveRecordId, Aproved: 'Aproved',Type })
      .then((response) => {
        const leaveRecord = Leaves.find(employee => employee.Email === Email).leaveRecords.find(record => record._id === leaveRecordId);
       const { FromDate, ToDate } = leaveRecord;
       const format = getDatesBetween(FromDate,ToDate);
       {format.map((day)=>{
        axios.post(`http://localhost:8081/leavestore/${Email}`,{_id:leaveRecordId,formattedDate:day})
        .then((response)=>{})
        .catch()
       })}

       console.log(FromDate);
       console.log(ToDate);
       const Totaldays = calculateDaysBetweenDates(FromDate,ToDate);
       console.log(Totaldays);
       console.log(response.data.Total_Working_days);
        const  Total_Working_days=response.data.Total_Working_days  + Totaldays;
        console.log(Total_Working_days);
        axios.post('http://localhost:8081/Working',{Email,Total_Working_days})
        if (response.data && response.data.leaveRecords) {
          const approvedLeave = response.data.leaveRecords.find(record => record._id === leaveRecordId);
          const daysApproved = calculateDaysBetweenDates(approvedLeave.FromDate, approvedLeave.ToDate);
          LeaveCount(Email,daysApproved);
            if (approvedLeave.Type === 'Earned Leave') {
              decrementLeaveCount(Email,'Earned_Leaves', daysApproved);
            } 
            else if (approvedLeave.Type === 'Unpaid Leave') {

              decrementLeaveCount(Email,'Unpaid_leaves', daysApproved);
            }
          }

          updateLeaveList(Email, leaveRecordId);
          setSelectedCheckboxes(prevSelected => prevSelected.filter(key => key !== `${Email}-${leaveRecordId}`));
      })
      .catch((error) => {
        console.log(`Error approving leave for ${Email}`, error);
      });
    })
  };
  
 
  function  decrementLeaveCount(Email,leaveType,days) {
    axios.get('http://localhost:8081/Employeget',{params:{Email}})
    .then((response)=>{
      const currentEarned=response.data[leaveType];
      const UpdatedEarned=currentEarned - days;
      axios.post(`http://localhost:8081/${leaveType === 'Earned_Leaves' ? 'Earnedupdate' : 'Unpaiedupdate'}`, { Email, [leaveType]: UpdatedEarned })
      .then((response)=>{})
      .catch((err)=>{ console.log(`Error updating ${leaveType} for ${Email}`, err);})

    })
    .catch()
    
  }
  const LeaveCount=(Email,Days)=>
    {
      axios.get('http://localhost:8081/Employeget',{params:{Email}})
    .then((response)=>{
      const currentLeave=response.data.Leaves_Taken;
      const updatedLeave=currentLeave + Days;
      axios.post('http://localhost:8081/LeaveUpdate',{Email,Leaves_Taken:updatedLeave})
      .then()
      .catch()
    })
    .catch()
    }
  
  
  // function incrementUnpaidLeaveCount(Email) {
  //   axios.post('http://localhost:8081/Employeget',{Email})
  //   .then((response)=>{
  //     const currentUnpaid=response.data.Unpaid_leaves;
  //     const Updatedunpaid=currentUnpaid - 1;
  //     axios.post('http://localhost:8081/Unpaiedupdate',{Email,Unpaid_leaves:Updatedunpaid})
  //     .then((response)=>{})
  //     .catch()

  //   })
  //   .catch()
    
    
  
     

 
  const handleRejection = (email, leaveRecordId) => {
    axios.post(`http://localhost:8081/Reject/${email}`, { _id: leaveRecordId, Rejected: 'Rejected' })
      .then((response) => {
        //  axios.post('http://localhost:8081/Employeget',{Email:email})
        //  .then((response)=>{
          // const leaveRecord = Leaves.find(employee => employee.Email === email).leaveRecords.find(record => record._id === leaveRecordId);
          // const { FromDate, ToDate } = leaveRecord;
          // const daysAbsent = calculateDaysBetweenDates(FromDate, ToDate);
          // const AbsentDays=response.data.Days_Absent +daysAbsent;
          // const formattedDate = `${date.getDate()}:${date.getMonth() + 1}:${date.getFullYear()}`;
        //   const  Total_Working=response.data. Total_Working_days || 0;
        // const Total_Working_days=Total_Working +1;
        // axios.post('http://localhost:8081/Working',{Email:email,Total_Working_days})
          
        // axios.post(`http://localhost:8081/AbsentDays/${email}`,{Days_Absent : AbsentDays,formattedDate})
        // .then(()=>{
        
        // })
        // .catch((err)=>{console.log(err);})  
        //  })
       
        
      // })
      updateLeaveList(email, leaveRecordId);
      setSelectedCheckboxes(prevSelected => prevSelected.filter(key => key !== `${email}-${leaveRecordId}`));
     
  })
  .catch((error) => {
    console.log(`Error rejecting leave for ${email}`, error);
  });
}

 
  const updateLeaveList = (email, leaveRecordId) => {
    setLeaves(prevEmployees => {
      const updatedEmployees = prevEmployees.map(employee => {
        if (employee.Email === email) {
          const updatedLeaveRecords = employee.leaveRecords.filter(record => record._id !== leaveRecordId);
          return { ...employee, leaveRecords: updatedLeaveRecords };
        }
        return employee;
      });
      return updatedEmployees.filter(employee => {
        return employee.leaveRecords.some(record => record.Aproved !== 'Aproved' && record.Rejected !== 'Rejected');
      });
    });

    
  };


  const calculateDaysBetweenDates = (fromDate, toDate) => {
    const oneDay = 24 * 60 * 60 * 1000; 
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const diffDays = Math.round(Math.abs((start - end) / oneDay)) + 1;
    return diffDays;
  };

  function getDatesBetween(fromDate, toDate) {
    let startDate = new Date(fromDate);
    let endDate = new Date(toDate);
    let dates = [];

    if (startDate > endDate) {
        [startDate, endDate] = [endDate, startDate];
    }

    while (startDate <= endDate) {
      let day = startDate.getDate();
      let month = startDate.getMonth() + 1; 
      let year = startDate.getFullYear();

      let formattedDate = `${day}:${month}:${year}`;
      dates.push(formattedDate);
      startDate.setDate(startDate.getDate() + 1); 
    }

    return dates;
}

  return (
    <div className='Hr_LeaveAprove'>
      <h1>Approve Leaves</h1>


      <div className="Leave_reson">
        <table>
          <thead>
            <tr>
              <td>Emp.Id</td>
              <td>Name</td>
              <td>Leave.Id</td>
              <td>FromDate</td>
              <td>ToDate</td>
              <td>Day</td>
              <td>Type</td>
              <td>Reason</td>
              <td>Action</td>
            </tr>
          </thead>
          <tbody>
            {Leaves.map((employee) => (
              employee.leaveRecords
                .filter(record => record.Aproved !== "Aproved" && record.Rejected !== "Rejected")
                .map((leaveRecord) => (
                  <tr >
                    <td>{employee.Email}</td>
                    <td>{employee.Name}</td>
                    <td>{leaveRecord._id}</td>
                    <td>{leaveRecord.FromDate}</td>
                    <td>{leaveRecord.ToDate}</td>
                    <td>{leaveRecord.Day}</td>
                    <td><select value={Type} onChange={e=>{setType(e.target.value)}}><option value=""></option><option value="Earned Leave">Earned Leave</option><option value="Unpaid Leave">Unpaid Leave</option></select></td>
                    <td>{leaveRecord.Reason}</td>
                    <td>
                      <input id={`ap_Check-${leaveRecord._id}`} type='checkbox' onChange={() => handleCheckbox(employee.Email, leaveRecord._id)}  checked={selectedCheckboxes.includes(`${employee.Email}-${leaveRecord._id}`)} />
                    </td>
                  </tr>
                ))
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <button onClick={handleApproveSelected}><h3>Approve Selected</h3></button>
        <button onClick={handleRejectSelected}><h3>Reject Selected</h3></button>
      </div>
    </div>
  );
}
