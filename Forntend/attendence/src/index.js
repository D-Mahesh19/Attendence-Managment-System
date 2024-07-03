import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import LogIn from './E_Components/LogIn'
import Dashbord from './E_Components/Dashbord'
import Hr_Layout from './A_Components/Hr_Layout';
import Emp_Layout from './E_Components/Emp_Layout';
import Policy from './E_Components/Policy'
import Holidays from './E_Components/Holidays'

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Hr_Aprove from './A_Components/Hr_Aprove';
import Hr_LeaveAprove from './A_Components/Hr_LeaveAprove';
import Emp_Leave from './E_Components/Emp_Leave';
import Emp_Data from './E_Components/Emp_Data';
import E_Create from './E_Components/E_Create';

const router=createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<LogIn />}/>
      <Route path='LogIn' element={<LogIn />}/>
      <Route path='Dashbord/:Email' element={<Dashbord />}/>
      <Route  path='Hr_Layout/:Email' element={< Hr_Layout/>}/>
      <Route path='Emp_Layout/:Email' element={< Emp_Layout/>}/>
      <Route path='Hr_Aprove/:Email' element={<Hr_Aprove />}/>
      <Route path='Hr_LeaveAprove' element={<Hr_LeaveAprove />}/>
      <Route path='Emp_Leave/:Email' element={<Emp_Leave />}/>
      <Route path='Emp_Data' element={<Emp_Data />}/>
      <Route path='E_Create' element={<E_Create />}/>
      <Route path='Policy' element={<Policy />}/>
      <Route path='holiday' element={<Holidays />}/>
    </Route>
  )
)


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

