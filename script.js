class APIManager { // gestor api
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }
    async getPosts() {
        try {
            const respuesta = await fetch(`${this.baseUrl}`);
            if (respuesta.ok) {
                const posts = await respuesta.json();
                return posts;
            } else {
                return [];
            }
        } catch (error) {
            console.log(error);
        }
    }
}

// nexo a api
const testAPIManager = new APIManager(
    "https://edgarsanchezo.github.io/api.wordleppy/"
);


//extracción de palabra de api
const processPosts = async () => {
    const posts = await testAPIManager.getPosts();
    if (posts.diccionario.length > 0) {
        posts.diccionario.forEach((post) => {
            palabras.push(post.texto.toUpperCase());
        });

        palabra =
        palabras[Math.floor(Math.random() * palabras.length)].toUpperCase(); // Palabra al azar
        
        console.log("hola1",palabra);
    }
};
processPosts();



const grillaDiv = document.getElementById("grilla");
const tecladoDiv = document.getElementById("teclado");

// colores a usar
const verde = "#77df3b";
const amarillo = "#f1ec2f";
const gris = "#d2d2c9";

// Convertir RGB a Hex
function convertRgbToHex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

    function hexCode(i) {
        return ("0" + parseInt(i).toString(16)).slice(-2);
    }
    return "#" + hexCode(rgb[1]) + hexCode(rgb[2]) + hexCode(rgb[3]);
}



// variables auxiliares
let intentos = 6; // Número máximo de intentos
let palabras = []; // vector palabras diccionario
let palabra = ""; // cadena palabra a adivianar
let filaActual = 0; // avance intentos
let columnaActual = 0; // avance letras de palabra
let palabraActual = ""; //cadena auxiliar - intento




// teclas teclado - vector/matriz
const filas = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"],
    ["enviar", "Z", "X", "C", "V", "B", "N", "M", "borrar"],
];

// crear grilla para intentos de adivinar

function armar_grilla() {
    // Crea 6 filas
    for (let i = 0; i < 6; i++) {
        let fila = document.createElement("div");
        fila.className = "fila"; // Asigna la clase 'fila'
        fila.setAttribute("fila-intento", i); // Atributo para la fila

        // Crea 5 cajas en cada fila
        for (let j = 0; j < 5; j++) {
            let caja = document.createElement("div");
            caja.className = "caja"; // Asigna la clase 'caja'
            caja.setAttribute("caja-intento", j); // Atributo para la caja
            fila.appendChild(caja); // Agrega la caja a la fila
        }
        grillaDiv.appendChild(fila); // Agrega la fila al grilla
    }
    console.log("hola2-tablero");
}

armar_grilla(); // Llama a la función para crear el grilla

// armar teclado
function armarTeclado() {
    filas.forEach((fila) => {
        let filaDiv = document.createElement("div");
        filaDiv.className = "teclado-fila";

        fila.forEach((tecla) => {
            const button = document.createElement("button");
            if (tecla === "enviar" || tecla === "borrar") {
                button.className = "tecla-accion";
            } else {
                button.className = "tecla-letra";
            }
            button.textContent = tecla;
            button.value = tecla;

            // Asignar eventos de clic a cada tecla
            button.addEventListener("click", () => handleKeyClick(tecla));
            filaDiv.appendChild(button);
        });

        // Añadir la fila al contenedor principal
        tecladoDiv.appendChild(filaDiv);

    });
    console.log("hola3-teclado");
}
armarTeclado();

// ingreso por teclado en pantalla
function handleKeyClick(tecla) {
    if (filaActual >= intentos) return; // No permitir más intentos de los permitidos

    if (tecla === "borrar") {
        borrarLetra();
    } else if (tecla === "enviar") {
        enviarPalabra();
    } else if (columnaActual < 5) {
        agregarLetra(tecla);
    }
}

// insertar letras
function agregarLetra(letra) {
    const fila = document.querySelector(`[fila-intento='${filaActual}']`);
    const caja = fila.querySelector(`[caja-intento='${columnaActual}']`);
    caja.textContent = letra;
    palabraActual += letra;
    columnaActual++;
}


// Borrar la última letra ingresada
function borrarLetra() {
    if (columnaActual > 0) {
        columnaActual--;
        const fila = document.querySelector(`[fila-intento='${filaActual}']`);
        const caja = fila.querySelector(`[caja-intento='${columnaActual}']`);
        caja.textContent = "";
        palabraActual = palabraActual.slice(0, -1);
    }
}

// Verificar la palabra ingresada y colorear el tablero y teclado
function VerificarPalabra() {
    const intentoN = document.querySelector(`[fila-intento='${filaActual}']`);
    const vectorPalabra = palabra.split(""); // Convertir la palabra a un vector
    const cuentaLetra = {};

    for (let i = 0; i < 5; i++) {

        // Contar las apariciones de cada letra en la palabra objetivo
        vectorPalabra.forEach((letra) => {
            cuentaLetra[letra] = (cuentaLetra[letra] || 0) + 1;
        });

        const auxilar = Array(5).fill(gris);

        // Primera pasada: encontrar letras correctas en lugar correcto (verde)
        for (let i = 0; i < 5; i++) {
            if (palabraActual[i] === vectorPalabra[i]) {
                auxilar[i] = verde;
                cuentaLetra[palabraActual[i]]--;
            }
        }

        // Segunda pasada: letras correctas en posición incorrecta (amarillo)
        for (let i = 0; i < 5; i++) {
            if (auxilar[i] === gris && cuentaLetra[palabraActual[i]] > 0) {
                auxilar[i] = amarillo;
                cuentaLetra[palabraActual[i]]--;
            }
        }

        // Pintar el tablero y teclado
        for (let i = 0; i < 5; i++) {
            const caja = intentoN.querySelector(`[caja-intento='${i}']`);
            caja.style.backgroundColor = auxilar[i];
            TeclaColor(palabraActual[i], auxilar[i]);
        }
    }
}

// recibir palabra
function enviarPalabra() {
    if (columnaActual === 5) {

        VerificarPalabra();

        if (palabraActual.toUpperCase() === palabra) {
            alert(`¡Felicidades! La palabra es "${palabra}".`);
            ReiniciarJuego();
        } else {
            alert(`Intenta de nuevo.`);
            filaActual++;
            columnaActual = 0;
            palabraActual = "";

            if (filaActual >= intentos) {
                alert(
                    `No quedan más intentos. La palabra era "${palabra}".`
                );
                ReiniciarJuego();
            }
        }
    } else {
        alert("La palabra debe tener 5 letras.");
    }
}


// Cambiar el color de teclas teclado
function TeclaColor(letra, pintarColor) {
    const button = Array.from(document.querySelectorAll(".tecla-letra")).find(
        (btn) => btn.textContent === letra
    );

    if (button) {
        let colorActual = button.style.backgroundColor;
        if (colorActual !== "") {
            colorActual = convertRgbToHex(colorActual);
        }
        if (colorActual === verde) return; // mantener verdes ya asignados
        if (colorActual === amarillo && pintarColor === gris) return; // mantener amarillos si no cambiaron a verde
        button.style.backgroundColor = pintarColor;
    }
}


// Reiniciar el juego
function ReiniciarJuego() {
    filaActual = 0;
    columnaActual = 0;
    palabraActual = "";

    grillaDiv.innerHTML = "";
    armar_grilla();

    tecladoDiv.innerHTML = "";
    armarTeclado();
}
