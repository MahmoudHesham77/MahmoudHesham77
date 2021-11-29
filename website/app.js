/* Global Variables */
const baseURL = `https://api.openweathermap.org/data/2.5/weather?zip=`;
const serverURL = 'http://localhost:3000';

const date = document.getElementById('date').value;
const temp = document.getElementById('temp').value;
const content = document.getElementById('content').value;


const catchError = (error)=> console.log("Soemthing went wrong", error);

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+1 +'.'+ d.getDate()+'.'+ d.getFullYear();

// Personal API Key for OpenWeatherMap API
const apiKey = '&appid=2b37d0234ed4e56f816be20b6623e77d&units=metric';

/* Generate  
* Event listener to call functions that get input data values using .then method call functions
* first getWebData to to fetch requested data from API (temp)
* then create object and post the data to the server 
* function updateUI to retreive the data from the server and update the UI
*/

// Event listener to add function to existing HTML DOM element
const Generate = document.getElementById('generate').addEventListener('click',()=>{
    const zipCode =document.getElementById('zip').value;
    const feelings = document.getElementById('feelings').value;

    getWebData(zipCode).then((temp)=>{
        return dealingWtihNode(temp, feelings);
    })
    .then(finalData =>{
        updateUI(finalData);
    })
    .catch(error=>{
        console.log(error);
    })
});

/* Function to GET Web API Data*/
const getWebData = async (zipCode)=>{
    const res = await fetch(baseURL+zipCode+apiKey)
    try {
        const data = await res.json();
        if (data.cod != 200){
            alert(data.message);
        }else{
            return data.main.temp;
        }
    } catch (error) {
        console.log("Error",error)
    }
};

const dealingWtihNode = async function (temp, feelings) {
    const respond = await fetch('/add', {
        method:'POST',
        credentials: 'same-origin',
        headers:{
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            date: newDate,
            temp: Math.round(temp),
            feelings: feelings
        })
    });
    try {
        const finalData = await respond.json();
        return finalData; 
    } catch (error) {
        console.log(error);
    }
};

const updateUI = async ()=>{
    const response = await fetch(serverURL+'/all');
    try {
        const finalData = await response.json();
        document.querySelector('#date').innerHTML= "Date: "+newDate;
        document.querySelector('#temp').innerHTML= "Temperature : " + finalData.temp+" C";
        document.querySelector('#content').innerHTML= "Feeling: "+finalData.feelings;
    } catch (error) {
        console.log(error);
    }
};
