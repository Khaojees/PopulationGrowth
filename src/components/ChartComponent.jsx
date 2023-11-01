import { useEffect, useState } from "react"
import { AiFillPlayCircle,AiFillPauseCircle } from 'react-icons/ai';
import { useSpring, animated } from '@react-spring/web'

const ChartComponent = ({data,allYear,max,currentYear,setCurrentYear,population,setPopulation}) => {
      const [region] = useState(['Asia','Europe','Africa','Oceania','Americas'])
      const [play,setPlay] = useState(false)
      const [chartData,setChartData] = useState([])
      const [chartContainer,setChartContainer] = useState([])
      const [nextYearPop,setNextYearPop] = useState(0)
      const [allCountry,setAllCountry] = useState([])

      const makeChartContainer=(len)=>{
            const chartContainerTemp = []
            for(let i=0; i<len;i++){
                  chartContainerTemp.push(i)
            }
            return chartContainerTemp 
      }

      const getAllCountry = ()=>{
            const allCountryTemp = []
            for(const i of data.data){
                  if(allCountryTemp.indexOf(i.country_name)<0 && i.country_name!== "World"){
                        allCountryTemp.push(i.country_name)
                  }
            }
            setChartContainer(()=>[...makeChartContainer(allCountryTemp.length)])
            return allCountryTemp
      }

      useEffect(()=>{            
            setAllCountry(()=>[...getAllCountry()])
      },[data])

      const getChartData=(year)=>{            
            const dataItemYear = data.data.filter((e)=>e.years === year && e.country_name !== "World")
                  for(let i =0; i<dataItemYear.length; i++){
                        dataItemYear[i].width = `${parseInt(dataItemYear[i].population)*100.0/parseInt(dataItemYear[0].population)}%`
                  }
            
            const allCountryTemp = [] 
            const dataItem = []           
            for(const i of data.data){
                  if(allCountryTemp.indexOf(i.country_name)<0 && i.country_name!== "World"){
                        allCountryTemp.push(i.country_name)
                        dataItem.push({
                              country_name:i.country_name
                        }) 
                  }
            }                   

            const getNextyearCountryPop = (item,index)=>{
                  let nextyearCountryPopTemp = dataItemYear[index].population
                  // console.log(data.data.filter((e)=>parseInt(e.years) === parseInt(year)+1 && e.country_name !== "World"))
                  if(year == 2021){
                        return nextyearCountryPopTemp
                  }else{
                        const dataItemYear = data.data.filter((e)=>parseInt(e.years) === parseInt(year)+1 && e.country_name !== "World")
                        let check = false
                        for(const i of dataItemYear){
                              if(item === i.country_name){
                                    check = true
                                    return i.population
                              }
                        }
                        if(!check){
                              return nextyearCountryPopTemp
                        }
                  }                  
            }

            for(let i =0; i<dataItem.length; i++){
                  console.log(dataItem.length,"and",dataItemYear.length)
                  let check = false
                  let popTemp = 0
                  for(let j = 0; j<dataItemYear.length; j++){
                        popTemp = dataItemYear[j].population
                        if(dataItem[i].country_name === dataItemYear[j].country_name){
                              dataItem[i].population = dataItemYear[j].population
                              dataItem[i].nextPopulation = getNextyearCountryPop(dataItemYear[j].country_name,j)
                              dataItem[i].region = dataItemYear[j].region
                              dataItem[i].years = dataItemYear[j].years
                              dataItem[i].flag = dataItemYear[j].flag
                              dataItem[i].width = dataItemYear[j].width
                              dataItem[i].rank = j
                              check = true                              
                              break
                        }
                  }
                  if(!check){
                        dataItem[i].population = "0"
                        dataItem[i].nextPopulation = popTemp
                        dataItem[i].region = "0"
                        dataItem[i].years = "0"
                        dataItem[i].flag = "0"
                        dataItem[i].width = "0"
                        dataItem[i].rank = dataItemYear.length
                  }
            }
            return dataItem
      }

      useEffect(()=>{
            setChartData(()=>[...getChartData(currentYear)])
            setNextYearPop(()=>getNextyearPop(currentYear))
      },[data,currentYear])

      const numberWithCommas=(x)=> {
            x = x.toString();
            var pattern = /(-?\d+)(\d{3})/;
            while (pattern.test(x))
                x = x.replace(pattern, "$1,$2");
            return x;
        }

        
  useEffect(() => {
      let interval;
      
      if (play) {
        interval = setInterval(() => {
            setCurrentYear((currentYear) => (parseInt(currentYear) + 1).toString());
        }, 500);
      } else {
        clearInterval(interval);
      }
  
      return () => {
        clearInterval(interval);
      };
    }, [play]);

    const selectYear=(e)=>{
      setCurrentYear(e.target.value);
      setPlay(false);
    }

    const getNextyearPop=(year)=>{
      let nextYearPopTemp = 0
      for(const item of data.data){
            if(parseInt(year)+1 === parseInt(item.years)){
                  return item.population
            }
      }
      return nextYearPopTemp
    }

      useEffect(()=>{
            if(currentYear>=2021){
                  setPlay(false)
            }
            setPopulation(()=>{
                  for(const item of data.data){
                        if(item.years === currentYear){
                              return item.population
                        }
                  }})
      },[currentYear])

      const playClick =()=>{
            if(currentYear<2021){
                  if(play){
                        setCurrentYear((currentYear) => (parseInt(currentYear) + 1).toString());
                  }
                  setPlay(!play)
            }else{
                  setPlay(false)
            }    
      }

      function TotalNumber () {
            const {number} = useSpring({
                  from:{number:parseInt(population)},
                  number:parseInt(nextYearPop)
            })
            return <animated.span>{number.to((n)=>numberWithCommas(n.toFixed(0)))}</animated.span>
      }
      function Number ({n}) {
            const {number} = useSpring({
                  from:{number:parseInt(chartData[n].population)},
                  number:parseInt(chartData[n].nextPopulation)
            })
            return <animated.span>{number.to((n)=>numberWithCommas(n.toFixed(0)))}</animated.span>
      }

  return (
    <div className="chart-container">
      <div className="title">            
            <p>Select year</p>
            <form>
                  <select onChange={selectYear}>
                        {allYear.map((item,index)=>{
                              return <option key={index} value={item}>{item}</option>
                        })}
                        
                  </select>
            </form>
      </div>      
      <div className="region-container">
            <p className="region-item">Region</p>
            {
                  region.map((item,index)=>{
                        return <div key={index} className="region-item">
                              <div className={`region-color ${item}`}></div>
                              <p>{item}</p>
                        </div>
                  })
            }
      </div>     
      <div className="chart">
            <div className="current-year">
                  <h1>{currentYear}</h1>
                  {play? <p>Total: <TotalNumber/></p> 
                  :<p>Total: {population? numberWithCommas(population):0}</p>}
            </div>
            <div className="chart-area">
      {chartContainer.map((item)=>{
                  return <div key={item} className={`rank-container rank-${chartData[item].rank}`}>
                        <div className="horizontal-bar"
                        style={{transform: `translateY(${chartData[item].rank*30}px)`}}
                        >
                              <div className="country-container">
                                    <p>{chartData[item].country_name} </p>
                              </div>
                              <div className="population-bar-container">
                                    <div className={`population-bar ${chartData[item].region}`}
                                    style={{width:chartData[item].width}}>
                                          <div className="coutry-flag">
                                                <img className="flag" src={chartData[item].flag} />
                                          </div>                                                                                    
                                    </div> 
                                    <div className="population">
                                          {!play? <p>{numberWithCommas(chartData[item].population)}</p>
                                          : <p><Number n={item}/></p>}
                                    </div>                                   
                              </div>    
                        </div>                        
                  </div>         
      })}
            </div>
      </div>
      <div className="scale-container"
      style={{transform: `translateY(${chartContainer.length>12? 12*30 : chartContainer.length*30}px)`}}>
            <div className="play-container">
                  {!play? 
                  <AiFillPlayCircle className="play" onClick={playClick}/>:
                  <AiFillPauseCircle className="play" onClick={playClick}/>}
            </div>
            <div className="horizontal-container">
                  <div className="slider-container"
                  style={{width:`${(100.0/(parseInt(allYear[allYear.length-1])-parseInt(allYear[0]))+100)}%`,
                  transform: `translateX(-${100.0/(parseInt(allYear[allYear.length-1])-parseInt(allYear[0]))}%)`}}>
                        <input type="range" min={allYear[0]} max={allYear[allYear.length-1]} value={currentYear} className="slider" 
                        onChange={selectYear}
                        style={{width:`100%`}}></input>                        
                  </div>
                  <div className="horizontal-line">
                        {allYear.map((item,index)=>{
                              if(parseInt(item)%5===0){
                                    return <div className="vertical-1" key={index}
                                          style={{width:`${100.0/(parseInt(allYear[allYear.length-1])-parseInt(allYear[0]))}%`}}>
                                          <div className="tick"></div>                                         
                                          <p className="year">{item}</p>                               
                                    </div> 
                              }else{
                                    return <div className="vertical-1" key={index}
                                          style={{width:`${100.0/(parseInt(allYear[allYear.length-1])-parseInt(allYear[0]))}%`}}>
                                          <div className="small-tick"></div>                               
                                    </div> 
                              }
                        })}                 
                  </div> 
            </div>            
      </div>      
    </div>
  )
}

export default ChartComponent