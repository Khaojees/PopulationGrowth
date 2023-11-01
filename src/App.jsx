import './App.scss'
import {fetchAPI} from './API/fetchAPI'
import { useEffect, useState } from 'react'
import ChartComponent from './components/ChartComponent'
import ReactLoading from 'react-loading';

function App() {
  const [selectCountry,setSelectCountry] = useState([])
  const [population,setPopulation] = useState(0)
  const [currentYear,setCurrentYear] = useState("1950")
  const [worldState,setWorldState] = useState(true)
  const [allYear,setAllYear] = useState([])
  const [max,setMax] = useState()
  const [data,setData] = useState({
    data: [],
    loading: false,
    error: null
  })
  const [countryData,setCountryData] = useState({
    data: [],
    loading: false,
    error: null
  })
  const [countryName,setCountryName] = useState({
    data: [],
    loading: false,
    error: null
  })

  const callChartData=async(e)=>{
    setData({data: [],loading: true,error: null})
    const dataResponse = await fetchAPI.getData(selectCountry)
    if(dataResponse.status === 200){
      // const responseTemp = dataResponse.data
      const responseTemp=[]
      let range = 0
      let yearTemp = dataResponse.data[0].years      
      for(const item of dataResponse.data){ 
        if(item.years === yearTemp){
          if(range < 13){
            range++
          }else{
            range = 13
          }          
        }
      }
      let count = 0
      for(const item of dataResponse.data){
        if(count >= range){
          yearTemp = (parseInt(yearTemp)+1).toString()
          count = 0
        }
        if(item.years === yearTemp){
          responseTemp.push(item)
          count++
        }
      }

      for(const tempData of responseTemp){
        if(tempData.country_name !== "World"){
          setMax(tempData.population)
          break
        }
    }

      const addFlag = []      
      for(const tempData of responseTemp){
        for(const item of e){
          if(tempData.country_name === item.name){
            addFlag.push({
              country_name:tempData.country_name,
              population:tempData.population,
              region:tempData.region,
              years:tempData.years,
              flag:item.flag
              })
              break
          }
          if(tempData.country_name === "World"){
            addFlag.push({
              country_name:tempData.country_name,
              population:tempData.population,
              region:tempData.region,
              years:tempData.years,
              flag:null
              })
              break
          }
        }
      }
      setData({data: addFlag,loading: false,error: null}) 
      
      const allYearTemp = []
      for(const tempData of responseTemp){
          if(allYearTemp.indexOf(tempData.years)<0 && tempData.country_name !=="World"){
            allYearTemp.push(tempData.years)            
          }
      }

      setPopulation(()=>{
        for(const item of responseTemp){
          if(item.years === currentYear){
                return item.population
          }
      }
      })
        
      setAllYear([...allYearTemp])
      
    }else{
      setData({data: [],loading: false,error: dataResponse.error})
    }
  }

  const callData =async()=>{         
    setCountryData({data: [],loading: true,error: null})
    setCountryName({data: [],loading: true,error: null})   

    const filterData = []
    const countryDataResponse = await fetchAPI.getCountryData()
    if(countryDataResponse.status === 200){
      for(const tempData of countryDataResponse.data){
        filterData.push({
          name:tempData.name.common,
          region:tempData.region,
          flag:tempData.flags.svg
        })
      }
      // console.log(filterData)
      setCountryData({data: filterData,loading: false,error: null})
    }else{
      setCountryData({data: [],loading: false,error: countryDataResponse.error})
    }    

    callChartData(filterData) 

    const addFalseKey = []
    const countryNameResponse = await fetchAPI.getCountryName()
    if(countryNameResponse.status === 200){
      for(const tempData of countryNameResponse.data){
        for(const item of filterData){
          if(item.name === tempData.country_name){
            addFalseKey.push({
              country_name:tempData.country_name,
              checked:false
            })
          }
        }       
      }
      setCountryName({data: addFalseKey,loading: false,error: null})
    }else{
      setCountryName({data: [],loading: false,error: countryNameResponse.error})
    }
  }

  useEffect(()=>{
    callData()
  },[])

  useEffect(()=>{
    for(const count of countryName.data){
      if(count.checked){
        setWorldState(false)
        break
      }      
      setWorldState(true)
    }
  },[countryName])

  useEffect(()=>{
    if(worldState){
      setCountryName({data: [...countryName.data.map((item)=>{     
        return {
          country_name:item.country_name,
          checked:(false)
        }
      })],loading: false,error: null})
    }
  },[worldState])


const handleCheckbox=(e)=>{
  console.log(e.target.value)
    setCountryName({data: [...countryName.data.map((item)=>{      
      if(item.country_name === e.target.value){
      return {
        country_name:e.target.value,
        checked:(!item.checked)
      }
      }else{
          return item
      }
    })],loading: false,error: null})
}

const worldClicked=()=>{
  if(!worldState){
    setWorldState(!worldState)  
  }
}
const showFilterData=(e)=>{
  e.preventDefault()
      setSelectCountry([])
      const selectCountryTemp = []
      countryName.data.forEach((item)=>{
        if(item.checked){
          selectCountryTemp.push(item.country_name) 
        }
      })
      setSelectCountry([...selectCountryTemp])
}

useEffect(()=>{
  callChartData(countryData.data)
},[selectCountry])

useEffect(()=>{
  for(const tempData of data.data){
    if(tempData.country_name !== "World" && currentYear===tempData.years){
      setMax(tempData.population)
      break
    }
}
},[currentYear])

  return (
    <div className='container'>
      {(data.loading || countryData.loading || countryName.loading) && <ReactLoading type="spin" color="#ff999a" />}
      <h1>Population growth per country, 1950 to 2021</h1>
      {!(data.loading || countryData.loading || countryName.loading) && 
      <div>      
      <section className='section'>
      <form onSubmit={showFilterData}>
        <label><b>Select country</b></label>        
        <div className='select-container'>
                      <div>
                        <input type="checkbox" 
                          value="World" checked={worldState}
                          name="World"
                          onClick={worldClicked}
                        />   
                        <label>All Country</label> 
                      </div>
          {countryName.data.map((item,index)=>{
            return <div key={index}>                      
                      <input type="checkbox" 
                      value={item.country_name}
                      checked={item.checked}
                      onClick={handleCheckbox}/>   
                      <label>{item.country_name}</label>                   
                  </div>  
          })}             
        </div> 
        <button type='submit'>Show</button>  
      </form>
      <ChartComponent 
      data={data}
      allYear={allYear}
      max={max}
      currentYear={currentYear}
      setCurrentYear={setCurrentYear}
      population={population}
      setPopulation={setPopulation}
      />      
      </section>
      </div>}
    </div>
  )
}

export default App
