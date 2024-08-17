import React, { useState, useEffect } from 'react';
import styles from '../styles/sidebar.module.css';
import { PersonAdd, Group, Notifications } from '@mui/icons-material';
import { IconButton, Avatar, List, ListItem, ListItemAvatar, ListItemText, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Backdrop ,Typography} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import Lottie from 'lottie-react';
import animationData from '../chaty.json';
import axios from 'axios';
import io from 'socket.io-client';
import CircleIcon from '@mui/icons-material/Circle'; 
import { loadUserid,setUserid} from '../redux/userslice';
import { useSelector,useDispatch} from 'react-redux';

const Home = () => {
      const [socket, setSocket] = useState(null);
      const [message, setMessage] = useState('');
      const [users, setusers] = useState([]);
      const [open, setOpen] = useState(false);
      const [friendName, setFriendName] = useState('');
      const [friend, setFriend] = useState('');
      const [receiverid,setrecieverid]= useState('');
      const [arrivalmessage,setarrivalmessage]= useState([]);
      const [conversation,setconversation]= useState([]);
      const userid = useSelector((state) => state.user.userid);
      const [onlineusers,setonlineusers]=useState([]);
      const dispatch=useDispatch();
      
      dispatch(loadUserid(userid));
      
     
      const handlein_comming_messages=(userid,message,createdAt)=>{
        setarrivalmessage(prevMessages => [
          ...prevMessages,
          { userid, message,createdAt}
        ]);
      }
     
      useEffect(() => {
        if (arrivalmessage.length > 0) {
          setconversation(prevMessages => [
            ...prevMessages,
            ...arrivalmessage
          ]);
        
          setarrivalmessage([]);
        }
      }, [arrivalmessage]);
      useEffect(() => {
        const socket= io('http://localhost:5000');
        console.log(socket)
        setSocket(socket);
        socket.on('connect', () => {
          console.log('Successfully connected!');
          socket.emit('adduser', (userid) );
          
       
     
        });
        socket.on('getonlineusers',users=>{
          console.log(users)
          setonlineusers(users)
        })
            
          
      
       socket.on("getusers",(users)=>{
          console.log("users after dis disconnect",users)
          setonlineusers(users )
       })
       socket.on('sendermessage',(data)=>{
        console.log('listning',data)
        const {userid,message,createdAt}=data;
        console.log('sender details ',userid,message,createdAt)
        handlein_comming_messages(userid,message,createdAt);
      })
     
     
      
     
       socket.on("disconnect",()=>{
      
        console.log('user disconnected')
     })

       const handleBeforeUnload = () => {
       
       
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup on component unmount 
    return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
       if (socket){
        socket.disconnect();
       }
    };
  
   
    }, []);
    const handleSendMessage = () => {
      if (socket) {
        // Emit the 'message' event to the server with the message content
        socket.emit('message', { userid,message,receiverid ,
         
        });
        setMessage(''); // Clear message input after sending
       
    
      }
    };
   
    useEffect(()=>{
      console.log('user id at home ',userid)
       },[userid])

     useEffect(()=>{
      console.log('user id at home ',userid)
       },[])
     
     useEffect(()=>{
        console.log(receiverid)
      },[receiverid])
      useEffect(()=>{
        console.log(arrivalmessage)
      },[arrivalmessage])
      useEffect(()=>{
        console.log(conversation)
      },[conversation])
         useEffect(()=>{
        console.log('online users are ',onlineusers)
      },[onlineusers])
      // useEffect(()=>{
      //   console.log(friendName)
      // },[friendName])
      // useEffect(()=>{
      //   console.log(friend)
      // },[friend])
      // useEffect(()=>{
      //   console.log('users are ',users)
      // },[users])

      useEffect(()=>{
        const getusers = async()=>{
          console.log('fun call for fetching users  ')
          try{
            const res= await axios.get(`http://localhost:5000/users/${userid}`)
            console.log(res.data);
            setusers(res.data[0].userDetails)
          }catch(error){
            console.log('error in sending request',error)
          }
         
        }
        getusers();
      },[])
        const searchfriend = async()=>{
          console.log('fun call seaarch frnd ')
          try{
            const res= await axios.post(`http://localhost:5000/findfriend`,{friendName})
            console.log(res.data);
           setFriend(res.data[0])
          }catch(error){
            console.log('error in sending request',error)
          }
         
        }
        const sendMessage = () => {
          socket.emit('message', message); // Send message to the server
          setMessage(''); // Clear the input field
      };
      useEffect(()=>{
        const conversation=async()=>{
          console.log('api call for conversation ');
          try {
            const res =await axios.post("http://localhost:5000/conversation",{
              userid,
              receiverid

            })
            if (res && res.data) {
              const { conversation } = res.data; // Ensure you are accessing the right key
              if (conversation && conversation.messages) {
                  setconversation(conversation.messages);
              } else {
                  console.error('Messages not found in conversation');
              }
          }
          
            
            console.log('Conversation data:', res.data);
          } catch (error) {
            console.log('error in sending request',error)
          }
        }
       
        if (receiverid)
        {
          conversation();
        }
         },[receiverid])
        
      
        
      const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };
    
      const handleInputChange = (e) => {
        setFriendName(e.target.value);
      
      };
    
      const handleSubmit = () => {
        // Handle adding friend logic here
        console.log('Friend added:', friendName);
        handleClose();
      };
    
  const handleSendClick = () => {
    if (message.trim()) {
   
      setMessage('');
    }
  };
  const getreciverid = (id) => {
    setrecieverid(id);
  };


      const handleAddUser = async(friend,userid) => {
        console.log("Add User button clicked!");
        console.log(friend)
        try{
          const friendid =friend._id;
          const res= await axios.post(`http://localhost:5000/friendlist`,{friendid,userid})
          console.log(res.data);
          const user=res.data;
          setusers((prevUsers)=>([
            ...prevUsers,
            user
          ])
        )
        }catch(error){
          console.log('error in sending request',error)
        }
       
      }
    
      
    
      const handleCreateGroup = () => {
        console.log("Create Group button clicked!");
        // Add your functionality here
      };
    
      const handleNotifications = () => {
        console.log("Notifications button clicked!");
        // Add your functionality here
      };
      const checkIfUserIsOnline = (id) => {
        const isOnline = onlineusers.some(user => user.userid === id);
  console.log(`Checking if user ${id} is online:`, isOnline);
  return isOnline;
      };
      
  return (
    <body className={styles.body}>
       <>
    <div className={styles.container}>
      <div className={styles.content1}>
      <div className='topsection'>
      <IconButton onClick={handleClickOpen}>
        <PersonAdd />
      </IconButton>

      {/* Group Icon with onClick */}
      <IconButton onClick={handleCreateGroup}>
        <Group />
      </IconButton>

      {/* Notifications Icon with onClick */}
      <IconButton onClick={handleNotifications}>
        <Notifications />
      </IconButton>
      </div>
      <div className='search'>
      <TextField
          id="standard-search"
          label="Search field"
          type="search"
          variant="standard"
        />
      </div>
      <div  className={styles.chatlist}>
      <List>
      {users.map((user) => (
  <ListItem onClick={()=>getreciverid(user._id)} key={user._id}>
    <ListItemAvatar>
      <Avatar src={user.profilePicture} alt={user.firstName} />
    </ListItemAvatar>
    <ListItemText primary={user.firstName} />
    {checkIfUserIsOnline(user._id) && (
            <CircleIcon
              className="onlineIndicator"
              style={{ color: 'white', fontSize: 15 }} // Customize the icon
            />
          )}
  </ListItem>
))}
    </List>
     

      </div>
      </div>
      
      <div className={styles.content2}>
    
      {conversation.length === 0 ? (
        // Render Lottie animation when there are no conversations
        <div className={styles.lottieContainer}>
          <Lottie animationData={animationData} loop={true} />
        
        </div>
      ) : (
       <List >
       <div className={styles.lottie}>
       {conversation.map((chat) => (
          <ListItem>
          <div className={`${chat.userid._id.toString() === userid.toString() ? styles.chatBubbleSender : styles.chatBubble}`}>
            <Avatar
                src={chat.userid.profilePicture}
                alt={chat.userid.userName}
               
              />
              <ListItemText primary={chat.message} secondary={new Date(chat.createdAt).toLocaleTimeString()} />
            </div>
            
          </ListItem>
          
        ))}
      

       </div>
       
      </List>
       )}
      </div>
  
      <div className={styles.sendmessage}>
        <div className={styles.content3}>
        
       
            {
              receiverid && (
                
                   <div className={styles.chatInputContainer}>
      <button className={styles.emojiButton}>😊</button>
      <input
        type="text"
        className={styles.chatInput}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      
      />
                <IconButton className={styles.sendButton} onClick={handleSendMessage}>
                <SendIcon />
              </IconButton>
                </div>
               

              )
            }
   
      </div>
        </div>
      
    </div>
    <div>
       <Dialog
        open={open}
        onClose={handleClose}
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          style: { backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(5px)' }
        }}
      >
        <DialogTitle>Add a New Friend</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Friend's Name"
            type="text"
            fullWidth
            variant="outlined"
            value={friendName}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={searchfriend} color="primary">
            Submit
          </Button>
        </DialogActions>
        <DialogContent>
    {friend && (
      <List>
        <ListItem key={friend._id}>
          <ListItemAvatar>
            <Avatar src={friend.profilePicture} alt={friend.name} />
          </ListItemAvatar>
          <ListItemText primary={friend.firstName} secondary={friend.email}  />
          
          <Button onClick={()=>handleAddUser(friend,userid)} color="primary">
           Add
          </Button>
        </ListItem>
      </List>
    )}
  </DialogContent>
      </Dialog>
      
      
     
    </div>
   </>
    </body>
   
  );

};
export default Home;