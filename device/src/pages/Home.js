import logo from '../assets/logotrans.png'
import ReactPlayer from 'react-player'
import { useContext, useEffect, useState, useRef } from 'react'
import { Context } from '../context/context'
const Home = () => {
    const { userInfo } = useContext(Context);
    const [info, setInfo] = useState(userInfo)

   /* const checkTime = () => {
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

  */
    
   
    const [currentUrlIndex, setCurrentUrlIndex] = useState(0);
    const videoRef = useRef(null);
      
   
      const handleEnded = (val) => {
        // decrementing adFrequency value by 1
        let newInfo = { ...info };
        newInfo.slots[0].queue[currentUrlIndex].adFrequency =
          newInfo.slots[0].queue[currentUrlIndex].adFrequency - 1;
        setInfo(newInfo);
      
        if (currentUrlIndex < val - 1) {
          let nextIndex = currentUrlIndex + 1;
          while (newInfo.slots[0].queue[nextIndex].adFrequency === 0) {
            // skip over videos with adFrequency 0
            nextIndex++;
            if (nextIndex >= val) {
              // reached the end of the queue, start from the beginning
              setCurrentUrlIndex(0)
            }
          }
          setCurrentUrlIndex(nextIndex);
        } else {
          setCurrentUrlIndex(0);
         
        
      };
      

          

        
       
    
        
      };

    

    return(
        <div className='relative'>
            
            <div>
               
                       <ReactPlayer ref={videoRef}  playing={true} width="100vw" height="100vh" url={info.slots[0].queue[currentUrlIndex].ad.url}  onEnded={()=>handleEnded(info.slots[0].queue.length)} /> : <h1>No ads are added in this session</h1>
               



  


                 
                </div>
         

            <div className='absolute left-0 bg-[#000000d6] top-0 right-0 flex justify-end '>
                <img src={logo} alt=""  className='w-[8%]' />
            </div>
            
        </div>        

    )
}


export default Home