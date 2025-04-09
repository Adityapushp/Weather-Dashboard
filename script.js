let cityInput = document.getElementById('city_input'),
    searchBtn = document.getElementById('searchBtn'),
    api_key = '9af8b0b31847b128ee034ed28ea3c307',
    currentWeatherCard = document.querySelectorAll('.weather-left .card')[0],
    fiveDaysForecastCard = document.querySelector('.day-forecast'),
    aqiCard = document.querySelectorAll('.highlights .card')[0],
    sunriseCard = document.querySelectorAll('.highlights .card')[1],
    humidityVal = document.getElementById('humidityVal'),
    pressureVal = document.getElementById('pressureVal'),
    visibilityVal = document.getElementById('visibilityVal'),
    windspeedVal = document.getElementById('windspeedVal'),
    hourlyForecastCard = document.querySelector('.hourly-forecast'),
    feelsVal = document.getElementById('feelsVal');

const aqiList = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];

function getWeatherDetails(name, lat, lon, country, state) {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`;
    const FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`;
    const AIR_POLLUTION_API_URL = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`;

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Fetch Air Quality Data
    fetch(AIR_POLLUTION_API_URL)
        .then(res => {
            if (!res.ok) throw new Error('Air quality data fetch failed');
            return res.json();
        })
        .then(data => {
            const { co, no, no2, o3, so2, pm2_5, pm10, nh3 } = data.list[0].components;
            const aqiIndex = data.list[0].main.aqi;

            aqiCard.innerHTML = `
                <div class="card-head">
                    <p>Air Quality Index</p>
                    <p class="air-index aqi-${aqiIndex}">${aqiList[aqiIndex - 1]}</p>
                </div>
                <div class="air-indices">
                    <i class='bx bx-wind'></i>
                    <div class="item"><p>PM2.5</p><h2>${pm2_5}</h2></div>
                    <div class="item"><p>PM10</p><h2>${pm10}</h2></div>
                    <div class="item"><p>SO2</p><h2>${so2}</h2></div>
                    <div class="item"><p>CO</p><h2>${co}</h2></div>
                    <div class="item"><p>NO</p><h2>${no}</h2></div>
                    <div class="item"><p>NO2</p><h2>${no2}</h2></div>
                    <div class="item"><p>NH3</p><h2>${nh3}</h2></div>
                    <div class="item"><p>O3</p><h2>${o3}</h2></div>
                </div>
            `;
        })
        .catch(err => {
            alert('Failed to fetch air quality data: ' + err.message);
        });

    // Fetch Current Weather
    fetch(WEATHER_API_URL)
        .then(res => {
            if (!res.ok) throw new Error('Current weather fetch failed');
            return res.json();
        })
        .then(data => {
            const date = new Date();
            const tempCelsius = (data.main.temp - 273.15).toFixed(2);
            currentWeatherCard.innerHTML = `
                <div class="current-weather">
                    <div class="details">
                        <p>Now</p>
                        <h2>${tempCelsius}&deg;C</h2>
                        <p>${data.weather[0].description}</p>
                    </div>
                    <div class="weather-icon">
                        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="">
                    </div>
                </div>
                <hr>
                <div class="card-footer">
                    <p><i class="bx bx-calendar"></i> ${days[date.getDay()]}, ${date.getDate()}, ${months[date.getMonth()]} ${date.getFullYear()}</p>
                    <p><i class="bx bx-current-location"></i> ${name}, ${country}</p>
                </div>
            `;

            // Sunrise & Sunset
            const { sunrise, sunset } = data.sys;
            const { timezone, visibility } = data;
            const { humidity, pressure, feels_like } = data.main;
            const { speed } = data.wind;
            const sRiseTime = moment.utc(sunrise, 'X').add(timezone, 'seconds').format('hh:mm A');
            const sSetTime = moment.utc(sunset, 'X').add(timezone, 'seconds').format('hh:mm A');

            sunriseCard.innerHTML = `
                <div class="card-head">
                    <p>Sunrise & Sunset</p>
                </div>
                <div class="item">
                    <div class="icon">
                        <i class="fa-light fa-sunrise fa-4x"></i>
                    </div>
                    <div>
                        <p>Sunrise</p>
                        <h2>${sRiseTime}</h2>
                    </div>
                </div>
                <div class="item">
                    <div class="icon">
                        <i class="fa-light fa-sunset fa-4x"></i>
                    </div>
                    <div>
                        <p>Sunset</p>
                        <h2>${sSetTime}</h2>
                    </div>
                </div>
            `;

            humidityVal.innerHTML = `${humidity}%`;
            pressureVal.innerHTML = `${pressure} hPa`;
            visibilityVal.innerHTML = `${(visibility / 1000).toFixed(2)} Km`; // Convert meters to kilometers
            windspeedVal.innerHTML = `${speed} m/s`;
            feelsVal.innerHTML = `${(feels_like - 273.15).toFixed(2)}&deg;C`;
        })
        .catch(err => {
            alert('Failed to fetch current weather: ' + err.message);
        });

    // Fetch 5-Day Forecast
    fetch(FORECAST_API_URL)
        .then(res => {
            let hourlyForecast = data.list;
            hourlyForecastCard.innerHTML = '';
            for (i = 0; i <= 7; i++) {
                let hrForecastDate = new Date(forecast.dt_txt);
                let hr = hrForecastDate.getHours
            }
            if (!res.ok) throw new Error('Weather forecast fetch failed');
            return res.json();
        })
        .then(data => {
            let uniqueForecastDays = [];
            let fiveDaysForecast = data.list.filter(forecast => {
                let forecastDate = new Date(forecast.dt_txt).getDate();
                if (!uniqueForecastDays.includes(forecastDate)) {
                    uniqueForecastDays.push(forecastDate);
                    return true;
                }
                return false;
            });

            fiveDaysForecastCard.innerHTML = '';
            for (let i = 1; i < fiveDaysForecast.length && i < 6; i++) {
                let date = new Date(fiveDaysForecast[i].dt_txt);
                let tempForecast = (fiveDaysForecast[i].main.temp - 273.15).toFixed(2);
                fiveDaysForecastCard.innerHTML += `
                    <div class="forecast-item">
                        <div class="icon-wrapper">
                            <img src="https://openweathermap.org/img/wn/${fiveDaysForecast[i].weather[0].icon}.png" alt="">
                            <span>${tempForecast}&deg;C</span>
                        </div>
                        <p>${date.getDate()} ${months[date.getMonth()]}</p>
                        <p>${days[date.getDay()]}</p>
                    </div>
                `;
            }
        })
        .catch(err => {
            alert('Failed to fetch weather forecast: ' + err.message);
        });
}

function getCityCoordinates() {
    let cityName = cityInput.value.trim();
    cityInput.value = '';
    if (!cityName) return;

    const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}`;
    fetch(GEOCODING_API_URL)
        .then(res => {
            if (!res.ok) throw new Error('Coordinates fetch failed');
            return res.json();
        })
        .then(data => {
            if (!data.length) throw new Error('No data found for this city');
            let { name, lat, lon, country, state } = data[0];
            getWeatherDetails(name, lat, lon, country, state);
        })
        .catch(err => {
            alert(`Failed to fetch coordinates of ${cityName}: ` + err.message);
        });
}

searchBtn.addEventListener('click', getCityCoordinates);