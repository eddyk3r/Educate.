class EducationalPlatform {
    constructor() {
        this.currentSubject = '';
        this.currentMode = '';
        this.currentSettings = {};
        this.flashcards = [];
        this.quizQuestions = [];
        this.currentFlashcardIndex = 0;
        this.currentQuizIndex = 0;
        this.quizScore = 0;
        this.selectedAnswer = null;
        
        this.initializeElements();
        this.setupEventListeners();
    }
    
    initializeElements() {
        // Sections
        this.subjectInput = document.getElementById('subjectInput');
        this.modeSelection = document.getElementById('modeSelection');
        this.settings = document.getElementById('settings');
        this.loadingSection = document.getElementById('loadingSection');
        this.flashcardsSection = document.getElementById('flashcardsSection');
        this.quizSection = document.getElementById('quizSection');
        this.resultsSection = document.getElementById('resultsSection');
        
        // Input elements
        this.subjectNameInput = document.getElementById('subjectName');
        this.subjectDescriptionInput = document.getElementById('subjectDescription');
        this.learningLevelSelect = document.getElementById('learningLevel');
        this.detailLevelSelect = document.getElementById('detailLevel');
        this.difficultySelect = document.getElementById('difficulty');
        this.numberOfItemsSelect = document.getElementById('numberOfItems');
        
        // Display elements
        this.displaySubject = document.getElementById('displaySubject');
        this.flashcardSubject = document.getElementById('flashcardSubject');
        this.quizSubject = document.getElementById('quizSubject');
        
        // Progress elements
        this.flashcardProgress = document.getElementById('flashcardProgress');
        this.flashcardProgressBar = document.getElementById('flashcardProgressBar');
        this.quizProgress = document.getElementById('quizProgress');
        this.quizProgressBar = document.getElementById('quizProgressBar');
        this.quizScore = document.getElementById('quizScore');
        this.totalQuestions = document.getElementById('totalQuestions');
        
        // Content elements
        this.flashcardQuestion = document.getElementById('flashcardQuestion');
        this.flashcardAnswer = document.getElementById('flashcardAnswer');
        this.quizQuestion = document.getElementById('quizQuestion');
        this.quizOptions = document.getElementById('quizOptions');
        
        // Results elements
        this.finalScore = document.getElementById('finalScore');
        this.scoreMessage = document.getElementById('scoreMessage');
    }
    
    setupEventListeners() {
        // Subject input
        document.getElementById('continueToMode').addEventListener('click', () => this.handleSubjectInput());
        
        // Mode selection
        document.querySelectorAll('.mode-card').forEach(card => {
            card.addEventListener('click', () => this.handleModeSelection(card.dataset.mode));
        });
        
        // Settings
        document.getElementById('startLearning').addEventListener('click', () => this.startLearning());
        document.getElementById('detailLevel').addEventListener('change', () => this.toggleDifficultyGroup());
        
        // Navigation
        document.getElementById('backToSubjectInput').addEventListener('click', () => this.showSection('subjectInput'));
        document.getElementById('backToModes').addEventListener('click', () => this.showSection('modeSelection'));
        document.getElementById('backToSettingsFromFlashcards').addEventListener('click', () => this.showSection('settings'));
        document.getElementById('backToSettingsFromQuiz').addEventListener('click', () => this.showSection('settings'));
        document.getElementById('backToSubjectFromResults').addEventListener('click', () => this.resetToSubjectInput());
        
        // Flashcards
        document.getElementById('showAnswer').addEventListener('click', () => this.showFlashcardAnswer());
        document.getElementById('nextFlashcard').addEventListener('click', () => this.nextFlashcard());
        
        // Quiz
        document.getElementById('submitAnswer').addEventListener('click', () => this.submitQuizAnswer());
        
        // Results
        document.getElementById('restartQuiz').addEventListener('click', () => this.restartQuiz());
        
        // Flashcard click to flip
        document.getElementById('flashcard').addEventListener('click', () => this.flipFlashcard());
    }
    
    handleSubjectInput() {
        const subjectName = this.subjectNameInput.value.trim();
        if (!subjectName) {
            alert('Te rog introdu numele subiectului!');
            return;
        }
        
        this.currentSubject = subjectName;
        this.displaySubject.textContent = subjectName;
        this.flashcardSubject.textContent = subjectName;
        this.quizSubject.textContent = subjectName;
        
        this.showSection('modeSelection');
    }
    
    handleModeSelection(mode) {
        this.currentMode = mode;
        this.toggleDifficultyGroup();
        this.showSection('settings');
    }
    
    toggleDifficultyGroup() {
        const difficultyGroup = document.getElementById('difficultyGroup');
        if (this.currentMode === 'quiz') {
            difficultyGroup.style.display = 'block';
        } else {
            difficultyGroup.style.display = 'none';
        }
    }
    
    async startLearning() {
        this.currentSettings = {
            detailLevel: this.detailLevelSelect.value,
            difficulty: this.difficultySelect.value,
            numberOfItems: parseInt(this.numberOfItemsSelect.value),
            learningLevel: this.learningLevelSelect.value,
            subjectDescription: this.subjectDescriptionInput.value
        };
        
        this.showSection('loadingSection');
        
        try {
            if (this.currentMode === 'flashcards') {
                await this.generateFlashcards();
                this.showSection('flashcardsSection');
                this.loadFlashcard(0);
            } else if (this.currentMode === 'quiz') {
                await this.generateQuiz();
                this.showSection('quizSection');
                this.loadQuizQuestion(0);
            }
        } catch (error) {
            console.error('Error generating content:', error);
            alert('A apărut o eroare la generarea conținutului. Te rog încearcă din nou.');
            this.showSection('settings');
        }
    }
    
    async generateFlashcards() {
        const numberOfCards = this.currentSettings.numberOfItems;
        this.flashcards = [];
        
        // Simulez generarea de flashcarduri pe baza subiectului
        for (let i = 0; i < numberOfCards; i++) {
            const card = await this.generateFlashcardContent(i);
            this.flashcards.push(card);
        }
    }
    
    async generateFlashcardContent(index) {
        const subject = this.currentSubject.toLowerCase();
        const detailLevel = this.currentSettings.detailLevel;
        const learningLevel = this.currentSettings.learningLevel;
        
        // Generare conținut dinamic pe baza subiectului
        let question, answer;
        
        // Detectează tipul de subiect și generează conținut relevant
        if (subject.includes('ecuații diferențiale') || subject.includes('diferential') || subject.includes('matematica') || subject.includes('calcul')) {
            question = this.generateMathQuestion(index, detailLevel);
            answer = this.generateMathAnswer(index, detailLevel);
        } else if (subject.includes('război mondial') || subject.includes('razboi mondial') || subject.includes('ww2') || subject.includes('istorie') || subject.includes('istoric') || subject.includes('al doilea')) {
            question = this.generateHistoryQuestion(index, detailLevel);
            answer = this.generateHistoryAnswer(index, detailLevel);
        } else if (subject.includes('fizica') || subject.includes('fizic')) {
            question = this.generatePhysicsQuestion(index, detailLevel);
            answer = this.generatePhysicsAnswer(index, detailLevel);
        } else if (subject.includes('chimie') || subject.includes('chimic')) {
            question = this.generateChemistryQuestion(index, detailLevel);
            answer = this.generateChemistryAnswer(index, detailLevel);
        } else if (subject.includes('biologie') || subject.includes('biologic')) {
            question = this.generateBiologyQuestion(index, detailLevel);
            answer = this.generateBiologyAnswer(index, detailLevel);
        } else if (subject.includes('literatura') || subject.includes('literar')) {
            question = this.generateLiteratureQuestion(index, detailLevel);
            answer = this.generateLiteratureAnswer(index, detailLevel);
        } else if (subject.includes('geografie') || subject.includes('geografic')) {
            question = this.generateGeographyQuestion(index, detailLevel);
            answer = this.generateGeographyAnswer(index, detailLevel);
        } else if (subject.includes('economie') || subject.includes('economic')) {
            question = this.generateEconomicsQuestion(index, detailLevel);
            answer = this.generateEconomicsAnswer(index, detailLevel);
        } else if (subject.includes('psihologie') || subject.includes('psihologic')) {
            question = this.generatePsychologyQuestion(index, detailLevel);
            answer = this.generatePsychologyAnswer(index, detailLevel);
        } else if (subject.includes('filosofie') || subject.includes('filosofic')) {
            question = this.generatePhilosophyQuestion(index, detailLevel);
            answer = this.generatePhilosophyAnswer(index, detailLevel);
        } else {
            // Pentru subiecte necunoscute, generează conținut generic inteligent
            question = this.generateGenericQuestion(subject, index, detailLevel);
            answer = this.generateGenericAnswer(subject, index, detailLevel);
        }
        
        return { question, answer };
    }
    
    // Funcții de generare conținut pentru diferite subiecte
    generateMathQuestion(index, detailLevel) {
        const questions = [
            {
                essential: "Ce este o ecuație diferențială?",
                detailed: "Definiți ecuația diferențială ordinară de ordinul întâi și dați exemple."
            },
            {
                essential: "Ce înseamnă 'ordinul' unei ecuații diferențiale?",
                detailed: "Explicați diferența dintre ecuații diferențiale liniare și neliniare cu exemple concrete."
            },
            {
                essential: "Ce este o soluție particulară?",
                detailed: "Demonstrați cum se determină soluția particulară pentru ecuația dy/dx = 2y cu condiția inițială y(0) = 3."
            },
            {
                essential: "Ce este o soluție generală?",
                detailed: "Explicați structura soluției generale pentru ecuații diferențiale liniare omogene de ordinul al doilea."
            },
            {
                essential: "Ce sunt condițiile inițiale?",
                detailed: "Analizați importanța condițiilor inițiale în rezolvarea problemelor Cauchy pentru ecuații diferențiale."
            }
        ];
        return questions[index % questions.length][detailLevel];
    }
    
    generateMathAnswer(index, detailLevel) {
        const answers = [
            {
                essential: "O ecuație care conține derivate ale unei funcții necunoscute.",
                detailed: "O ecuație de forma dy/dx = f(x,y) unde f este o funcție continuă pe un domeniu D din R². Exemplu: dy/dx = 2x + y."
            },
            {
                essential: "Cel mai mare ordin al derivatei care apare în ecuație.",
                detailed: "Ecuațiile liniare au forma aₙ(x)y⁽ⁿ⁾ + aₙ₋₁(x)y⁽ⁿ⁻¹⁾ + ... + a₁(x)y' + a₀(x)y = g(x), iar cele neliniare conțin produse sau puteri ale funcției necunoscute, precum (y')² sau y·y'."
            },
            {
                essential: "O soluție care satisface condițiile inițiale date.",
                detailed: "Pentru dy/dx = 2y, soluția generală este y = Ce^(2x). Cu y(0) = 3, obținem C = 3, deci soluția particulară este y = 3e^(2x)."
            },
            {
                essential: "Soluția care conține toate constantele arbitrare posibile.",
                detailed: "Pentru ay'' + by' + cy = 0, soluția generală este y = C₁y₁(x) + C₂y₂(x), unde y₁ și y₂ sunt soluții liniar independente."
            },
            {
                essential: "Valorile funcției și derivatelor la un punct specific.",
                detailed: "Condițiile inițiale permit determinarea constantelor din soluția generală, transformând-o într-o soluție unică pentru problema specifică."
            }
        ];
        return answers[index % answers.length][detailLevel];
    }
    
    generateHistoryQuestion(index, detailLevel) {
        const questions = [
            {
                essential: "Când a început al doilea război mondial?",
                detailed: "Analizați cauzele principale și contextul internațional care au dus la declanșarea celui de-al doilea război mondial."
            },
            {
                essential: "Care au fost puterile Axei?",
                detailed: "Explicați formarea și evoluția alianței dintre Germania, Italia și Japonia, precum și obiectivele lor teritoriale."
            },
            {
                essential: "Ce a fost Operațiunea Barbarossa?",
                detailed: "Analizați strategia și consecințele invaziei germane a URSS-ului din 1941, inclusiv erorile de planificare."
            },
            {
                essential: "Când a avut loc Ziua D?",
                detailed: "Descrieți Operațiunea Overlord și importanța debarcării din Normandia pentru victoria aliaților."
            },
            {
                essential: "Ce a fost Holocaustul?",
                detailed: "Analizați politica de genocid a regimului nazist și mecanismele de exterminare în masă a evreilor și altor grupuri."
            }
        ];
        return questions[index % questions.length][detailLevel];
    }
    
    generateHistoryAnswer(index, detailLevel) {
        const answers = [
            {
                essential: "1 septembrie 1939, când Germania a invadat Polonia.",
                detailed: "Cauzele includ: Tratatul de la Versailles, ascensiunea nazismului, politica de apăsare, criza economică din 1929, și expansiunea teritorială a Germaniei și Japoniei."
            },
            {
                essential: "Germania, Italia și Japonia.",
                detailed: "Axa s-a format prin Pactul de Oțel (1939) și Pactul Tripartit (1940), cu obiective comune de expansiune teritorială și dominare regională."
            },
            {
                essential: "Invazia germană a URSS-ului din 1941.",
                detailed: "Operațiunea Barbarossa a început pe 22 iunie 1941 cu 3 milioane de soldați. Erorile includ subestimarea capacității defensive sovietice și întârzierea începerii din cauza campaniei din Balcani."
            },
            {
                essential: "6 iunie 1944.",
                detailed: "Ziua D a marcat începutul eliberării Europei de Vest. Operațiunea Overlord a implicat 156.000 de soldați aliați și a deschis un al doilea front împotriva Germaniei."
            },
            {
                essential: "Genocidul evreilor și altor grupuri de către naziști.",
                detailed: "Holocaustul a fost sistemul organizat de exterminare care a ucis aproximativ 6 milioane de evrei și milioane de alte victime prin ghetouri, lagăre de concentrare și camere de gazare."
            }
        ];
        return answers[index % answers.length][detailLevel];
    }
    
    generatePhysicsQuestion(index, detailLevel) {
        const questions = [
            {
                essential: "Ce este forța?",
                detailed: "Explicați legile lui Newton și aplicațiile lor în mecanica clasică cu exemple concrete."
            },
            {
                essential: "Ce este energia cinetică?",
                detailed: "Derivați formula energiei cinetice și analizați conservarea energiei în sistemele fizice."
            },
            {
                essential: "Ce este legea lui Ohm?",
                detailed: "Explicați conducția electrică în metale și semiconductori, incluzând efectele temperaturii."
            },
            {
                essential: "Ce este principiul incertitudinii?",
                detailed: "Analizați principiul incertitudinii Heisenberg și implicațiile sale pentru mecanica cuantică."
            },
            {
                essential: "Ce este efectul fotoelectric?",
                detailed: "Explicați efectul fotoelectric și importanța sa în dezvoltarea teoriei cuantice a luminii."
            }
        ];
        return questions[index % questions.length][detailLevel];
    }
    
    generatePhysicsAnswer(index, detailLevel) {
        const answers = [
            {
                essential: "O mărime vectorială care produce accelerație.",
                detailed: "Prima lege: un corp în repaus rămâne în repaus dacă nu acționează forțe. A doua lege: F = ma. A treia lege: pentru fiecare acțiune există o reacțiune egală și opusă."
            },
            {
                essential: "Energia datorată mișcării unui corp.",
                detailed: "Ec = ½mv². Energia se conservă în sistemele izolate, transformându-se din cinetică în potențială și invers."
            },
            {
                essential: "Tensiunea este proporțională cu intensitatea curentului.",
                detailed: "U = R·I, unde R este rezistența. În metale, rezistența crește cu temperatura, în timp ce în semiconductori scade."
            },
            {
                essential: "Nu se pot măsura simultan poziția și impulsul cu precizie infinită.",
                detailed: "Δx·Δp ≥ ℏ/2. Acest principiu limitează precizia măsurătorilor în mecanica cuantică și demonstrează natura probabilistică a particulelor."
            },
            {
                essential: "Eliberarea electronilor prin absorbția fotonilor.",
                detailed: "Einstein a explicat că energia fotonului trebuie să depășească energia de legătură a electronului. Aceasta a confirmat natura corpusculară a luminii."
            }
        ];
        return answers[index % answers.length][detailLevel];
    }
    
    generateChemistryQuestion(index, detailLevel) {
        const questions = [
            {
                essential: "Ce este un atom?",
                detailed: "Descrieți structura atomică și explicați cum se formează legăturile chimice între atomi."
            },
            {
                essential: "Ce este tabelul periodic?",
                detailed: "Analizați organizarea elementelor în tabelul periodic și explicați tendințele periodice ale proprietăților."
            },
            {
                essential: "Ce este o reacție chimică?",
                detailed: "Explicați tipurile de reacții chimice și factorii care influențează viteza de reacție."
            },
            {
                essential: "Ce este pH-ul?",
                detailed: "Definiți pH-ul și explicați comportamentul soluțiilor acide, bazice și neutre."
            },
            {
                essential: "Ce sunt legăturile covalente?",
                detailed: "Explicați formarea legăturilor covalente și diferențele față de legăturile ionice."
            }
        ];
        return questions[index % questions.length][detailLevel];
    }
    
    generateChemistryAnswer(index, detailLevel) {
        const answers = [
            {
                essential: "Cea mai mică unitate de materie care păstrează proprietățile elementului.",
                detailed: "Atomul constă din nucleu (protoni și neutroni) și electroni în orbite. Legăturile se formează prin partajarea sau transferul de electroni."
            },
            {
                essential: "Clasificarea elementelor după numărul atomic crescător.",
                detailed: "Elementele sunt organizate în perioade (rânduri) și grupe (coloane). Proprietățile variază periodic: raza atomică scade de la stânga la dreapta, energia de ionizare crește."
            },
            {
                essential: "Transformarea substanțelor în alte substanțe noi.",
                detailed: "Tipuri: sinteză, descompunere, substituție, dublă substituție. Viteza depinde de temperatură, concentrație, catalizatori și suprafața de contact."
            },
            {
                essential: "Măsura acidității sau bazicității unei soluții.",
                detailed: "pH = -log[H⁺]. pH < 7 = acid, pH = 7 = neutru, pH > 7 = bazic. Scala pH variază de la 0 la 14."
            },
            {
                essential: "Legături formate prin partajarea perechilor de electroni.",
                detailed: "În legăturile covalente, atomii partajează electroni pentru a atinge configurația electronică stabilă. Sunt mai puternice decât legăturile ionice în compuși moleculari."
            }
        ];
        return answers[index % answers.length][detailLevel];
    }
    
    generateBiologyQuestion(index, detailLevel) {
        const questions = [
            {
                essential: "Ce este celula?",
                detailed: "Comparați structura și funcțiile celulelor procariote și eucariote."
            },
            {
                essential: "Ce este ADN-ul?",
                detailed: "Explicați structura ADN-ului și procesul de replicare cu enzimele implicate."
            },
            {
                essential: "Ce este fotosinteza?",
                detailed: "Descrieți procesul fotosintezei în plante și importanța sa pentru viața pe Pământ."
            },
            {
                essential: "Ce este evoluția?",
                detailed: "Explicați mecanismele evoluției prin selecție naturală și evidențele care susțin teoria evoluției."
            },
            {
                essential: "Ce sunt enzimele?",
                detailed: "Descrieți structura și funcțiile enzimelor, incluzând factorii care influențează activitatea lor."
            }
        ];
        return questions[index % questions.length][detailLevel];
    }
    
    generateBiologyAnswer(index, detailLevel) {
        const answers = [
            {
                essential: "Unitatea fundamentală de viață.",
                detailed: "Celulele procariote nu au nucleu delimitat, în timp ce celulele eucariote au nucleu și organite specializate. Ambele au membrana celulară și citoplasmă."
            },
            {
                essential: "Acidul dezoxiribonucleic care conține informația genetică.",
                detailed: "ADN-ul este o dublă spirală formată din nucleotide (A-T, G-C). Replicarea implică ADN-polimeraza și se face semiconservativ."
            },
            {
                essential: "Procesul prin care plantele produc glucoză folosind lumina solară.",
                detailed: "6CO₂ + 6H₂O + energie luminoasă → C₆H₁₂O₆ + 6O₂. Are loc în cloroplaste și este esențial pentru producerea oxigenului atmosferic."
            },
            {
                essential: "Procesul de schimbare a caracteristicilor speciei în timp.",
                detailed: "Selecția naturală favorizează indivizii cu caracteristici avantajoase. Evidențele includ fosilele, anatomia comparată și genetica moleculară."
            },
            {
                essential: "Proteine care catalizează reacțiile biochimice.",
                detailed: "Enzimele reduc energia de activare necesară reacțiilor. Activitatea lor depinde de pH, temperatură și concentrația substratului."
            }
        ];
        return answers[index % answers.length][detailLevel];
    }
    
    generateLiteratureQuestion(index, detailLevel) {
        const questions = [
            {
                essential: "Ce este o metaforă?",
                detailed: "Analizați utilizarea figurilor de stil în literatura română și universală cu exemple din opere cunoscute."
            },
            {
                essential: "Ce este un roman?",
                detailed: "Explicați evoluția romanului de la formațiile timpurii la romanul modern și postmodern."
            },
            {
                essential: "Ce este poezia?",
                detailed: "Analizați elementele constitutive ale poeziei: ritm, rimă, imagini și simboluri."
            },
            {
                essential: "Ce este teatrul?",
                detailed: "Descrieți structura unei piese de teatru și analizați evoluția teatrului de la antichitate la contemporaneitate."
            },
            {
                essential: "Ce este critica literară?",
                detailed: "Explicați metodele și școlile de critică literară și rolul criticului în receptarea operelor literare."
            }
        ];
        return questions[index % questions.length][detailLevel];
    }
    
    generateLiteratureAnswer(index, detailLevel) {
        const answers = [
            {
                essential: "O figură de stil care compară două lucruri fără să folosească 'ca' sau 'ca și'.",
                detailed: "Metafora creează imagini vii prin asocierea neconvențională. Exemplu: 'inima de piatră' sugerează lipsa de sentimente prin asocierea cu duritatea pietrei."
            },
            {
                essential: "O operă narativă în proză, de obicei lungă, cu personaje și intrigă complexă.",
                detailed: "Romanul a evoluat de la epopeea medievală la romanul psihologic modern. Include elemente precum naratorul, punctul de vedere și structura temporală."
            },
            {
                essential: "O formă literară care folosește ritm, rimă și imagini pentru a exprima emoții și gânduri.",
                detailed: "Poezia se caracterizează prin condensarea expresiei, utilizarea simbolurilor și crearea unor efecte sonore prin ritm și rimă."
            },
            {
                essential: "O formă literară destinată reprezentării scenice cu personaje și dialog.",
                detailed: "Piesa de teatru include acte și scene, cu indicații scenice. Teatrul a evoluat de la tragedia greacă la teatrul experimental contemporan."
            },
            {
                essential: "Analiza și evaluarea operelor literare din perspective teoretice.",
                detailed: "Critica literară folosește metode diverse: formalistă, sociologică, psihanalitică. Criticul interpretează și contextualizează opera literară."
            }
        ];
        return answers[index % answers.length][detailLevel];
    }
    
    generateGeographyQuestion(index, detailLevel) {
        const questions = [
            {
                essential: "Ce este clima?",
                detailed: "Explicați factorii care influențează clima și analizați tipurile de climă de pe Pământ."
            },
            {
                essential: "Ce sunt munții?",
                detailed: "Descrieți formarea munților prin procese tectonice și analizați distribuția lor geografică."
            },
            {
                essential: "Ce sunt oceanele?",
                detailed: "Analizați distribuția oceanelor și mărilor și importanța lor pentru clima și viața de pe Pământ."
            },
            {
                essential: "Ce este populația?",
                detailed: "Explicați distribuția populației mondiale și factorii care influențează densitatea populației."
            },
            {
                essential: "Ce sunt resursele naturale?",
                detailed: "Clasificați resursele naturale și analizați impactul utilizării lor asupra mediului."
            }
        ];
        return questions[index % questions.length][detailLevel];
    }
    
    generateGeographyAnswer(index, detailLevel) {
        const answers = [
            {
                essential: "Condițiile meteorologice caracteristice unei regiuni pe o perioadă lungă.",
                detailed: "Factori: latitudine, altitudine, proximitatea oceanelor, circulația atmosferică. Tipuri: tropicală, temperată, polară, continentală."
            },
            {
                essential: "Forme de relief înalte, rezultatul proceselor tectonice.",
                detailed: "Munții se formează prin coliziunea plăcilor tectonice sau vulcanism. Distribuția: Cordilierele Americii, Himalaya, Alpii."
            },
            {
                essential: "Suprafețele mari de apă sărată care acoperă majoritatea Pământului.",
                detailed: "Oceanele: Pacific, Atlantic, Indian, Arctic. Influențează clima prin circulația oceanică și sunt sursa principală de precipitații."
            },
            {
                essential: "Totalitatea locuitorilor unei regiuni sau țări.",
                detailed: "Distribuția este neuniformă, concentrată în zone temperate și de coastă. Factori: clima, relief, resurse naturale, dezvoltare economică."
            },
            {
                essential: "Elemente din natură utilizate de om pentru satisfacerea nevoilor.",
                detailed: "Clasificare: regenerabile (apă, păduri) și neregenerabile (combustibili fosili). Utilizarea excesivă poate duce la epuizare și degradare."
            }
        ];
        return answers[index % answers.length][detailLevel];
    }
    
    generateEconomicsQuestion(index, detailLevel) {
        const questions = [
            {
                essential: "Ce este cererea?",
                detailed: "Explicați legea cererii și factorii care influențează cererea pentru un bun sau serviciu."
            },
            {
                essential: "Ce este oferta?",
                detailed: "Analizați legea ofertei și factorii care determină oferta în economia de piață."
            },
            {
                essential: "Ce este inflația?",
                detailed: "Explicați cauzele și consecințele inflației și măsurile de combatere a acesteia."
            },
            {
                essential: "Ce este PIB-ul?",
                detailed: "Definiți Produsul Intern Brut și explicați metodele de calcul și limitările acestuia."
            },
            {
                essential: "Ce este monopolul?",
                detailed: "Analizați tipurile de monopol și impactul lor asupra consumatorilor și economiei."
            }
        ];
        return questions[index % questions.length][detailLevel];
    }
    
    generateEconomicsAnswer(index, detailLevel) {
        const answers = [
            {
                essential: "Cantitatea dintr-un bun pe care consumatorii o doresc să o cumpere la un preț dat.",
                detailed: "Legea cererii: când prețul crește, cererea scade. Factori: prețul bunului, venitul, gusturile, prețurile bunurilor înlocuitoare."
            },
            {
                essential: "Cantitatea dintr-un bun pe care producătorii o doresc să o vândă la un preț dat.",
                detailed: "Legea ofertei: când prețul crește, oferta crește. Factori: prețul bunului, costurile de producție, tehnologia, numărul producătorilor."
            },
            {
                essential: "Creșterea generalizată și continuă a prețurilor într-o economie.",
                detailed: "Cauze: cererea excesivă, creșterea costurilor, expansiunea monetară. Consecințe: scăderea puterii de cumpărare, incertitudine economică."
            },
            {
                essential: "Valoarea totală a bunurilor și serviciilor produse într-o țară într-un an.",
                detailed: "Metode de calcul: producție, cheltuieli, venituri. Limitații: nu include activitățile din economia subterană și nu reflectă calitatea vieții."
            },
            {
                essential: "Situația în care o singură firmă controlează întreaga ofertă dintr-o piață.",
                detailed: "Tipuri: natural, legal, tehnologic. Impact: prețuri mai mari, producție mai mică, lipsă de inovație, dar poate permite economii de scară."
            }
        ];
        return answers[index % answers.length][detailLevel];
    }
    
    generatePsychologyQuestion(index, detailLevel) {
        const questions = [
            {
                essential: "Ce este psihologia?",
                detailed: "Explicați ramurile principale ale psihologiei și metodele de cercetare utilizate."
            },
            {
                essential: "Ce este comportamentul?",
                detailed: "Analizați factorii care influențează comportamentul uman: biologici, psihologici și sociali."
            },
            {
                essential: "Ce este memoria?",
                detailed: "Descrieți procesele de memorare și tipurile de memorie în psihologia cognitivă."
            },
            {
                essential: "Ce este personalitatea?",
                detailed: "Explicați teoriile principale ale personalității și factorii care o influențează."
            },
            {
                essential: "Ce este dezvoltarea?",
                detailed: "Analizați etapele dezvoltării umane de la naștere la maturitate."
            }
        ];
        return questions[index % questions.length][detailLevel];
    }
    
    generatePsychologyAnswer(index, detailLevel) {
        const answers = [
            {
                essential: "Știința care studiază comportamentul și procesele mentale.",
                detailed: "Ramura: cognitivă, comportamentală, psihanalitică, umanistă. Metode: observație, experiment, studiu de caz, chestionare."
            },
            {
                essential: "Activitățile observabile ale unei persoane.",
                detailed: "Factori biologici: genetica, neurochimia. Psihologici: gânduri, emoții. Sociali: influența grupului, cultura, mediul social."
            },
            {
                essential: "Capacitatea de a stoca și recupera informații.",
                detailed: "Procese: codificare, stocare, recuperare. Tipuri: memorie de lucru, memorie pe termen lung, memorie procedurală și declarativă."
            },
            {
                essential: "Setul de trăsături stabile care caracterizează o persoană.",
                detailed: "Teorii: psihanalitică (Freud), trăsături (Big Five), cognitivă. Factori: ereditate, mediu, experiențe de viață."
            },
            {
                essential: "Procesul de schimbare și maturare de-a lungul vieții.",
                detailed: "Etape: copilărie (0-12), adolescență (13-19), tinerețe (20-40), maturitate (40-65), vârstă înaintată (65+). Fiecare etapă are caracteristici specifice."
            }
        ];
        return answers[index % answers.length][detailLevel];
    }
    
    generatePhilosophyQuestion(index, detailLevel) {
        const questions = [
            {
                essential: "Ce este filozofia?",
                detailed: "Explicați ramurile principale ale filozofiei și întrebările fundamentale pe care le abordează."
            },
            {
                essential: "Ce este adevărul?",
                detailed: "Analizați teoriile adevărului în filozofia analitică și continentală."
            },
            {
                essential: "Ce este etica?",
                detailed: "Explicați teoriile etice principale: deontologie, utilitarism și etica virtuții."
            },
            {
                essential: "Ce este existența?",
                detailed: "Analizați întrebarea existenței în filozofia existențialistă și fenomenologie."
            },
            {
                essential: "Ce este cunoașterea?",
                detailed: "Explicați epistemologia și teoriile cunoașterii: empirism, raționalism și criticism."
            }
        ];
        return questions[index % questions.length][detailLevel];
    }
    
    generatePhilosophyAnswer(index, detailLevel) {
        const answers = [
            {
                essential: "Căutarea înțelegerii fundamentale a existenței și a cunoașterii.",
                detailed: "Ramura: metafizică (natura realității), epistemologie (cunoaștere), etică (moralitate), estetică (frumusețe), logică (raționament)."
            },
            {
                essential: "Correspondența între afirmații și realitate.",
                detailed: "Teorii: corespondență (adevărul ca corespondență cu faptele), coerență (adevărul ca coerență logică), pragmatică (adevărul ca utilitate)."
            },
            {
                essential: "Studiul principiilor morale și ale comportamentului corect.",
                detailed: "Deontologie: acțiunile sunt corecte prin însăși natura lor. Utilitarism: acțiunile corecte maximizează fericirea. Etica virtuții: accent pe caracterul moral."
            },
            {
                essential: "Faptul de a fi, de a exista în realitate.",
                detailed: "Existențialismul: existența precede esența, omul este responsabil pentru propriul sens. Fenomenologia: studiul modului în care lucrurile apar în conștiință."
            },
            {
                essential: "Procesul de dobândire și validare a informațiilor despre realitate.",
                detailed: "Empirism: cunoașterea vine din experiență. Raționalism: cunoașterea vine din rațiune. Criticism: cunoașterea necesită atât experiență, cât și rațiune."
            }
        ];
        return answers[index % answers.length][detailLevel];
    }
    
    generateGenericQuestion(subject, index, detailLevel) {
        const concepts = [
            "conceptul fundamental",
            "principiul de bază", 
            "definiția esențială",
            "caracteristica principală",
            "elementul cheie"
        ];
        
        const questionTypes = [
            "Ce este",
            "Cum funcționează",
            "De ce este important",
            "Care sunt caracteristicile",
            "Cum se aplică"
        ];
        
        const concept = concepts[index % concepts.length];
        const questionType = questionTypes[index % questionTypes.length];
        
        if (detailLevel === 'essential') {
            return `${questionType} ${concept} din ${subject}?`;
        } else {
            return `${questionType} ${concept} din ${subject} și explicați importanța sa în contextul mai larg al domeniului?`;
        }
    }
    
    generateGenericAnswer(subject, index, detailLevel) {
        const answerTypes = [
            "definiția fundamentală",
            "explicația de bază",
            "caracteristicile principale",
            "aplicațiile practice",
            "importanța în domeniu"
        ];
        
        const answerType = answerTypes[index % answerTypes.length];
        
        if (detailLevel === 'essential') {
            return `${answerType} pentru ${subject} - informații cheie și concepte fundamentale necesare pentru înțelegerea de bază a subiectului.`;
        } else {
            return `${answerType} pentru ${subject} - explicație detaliată care include contexte istorice, exemple concrete, aplicații practice și conexiuni cu alte domenii de cunoaștere pentru o înțelegere comprehensivă.`;
        }
    }
    
    async generateQuiz() {
        const numberOfQuestions = this.currentSettings.numberOfItems;
        this.quizQuestions = [];
        
        for (let i = 0; i < numberOfQuestions; i++) {
            const question = await this.generateQuizQuestion(i);
            this.quizQuestions.push(question);
        }
    }
    
    async generateQuizQuestion(index) {
        const subject = this.currentSubject.toLowerCase();
        const difficulty = this.currentSettings.difficulty;
        
        let question, options, correctAnswer;
        
        // Detectează tipul de subiect și generează quiz relevant
        if (subject.includes('ecuații diferențiale') || subject.includes('diferential') || subject.includes('matematica') || subject.includes('calcul')) {
            const quizData = this.generateMathQuiz(index, difficulty);
            question = quizData.question;
            options = quizData.options;
            correctAnswer = quizData.correctAnswer;
        } else if (subject.includes('război mondial') || subject.includes('razboi mondial') || subject.includes('ww2') || subject.includes('istorie') || subject.includes('istoric') || subject.includes('al doilea')) {
            const quizData = this.generateHistoryQuiz(index, difficulty);
            question = quizData.question;
            options = quizData.options;
            correctAnswer = quizData.correctAnswer;
        } else if (subject.includes('fizica') || subject.includes('fizic')) {
            const quizData = this.generatePhysicsQuiz(index, difficulty);
            question = quizData.question;
            options = quizData.options;
            correctAnswer = quizData.correctAnswer;
        } else if (subject.includes('chimie') || subject.includes('chimic')) {
            const quizData = this.generateChemistryQuiz(index, difficulty);
            question = quizData.question;
            options = quizData.options;
            correctAnswer = quizData.correctAnswer;
        } else if (subject.includes('biologie') || subject.includes('biologic')) {
            const quizData = this.generateBiologyQuiz(index, difficulty);
            question = quizData.question;
            options = quizData.options;
            correctAnswer = quizData.correctAnswer;
        } else if (subject.includes('literatura') || subject.includes('literar')) {
            const quizData = this.generateLiteratureQuiz(index, difficulty);
            question = quizData.question;
            options = quizData.options;
            correctAnswer = quizData.correctAnswer;
        } else if (subject.includes('geografie') || subject.includes('geografic')) {
            const quizData = this.generateGeographyQuiz(index, difficulty);
            question = quizData.question;
            options = quizData.options;
            correctAnswer = quizData.correctAnswer;
        } else if (subject.includes('economie') || subject.includes('economic')) {
            const quizData = this.generateEconomicsQuiz(index, difficulty);
            question = quizData.question;
            options = quizData.options;
            correctAnswer = quizData.correctAnswer;
        } else if (subject.includes('psihologie') || subject.includes('psihologic')) {
            const quizData = this.generatePsychologyQuiz(index, difficulty);
            question = quizData.question;
            options = quizData.options;
            correctAnswer = quizData.correctAnswer;
        } else if (subject.includes('filosofie') || subject.includes('filosofic')) {
            const quizData = this.generatePhilosophyQuiz(index, difficulty);
            question = quizData.question;
            options = quizData.options;
            correctAnswer = quizData.correctAnswer;
        } else {
            // Pentru subiecte necunoscute, generează quiz generic inteligent
            const quizData = this.generateGenericQuiz(subject, index, difficulty);
            question = quizData.question;
            options = quizData.options;
            correctAnswer = quizData.correctAnswer;
        }
        
        return { question, options, correctAnswer };
    }
    
    // Funcții de generare quiz pentru diferite subiecte
    generateMathQuiz(index, difficulty) {
        const quizzes = [
            {
                easy: {
                    question: "Ce este o ecuație diferențială?",
                    options: [
                        "O ecuație cu variabile",
                        "O ecuație cu derivate",
                        "O ecuație cu integrale",
                        "O ecuație cu logaritmi"
                    ],
                    correctAnswer: 1
                },
                medium: {
                    question: "Care este ordinul ecuației d²y/dx² + 3dy/dx + 2y = 0?",
                    options: [
                        "Primul ordin",
                        "Al doilea ordin",
                        "Al treilea ordin",
                        "Al patrulea ordin"
                    ],
                    correctAnswer: 1
                },
                hard: {
                    question: "Care dintre următoarele este soluția generală a ecuației dy/dx = 2y?",
                    options: [
                        "y = Ce^(2x)",
                        "y = Ce^(x/2)",
                        "y = Ce^(-2x)",
                        "y = Ce^(x²)"
                    ],
                    correctAnswer: 0
                }
            },
            {
                easy: {
                    question: "Ce înseamnă 'ordinul' unei ecuații diferențiale?",
                    options: [
                        "Numărul de variabile",
                        "Cel mai mare ordin al derivatei",
                        "Numărul de soluții",
                        "Gradul polinomului"
                    ],
                    correctAnswer: 1
                },
                medium: {
                    question: "Ce tip de ecuație este dy/dx = x² + y?",
                    options: [
                        "Liniară omogenă",
                        "Liniară neomogenă",
                        "Neliniară",
                        "Separabilă"
                    ],
                    correctAnswer: 1
                },
                hard: {
                    question: "Pentru ecuația dy/dx = y², care este soluția cu y(0) = 1?",
                    options: [
                        "y = 1/(1-x)",
                        "y = 1/(1+x)",
                        "y = 1/(x-1)",
                        "y = 1/(x+1)"
                    ],
                    correctAnswer: 0
                }
            }
        ];
        
        const quiz = quizzes[index % quizzes.length];
        return quiz[difficulty];
    }
    
    generateHistoryQuiz(index, difficulty) {
        const quizzes = [
            {
                easy: {
                    question: "Când a început al doilea război mondial?",
                    options: [
                        "1938",
                        "1939",
                        "1940",
                        "1941"
                    ],
                    correctAnswer: 1
                },
                medium: {
                    question: "Care a fost prima țară invadată de Germania în 1939?",
                    options: [
                        "Franța",
                        "Polonia",
                        "Cehoslovacia",
                        "Austria"
                    ],
                    correctAnswer: 1
                },
                hard: {
                    question: "În ce an a fost semnat Pactul Ribbentrop-Molotov?",
                    options: [
                        "23 august 1939",
                        "1 septembrie 1939",
                        "3 septembrie 1939",
                        "17 septembrie 1939"
                    ],
                    correctAnswer: 0
                }
            },
            {
                easy: {
                    question: "Care au fost puterile Axei?",
                    options: [
                        "SUA, URSS, Marea Britanie",
                        "Germania, Italia, Japonia",
                        "Franța, Polonia, Cehoslovacia",
                        "Spania, Portugalia, Irlanda"
                    ],
                    correctAnswer: 1
                },
                medium: {
                    question: "Ce a fost Operațiunea Barbarossa?",
                    options: [
                        "Invazia Franței",
                        "Invazia URSS-ului",
                        "Invazia Poloniei",
                        "Invazia Norvegiei"
                    ],
                    correctAnswer: 1
                },
                hard: {
                    question: "Când a avut loc Operațiunea Barbarossa?",
                    options: [
                        "22 iunie 1941",
                        "1 septembrie 1939",
                        "10 mai 1940",
                        "7 decembrie 1941"
                    ],
                    correctAnswer: 0
                }
            },
            {
                easy: {
                    question: "Când a avut loc Ziua D?",
                    options: [
                        "6 iunie 1944",
                        "6 iulie 1944",
                        "6 august 1944",
                        "6 septembrie 1944"
                    ],
                    correctAnswer: 0
                },
                medium: {
                    question: "Ce a fost Holocaustul?",
                    options: [
                        "Invazia Poloniei",
                        "Genocidul evreilor",
                        "Bătălia de la Stalingrad",
                        "Bombardarea Londrei"
                    ],
                    correctAnswer: 1
                },
                hard: {
                    question: "Care a fost diferența dintre Holocaust și alte crime de război?",
                    options: [
                        "Holocaustul a fost sistematic și organizat",
                        "Holocaustul a fost doar în Germania",
                        "Holocaustul a fost doar împotriva evreilor",
                        "Holocaustul a fost doar în lagăre"
                    ],
                    correctAnswer: 0
                }
            },
            {
                easy: {
                    question: "Când s-a terminat al doilea război mondial în Europa?",
                    options: [
                        "7 mai 1945",
                        "8 mai 1945",
                        "9 mai 1945",
                        "10 mai 1945"
                    ],
                    correctAnswer: 1
                },
                medium: {
                    question: "Ce a fost Conferința de la Yalta?",
                    options: [
                        "Declarația de război",
                        "Planificarea postbelică",
                        "Capitularea Germaniei",
                        "Formarea ONU"
                    ],
                    correctAnswer: 1
                },
                hard: {
                    question: "Care a fost diferența dintre Conferința de la Yalta și cea de la Potsdam?",
                    options: [
                        "Yalta: planificare, Potsdam: implementare",
                        "Yalta: implementare, Potsdam: planificare",
                        "Nu a existat diferență",
                        "Yalta: Europa, Potsdam: Asia"
                    ],
                    correctAnswer: 0
                }
            },
            {
                easy: {
                    question: "Ce a fost Blitzkrieg?",
                    options: [
                        "Bombardarea Londrei",
                        "Tactica de război fulger",
                        "Invazia Franței",
                        "Submarinul german"
                    ],
                    correctAnswer: 1
                },
                medium: {
                    question: "Care a fost scopul Operațiunii Overlord?",
                    options: [
                        "Invazia Italiei",
                        "Debarcarea din Normandia",
                        "Bombardarea Germaniei",
                        "Eliberarea Poloniei"
                    ],
                    correctAnswer: 1
                },
                hard: {
                    question: "Care a fost diferența dintre Operațiunea Overlord și Operațiunea Market Garden?",
                    options: [
                        "Overlord: debarcare, Market Garden: aeriană",
                        "Overlord: aeriană, Market Garden: debarcare",
                        "Nu a existat diferență",
                        "Overlord: Franța, Market Garden: Germania"
                    ],
                    correctAnswer: 0
                }
            }
        ];
        
        const quiz = quizzes[index % quizzes.length];
        return quiz[difficulty];
    }
    
    generatePhysicsQuiz(index, difficulty) {
        const quizzes = [
            {
                easy: {
                    question: "Ce este forța?",
                    options: [
                        "O mărime scalară",
                        "O mărime vectorială",
                        "O unitate de măsură",
                        "O constantă fizică"
                    ],
                    correctAnswer: 1
                },
                medium: {
                    question: "Care este formula energiei cinetice?",
                    options: [
                        "Ec = mv",
                        "Ec = ½mv²",
                        "Ec = mv²",
                        "Ec = 2mv²"
                    ],
                    correctAnswer: 1
                },
                hard: {
                    question: "Care este formula completă pentru energia cinetică relativistă?",
                    options: [
                        "Ec = mc²",
                        "Ec = ½mv²",
                        "Ec = (γ-1)mc²",
                        "Ec = mv²/2"
                    ],
                    correctAnswer: 2
                }
            }
        ];
        
        const quiz = quizzes[index % quizzes.length];
        return quiz[difficulty];
    }
    
    generateChemistryQuiz(index, difficulty) {
        const quizzes = [
            {
                easy: {
                    question: "Ce este un atom?",
                    options: [
                        "Cea mai mare unitate de materie",
                        "Cea mai mică unitate de materie",
                        "O moleculă complexă",
                        "Un compus chimic"
                    ],
                    correctAnswer: 1
                },
                medium: {
                    question: "Ce este pH-ul unei soluții cu [H⁺] = 10⁻³ M?",
                    options: [
                        "pH = 3",
                        "pH = -3",
                        "pH = 11",
                        "pH = 7"
                    ],
                    correctAnswer: 0
                },
                hard: {
                    question: "Care este pH-ul unei soluții cu pOH = 4?",
                    options: [
                        "pH = 4",
                        "pH = 10",
                        "pH = 14",
                        "pH = 0"
                    ],
                    correctAnswer: 1
                }
            }
        ];
        
        const quiz = quizzes[index % quizzes.length];
        return quiz[difficulty];
    }
    
    generateBiologyQuiz(index, difficulty) {
        const quizzes = [
            {
                easy: {
                    question: "Ce este celula?",
                    options: [
                        "Un organ",
                        "Unitatea fundamentală de viață",
                        "Un țesut",
                        "Un sistem"
                    ],
                    correctAnswer: 1
                },
                medium: {
                    question: "Ce este fotosinteza?",
                    options: [
                        "Respirația plantelor",
                        "Producerea glucozei cu lumina",
                        "Absorbția apei",
                        "Eliminarea oxigenului"
                    ],
                    correctAnswer: 1
                },
                hard: {
                    question: "Care este ecuația completă a fotosintezei?",
                    options: [
                        "6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂",
                        "6CO₂ + 12H₂O → C₆H₁₂O₆ + 6O₂ + 6H₂O",
                        "6CO₂ + 6H₂O + energie → C₆H₁₂O₆ + 6O₂",
                        "6CO₂ + 12H₂O + energie → C₆H₁₂O₆ + 6O₂ + 6H₂O"
                    ],
                    correctAnswer: 3
                }
            }
        ];
        
        const quiz = quizzes[index % quizzes.length];
        return quiz[difficulty];
    }
    
    generateLiteratureQuiz(index, difficulty) {
        const quizzes = [
            {
                easy: {
                    question: "Ce este o metaforă?",
                    options: [
                        "O comparație cu 'ca'",
                        "O figură de stil",
                        "O rimă",
                        "Un vers"
                    ],
                    correctAnswer: 1
                },
                medium: {
                    question: "Ce este un roman?",
                    options: [
                        "O poezie lungă",
                        "O operă narativă în proză",
                        "O piesă de teatru",
                        "O nuvelă scurtă"
                    ],
                    correctAnswer: 1
                },
                hard: {
                    question: "Care este diferența dintre metaforă și comparație?",
                    options: [
                        "Nu există diferență",
                        "Metafora folosește 'ca'",
                        "Comparația folosește 'ca'",
                        "Metafora este mai lungă"
                    ],
                    correctAnswer: 2
                }
            }
        ];
        
        const quiz = quizzes[index % quizzes.length];
        return quiz[difficulty];
    }
    
    generateGeographyQuiz(index, difficulty) {
        const quizzes = [
            {
                easy: {
                    question: "Ce este clima?",
                    options: [
                        "Vremea de azi",
                        "Condițiile meteorologice pe termen lung",
                        "Temperatura medie",
                        "Cantitatea de precipitații"
                    ],
                    correctAnswer: 1
                },
                medium: {
                    question: "Care este cel mai mare ocean?",
                    options: [
                        "Atlantic",
                        "Pacific",
                        "Indian",
                        "Arctic"
                    ],
                    correctAnswer: 1
                },
                hard: {
                    question: "Care este diferența dintre clima tropicală și cea temperată?",
                    options: [
                        "Tropicală: mai caldă, Temperată: mai rece",
                        "Tropicală: precipitații mai multe",
                        "Tropicală: variații sezoniere mici",
                        "Toate variantele de mai sus"
                    ],
                    correctAnswer: 3
                }
            }
        ];
        
        const quiz = quizzes[index % quizzes.length];
        return quiz[difficulty];
    }
    
    generateEconomicsQuiz(index, difficulty) {
        const quizzes = [
            {
                easy: {
                    question: "Ce este cererea?",
                    options: [
                        "Cantitatea oferită",
                        "Cantitatea dorită de consumatori",
                        "Prețul unui bun",
                        "Costul de producție"
                    ],
                    correctAnswer: 1
                },
                medium: {
                    question: "Ce este inflația?",
                    options: [
                        "Scăderea prețurilor",
                        "Creșterea prețurilor",
                        "Stabilitatea prețurilor",
                        "Fluctuația prețurilor"
                    ],
                    correctAnswer: 1
                },
                hard: {
                    question: "Care este diferența dintre inflația prin cerere și cea prin costuri?",
                    options: [
                        "Cererea: prețuri cresc, Costurile: prețuri scad",
                        "Cererea: cererea excesivă, Costurile: costuri cresc",
                        "Nu există diferență",
                        "Cererea: costuri cresc, Costurile: cererea excesivă"
                    ],
                    correctAnswer: 1
                }
            }
        ];
        
        const quiz = quizzes[index % quizzes.length];
        return quiz[difficulty];
    }
    
    generatePsychologyQuiz(index, difficulty) {
        const quizzes = [
            {
                easy: {
                    question: "Ce este psihologia?",
                    options: [
                        "Studiul creierului",
                        "Studiul comportamentului și proceselor mentale",
                        "Studiul personalității",
                        "Studiul emoțiilor"
                    ],
                    correctAnswer: 1
                },
                medium: {
                    question: "Ce este memoria?",
                    options: [
                        "Capacitatea de a gândi",
                        "Capacitatea de a stoca și recupera informații",
                        "Capacitatea de a învăța",
                        "Capacitatea de a reține"
                    ],
                    correctAnswer: 1
                },
                hard: {
                    question: "Care este diferența dintre memoria procedurală și cea declarativă?",
                    options: [
                        "Procedurală: fapte, Declarativă: abilități",
                        "Procedurală: abilități, Declarativă: fapte",
                        "Nu există diferență",
                        "Procedurală: pe termen scurt, Declarativă: pe termen lung"
                    ],
                    correctAnswer: 1
                }
            }
        ];
        
        const quiz = quizzes[index % quizzes.length];
        return quiz[difficulty];
    }
    
    generatePhilosophyQuiz(index, difficulty) {
        const quizzes = [
            {
                easy: {
                    question: "Ce este filozofia?",
                    options: [
                        "Studiul religiei",
                        "Căutarea înțelegerii fundamentale",
                        "Studiul istoriei",
                        "Studiul științei"
                    ],
                    correctAnswer: 1
                },
                medium: {
                    question: "Ce este etica?",
                    options: [
                        "Studiul frumosului",
                        "Studiul principiilor morale",
                        "Studiul cunoașterii",
                        "Studiul existenței"
                    ],
                    correctAnswer: 1
                },
                hard: {
                    question: "Care este diferența dintre deontologie și utilitarism?",
                    options: [
                        "Deontologie: consecințe, Utilitarism: reguli",
                        "Deontologie: reguli, Utilitarism: consecințe",
                        "Nu există diferență",
                        "Deontologie: fericire, Utilitarism: datorie"
                    ],
                    correctAnswer: 1
                }
            }
        ];
        
        const quiz = quizzes[index % quizzes.length];
        return quiz[difficulty];
    }
    
    generateGenericQuiz(subject, index, difficulty) {
        const questionTypes = [
            "Ce este",
            "Cum funcționează",
            "De ce este important",
            "Care sunt caracteristicile",
            "Cum se aplică"
        ];
        
        const questionType = questionTypes[index % questionTypes.length];
        const question = `${questionType} conceptul principal din ${subject}?`;
        
        // Generează opțiuni cu diferențe subtile pentru dificultatea grea
        let options, correctAnswer;
        
        if (difficulty === 'easy') {
            options = [
                "Conceptul fundamental și esențial",
                "O noțiune secundară",
                "Un detaliu irelevant",
                "O informație greșită"
            ];
            correctAnswer = 0;
        } else if (difficulty === 'medium') {
            options = [
                "Conceptul principal și aplicațiile sale",
                "Conceptul principal fără aplicații",
                "Doar aplicațiile practice",
                "Informații generale"
            ];
            correctAnswer = 0;
        } else { // hard
            options = [
                "Conceptul principal cu aplicații practice și exemple concrete",
                "Conceptul principal cu aplicații practice și exemple generale",
                "Conceptul principal cu aplicații generale și exemple concrete",
                "Conceptul principal cu aplicații generale și exemple generale"
            ];
            correctAnswer = 0;
        }
        
        return { question, options, correctAnswer };
    }
    
    loadFlashcard(index) {
        if (index >= this.flashcards.length) return;
        
        const flashcard = this.flashcards[index];
        this.flashcardQuestion.textContent = flashcard.question;
        this.flashcardAnswer.innerHTML = flashcard.answer;
        
        // Reset flashcard state
        document.getElementById('flashcard').classList.remove('flipped');
        document.getElementById('showAnswer').style.display = 'block';
        document.getElementById('nextFlashcard').style.display = 'none';
        
        // Update progress
        this.flashcardProgress.textContent = `${index + 1} / ${this.flashcards.length}`;
        this.flashcardProgressBar.style.width = `${((index + 1) / this.flashcards.length) * 100}%`;
        
        this.currentFlashcardIndex = index;
    }
    
    showFlashcardAnswer() {
        document.getElementById('flashcard').classList.add('flipped');
        document.getElementById('showAnswer').style.display = 'none';
        document.getElementById('nextFlashcard').style.display = 'block';
    }
    
    nextFlashcard() {
        if (this.currentFlashcardIndex < this.flashcards.length - 1) {
            this.loadFlashcard(this.currentFlashcardIndex + 1);
        } else {
            alert('Ai terminat toate flashcardurile!');
        }
    }
    
    flipFlashcard() {
        document.getElementById('flashcard').classList.toggle('flipped');
    }
    
    loadQuizQuestion(index) {
        if (index >= this.quizQuestions.length) {
            this.showResults();
            return;
        }
        
        const question = this.quizQuestions[index];
        this.quizQuestion.textContent = question.question;
        
        // Clear previous options
        this.quizOptions.innerHTML = '';
        
        // Create options
        question.options.forEach((option, i) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.textContent = option;
            optionElement.addEventListener('click', () => this.selectAnswer(i, optionElement));
            this.quizOptions.appendChild(optionElement);
        });
        
        // Update progress
        this.quizProgress.textContent = `${index + 1} / ${this.quizQuestions.length}`;
        this.quizProgressBar.style.width = `${((index + 1) / this.quizQuestions.length) * 100}%`;
        this.totalQuestions.textContent = this.quizQuestions.length;
        
        // Reset state
        this.selectedAnswer = null;
        document.getElementById('submitAnswer').disabled = true;
        
        this.currentQuizIndex = index;
    }
    
    selectAnswer(index, element) {
        // Remove previous selection
        document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
        
        // Select new answer
        element.classList.add('selected');
        this.selectedAnswer = index;
        document.getElementById('submitAnswer').disabled = false;
    }
    
    submitQuizAnswer() {
        if (this.selectedAnswer === null) return;
        
        const question = this.quizQuestions[this.currentQuizIndex];
        const options = document.querySelectorAll('.option');
        
        // Show correct answer
        options[question.correctAnswer].classList.add('correct');
        
        // Show incorrect answer if selected wrong
        if (this.selectedAnswer !== question.correctAnswer) {
            options[this.selectedAnswer].classList.add('incorrect');
        } else {
            this.quizScore++;
        }
        
        // Update score display
        const scoreElement = document.getElementById('quizScore');
        if (scoreElement) {
            scoreElement.textContent = this.quizScore;
        }
        
        // Disable submit button
        document.getElementById('submitAnswer').disabled = true;
        
        // Disable all options
        options.forEach(opt => opt.style.pointerEvents = 'none');
        
        // Auto advance after delay
        setTimeout(() => {
            this.loadQuizQuestion(this.currentQuizIndex + 1);
        }, 2000);
    }
    
    showResults() {
        const percentage = Math.round((this.quizScore / this.quizQuestions.length) * 100);
        this.finalScore.textContent = percentage;
        
        let message;
        if (percentage >= 90) {
            message = "Excelent! Ai o înțelegere profundă a subiectului.";
        } else if (percentage >= 70) {
            message = "Foarte bine! Cunoștințele tale sunt solide.";
        } else if (percentage >= 50) {
            message = "Bun! Continuă să studiezi pentru a îmbunătăți.";
        } else {
            message = "Încearcă din nou! Revizuiește materialul și încearcă din nou.";
        }
        
        this.scoreMessage.textContent = message;
        this.showSection('resultsSection');
    }
    
    restartQuiz() {
        this.quizScore = 0;
        this.currentQuizIndex = 0;
        this.loadQuizQuestion(0);
        this.showSection('quizSection');
    }
    
    resetToSubjectInput() {
        this.currentSubject = '';
        this.currentMode = '';
        this.currentSettings = {};
        this.flashcards = [];
        this.quizQuestions = [];
        this.currentFlashcardIndex = 0;
        this.currentQuizIndex = 0;
        this.quizScore = 0;
        this.selectedAnswer = null;
        
        // Clear inputs
        this.subjectNameInput.value = '';
        this.subjectDescriptionInput.value = '';
        this.learningLevelSelect.value = 'beginner';
        this.detailLevelSelect.value = 'essential';
        this.difficultySelect.value = 'easy';
        this.numberOfItemsSelect.value = '10';
        
        this.showSection('subjectInput');
    }
    
    showSection(sectionName) {
        // Hide all sections
        const sections = ['subjectInput', 'modeSelection', 'settings', 'loadingSection', 'flashcardsSection', 'quizSection', 'resultsSection'];
        sections.forEach(section => {
            document.getElementById(section).style.display = 'none';
        });
        
        // Show selected section
        document.getElementById(sectionName).style.display = 'block';
    }
}

// Initialize the platform when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EducationalPlatform();
});
