

class Time{
    constructor(){
        this.time = new Date;
    }

    timeStr(){
        return `${String(this.time.getHours()).padStart(2, '0')}:${String(this.time.getMinutes()).padStart(2, '0')}`
    }

    dayStr(){
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return `${days[this.time.getDay()]}`
    }
}



const timeElement = document.querySelector('#time');

function setTime(){
    currentTime = new Time();
    timeElement.innerHTML = currentTime.timeStr();
}

const dayElement = document.querySelector('#day');

function setDay(){
    currentTime = new Time();
    dayElement.innerHTML = currentTime.dayStr();
}

window.setInterval(()=>{
    setTime();
    console.log('up')
}, 1000);

window.setInterval(()=>{
    setDay();
}, 1000);


const alarmContainer = document.querySelector('.side').children[1];
//Alarm Component

class Alarm{
    constructor(name, hour, minute){
        this.name = name;
        this.hour = hour;
        this.minute = minute;
    }

    renderElement(){
        const wrapper = document.createElement('div');
        wrapper.classList += "wrapper";
        wrapper.innerHTML = `
            <div class="title">
                ${this.name}
            </div>
            <div class="text">
                <div class="time">
                    <h4>${this.hour}:${this.minute}</h4>
                </div>
                <div class="btn">
                    <button class='delete'>
                        <i class="icon ri-delete-bin-2-line"></i>
                    </button>
                </div>
            </div>
        `;
        alarmContainer.append(wrapper);
    }

    __present__(){
        return [this.hour, this.minute, this.name]
    }
}

const alarms = []

const data = {
    "Alarms":[]
}

loadData(data["Alarms"]);

function nextAlarm(){
    if(alarms.length > 0){
        document.querySelector('#nextAlarm').innerHTML = alarms[0].name;
    }
    else{
        document.querySelector('#nextAlarm').innerHTML = '';
    }
}




//create new alarm
const submitBtn = document.querySelector('#submit');
//submit new alarm
submitBtn.addEventListener('click', ()=>{
    const alarmData = [
        document.querySelector('#hours').children[0].innerHTML + document.querySelector('#hours').children[1].innerHTML,
        document.querySelector('#minutes').children[0].innerHTML + document.querySelector('#minutes').children[1].innerHTML,
        document.querySelector('#name').value
    ];

    document.querySelector('#hours').children[0].innerHTML = '0';
    document.querySelector('#hours').children[1].innerHTML = '0';
    document.querySelector('#minutes').children[0].innerHTML= '0';
    document.querySelector('#minutes').children[1].innerHTML = '0';
    document.querySelector('#name').value = '';

    alarms.push(new Alarm(alarmData[2], alarmData[0], alarmData[1]));

    alarms.forEach(alarm =>{
        data["Alarms"].push(alarm.__present__());
    })

    loadData(data["Alarms"]);
});




//Render already existing alarms
function loadData(data){
    alarmContainer.innerHTML = '';
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    console.log(data);

    var raw = JSON.stringify({
        "Alarms": data
    });

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    fetch("http://127.0.0.1:5100/setAlarm", requestOptions)
    .then(response => response.text())
    .then((res)=>{
        const data = JSON.parse(res);
        const alarmsList = [];
        Object.keys(data).forEach(alarmName=>{
            console.log(alarmName);
            alarmsList.push(new Alarm(alarmName, data[alarmName].split(":")[0], data[alarmName].split(":")[1]))
        })
        alarmsList.forEach(alarm =>{
            alarm.renderElement();
        })

        nextAlarm();
    })
    .catch(error => console.log('error', error));
}




//Change number by scrolling functionality
const scrollNumber = document.querySelectorAll('.scroll-number');
console.log(parseInt(scrollNumber[0].innerHTML, 10));

scrollNumber.forEach(num => {
    num.addEventListener('wheel', (e)=>{
        e.preventDefault();

        if(e.deltaY < 0){
            if("two" == num.classList[1]){
                if(parseInt(num.innerHTML, 10) < 1 && parseInt(num.parentElement.children[1].innerHTML, 10) <= 9){
                    num.innerHTML = parseInt(num.innerHTML, 10) + 1;
                }

                else if(parseInt(num.innerHTML, 10) < 2 && parseInt(num.parentElement.children[1].innerHTML, 10) <= 3){
                    num.innerHTML = parseInt(num.innerHTML, 10) + 1;
                }
            }

            if("nine" == num.classList[1] && num.parentElement.classList[0] == "hours"){
                if(parseInt(num.innerHTML, 10) < 9 && parseInt(num.parentElement.children[0].innerHTML, 10) < 2){
                    num.innerHTML = parseInt(num.innerHTML, 10) + 1;
                }
                else if(parseInt(num.innerHTML, 10) < 3 && parseInt(num.parentElement.children[0].innerHTML, 10) == 2){
                    num.innerHTML = parseInt(num.innerHTML, 10) + 1;
                }
            }

            if("five" == num.classList[1]){
                if(parseInt(num.innerHTML, 10) < 5){
                    num.innerHTML = parseInt(num.innerHTML, 10) + 1;
                }
            }

            if(num.classList[1] == "nine" && num.parentElement.classList[0] == "minutes"){
                if(parseInt(num.innerHTML, 10) < 9){
                    num.innerHTML = parseInt(num.innerHTML, 10) + 1;
                }    
            }
        }

        else{
            if(parseInt(num.innerHTML, 10) > 0){
                num.innerHTML = parseInt(num.innerHTML, 10) - 1;
            }
        }
    })
});
