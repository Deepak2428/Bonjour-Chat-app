    let localUser;
    let remoteUser;
    let peerConnection;
    let APP_ID="c3d79a69cb84466c9c9517a9fba473bd";   // agora sdk app id
    let token=null;   //  for authorization
    let uid=String(Math.floor(Math.random()*10000));  // user id to denote which user has joined the channel

    let client;
    let channel;

    let queryString=window.location.search;
    let urlParams= new URLSearchParams(queryString);
    let roomId=urlParams.get('room');

    if(!roomId)
        {
            window.location='lobby.html';
        }

    const server={         //stun server for providing public IP.
        iceServers:[
                {
                  urls: "stun:openrelay.metered.ca:80",
                },
                {
                  urls: "turn:openrelay.metered.ca:80",
                  username: "openrelayproject",
                  credential: "openrelayproject",
                },
                {
                  urls: "turn:openrelay.metered.ca:443",
                  username: "openrelayproject",
                  credential: "openrelayproject",
                },
                {
                  urls: "turn:openrelay.metered.ca:443?transport=tcp",
                  username: "openrelayproject",
                  credential: "openrelayproject",
                },
            
        ]
    }

    let constraints={
        video:{
            width:{min:690,ideal:1920,max:1920},
            height:{min:690,ideal:1080,max:1080}
        }   ,
        audio:true
    }

    let init=async ()=>
    {
    // agora connectivity
        client= await AgoraRTM.createInstance(APP_ID); 

        await client.login({uid,token})

        channel=client.createChannel(roomId)
        await channel.join();

        channel.on('MemberJoined',handleUserJoined); // event listener MemberJoined
        channel.on('MemberLeft',handleUserLeft);
        client.on('MessageFromPeer',handleMessageFromPeer); // event listener when message from peer call handleMessage from peer function

        // setting up user 1 camera and audio

        localUser= await navigator.mediaDevices.getUserMedia(constraints)
        document.getElementById("user1").srcObject=localUser;
        localMediaStream.getAudioStreams()[0].enabled = false
    
    }

    let createPeerConnection= async (MemberId)=>
    {
        // need to create a peer Connection 
        
        peerConnection= new RTCPeerConnection(server);  // using Stun server

        remoteUser=new MediaStream();  // whate ever is in media stream set it to other screen
        document.getElementById("user2").srcObject=remoteUser;
        document.getElementById("user2").style.display='block'; // when user 2 joins then user1 will see user2 block
        //adding the audio and video to peerconnection
        
        // making user 1 video appear as a block above
        document.getElementById("user1").classList.add('smallFrame');
        document.getElementById('user1').volume = 0
       
        if(!localUser) //the local user is not always set like when we refresh page it is null therefore we cannot get tracks of null so we initialize it again
        {
            localUser= await navigator.mediaDevices.getUserMedia({video:true,audio:true})
            document.getElementById("user1").srcObject=localUser;
        }

        localUser.getTracks().forEach((track) => {
            peerConnection.addTrack(track,localUser);  // track obj has audio video and localuser is stream of which track is a component of.
        })

        // we need to recieve the tracks that were added by local user  to remote user

        peerConnection.ontrack=(event)=>{
            event.streams[0].getTracks().forEach((track)=>
            {
                remoteUser.addTrack(track);  
            })
        }

        peerConnection.onicecandidate= async (event)=>{
            if(event.candidate)  
            {
                // if it is a candidate we need to pass offer and ice candidates to remote user for connection
                // remote user gives SDP answer. basically done using signalling which uses websockets to make it real time
                // we will use agora sdk to acheive this.
                client.sendMessageToPeer({text:JSON.stringify({'type':'candidate','candidate':event.candidate})},MemberId)
            }
        }
    }

    let createOffer = async (MemberId)=>
    {
        
        await createPeerConnection(MemberId);
        // creating an offer 

        let offer= await peerConnection.createOffer()
        await peerConnection.setLocalDescription(offer)// like media type etc as we are local also creates ice candidates

        //sending message to peer
        client.sendMessageToPeer({text:JSON.stringify({'type':'offer','offer':offer})},MemberId)
    }

    let toogleVideo = async() =>
    {
        let videotrack=localUser.getTracks().find(track =>track.kind==='video')
        if(videotrack.enabled)
        {
            videotrack.enabled=false;
            document.getElementById("video-btn").style.backgroundColor='rgb(255,80,80)';
        }
        else
        {
            videotrack.enabled=true;
            document.getElementById("video-btn").style.backgroundColor='rgb(179, 102, 249,.9)';
        }
    }

    let toogleAudio = async() =>
    {
        let audiotrack=localUser.getTracks().find(track =>track.kind==='audio')
        if(audiotrack.enabled)
        {
            audiotrack.enabled=false;
            document.getElementById("mic-btn").style.backgroundColor='rgb(255,80,80)';
        }
        else
        {
            audiotrack.enabled=true;
            document.getElementById("mic-btn").style.backgroundColor='rgb(179, 102, 249,.9)';
        }
    }

    let createAnswer = async (MemberId,offer) =>
    {
        await createPeerConnection(MemberId);
        await peerConnection.setRemoteDescription(offer); // for peer2 remote desc is offer of peer 1

        let answer= await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer); // for peer 2 answer to offer is his local desc

        client.sendMessageToPeer({text:JSON.stringify({'type':'answer','answer':answer})},MemberId)
    }

    let addAnswer = async (answer)=>
    {
        if(!peerConnection.currentRemoteDescription) // if remote description of peer1 is not set
        {
            peerConnection.setRemoteDescription(answer);
        }
    }

    let handleUserLeft= async(MemberId)=>
    {
        document.getElementById("user2").style.display="none";
        document.getElementById("user1").classList.remove('smallFrame');
    }

    let handleMessageFromPeer= async(message,MemberId)=>
    {
        message=JSON.parse(message.text);
        if(message.type==='offer')
        {
            createAnswer(MemberId,message.offer);
        }
        if(message.type==='answer')
        {
            addAnswer(message.answer)
        }

        if(message.type==='candidate')
        {
            if(peerConnection)
            {
                peerConnection.addIceCandidate(message.candidate);
            }
        }
    }

    let handleUserJoined= async(MemberId)=>
    {
        console.log("A new user has joined the channel "+MemberId);  // get memberId by default and e display that user has joined the channel
        createOffer(MemberId);
    }

    let leaveChannel = async ()=>{
        await channel.leave();
        await client.logout();
    }

    document.getElementById("video-btn").addEventListener('click',toogleVideo);
    document.getElementById("mic-btn").addEventListener('click',toogleAudio);
    window.addEventListener('beforeunload',leaveChannel); // when user closes the window or flap of laptop leave the channel
    init();
