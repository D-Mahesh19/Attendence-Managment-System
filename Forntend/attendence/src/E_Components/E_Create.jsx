import axios from 'axios';
import React, { useState } from 'react'

export default function E_Create() {
  const [Name,setName]=useState('');
  const [Email,setEmail]=useState('');
  const [Password,setPassword]=useState('');
  const [Designation,setDesignation]=useState('');
  const[Data,setData]=useState({});
  const[lbtn,setLbtn]=useState('l_Id hidden')
  const[Cbtn,setCbtn]=useState('C_btn hidden')
  const[Ebtn,setEbtn]=useState('C_data E_edit hidden')

  const handleSubmit=(e)=>{
    e.preventDefault();
    axios.get(`http://localhost:8081/Employeget`,{params:{Email}})
    .then((response) => {
      if (response.data) {
        alert("Email already exists");
      }
      else
      {
        axios.post('http://localhost:8081/Employeinsert',{Name,Email,Password,Designation})
      .then((Response)=>{
      alert("Employee Added Sucsessfully")
      setName('');
      setEmail('');
      setPassword('');
      setDesignation('');
    })
    .catch((error)=>{console.log(error);})
      }
    })
    
  }
  const handleSubmit1=(e)=>{
    e.preventDefault();
    axios.put(`http://localhost:8081/EditUpdate/${Email}`,{Name,Password,Designation})
    .then((response)=>{
      alert("Employee Updated Sucsessfully")
      setName('');
      setEmail('');
      setPassword('');
      setDesignation('');
      setData({})
      setEbtn('C_data E_edit hidden')
    })
    .catch((error)=>{console.log(error);})
  }
  const handleget=(e)=>{
    if(Email)
      {
    e.preventDefault(); 
    axios.get('http://localhost:8081/Employeget',{params:{Email}})
    .then((response)=>{
      const data = response.data;
      setData(data);
      console.log(data);
      setName(data.Name);
      setPassword(data.Password);
      setDesignation(data.Designation)
      setLbtn('l_Id hidden')
      setEbtn('C_data E_edit visible1')
      
     })
    }
    else{
      alert("Enter a LogIn Id")
    }
    

  };
   function call()
  {setCbtn('C_data hidden')
    setLbtn('l_Id visible1')
  }
  function call1()
  {
    setLbtn('l_Id hidden')
    setCbtn('C_data visible1')
  }
  return (
    <div className='E_Create'>
      <div className='C_btn'>
        <button onClick={e=>{call1()}}><h2>Create</h2></button>
        <button onClick={e=>{call()}}><h2>Edit</h2></button>
      </div>
      <div className={Cbtn  }>
        <h2>Add Employe</h2>
        <form onSubmit={handleSubmit}>
        <label htmlFor="">Name : <br /><input type="text" placeholder='Enter the Name' value={Name} onChange={e=>{setName(e.target.value)}} required/></label><br />
          <label htmlFor="">Email : <br /><input type="text" placeholder='Enter the Email' value={Email} onChange={e=>{setEmail(e.target.value)}} required/></label><br />
          <label htmlFor="">Password : <br /><input type="text" placeholder='Enter the Password' value={Password} onChange={e=>{setPassword(e.target.value)}} required/></label><br></br>
          <label htmlFor="">Designation : <br /><input type="text" placeholder='Enter the Designation' value={Designation} onChange={e=>{setDesignation(e.target.value)}} required/></label>
          <button type='submit'><h3>Save</h3></button>
        </form>

      </div>
      <div className={lbtn}>
      <label htmlFor="">LogIn Id : <br /><input type="text" placeholder='Enter the LogIn Id' value={Email} onChange={e=>{setEmail(e.target.value)}}/></label><br />
      <button onClick={handleget}>Edit</button>
      </div>
      <div className={Ebtn}>
        <h2>Edit Employe</h2>
        <form onSubmit={handleSubmit1}>
        <label htmlFor="">Name : <br /><input type="text" placeholder='Enter the Name' value={Name} onChange={e=>{setName(e.target.value)}}/></label><br />
          <label htmlFor="">Email : <br /><input type="text" placeholder='Enter the Email' value={Email} /></label><br />
          <label htmlFor="">Password : <br /><input type="text" placeholder='Enter the Password' value={Password} onChange={e=>{setPassword(e.target.value)}}/></label><br></br>
          <label htmlFor="">Designation : <br /><input type="text" placeholder='Enter the Designation' value={Designation} onChange={e=>{setDesignation(e.target.value)}}/></label>
          <button type='submit'><h3>Save</h3></button>
        </form>

      </div>

    </div>
  )
}

