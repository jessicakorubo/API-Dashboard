let username = 'coalition';
let password = 'skills-test';

const headers = new Headers();
headers.set('Authorization', `Basic ${btoa(`${username}:${password}`)}`);

const apiUrl = 'https://fedskillstest.coalitiontechnologies.workers.dev';

fetch(apiUrl, { headers })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Process the retrieved data (filter for Jessica Taylor)
        const jessicaTaylor = data.find(patient => patient.name === 'Jessica Taylor');
        console.log('Jessica Taylor Data:', jessicaTaylor);
        displayDataDetails(jessicaTaylor);
    })
    .catch(error => {
        console.error('Error:', error);
    });

const getID = (id) => document.getElementById(id);

const profile_picture_tag = getID('patient_profile_picture');
const name_con = getID('patient_name');
const dob = getID('dob');
const gend = getID('gender');
const cont = getID('contact');
const eme_contact = getID('eme');
const insurance = getID('ins');
const resp = getID('resp');
const temp = getID('temp');
const heart_rate = getID('heart');
const tbody = getID('tbody');



const diastolic_array = [];
const systolic_array = [];
const seasons = [];
const heartrate = [];
const resp_rate = [];
const temperature = [];

function displayDataDetails(data) {
    const {
        name,
        profile_picture,
        date_of_birth,
        insurance_type,
        gender,
        phone_number,
        emergency_contact,
        diagnosis_history,
        diagnostic_list
    } = data;


    diagnosis(diagnosis_history);
    years(diagnosis_history);
    diagnostic_list_array(diagnostic_list);

    const aveheart = getAverage(heartrate);
    const averesp = getAverage(resp_rate);
    const avetemp = getAverage(temperature);


    profile_picture_tag.src = profile_picture;
    name_con.innerText = name;
    dob.innerText = newDate(date_of_birth);
    insurance.innerText = insurance_type;
    gend.innerText = gender;
    cont.innerText = phone_number;
    eme_contact.innerText = emergency_contact;
    heart_rate.innerText = aveheart + ' bpm';
    resp.innerText = averesp + ' bpm';
    temp.innerText = avetemp + '°F'

 

    // Create the chart after data is set
    const ctx = document.getElementById('myChart');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: seasons,
            datasets: [{
                label: 'Diastolic Blood Pressure',
                data: diastolic_array,
                borderWidth: 1
            },
            {
                label: 'Systolic Blood Pressure',
                data: systolic_array,
                borderWidth: 1
            }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}


function diagnosis(info) {
    info.forEach(element => {
        var diastolic = element.blood_pressure.diastolic.value;
        var systolic = element.blood_pressure.systolic.value;

        var heart = element.heart_rate.value;
        var respiratory_rate = element.respiratory_rate.value;
        var temperature_value = element.temperature.value;

        heartrate.push(heart);
        resp_rate.push(respiratory_rate);
        temperature.push(temperature_value);

        diastolic_array.push(diastolic);
        systolic_array.push(systolic);

        const heart_rate_level = getID('heart_level');
        const temp_level = getID('temp_level');
        const respiratory_level = getID('resp_level');


        function getHeartLevels() {
            if (heart === getAverage(heartrate) || heart === Math.round(getAverage(heartrate))) {
                var heartLevel = element.heart_rate.levels;
                console.log(heartLevel);
                heart_rate_level.innerText = heartLevel;
            }
            if (respiratory_rate === getAverage(resp_rate) || respiratory_rate === Math.round(getAverage(resp_rate))) {
                var resp_level = element.respiratory_rate.levels;
                console.log(resp_level)
                respiratory_level.innerText = resp_level;

            }
            if (temperature_value === getAverage(temperature) || temperature_value === Math.round(getAverage(temperature))) {
                var temperature_level = element.temperature.levels;
                console.log(temp_level);
                temp_level.innerText = temperature_level;
            }

        }
        getHeartLevels();

    });

    console.log(resp_rate);
}

function years(info) {
    info.forEach(element => {
        const season = `${element.month}, ${element.year}`;
        seasons.push(season);
    });
}



function getAverage(arrayHere) {
    // console.log
    var res = arrayHere.reduce((acc, num) => (acc + num)) / arrayHere.length;
    function result (res, decimalPlaces) {
        const factor = Math.pow(10, decimalPlaces);
        return Math.round(res * factor) / factor;
    }
    return result(res, 1);
}


function newDate(dateGiven) {
    const datey = String(dateGiven);
    const parts = datey.split('/');
    const month = parseInt(parts[0], 10);
    const date = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    console.log('d date is', String(datey));
    console.log(month, date, year);

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const newDate = `${months[month - 1]} ${date}, ${year}`;
    return newDate;
}


function diagnostic_list_array (diag_list){

    console.log(diag_list);

    diag_list.forEach(rowdata => {
        const row = document.createElement('tr');

        for (const key in rowdata) {
            if (rowdata.hasOwnProperty(key)) {
                const elerow = document.createElement('td');
                elerow.textContent = rowdata[key];
                row.appendChild(elerow);
            }
        }
        tbody.appendChild(row);
    });
}
