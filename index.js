require('dotenv').config ();
const { 
    leerInpup,
    inquirerMenu,
    pausa,
    listadoLugaresEncontrados
 } = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');

const main = async () => {
    
    const busqueda = new Busquedas();
    let opt;
    
    do {
        
        opt = await inquirerMenu();
        console.clear();
        
        switch (opt) {
            case 1:
                //Mostrar mensaje
                const lugar = await leerInpup('¿Que lugar buscas?');
                
                //Buscar Lugares
                const lugaresEncontrados = await busqueda.ciudad( lugar );
                
                //Seleccionar Lugar y mostrarlo
                const idSeleccionado = await listadoLugaresEncontrados( lugaresEncontrados );
                if (!idSeleccionado == 0) {
                    const LugarSeleccionado = lugaresEncontrados.find( l => l.id === idSeleccionado);
                    busqueda.agregarHistorial(LugarSeleccionado.nombre);
                    //Clima
                    const climaLugar = await busqueda.climaLugar(LugarSeleccionado.lng, LugarSeleccionado.lat);
                    //Mostrar resultados
                    console.clear();
                    console.log('\nInformacion de la ciudad\n'.green);
                    console.log('Ciudad: ', LugarSeleccionado.nombre);
                    console.log('Lat: ', LugarSeleccionado.lat);
                    console.log('Lng: ', LugarSeleccionado.lng);
                    console.log('Descripcion: ',climaLugar.desc);
                    console.log('Temperatura: ', climaLugar.temp);
                    console.log('Maxima: ', climaLugar.max);
                    console.log('Minima ', climaLugar.min);
                }
            break;
            
            case 2:
                console.clear();
                console.log(busqueda.historialCapitalizado);
                // busqueda.historialCapitalizado.forEach( (lugar, i) => {
                //     const idx = `${i + 1}`.green;

                //     console.log(`${idx}. ${lugar}`);
                // })
            break;
            
            case 0:
                console.log(`Opcion ${opt}`);        
            break;
        }

        await pausa();
        
    } while (opt !== 0);

}

main();