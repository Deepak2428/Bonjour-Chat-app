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
                urls:['
                "iphone-stun.strato-iphone.de:3478",
                "numb.viagenie.ca:3478",
                "stun.12connect.com:3478",
                "stun.12voip.com:3478",
                "stun.1und1.de:3478",
                "stun.3cx.com:3478",
                "stun.acrobits.cz:3478",
                "stun.actionvoip.com:3478",
                "stun.advfn.com:3478",
                "stun.altar.com.pl:3478",
                "stun.antisip.com:3478",
                "stun.avigora.fr:3478",
                "stun.bluesip.net:3478",
                "stun.cablenet-as.net:3478",
                "stun.callromania.ro:3478",
                "stun.callwithus.com:3478",
                "stun.cheapvoip.com:3478",
                "stun.cloopen.com:3478",
                "stun.commpeak.com:3478",
                "stun.cope.es:3478",
                "stun.counterpath.com:3478",
                "stun.counterpath.net:3478",
                "stun.dcalling.de:3478",
                "stun.demos.ru:3478",
                "stun.dus.net:3478",
                "stun.easycall.pl:3478",
                "stun.easyvoip.com:3478",
                "stun.ekiga.net:3478",
                "stun.epygi.com:3478",
                "stun.etoilediese.fr:3478",
                "stun.faktortel.com.au:3478",
                "stun.freecall.com:3478",
                "stun.freeswitch.org:3478",
                "stun.freevoipdeal.com:3478",
                "stun.gmx.de:3478",
                "stun.gmx.net:3478",
                "stun.halonet.pl:3478",
                "stun.hoiio.com:3478",
                "stun.hosteurope.de:3478",
                "stun.infra.net:3478",
                "stun.internetcalls.com:3478",
                "stun.intervoip.com:3478",
                "stun.ipfire.org:3478",
                "stun.ippi.fr:3478",
                "stun.ipshka.com:3478",
                "stun.it1.hr:3478",
                "stun.ivao.aero:3478",
                "stun.jumblo.com:3478",
                "stun.justvoip.com:3478",
                "stun.l.google.com:19302",
                "stun.linphone.org:3478",
                "stun.liveo.fr:3478",
                "stun.lowratevoip.com:3478",
                "stun.lundimatin.fr:3478",
                "stun.mit.de:3478",
                "stun.miwifi.com:3478",
                "stun.modulus.gr:3478",
                "stun.myvoiptraffic.com:3478",
                "stun.netappel.com:3478",
                "stun.netgsm.com.tr:3478",
                "stun.nfon.net:3478",
                "stun.nonoh.net:3478",
                "stun.nottingham.ac.uk:3478",
                "stun.ooma.com:3478",
                "stun.ozekiphone.com:3478",
                "stun.pjsip.org:3478",
                "stun.poivy.com:3478",
                "stun.powervoip.com:3478",
                "stun.ppdi.com:3478",
                "stun.qq.com:3478",
                "stun.rackco.com:3478",
                "stun.rockenstein.de:3478",
                "stun.rolmail.net:3478",
                "stun.rynga.com:3478",
                "stun.schlund.de:3478",
                "stun.sigmavoip.com:3478",
                "stun.sip.us:3478",
                "stun.sipdiscount.com:3478",
                "stun.sipgate.net:10000",
                "stun.sipgate.net:3478",
                "stun.siplogin.de:3478",
                "stun.sipnet.net:3478",
                "stun.sipnet.ru:3478",
                "stun.sippeer.dk:3478",
                "stun.siptraffic.com:3478",
                "stun.sma.de:3478",
                "stun.smartvoip.com:3478",
                "stun.smsdiscount.com:3478",
                "stun.solcon.nl:3478",
                "stun.solnet.ch:3478",
                "stun.sonetel.com:3478",
                "stun.sonetel.net:3478",
                "stun.sovtest.ru:3478",
                "stun.srce.hr:3478",
                "stun.stunprotocol.org:3478",
                "stun.t-online.de:3478",
                "stun.tel.lu:3478",
                "stun.telbo.com:3478",
                "stun.tng.de:3478",
                "stun.twt.it:3478",
                "stun.uls.co.za:3478",
                "stun.unseen.is:3478",
                "stun.usfamily.net:3478",
                "stun.viva.gr:3478",
                "stun.vivox.com:3478",
                "stun.vo.lu:3478",
                "stun.voicetrading.com:3478",
                "stun.voip.aebc.com:3478",
                "stun.voip.blackberry.com:3478",
                "stun.voip.eutelia.it:3478",
                "stun.voipblast.com:3478",
                "stun.voipbuster.com:3478",
                "stun.voipbusterpro.com:3478",
                "stun.voipcheap.co.uk:3478",
                "stun.voipcheap.com:3478",
                "stun.voipgain.com:3478",
                "stun.voipgate.com:3478",
                "stun.voipinfocenter.com:3478",
                "stun.voipplanet.nl:3478",
                "stun.voippro.com:3478",
                "stun.voipraider.com:3478",
                "stun.voipstunt.com:3478",
                "stun.voipwise.com:3478",
                "stun.voipzoom.com:3478",
                "stun.voys.nl:3478",
                "stun.voztele.com:3478",
                "stun.webcalldirect.com:3478",
                "stun.wifirst.net:3478",
                "stun.xtratelecom.es:3478",
                "stun.zadarma.com:3478",
                "stun1.faktortel.com.au:3478",
                "stun1.l.google.com:19302",
                "stun2.l.google.com:19302",
                "stun3.l.google.com:19302",
                "stun4.l.google.com:19302",
                "stun.nextcloud.com:443",
                "relay.webwormhole.io:3478"
                ']}
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

    
    }

    let createPeerConnection= async (MemberId)=>
    {
        // need to create a peer Connection 
        
        peerConnection= new RTCPeerConnection(server);  // using Stun server

        remoteUser=new MediaStream();  // whate ever is in media stream set it to other screen
        document.getElementById("user2").srcObject=remoteUser;
        document.getElementById("user2").style.display='block'; // when user 2 joins then user1 will see user2 block
        //adding the audio and video to peerconnection
        document.getElementById("user2").classList.add('smallFrame');
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
        document.getElementById("user2").classList.remove('smallFrame');
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
