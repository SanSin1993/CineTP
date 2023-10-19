var logo = document.getElementById("logo")

logo.addEventListener("click", () =>{
    window.location.href = "../index.html";
} )

let parametros = location.search;
//parametros = decodeURI(parametros);
parametros = parametros.substring(1,parametros.length);

const params = new URLSearchParams(parametros)
//pelicula = JSON.parse(parametros);
const peliculas = localStorage.getItem('peliculas')
const pelicula = JSON.parse(peliculas).find(element => element.id ==params.get('id'));


const main = document.querySelector('.mainContainer')

    const {adult, backdrop_path, genre_ids, id, original_language, original_title, overview, popularity, poster_path, release_date, title, video, vote_average, vote_count} = pelicula
    const IMG_PATH = 'https://image.tmdb.org/t/p/w1280'
    imagenPelicula = document.getElementById("imgPelicula");
    imagenPelicula.setAttribute('src',IMG_PATH + poster_path );
    imagenPelicula.setAttribute('alt',title);
    TitPelicula = document.getElementById("tituloPeli");
    TitPelicula.innerText = title;
    sinapsis = document.getElementById("sinapsis");
    sinapsis.innerText = overview;

    cmb = document.getElementById('combos')
    hs = document.getElementById("horarios");
    ds = document.getElementById("dias");
    dias = ["Lunes", "Miercoles", "Viernes", "Domingo"];
    act = false;
    for (let i=0;i<dias.length;i++){
        let dia = document.createElement('div')
        dia.classList.add('funcion')
        dia.classList.add('dia')
        dia.innerHTML = dias[i];
        
        dia.addEventListener("click", () =>{
            let diaActivo = ds.getElementsByClassName('dia activo');
            for(let i=0;i<diaActivo.length;i++){
                diaActivo.item(i).classList.remove('activo');
            }
            dia.classList.add('activo');
            hs.innerHTML = '';
            cmb.innerHTML= '';
            document.getElementById("btnComprar").classList.add('hidden');
            cargarHorarios();
        });

        ds.appendChild(dia);
    }

    function cargarHorarios(){
    horarios  = ["00:00", "05:00", "08:00", "10:00"];
    for (i=0;i<horarios.length;i++){
        let hora = document.createElement('div')
        hora.classList.add('funcion')
        hora.classList.add('horario')
        hora.innerHTML = horarios[i];
        
        hora.addEventListener("click", () =>{
            let horaActiva = hs.getElementsByClassName('horario activo');
            for(let i=0;i<horaActiva.length;i++){
                horaActiva.item(i).classList.remove('activo');
            }
            hora.classList.add('activo')
            cmb.innerHTML= ''
            cargarcombos();
        }); 
        hs.appendChild(hora);
        }
        console.log("desabilito porque si");
        
    }




function cargarcombos(){

    combos = [["Combo Pelicula: Black Panther 2", "1 Balde de Pochoclo + 1 Vaso con tapa + 2 Gaseosas","$ 3100","combo5.jpg"],[ "Combo Premium","1 Lata Rectangular con pochoclos + 2 Gaseosas", "$ 4200","combo4.jpg"],["Combo Pelicula: Shazam 2","1 Balde de Pochoclo + 1 Vaso con tapa + 2 Gaseosas","$ 3100","combo3.jpg"],["Combo Lata: Shazam 2","1 Lata de Coleccion con pochoclo + 2 Gaseosas","$ 4100","combo2.jpg"],["Combo Mundial","1 Vaso de Argentina +1 pochoclo mediano +1 Gaseosa","$ 2100","combo6.jpg"]]
    document.getElementById("btnComprar").classList.remove('hidden');
    let  carrusel = document.createElement('div');
        carrusel.classList.add('carrusel');
        cmb.appendChild(carrusel);

        let div3 = document.createElement('div');
        div3.classList.add('detalles');
        div3.id ="detalles";
        cmb.appendChild(div3);
        div3.innerHTML = '<h4 id="detCombo">Sin Combo</h4><p id="detParrafo"></p><p id="detPrecio">$ 0</p>'


    let span = document.createElement('span');
        span.classList.add('overimg');
        span.classList.add('pre');
        span.addEventListener("click", () => {cambioCombo('a')});
        carrusel.appendChild(span);
        span.innerText = '';

    let div2 = document.createElement('div');
        carrusel.appendChild(div2);
        carrImg = document.createElement('img');
        carrImg.id  = "detImg";
        carrImg.classList.add('carruselImg');
        carrImg.src = "../recourses/comboVoid.jpg";
        div2.appendChild(carrImg);
    let comboFocus = document.createElement('ul');
        comboFocus.classList.add('items');
        comboFocus.id = "selectInf" ;
        comboFocus.innerHTML = '<li id="li-0" class="focus"></li>';
        div2.appendChild(comboFocus);

        span = document.createElement('span');
        span.classList.add('overimg');
        span.classList.add('sig');
        span.addEventListener("click", () => {cambioCombo('s');});
        carrusel.appendChild(span);
        span.innerText = '';

    
        inferior = document.getElementById('selectInf');
        for (let i=0;i<combos.length;i++){
            let li = document.createElement('li');
            li.id = `li-${i+1}`;
            inferior.appendChild(li);
        }

        document.createElement('div');

}


function cambioCombo(paso){
    const tamanio = combos.length;
    let liFocus = document.getElementsByClassName('focus');
    let liId = liFocus.item(0).id;
    liId = liId.split('-' ,2);
    const liNumber = Number(liId[1]/*.replace('`','')*/);
    const liMoment = document.getElementById(`li-${liNumber}`)
    liMoment.classList.remove('focus');
    let next;
    if (paso == 'a'){
        if(liNumber == 0){
            next=tamanio;
        }else{
            next = liNumber-1;
        }
    }

    if (paso == 's'){
        if(liNumber == tamanio){
            next=0;
        }else{
            next = liNumber+1;
        }
    }

    const liNext =`li-${next}`;
    const lifind = document.getElementById(liNext);
    lifind.classList.add('focus');

if (next!=0){
    const comboNext= next-1
    let detCombo = document.getElementById("detCombo");
    let detParrafo = document.getElementById("detParrafo");
    let detPrecio = document.getElementById("detPrecio");
    let detImg = document.getElementById("detImg");
    detCombo.innerText = combos[comboNext][0];
    detParrafo.innerText = combos[comboNext][1];
    detPrecio.innerText = combos[comboNext][2];
    detImg.src = `../recourses/${combos[comboNext][3]}`;
    }

if (next == 0){
    let detCombo = document.getElementById("detCombo");
    let detParrafo = document.getElementById("detParrafo");
    let detPrecio = document.getElementById("detPrecio");
    let detImg = document.getElementById("detImg");
    detCombo.innerText = "Sin Combo";
    detParrafo.innerText = "";
    detPrecio.innerText = "$ 0";
    detImg.src = `../recourses/comboVoid.jpg`;
}

btnComprar.addEventListener('click', () => {pdfCompra()});

}

function pdfCompra(){
    let dia;
    let diaActivo = ds.getElementsByClassName('dia activo');
    for(let i=0;i<diaActivo.length;i++){
        dia = diaActivo.item(i).innerText;
    }
    let película = TitPelicula.innerText;
    let horario;
    let horaActiva = hs.getElementsByClassName('horario activo');
                for(let i=0;i<horaActiva.length;i++){
                    horario = horaActiva.item(i).innerText;
                }
    let tituloCombo = document.getElementById("detCombo").innerText;
    let detCombo = document.getElementById("detParrafo").innerText;
    let cantEntradas = document.getElementById("cantEntradas").innerText;
    
    let  doc = new jsPDF();
    doc.text(`                                              Cine Grupo 7
    
    Compra realizada para la funció n de ${película} en el ${dia} 
    en hora ${horario}.
    
    Detalle de elementos: 
    -	Entradas: ${cantEntradas}
    -	Combo: ${tituloCombo}
                    - ${detCombo}
    
    
    Gracias por su compra. ¡Lo esperamos!`
    , 10, 10);
    
    let pdfContent = doc.output('datauristring');
    var iframe = "<iframe width='100%' height='100%' src='" + pdfContent + "'></iframe>"
    var x = window.open();
    x.document.open();
    x.document.write(iframe);
    x.document.close();
}