import logo from '../assets/logotrans.png'
import ReactPlayer from 'react-player'
import { useContext, useEffect, useState, useRef } from 'react'
import { Context } from '../context/context'
const Home = () => {
    const { userInfo } = useContext(Context);
    console.log(userInfo)
    const [mrng, setMrng] = useState(false)
    const [nn, setNn] = useState(false)
    const [evng, setEvng] = useState(false)

  const checkTime = () => {
        const currentTime = new Date();
        const currentHour = currentTime.getHours();
        if(currentHour<8 || currentHour>21){
            setEvng(false)
            setMrng(false)
            setNn(false)
        }
        if(currentHour>8 && currentHour<12){
            setMrng(true)
            setNn(false)
            setEvng(false)
        }
        if(currentHour>12 && currentHour<16){
            setNn(true)
            setMrng(false)
            setEvng(false)
        }
        if(currentHour>16 && currentHour<21){
            setEvng(true)
            setMrng(false)
            setNn(false)
        }
       
    }
    const now = new Date();
    const delay = 60 * 60 * 1000 - now.getMinutes() * 60 * 1000 - now.getSeconds() * 1000 - now.getMilliseconds();
    setTimeout(function() {
        checkTime(); // Run the function immediately
        setInterval(checkTime, 60 * 60 * 1000); // Run the function once per hour
      }, delay);

 
    
   
    const [currentUrlIndex, setCurrentUrlIndex] = useState(0);
    const videoRef = useRef(null);
    
    const handleEnded = (val) => {
        if (currentUrlIndex < val - 1) {
          setCurrentUrlIndex(currentUrlIndex + 1);
        } else {
          setCurrentUrlIndex(0)
        }
      };

    

    return(
        <div className='relative'>
            
            <div>
                {userInfo !== undefined &&
                    
<>
              {
                  mrng && 
                  <>{            userInfo.queues.morningQueue.ads.length != 0 ?     <ReactPlayer  playing={true} width="100vw" height="100vh" url={userInfo.queues.morningQueue.ads[currentUrlIndex].url} onEnded={()=>handleEnded(userInfo.queues.morningQueue.ads.length)}/> : <h1>No ads are added in this session</h1>
                }   </>

              }      
             { 
                 nn &&  <>
                 {  userInfo.queues.noonQueue.ads.length != 0 ? <ReactPlayer playing={true} width="100vw" height="100vh" url={userInfo.queues.noonQueue.ads[currentUrlIndex].url} onEnded={()=>handleEnded(userInfo.queues.noonQueue.ads.length)}/>: <h1>No ads are added in this session</h1>
}  
                 </>
             }    
             {
                 evng && 
                 <>
                 {        userInfo.queues.eveningQueue.ads.length != 0 ?          <ReactPlayer  playing={true} width="100vw" height="100vh" url={userInfo.queues.eveningQueue.ads[currentUrlIndex].url} onEnded={()=>handleEnded(userInfo.queues.eveningQueue.ads.length)}/>: <h1 className=''>No ads are added in this session</h1>
}
                 </>
             }



  

</>
                   /*  <video
                    ref={videoRef}
                    src={userInfo.queues.morningQueue.ads[0].url}
                    onEnded={handleEnded}
                    autoPlay
                    controls
                />  */} 
                </div>
         

            <div className='absolute left-0 bg-[#000000d6] top-0 right-0 flex justify-end '>
                <img src={logo} alt=""  className='w-[8%]' />
            </div>
            
        </div>        

    )
}


export default Home