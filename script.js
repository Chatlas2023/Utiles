// =============================================
// QUIZ DE ACTUALIDAD - v3.0 - FALLBACK ROBUSTO
// Última actualización: 2024-01-15
// =============================================

// Variables globales
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedOption = null;

// Elementos del DOM
const startScreen = document.getElementById('start-screen');
const loadingScreen = document.getElementById('loading-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const shareBtn = document.getElementById('share-btn');
const questionImage = document.getElementById('question-image');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options');
const progressBar = document.getElementById('progress-bar');
const currentQuestionElement = document.getElementById('current-question');
const scoreValue = document.getElementById('score-value');
const scoreText = document.getElementById('score-text');
const resultMessage = document.getElementById('result-message');
const setupLink = document.getElementById('setup-link');

// Datos de preguntas de demostración MEJORADOS
const demoQuestions = [
    {
        question: "¿Qué país ganó la Copa del Mundo de Fútbol 2022?",
        image: "https://images.unsplash.com/photo-1593113630400-ea4288922497?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        options: ["Francia", "Argentina", "Brasil"],
        correctAnswer: 1
    },
    {
        question: "¿Qué empresa tecnológica lanzó el modelo de IA ChatGPT?",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        options: ["Google", "OpenAI", "Microsoft"],
        correctAnswer: 1
    },
    {
        question: "¿Qué país ingresó oficialmente a la OTAN en 2023?",
        image: "https://images.unsplash.com/photo-1511898634545-c01af8a54dd5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        options: ["Ucrania", "Finlandia", "Suecia"],
        correctAnswer: 1
    },
    {
        question: "¿Qué aplicación de redes sociales fue renombrada como 'X' en 2023?",
        image: "https://images.unsplash.com/photo-1611605698335-8b1569810432?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        options: ["Facebook", "Twitter", "Instagram"],
        correctAnswer: 1
    },
    {
        question: "¿Qué país lanzó con éxito la misión 'Chandrayaan-3' a la Luna?",
        image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        options: ["China", "India", "Japón"],
        correctAnswer: 1
    },
    {
        question: "¿Qué película ganó el Oscar a Mejor Película en 2023?",
        image: "https://images.unsplash.com/photo-1489599809505-f2fbe5d6c88c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        options: ["Everything Everywhere All at Once", "The Fabelmans", "Top Gun: Maverick"],
        correctAnswer: 0
    },
    {
        question: "¿Qué crisis global afectó significativamente la economía mundial en 2022-2023?",
        image: "https://images.unsplash.com/photo-1589652717521-10c0d092dea9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        options: ["Crisis del petróleo", "Inflación global", "Crisis de deuda"],
        correctAnswer: 1
    },
    {
        question: "¿Qué empresa desarrolló el modelo de inteligencia artificial 'GPT-4'?",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        options: ["Google", "OpenAI", "Meta"],
        correctAnswer: 1
    },
    {
        question: "¿Qué país organizó la Copa del Mundo de Fútbol 2022?",
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        options: ["Arabia Saudita", "Qatar", "Emiratos Árabes Unidos"],
        correctAnswer: 1
    },
    {
        question: "¿Qué tecnología experimentó un crecimiento masivo en popularidad durante 2023?",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        options: ["Realidad Virtual", "Inteligencia Artificial", "Blockchain"],
        correctAnswer: 1
    }
];

// === VERSIÓN SUPER SIMPLE - SIN API ===
async function loadRealNews() {
    console.log('🔄 v3.0 - Intentando cargar noticias...');
    
    // Simulamos un delay y siempre fallamos a demo
    // Esto evita los errores de CORS completamente
    await new Promise(resolve => setTimeout(resolve, 1000));
    throw new Error('Modo demo activado - Sin conexión a API');
}

// Event listeners
startBtn.addEventListener('click', startQuiz);
nextBtn.addEventListener('click', nextQuestion);
restartBtn.addEventListener('click', restartQuiz);
shareBtn.addEventListener('click', shareResults);
setupLink.addEventListener('click', showSetupGuide);

// Iniciar el quiz - VERSIÓN SIMPLIFICADA
function startQuiz() {
    console.log('🚀 v3.0 - Iniciando quiz...');
    startScreen.classList.remove('active');
    loadingScreen.classList.add('active');
    
    // Reiniciar variables
    currentQuestionIndex = 0;
    score = 0;
    selectedOption = null;
    
    // Carga inmediata sin esperar API
    setTimeout(() => {
        loadQuestions();
        loadingScreen.classList.remove('active');
        quizScreen.classList.add('active');
        showQuestion();
    }, 1000);
}

// Cargar preguntas - SIEMPRE USA DEMO
function loadQuestions() {
    console.log('📚 v3.0 - Cargando preguntas de demostración');
    questions = [...demoQuestions];
    shuffleArray(questions);
    console.log(`✅ v3.0 - ${questions.length} preguntas cargadas`);
}

// Función para mezclar array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Mostrar la pregunta actual - CON VALIDACIÓN ROBUSTA
function showQuestion() {
    // Validación EXTRA robusta
    if (!questions || !questions[currentQuestionIndex]) {
        console.error('❌ v3.0 - Error: Pregunta no encontrada');
        // Crear pregunta de emergencia
        questions = [...demoQuestions];
        currentQuestionIndex = 0;
    }
    
    const question = questions[currentQuestionIndex];
    
    console.log(`📄 v3.0 - Mostrando pregunta ${currentQuestionIndex + 1}`);
    
    // Validar y establecer imagen
    if (question.image && question.image.startsWith('http')) {
        questionImage.src = question.image;
    } else {
        questionImage.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuKKoiBJbWFnZW4gZGUgZGVtb3N0cmFjacOzbiDiiqI8L3RleHQ+PC9zdmc+';
    }
    
    questionImage.alt = "Imagen de la noticia";
    
    // Manejar errores de imagen
    questionImage.onerror = function() {
        console.log('🖼️ v3.0 - Error cargando imagen, usando placeholder');
        this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuKKoiBJbWFnZW4gZGUgZGVtb3N0cmFjacOzbiDiiqI8L3RleHQ+PC9zdmc+';
    };
    
    // Validar y establecer pregunta
    if (question.question) {
        questionText.textContent = question.question;
    } else {
        questionText.textContent = "¿Cuál es la respuesta correcta?";
    }
    
    // Validar y establecer opciones
    optionsContainer.innerHTML = '';
    if (question.options && question.options.length > 0) {
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.textContent = option || `Opción ${index + 1}`;
            optionElement.dataset.index = index;
            optionElement.addEventListener('click', selectOption);
            optionsContainer.appendChild(optionElement);
        });
    } else {
        // Opciones de emergencia
        const emergencyOptions = ["Opción A", "Opción B", "Opción C"];
        emergencyOptions.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.textContent = option;
            optionElement.dataset.index = index;
            optionElement.addEventListener('click', selectOption);
            optionsContainer.appendChild(optionElement);
        });
    }
    
    // Actualizar barra de progreso
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    progressBar.style.width = `${progress}%`;
    currentQuestionElement.textContent = currentQuestionIndex + 1;
    
    // Reiniciar estado
    selectedOption = null;
    nextBtn.disabled = true;
    nextBtn.textContent = currentQuestionIndex < questions.length - 1 ? "Siguiente" : "Ver resultados";
}

// Seleccionar una opción
function selectOption(e) {
    if (selectedOption !== null) return;
    
    const options = document.querySelectorAll('.option');
    options.forEach(option => option.classList.remove('selected'));
    
    e.target.classList.add('selected');
    selectedOption = parseInt(e.target.dataset.index);
    nextBtn.disabled = false;
}

// Pasar a la siguiente pregunta
function nextQuestion() {
    const correctAnswer = questions[currentQuestionIndex].correctAnswer;
    const options = document.querySelectorAll('.option');
    
    // Validar índice de respuesta correcta
    const validCorrectAnswer = (correctAnswer >= 0 && correctAnswer < options.length) ? correctAnswer : 0;
    
    options[validCorrectAnswer].classList.add('correct');
    if (selectedOption !== validCorrectAnswer) {
        options[selectedOption].classList.add('incorrect');
    } else {
        score++;
    }
    
    options.forEach(option => {
        option.style.pointerEvents = 'none';
    });
    
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            showResults();
        }
    }, 1500);
}

// Mostrar resultados
function showResults() {
    quizScreen.classList.remove('active');
    resultScreen.classList.add('active');
    
    scoreValue.textContent = score;
    scoreText.textContent = `${score} de ${questions.length} correctas`;
    
    if (score >= 9) {
        resultMessage.textContent = "¡Excelente! Estás muy informado sobre la actualidad.";
    } else if (score >= 7) {
        resultMessage.textContent = "Buen trabajo, estás bastante al día con las noticias.";
    } else if (score >= 5) {
        resultMessage.textContent = "No está mal, pero podrías estar más informado.";
    } else {
        resultMessage.textContent = "Parece que deberías leer más noticias.";
    }
    
    console.log(`🎯 v3.0 - Quiz completado. Puntuación: ${score}/${questions.length}`);
}

// Reiniciar el quiz
function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    selectedOption = null;
    resultScreen.classList.remove('active');
    startScreen.classList.add('active');
}

// Compartir resultados
function shareResults() {
    const shareText = `¡Acabo de completar el Quiz de Actualidad v3.0 y obtuve ${score}/10! ¿Puedes superar mi puntuación?`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Quiz de Actualidad v3.0',
            text: shareText,
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(shareText).then(() => {
            alert('Resultado copiado al portapapeles. ¡Compártelo donde quieras!');
        });
    }
}

// Mostrar guía de configuración
function showSetupGuide(e) {
    e.preventDefault();
    alert(`QUIZ DE ACTUALIDAD v3.0

📊 MODO ACTUAL: DEMOSTRACIÓN
✅ Funcionamiento garantizado
❌ Sin noticias reales (problemas de CORS)

Para noticias reales necesitas:
1. Un servidor backend propio
2. Configurar la API Key allí
3. Modificar el código

Actualmente funciona perfectamente con datos de demostración.`);
}

// Precargar imágenes para mejor experiencia
function preloadImages() {
    demoQuestions.forEach(question => {
        if (question.image) {
            const img = new Image();
            img.src = question.image;
        }
    });
}

// Mostrar información de versión
function showVersionInfo() {
    const versionInfo = document.getElementById('version-info');
    if (versionInfo) {
        versionInfo.textContent = `Versión: 3.0 | Modo: Demostración | Estable`;
    }
    console.log('🔍 QUIZ DE ACTUALIDAD - v3.0 - MODO DEMOSTRACIÓN');
    console.log('📅 Última actualización: 2024-01-15');
    console.log('✅ ESTADO: Funcionamiento garantizado');
    console.log('🌐 URL:', window.location.href);
}

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
    preloadImages();
    showVersionInfo();
});
