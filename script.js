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

// Datos de preguntas de demostración
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

// === AÑADE ESTA FUNCIÓN NUEVA ===
// Función para cargar noticias reales desde GNews API
async function loadRealNews() {
    // ⚠️ REEMPLAZA ESTA API KEY CON LA TUYA ⚠️
    const apiKey = 'cd358617b03acad6467b57dfe9cbdb81';
    const url = `https://gnews.io/api/v4/top-headlines?token=${apiKey}&lang=es&max=10`;
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        console.log('Noticias recibidas de GNews:', data); // Para debug
        
        if (data.articles && data.articles.length > 0) {
            return generateQuestionsFromArticles(data.articles);
        } else {
            throw new Error('No se encontraron noticias en la respuesta');
        }
    } catch (error) {
        console.error('Error cargando noticias reales:', error);
        // Lanzar el error para que sea manejado por loadQuestions()
        throw error;
    }
}

// Función para generar preguntas a partir de artículos reales
function generateQuestionsFromArticles(articles) {
    // Filtrar artículos que tengan título e imagen
    const validArticles = articles.filter(article => 
        article.title && article.image
    ).slice(0, 10);
    
    return validArticles.map((article, index) => {
        // Crear opciones incorrectas a partir de otros artículos
        const otherArticles = validArticles.filter((_, i) => i !== index);
        const incorrectOptions = [];
        
        for (let i = 0; i < 2 && i < otherArticles.length; i++) {
            // Acortar títulos muy largos para mejor visualización
            let title = otherArticles[i].title;
            if (title.length > 80) {
                title = title.substring(0, 77) + '...';
            }
            incorrectOptions.push(title);
        }
        
        // Completar con opciones genéricas si es necesario
        while (incorrectOptions.length < 2) {
            incorrectOptions.push("Noticia sobre eventos actuales importantes");
        }
        
        // Acortar título correcto si es muy largo
        let correctTitle = article.title;
        if (correctTitle.length > 80) {
            correctTitle = correctTitle.substring(0, 77) + '...';
        }
        
        // Mezclar opciones
        const options = [correctTitle, ...incorrectOptions];
        shuffleArray(options);
        
        const correctAnswerIndex = options.indexOf(correctTitle);
        
        return {
            question: "¿Cuál es el titular correcto para esta noticia?",
            image: article.image,
            options: options,
            correctAnswer: correctAnswerIndex,
            source: article.source?.name || "GNews"
        };
    });
}
// === FIN DE LAS FUNCIONES NUEVAS ===
// Event listeners
startBtn.addEventListener('click', startQuiz);
nextBtn.addEventListener('click', nextQuestion);
restartBtn.addEventListener('click', restartQuiz);
shareBtn.addEventListener('click', shareResults);
setupLink.addEventListener('click', showSetupGuide);

// Iniciar el quiz
function startQuiz() {
    startScreen.classList.remove('active');
    loadingScreen.classList.add('active');
    
    // Reiniciar variables
    currentQuestionIndex = 0;
    score = 0;
    selectedOption = null;
    
    // Simular carga de datos
    setTimeout(() => {
        loadQuestions();
        loadingScreen.classList.remove('active');
        quizScreen.classList.add('active');
        showQuestion();
    }, 1500);
}

// Cargar preguntas
// Cargar preguntas - VERSIÓN CON GNEWS API
async function loadQuestions() {
    try {
        // Intenta cargar noticias reales primero
        questions = await loadRealNews();
        
        // Si no hay suficientes noticias reales, completar con demo
        if (questions.length < 10) {
            const needed = 10 - questions.length;
            const additionalQuestions = demoQuestions.slice(0, needed);
            questions = [...questions, ...additionalQuestions];
        }
        
        // Mezclar preguntas para variedad
        shuffleArray(questions);
        
    } catch (error) {
        console.error('Error cargando noticias reales, usando demo:', error);
        // Fallback a datos de demostración
        questions = [...demoQuestions];
        shuffleArray(questions);
    }
}

// Función para mezclar array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Mostrar la pregunta actual
function showQuestion() {
    const question = questions[currentQuestionIndex];
    
    // Actualizar imagen
    questionImage.src = question.image;
    questionImage.alt = "Imagen relacionada con la pregunta";
    
    // Actualizar texto de la pregunta
    questionText.textContent = question.question;
    
    // Actualizar opciones
    optionsContainer.innerHTML = '';
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.textContent = option;
        optionElement.dataset.index = index;
        optionElement.addEventListener('click', selectOption);
        optionsContainer.appendChild(optionElement);
    });
    
    // Actualizar barra de progreso y número de pregunta
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
    // Si ya se seleccionó una opción, no hacer nada
    if (selectedOption !== null) return;
    
    // Quitar selección anterior
    const options = document.querySelectorAll('.option');
    options.forEach(option => option.classList.remove('selected'));
    
    // Marcar opción seleccionada
    e.target.classList.add('selected');
    selectedOption = parseInt(e.target.dataset.index);
    
    // Habilitar botón siguiente
    nextBtn.disabled = false;
}

// Pasar a la siguiente pregunta
function nextQuestion() {
    // Verificar respuesta
    const correctAnswer = questions[currentQuestionIndex].correctAnswer;
    const options = document.querySelectorAll('.option');
    
    // Marcar respuesta correcta e incorrecta
    options[correctAnswer].classList.add('correct');
    if (selectedOption !== correctAnswer) {
        options[selectedOption].classList.add('incorrect');
    } else {
        score++;
    }
    
    // Deshabilitar todas las opciones
    options.forEach(option => {
        option.style.pointerEvents = 'none';
    });
    
    // Avanzar a la siguiente pregunta después de un breve retraso
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
    
    // Mostrar puntuación
    scoreValue.textContent = score;
    scoreText.textContent = `${score} de ${questions.length} correctas`;
    
    // Mostrar mensaje según la puntuación
    if (score >= 9) {
        resultMessage.textContent = "¡Excelente! Estás muy informado sobre la actualidad. Tu conocimiento es impresionante.";
    } else if (score >= 7) {
        resultMessage.textContent = "Buen trabajo, estás bastante al día con las noticias. Sigue así.";
    } else if (score >= 5) {
        resultMessage.textContent = "No está mal, pero podrías estar más informado. ¡Sigue leyendo noticias!";
    } else {
        resultMessage.textContent = "Parece que deberías leer más noticias. ¡Es un buen momento para empezar!";
    }
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
    const shareText = `¡Acabo de completar el Quiz de Actualidad y obtuve ${score}/10! ¿Puedes superar mi puntuación?`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Quiz de Actualidad',
            text: shareText,
            url: window.location.href
        });
    } else {
        // Fallback para copiar al portapapeles
        navigator.clipboard.writeText(shareText).then(() => {
            alert('Resultado copiado al portapapeles. ¡Compártelo donde quieras!');
        });
    }
}

// Mostrar guía de configuración
function showSetupGuide(e) {
    e.preventDefault();
    alert(`Para configurar noticias reales:

1. Regístrate en NewsAPI (newsapi.org)
2. Obtén tu API Key gratuita
3. Crea un backend simple para hacer las peticiones
4. Modifica el código para conectar con tu API

Actualmente el quiz usa datos de demostración.`);
}

// Precargar imágenes para mejor experiencia
function preloadImages() {
    demoQuestions.forEach(question => {
        const img = new Image();
        img.src = question.image;
    });
}

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
    preloadImages();
});
