const express =require('express');
const mongoose=require('mongoose');
const cors=require('cors');

const App=express();

App.use(express.json());
App.use(cors()); 

mongoose.connect('mongodb://localhost:27017/attendence');
const attendanceSchema = new mongoose.Schema({
    Date: String,
    LogIn_Time:  String, 
    LogOut_Time:  String, 
    HoursWorked:String
},{_id : false});

const leaveSchema = new mongoose.Schema({
    FromDate: String,
    ToDate: String,
    Day:String,
    Time:String,
    Reason:String,
    Remark:String,
    Aproved:String,
    Rejected:String,
    Type:String
    
});
const calenderschema =new mongoose.Schema({
  PresentDays:[],
  AbsentDays:[],
  LeavesDays:[]
});

const userschema=new mongoose.Schema({
    Date:Date,
    Email:String,
    Password:String,
    Name:String,
    Designation:String,
    Grade:{type:String,default:""},
    Days_Present:{type:Number,default:0},
    Days_Absent:{type:Number,default:0},
    Leaves_Taken:{type:Number,default:0}, 
    No_OfLeaves:{type:Number,default:24},
    Earned_Leaves:{type:Number,default:15},
    Unpaid_leaves:{type:Number,default:9},
    Others:Number,
    Leave_Balance:{type:Number},
    Total_Working_days:{type:Number,default:0},
    Last_Login_Time:{type:String,default:""},
    attendanceRecords: [attendanceSchema],
    leaveRecords:[leaveSchema],
    calenderData:[calenderschema]

    

},{ collection: 'employee' }) 

const usermodel=mongoose.model('employee',userschema);

App.post('/Employeinsert',(req,res)=>{
    usermodel.create(req.body)
    .then((result)=>{res.send(result)})
    .catch((error)=>{res.send(error)})
})
App.get('/Employeget',(req,res)=>{
  const {Email}=req.query; 
    usermodel.findOne({Email})
    .then((result)=>{
      res.send(result)   
})
    .catch((error)=>{res.send(error)})

})

App.get('/Fullget',(req,res)=>{
    usermodel.find({})
    .then((result)=>{res.send(result)})
    .catch((err)=>{res.send(err)})
})
    App.post('/EmpAttendence/:Email',(req,res)=>{
      const { Email } = req.params;
      const { Last_Login_Time, Date, LogIn_Time, LogOut_Time } = req.body;
      usermodel.findOneAndUpdate(
        { Email },
        { Last_Login_Time },
        { new: true }
      )
      .then(() => {
        return usermodel.findOne({ Email, "attendanceRecords.Date": Date });
      })
      .then(existingRecord => {
        if (existingRecord) {
          return usermodel.updateOne(
            { Email: Email, "attendanceRecords.Date": Date },
            {
              $set: {
                "attendanceRecords.$.LogIn_Time": LogIn_Time,
                "attendanceRecords.$.LogOut_Time": LogOut_Time,
              }
            }
          );
        } else {
          return usermodel.updateOne(
            { Email: Email },
            {
              $push: {
                attendanceRecords: { Date, LogIn_Time, LogOut_Time }
              }
            }
          );
        }
      })
      .then(() => {
        return usermodel.findOneAndUpdate(
          { Email },
          { $inc: { Total_Working_days: 1 } }
        );
      })
      .catch(error => {
        res.status(500).send({ error: error.message });
      });
    });
          
    App.post('/SwipeIn/:Email',(req,res)=>{
        const Email=req.params.Email;
        const {Date,LogIn_Time}=req.body;
        usermodel.updateOne({Email:Email},
           { $push: { attendanceRecords: { Date, LogIn_Time } } }
        )
        .then((response)=>{res.send(response)})
        .catch((err)=>{res.send(err)})
    })
    App.post('/EmpAttendence', (req, res) => {
        const { Date, Email, LogOut_Time, LogIn_Time, Days_Present} = req.body;
        const record = { Date };
        if (LogIn_Time) record.LogIn_Time = LogIn_Time;
        if (LogOut_Time) record.LogOut_Time = LogOut_Time;
      
        usermodel.findOneAndUpdate(
          { Email: Email, "attendanceRecords.Date": Date },
          { 
            $set: {
              "attendanceRecords.$.LogIn_Time": LogIn_Time,
              "attendanceRecords.$.LogOut_Time": LogOut_Time,
             
            }
          },
          { new: true }
        )
        .then((response) => {
          if (!response) {
            usermodel.updateOne(
              { Email: Email },
              {
                $set: { Days_Present: Days_Present },
                $push: { attendanceRecords: record },
                $addToSet: { "calenderData.0.PresentDays": Date }
            }
            )
            .then((response) => {
              res.send(response);
            })
            .catch((err) => {
              res.send(err);
            });
          } else {
            usermodel.updateOne(
              { Email: Email },
              {
                  $addToSet: { "calenderData.0.PresentDays": Date }
              }
          )
          .then((response) => {
              res.send(response);
          })
          .catch((err) => {
              res.send(err);
          });
          }
        })
        .catch((err) => {
          res.send(err);
        });
      });
    App.put('/EditUpdate/:Email',(req,res)=>{
        const Email=req.params.Email;
        const{Name,Password,Designation}=req.body;
        usermodel.findOneAndUpdate({Email},{Name,Password,Designation})
        .then((response)=>{res.send(response)})
        .catch((error)=>{res.send(error)})
    })
   App.post('/Leavedata/:Email',(req,res)=>{
    const Email=req.params.Email;
    const {FromDate,ToDate, Day,Time,Reason,Remark}=req.body;
    usermodel.updateOne({Email},{
        $push: {leaveRecords : {FromDate,ToDate, Day,Time,Reason,Remark}}
    })
    .then((result)=>{res.send(result)})
    .catch((err)=>{res.send(err);})
   })

   App.get('/getUserLeave', (req, res) => {
    usermodel.find({ leaveRecords: true })
    .then((result) => {
        res.send(result);
    })
    .catch((err)=>{res.send(err)})
})
App.post('/Aprove/:Email', (req, res) => {
    const Email = req.params.Email;
    const { _id, Aproved,Type,formattedDate} = req.body;
    usermodel.findOneAndUpdate(
      { Email, 'leaveRecords._id': _id },
      { $set: { 'leaveRecords.$.Aproved': Aproved,
        'leaveRecords.$.Type': Type },
        // $addToSet: { "calenderData.2.LeavesDays": formattedDate }
         },
        
      {new:true}
    )
      .then((response) => { res.send(response) })
      .catch((err) => { res.send(err) });
  });

  App.post('/leavestore/:Email',(req,res)=>{
    const Email = req.params.Email;
    const { _id, formattedDate} = req.body;
    usermodel.findOneAndUpdate(
      { Email, 'leaveRecords._id': _id },
      { 
         $addToSet: { "calenderData.2.LeavesDays": formattedDate }
         },
        
      {new:true}
    )
      .then((response) => { res.send(response) })
      .catch((err) => { res.send(err) });
  })

  App.post('/Reject/:Email', (req, res) => {
    const Email = req.params.Email;
    const { _id, Rejected } = req.body;
    usermodel.updateOne(
      { Email, 'leaveRecords._id': _id },
      { $set: { 'leaveRecords.$.Rejected': Rejected } },
      { new: true }
    )
      .then((response) => { res.send(response) })
      .catch((err) => { res.send(err) });
  });
  App.post('/AbsentDays/:Email',(req,res)=>{
    const Email=req.params.Email;
    const {Days_Absent,formattedDate}=req.body;
    usermodel.findOneAndUpdate({Email},{ $set: { Days_Absent },
      $addToSet: { "calenderData.1.AbsentDays": formattedDate }
    }, { new: true })
    .then((result)=>{
        res.send(result);
        
    })
    .catch((err)=>{res.send(err)})
  })

  App.post('/Earnedupdate',(req,res)=>{
    const {Email,Earned_Leaves}=req.body;
    usermodel.findOneAndUpdate({Email},{Earned_Leaves})
    .then((result)=>{res.send(result)})
    .catch((err)=>{res.send(err)})
  })
 
  App.post('/Unpaiedupdate',(req,res)=>{
    const {Email,Unpaid_leaves}=req.body;
    usermodel.findOneAndUpdate({Email},{Unpaid_leaves})
    .then((result)=>{res.send(result)})
    .catch((err)=>{res.send(err)})
  })
  App.post('/LeaveUpdate',(req,res)=>{
    const{Email,Leaves_Taken}=req.body;
    usermodel.findOneAndUpdate({Email},{Leaves_Taken})
    .then()
    .catch()
  })
  App.get('/calendar/:email', async (req, res) => {
    const { email } = req.params;
    try {
      const user = await usermodel.findOne({ Email: email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ calendarData: user.calenderData });
      
    } catch (err) {
      console.error('Error fetching calendar data:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  App.post('/Working',(req,res)=>{
    const {Email,Total_Working_days}=req.body;
    usermodel.findOneAndUpdate({Email},{Total_Working_days})
    .then((response)=>{res.send(response)})
    .catch((err)=>{res.send(err)})

  })

  // App.get('/leaves-taken/:Email',  (req, res) => {
  //  const { Email } = req.params;
  //  usermodel.findOne({ Email })
  // .then((result)=>{
  //   res.send(result); })
  //   .catch((err)=>{
  //     res.send(err);
  //   })
        

       




App.listen(8081,()=>{console.log("Server is running at port 8081");})