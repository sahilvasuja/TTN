import React, {useState} from "react";
import axios from 'axios'
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
const Dashboard = () => {
  const styles = {
    navbar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#1976d2",
      color: "white",
      padding: "10px 20px",
    },
    navbarLeft: {
      margin: 0,
    },
    logoutBtn: {
      backgroundColor: "#f44336",
      color: "white",
      border: "none",
      padding: "8px 15px",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "14px",
    },
    logoutBtnHover: {
      backgroundColor: "#d32f2f",
    },
    dashboardContent: {
      padding: "20px",
      fontFamily: "Arial, sans-serif",
    },
  };
 const [task, setTask] = useState("");
 const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]); 
   const [assignedUser, setAssignedUser] = useState("");
const data = JSON.parse(localStorage.getItem("login"));
  const user = data?.data;
console.log(data, '-----')

  const navigate = useNavigate();
 const token = localStorage.getItem("token"); 

const logout=async(e)=>{
    e.preventDefault();
    const removeToken=data?.data?.Token[0]?.token
    console.log(removeToken, '--->')
    try{
        const data=await axios.post("http://localhost:5500/user/logout",{}, {
            headers: {
                  Authorization: `Bearer ${removeToken}`
            }
        }

        )
        console.log(data.data, '----------------------->>>'); 
    localStorage.removeItem("login"); 
    
    localStorage.removeItem("token");
    navigate('/')
    }
    catch(err){
       console.log(err)
    }
}
//  const [task, setTask] = useState("");


  const handleChange = (e) => {
    setTask(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
        const payload = { title: task };
    console.log("Form submitted:", task);
  if (user.role === "admin" && assignedUser) payload.assignedTo = assignedUser;
  console.log(user.role, assignedUser,payload,'assssssssssssssssss')
    try {
   const token = localStorage.getItem("token");
   console.log(token , 'token------')
   console.log(token, "TOKEN BEFORE SENDING"); 
      const res = await axios.post("http://localhost:5500/task/add",  payload, {
         headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res.data);
      setTask(" ");
      setAssignedUser("");
       fetchTasks(); 
    } catch (err) {
      console.log(err);
    }
  };

console.log(users, 'users----->')
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(  user.role === "admin" ? "http://localhost:5500/task/all" : "http://localhost:5500/task/mytasks",
       {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

   const fetchUsers = async () => {
    if (user?.role !== "admin") return;
    try {
         const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5500/user/allUser", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);
   if (!token) return <Navigate to="/" />;


 const handleAllUsers = () => {
    navigate("/allusers");
  };

   console.log(tasks, 'taskkkkkkkkkkkkkkkk')

const handleDelete=async(id)=>{
 const token = localStorage.getItem("token");
 console.log(id, token ,'delete client')
 try{

   const res = await axios.post(`http://localhost:5500/task/deletetask/${id}`,{},{
     headers: { Authorization: `Bearer ${token}` },
   });
    setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
   console.log(res, 'from develte')
 }
 catch(err){
  console.log(err.message)
 }
}

  return (
    <div>
      <nav style={styles.navbar}>
        <div>
          <h2 style={styles.navbarLeft}>Welcome {data?.data.name}</h2>
        </div>
        <div>
          <button
            style={styles.logoutBtn}
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </nav>

      <div style={styles.dashboardContent}>
        <h3>This is your dashboard</h3>
       <form onSubmit={handleSubmit}>
        <input type="text" value={task} onChange={handleChange} />
         {user?.role === "admin" && (
            <select
              value={assignedUser}
              onChange={(e) => setAssignedUser(e.target.value)}
            >
              <option value="">Assign to self</option>
              { users.user?.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name}
                </option>
              ))}
            </select>
          )}
<button onClick={handleSubmit}>Submit</button>
       </form>
      </div>
        {
          user?.role === "admin" ? <> <button onClick={handleAllUsers}>View All Users</button> <h3>All Tasks</h3></>  :   <h3>Your Tasks</h3>
        }
    
      <ul>
        {tasks.map((t) => (
          <li key={t._id} style={{display:"flex", gap:'8px', alignItems: 'center'}}>
        { ` ${t.owner.name} ----- ${t.title} `}
        <button onClick={()=>handleDelete(t._id)}>delete task</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
