
import axios from "axios"
const data = import.meta.env.VITE_REACT_APP_GETDATA
const countryData = import.meta.env.VITE_REACT_APP_COUNTRY_DATA
const countryName = import.meta.env.VITE_REACT_APP_COUNTRY_NAME
import { handleResponse} from '../util/handleResponse'

export const fetchAPI={
      getData:async(req)=>{
            try{
                  const response = await axios.post(`https://population-growth-services.vercel.app/getdata`,{"country": [...req]})
                  return handleResponse.success(response)
            }catch(err){
                  return handleResponse.error(err)
            }
      },

      getCountryData:async()=>{
            try{
                  const response = await axios.get(`https://restcountries.com/v3.1/all`)                    
                  return handleResponse.success(response)
            }catch(err){
                  return handleResponse.error(err)
            }
      },

      getCountryName:async()=>{
            try{
                  const response = await axios.get(`https://population-growth-services.vercel.app/getcountry`)
                  return handleResponse.success(response)
            }catch(err){
                  return handleResponse.error(err)
            }
      },
}
