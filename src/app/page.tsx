"use client"

import Image from "next/image";
import { useQuery } from "react-query";
import axios from "axios";
import { format, fromUnixTime, parseISO } from "date-fns";
import Navbar from "@/components/Navbar";
import Container from "@/components/Container"; 
import { convertKelvinToFahrenheit } from "@/utils/convertKelvinToFahrenheit";
import WeatherIcon from "@/components/WeatherIcon";
import { getDayOrNightIcon } from "@/utils/getDayOrNightIcon";
import WeatherDetails from "@/components/WeatherDetails";
import { metersToMiles } from "@/utils/metersToMiles";
import { convertWindSpeed } from "@/utils/convertWindSpeed";
import ForcastWeatherDetail from "@/components/ForcastWeatherDetail";
import { loadingCityAtom, placeAtom } from "./atom";
import { useAtom } from "jotai";
import { useEffect } from "react";


type WeatherData = {
  cod: string;
  message: number;
  cnt: number;
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      sea_level: number;
      grnd_level: number;
      humidity: number;
      temp_kf: number;
    };
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    clouds: {
      all: number;
    };
    wind: {
      speed: number;
      deg: number;
      gust: number;
    };
    visibility: number;
    pop: number;
    sys: {
      pod: string;
    };
    dt_txt: string;
  }>;
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
};


export default function Home() {

  const [place,setPlace] = useAtom(placeAtom)
  const [loadingCity,] = useAtom(loadingCityAtom) 

  const { isLoading, error, data, refetch } = useQuery<WeatherData>('repoData', async () =>
    {
      const {data} = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.
        NEXT_PUBLIC_WEATHER_KEY}&cnt=56`
      );
      return data
    }
  )

  useEffect(()=>{
    refetch()
  },[place,refetch])

  const firstData = data?.list[0]

  console.log("api data",data)

  
  

  

  const uniqueDates = [
    ...new Set(
      data?.list.map(
        (entry) => new Date(entry.dt*1000).toISOString().split("T")[0]
      )
    )
  ]

  const firstDateForEachDate = uniqueDates.map((date)=>{
    return data?.list.find((entry)=> {
      const entryDate = new Date(entry.dt *1000).toISOString().split("T")[0]
      const entryTime = new Date(entry.dt *1000).getHours()
      return entryDate === date && entryTime >=6;
    })
  })

  
  if (isLoading) return (
    <div className="flex items-center min-h-screen justify-center">
      <p className="animate-bounce">Loading...</p>
    </div>
  )


    var utcDate = data?.list[0].dt
    //var localDate = new Date(utcDate)
    //var date123 =localDate.toISOString()
  


  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen ">
      <Navbar location={data?.city.name} />
      <main className="px-3  max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4 ">
        {/*today data */}
        {loadingCity ? <SkeletonLoadingComponent/>:
        <>
          <section className="space-y-4">
            <div className="space-y-2">
              <h2 className="flex gap-1 text-2xl items-end ">

              <p> {getDate4(firstData?.dt!, data?.city.timezone!)} </p>
                {/** <p> {format(parseISO(firstData?.dt_txt ??''),"EEEE") } </p>
                <p> {getDate4(firstData?.dt,data?.city.timezone)} </p>

                <p className="text-lg"> {(getDate2(firstData?.dt))} </p>

                {/**<p className="text-lg"> ({format(parseISO(firstData?.dt_txt ??''),"MM.dd.yyyy") }) </p>*/}
              </h2>
              <Container className=" gap-10 px-6 items-center ">
                <div className=" flex flex-col px-4 ">
                  <span className="text-5xl">
                  {convertKelvinToFahrenheit(firstData?.main.temp ?? 0)}°
                  </span>
                  <p className="text-xs space-x-1 whitespace-nowarp ">
                    <span>Feels like</span>
                    <span>
                      {convertKelvinToFahrenheit(firstData?.main.feels_like ?? 0)}°
                    </span>
                  </p>
                  <p className="text-xs space-x-2">
                    <span>
                    {convertKelvinToFahrenheit(firstData?.main.temp_min ?? 0)}
                    °↓ {" "}
                    </span>
                    <span>
                    {convertKelvinToFahrenheit(firstData?.main.temp_max ?? 0)}
                    °↑ {" "}
                    </span>
                  </p>
                </div>
                {/*time and weather icon */}
                <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
                {data?.list.map((d,i)=>
                  <div   
                  key={i}
                  className="flex flex-col justify-between gap-2 items-center text-xs font-semibold"
                  > 
                    <p className="whitespace-nowrap">
                      {/**  {format(parseISO(d.dt_txt),'h:mm a')}*/}
                     

                     
                      {getLocalTimeOfSearchedCity(d.dt, data?.city.timezone)}

                      {/*{"-----"}
                     
                      {getDate4(d.dt, data?.city.timezone)}

                      {"-----"}

                      {getLocalTimeOfSearchedCity(d.dt, data?.city.timezone)}
                      {/** 
                      {firstData?.dt}
                      {" "}
                      {data?.list[0].dt}
                      {" "}
                      {data?.city.timezone}

                      {getDate(firstData?.dt, data?.city.timezone)}

                      {date123}

                      */}
                      






                      

                    </p>
                    {/*<WeatherIcon iconName={d.weather[0].icon}/>*/}
                    <WeatherIcon iconName={getDayOrNightIcon(d.weather[0].icon,d.dt_txt)}/>
                    <p>
                      {convertKelvinToFahrenheit(d.main.temp ?? 0)}°
                    </p>


                  </div>
                )}

                </div>
              </Container>
            </div>
            <div className="flex  gap-4">
              {/* left */ }
              <Container className="w-fit justify-center flex-col px-4 items-center">
              <p className="capitalize text-center">{firstData?.weather[0].description}</p>
              <WeatherIcon iconName={getDayOrNightIcon(firstData?.weather[0].icon ?? "",firstData?.dt_txt ?? "")}/>
              </Container>
              
              
              {/* right */ }
              <Container className="bg-yellow-300/80 px-6 gap-4 justify-between overflow-x-auto">
              <WeatherDetails 
              visibility={metersToMiles(firstData?.visibility ?? 10000)} 
              airPressure={`${firstData?.main.pressure} hPa` }
              humidity={`${firstData?.main.humidity}%`}
              sunrise={format(fromUnixTime(data?.city.sunrise ?? 1709045676),"H:mm")}
              sunset={format(fromUnixTime(data?.city.sunset ?? 1709084998),"H:mm")}
              windSpeed={convertWindSpeed(firstData?.wind.speed ?? 5)}
              />
            
              </Container>
            </div>
          </section>  

          {/*7 data forcast */}
          <section className="flex w-full flex-col gap-4">
            <p className="text-2xl">Forcast (7 days)</p>
            {firstDateForEachDate.map((d,i)=> (
            <ForcastWeatherDetail 
            key={i}
            description={d?.weather[0].description ?? ""}
            weatherIcon={d?.weather[0].icon ?? "01d"}
            date={format(parseISO(d?.dt_txt ?? ""),"MM.dd")}
            day={format(parseISO(d?.dt_txt ?? ""),"EEEE")}
            feels_like={d?.main.feels_like ?? 0}
            temp={d?.main.temp ?? 0}
            temp_max={d?.main.temp_max ?? 0}
            temp_min={d?.main.temp_min ?? 0}
            airPressure={`${d?.main.pressure} hPa `}
            humidity={`${d?.main.humidity}% `}
            sunrise={format(fromUnixTime(data?.city.sunrise ?? 1709045676),"H:mm")}
            sunset={format(fromUnixTime(data?.city.sunset ?? 1709084998),"H:mm")}
            visibility={`${metersToMiles(d?.visibility ?? 10000)}`}
            windSpeed={`${convertWindSpeed(d?.wind.speed ?? 5)}`}
            />
            ))}
          </section>
        </>}
      </main>
    </div>
  );
}
function getDate4(dt: number, timezone: number):string  {
  const utc_seconds = dt + timezone;
  const utc_milliseconds = utc_seconds * 1000;
  const local_date = new Date(utc_milliseconds).toUTCString();
  // const local_date = new Date(utc_milliseconds)
  // console.log(local_date.toString)
  // const localhour = local_date.getUTCHours
  // const localminute = local_date.getUTCMinutes
  // const localtime = ""+localhour+":"+localminute
  return local_date.substring(0,16);
}

function getLocalTimeOfSearchedCity(dt: number, timezone: number):string {
const utc_seconds = dt + timezone;
 //const utc_seconds = parseInt(dt, 10);
  const utc_milliseconds = utc_seconds * 1000;
  const local_date = new Date(utc_milliseconds).toLocaleTimeString('en-US',
  {timeZone:'UTC',hour12:true,hour:'numeric',minute:'numeric'}
);
  return local_date;
}   

// function WeatherSkeleton(){
//   return (
//     <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4 ">
//       {/* Skeleton loading for today data */}
//       <section className="space-y-4">
//         <div className="space-y-2">
//           <h2 className="flex gap-1 text-2xl items-end animate-pulse">
//             <p className="skeleton-loading__header"></p>
//             <p className="skeleton-loading__header"></p>
//           </h2>
//           <div className="gap-10 px-6 items-center animate-pulse">
//             <div className="flex flex-col px-4 ">
//               <span className="text-5xl skeleton-loading__content"></span>
//               <p className="text-xs space-x-1 whitespace-nowarp ">
//                 <span className="skeleton-loading__content"></span>
//                 <span className="skeleton-loading__content"></span>
//               </p>
//               <p className="text-xs space-x-2">
//                 <span className="skeleton-loading__content"></span>
//                 <span className="skeleton-loading__content"></span>
//               </p>
//             </div>
//             <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
//               {/* Placeholder for time and weather icons */}
//               <div className="flex flex-col justify-between gap-2 items-center text-xs font-semibold animate-pulse">
//                 <p className="skeleton-loading__content"></p>
//                 <div className="skeleton-loading__content"></div>
//                 <p className="skeleton-loading__content"></p>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="flex gap-4">
//           {/* Placeholder for left section */}
//           <div className="w-fit justify-center flex-col px-4 items-center animate-pulse">
//             <p className="skeleton-loading__content"></p>
//             <div className="skeleton-loading__content"></div>
//           </div>
//           {/* Placeholder for right section */}
//           <div className="bg-yellow-300/80 px-6 gap-4 justify-between overflow-x-auto animate-pulse">
//             <div className="skeleton-loading__content"></div>
//           </div>
//         </div>
//       </section>
//       {/* Skeleton loading for 7-day forecast */}
//       <section className="flex w-full flex-col gap-4">
//         <p className="text-2xl animate-pulse">Forcast (7 days)</p>
//         {/* Placeholder for each forecast item */}
//         {[...Array(7)].map((_, i) => (
//           <div key={i} className="skeleton-loading__content"></div>
//         ))}
//       </section>  
//     </main>
//   );
// };

const SkeletonLoadingComponent: React.FC = () => {
  return (
    <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4 ">
      {/* Skeleton loading for today data */}
      <section className="space-y-4">
      <p className="skeleton-loading__header w-24 h-8 bg-gray-200"></p>
        <div className="skeleton-loading__content w-full h-36 bg-gray-200">
          <h2 className="flex gap-1 text-2xl items-end animate-pulse">
            <p className="skeleton-loading__header w-24 h-8 bg-gray-200"></p>
            <p className="skeleton-loading__header w-24 h-8 bg-gray-200"></p>
          </h2>
          <div className="gap-10 px-6 items-center ">
            <div className="flex flex-col px-4 ">
              <span className="text-5xl skeleton-loading__content w-36 h-16 bg-gray-200"></span>
              <p className="text-xs space-x-1 whitespace-nowarp ">
                <span className="skeleton-loading__content w-24 h-4 bg-gray-200"></span>
                <span className="skeleton-loading__content w-24 h-4 bg-gray-200"></span>
              </p>
              <p className="text-xs space-x-2">
                <span className="skeleton-loading__content w-24 h-4 bg-gray-200"></span>
                <span className="skeleton-loading__content w-24 h-4 bg-gray-200"></span>
              </p>
            </div>
            <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
              {/* Placeholder for time and weather icons */}
              <div className="flex flex-col justify-between gap-2 items-center text-xs font-semibold">
                <p className="skeleton-loading__content w-24 h-4 bg-gray-200"></p>
                <div className="skeleton-loading__content w-12 h-12 bg-gray-200 rounded-full"></div>
                <p className="skeleton-loading__content w-24 h-4 bg-gray-200"></p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          {/* Placeholder for left section */}
          <div className="w-fit justify-center flex-col px-4 items-center">
            <p className="skeleton-loading__content w-24 h-4 bg-gray-200"></p>
            <div className="skeleton-loading__content w-12 h-12 bg-gray-200 rounded-full"></div>
          </div>
          {/* Placeholder for right section */}
          <div className="bg-yellow-300/80 px-6 gap-4 justify-between overflow-x-auto">
            <div className="skeleton-loading__content w-24 h-4 bg-gray-200"></div>
          </div>
        </div>
      </section>
      {/* Skeleton loading for 7-day forecast */}
      <section className="flex w-full flex-col gap-4">
      <p className="skeleton-loading__header w-24 h-8 bg-gray-200"></p>
        {/* Placeholder for each forecast item */}
        {[...Array(7)].map((_, i) => (
          <div key={i} className="skeleton-loading__content w-full h-36 bg-gray-200"></div>
        ))}
      </section>
    </main>
  );
};