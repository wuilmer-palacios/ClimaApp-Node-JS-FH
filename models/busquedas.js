const fs = require('fs');
const axios = require('axios');

class Busquedas {

    historial = [];
    dbPath = './db/database.json';

    constructor(){
        //TODO: leer DB si existe
        this.leerDB();
    }

    get paramsMapbox() {
        return {
            'access_token':process.env.MAPBOX_KEY,
            'limit':5,
            'language':'es'
        }
    }

    get paramsOpenWwather(){
        return{
            appid:process.env.OPENMWEATHER_KEY,
            units:'metric',
            lang:'es'
        }
    }

    get historialCapitalizado(){
        return this.historial.map( lugar => {
            let palabras = lugar.split(' ');
            palabras = palabras.map( p => {
                return p[0].toUpperCase() + p.substring(1)
            });

            return palabras.join(' ');
        })
    }

    async ciudad( lugar = ''){

        try {

            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params: this.paramsMapbox
            });
            
            const response = await instance.get();

            return response.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }));
            
        } catch (error) {
            return [];
        }
    }

    async climaLugar(lon, lat){

        try {
            
            // instancia de axios
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params:{ ...this.paramsOpenWwather, lon, lat}
            });

            const resp = await instance.get();
            // resp.data

            return {
                desc:resp.data.weather[0].description,
                min:resp.data.main.temp_min,
                max:resp.data.main.temp_max,
                temp:resp.data.main.temp
            }
        } catch (error) {
            console.log(error);
        }
    }

    agregarHistorial( lugar = '' ){

        if (this.historial.includes( lugar.toLocaleLowerCase())) {
            return;
        }

        this.historial = this.historial.splice(0,4);

        this.historial.unshift(lugar.toLocaleLowerCase());

        // Grabar en DB

        this.guardarDB()
    }

    guardarDB(){
        
        const payload = {
            historial: this.historial
        };

        fs.writeFileSync(this.dbPath, JSON.stringify( payload ));
    }

    leerDB(){
        // Debe de existir
        if(!fs.existsSync(this.dbPath)){
            return null
        }

        const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8'});
        const data = JSON.parse(info);

        this.historial = data.historial;

        console.log(this.historial);
    
    }
}

module.exports = Busquedas;