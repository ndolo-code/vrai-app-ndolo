// =====================================================
// NDOLOMATH — Full-text French → English translator
// Maps complete French strings to proper English translations.
// Falls back to phrase-level dictionary for short strings.
// =====================================================

// ---- Full-text translations: complete FR → EN mapping ----
const FULL_TEXT: Map<string, string> = new Map([
  // ===================== STUDY METHODS =====================
  ["La methode Pomodoro : Travaille 25 minutes, puis fais une pause de 5 minutes. Apres 4 cycles, fais une pause plus longue de 15-30 minutes. Cette technique ameliore la concentration et evite l'epuisement mental.",
   "The Pomodoro method: Work for 25 minutes, then take a 5-minute break. After 4 cycles, take a longer break of 15-30 minutes. This technique improves concentration and prevents mental exhaustion."],
  ["La repetition espacee : Revise tes cours a intervalles croissants (1 jour, 3 jours, 1 semaine, 2 semaines) pour ancrer les connaissances dans ta memoire a long terme.",
   "Spaced repetition: Review your lessons at increasing intervals (1 day, 3 days, 1 week, 2 weeks) to anchor knowledge in your long-term memory."],
  ["Le mind mapping : Cree des cartes mentales pour organiser tes idees et visualiser les liens entre les concepts mathematiques. Utilise des couleurs et des symboles.",
   "Mind mapping: Create mind maps to organize your ideas and visualize the links between mathematical concepts. Use colors and symbols."],
  ["La methode Feynman : Explique un concept comme si tu l'enseignais a un enfant. Si tu bloques, retourne a tes notes pour combler les lacunes.",
   "The Feynman method: Explain a concept as if you were teaching it to a child. If you get stuck, go back to your notes to fill in the gaps."],
  ["L'apprentissage actif : Ne te contente pas de lire. Ecris, resous, dessine. Plus tu es actif dans ton apprentissage, mieux tu retiens les informations.",
   "Active learning: Don't just read. Write, solve, draw. The more active you are in your learning, the better you retain information."],
  ["L'auto-evaluation : Apres chaque chapitre, teste-toi avec des exercices sans regarder le cours. Identifie tes points faibles et retravaille-les.",
   "Self-assessment: After each chapter, test yourself with exercises without looking at the lesson. Identify your weak points and work on them again."],
  ["Le travail en groupe : Explique les concepts a tes camarades et ecoute leurs explications. L'enseignement mutuel renforce la comprehension de tous.",
   "Group work: Explain concepts to your classmates and listen to their explanations. Mutual teaching strengthens everyone's understanding."],
  ["La methode Cornell : Divise ta page en 3 zones : notes, mots-cles, resume. Cela facilite la revision et la memorisation structuree.",
   "The Cornell method: Divide your page into 3 zones: notes, keywords, summary. This makes revision and structured memorization easier."],
  ["La technique des flashcards : Cree des cartes avec une question d'un cote et la reponse de l'autre. Ideale pour memoriser les formules et definitions.",
   "The flashcard technique: Create cards with a question on one side and the answer on the other. Ideal for memorizing formulas and definitions."],
  ["La planification hebdomadaire : Chaque dimanche, planifie ta semaine d'etude. Fixe des objectifs precis et mesurables pour chaque jour de travail.",
   "Weekly planning: Every Sunday, plan your study week. Set precise and measurable goals for each working day."],

  // ===================== INSPIRATIONAL QUOTES =====================
  ["Les mathematiques sont la reine des sciences. - Carl Friedrich Gauss",
   "Mathematics is the queen of the sciences. - Carl Friedrich Gauss"],
  ["L'education est l'arme la plus puissante pour changer le monde. - Nelson Mandela",
   "Education is the most powerful weapon you can use to change the world. - Nelson Mandela"],
  ["Le succes n'est pas la cle du bonheur. Le bonheur est la cle du succes. - Albert Schweitzer",
   "Success is not the key to happiness. Happiness is the key to success. - Albert Schweitzer"],
  ["La seule facon de faire du bon travail est d'aimer ce que vous faites. - Steve Jobs",
   "The only way to do great work is to love what you do. - Steve Jobs"],
  ["L'avenir appartient a ceux qui croient a la beaute de leurs reves. - Eleanor Roosevelt",
   "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt"],
  ["Ce n'est pas parce que les choses sont difficiles que nous n'osons pas, c'est parce que nous n'osons pas qu'elles sont difficiles. - Seneque",
   "It is not because things are difficult that we do not dare, it is because we do not dare that they are difficult. - Seneca"],
  ["Le genie est un pour cent d'inspiration et quatre-vingt-dix-neuf pour cent de transpiration. - Thomas Edison",
   "Genius is one percent inspiration and ninety-nine percent perspiration. - Thomas Edison"],
  ["Chaque expert etait autrefois un debutant. - Helen Hayes",
   "Every expert was once a beginner. - Helen Hayes"],
  ["La perseverance est la mere de la reussite. - Proverbe africain",
   "Perseverance is the mother of success. - African proverb"],
  ["N'ayez pas peur de la perfection, vous n'y arriverez jamais. - Salvador Dali",
   "Have no fear of perfection, you'll never reach it. - Salvador Dali"],
  ["L'echec est le fondement de la reussite. - Lao Tseu",
   "Failure is the foundation of success. - Lao Tzu"],
  ["Celui qui n'a pas echoue n'a jamais tente quelque chose de nouveau. - Albert Einstein",
   "Anyone who has never made a mistake has never tried anything new. - Albert Einstein"],
  ["Les racines de l'education sont ameres, mais ses fruits sont doux. - Aristote",
   "The roots of education are bitter, but the fruit is sweet. - Aristotle"],
  ["Le savoir est la seule matiere qui s'accroit quand on la partage. - Socrate",
   "Knowledge is the only thing that grows when shared. - Socrates"],
  ["Apprendre sans reflechir est vain. Reflechir sans apprendre est dangereux. - Confucius",
   "Learning without thinking is useless. Thinking without learning is dangerous. - Confucius"],
  ["La mathematique est l'alphabet avec lequel Dieu a ecrit l'univers. - Galilee",
   "Mathematics is the alphabet with which God has written the universe. - Galileo"],
  ["Je pense, donc je suis. - Rene Descartes",
   "I think, therefore I am. - Rene Descartes"],
  ["Vis comme si tu devais mourir demain. Apprends comme si tu devais vivre toujours. - Mahatma Gandhi",
   "Live as if you were to die tomorrow. Learn as if you were to live forever. - Mahatma Gandhi"],
  ["Un voyage de mille lieues commence toujours par un premier pas. - Lao Tseu",
   "A journey of a thousand miles begins with a single step. - Lao Tzu"],
  ["L'imagination est plus importante que le savoir. - Albert Einstein",
   "Imagination is more important than knowledge. - Albert Einstein"],
  ["Ne juge pas chaque jour par la recolte que tu fais, mais par les graines que tu semes. - Robert Louis Stevenson",
   "Don't judge each day by the harvest you reap but by the seeds that you plant. - Robert Louis Stevenson"],
  ["La connaissance s'acquiert par l'experience, tout le reste n'est que de l'information. - Albert Einstein",
   "Knowledge comes from experience, everything else is just information. - Albert Einstein"],
  ["Quand on veut, on peut. Quand on peut, on doit. - Napoleon Bonaparte",
   "Where there's a will, there's a way. When you can, you must. - Napoleon Bonaparte"],
  ["Le courage n'est pas l'absence de peur, mais la capacite de vaincre ce qui fait peur. - Nelson Mandela",
   "Courage is not the absence of fear, but the ability to overcome what frightens you. - Nelson Mandela"],

  // ===================== PRACTICAL TIPS =====================
  ["Commence toujours par comprendre l'enonce avant de resoudre un exercice. Lis-le au moins deux fois et identifie les donnees et les inconnues.",
   "Always start by understanding the problem statement before solving an exercise. Read it at least twice and identify the given data and unknowns."],
  ["Ecris proprement tes calculs. Une presentation claire t'aide a eviter les erreurs et facilite la correction par ton professeur.",
   "Write your calculations neatly. A clear presentation helps you avoid mistakes and makes it easier for your teacher to grade."],
  ["Apprends les formules par coeur AVANT de faire les exercices. Tu ne peux pas resoudre si tu ne connais pas les outils.",
   "Memorize the formulas BEFORE doing the exercises. You can't solve problems if you don't know the tools."],
  ["Refais les exercices corriges en classe sans regarder la correction. C'est le meilleur entrainement possible pour progresser.",
   "Redo the exercises corrected in class without looking at the correction. It's the best possible practice for improvement."],
  ["Note tes erreurs dans un carnet dedie. Revois-les regulierement pour ne pas les repeter aux examens.",
   "Write down your mistakes in a dedicated notebook. Review them regularly so you don't repeat them in exams."],
  ["Fais des annales d'examen chaque semaine. Chronometre-toi pour t'habituer aux conditions reelles de l'examen.",
   "Do past exam papers every week. Time yourself to get used to real exam conditions."],
  ["Quand tu bloques sur un exercice, passe au suivant et reviens-y plus tard avec un regard neuf et repose.",
   "When you get stuck on an exercise, move on to the next one and come back to it later with fresh and rested eyes."],
  ["Dessine toujours une figure pour les exercices de geometrie. Un bon schema vaut mille mots et aide a visualiser le probleme.",
   "Always draw a figure for geometry exercises. A good diagram is worth a thousand words and helps visualize the problem."],
  ["Verifie toujours tes resultats en substituant tes valeurs dans l'equation de depart pour confirmer ta reponse.",
   "Always check your results by substituting your values into the original equation to confirm your answer."],
  ["Dors au moins 8 heures avant un examen. Un cerveau repose retient et raisonne beaucoup mieux qu'un cerveau fatigue.",
   "Sleep at least 8 hours before an exam. A rested brain retains and reasons much better than a tired brain."],
  ["Mange bien et bois de l'eau pendant tes sessions d'etude. Ton cerveau a besoin de carburant pour bien fonctionner.",
   "Eat well and drink water during your study sessions. Your brain needs fuel to function properly."],
  ["Etudie dans un endroit calme, sans telephone. La concentration est ta meilleure alliee pour comprendre les maths.",
   "Study in a quiet place, without your phone. Concentration is your best ally for understanding math."],
  ["Fixe-toi des objectifs quotidiens precis : par exemple 'Aujourd'hui, je maitrise les identites remarquables'.",
   "Set precise daily goals: for example 'Today, I will master notable identities'."],
  ["Utilise des couleurs differentes pour tes notes : rouge pour les formules, bleu pour les theoremes, vert pour les exemples.",
   "Use different colors for your notes: red for formulas, blue for theorems, green for examples."],
  ["Ne saute jamais les demonstrations en cours. Comprendre le 'pourquoi' t'aide a retenir le 'comment' de chaque formule.",
   "Never skip proofs in class. Understanding the 'why' helps you remember the 'how' of each formula."],
  ["Cree des fiches de revision pour chaque chapitre avec les formules et theoremes essentiels resumes en une page.",
   "Create revision sheets for each chapter with the essential formulas and theorems summarized on one page."],
  ["Pose des questions en classe. Si tu ne comprends pas, d'autres eleves sont probablement dans la meme situation.",
   "Ask questions in class. If you don't understand, other students are probably in the same situation."],
  ["Travaille regulierement, pas seulement avant les examens. 30 minutes par jour valent mieux que 5 heures la veille.",
   "Work regularly, not just before exams. 30 minutes a day is better than 5 hours the night before."],
  ["Forme un groupe d'etude de 3-4 personnes maximum. Expliquez-vous mutuellement les concepts difficiles.",
   "Form a study group of 3-4 people maximum. Explain difficult concepts to each other."],
  ["Celebre tes progres, meme les petits. Chaque exercice reussi est une victoire qui te rapproche de ton objectif.",
   "Celebrate your progress, even small ones. Each successful exercise is a victory bringing you closer to your goal."],
  ["Relis tes cours le soir meme du jour ou tu les as recus. La memoire est meilleure quand les informations sont fraiches.",
   "Reread your lessons the same evening you received them. Memory works better when the information is fresh."],
  ["Utilise des moyens mnemotechniques pour retenir les formules. Par exemple SOH-CAH-TOA pour la trigonometrie.",
   "Use mnemonic devices to remember formulas. For example SOH-CAH-TOA for trigonometry."],

  // ===================== STUDY TIPS SHORT =====================
  ["Travaille 25 min puis pause 5 min (methode Pomodoro) pour rester concentre sans te fatiguer.",
   "Work 25 min then break 5 min (Pomodoro method) to stay focused without getting tired."],
  ["Refais les exercices sans regarder la correction : c'est le meilleur moyen de savoir si tu as vraiment compris.",
   "Redo exercises without looking at the correction: it's the best way to know if you truly understood."],
  ["Apprends les formules par coeur avant de faire les exercices. Sans elles, tu perds du temps inutilement.",
   "Memorize formulas before doing exercises. Without them, you waste time unnecessarily."],
  ["Fais des annales chaque semaine en te chronometrant pour t'entrainer dans les conditions reelles de l'examen.",
   "Do past papers every week while timing yourself to practice under real exam conditions."],
  ["Note tes erreurs dans un cahier dedie et revois-les regulierement. Les memes pieges reviennent souvent.",
   "Write down your mistakes in a dedicated notebook and review them regularly. The same traps come back often."],
  ["Explique les concepts a quelqu'un d'autre : enseigner est la meilleure facon de maitriser un sujet.",
   "Explain concepts to someone else: teaching is the best way to master a subject."],
  ["Dessine toujours une figure en geometrie, meme quand l'enonce ne le demande pas. Cela t'aide a visualiser.",
   "Always draw a figure in geometry, even when the problem doesn't ask for it. It helps you visualize."],
  ["Verifie tes resultats en les substituant dans l'equation de depart. Cela evite les erreurs de calcul.",
   "Check your results by substituting them into the original equation. This avoids calculation errors."],
  ["Dors au moins 8 heures avant un examen. Un cerveau repose retient mieux et reflechit plus vite.",
   "Sleep at least 8 hours before an exam. A rested brain retains better and thinks faster."],
  ["Etudie dans un endroit calme sans distractions : eteins ton telephone et concentre-toi a 100%.",
   "Study in a quiet place without distractions: turn off your phone and focus 100%."],
  ["Commence toujours par les exercices faciles pour gagner en confiance avant d'attaquer les plus difficiles.",
   "Always start with easy exercises to build confidence before tackling the harder ones."],
  ["Relis l'enonce deux fois avant de commencer. Beaucoup d'erreurs viennent d'une mauvaise lecture.",
   "Read the problem statement twice before starting. Many mistakes come from poor reading."],
  ["Utilise des couleurs differentes pour ecrire les formules, les theoremes et les definitions dans tes notes.",
   "Use different colors to write formulas, theorems and definitions in your notes."],
  ["Revise un peu chaque jour plutot que tout la veille. La memoire fonctionne mieux avec la repetition espacee.",
   "Review a little each day rather than everything the night before. Memory works better with spaced repetition."],
  ["Quand tu bloques sur un exercice, passe au suivant et reviens-y plus tard avec un regard neuf.",
   "When you get stuck on an exercise, move on to the next one and come back to it later with fresh eyes."],
  ["Fais un resume de chaque chapitre sur une feuille : cela t'oblige a identifier l'essentiel.",
   "Summarize each chapter on one sheet: it forces you to identify the essentials."],
  ["Utilise des moyens mnemotechniques pour retenir les formules. Par exemple SOH-CAH-TOA pour la trigonometrie.",
   "Use mnemonic devices to remember formulas. For example SOH-CAH-TOA for trigonometry."],
  ["Travaille en groupe de temps en temps : les discussions permettent de decouvrir d'autres approches.",
   "Work in groups from time to time: discussions allow you to discover other approaches."],
  ["Avant un controle, refais les exercices types que le professeur a faits en classe. Ils reviennent souvent.",
   "Before a test, redo the typical exercises the teacher did in class. They often come back."],
  ["Ne te contente pas de lire le cours. Prends un stylo et refais les demonstrations toi-meme pour bien comprendre.",
   "Don't just read the lesson. Take a pen and redo the proofs yourself to really understand."],

  // ===================== PRIVACY POLICY =====================
  ["Ndolomath respecte votre vie privee. Cette politique de confidentialite decrit quelles donnees nous collectons, comment nous les utilisons et comment nous les protegeons. En utilisant l'application Ndolomath, vous acceptez les pratiques decrites dans cette politique.",
   "Ndolomath respects your privacy. This privacy policy describes what data we collect, how we use it, and how we protect it. By using the Ndolomath application, you accept the practices described in this policy."],
  ["2. Donnees collectees", "2. Data collected"],
  ["Ndolomath collecte uniquement les donnees strictement necessaires au fonctionnement de l'application :",
   "Ndolomath only collects data strictly necessary for the application to function:"],
  ["Informations de profil (nom, prenom, classe) pour personnaliser l'experience",
   "Profile information (name, first name, class) to personalize the experience"],
  ["Progression et favoris pour sauvegarder votre avancement",
   "Progress and favorites to save your advancement"],
  ["Preferences d'affichage (mode sombre, classe selectionnee)",
   "Display preferences (dark mode, selected class)"],
  ["3. Stockage des donnees", "3. Data storage"],
  ["Les donnees sont stockees localement sur votre appareil via le stockage du navigateur. Aucune donnee personnelle n'est transmise a des serveurs externes sans votre consentement explicite. Lorsque vous creez un compte, vos donnees sont stockees de maniere securisee sur nos serveurs.",
   "Data is stored locally on your device via browser storage. No personal data is transmitted to external servers without your explicit consent. When you create an account, your data is stored securely on our servers."],
  ["4. Utilisation des donnees", "4. Use of data"],
  ["Vos donnees sont utilisees exclusivement pour :",
   "Your data is used exclusively for:"],
  ["Personnaliser votre experience d'apprentissage",
   "Personalizing your learning experience"],
  ["Sauvegarder votre progression et vos favoris",
   "Saving your progress and favorites"],
  ["Ameliorer les fonctionnalites de l'application",
   "Improving the application's features"],
  ["5. Partage des donnees", "5. Data sharing"],
  ["Ndolomath ne vend, ne loue et ne partage aucune donnee personnelle avec des tiers a des fins commerciales. Nous pouvons partager des donnees anonymisees a des fins statistiques pour ameliorer l'application.",
   "Ndolomath does not sell, rent or share any personal data with third parties for commercial purposes. We may share anonymized data for statistical purposes to improve the application."],
  ["6. Securite", "6. Security"],
  ["Nous mettons en oeuvre des mesures de securite appropriees pour proteger vos donnees contre tout acces non autorise, modification, divulgation ou destruction.",
   "We implement appropriate security measures to protect your data against unauthorized access, modification, disclosure or destruction."],
  ["7. Droits des utilisateurs", "7. User rights"],
  ["Vous avez le droit de consulter, modifier ou supprimer vos donnees a tout moment. Vous pouvez reinitialiser toutes vos donnees locales depuis les parametres de l'application. Pour toute demande concernant vos donnees, contactez-nous a contact.ndolomath@gmail.com.",
   "You have the right to view, modify or delete your data at any time. You can reset all your local data from the application settings. For any request regarding your data, contact us at contact.ndolomath@gmail.com."],
  ["Nous nous reservons le droit de modifier cette politique de confidentialite a tout moment. Les modifications prennent effet des leur publication dans l'application.",
   "We reserve the right to modify this privacy policy at any time. Changes take effect upon their publication in the application."],
  ["Derniere mise a jour : fevrier 2026", "Last updated: February 2026"],

  // ===================== COOKIES POLICY =====================
  ["1. Qu'est-ce qu'un cookie ?", "1. What is a cookie?"],
  ["Un cookie est un petit fichier texte stocke sur votre appareil lorsque vous visitez un site web ou utilisez une application. Les cookies permettent de memoriser vos preferences et d'ameliorer votre experience.",
   "A cookie is a small text file stored on your device when you visit a website or use an application. Cookies help remember your preferences and improve your experience."],
  ["2. Cookies utilises par Ndolomath", "2. Cookies used by Ndolomath"],
  ["Ndolomath utilise uniquement des cookies essentiels et fonctionnels :",
   "Ndolomath only uses essential and functional cookies:"],
  ["Cookies essentiels :", "Essential cookies:"],
  ["necessaires au fonctionnement de l'application (authentification, session utilisateur)",
   "necessary for the application to function (authentication, user session)"],
  ["Cookies fonctionnels :", "Functional cookies:"],
  ["stockent vos preferences (mode sombre, classe selectionnee, progression)",
   "store your preferences (dark mode, selected class, progress)"],
  ["Stockage local :", "Local storage:"],
  ["utilise pour sauvegarder votre progression et vos favoris hors ligne",
   "used to save your progress and favorites offline"],
  ["3. Cookies tiers", "3. Third-party cookies"],
  ["Ndolomath n'utilise pas de cookies publicitaires ou de suivi tiers. Certains contenus integres (comme GeoGebra pour le traceur de courbes) peuvent utiliser leurs propres cookies soumis a leurs propres politiques.",
   "Ndolomath does not use advertising or third-party tracking cookies. Some integrated content (like GeoGebra for the curve plotter) may use their own cookies subject to their own policies."],
  ["4. Duree de conservation", "4. Retention period"],
  ["Les cookies essentiels sont conserves pendant la duree de votre session. Les cookies fonctionnels et le stockage local sont conserves jusqu'a ce que vous les supprimiez manuellement via les parametres de l'application ou de votre navigateur.",
   "Essential cookies are kept for the duration of your session. Functional cookies and local storage are kept until you manually delete them via the application or browser settings."],
  ["5. Gestion des cookies", "5. Cookie management"],
  ["Vous pouvez a tout moment supprimer les cookies et les donnees de stockage local :",
   "You can delete cookies and local storage data at any time:"],
  ["Depuis les parametres de Ndolomath : bouton 'Reinitialiser le stockage local'",
   "From Ndolomath settings: 'Reset local storage' button"],
  ["Depuis les parametres de votre navigateur : suppression des cookies et donnees de site",
   "From your browser settings: delete cookies and site data"],
  ["6. Consentement", "6. Consent"],
  ["En utilisant Ndolomath, vous consentez a l'utilisation des cookies essentiels et fonctionnels decrits ci-dessus. Vous pouvez retirer votre consentement a tout moment en supprimant les cookies.",
   "By using Ndolomath, you consent to the use of essential and functional cookies described above. You can withdraw your consent at any time by deleting cookies."],

  // ===================== SIDEBAR ITEMS =====================
  ["Methodes d'etude", "Study methods"],
  ["Citations inspirantes", "Inspirational quotes"],
  ["Conseils pratiques", "Practical tips"],
  ["Calcul mental", "Mental math"],
  ["Teste ta rapidite en calcul", "Test your calculation speed"],
  ["Vrai ou Faux", "True or False"],
  ["Es-tu sur de tes connaissances ?", "Are you sure of your knowledge?"],
  ["Geometrie", "Geometry"],
  ["Figures, aires et volumes", "Shapes, areas and volumes"],
  ["Algebre", "Algebra"],
  ["Equations et identites remarquables", "Equations and notable identities"],
  ["Suites numeriques", "Numerical sequences"],
  ["Arithmetiques et geometriques", "Arithmetic and geometric"],
  ["Probabilites", "Probability"],
  ["Chance, combinaisons et denombrement", "Chance, combinations and counting"],

  // ===================== SUBJECT NAMES (grades) =====================
  ["Maths", "Math"],
  ["Physique", "Physics"],
  ["SVT", "Biology"],
  ["Francais", "French"],
  ["Anglais", "English"],
  ["Histoire-Geo", "History-Geography"],
  ["Nouvelle matiere", "New subject"],
  ["Philosophie", "Philosophy"],
  ["Informatique", "Computer Science"],
  ["Education Physique", "Physical Education"],
  ["Chimie", "Chemistry"],
  ["Sciences Physiques", "Physical Sciences"],
  ["Economie", "Economics"],

  // ===================== DEFAULT GOALS & OBJECTIVES =====================
  ["Avoir 16/20 en mathematiques", "Get 16/20 in mathematics"],
  ["Reviser chaque chapitre avant les examens", "Review each chapter before exams"],
  ["Faire tous les exercices du manuel", "Complete all textbook exercises"],
  ["Obtenir au moins 14/20 au prochain devoir", "Get at least 14/20 on the next assignment"],

  // ===================== CHAPTER NAMES =====================
  ["Angles", "Angles"],
  ["Calcul litteral", "Literal calculus"],
  ["Cercle", "Circle"],
  ["Cylindre de revolution", "Cylinder of revolution"],
  ["Droite du plan", "Lines in the plane"],
  ["Ensemble des entiers naturels", "Set of natural numbers"],
  ["Figures symetriques par rapport a un point", "Figures symmetric about a point"],
  ["Figures symetriques par rapport a une droite", "Figures symmetric about a line"],
  ["Fractions", "Fractions"],
  ["Nombres decimaux", "Decimal numbers"],
  ["Nombres decimaux relatifs", "Relative decimal numbers"],
  ["Paves droits", "Rectangular prisms"],
  ["Parallelogrammes", "Parallelograms"],
  ["Proportionnalite", "Proportionality"],
  ["Reperage d'un point sur une droite", "Locating a point on a line"],
  ["Segments", "Segments"],
  ["Triangles", "Triangles"],
  ["Arithmetique", "Arithmetic"],
  ["Distances", "Distances"],
  ["Polygones", "Polygons"],
  ["Prisme droit", "Right prism"],
  ["Reperage d'un point", "Locating a point"],
  ["Statistiques", "Statistics"],
  ["Symetries", "Symmetries"],
  ["Sphere", "Sphere"],
  ["Cercle (Pythagore, tangente)", "Circle (Pythagorean theorem, tangent)"],
  ["Cone de revolution", "Cone of revolution"],
  ["Denombrement", "Counting"],
  ["Equations et inequations", "Equations and inequalities"],
  ["Nombres rationnels", "Rational numbers"],
  ["Plans et droites de l'espace", "Planes and lines in space"],
  ["Pyramide", "Pyramid"],
  ["Reperage dans le plan", "Coordinates in the plane"],
  ["Translations", "Translations"],
  ["Vecteurs", "Vectors"],
  ["Calcul dans R", "Calculations in R"],
  ["Equations, inequations et systemes", "Equations, inequalities and systems"],
  ["Fonctions", "Functions"],
  ["Angles inscrits et polygones reguliers", "Inscribed angles and regular polygons"],
  ["Angles orientes et trigonometrie", "Oriented angles and trigonometry"],
  ["Droites et cercles du plan", "Lines and circles in the plane"],
  ["Fonctions numeriques", "Numerical functions"],
  ["Geometrie dans l'espace", "Geometry in space"],
  ["Groupes", "Groups"],
  ["Nombres reels", "Real numbers"],
  ["Produit scalaire", "Dot product"],
  ["Transformations du plan", "Transformations in the plane"],
  ["Vecteurs du plan", "Vectors in the plane"],
  ["Angles inscrits", "Inscribed angles"],
  ["Configurations du plan", "Configurations in the plane"],
  ["Homoheties", "Homotheties"],
  ["Rotations", "Rotations"],
  ["Translations et vecteurs", "Translations and vectors"],
  ["Vecteurs (produit par un reel)", "Vectors (scalar multiplication)"],
  ["Nombres reels", "Real numbers"],
  ["Calcul dans R", "Calculations in R"],
  ["Derivation", "Differentiation"],
  ["Generalites sur les fonctions", "General properties of functions"],
  ["Logarithme decimal", "Common logarithm"],
  ["Suites numeriques", "Numerical sequences"],
  ["Systemes d'equations", "Systems of equations"],
  ["Applications du produit scalaire", "Applications of the dot product"],
  ["Barycentre", "Barycenter"],
  ["Calcul matriciel", "Matrix calculus"],
  ["Droites et cercles", "Lines and circles"],
  ["Nombres complexes", "Complex numbers"],
  ["Polynomes", "Polynomials"],
  ["Calcul integral", "Integral calculus"],
  ["Equations differentielles", "Differential equations"],
  ["Fonctions exponentielles", "Exponential functions"],
  ["Fonctions logarithmes", "Logarithmic functions"],
  ["Probabilites", "Probability"],
  ["Denombrement et probabilites", "Counting and probability"],
  ["Espaces vectoriels", "Vector spaces"],
  ["Isometries du plan", "Isometries in the plane"],
  ["Similitudes", "Similarities"],
  ["Coniques", "Conics"],

  // ===================== FORMULA CATEGORIES =====================
  ["Identites remarquables", "Notable identities"],
  ["Equations et systemes", "Equations and systems"],
  ["Derivation et integration", "Differentiation and integration"],
  ["Probabilites et statistiques", "Probability and statistics"],
  ["Logarithmes et exponentielles", "Logarithms and exponentials"],
  ["Trigonometrie", "Trigonometry"],

  // ===================== FORMULA LABELS (inside LaTeX mixed text) =====================
  ["Equation du 2nd degre", "Quadratic equation"],
  ["Somme des racines", "Sum of roots"],
  ["Produit des racines", "Product of roots"],
  ["Aire du cercle", "Area of circle"],
  ["Perimetre du cercle", "Circumference"],
  ["Aire du triangle", "Area of triangle"],
  ["Volume de la sphere", "Volume of sphere"],
  ["Surface de la sphere", "Surface area of sphere"],
  ["Volume du cylindre", "Volume of cylinder"],
  ["Volume du cone", "Volume of cone"],
  ["Volume de la pyramide", "Volume of pyramid"],
  ["Suite arith", "Arith. seq."],
  ["Somme arith", "Arith. sum"],
  ["Suite geo", "Geo. seq."],
  ["Somme geo", "Geo. sum"],
  ["cas favorables", "favorable outcomes"],
  ["cas possibles", "possible outcomes"],
  ["Discriminant", "Discriminant"],
  ["Pythagore", "Pythagorean th."],
  ["Thales", "Thales"],
  ["Probabilite", "Probability"],
  ["Combinaisons", "Combinations"],
  ["Moyenne", "Mean"],
  ["Variance", "Variance"],

  // ===================== EXAM TITLES & HEADERS =====================
  ["Epreuve de mathematiques du BEPC", "BEPC Mathematics Exam"],
  ["Epreuve de mathematiques du Baccalaureat D", "Baccalaureate D Mathematics Exam"],
  ["L'epreuve comporte trois parties independantes A, B et C", "The exam consists of three independent parts A, B and C"],
  ["L'epreuve comporte trois exercices et un probleme.", "The exam consists of three exercises and a problem."],
  ["A- ACTIVITES NUMERIQUES :", "A- NUMERICAL ACTIVITIES:"],
  ["B - ACTIVITES GEOMETRIQUES :", "B- GEOMETRY ACTIVITIES:"],
  ["B- ACTIVITES GEOMETRIQUES :", "B- GEOMETRY ACTIVITIES:"],
  ["C- PROBLEME :", "C- PROBLEM:"],
  ["EXERCICE", "EXERCISE"],
  ["Exercice", "Exercise"],
  ["PROBLEME", "PROBLEM"],
  ["PARTIE A", "PART A"],
  ["PARTIE B", "PART B"],
  ["Deux exercices independants I et II.", "Two independent exercises I and II."],

  // ===================== COMMON MATH INSTRUCTION VERBS =====================
  ["Ecrire", "Write"],
  ["Montrer que", "Show that"],
  ["Demontrer que", "Prove that"],
  ["Demontrer", "Prove"],
  ["Calculer", "Calculate"],
  ["Determiner", "Determine"],
  ["Factoriser", "Factor"],
  ["Resoudre", "Solve"],
  ["Simplifier", "Simplify"],
  ["Tracer", "Draw"],
  ["Construire", "Construct"],
  ["Verifier que", "Verify that"],
  ["Verifier", "Verify"],
  ["En deduire", "Deduce"],
  ["Dresser le tableau de variation", "Draw the variation table"],
  ["Dresser le tableau de variation de", "Draw the variation table of"],
  ["Etudier les variations de", "Study the variations of"],
  ["Etudier les variations", "Study the variations"],
  ["Etudier le sens de variation de", "Study the direction of variation of"],
  ["Etudier la monotonie de", "Study the monotonicity of"],
  ["Donner un encadrement de", "Give bounds for"],
  ["Donner un encadrement", "Give bounds"],
  ["Exprimer", "Express"],
  ["Preciser", "Specify"],
  ["Trouver", "Find"],
  ["Recopier et completer", "Copy and complete"],
  ["Completer la ligne des frequences", "Complete the frequency row"],
  ["Representer par un diagramme circulaire", "Represent using a pie chart"],
  ["Diagramme circulaire", "Pie chart"],
  ["Realiser cette figure", "Draw this figure"],
  ["Montrer par recurrence que", "Show by induction that"],
  ["Montrer par recurrence", "Show by induction"],
  ["Construire l'image de", "Construct the image of"],

  // ===================== COMMON MATH NOUNS / PHRASES =====================
  ["On donne l'expression", "Given the expression"],
  ["On donne", "Given"],
  ["On considere", "Consider"],
  ["Soit", "Let"],
  ["Soient", "Let"],
  ["sous la forme", "in the form"],
  ["Sous forme de fraction irreductible", "As an irreducible fraction"],
  ["Sous forme decimale", "In decimal form"],
  ["le resultat", "the result"],
  ["et donner le resultat", "and give the result"],
  ["repere orthonorme", "orthonormal coordinate system"],
  ["dans un repere orthonorme", "in an orthonormal coordinate system"],
  ["du plan", "of the plane"],
  ["perpendiculaire a", "perpendicular to"],
  ["passant par", "passing through"],
  ["parallele a", "parallel to"],
  ["les droites", "the lines"],
  ["sont paralleles", "are parallel"],
  ["sont perpendiculaires", "are perpendicular"],
  ["Nature du triangle", "Nature of the triangle"],
  ["Nature de", "Nature of"],
  ["le tableau suivant", "the following table"],
  ["le point d'intersection", "the point of intersection"],
  ["la tangente a", "the tangent to"],
  ["la translation de vecteur", "the translation by vector"],
  ["les images respectives de", "the respective images of"],
  ["triangle equilateral", "equilateral triangle"],
  ["de cote", "with side"],
  ["le milieu du segment", "the midpoint of segment"],
  ["milieu de", "midpoint of"],
  ["symetrique de", "symmetric of"],
  ["par rapport a", "with respect to"],
  ["le point de concours des medianes", "the intersection point of the medians"],
  ["les medianes", "the medians"],
  ["la mediatrice de", "the perpendicular bisector of"],
  ["le cercle de diametre", "the circle with diameter"],
  ["le cercle circonscrit", "the circumscribed circle"],
  ["la droite perpendiculaire au plan", "the line perpendicular to the plane"],
  ["pyramide reguliere", "regular pyramid"],
  ["de base triangulaire", "with triangular base"],
  ["de hauteur", "with height"],
  ["le volume", "the volume"],
  ["tetraedre regulier", "regular tetrahedron"],
  ["Un cote d'un rectangle mesure", "One side of a rectangle measures"],
  ["Le perimetre et l'aire", "The perimeter and area"],
  ["Tableau des notes des eleves", "Table of student grades"],
  ["Vrai ou faux", "True or false"],
  ["classes d'amplitude", "classes of width"],
  ["le point de", "the point of"],
  ["les coordonnees de", "the coordinates of"],
  ["Coordonnees de", "Coordinates of"],
  ["superposables", "congruent"],
  ["Mesure en degres", "Measure in degrees"],
  ["Figure", "Figure"],
  ["la fonction definie sur", "the function defined on"],
  ["definie sur", "defined on"],
  ["definie par", "defined by"],
  ["les limites de", "the limits of"],
  ["aux bornes de", "at the boundaries of"],
  ["son ensemble de definition", "its domain"],
  ["son domaine", "its domain"],
  ["la courbe representative de", "the representative curve of"],
  ["la courbe de", "the curve of"],
  ["Tracer la courbe", "Draw the curve"],
  ["les extremums de", "the extrema of"],
  ["Equation de la tangente", "Equation of the tangent"],
  ["l'equation de la tangente", "the equation of the tangent"],
  ["l'equation du cercle", "the equation of the circle"],
  ["l'asymptote oblique", "the oblique asymptote"],
  ["la suite", "the sequence"],
  ["est geometrique", "is geometric"],
  ["est croissante", "is increasing"],
  ["est decroissante", "is decreasing"],
  ["est convergente", "is convergent"],
  ["sa raison", "its common ratio"],
  ["son premier terme", "its first term"],
  ["en fonction de", "as a function of"],
  ["la limite de", "the limit of"],
  ["l'integrale", "the integral"],
  ["la probabilite", "the probability"],
  ["au hasard", "at random"],
  ["la loi de", "the distribution of"],
  ["l'esperance", "the expected value"],
  ["la variance", "the variance"],
  ["variable aleatoire", "random variable"],
  ["boules rouges", "red balls"],
  ["boules blanches", "white balls"],
  ["boules bleues", "blue balls"],
  ["une boule rouge", "a red ball"],
  ["sans remise", "without replacement"],
  ["avec remise", "with replacement"],
  ["simultanement", "simultaneously"],
  ["successivement", "successively"],
  ["independants", "independent"],
  ["Nombres complexes", "Complex numbers"],
  ["parallelogramme", "parallelogram"],
  ["rectangle en", "right-angled at"],
  ["la hauteur issue de", "the altitude from"],
  ["l'orthocentre", "the orthocenter"],
  ["centre de gravite", "center of gravity"],
  ["le rayon du cercle", "the radius of the circle"],
  ["Point d'inflexion", "Inflection point"],
  ["Tangente a l'origine", "Tangent at the origin"],
  ["Courbe", "Curve"],
  ["Limites", "Limits"],
  ["Variations", "Variations"],
  ["Tableau de variation", "Variation table"],
  ["les points d'intersection", "the intersection points"],
  ["des habitants", "of the inhabitants"],
  ["d'un arrondissement", "of a district"],
  ["ont moins de", "are under"],
  ["ont entre", "are between"],
  ["ont plus de", "are over"],
  ["habitants", "inhabitants"],
  ["Combien y a-t-il", "How many are there"],
  ["Tranches d'age", "Age range"],
  ["Nombre d'habitants", "Number of inhabitants"],
  ["Frequences", "Frequencies"],
  ["Moins de", "Under"],
  ["Entre", "Between"],
  ["Plus de", "Over"],
  ["repartition de la population", "population distribution"],
  ["a partir du tableau ci-dessus", "from the table above"],
  ["les phrases suivantes", "the following sentences"],
  ["On notera", "We denote"],
  ["On rappelle que", "Recall that"],
  ["On admettra que", "It is assumed that"],
  ["est donne par la formule", "is given by the formula"],
  ["la valeur exacte de", "the exact value of"],
  ["est egale a", "is equal to"],
  ["ans", "years old"],

  // ===================== EVALUATION LABELS =====================
  ["Evaluation", "Assessment"],
  ["BEPC Blanc", "Mock BEPC"],
  ["Probatoire Blanc", "Mock Probatoire"],
  ["Bac Blanc", "Mock Bac"],
])

// ---- Normalize function: strip accents, normalize quotes & whitespace ----
function normalize(s: string): string {
  return s
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u2018\u2019\u2032\u00B4`]/g, "'")
    .replace(/[\u201C\u201D\u00AB\u00BB]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/\u2026/g, "...")
    .replace(/\u00A0/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

// Build a normalized lookup map for faster matching
const NORMALIZED_MAP = new Map<string, string>()
for (const [fr, en] of FULL_TEXT.entries()) {
  NORMALIZED_MAP.set(normalize(fr), en)
}

/**
 * Translates a French string to English.
 * 1. Exact match in full-text dictionary (accent-insensitive)
 * 2. Returns original string if no match found
 */
export function autoTranslate(text: string): string {
  if (!text || typeof text !== "string") return text

  // Try exact match (normalized)
  const norm = normalize(text)
  const exact = NORMALIZED_MAP.get(norm)
  if (exact) return exact

  // Try trimmed match
  const trimmed = normalize(text.trim())
  const trimmedMatch = NORMALIZED_MAP.get(trimmed)
  if (trimmedMatch) return trimmedMatch

  // For formula text with LaTeX: extract non-LaTeX parts and translate those
  if (text.includes("$")) {
    // Protect LaTeX segments
    const segments: string[] = []
    let result = text.replace(/\$[^$]+\$/g, (m) => {
      segments.push(m)
      return `\x00${segments.length - 1}\x00`
    })

    // Try to translate the non-latex text
    const normResult = normalize(result)
    const match = NORMALIZED_MAP.get(normResult)
    if (match) {
      // Restore LaTeX in translated text
      let translated = match
      segments.forEach((seg, i) => {
        translated = translated.replace(`\x00${i}\x00`, seg)
      })
      return translated
    }

    // Try phrase-by-phrase replacement on non-latex parts (longest first)
    let changed = false
    const sortedPhrases = [...FULL_TEXT.entries()].sort((a, b) => b[0].length - a[0].length)
    for (const [fr, en] of sortedPhrases) {
      if (fr.length < 3) continue
      const normFr = normalize(fr)
      if (result.toLowerCase().includes(normFr.toLowerCase())) {
        result = result.replace(new RegExp(escapeRegex(normFr), "gi"), en)
        changed = true
      }
    }
    if (changed) {
      // Restore LaTeX
      segments.forEach((seg, i) => {
        result = result.replace(`\x00${i}\x00`, seg)
      })
      return result
    }

    // No match found, return original
    return text
  }

  // Try phrase-by-phrase replacement on non-LaTeX text too
  {
    let result = text
    let changed = false
    const sortedPhrases = [...FULL_TEXT.entries()].sort((a, b) => b[0].length - a[0].length)
    for (const [fr, en] of sortedPhrases) {
      if (fr.length < 4) continue
      const normFr = normalize(fr)
      if (result.toLowerCase().includes(normFr.toLowerCase())) {
        result = result.replace(new RegExp(escapeRegex(normFr), "gi"), en)
        changed = true
      }
    }
    if (changed) return result
  }

  // For multi-line text (biographies etc), check BIO_TRANSLATIONS first
  if (text.includes("\n")) {
    // Check if this is a biography by looking up in BIO_TRANSLATIONS values
    for (const [name, enBio] of BIO_TRANSLATIONS.entries()) {
      // Compare normalized first 40 chars to identify the bio
      const normBioStart = normalize(text.substring(0, 80))
      const normNameInText = normalize(name)
      if (normBioStart.includes(normNameInText)) {
        return enBio
      }
    }
  }

  // No translation found - return original French text unchanged
  // (better than broken franglais)
  return text
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

// ===================== BIOGRAPHY TRANSLATIONS =====================
// Stored separately due to size - keyed by mathematician name
const BIO_TRANSLATIONS: Map<string, string> = new Map([
  ["Abraham bar Hiyya", "Abraham bar Hiyya (c. 1070-1136) was a Jewish mathematician, astronomer and philosopher born in Barcelona, Spain. Also known by his Latin name Savasorda, he held official positions with the Christian rulers of the Iberian Peninsula. He is considered one of the very first transmitters of Arab sciences to Christian Europe, at a time when intellectual exchanges between the two civilizations were still rare.\n\nHis major work, the 'Hibbur ha-Meshihah ve-ha-Tishboret' (Treatise on Measurement and Calculation), is the first book of mathematics written in Hebrew. This encyclopedic text covers practical geometry, calculations of areas and volumes, as well as quadratic equations. Abraham bar Hiyya presents algebraic methods that were known in the Arab world but completely unknown in Western Europe.\n\nHe also wrote treatises on astronomy, notably the 'Sefer ha-Ibbur' devoted to the calendar and astronomical calculations. His work of translation and popularization played a crucial role in the transmission of mathematical and scientific knowledge to medieval European universities. He collaborated with Plato of Tivoli to translate several Arabic texts into Latin, thus contributing to the translation movement that would transform Western science.\n\nAbraham bar Hiyya is also an important philosopher of medieval Jewish thought. His philosophical work 'Megillat ha-Megalleh' blends metaphysical reflections and astrological calculations. His contribution to the history of mathematics is that of a bridge between Arab, Jewish and Latin traditions, at a pivotal moment in the intellectual history of Europe."],
  ["Abu Kamil Shuja ibn Aslam", "Abu Kamil Shuja ibn Aslam (c. 850-930) was an Egyptian mathematician considered the most important successor of Al-Khwarizmi in the field of algebra. Born in Cairo, he dedicated his life to perfecting and extending the algebraic methods inaugurated by his Persian predecessor.\n\nHis main work, the 'Kitab fi al-jabr wal-muqabala', goes well beyond Al-Khwarizmi's treatise. Abu Kamil introduces powers higher than two in equations, deals with irrationals with new rigor and solves systems of equations with several unknowns. He was the first to systematically use powers of the unknown (such as $x^4$, $x^5$) in his algebraic calculations.\n\nHis work on regular pentagons and decagons shows his mastery of geometry linked to algebra. He also wrote about the commercial applications of mathematics, showing the link between theory and practice. His influence on European mathematics was considerable: Fibonacci drew directly from his works in the famous 'Liber Abaci' in the 13th century. Abu Kamil is therefore an essential link in the chain of transmission of mathematical knowledge from the Arab world to medieval Europe."],
  ["Aderemi Kuku", "Aderemi Kuku (born 1941 in Ijebu-Ode, Nigeria) is a Nigerian mathematician of international renown, specializing in algebraic K-theory and homological algebra. He is professor emeritus at the University of Ibadan, Nigeria, and has taught at several major universities around the world.\n\nKuku was the first African mathematician to be elected to the executive council of the International Mathematical Union (IMU), where he served from 1995 to 2002. This distinction reflects his major role in the development of mathematics on the African continent. His research focuses on K-theory of orders, equivariant K-theory groups and applications of homological algebra to number theory.\n\nHe has published more than 80 articles in international journals and is the author of several reference works, including 'Representation Theory and Higher Algebraic K-Theory'. Kuku has trained dozens of doctoral students and played a key role in creating mathematics programs in Africa. He was a member of the International Commission on Mathematical Instruction (ICMI) committee and received numerous awards for his exceptional contribution to African science."],
  ["Ahmes", "Ahmes (c. 1680-1620 BC) was an ancient Egyptian scribe, author of the famous Rhind Papyrus, one of the oldest known mathematical documents in human history. This papyrus, purchased by Scotsman Alexander Henry Rhind in Luxor in 1858, measures about 5 meters long and 33 centimeters wide.\n\nThe papyrus contains 84 mathematical problems with their solutions. It includes arithmetic exercises (addition, subtraction, multiplication, division), geometry (calculating areas of triangles, rectangles, circles and trapezoids), as well as elementary algebra problems (linear equations). The Egyptians used unit fractions (of the form 1/n) in a very sophisticated manner.\n\nAhmes copied this document from an older text dating from the reign of Amenemhat III (c. 1850 BC), but added his own annotations and clarifications. The papyrus reveals that the Egyptians of this era knew an approximation of $\\pi$ (they used the value $(16/9)^2 \\approx 3.16$), mastered arithmetic and geometric progressions, and could solve first-degree equations.\n\nAhmes' work testifies to the high level of mathematical sophistication achieved by ancient Egyptian civilization, long before Greek developments. It represents an invaluable heritage for the history of mathematics and shows that Africa was one of the first cradles of mathematical thought."],
  ["Al-Khwarizmi", "Muhammad ibn Musa al-Khwarizmi (c. 780-850) was a Persian mathematician, astronomer and geographer who lived and worked in Baghdad under the Abbasid caliphate. He is universally considered the father of algebra and one of the most influential mathematicians of all time.\n\nHis foundational work, 'Al-Kitab al-mukhtasar fi hisab al-jabr wal-muqabala' (The Compendious Book on Calculation by Completion and Balancing), gave birth to the word 'algebra' (al-jabr). In this treatise, Al-Khwarizmi presents methods for solving first and second degree equations systematically, using both algorithmic and geometric approaches. It is the first work to treat algebra as a discipline in its own right.\n\nThe word 'algorithm' itself derives from the Latinization of his name (Algoritmi). His treatise on the Indian numeral system introduced Indo-Arabic numerals (0, 1, 2, ..., 9) to the West, revolutionizing calculation methods. Before that, Europeans used Roman numerals, which were far less practical.\n\nAl-Khwarizmi also wrote works on astronomy, trigonometric tables and a treatise on geography describing the coordinates of more than 2400 locations. He worked at the famous House of Wisdom (Bayt al-Hikma) in Baghdad, a major intellectual center of the medieval world.\n\nHis legacy is immense: he laid the foundations of modern algebra, popularized the decimal system and profoundly influenced European mathematics through the Latin translations of his works in the 12th century."],
  ["Alexander Grothendieck", "Alexander Grothendieck (1928-2014) was a Franco-German mathematician considered one of the greatest of the 20th century. He revolutionized algebraic geometry by creating the theory of schemes. Fields Medal in 1966, he left the academic world in 1970 for political and ecological reasons."],
  ["Apollonius of Perga", "Apollonius of Perga (c. 262-190 BC) was a Greek mathematician known for his treatise 'Conics' in which he systematically studies ellipses, parabolas and hyperbolas. His work profoundly influenced astronomy and physics for two millennia."],
  ["Augustin-Louis Cauchy", "Augustin-Louis Cauchy (1789-1857) was a French mathematician who founded modern analysis. He rigorously defined the notions of limit, continuity and convergence. His contributions in complex analysis, group theory and elasticity are fundamental. He published over 800 articles."],
  ["Benoit Mandelbrot", "Benoit Mandelbrot (1924-2010) was a Franco-American mathematician of Polish origin, father of fractal geometry. His famous Mandelbrot set showed that simple formulas can generate infinite complexity. His work has applications in meteorology, finance and computer science."],
  ["Bhaskara II", "Bhaskara II (1114-1185) was an Indian mathematician and astronomer. His work 'Lilavati' covers arithmetic, algebra and geometry. He discovered certain principles of differential calculus centuries before Newton and Leibniz, and worked on Pell's equations."],
  ["Brahmagupta", "Brahmagupta (598-668) was an Indian mathematician and astronomer. He was the first to formulate rules for calculating with zero and negative numbers. His formula for the area of a cyclic quadrilateral bears his name. He also solved second-degree indeterminate equations."],
  ["Carl Friedrich Gauss", "Carl Friedrich Gauss (1777-1855), nicknamed the 'Princeps mathematicorum' (Prince of Mathematicians), was a German mathematician, physicist and astronomer born in Brunswick to a modest family. At age 3, he was correcting his father's payroll calculations, and at 10, he astonished his teacher by instantly calculating the sum of integers from 1 to 100 using the formula $n(n+1)/2$.\n\nHis 'Disquisitiones Arithmeticae', published at age 24, is a masterpiece that founded modern number theory. He proved the law of quadratic reciprocity and studied quadratic forms. Gauss also proved the fundamental theorem of algebra (every polynomial of degree $n$ has exactly $n$ complex roots) and invented the method of least squares, fundamental in statistics.\n\nIn astronomy, he recovered the position of the asteroid Ceres using his calculation methods. In physics, he contributed to magnetism (the unit of magnetic field bears his name: the gauss) and optics. In geometry, he pioneered differential geometry of surfaces with his 'Theorema Egregium'.\n\nGauss had a reputation for only publishing perfect results, keeping many discoveries to himself. After his death, it was discovered that he had anticipated non-Euclidean geometries and many results in complex analysis. His influence on mathematics is immense and touches practically every field: number theory, analysis, algebra, geometry, probability, mathematical physics and geodesy."],
  ["Christine Darden", "Christine Darden (born 1942) is an American mathematician and engineer at NASA. A specialist in supersonic aerodynamics, she worked on reducing noise from supersonic aircraft. She is one of the African-American 'human computers' recently brought to light."],
  ["Danica McKellar", "Danica McKellar (born 1975) is an American mathematician and actress. A UCLA mathematics graduate, she co-authored a theorem in graph theory (the Chayes-McKellar-Winn theorem). She is best known for her popular books encouraging young girls to love math."],
  ["David Blackwell", "David Blackwell (1919-2010) was an American mathematician and statistician, the first African-American elected to the National Academy of Sciences. His contributions in game theory, probability and Bayesian statistics are major. The Rao-Blackwell theorem partially bears his name."],
  ["David Hilbert", "David Hilbert (1862-1943) was a German mathematician, one of the most influential at the turn of the 20th century. He formulated 23 famous problems in 1900 that guided mathematical research. His work covers invariant theory, Hilbert spaces and the foundations of mathematics."],
  ["Diophante", "Diophantus of Alexandria (c. 210-295) was a Greek mathematician often called the 'father of algebra'. His work 'Arithmetica' contains problems of equations with integer or rational solutions, called Diophantine equations. His work inspired Fermat for his famous last theorem."],
  ["Dorothy Vaughan", "Dorothy Vaughan (1910-2008) was an American mathematician and computer scientist who worked at NASA. She was the first African-American supervisor at NACA. A FORTRAN expert, she contributed to the calculations for the first space missions. Her story is told in the film 'Hidden Figures'."],
  ["Emmy Noether", "Emmy Noether (1882-1935) was a German mathematician considered the most important woman in the history of mathematics. Her Noether's theorem relates symmetries and conservation laws in physics. She revolutionized abstract algebra with her work on rings and ideals."],
  ["Eratosthene de Cyrene", "Eratosthenes (c. 276-194 BC) was a Greek mathematician, geographer and astronomer. He is famous for measuring the circumference of the Earth with remarkable accuracy. In mathematics, his 'Sieve of Eratosthenes' is an efficient method for finding prime numbers."],
  ["Euclide d'Alexandrie", "Euclid of Alexandria (c. 330-270 BC) was a Greek mathematician considered the father of geometry. Little is known about his personal life, but he taught and worked in Alexandria, Egypt, under the reign of Ptolemy I.\n\nHis major work, the 'Elements' (Stoicheia), is one of the most influential works ever written in human history. Composed of 13 books, this treatise gathers and logically organizes virtually all the mathematical knowledge of Greek antiquity. The first six books deal with plane geometry, the next three with number theory, and the last four with solid geometry.\n\nEuclid's approach is revolutionary in its rigor: he starts from definitions, postulates (axioms) and common notions, then deduces all theorems by logical reasoning. His fifth postulate, about parallel lines, fascinated mathematicians for over 2000 years and eventually led to the discovery of non-Euclidean geometries in the 19th century.\n\nAmong the famous results of the Elements: the Pythagorean theorem (proposition I.47), the proof of the infinitude of prime numbers (proposition IX.20), and Euclid's algorithm for calculating the GCD of two numbers. The latter is still used today in computer science and cryptography.\n\nThe Elements served as the standard mathematics textbook in the Western world for over two millennia. With more than 1000 editions published since the invention of printing, it is one of the most reprinted books in history, just after the Bible. Euclid's legacy goes beyond mathematics: his axiomatic method inspired philosophy (Spinoza), physics (Newton) and modern formal logic."],
  ["Euphemia Lofton Haynes", "Euphemia Lofton Haynes (1890-1980) was the first African-American woman to earn a doctorate in mathematics, at the Catholic University of America in 1943. She taught for over 47 years in Washington schools and advocated for school integration."],
  ["Fatma Moalla", "Fatma Moalla is a Tunisian mathematician, professor at the University of Tunis. She specializes in functional analysis and partial differential equations. She is one of the pioneers of mathematics in Tunisia and has trained many African researchers."],
  ["Felix Klein", "Felix Klein (1849-1925) was a German mathematician known for his Erlangen program which unifies geometries through group theory. His Klein bottle is a famous topological object. He also contributed to mathematics education and elliptic functions."],
  ["Francis Kofi Allotey", "Francis Kofi Allotey (1932-2017) was a Ghanaian physicist and mathematician. He is known for the 'Allotey technique' in X-ray physics. The first Ghanaian to obtain a doctorate in mathematical physics, he was president of the African Mathematical Society."],
  ["George Polya", "George Polya (1887-1985) was a Hungarian-American mathematician famous for his work in combinatorics, probability and mathematical education. His book 'How to Solve It' is a world reference for teaching problem solving."],
  ["Gladys West", "Gladys West (born 1930) is an American mathematician whose geodesic calculations contributed to the development of GPS. Working at the Dahlgren Naval Base, she programmed computers to model the Earth's shape with unprecedented precision."],
  ["Gottfried Wilhelm Leibniz", "Gottfried Wilhelm Leibniz (1646-1716) was a German mathematician and philosopher, co-inventor of infinitesimal calculus independently of Newton. His notation (dx, integral) is still used today. He also invented the binary system and contributed to formal logic."],
  ["Hajer Bahouri", "Hajer Bahouri is a Franco-Tunisian mathematician specializing in partial differential equations and harmonic analysis. Professor at Paris-Est Creteil University, she co-authored reference works on Sobolev spaces and Fourier analysis."],
  ["Henri Poincare", "Henri Poincare (1854-1912) was a French mathematician considered the last universalist. He founded algebraic topology, contributed to chaos theory and formulated the Poincare conjecture (proved in 2003). His work in mathematical physics also influenced relativity."],
  ["Hypsicles d'Alexandrie", "Hypsicles (c. 190-120 BC) was a Greek mathematician and astronomer. He is the author of 'Book XIV' of Euclid's Elements, dealing with regular polyhedra. He is also the first Greek to divide the zodiac circle into 360 degrees."],
  ["Ibn al-Haytham", "Ibn al-Haytham (965-1040) was an Arab mathematician and physicist, father of modern optics. His 'Book of Optics' influenced Kepler and Newton. In mathematics, he worked on perfect numbers, analytical geometry and the experimental scientific method."],
  ["Isaac Barrow", "Isaac Barrow (1630-1677) was an English mathematician, Newton's predecessor at Cambridge. He contributed to the fundamental theorem of calculus by linking differentiation and integration. He is considered one of the pioneers of infinitesimal calculus before Newton and Leibniz."],
  ["John Forbes Nash", "John Forbes Nash (1928-2015) was an American mathematician, Nobel Prize in Economics 1994. His Nash equilibrium in game theory is fundamental in economics and strategy. His struggle with schizophrenia is told in the film 'A Beautiful Mind'."],
  ["Josephine Guidy-Wandja", "Josephine Guidy-Wandja (born 1945) is the first African woman to earn a doctorate in mathematics (in 1972). From Ivory Coast, she specializes in algebra and has contributed to the development of mathematics education in French-speaking Africa."],
  ["Joseph-Louis Lagrange", "Joseph-Louis Lagrange (1736-1813) was a Franco-Italian mathematician and astronomer. He reformulated classical mechanics (Lagrange equations), contributed to number theory and algebra. His 'Analytical Mechanics' is a masterpiece using only calculus without figures."],
  ["Katherine Johnson", "Katherine Johnson (1918-2020) was an American mathematician at NASA. Her orbital trajectory calculations were essential to the first American space flights, including John Glenn's. Her story is told in 'Hidden Figures'. Awarded the Presidential Medal of Freedom in 2015."],
  ["Leonhard Euler", "Leonhard Euler (1707-1783) was a Swiss mathematician, the most prolific in history with over 800 publications. He introduced the notations $f(x)$, $e$, $i$, $\\pi$ and $\\sum$. His contributions cover analysis, graph theory, mechanics and astronomy."],
  ["Mamphono Khaketa", "Mamphono Khaketa is a mathematician from Lesotho and former Minister of Communications. Trained in applied mathematics, she advocates for women's scientific education in Southern Africa and the digitization of public services."],
  ["Marjorie Lee Browne", "Marjorie Lee Browne (1914-1979) was one of the first African-American women to earn a doctorate in mathematics (1949). A professor at the University of North Carolina, she contributed to topology and advocated for minorities' access to higher education."],
  ["Mary Everest Boole", "Mary Everest Boole (1832-1916) was an English mathematician and educator, wife of George Boole. She developed innovative methods for teaching mathematics to children, using games and hands-on activities. Her 'Boole cards' are recognized educational tools."],
  ["Mary Jackson", "Mary Jackson (1921-2005) was NASA's first African-American female engineer. She worked on wind tunnels and aeronautical propulsion. After 20 years of engineering, she became responsible for promoting women and minorities at NASA."],
  ["Michael Atiyah", "Michael Atiyah (1929-2019) was a British-Lebanese mathematician, Fields Medal 1966. The Atiyah-Singer index theorem connects analysis, topology and geometry. He also contributed to K-theory and the links between mathematics and theoretical physics."],
  ["Niels Henrik Abel", "Niels Henrik Abel (1802-1829) was a Norwegian mathematician who died at 26. He proved the impossibility of solving the general fifth-degree equation by radicals. Abelian functions and the Abel Prize bear his name. His work founded group theory."],
  ["Omar Khayyam", "Omar Khayyam (1048-1131) was a Persian mathematician, astronomer and poet. He classified and solved cubic equations by geometric methods. He also reformed the Persian calendar with precision superior to the Gregorian calendar. His 'Rubaiyat' are famous in literature."],
  ["Paul Erdos", "Paul Erdos (1913-1996) was a Hungarian mathematician, one of the most prolific with over 1500 articles. He contributed to combinatorics, graph theory, number theory and probability. The 'Erdos number' measures mathematical collaboration."],
  ["Peter Scholze", "Peter Scholze (born 1987) is a German mathematician, Fields Medal 2018. He revolutionized arithmetic geometry by creating the theory of perfectoid spaces. Germany's youngest full professor at 24, he is considered a genius of his generation."],
  ["Pierre de Fermat", "Pierre de Fermat (1601-1665) was a French mathematician, co-founder of probability theory and pioneer of infinitesimal calculus. His 'last theorem', written in the margin of a book, was only proved in 1995 by Andrew Wiles after 358 years of effort."],
  ["Pierre-Simon Laplace", "Pierre-Simon Laplace (1749-1827) was a French mathematician and astronomer. His 'Celestial Mechanics' perfected astronomy. In mathematics, he contributed to probability, differential equations (Laplace transform) and potential theory."],
  ["Pythagore de Samos", "Pythagoras of Samos (c. 570-495 BC) was a Greek mathematician and philosopher born on the island of Samos, in the Aegean Sea. After traveling to Egypt, Babylon and possibly India, he settled in Croton, in southern Italy, where he founded a philosophical and mathematical school known as the 'Pythagorean sect'.\n\nHis famous theorem states that in any right triangle, the square of the hypotenuse equals the sum of the squares of the other two sides: $a^2 + b^2 = c^2$. Although particular cases of this result were known to the Babylonians and Egyptians, Pythagoras (or his school) was the first to give a general proof. This theorem is one of the most fundamental in all of geometry and is still taught worldwide.\n\nPythagorean philosophy rests on the conviction that 'all is number'. The Pythagoreans discovered numerical ratios in music (string lengths and harmonic intervals), properties of figurate numbers (triangular, square, etc.) and perfect numbers. They also made the troubling discovery of irrational numbers ($\\sqrt{2}$), which challenged their worldview.\n\nThe Pythagorean school functioned as a closed community with strict rules. Its members practiced vegetarianism, secrecy and the sharing of discoveries. Pythagoras' influence on Greek philosophy is immense: Plato, Aristotle and Euclid drew on his work. The Pythagorean theorem remains today one of the pillars of mathematical education and finds applications in architecture, navigation, physics and computer science."],
  ["Ramanujan", "Srinivasa Ramanujan (1887-1920) was a self-taught Indian mathematician whose intuitive genius is legendary. He discovered about 3900 formulas in number theory, continued fractions and infinite series. His collaboration with Hardy at Cambridge produced remarkable results despite a very short life."],
  ["Rene Descartes", "Rene Descartes (1596-1650) was a French mathematician and philosopher, father of analytic geometry. By linking algebra and geometry through Cartesian coordinates, he revolutionized mathematics. His 'Discourse on the Method' also transformed philosophy."],
  ["Riemann", "Bernhard Riemann (1826-1866) was a German mathematician whose work transformed geometry and analysis. His Riemannian geometry is the framework of Einstein's general relativity. The Riemann hypothesis about the zeros of the zeta function remains one of the greatest open problems."],
  ["Roselyn Epee Assoumou", "Roselyn Epee Assoumou is a Cameroonian mathematician, professor at the University of Douala. Specializing in numerical analysis and mathematical modeling, she contributes to the development of mathematical research in Cameroon and encourages young African women in science."],
  ["Sofia Kovalevskaya", "Sofia Kovalevskaya (1850-1891) was the first woman to obtain a doctorate in mathematics in Europe and the first female full professor. Her work on differential equations and the rotation of solid bodies is major. She had to fight against the prejudices of her time."],
  ["Sophie Germain", "Sophie Germain (1776-1831) was a self-taught French mathematician. She contributed to the theory of elasticity and number theory (Sophie Germain primes). She corresponded with Gauss under a male pseudonym to be taken seriously."],
  ["Terence Tao", "Terence Tao (born 1975) is an Australian-American mathematician, Fields Medal 2006. Considered the greatest living mathematician, his contributions cover harmonic analysis, differential equations, combinatorics and number theory. He proved results on prime numbers with Ben Green."],
  ["Thales de Milet", "Thales of Miletus (c. 625-545 BC) is considered the first Greek mathematician. His Thales' theorem on parallel lines and proportionality is taught worldwide. He is also the first to have predicted a solar eclipse and founded demonstrative geometry."],
  ["Wangari Maathai", "Wangari Maathai (1940-2011) was a Kenyan scientist, Nobel Peace Prize 2004. The first woman in East Africa to earn a doctorate, she studied biological and mathematical sciences. Founder of the Green Belt Movement, she planted over 30 million trees."],
  ["Yves Meyer", "Yves Meyer (born 1939) is a French mathematician, Abel Prize 2017. His work on wavelets revolutionized signal processing and image compression. Born in Tunisia, he contributed to harmonic analysis and mathematical quasicrystals."],
])

/**
 * Translates a mathematician's biography from French to English.
 * Returns the English version if available, otherwise the original French.
 */
export function translateBio(name: string): string | null {
  return BIO_TRANSLATIONS.get(name) || null
}
