// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB9UXuwY4xPIYE_Cj-MWQ2c6HCrQdSzhjE",
    authDomain: "real-time-community-chat.firebaseapp.com",
    projectId: "real-time-community-chat",
    storageBucket: "real-time-community-chat.firebasestorage.app",
    messagingSenderId: "181787914206",
    appId: "1:181787914206:web:990d9e83cfaa00e34df74f",
    measurementId: "G-ZQKVVHM3LS"
  };
  

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const App = (function(){
  const el=(s,root=document)=>root.querySelector(s);
  const messagesEl=el('#messages'), msgInput=el('#msgInput'), sendBtn=el('#sendMsg');

  // Generate or retrieve unique user ID
  const userId = localStorage.getItem('user_id') || (() => {
    const id = Math.random().toString(36).slice(2,9);
    localStorage.setItem('user_id', id);
    return id;
  })();

  function renderMessages(msgs){
    messagesEl.innerHTML='';
    msgs.forEach(m=>{
      const d=document.createElement('div');
      d.className='msg';
      d.textContent=`${m.from}: ${m.text}`;
      messagesEl.appendChild(d);
    });
    messagesEl.scrollTop=messagesEl.scrollHeight;
  }

  sendBtn.onclick=()=>{
    const txt=msgInput.value.trim();
    if(!txt) return;
    const m={from:userId,text:txt,ts:Date.now()};
    db.collection('messages').add(m).then(()=>{
      msgInput.value='';
    });
  };

  msgInput.addEventListener('keydown',e=>{if(e.key==='Enter')sendBtn.click()});

  db.collection('messages').orderBy('ts').onSnapshot(snapshot=>{
    const msgs = snapshot.docs.map(doc=>doc.data());
    renderMessages(msgs);
  });
})();