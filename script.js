//todas las citas
const quotes = [
    'Cuando hayas eliminado lo imposible, lo que quede, por improbable que sea, debe ser la verdad.',
    'No hay nada más engañoso que un hecho evidente.',
    'Debería saber a estas alturas que cuando un hecho parece oponerse a una larga serie de deducciones, invariablemente demuestra ser capaz de soportar alguna otra interpretación.',
    'Yo nunca hago excepciones. Una excepción contradice la regla.',
    'Lo que un hombre puede inventar otro puede descubrir.',
    'Nada aclara un caso tanto como explicárselo a otra persona.',
    'La educación nunca termina, Watson. Es una serie de lecciones, con la mayor para la última.',
];
//almacena la lista de palabras y el indice de la palabra que el jugador está escribiendo actualmente
let words = [];
let wordIndex = 0;
//la hora de inicio
let startTime = Date.now();
//elementos de la página
const quoteElement = document.getElementById('quote');
const messageElement = document.getElementById('message');
const typedValueElement = document.getElementById('typed-value');
const puntajes = document.getElementById('puntajes');
let puntos = '';

typedValueElement.disabled = true;

document.getElementById('start').addEventListener('click', () => {
    //obtener una cita
    const quoteIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[quoteIndex];
    //Poner la cita en un vector de palabras
    words = quote.split(' ');
    //restablecer el índice de palabras para ratrear
    wordIndex = 0;

    //Actualizaciones de la interfaz de usuario
    //Crea un vector de elementos span para que podamos establecer una clase
    const spanWords = words.map(function(word) { return `<span>${word} <span/>` });
    //Convertir en cadena y establecer como HTML interno en la visualización de comillas
    quoteElement.innerHTML = spanWords.join('');
    //Resalta la primera palabra
    quoteElement.childNodes[0].className = 'highlight';
    //Limpia cualquier mensaje anterior
    messageElement.innerHTML = '';

    //Configure el cuadro de texto
    //Borre el cuadro de texto
    typedValueElement.value = '';

    typedValueElement.disabled = false;

    //establece el foco
    typedValueElement.focus();
    //establecer el controlador de eventos

    //Iniciar el temporizador
    startTime = new Date().getTime();

    typedValueElement.addEventListener('input', () => {
        //Obtener la palabra actual
        const currentWord = words[wordIndex];
        //obtener el valor actual
        const typedValue = typedValueElement.value;

        if (typedValue === currentWord && wordIndex === words.length - 1) {

            //Mostrar éxito
            typedValueElement.value = '';
            const elapsedTime = new Date().getTime() - startTime;
            const message = `¡FELICIDADES! Terminaste en ${elapsedTime/1000} seconds.`;
            messageElement.innerText = message;

            //typedValueElement.blur();
            typedValueElement.disabled = true;
            alert(message);

            puntos = `${elapsedTime / 1000} ${puntos} `;
            if (storageDisponible) {
                localStorage.setItem('puntos', puntos);
            }
            cargaPuntaje();


            typedValueElement.removeEventListener();
        } else if (typedValue.endsWith(' ') && typedValue.trim() === currentWord) {
            //final de la palabra
            //borra el typedValueElement para la nueva palabra
            typedValueElement.value = '';
            //pasar a la siguiente palabra
            wordIndex++;
            //restablece el nombre de la clase para todos los elementos entre comillas
            for (const wordElement of quoteElement.childNodes) {
                wordElement.className = '';
            }
            //resaltar la nueva palabra
            quoteElement.childNodes[wordIndex].className = 'highlight';
        } else if (currentWord.startsWith(typedValue)) {
            //Actualmente correcto
            //Resalta la siguiente palabra
            typedValueElement.className = '';
        } else {
            //estado de error 
            typedValueElement.className = 'error';
        }
    });
});

function storageDisponible() {
    try {
        let x = '__storage_test__';
        localStorage.setItem(x, x);
        localStorage.removeItem(x);
        return true;
    } catch (ex) {
        alert(`Error al acceder a la memoria local: ${ex}.`);
        return false;
    }
}

if (storageDisponible()) {
    if (localStorage.length > 0) {
        puntos = localStorage.getItem('puntos');
        cargaPuntaje();
    }
}

function cargaPuntaje() {
    const vPuntos = puntos.split(' ');
    const carga = vPuntos.map(function(num) { return `<p> ${num} </p>` });
    puntajes.innerHTML = "<p>Puntajes:</p>" + carga.join('');
}