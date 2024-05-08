import { Divider,Stack} from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';

import Paryer from "./Paryer";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from 'axios';
import moment from "moment";
import { useEffect, useState } from "react";
import "moment/dist/locale/ar";

moment.locale('ar');
export default function MainContent(){
    // States
    const [nextPrayerIndex,setNextPrayerIndex]=useState(1);
    const [selectedCity,setSelectedCity]=useState({
        displayName:'مكة المكرمة',
        apiName:'Makkah al Mukarramah'
    });
    const [today,setToday]=useState("");
    const avaliableCities=[
            {displayName:'مكة المكرمة',apiName:'Makkah al Mukarramah'},
            {displayName:"المدينة المنورة",apiName:'Medina'},
            {displayName:'الرياض',apiName:'"Riyadh"'},
            {displayName:'الدمام',apiName:'Dammam'},
    ]   
    const prayersArray=[
        {key:'Fajr',displayName:"الفجر"},
        {key:'Dhuhr',displayName:"الظهر"},
        {key:'Asr',displayName:'العصر'},
        {key:'Sunset',displayName:'المغرب'},
        {key:'Isha',displayName:'العشاء'}
    ]
    const [timings,setTimings]=useState({
        Fajr:'',
        Dhuhr:'',
        Asr:'',
        Sunset:'',
        Isha:''
    });
    const [remainingTime,setRemainingTime]=useState('');
    const getTimings=async()=>{
        const response=await axios.get(`https://api.aladhan.com/v1/timingsByCity?country=SA&city=${selectedCity.apiName}`);
        setTimings(response.data.data.timings);
    }
    useEffect(()=>{
        getTimings();
        
        },[selectedCity.apiName]);
        useEffect(()=>{
            let interval= setInterval(()=>{
                setupCountDownTimer();
                
            },1000);
    
            const t=moment();
            
            setToday(t.format("Do MMMM YYYY | h:mm"))
            
            return()=>{
                clearInterval(interval);
            }
        },[timings])
        const setupCountDownTimer=()=>{
            const momentNow=moment();
            let prayerIndex=2;
            if(momentNow.isAfter(moment(timings['Fajr'],"hh:mm")) && momentNow.isBefore(moment(timings['Dhuhr'],"hh:mm"))){
                prayerIndex=1;
            }else if(momentNow.isAfter(moment(timings['Dhuhr'],"hh:mm")) && momentNow.isBefore(moment(timings['Asr'],"hh:mm"))){
                prayerIndex=2;
            }else if(momentNow.isAfter(moment(timings['Asr'],"hh:mm")) && momentNow.isBefore(moment(timings['Sunset'],"hh:mm"))){
                prayerIndex=3;
            }else if(momentNow.isAfter(moment(timings['Sunset'],"hh:mm")) && momentNow.isBefore(moment(timings['Isha'],"hh:mm"))){
                prayerIndex=4;
            }else{
                prayerIndex=0;
            }
            setNextPrayerIndex(prayerIndex);
            // After konwning the next paryer
            const nextPrayerObject=prayersArray[prayerIndex];
            const nextPrayerTime=timings[nextPrayerObject.key];
            const nextPrayerTimeMoment=moment(nextPrayerTime,"hh:mm");

            let remainingTime= moment(nextPrayerTime,"hh:mm").diff(momentNow);
            if(remainingTime < 0){
                const midnightDiff=moment("23:59:59","hh:mm:ss").diff(momentNow);
                const fjarToMidnightDiff=nextPrayerTimeMoment.diff("00:00:00","hh:mm:ss");
                
                const totalDiffernce=midnightDiff + fjarToMidnightDiff;
               remainingTime=totalDiffernce;
            }
            const durationRemainingTime=moment.duration(remainingTime);
            setRemainingTime(`  ${durationRemainingTime.seconds()}: ${durationRemainingTime.minutes()} :${(durationRemainingTime.hours())}`)
            
        }

        const handleCityChange = (event) => {
        const cityObject=avaliableCities.find((city)=>{
            return city.apiName==event.target.value;
        })
        setSelectedCity(cityObject);
        
      };

    return(
     <>
        {/* Top Row */}
        <Grid container>
            <Grid md={6} xs={12}>
                <div>
                    <h2>{today}</h2>
                    <h1>{selectedCity.displayName}</h1>
                </div>
            </Grid>
            <Grid md={6} xs={12}>
                <div>
                    <h2>متبقي حتي صلاة {prayersArray[nextPrayerIndex].displayName} </h2>
                    <h1>{remainingTime}</h1>
                </div>
            </Grid>
        </Grid>
        <Divider style={{borderColor:'#fff',opacity:'.1'}}/>
        
        {/* Prayers Cards */}
        <Stack  direction={{ sm: 'column', md: 'column',lg:'row' }}  spacing={{ sm: '4'}} justifyContent="space-around" style={{marginTop:'50px',display:'flex',justifyItems:'center',alignItems:'center',gap:'40px'}}>
            <Paryer name="الفجر" time={timings.Fajr} image="../../public/fajr-prayer.png"/>
            <Paryer name="الظهر" time={timings.Dhuhr} image="../../public/dhhr-prayer-mosque.png"/>
            <Paryer name="العصر" time={timings.Asr} image="../../public/asr-prayer-mosque.png"/>
            <Paryer name="المغرب" time={timings.Sunset} image="../../public/sunset-prayer-mosque.png"/>
            <Paryer name="العشاء" time={timings.Isha} image="../../public/night-prayer-mosque.png"/>            
        </Stack>
        {/* Select  */}
        <Stack direction="row" justifyContent="center" style={{marginTop:'40px',marginBottom:'20px'}}>
            <FormControl style={{width:'200px',color:"white"}}>
                <InputLabel id="demo-simple-select-autowidth-label"><span style={{color:'#fff'}}>المدينة</span></InputLabel>
                    <Select

                        labelId="demo-simple-select-autowidth-label"
                        id="demo-simple-select-autowidth"
                        //   value={age}
                        onChange={handleCityChange}
                        autoWidth
                        label="Age"
                    >
                        {avaliableCities.map((city)=>{
                            return(
                                <MenuItem key={city.apiName} value={city.apiName}>{city.displayName}</MenuItem>
                            )
                        })}
                    </Select>
            </FormControl>
        </Stack>
     </>
    )
}
