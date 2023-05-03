import logo from '../assets/logotrans.png'
import ReactPlayer from 'react-player'
import { useContext, useState, useRef, useEffect } from 'react'
import { Context } from '../context/context'
import axios from 'axios'
const Home = () => {
  const BASE_URL = "http://localhost:5000/api/operator";

const config = {
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
};

    const { userInfo } = useContext(Context);
    const [info, setInfo] = useState(userInfo)
    const [slot, setSlot] = useState(0)
    const checkTime = () => {
        const currentTime = new Date();
        const currentHour = currentTime.getHours();
        switch(currentHour){
          case 9:
            setSlot(0)
            break;
          case 10:
            setSlot(1)
            break;

          case 11:
            setSlot(2)
            break;

          case 12:
            setSlot(3)
            break;

          case 13:
            setSlot(4)
            break;

          case 14:
            setSlot(5)
            break;

          case 15:
            setSlot(6)
            break;

          case 16:
            setSlot(7)
            break;

          case 17:
            setSlot(8)
            break;

          case 18:
            setSlot(9)
            break;
          case 19:
            setSlot(10)
            break;
          case 20:
            setSlot(11)
            break;
          case 21:
            setSlot(12)
            break;
          case 22:
            setSlot(13)
            break;
          case 23:
            setSlot(14);
            break;

      }       
    } 

    useEffect(()=>{
      checkTime()
    }, [])
    
    const now = new Date();
    const delay = 60 * 60 * 1000 - now.getMinutes() * 60 * 1000 - now.getSeconds() * 1000 - now.getMilliseconds();
    setTimeout(function() {
        checkTime(); // Run the function immediately
        setInterval(checkTime, 60 * 60 * 1000); // Run the function once per hour
      }, delay);

  
    
   
    const [currentUrlIndex, setCurrentUrlIndex] = useState(0);
    const videoRef = useRef(null);
      
   
    const handleEnded = async (val, deviceId, slotType, adId, operatorId) => {
      let newInfo = { ...info };
      if (
        newInfo.slots[slot] &&
        newInfo.slots[slot].queue[currentUrlIndex] &&
        newInfo.slots[slot].queue[currentUrlIndex].adFrequency !== undefined
      ) {
        let inc = {
          deviceId,
          slot:slotType,
          adId,
          operatorId,
        };
         await axios.post(`${BASE_URL}/incad`,inc, config)
        console.log(inc)
        newInfo.slots[slot].queue[currentUrlIndex].adFrequency =
          newInfo.slots[slot].queue[currentUrlIndex].adFrequency - 1;
        setInfo(newInfo);
        console.log(info);
    
        if (currentUrlIndex < val - 1) {
          let nextIndex = currentUrlIndex + 1;
          while (
            newInfo.slots[slot].queue[nextIndex] &&
            newInfo.slots[slot].queue[nextIndex].adFrequency === 0
          ) {
            // skip over videos with adFrequency 0
            nextIndex++;
            if (nextIndex >= val) {
              // reached the end of the queue, start from the beginning
              setCurrentUrlIndex(0);
            }
          }
          setCurrentUrlIndex(nextIndex);
        } else {
          setCurrentUrlIndex(0);
        }
      }
    };
    

    

    return(
      <div className='relative'>
      {slot !== null && info.slots[slot] && info.slots[slot].queue[currentUrlIndex] && info.slots[slot].queue[currentUrlIndex].ad && (
        <div className=''>
          <ReactPlayer
            ref={videoRef}
            playing={true}
            width="100vw"
            height="100vh"
            url={info.slots[slot].queue[currentUrlIndex].ad.url}
            onEnded={() => handleEnded(info.slots[slot].queue.length, info._id, info.slots[slot].name, info.slots[slot].queue[currentUrlIndex].ad._id, info.slots[slot].queue[currentUrlIndex].operator._id)}
          />
        </div>
      )}
      <div className='absolute left-0 bg-[#000000d6] top-0 right-0 flex justify-end '>
        <img src={logo} alt="" className='w-[8%]' />
      </div>
      <div className='absolute w-[100vw] bg-[black] h-[70px] bottom-0 left-0 z-100'></div>
    </div>
          

    )
}


export default Home