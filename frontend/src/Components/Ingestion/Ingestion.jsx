import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import { signUpSchema } from '../../schemas'

// Create:
//  https://dev-interplay.cloudupscale.com/users
//  payload:
//  {
//      "email":"admin1@gmail.com",
//      "password":"test123",
//      "confirmPassword":"test123"
 
//  }

const initialValues = {
  email : "",
  password : "",
  cPassword : ""

}

const Ingestion = () => {

  const navigate = useNavigate()

  const {values , errors , touched, handleBlur , handleChange} = useFormik({
    initialValues: initialValues,
    validationSchema: signUpSchema,
    onSubmit : (values , action) => {
      console.log("Formik values" , values);
      action.resetForm()
    }
  })
  
  // console.log("Errors" , errors)

  const submitHandler = async (event) =>{
    event.preventDefault();

    
    const email = event?.target?.email?.value;
    const password = event?.target?.password?.value;
    const cPassword = event?.target?.cPassword?.value;
    const payload = {email , password , confirmPassword : cPassword};

    try {
      const response = await fetch("https://dev-interplay.cloudupscale.com/users", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log(result);
        alert("Add Product Sucessfully")
        event.target.reset();
        navigate('/reports');
      } else {
        alert("Failed to insert data")
        console.error('Failed to add product:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
    // axios.post("https://dev-interplay.cloudupscale.com/users" , payload).then(response => {
    //   console.log(response);
    //   event.target.reset()
    //   navigate('/reports');
    // })
    // .catch(error => {
    //   console.log(error);
    // })

  return (
    <div className='bg-gradient-to-t from-[#000D51] to-[#000000]  p-2 h-full'>
    <h2 className='my-2 text-center md:text-xl text-blue-300 md:font-bold md:ml-12 md:mt-3 mt-1.5 ml-6 text-lg font-medium'>Enter Your Information</h2>
    <div className='flex text-center justify-center '>
      <form className='flex flex-col gap-5 mt-3' onSubmit={submitHandler}>
        <div className='flex flex-col'>
        <input type="email" name='email' placeholder='Enter your Email ' autoComplete='off' value={values.email} className='md:w-[180%] border-[1px] border-solid border-green-600 rounded-xl p-2 w-auto' onChange={handleChange} onBlur={handleBlur} />
        { errors.email && touched.email ? <p className='form-error text-red-500'>{errors.email}</p> : null}
        </div>
        <div className='flex flex-col'>
        <input type="password" name='password' placeholder='Enter your Password' value={values.password} className='md:w-[180%] border-[1px] border-solid border-green-600 rounded-xl p-2 w-auto' onChange={handleChange} onBlur={handleBlur}/>
        { errors.password && touched.password ? <p className='form-error text-red-500'>{errors.password}</p> : null}
        </div>
        <div className='flex flex-col'>
        <input type="password" name='cPassword' placeholder='Confirm your Password' value={values.cPassword} className='md:w-[180%] border-[1px] border-solid border-green-600 rounded-xl p-2 w-auto' onChange={handleChange} onBlur={handleBlur}/>
        { errors.cPassword && touched.cPassword ? <p className='form-error text-red-500'>{errors.cPassword}</p> : null}  
        </div>
        <button type='submit' className='bg-orange-600 md:w-full md:ml-12 mt-2.5 md:p-2.5 rounded-xl font-bold w-auto ml-5 p-1'>Confirm</button>
      </form>
    </div>
    </div>
  )
}

export default Ingestion
