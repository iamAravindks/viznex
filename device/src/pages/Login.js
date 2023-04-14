import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import { useContext, useState, useMemo, useEffect } from 'react';
import { Context } from '../context/context';
const Login = () => {
    const { login, userInfo } = useContext(Context);
    const navigate = useNavigate();

    const memoizedUserInfo = useMemo(() => userInfo, [userInfo]);
  
    useEffect(() => {
      if (memoizedUserInfo?._id) {
        navigate("/");
      }
    }, [memoizedUserInfo]);
    const [formData, setFormData] = useState({
        deviceId: "",
        password: "",
      });

      const onHandlerChange = (e) => {
        setFormData((prevState) => {
          return { ...prevState, [e.target.id]: e.target.value };
        });
      };

      const onSubmitHandler = (e) => {
        e.preventDefault();
        login(formData.deviceId, formData.password);
      };
  
    return (
        <div className="h-[100vh] w-[100vw] flex font-roboto">

            <div className="h-full w-[50vw] left flex flex-col justify-center items-start px-52">
                <div className=''>
                    <h1 className="text-4xl font-bold text-[#3D3D3D]">Welcome back</h1>
                    <p className='text-[#6D6D6D] text-lg'>Please enter your details</p>
                </div>
                <div className='py-12 w-full'>
                    <form onSubmit={onSubmitHandler} action="" className='flex flex-col w-[60%]'>
                        <input type="text" id="deviceId" className='border-b border-b-[#B6B6B6] border-b-[1px] text-[#6D6D6D] font-medium w-full mb-4 outline-none py-2' placeholder="Username" required value={formData.deviceId}
                onChange={(e) => onHandlerChange(e)}/>
                        <input type="password" id='password'  value={formData.password}
                onChange={onHandlerChange}
              className='border-b border-b-[#B6B6B6] border-b-[1px] text-[#6D6D6D] font-medium w-full outline-none py-2' placeholder="Password" />
                        <p className='text-[#6B7FDB] text-right font-normal my-2 text-base'>Forgot password?</p>
                        <button className='w-full'><button type='submit' className='grad-1 w-full text-white font-bold text-lg rounded-[5px] py-2 mt-8'>Login</button></button>
                        <p className='my-4 text-[#8E8E8E] text-sm'>Don't have an account? <span className='text-[#6B7FDB] font-semibold'>SignUp</span></p>

                    </form>
                </div>
            </div>
            <div className="h-full w-[50vw] relative right">
                <img src={logo} alt="" className='absolute top-0 right-16   x' />
            </div>


        </div>
    )
}


export default Login