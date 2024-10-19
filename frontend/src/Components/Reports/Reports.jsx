import React , {useState , useEffect} from 'react'

const Reports = () => {

  const [data , setData] = useState([]);

  useEffect(()=>{
    const fetchData = async () =>{
      try{
        const response = await fetch("https://dev-interplay.cloudupscale.com/users")
        const data = await response.json()
        setData(data)
      }
      catch(error){
        console.error("Error in dataFetching", error);
      }
    }
    fetchData()
  } , [])


  return (
    <div className='bg-[#000D51] text-white px-5 min-h-svh'>
    <h4 className='text-center text-xl my-2'>Reports</h4>
    
      {data.map(item => {
        return(<div className='m-2 bg-black inline-grid md:w-[31%] py-2 rounded-2xl w-5/6' key={item._id}>
          <div className='p-2'>
            <p className='break-all'><span className='text-orange-600'>Email</span> : {item.email}</p>
            <p className='p-1'><span className='text-orange-600 '>Role </span> : {item.role}</p>
          </div>
        </div>)
      })}
    
  </div>
  )
}

export default Reports