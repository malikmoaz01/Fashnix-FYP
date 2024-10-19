import * as Yup from 'yup'

export const signUpSchema = Yup.object({
    email: Yup.string().email().required("Please enter your email"),
    password: Yup.string().min(8).required("Password is required"),
    cPassword: Yup.string().required().oneOf([Yup.ref('password') , null] , "Password and confirm password must match"),
})