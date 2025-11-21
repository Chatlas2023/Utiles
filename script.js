// =============================================
// QUIZ DE ACTUALIDAD - v4.2 - ERRORES CORREGIDOS
// Última actualización: 2024-01-15
// =============================================

// Variables globales
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedOption = null;

// Elementos del DOM - CON VALIDACIÓN
let startScreen, loadingScreen, quizScreen, resultScreen;
let startBtn, nextBtn, restartBtn, shareBtn;
let questionImage, questionText, optionsContainer;
let progressBar, currentQuestionElement, scoreValue, scoreText, resultMessage, setupLink;

// Función para inicializar elementos DOM con validación
function initializeDOMElements() {
    console.log('🔍 v4.2 - Inicializando elementos DOM...');
    
    // Pantallas
    startScreen = document.getElementById('start-screen');
    loadingScreen = document.getElementById('loading-screen');
    quizScreen = document.getElementById('quiz-screen');
    resultScreen = document.getElementById('result-screen');
    
    // Botones
    startBtn = document.getElementById('start-btn');
    nextBtn = document.getElementById('next-btn');
    restartBtn = document.getElementById('restart-btn');
    shareBtn = document.getElementById('share-btn');
    
    // Elementos de preguntas
    questionImage = document.getElementById('question-image');
    questionText = document.getElementById('question-text');
    optionsContainer = document.getElementById('options');
    
    // Elementos de progreso y resultados
    progressBar = document.getElementById('progress-bar');
    currentQuestionElement = document.getElementById('current-question');
    scoreValue = document.getElementById('score-value');
    scoreText = document.getElementById('score-text');
    resultMessage = document.getElementById('result-message');
    setupLink = document.getElementById('setup-link');
    
    // Validar elementos críticos
    const criticalElements = [
        { name: 'startScreen', element: startScreen },
        { name: 'loadingScreen', element: loadingScreen },
        { name: 'quizScreen', element: quizScreen },
        { name: 'resultScreen', element: resultScreen },
        { name: 'startBtn', element: startBtn },
        { name: 'nextBtn', element: nextBtn }
    ];
    
    let missingElements = [];
    criticalElements.forEach(item => {
        if (!item.element) {
            missingElements.push(item.name);
        }
    });
    
    if (missingElements.length > 0) {
        console.error('❌ v4.2 - Elementos faltantes:', missingElements);
        throw new Error(`Faltan elementos críticos: ${missingElements.join(', ')}`);
    }
    
    console.log('✅ v4.2 - Todos los elementos DOM inicializados correctamente');
}

// Función para configurar event listeners
function setupEventListeners() {
    console.log('🎯 v4.2 - Configurando event listeners...');
    
    // Solo agregar listeners si los elementos existen
    if (startBtn) {
        startBtn.addEventListener('click', startQuiz);
        console.log('✅ Listener agregado: startBtn');
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextQuestion);
        console.log('✅ Listener agregado: nextBtn');
    }
    
    if (restartBtn) {
        restartBtn.addEventListener('click', restartQuiz);
        console.log('✅ Listener agregado: restartBtn');
    }
    
    if (shareBtn) {
        shareBtn.addEventListener('click', shareResults);
        console.log('✅ Listener agregado: shareBtn');
    }
    
    if (setupLink) {
        setupLink.addEventListener('click', showSetupGuide);
        console.log('✅ Listener agregado: setupLink');
    }
    
    console.log('✅ v4.2 - Todos los event listeners configurados');
}

// Función principal para cargar noticias reales
async function loadRealNews() {
    const apiKey = 'cd358617b03acad6467b57dfe9cbdb81';
    
    console.log('🔄 v4.2 - Cargando noticias reales desde GNews...');
    
    try {
        // PROXY FUNCIONANDO - Sin requerimientos de autorización
        const proxyUrl = 'https://api.allorigins.win/raw?url=';
        const targetUrl = `https://gnews.io/api/v4/top-headlines?token=${apiKey}&lang=es&max=15`;
        
        console.log('🔗 URL completa:', proxyUrl + encodeURIComponent(targetUrl));
        
        const response = await fetch(proxyUrl + encodeURIComponent(targetUrl), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        });
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
        
        console.log('✅ v4.2 - Noticias recibidas correctamente');
        console.log('📊 Cantidad de artículos:', data.articles ? data.articles.length : 0);
        
        if (data.articles && data.articles.length > 0) {
            const generatedQuestions = generateQuestionsFromArticles(data.articles);
            console.log(`✅ v4.2 - Preguntas generadas: ${generatedQuestions.length}`);
            return generatedQuestions;
        } else {
            throw new Error('No se encontraron noticias en la respuesta de la API');
        }
    } catch (error) {
        console.error('❌ v4.2 - Error cargando noticias reales:', error);
        throw new Error('No se pudieron cargar noticias reales. Intenta más tarde.');
    }
}

// Generar preguntas a partir de artículos reales
function generateQuestionsFromArticles(articles) {
    console.log('📝 v4.2 - Procesando artículos reales...');
    
    // Filtrar artículos con título e imagen válidos
    const validArticles = articles.filter(article => {
        const hasValidImage = article.image && 
                             article.image.startsWith('http') &&
                             article.image !== 'https://placehold.co/600x400' && // Excluir placeholders
                             !article.image.includes('default');
        
        const hasValidTitle = article.title && 
                             article.title.length > 15 &&
                             !article.title.includes('undefined');
        
        if (hasValidImage && hasValidTitle) {
            console.log(`📰 Artículo válido: "${article.title.substring(0, 50)}..."`);
            return true;
        }
        return false;
    }).slice(0, 10);
    
    console.log(`✅ v4.2 - Artículos válidos encontrados: ${validArticles.length}`);
    
    if (validArticles.length < 3) {
        throw new Error(`Solo se encontraron ${validArticles.length} artículos válidos. Se necesitan al menos 3.`);
    }
    
    return validArticles.map((article, index) => {
        // Crear opciones incorrectas de otros artículos
        const otherArticles = validArticles.filter((_, i) => i !== index);
        const incorrectOptions = [];
        
        // Tomar 2 títulos de otros artículos como opciones incorrectas
        for (let i = 0; i < 2 && i < otherArticles.length; i++) {
            let wrongTitle = otherArticles[i].title;
            // Limpiar y acortar título
            wrongTitle = cleanTitle(wrongTitle);
            if (wrongTitle.length > 80) {
                wrongTitle = wrongTitle.substring(0, 77) + '...';
            }
            incorrectOptions.push(wrongTitle);
        }
        
        // Si no hay suficientes opciones incorrectas, crear genéricas
        while (incorrectOptions.length < 2) {
            incorrectOptions.push("Noticia sobre eventos internacionales recientes");
        }
        
        // Preparar título correcto
        let correctTitle = cleanTitle(article.title);
        if (correctTitle.length > 80) {
            correctTitle = correctTitle.substring(0, 77) + '...';
        }
        
        // Mezclar opciones
        const options = [correctTitle, ...incorrectOptions];
        shuffleArray(options);
        
        const correctAnswerIndex = options.indexOf(correctTitle);
        
        console.log(`❓ v4.2 - Pregunta ${index + 1}: "${correctTitle.substring(0, 50)}..."`);
        console.log(`🖼️ Imagen: ${article.image}`);
        
        return {
            question: "¿Cuál es el titular correcto para esta noticia?",
            image: article.image,
            options: options,
            correctAnswer: correctAnswerIndex,
            source: article.source?.name || "Medios Internacionales"
        };
    });
}

// Limpiar título de la noticia
function cleanTitle(title) {
    return title
        .replace(/\[.*?\]/g, '') // Remover [Fuente]
        .replace(/\(.*?\)/g, '') // Remover (Fuente)
        .replace(/ - .*$/, '')   // Remover " - Fuente" al final
        .replace(/\.$/, '')      // Remover punto final
        .trim();
}

// Función para mezclar array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Iniciar el quiz
async function startQuiz() {
    console.log('🚀 v4.2 - Iniciando quiz con noticias reales...');
    
    if (!startScreen || !loadingScreen || !quizScreen) {
        console.error('❌ v4.2 - Error: Pantallas no inicializadas');
        return;
    }
    
    startScreen.classList.remove('active');
    loadingScreen.classList.add('active');
    
    // Reiniciar variables
    currentQuestionIndex = 0;
    score = 0;
    selectedOption = null;
    
    try {
        await loadQuestions();
        loadingScreen.classList.remove('active');
        quizScreen.classList.add('active');
        showQuestion();
    } catch (error) {
        console.error('❌ v4.2 - Error crítico:', error);
        if (loadingScreen) loadingScreen.classList.remove('active');
        if (startScreen) startScreen.classList.add('active');
        alert('❌ No se pudieron cargar noticias reales en este momento. El servicio puede estar temporalmente no disponible. Intenta más tarde.');
    }
}

// Cargar preguntas - SOLO API REAL
async function loadQuestions() {
    console.log('📡 v4.2 - Conectando con API de noticias...');
    questions = await loadRealNews();
    
    if (questions.length === 0) {
        throw new Error('No se pudieron generar preguntas desde la API');
    }
    
    shuffleArray(questions);
    console.log(`✅ v4.2 - ${questions.length} preguntas reales cargadas exitosamente`);
}

// Mostrar la pregunta actual
function showQuestion() {
    if (!questions[currentQuestionIndex]) {
        console.error('❌ v4.2 - Error: No hay pregunta para mostrar');
        return;
    }
    
    const question = questions[currentQuestionIndex];
    
    console.log(`📄 v4.2 - Mostrando noticia real ${currentQuestionIndex + 1}`);
    
    // Validar y establecer elementos
    if (questionImage) {
        questionImage.src = question.image;
        questionImage.alt = "Imagen de la noticia real";
        questionImage.onerror = function() {
            console.log('🖼️ v4.2 - Imagen no disponible, mostrando placeholder');
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuKKoiBOb3RpY2lhIHJlYWwgY29uIGltYWdlbiDiiqI8L3RleHQ+PC9zdmc+';
        };
    }
    
    if (questionText) {
        questionText.textContent = question.question;
    }
    
    if (optionsContainer) {
        optionsContainer.innerHTML = '';
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.textContent = option;
            optionElement.dataset.index = index;
            optionElement.addEventListener('click', selectOption);
            optionsContainer.appendChild(optionElement);
        });
    }
    
    // Actualizar progreso
    if (progressBar) {
        const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
        progressBar.style.width = `${progress}%`;
    }
    
    if (currentQuestionElement) {
        currentQuestionElement.textContent = currentQuestionIndex + 1;
    }
    
    // Reiniciar estado
    selectedOption = null;
    if (nextBtn) {
        nextBtn.disabled = true;
        nextBtn.textContent = currentQuestionIndex < questions.length - 1 ? "Siguiente" : "Ver resultados";
    }
}

// Seleccionar una opción
function selectOption(e) {
    if (selectedOption !== null) return;
    
    const options = document.querySelectorAll('.option');
    options.forEach(option => option.classList.remove('selected'));
    
    e.target.classList.add('selected');
    selectedOption = parseInt(e.target.dataset.index);
    
    if (nextBtn) {
        nextBtn.disabled = false;
    }
}

// Pasar a la siguiente pregunta
function nextQuestion() {
    const correctAnswer = questions[currentQuestionIndex].correctAnswer;
    const options = document.querySelectorAll('.option');
    
    // Mostrar feedback visual
    options[correctAnswer].classList.add('correct');
    if (selectedOption !== correctAnswer) {
        options[selectedOption].classList.add('incorrect');
    } else {
        score++;
    }
    
    // Deshabilitar opciones
    options.forEach(option => {
        option.style.pointerEvents = 'none';
    });
    
    // Avanzar después de delay
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
    if (quizScreen) quizScreen.classList.remove('active');
    if (resultScreen) resultScreen.classList.add('active');
    
    if (scoreValue) scoreValue.textContent = score;
    if (scoreText) scoreText.textContent = `${score} de ${questions.length} correctas`;
    
    // Mensaje personalizado
    if (resultMessage) {
        if (score >= 8) {
            resultMessage.textContent = "¡Excelente! Estás muy informado sobre las noticias actuales.";
        } else if (score >= 5) {
            resultMessage.textContent = "Buen trabajo. Mantente leyendo noticias para mejorar.";
        } else {
            resultMessage.textContent = "Sigue informándote. Las noticias cambian rápidamente.";
        }
    }
    
    console.log(`🎯 v4.2 - Quiz completado con noticias reales. Puntuación: ${score}/${questions.length}`);
}

// Reiniciar el quiz
function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    selectedOption = null;
    if (resultScreen) resultScreen.classList.remove('active');
    if (startScreen) startScreen.classList.add('active');
}

// Compartir resultados
function shareResults() {
    const shareText = `¡Acabo de completar el Quiz de Actualidad con noticias reales y obtuve ${score}/10! ¿Puedes superar mi puntuación?`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Quiz de Actualidad - Noticias Reales',
            text: shareText,
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(shareText).then(() => {
            alert('Resultado copiado. ¡Compártelo!');
        });
    }
}

// Mostrar información de la API
function showSetupGuide(e) {
    if (e) e.preventDefault();
    alert(`QUIZ DE ACTUALIDAD v4.2

✅ MODO: NOTICIAS REALES
🌐 Fuente: GNews API
📊 Preguntas generadas automáticamente
🖼️ Imágenes reales de noticias

El quiz está funcionando con noticias actuales en tiempo real.`);
}

// Mostrar información de versión
function showVersionInfo() {
    const versionInfo = document.getElementById('version-info');
    if (versionInfo) {
        versionInfo.textContent = `Versión: 4.2 | Noticias Reales | API: GNews`;
    }
    console.log('🔍 QUIZ DE ACTUALIDAD - v4.2 - NOTICIAS REALES');
    console.log('📅 Última actualización: 2024-01-15');
    console.log('🌐 Fuente: GNews API');
    console.log('✅ MODO: Noticias reales en tiempo real');
    console.log('🚀 Script cargado correctamente');
}

// Inicializar aplicación
function initializeApp() {
    try {
        console.log('🚀 v4.2 - Inicializando aplicación...');
        initializeDOMElements();
        setupEventListeners();
        showVersionInfo();
        console.log('✅ v4.2 - Aplicación inicializada correctamente');
    } catch (error) {
        console.error('❌ v4.2 - Error inicializando aplicación:', error);
        alert('Error al cargar la aplicación. Verifica la consola para más detalles.');
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM cargado, iniciando aplicación...');
    initializeApp();
});
