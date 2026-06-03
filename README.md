<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Modern Chat Dashboard</title>
<style>
body {
  margin:0;
  font-family: 'Segoe UI', sans-serif;
  background:#f3f4f8;
}

/* Top bar */
.topbar {
  background:#5c2d91;
  color:white;
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:12px 20px;
}

.topbar input {
  width:40%;
  padding:8px;
  border-radius:20px;
  border:none;
}

/* Layout */
.container {
  display:flex;
  height:90vh;
}

.sidebar {
  width:70px;
  background:#5c2d91;
  display:flex;
  flex-direction:column;
  align-items:center;
  padding-top:15px;
}

.sidebar div {
  color:white;
  margin:15px 0;
  cursor:pointer;
}

.contacts {
  width:280px;
  background:white;
  padding:10px;
  border-right:1px solid #ddd;
}

.contact {
  padding:10px;
  display:flex;
  align-items:center;
  border-bottom:1px solid #eee;
}

.contact img {
  width:40px;
  height:40px;
  border-radius:50%;
  margin-right:10px;
}

.chat-area {
  flex:1;
  display:flex;
  flex-direction:column;
}

.chat-header {
  padding:15px;
  background:white;
  border-bottom:1px solid #ddd;
}

.chat-body {
  flex:1;
  padding:15px;
  overflow-y:auto;
}

.msg {
  max-width:60%;
  padding:10px;
  margin:8px 0;
  border-radius:10px;
}

.sent {
  background:#5c2d91;
  color:white;
  margin-left:auto;
}

.received {
  background:#eaeaea;
}

.chat-footer {
  display:flex;
  padding:10px;
  background:white;
  border-top:1px solid #ddd;
}

.chat-footer input {
  flex:1;
  padding:10px;
  border-radius:20px;
  border:1px solid #ccc;
}

.chat-footer button {
  margin-left:10px;
  padding:10px 15px;
  border:none;
  background:#5c2d91;
  color:white;
  border-radius:20px;
}

.profile {
  width:250px;
  background:white;
  border-left:1px solid #ddd;
  padding:15px;
  text-align:center;
}

.profile img {
  width:100px;
  border-radius:50%;
}

</style>
</head>
<body>

<div class="topbar">
 <div>LOGO</div>
 <input type="text" placeholder="Search user, events...">
 <div>Profile</div>
</div>

<div class="container">

 <div class="sidebar">
   <div>🏠</div>
   <div>💬</div>
   <div>📁</div>
 </div>

 <div class="contacts">
   <h3>Chat</h3>
   <div class="contact">
     https://via.placeholder.com/40
     <div>Sayali</div>
   </div>
   <div class="contact">
     <img src="https://via.placeholder.com/40">
     <div>Rohit</div>
   </div>
 </div>

 <div class="chat-area">
   <div class="chat-header">Sayali Santakke</div>
   <div class="chat-body" id="chatBody">
     <div class="msg received">Hello!</div>
     <div class="msg sent">Hi 👋</div>
   </div>

   <div class="chat-footer">
     <input type="text" id="msgInput" placeholder="Type message">
     <button onclick="sendMsg()">Send</button>
   </div>
 </div>

 <div class="profile">
   <img src="https://via.placeholder.com/100">
   <h3>Sayali</h3>
   <p>Pune, India</p>
 </div>

</div>

<script>
function sendMsg(){
  let input = document.getElementById("msgInput");
  let text = input.value.trim();
  if(!text) return;

  let msg = document.createElement("div");
  msg.className = "msg sent";
  msg.innerText = text;

  document.getElementById("chatBody").appendChild(msg);
  input.value = "";
}
</script>

</body>
</html>
