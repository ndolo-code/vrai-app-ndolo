import { LOCAL_BEPC_YEARS } from "@/lib/bepc-local-data"
// ========================================
// NDOLOMATH — All static data
// ========================================

export interface ClassInfo {
  id: string
  label: string
  type: "cours" | "exam"
  examLabel?: string
  chapters: string[]
  examYearRange?: [number, number]
}

export const CLASSES: ClassInfo[] = [
  { id: "6e", label: "6e", type: "cours", chapters: ["Angles","Calcul litteral","Cercle","Cylindre de revolution","Droite du plan","Ensemble des entiers naturels","Figures symetriques par rapport a un point","Figures symetriques par rapport a une droite","Fractions","Nombres decimaux","Nombres decimaux relatifs","Paves droits","Parallelogrammes","Proportionnalite","Reperage d'un point sur une droite","Segments","Triangles"] },
  { id: "5e", label: "5e", type: "cours", chapters: ["Angles","Arithmetique","Calcul litteral","Cercle","Distances","Fractions","Nombres decimaux relatifs","Polygones","Prisme droit","Proportionnalite","Reperage d'un point","Statistiques","Symetries","Sphere","Triangles"] },
  { id: "4e", label: "4e", type: "cours", chapters: ["Arithmetique","Calcul litteral","Cercle (Pythagore, tangente)","Cone de revolution","Denombrement","Equations et inequations","Nombres rationnels","Plans et droites de l'espace","Proportionnalite","Pyramide","Reperage dans le plan","Statistiques","Translations","Triangles","Vecteurs"] },
  { id: "2ndeA", label: "2nde A", type: "cours", chapters: ["Calcul dans R","Calcul litteral","Denombrement","Equations, inequations et systemes","Fonctions","Proportionnalite","Statistiques"] },
  { id: "2ndeC", label: "2nde C", type: "cours", chapters: ["Angles inscrits et polygones reguliers","Angles orientes et trigonometrie","Droites et cercles du plan","Equations et inequations","Fonctions numeriques","Geometrie dans l'espace","Groupes","Nombres reels","Produit scalaire","Statistiques","Transformations du plan","Vecteurs du plan"] },
  { id: "3e", label: "3e", type: "exam", examLabel: "BEPC", chapters: ["Angles inscrits","Arithmetique","Calcul litteral","Configurations du plan","Denombrement","Equations et inequations","Nombres reels","Geometrie dans l'espace","Homoheties","Proportionnalite","Reperage dans le plan","Rotations","Statistiques","Translations et vecteurs","Vecteurs (produit par un reel)"], examYearRange: [1999, 2026] },
  { id: "1ereA", label: "1ere A", type: "exam", examLabel: "Probatoire A", chapters: ["Calcul dans R","Denombrement","Derivation","Equations et inequations","Fonctions numeriques","Generalites sur les fonctions","Logarithme decimal","Statistiques","Suites numeriques","Systemes d'equations"], examYearRange: [1999, 2026] },
  { id: "1ereC", label: "1ere C", type: "exam", examLabel: "Probatoire C", chapters: ["Angles orientes et trigonometrie","Applications du produit scalaire","Barycentre","Calcul matriciel","Denombrement","Derivation","Droites et cercles","Equations et inequations","Fonctions numeriques","Geometrie dans l'espace","Nombres complexes","Polynomes","Rotations","Statistiques","Suites numeriques","Transformations du plan","Vecteurs du plan"], examYearRange: [1999, 2026] },
  { id: "1ereD", label: "1ere D", type: "exam", examLabel: "Probatoire D", chapters: ["Angles orientes et trigonometrie","Applications du produit scalaire","Barycentre","Denombrement","Derivation","Droites et cercles","Equations et inequations","Fonctions numeriques","Geometrie dans l'espace","Nombres complexes","Polynomes","Rotations","Statistiques","Suites numeriques","Transformations du plan","Vecteurs du plan"], examYearRange: [1999, 2026] },
  { id: "TleA", label: "Tle A", type: "exam", examLabel: "Bac A", chapters: ["Calcul integral","Derivation","Equations differentielles","Fonctions exponentielles","Fonctions logarithmes","Fonctions numeriques","Probabilites","Statistiques","Suites numeriques"], examYearRange: [1999, 2026] },
  { id: "TleC", label: "Tle C", type: "exam", examLabel: "Bac C", chapters: ["Calcul integral","Calcul matriciel","Coniques","Derivation","Denombrement et probabilites","Equations differentielles","Espaces vectoriels","Fonctions exponentielles","Fonctions logarithmes","Fonctions numeriques","Geometrie dans l'espace","Isometries du plan","Nombres complexes","Similitudes","Suites numeriques","Transformations du plan"], examYearRange: [1999, 2026] },
  { id: "TleD", label: "Tle D", type: "exam", examLabel: "Bac D", chapters: ["Calcul integral","Coniques","Derivation","Denombrement et probabilites","Equations differentielles","Fonctions exponentielles","Fonctions logarithmes","Fonctions numeriques","Geometrie dans l'espace","Isometries du plan","Nombres complexes","Similitudes","Suites numeriques","Transformations du plan"], examYearRange: [1999, 2026] }
]

export function getExamYears(c: ClassInfo): number[] {
  if (c.id === "3e") return [...LOCAL_BEPC_YEARS].sort((a, b) => b - a)
  if (!c.examYearRange) return []
  const [s, e] = c.examYearRange
  const y: number[] = []
  for (let i = e; i >= s; i--) y.push(i)
  return y
}

export const CHAPTER_TIPS: Record<string, Record<string, string[]>> = {
  "3e": {},
}

export function getChapterTips(classId: string, chapter: string): string[] {
  return CHAPTER_TIPS[classId]?.[chapter] || []
}

// ===================== COUNTRY PHONE CODES =====================
export const COUNTRY_PHONE_CODES: Record<string, string> = {
  "Cameroun": "+237", "France": "+33", "Belgique": "+32", "Canada": "+1",
  "Suisse": "+41", "Cote d'Ivoire": "+225", "Senegal": "+221", "Gabon": "+241",
  "Congo": "+242", "Tchad": "+235", "Republique Centrafricaine": "+236",
  "Mali": "+223", "Burkina Faso": "+226", "Niger": "+227", "Togo": "+228",
  "Benin": "+229", "Guinee": "+224", "Madagascar": "+261",
  "Republique Democratique du Congo": "+243", "Mauritanie": "+222",
  "Comores": "+269", "Djibouti": "+253", "Haiti": "+509", "Tunisie": "+216",
  "Maroc": "+212", "Algerie": "+213", "Guinee Equatoriale": "+240", "Autre": "+",
}

export const COUNTRIES = Object.keys(COUNTRY_PHONE_CODES)

// ===================== MATHEMATICIANS WITH BIOS =====================
export interface MathBio { name: string; gender: "M" | "F"; bio: string }

export const MATHEMATICIANS_DATA: MathBio[] = [
  { name: "Abraham bar Hiyya", gender: "M", bio: "Abraham bar Hiyya (vers 1070-1136) est un mathematicien, astronome et philosophe juif ne a Barcelone, en Espagne. Egalement connu sous son nom latin Savasorda, il occupa des fonctions officielles aupres des souverains chretiens de la peninsule iberique. Il est considere comme l'un des tout premiers passeurs des sciences arabes vers l'Europe chretienne, a une epoque ou les echanges intellectuels entre les deux civilisations etaient encore rares.\n\nSon ouvrage majeur, le 'Hibbur ha-Meshihah ve-ha-Tishboret' (Traite de mesure et de calcul), est le premier livre de mathematiques ecrit en hebreu. Ce texte encyclopedique couvre la geometrie pratique, les calculs d'aires et de volumes, ainsi que les equations du second degre. Abraham bar Hiyya y presente des methodes de resolution algebrique qui etaient alors connues dans le monde arabe mais totalement inedites en Europe occidentale.\n\nIl a egalement redige des traites d'astronomie, notamment le 'Sefer ha-Ibbur' consacre au calendrier et aux calculs astronomiques. Son travail de traduction et de vulgarisation a joue un role crucial dans la transmission des savoirs mathematiques et scientifiques vers les universites medievales europeennes. Il collabora avec Platon de Tivoli pour traduire plusieurs textes arabes en latin, contribuant ainsi au mouvement de traduction qui allait transformer la science occidentale.\n\nAbraham bar Hiyya est aussi un philosophe important de la pensee juive medievale. Son ouvrage philosophique 'Megillat ha-Megalleh' mele reflexions metaphysiques et calculs astrologiques. Sa contribution a l'histoire des mathematiques est celle d'un pont entre les traditions arabe, juive et latine, a un moment charniere de l'histoire intellectuelle de l'Europe." },
  { name: "Abu Kamil Shuja ibn Aslam", gender: "M", bio: "Abu Kamil Shuja ibn Aslam (vers 850-930) est un mathematicien egyptien considere comme le plus important successeur d'Al-Khwarizmi dans le domaine de l'algebre. Ne au Caire, il a consacre sa vie a perfectionner et etendre les methodes algebriques inaugurees par son predecesseur perse.\n\nSon ouvrage principal, le 'Kitab fi al-jabr wal-muqabala', va bien au-dela du traite d'Al-Khwarizmi. Abu Kamil y introduit des puissances superieures a deux dans les equations, traite des irrationnels avec une rigueur nouvelle et resout des systemes d'equations a plusieurs inconnues. Il est le premier a utiliser systematiquement les puissances de l'inconnue (comme $x^4$, $x^5$) dans ses calculs algebriques.\n\nSes travaux sur les pentagones et les decagones reguliers montrent sa maitrise de la geometrie liee a l'algebre. Il a aussi ecrit sur les applications commerciales des mathematiques, montrant le lien entre theorie et pratique. Son influence sur les mathematiques europeennes fut considerable : Fibonacci s'inspira directement de ses ouvrages dans le celebre 'Liber Abaci' au XIIIe siecle. Abu Kamil constitue donc un maillon essentiel dans la chaine de transmission du savoir mathematique du monde arabe vers l'Europe medievale." },
  { name: "Aderemi Kuku", gender: "M", bio: "Aderemi Kuku (ne en 1941 a Ijebu-Ode, Nigeria) est un mathematicien nigerian de renommee internationale, specialise en K-theorie algebrique et en algebre homologique. Il est professeur emerite a l'Universite d'Ibadan, au Nigeria, et a enseigne dans plusieurs grandes universites a travers le monde.\n\nKuku est le premier mathematicien africain a avoir ete elu au conseil executif de l'Union Mathematique Internationale (UMI), ou il a servi de 1995 a 2002. Cette distinction temoigne de son role majeur dans le developpement des mathematiques sur le continent africain. Ses travaux de recherche portent sur la K-theorie des ordres, les groupes de K-theorie equivariante et les applications de l'algebre homologique a la theorie des nombres.\n\nIl a publie plus de 80 articles dans des revues internationales et est l'auteur de plusieurs ouvrages de reference, dont 'Representation Theory and Higher Algebraic K-Theory'. Kuku a forme des dizaines de doctorants et a joue un role cle dans la creation de programmes de mathematiques en Afrique. Il a ete membre du comite de la Commission internationale de l'enseignement mathematique (ICMI) et a recu de nombreuses distinctions pour sa contribution exceptionnelle a la science africaine." },
  { name: "Ahmes", gender: "M", bio: "Ahmes (vers 1680-1620 av. J.-C.) est un scribe egyptien de l'Antiquite, auteur du celebre papyrus Rhind, l'un des plus anciens documents mathematiques connus de l'humanite. Ce papyrus, achete par l'ecossais Alexander Henry Rhind a Louxor en 1858, mesure environ 5 metres de long et 33 centimetres de large.\n\nLe papyrus contient 84 problemes mathematiques accompagnes de leurs solutions. On y trouve des exercices d'arithmetique (addition, soustraction, multiplication, division), de geometrie (calcul d'aires de triangles, rectangles, cercles et trapezoids), ainsi que des problemes d'algebre elementaire (equations lineaires). Les Egyptiens y utilisent des fractions unitaires (de la forme 1/n) de maniere tres sophistiquee.\n\nAhmes a copie ce document a partir d'un texte plus ancien datant du regne d'Amenemhat III (vers 1850 av. J.-C.), mais y a apporte ses propres annotations et clarifications. Le papyrus revele que les Egyptiens de cette epoque connaissaient une approximation de $\\pi$ (ils utilisaient la valeur $(16/9)^2 \\approx 3.16$), maitrisaient les progressions arithmetiques et geometriques, et savaient resoudre des equations du premier degre.\n\nLe travail d'Ahmes temoigne du haut niveau de sophistication mathematique atteint par la civilisation egyptienne antique, bien avant les developpements grecs. Il represente un heritage inestimable pour l'histoire des mathematiques et montre que l'Afrique fut l'un des premiers berceaux de la pensee mathematique." },
  { name: "Al-Khwarizmi", gender: "M", bio: "Muhammad ibn Musa al-Khwarizmi (vers 780-850) est un mathematicien, astronome et geographe perse qui a vecu et travaille a Bagdad sous le califat abbasside. Il est universellement considere comme le pere de l'algebre et l'un des mathematiciens les plus influents de tous les temps.\n\nSon ouvrage fondateur, 'Al-Kitab al-mukhtasar fi hisab al-jabr wal-muqabala' (Abrege du calcul par la restauration et la comparaison), a donne naissance au mot 'algebre' (al-jabr). Dans ce traite, Al-Khwarizmi presente les methodes de resolution des equations du premier et du second degre de maniere systematique, en utilisant a la fois des approches algorithmiques et geometriques. C'est le premier ouvrage a traiter l'algebre comme une discipline a part entiere.\n\nLe mot 'algorithme' lui-meme derive de la latinisation de son nom (Algoritmi). Son traite sur le systeme de numeration indien a introduit les chiffres indo-arabes (0, 1, 2, ..., 9) en Occident, revolutionnant les methodes de calcul. Avant cela, les Europeens utilisaient les chiffres romains, beaucoup moins pratiques.\n\nAl-Khwarizmi a egalement redige des ouvrages d'astronomie, des tables trigonometriques et un traite de geographie qui decrit les coordonnees de plus de 2400 localites. Il a travaille a la celebre Maison de la Sagesse (Bayt al-Hikma) de Bagdad, un centre intellectuel majeur du monde medieval.\n\nSon heritage est immense : il a jete les bases de l'algebre moderne, popularise le systeme decimal et influence profondement les mathematiques europeennes a travers les traductions latines de ses oeuvres au XIIe siecle." },
  { name: "Alexander Grothendieck", gender: "M", bio: "Alexander Grothendieck (1928-2014) est un mathematicien franco-allemand considere comme l'un des plus grands du XXe siecle. Il a revolutionne la geometrie algebrique en creant la theorie des schemas. Medaille Fields en 1966, il a quitte le monde academique en 1970 pour des raisons politiques et ecologiques." },
  { name: "Apollonius of Perga", gender: "M", bio: "Apollonius de Perge (vers 262-190 av. J.-C.) est un mathematicien grec connu pour son traite 'Les Coniques' ou il etudie systematiquement les ellipses, paraboles et hyperboles. Ses travaux ont profondement influence l'astronomie et la physique pendant deux millenaires." },
  { name: "Augustin-Louis Cauchy", gender: "M", bio: "Augustin-Louis Cauchy (1789-1857) est un mathematicien francais qui a fonde l'analyse moderne. Il a rigoureusement defini les notions de limite, continuite et convergence. Ses contributions en analyse complexe, theorie des groupes et elasticite sont fondamentales. Il a publie plus de 800 articles." },
  { name: "Benoit Mandelbrot", gender: "M", bio: "Benoit Mandelbrot (1924-2010) est un mathematicien franco-americain d'origine polonaise, pere de la geometrie fractale. Son celebre ensemble de Mandelbrot a montre que des formules simples peuvent generer une complexite infinie. Ses travaux ont des applications en meteorologie, finance et informatique." },
  { name: "Bhaskara II", gender: "M", bio: "Bhaskara II (1114-1185) est un mathematicien et astronome indien. Son ouvrage 'Lilavati' couvre l'arithmetique, l'algebre et la geometrie. Il a decouvert certains principes du calcul differentiel des siecles avant Newton et Leibniz, et a travaille sur les equations de Pell." },
  { name: "Brahmagupta", gender: "M", bio: "Brahmagupta (598-668) est un mathematicien et astronome indien. Il est le premier a avoir formule des regles pour le calcul avec zero et les nombres negatifs. Sa formule pour l'aire d'un quadrilatere cyclique porte son nom. Il a aussi resolu des equations indeterminees du second degre." },
  { name: "Carl Friedrich Gauss", gender: "M", bio: "Carl Friedrich Gauss (1777-1855), surnomme le 'Princeps mathematicorum' (Prince des mathematiciens), est un mathematicien, physicien et astronome allemand ne a Brunswick dans une famille modeste. Des l'age de 3 ans, il corrigeait les calculs de paie de son pere, et a 10 ans, il stupefait son professeur en calculant instantanement la somme des entiers de 1 a 100 par la formule $n(n+1)/2$.\n\nSes 'Disquisitiones Arithmeticae', publiees a 24 ans, sont un chef-d'oeuvre qui a fonde la theorie moderne des nombres. Il y demontre la loi de reciprocite quadratique et etudie les formes quadratiques. Gauss a egalement demontre le theoreme fondamental de l'algebre (tout polynome de degre $n$ a exactement $n$ racines complexes) et invente la methode des moindres carres, fondamentale en statistique.\n\nEn astronomie, il a retrouve la position de l'asteroide Ceres grace a ses methodes de calcul. En physique, il a contribue au magnetisme (l'unite de champ magnetique porte son nom : le gauss) et a l'optique. En geometrie, il est le pionnier de la geometrie differentielle des surfaces avec son 'Theorema Egregium'.\n\nGauss avait la reputation de ne publier que des resultats parfaits, gardant pour lui de nombreuses decouvertes. On a decouvert apres sa mort qu'il avait anticipe les geometries non euclidiennes et de nombreux resultats d'analyse complexe. Son influence sur les mathematiques est immense et touche pratiquement tous les domaines : theorie des nombres, analyse, algebre, geometrie, probabilites, physique mathematique et geodesie." },
  { name: "Christine Darden", gender: "F", bio: "Christine Darden (nee en 1942) est une mathematicienne et ingenieuse americaine de la NASA. Specialiste de l'aerodynamique supersonique, elle a travaille sur la reduction du bruit des avions supersoniques. Elle est l'une des 'femmes calculatrices' afro-americaines mises en lumiere recemment." },
  { name: "Danica McKellar", gender: "F", bio: "Danica McKellar (nee en 1975) est une mathematicienne et actrice americaine. Diplomee de UCLA en mathematiques, elle a co-ecrit un theoreme en theorie des graphes (theoreme de Chayes-McKellar-Winn). Elle est surtout connue pour ses livres populaires encourageant les jeunes filles a aimer les maths." },
  { name: "David Blackwell", gender: "M", bio: "David Blackwell (1919-2010) est un mathematicien et statisticien americain, premier Afro-Americain elu a l'Academie nationale des sciences des Etats-Unis. Ses contributions en theorie des jeux, probabilites et statistique bayesienne sont majeures. Le theoreme de Rao-Blackwell porte partiellement son nom." },
  { name: "David Hilbert", gender: "M", bio: "David Hilbert (1862-1943) est un mathematicien allemand, l'un des plus influents du tournant du XXe siecle. Il a formule 23 problemes celebres en 1900 qui ont guide les recherches mathematiques. Ses travaux couvrent la theorie des invariants, les espaces de Hilbert et les fondements des mathematiques." },
  { name: "Diophante", gender: "M", bio: "Diophante d'Alexandrie (vers 210-295) est un mathematicien grec souvent appele le 'pere de l'algebre'. Son ouvrage 'Arithmetica' contient des problemes d'equations a solutions entieres ou rationnelles, appelees equations diophantiennes. Ses travaux ont inspire Fermat pour son celebre dernier theoreme." },
  { name: "Dorothy Vaughan", gender: "F", bio: "Dorothy Vaughan (1910-2008) est une mathematicienne et informaticienne americaine qui a travaille a la NASA. Elle fut la premiere superviseure afro-americaine au NACA. Experte en FORTRAN, elle a contribue aux calculs des premieres missions spatiales. Son histoire est racontee dans le film 'Les Figures de l'ombre'." },
  { name: "Emmy Noether", gender: "F", bio: "Emmy Noether (1882-1935) est une mathematicienne allemande consideree comme la plus importante femme dans l'histoire des mathematiques. Son theoreme de Noether relie symetries et lois de conservation en physique. Elle a revolutionne l'algebre abstraite avec ses travaux sur les anneaux et les ideaux." },
  { name: "Eratosthene de Cyrene", gender: "M", bio: "Eratosthene (vers 276-194 av. J.-C.) est un mathematicien, geographe et astronome grec. Il est celebre pour avoir mesure la circonference de la Terre avec une precision remarquable. En mathematiques, son 'crible d'Eratosthene' est une methode efficace pour trouver les nombres premiers." },
  { name: "Euclide d'Alexandrie", gender: "M", bio: "Euclide d'Alexandrie (vers 330-270 av. J.-C.) est un mathematicien grec considere comme le pere de la geometrie. On sait peu de choses sur sa vie personnelle, mais il a enseigne et travaille a Alexandrie, en Egypte, sous le regne de Ptolemee Ier.\n\nSon oeuvre majeure, les 'Elements' (Stoicheia), est l'un des ouvrages les plus influents jamais ecrits dans l'histoire de l'humanite. Compose de 13 livres, ce traite rassemble et organise de maniere logique la quasi-totalite des connaissances mathematiques de l'Antiquite grecque. Les six premiers livres traitent de geometrie plane, les trois suivants de theorie des nombres, et les quatre derniers de geometrie dans l'espace.\n\nL'approche d'Euclide est revolutionnaire par sa rigueur : il part de definitions, de postulats (axiomes) et de notions communes, puis deduit par raisonnement logique tous les theoremes. Son cinquieme postulat, sur les droites paralleles, a fascine les mathematiciens pendant plus de 2000 ans et a finalement conduit a la decouverte des geometries non euclidiennes au XIXe siecle.\n\nParmi les resultats celebres des Elements : le theoreme de Pythagore (proposition I.47), la demonstration de l'infinitude des nombres premiers (proposition IX.20), et l'algorithme d'Euclide pour calculer le PGCD de deux nombres. Ce dernier est encore utilise aujourd'hui en informatique et en cryptographie.\n\nLes Elements ont ete le manuel de mathematiques de reference dans le monde occidental pendant plus de deux millenaires. Avec plus de 1000 editions publiees depuis l'invention de l'imprimerie, c'est l'un des livres les plus reimprimes de l'histoire, juste apres la Bible. L'heritage d'Euclide va au-dela des mathematiques : sa methode axiomatique a inspire la philosophie (Spinoza), la physique (Newton) et la logique formelle moderne." },
  { name: "Euphemia Lofton Haynes", gender: "F", bio: "Euphemia Lofton Haynes (1890-1980) est la premiere femme afro-americaine a obtenir un doctorat en mathematiques, a l'Universite Catholique d'Amerique en 1943. Elle a enseigne pendant plus de 47 ans dans les ecoles de Washington et milite pour l'integration scolaire." },
  { name: "Fatma Moalla", gender: "F", bio: "Fatma Moalla est une mathematicienne tunisienne, professeure a l'Universite de Tunis. Elle est specialisee en analyse fonctionnelle et equations aux derivees partielles. Elle est l'une des pionniers des mathematiques en Tunisie et a forme de nombreux chercheurs africains." },
  { name: "Felix Klein", gender: "M", bio: "Felix Klein (1849-1925) est un mathematicien allemand connu pour son programme d'Erlangen qui unifie les geometries par la theorie des groupes. Sa bouteille de Klein est un objet topologique celebre. Il a aussi contribue a la pedagogie des mathematiques et aux fonctions elliptiques." },
  { name: "Francis Kofi Allotey", gender: "M", bio: "Francis Kofi Allotey (1932-2017) est un physicien et mathematicien ghaneeen. Il est connu pour la 'technique d'Allotey' en physique des rayons X. Premier Ghaneeen a obtenir un doctorat en physique mathematique, il a ete president de la Societe mathematique africaine." },
  { name: "George Polya", gender: "M", bio: "George Polya (1887-1985) est un mathematicien hongrois-americain celebre pour ses travaux en combinatoire, probabilites et pedagogie mathematique. Son livre 'Comment poser et resoudre un probleme' est une reference mondiale pour l'enseignement de la resolution de problemes." },
  { name: "Gladys West", gender: "F", bio: "Gladys West (nee en 1930) est une mathematicienne americaine dont les calculs geodesiques ont contribue au developpement du GPS. Travaillant a la base navale de Dahlgren, elle a programme les ordinateurs pour modeliser la forme de la Terre avec une precision inedite." },
  { name: "Gottfried Wilhelm Leibniz", gender: "M", bio: "Gottfried Wilhelm Leibniz (1646-1716) est un mathematicien et philosophe allemand, co-inventeur du calcul infinitesimal independamment de Newton. Sa notation (dx, integrale) est toujours utilisee aujourd'hui. Il a aussi invente le systeme binaire et contribue a la logique formelle." },
  { name: "Hajer Bahouri", gender: "F", bio: "Hajer Bahouri est une mathematicienne franco-tunisienne specialisee en equations aux derivees partielles et analyse harmonique. Professeure a l'Universite Paris-Est Creteil, elle est co-auteure de ouvrages de reference sur les espaces de Sobolev et l'analyse de Fourier." },
  { name: "Henri Poincare", gender: "M", bio: "Henri Poincare (1854-1912) est un mathematicien francais considere comme le dernier universaliste. Il a fonde la topologie algebrique, contribue a la theorie du chaos et formule la conjecture de Poincare (demontree en 2003). Ses travaux en physique mathematique ont aussi influence la relativite." },
  { name: "Hypsicles d'Alexandrie", gender: "M", bio: "Hypsicles (vers 190-120 av. J.-C.) est un mathematicien et astronome grec. Il est l'auteur du 'Livre XIV' des Elements d'Euclide, portant sur les polyedres reguliers. Il est aussi le premier Grec a diviser le cercle zodiacal en 360 degres." },
  { name: "Ibn al-Haytham", gender: "M", bio: "Ibn al-Haytham (965-1040) est un mathematicien et physicien arabe, pere de l'optique moderne. Son 'Livre de l'optique' a influence Kepler et Newton. En mathematiques, il a travaille sur les nombres parfaits, la geometrie analytique et la methode scientifique experimentale." },
  { name: "Isaac Barrow", gender: "M", bio: "Isaac Barrow (1630-1677) est un mathematicien anglais, predecesseur de Newton a Cambridge. Il a contribue au theoreme fondamental du calcul en reliant derivation et integration. Il est considere comme l'un des pionniers du calcul infinitesimal avant Newton et Leibniz." },
  { name: "John Forbes Nash", gender: "M", bio: "John Forbes Nash (1928-2015) est un mathematicien americain, prix Nobel d'economie 1994. Son equilibre de Nash en theorie des jeux est fondamental en economie et strategie. Sa lutte contre la schizophrenie est racontee dans le film 'Un homme d'exception'." },
  { name: "Josephine Guidy-Wandja", gender: "F", bio: "Josephine Guidy-Wandja (nee en 1945) est la premiere femme africaine a obtenir un doctorat en mathematiques (en 1972). Originaire de Cote d'Ivoire, elle est specialisee en algebre et a contribue au developpement de l'enseignement des mathematiques en Afrique francophone." },
  { name: "Joseph-Louis Lagrange", gender: "M", bio: "Joseph-Louis Lagrange (1736-1813) est un mathematicien et astronome franco-italien. Il a reformule la mecanique classique (equations de Lagrange), contribue a la theorie des nombres et a l'algebre. Sa 'Mecanique analytique' est un chef-d'oeuvre utilisant uniquement le calcul sans figures." },
  { name: "Katherine Johnson", gender: "F", bio: "Katherine Johnson (1918-2020) est une mathematicienne americaine de la NASA. Ses calculs de trajectoires orbitales ont ete essentiels aux premiers vols spatiaux americains, dont celui de John Glenn. Son histoire est racontee dans 'Les Figures de l'ombre'. Decoree de la Medaille de la Liberte en 2015." },
  { name: "Leonhard Euler", gender: "M", bio: "Leonhard Euler (1707-1783) est un mathematicien suisse, le plus prolifique de l'histoire avec plus de 800 publications. Il a introduit les notations $f(x)$, $e$, $i$, $\\pi$ et $\\sum$. Ses contributions couvrent l'analyse, la theorie des graphes, la mecanique et l'astronomie." },
  { name: "Mamphono Khaketa", gender: "F", bio: "Mamphono Khaketa est une mathematicienne du Lesotho et ancienne ministre des Communications. Formee en mathematiques appliquees, elle milite pour l'education scientifique des femmes en Afrique australe et la numerisation des services publics." },
  { name: "Marjorie Lee Browne", gender: "F", bio: "Marjorie Lee Browne (1914-1979) est l'une des premieres femmes afro-americaines a obtenir un doctorat en mathematiques (1949). Professeure a l'Universite de Caroline du Nord, elle a contribue a la topologie et a milite pour l'acces des minorites aux etudes superieures." },
  { name: "Mary Everest Boole", gender: "F", bio: "Mary Everest Boole (1832-1916) est une mathematicienne et pedagogre anglaise, epouse de George Boole. Elle a developpe des methodes innovantes pour enseigner les mathematiques aux enfants, utilisant le jeu et la manipulation. Ses 'cartes de Boole' sont des outils pedagogiques reconnus." },
  { name: "Mary Jackson", gender: "F", bio: "Mary Jackson (1921-2005) est la premiere femme ingenieure afro-americaine de la NASA. Elle a travaille sur les souffleries et la propulsion aeronautique. Apres 20 ans d'ingenierie, elle est devenue responsable de la promotion des femmes et des minorites a la NASA." },
  { name: "Michael Atiyah", gender: "M", bio: "Michael Atiyah (1929-2019) est un mathematicien britannico-libanais, medaille Fields 1966. Le theoreme de l'indice d'Atiyah-Singer relie l'analyse, la topologie et la geometrie. Il a aussi contribue a la K-theorie et aux liens entre mathematiques et physique theorique." },
  { name: "Niels Henrik Abel", gender: "M", bio: "Niels Henrik Abel (1802-1829) est un mathematicien norvegien mort a 26 ans. Il a demontre l'impossibilite de resoudre par radicaux l'equation generale du cinquieme degre. Les fonctions abeliennes et le prix Abel portent son nom. Ses travaux ont fonde la theorie des groupes." },
  { name: "Omar Khayyam", gender: "M", bio: "Omar Khayyam (1048-1131) est un mathematicien, astronome et poete persan. Il a classifie et resolu les equations cubiques par des methodes geometriques. Il a aussi reforme le calendrier persan avec une precision superieure au calendrier gregorien. Ses 'Rubaiyat' sont celebres en litterature." },
  { name: "Paul Erdos", gender: "M", bio: "Paul Erdos (1913-1996) est un mathematicien hongrois, l'un des plus prolifiques avec plus de 1500 articles. Il a contribue a la combinatoire, la theorie des graphes, la theorie des nombres et les probabilites. Le 'nombre d'Erdos' mesure la collaboration mathematique." },
  { name: "Peter Scholze", gender: "M", bio: "Peter Scholze (ne en 1987) est un mathematicien allemand, medaille Fields 2018. Il a revolutionne la geometrie arithmetique en creant la theorie des espaces perfectoides. Plus jeune professeur titulaire d'Allemagne a 24 ans, il est considere comme un genie de sa generation." },
  { name: "Pierre de Fermat", gender: "M", bio: "Pierre de Fermat (1601-1665) est un mathematicien francais, co-fondateur de la theorie des probabilites et pionnier du calcul infinitesimal. Son 'dernier theoreme', ecrit dans la marge d'un livre, n'a ete demontre qu'en 1995 par Andrew Wiles apres 358 ans d'efforts." },
  { name: "Pierre-Simon Laplace", gender: "M", bio: "Pierre-Simon Laplace (1749-1827) est un mathematicien et astronome francais. Sa 'Mecanique celeste' a perfectionne l'astronomie. En mathematiques, il a contribue aux probabilites, aux equations differentielles (transformee de Laplace) et a la theorie du potentiel." },
  { name: "Pythagore de Samos", gender: "M", bio: "Pythagore de Samos (vers 570-495 av. J.-C.) est un mathematicien et philosophe grec ne sur l'ile de Samos, en mer Egee. Apres avoir voyage en Egypte, a Babylone et peut-etre en Inde, il s'installa a Crotone, dans le sud de l'Italie, ou il fonda une ecole philosophique et mathematique connue sous le nom de 'secte pythagoricienne'.\n\nSon celebre theoreme affirme que dans tout triangle rectangle, le carre de l'hypotenuse est egal a la somme des carres des deux autres cotes : $a^2 + b^2 = c^2$. Bien que des cas particuliers de ce resultat etaient connus des Babyloniens et des Egyptiens, Pythagore (ou son ecole) est le premier a en avoir donne une demonstration generale. Ce theoreme est l'un des plus fondamentaux de toute la geometrie et reste enseigne dans le monde entier.\n\nLa philosophie pythagoricienne repose sur la conviction que 'tout est nombre'. Les Pythagoriciens ont decouvert les rapports numeriques dans la musique (longueurs de cordes et intervalles harmoniques), les proprietes des nombres figurres (triangulaires, carres, etc.) et les nombres parfaits. Ils ont aussi fait la decouverte troublante des nombres irrationnels ($\\sqrt{2}$), qui remettait en cause leur vision du monde.\n\nL'ecole pythagoricienne fonctionnait comme une communaute fermee avec des regles strictes. Ses membres pratiquaient le vegetarisme, le secret et le partage des decouvertes. L'influence de Pythagore sur la philosophie grecque est immense : Platon, Aristote et Euclide se sont inspires de ses travaux. Le theoreme de Pythagore reste aujourd'hui l'un des piliers de l'enseignement mathematique et trouve des applications en architecture, navigation, physique et informatique." },
  { name: "Ramanujan", gender: "M", bio: "Srinivasa Ramanujan (1887-1920) est un mathematicien indien autodidacte dont le genie intuitif est legendaire. Il a decouvert environ 3900 formules en theorie des nombres, fractions continues et series infinies. Sa collaboration avec Hardy a Cambridge a produit des resultats remarquables malgre une vie tres courte." },
  { name: "Rene Descartes", gender: "M", bio: "Rene Descartes (1596-1650) est un mathematicien et philosophe francais, pere de la geometrie analytique. En reliant algebre et geometrie par les coordonnees cartesiennes, il a revolutionne les mathematiques. Son 'Discours de la methode' a aussi transforme la philosophie." },
  { name: "Riemann", gender: "M", bio: "Bernhard Riemann (1826-1866) est un mathematicien allemand dont les travaux ont transforme la geometrie et l'analyse. Sa geometrie riemannienne est le cadre de la relativite generale d'Einstein. L'hypothese de Riemann sur les zeros de la fonction zeta reste l'un des plus grands problemes ouverts." },
  { name: "Roselyn Epee Assoumou", gender: "F", bio: "Roselyn Epee Assoumou est une mathematicienne camerounaise, professeure a l'Universite de Douala. Specialisee en analyse numerique et modelisation mathematique, elle contribue au developpement de la recherche mathematique au Cameroun et encourage les jeunes femmes africaines dans les sciences." },
  { name: "Sofia Kovalevskaya", gender: "F", bio: "Sofia Kovalevskaya (1850-1891) est la premiere femme a obtenir un doctorat en mathematiques en Europe et la premiere professeure titulaire. Ses travaux sur les equations differentielles et la rotation des corps solides sont majeurs. Elle a du se battre contre les prejuges de son epoque." },
  { name: "Sophie Germain", gender: "F", bio: "Sophie Germain (1776-1831) est une mathematicienne francaise autodidacte. Elle a contribue a la theorie de l'elasticite et a la theorie des nombres (nombres premiers de Sophie Germain). Elle a correspondu avec Gauss sous un pseudonyme masculin pour etre prise au serieux." },
  { name: "Terence Tao", gender: "M", bio: "Terence Tao (ne en 1975) est un mathematicien australo-americain, medaille Fields 2006. Considere comme le plus grand mathematicien vivant, ses contributions couvrent l'analyse harmonique, les equations differentielles, la combinatoire et la theorie des nombres. Il a demontre des resultats sur les nombres premiers avec Ben Green." },
  { name: "Thales de Milet", gender: "M", bio: "Thales de Milet (vers 625-545 av. J.-C.) est considere comme le premier mathematicien grec. Son theoreme de Thales sur les droites paralleles et la proportionnalite est enseigne dans le monde entier. Il est aussi le premier a avoir predit une eclipse solaire et fonde la geometrie demonstrative." },
  { name: "Wangari Maathai", gender: "F", bio: "Wangari Maathai (1940-2011) est une scientifique kenyane, prix Nobel de la paix 2004. Premiere femme d'Afrique de l'Est a obtenir un doctorat, elle a etudie les sciences biologiques et mathematiques. Fondatrice du Mouvement de la Ceinture Verte, elle a plante plus de 30 millions d'arbres." },
  { name: "Yves Meyer", gender: "M", bio: "Yves Meyer (ne en 1939) est un mathematicien francais, prix Abel 2017. Ses travaux sur les ondelettes ont revolutionne le traitement du signal et la compression d'images. Ne en Tunisie, il a contribue a l'analyse harmonique et aux quasi-cristaux mathematiques." },
].sort((a, b) => a.name.localeCompare(b.name, "fr"))

export const MATHEMATICIANS = MATHEMATICIANS_DATA.map(m => m.name)

export type TopbarTab = "classe" | "mathematiciens" | "conseils" | "quiz" | "tous"

export const STUDY_ADVICE_ITEMS = [
  { id: "prepare-bepc", label: "Prepare for the BEPC" },
  { id: "methods", label: "Methodes d'etude" },
  { id: "quotes", label: "Citations inspirantes" },
  { id: "tips", label: "Conseils pratiques" },
]

// ===================== ADVICE CONTENT =====================
export const STUDY_METHODS = [
  "La methode Pomodoro : Travaille 25 minutes, puis fais une pause de 5 minutes. Apres 4 cycles, fais une pause plus longue de 15-30 minutes. Cette technique ameliore la concentration et evite l'epuisement mental.",
  "La repetition espacee : Revise tes cours a intervalles croissants (1 jour, 3 jours, 1 semaine, 2 semaines) pour ancrer les connaissances dans ta memoire a long terme.",
  "Le mind mapping : Cree des cartes mentales pour organiser tes idees et visualiser les liens entre les concepts mathematiques. Utilise des couleurs et des symboles.",
  "La methode Feynman : Explique un concept comme si tu l'enseignais a un enfant. Si tu bloques, retourne a tes notes pour combler les lacunes.",
  "L'apprentissage actif : Ne te contente pas de lire. Ecris, resous, dessine. Plus tu es actif dans ton apprentissage, mieux tu retiens les informations.",
  "L'auto-evaluation : Apres chaque chapitre, teste-toi avec des exercices sans regarder le cours. Identifie tes points faibles et retravaille-les.",
  "Le travail en groupe : Explique les concepts a tes camarades et ecoute leurs explications. L'enseignement mutuel renforce la comprehension de tous.",
  "La methode Cornell : Divise ta page en 3 zones : notes, mots-cles, resume. Cela facilite la revision et la memorisation structuree.",
  "La technique des flashcards : Cree des cartes avec une question d'un cote et la reponse de l'autre. Ideale pour memoriser les formules et definitions.",
  "La planification hebdomadaire : Chaque dimanche, planifie ta semaine d'etude. Fixe des objectifs precis et mesurables pour chaque jour de travail.",
]

export const INSPIRATIONAL_QUOTES = [
  "Les mathematiques sont la reine des sciences. - Carl Friedrich Gauss",
  "L'education est l'arme la plus puissante pour changer le monde. - Nelson Mandela",
  "Le succes n'est pas la cle du bonheur. Le bonheur est la cle du succes. - Albert Schweitzer",
  "La seule facon de faire du bon travail est d'aimer ce que vous faites. - Steve Jobs",
  "L'avenir appartient a ceux qui croient a la beaute de leurs reves. - Eleanor Roosevelt",
  "Ce n'est pas parce que les choses sont difficiles que nous n'osons pas, c'est parce que nous n'osons pas qu'elles sont difficiles. - Seneque",
  "Le genie est un pour cent d'inspiration et quatre-vingt-dix-neuf pour cent de transpiration. - Thomas Edison",
  "Chaque expert etait autrefois un debutant. - Helen Hayes",
  "La perseverance est la mere de la reussite. - Proverbe africain",
  "N'ayez pas peur de la perfection, vous n'y arriverez jamais. - Salvador Dali",
  "L'echec est le fondement de la reussite. - Lao Tseu",
  "Celui qui n'a pas echoue n'a jamais tente quelque chose de nouveau. - Albert Einstein",
  "Les racines de l'education sont ameres, mais ses fruits sont doux. - Aristote",
  "Le savoir est la seule matiere qui s'accroit quand on la partage. - Socrate",
  "Apprendre sans reflechir est vain. Reflechir sans apprendre est dangereux. - Confucius",
  "La mathematique est l'alphabet avec lequel Dieu a ecrit l'univers. - Galilee",
  "Je pense, donc je suis. - Rene Descartes",
  "Vis comme si tu devais mourir demain. Apprends comme si tu devais vivre toujours. - Mahatma Gandhi",
  "Un voyage de mille lieues commence toujours par un premier pas. - Lao Tseu",
  "L'imagination est plus importante que le savoir. - Albert Einstein",
  "Ne juge pas chaque jour par la recolte que tu fais, mais par les graines que tu semes. - Robert Louis Stevenson",
  "La connaissance s'acquiert par l'experience, tout le reste n'est que de l'information. - Albert Einstein",
  "Quand on veut, on peut. Quand on peut, on doit. - Napoleon Bonaparte",
  "Le courage n'est pas l'absence de peur, mais la capacite de vaincre ce qui fait peur. - Nelson Mandela",
]

export const PRACTICAL_TIPS = [
  "Commence toujours par comprendre l'enonce avant de resoudre un exercice. Lis-le au moins deux fois et identifie les donnees et les inconnues.",
  "Ecris proprement tes calculs. Une presentation claire t'aide a eviter les erreurs et facilite la correction par ton professeur.",
  "Apprends les formules par coeur AVANT de faire les exercices. Tu ne peux pas resoudre si tu ne connais pas les outils.",
  "Refais les exercices corriges en classe sans regarder la correction. C'est le meilleur entrainement possible pour progresser.",
  "Note tes erreurs dans un carnet dedie. Revois-les regulierement pour ne pas les repeter aux examens.",
  "Fais des annales d'examen chaque semaine. Chronometre-toi pour t'habituer aux conditions reelles de l'examen.",
  "Quand tu bloques sur un exercice, passe au suivant et reviens-y plus tard avec un regard neuf et repose.",
  "Dessine toujours une figure pour les exercices de geometrie. Un bon schema vaut mille mots et aide a visualiser le probleme.",
  "Verifie toujours tes resultats en substituant tes valeurs dans l'equation de depart pour confirmer ta reponse.",
  "Dors au moins 8 heures avant un examen. Un cerveau repose retient et raisonne beaucoup mieux qu'un cerveau fatigue.",
  "Mange bien et bois de l'eau pendant tes sessions d'etude. Ton cerveau a besoin de carburant pour bien fonctionner.",
  "Etudie dans un endroit calme, sans telephone. La concentration est ta meilleure alliee pour comprendre les maths.",
  "Fixe-toi des objectifs quotidiens precis : par exemple 'Aujourd'hui, je maitrise les identites remarquables'.",
  "Utilise des couleurs differentes pour tes notes : rouge pour les formules, bleu pour les theoremes, vert pour les exemples.",
  "Ne saute jamais les demonstrations en cours. Comprendre le 'pourquoi' t'aide a retenir le 'comment' de chaque formule.",
  "Cree des fiches de revision pour chaque chapitre avec les formules et theoremes essentiels resumes en une page.",
  "Pose des questions en classe. Si tu ne comprends pas, d'autres eleves sont probablement dans la meme situation.",
  "Travaille regulierement, pas seulement avant les examens. 30 minutes par jour valent mieux que 5 heures la veille.",
  "Forme un groupe d'etude de 3-4 personnes maximum. Expliquez-vous mutuellement les concepts difficiles.",
  "Celebre tes progres, meme les petits. Chaque exercice reussi est une victoire qui te rapproche de ton objectif.",
  "Relis tes cours le soir meme du jour ou tu les as recus. La memoire est meilleure quand les informations sont fraiches.",
  "Utilise des moyens mnemotechniques pour retenir les formules. Par exemple SOH-CAH-TOA pour la trigonometrie.",
]

export const STUDY_TIPS_SHORT = [
  "Travaille 25 min puis pause 5 min (methode Pomodoro) pour rester concentre sans te fatiguer.",
  "Refais les exercices sans regarder la correction : c'est le meilleur moyen de savoir si tu as vraiment compris.",
  "Apprends les formules par coeur avant de faire les exercices. Sans elles, tu perds du temps inutilement.",
  "Fais des annales chaque semaine en te chronometrant pour t'entrainer dans les conditions reelles de l'examen.",
  "Note tes erreurs dans un cahier dedie et revois-les regulierement. Les memes pieges reviennent souvent.",
  "Explique les concepts a quelqu'un d'autre : enseigner est la meilleure facon de maitriser un sujet.",
  "Dessine toujours une figure en geometrie, meme quand l'enonce ne le demande pas. Cela t'aide a visualiser.",
  "Verifie tes resultats en les substituant dans l'equation de depart. Cela evite les erreurs de calcul.",
  "Dors au moins 8 heures avant un examen. Un cerveau repose retient mieux et reflechit plus vite.",
  "Etudie dans un endroit calme sans distractions : eteins ton telephone et concentre-toi a 100%.",
  "Commence toujours par les exercices faciles pour gagner en confiance avant d'attaquer les plus difficiles.",
  "Relis l'enonce deux fois avant de commencer. Beaucoup d'erreurs viennent d'une mauvaise lecture.",
  "Utilise des couleurs differentes pour ecrire les formules, les theoremes et les definitions dans tes notes.",
  "Revise un peu chaque jour plutot que tout la veille. La memoire fonctionne mieux avec la repetition espacee.",
  "Quand tu bloques sur un exercice, passe au suivant et reviens-y plus tard avec un regard neuf.",
  "Fais un resume de chaque chapitre sur une feuille : cela t'oblige a identifier l'essentiel.",
  "Utilise des moyens mnemotechniques pour retenir les formules. Par exemple SOH-CAH-TOA pour la trigonometrie.",
  "Travaille en groupe de temps en temps : les discussions permettent de decouvrir d'autres approches.",
  "Avant un controle, refais les exercices types que le professeur a faits en classe. Ils reviennent souvent.",
  "Ne te contente pas de lire le cours. Prends un stylo et refais les demonstrations toi-meme pour bien comprendre.",
]

// ===================== FORMULAS (20+) =====================
export interface FormulaGroup { cat: string; items: string[] }

export const IMPORTANT_FORMULAS: FormulaGroup[] = [
  { cat: "Identites remarquables", items: [
    "$(a+b)^2 = a^2 + 2ab + b^2$",
    "$(a-b)^2 = a^2 - 2ab + b^2$",
    "$(a+b)(a-b) = a^2 - b^2$",
    "$(a+b)^3 = a^3 + 3a^2b + 3ab^2 + b^3$",
    "$(a-b)^3 = a^3 - 3a^2b + 3ab^2 - b^3$",
  ]},
  { cat: "Equations et systemes", items: [
    "Equation du 2nd degre : $x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}$",
    "Discriminant : $\\Delta = b^2 - 4ac$",
    "Somme des racines : $x_1 + x_2 = -\\frac{b}{a}$",
    "Produit des racines : $x_1 \\cdot x_2 = \\frac{c}{a}$",
    "Systeme 2x2 (Cramer) : $x = \\frac{\\begin{vmatrix}e&b\\\\f&d\\end{vmatrix}}{\\begin{vmatrix}a&b\\\\c&d\\end{vmatrix}}$",
  ]},
  { cat: "Geometrie", items: [
    "Pythagore : $a^2 + b^2 = c^2$",
    "Aire du cercle : $A = \\pi r^2$",
    "Perimetre du cercle : $P = 2\\pi r$",
    "Aire du triangle : $A = \\frac{b \\times h}{2}$",
    "Volume de la sphere : $V = \\frac{4}{3}\\pi r^3$",
    "Surface de la sphere : $S = 4\\pi r^2$",
    "Volume du cylindre : $V = \\pi r^2 h$",
    "Volume du cone : $V = \\frac{1}{3}\\pi r^2 h$",
    "Volume de la pyramide : $V = \\frac{1}{3}Bh$",
    "Thales : $\\frac{MA}{MB} = \\frac{MC}{MD} = \\frac{AC}{BD}$",
  ]},
  { cat: "Trigonometrie", items: [
    "$\\sin^2(x) + \\cos^2(x) = 1$",
    "$\\tan(x) = \\frac{\\sin(x)}{\\cos(x)}$",
    "$\\cos(a+b) = \\cos a \\cos b - \\sin a \\sin b$",
    "$\\sin(a+b) = \\sin a \\cos b + \\cos a \\sin b$",
    "$\\cos(2a) = \\cos^2 a - \\sin^2 a = 2\\cos^2 a - 1$",
    "$\\sin(2a) = 2\\sin a \\cos a$",
  ]},
  { cat: "Derivation et integration", items: [
    "$(x^n)' = nx^{n-1}$",
    "$(fg)' = f'g + fg'$",
    "$(f/g)' = \\frac{f'g - fg'}{g^2}$",
    "$(e^x)' = e^x$, $\\;(\\ln x)' = \\frac{1}{x}$",
    "$(\\sin x)' = \\cos x$, $\\;(\\cos x)' = -\\sin x$",
    "$\\int_a^b f(x)dx = F(b) - F(a)$",
    "$\\int x^n dx = \\frac{x^{n+1}}{n+1} + C$ (si $n \\neq -1$)",
  ]},
  { cat: "Suites numeriques", items: [
    "Suite arith : $U_n = U_0 + nr$",
    "Somme arith : $S_n = \\frac{n(U_0 + U_n)}{2}$",
    "Suite geo : $U_n = U_0 \\times q^n$",
    "Somme geo : $S_n = U_0 \\times \\frac{1 - q^{n+1}}{1 - q}$ (si $q \\neq 1$)",
  ]},
  { cat: "Probabilites et statistiques", items: [
    "Probabilite : $P(A) = \\frac{\\text{cas favorables}}{\\text{cas possibles}}$",
    "$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$",
    "Combinaisons : $C_n^k = \\frac{n!}{k!(n-k)!}$",
    "Moyenne : $\\bar{x} = \\frac{\\sum x_i n_i}{\\sum n_i}$",
    "Variance : $V = \\frac{\\sum n_i(x_i - \\bar{x})^2}{N}$",
  ]},
  { cat: "Logarithmes et exponentielles", items: [
    "$e^{a+b} = e^a \\times e^b$",
    "$\\ln(ab) = \\ln a + \\ln b$",
    "$\\ln(a^n) = n\\ln a$",
    "$\\log_a b = \\frac{\\ln b}{\\ln a}$",
  ]},
]

// ===================== QUIZ =====================
export interface QuizQuestion { question: string; options: string[]; correctIndex: number; explanation: string }
export interface QuizCategory { id: string; label: string; description: string; questions: QuizQuestion[] }

export const QUIZ_CATEGORIES: QuizCategory[] = [
  {
    id: "calcul-mental", label: "Calcul mental", description: "Teste ta rapidite en calcul",
    questions: [
      { question: "17 x 13 = ?", options: ["211","221","231","201"], correctIndex: 1, explanation: "17x13 = 170+51 = 221" },
      { question: "256 / 16 = ?", options: ["14","15","16","18"], correctIndex: 2, explanation: "16x16 = 256 donc 256/16 = 16" },
      { question: "45 + 78 + 22 = ?", options: ["135","145","155","125"], correctIndex: 1, explanation: "45+22=67, 67+78=145" },
      { question: "15 au carre = ?", options: ["215","225","235","205"], correctIndex: 1, explanation: "15x15=225" },
      { question: "1000 - 357 = ?", options: ["643","653","633","663"], correctIndex: 0, explanation: "1000-357=643" },
      { question: "25 x 16 = ?", options: ["380","400","420","350"], correctIndex: 1, explanation: "25x16=25x4x4=400" },
      { question: "144 / 12 = ?", options: ["11","12","13","14"], correctIndex: 1, explanation: "12x12=144" },
      { question: "99 x 5 = ?", options: ["485","495","505","475"], correctIndex: 1, explanation: "(100-1)x5=495" },
      { question: "8 au cube = ?", options: ["256","512","648","412"], correctIndex: 1, explanation: "8x8x8=512" },
      { question: "3/4 de 200 = ?", options: ["140","150","160","175"], correctIndex: 1, explanation: "3x50=150" },
      { question: "37 + 46 + 63 + 54 = ?", options: ["190","200","210","195"], correctIndex: 1, explanation: "(37+63)+(46+54)=200" },
      { question: "11 x 11 = ?", options: ["111","121","131","101"], correctIndex: 1, explanation: "11x11=121" },
      { question: "1/3 + 1/6 = ?", options: ["1/2","2/9","1/4","2/6"], correctIndex: 0, explanation: "2/6+1/6=3/6=1/2" },
      { question: "50% de 360 = ?", options: ["160","170","180","190"], correctIndex: 2, explanation: "360/2=180" },
      { question: "125 x 8 = ?", options: ["900","1000","1100","950"], correctIndex: 1, explanation: "125x8=1000" },
      { question: "Racine de 169 = ?", options: ["11","12","13","14"], correctIndex: 2, explanation: "13x13=169" },
      { question: "2 puissance 10 = ?", options: ["512","1024","2048","256"], correctIndex: 1, explanation: "2^10=1024" },
      { question: "15% de 400 = ?", options: ["50","55","60","65"], correctIndex: 2, explanation: "15x4=60" },
      { question: "999 + 999 = ?", options: ["1988","1998","2008","1999"], correctIndex: 1, explanation: "999+999=1998" },
      { question: "48 / 0.5 = ?", options: ["24","96","48","12"], correctIndex: 1, explanation: "Diviser par 0.5 = multiplier par 2, 48x2=96" },
    ]
  },
  {
    id: "vrai-faux", label: "Vrai ou Faux", description: "Es-tu sur de tes connaissances ?",
    questions: [
      { question: "Un carre est toujours un rectangle.", options: ["Vrai","Faux"], correctIndex: 0, explanation: "Un carre a 4 angles droits comme un rectangle, plus 4 cotes egaux." },
      { question: "$\\pi$ est un nombre rationnel.", options: ["Vrai","Faux"], correctIndex: 1, explanation: "$\\pi$ est irrationnel, il ne peut s'ecrire sous forme de fraction." },
      { question: "La somme des angles d'un triangle est 360 degres.", options: ["Vrai","Faux"], correctIndex: 1, explanation: "La somme des angles d'un triangle est 180 degres." },
      { question: "0 est un nombre pair.", options: ["Vrai","Faux"], correctIndex: 0, explanation: "0 est divisible par 2, donc il est pair." },
      { question: "$\\sqrt{2}$ est un nombre rationnel.", options: ["Vrai","Faux"], correctIndex: 1, explanation: "$\\sqrt{2}$ est irrationnel (demontre par l'absurde)." },
      { question: "Tout nombre premier est impair.", options: ["Vrai","Faux"], correctIndex: 1, explanation: "2 est premier ET pair." },
      { question: "Un losange a des diagonales perpendiculaires.", options: ["Vrai","Faux"], correctIndex: 0, explanation: "Propriete fondamentale du losange." },
      { question: "1 est un nombre premier.", options: ["Vrai","Faux"], correctIndex: 1, explanation: "1 n'est ni premier ni compose, par definition." },
      { question: "La derivee de $x^2$ est $2x$.", options: ["Vrai","Faux"], correctIndex: 0, explanation: "$(x^n)'=nx^{n-1}$, donc $(x^2)'=2x$." },
      { question: "Un cercle est un polygone.", options: ["Vrai","Faux"], correctIndex: 1, explanation: "Un polygone a des cotes droits. Un cercle est une courbe." },
      { question: "L'integrale de $1/x$ est $\\ln|x|+C$.", options: ["Vrai","Faux"], correctIndex: 0, explanation: "Primitive classique pour $x \\neq 0$." },
      { question: "Deux droites paralleles ont le meme coefficient directeur.", options: ["Vrai","Faux"], correctIndex: 0, explanation: "Meme pente = paralleles (ou confondues)." },
      { question: "$0! = 0$.", options: ["Vrai","Faux"], correctIndex: 1, explanation: "$0! = 1$ par convention." },
      { question: "Un triangle equilateral est aussi isocele.", options: ["Vrai","Faux"], correctIndex: 0, explanation: "Il a 3 cotes egaux, donc au moins 2." },
      { question: "$e^x$ est toujours positif.", options: ["Vrai","Faux"], correctIndex: 0, explanation: "$e^x > 0$ pour tout $x$ reel." },
      { question: "Deux angles supplementaires font 360 degres.", options: ["Vrai","Faux"], correctIndex: 1, explanation: "Supplementaires = 180 degres. Explementaires = 360." },
      { question: "$\\cos(0) = 0$.", options: ["Vrai","Faux"], correctIndex: 1, explanation: "$\\cos(0)=1$." },
      { question: "Un nombre divisible par 6 est divisible par 3.", options: ["Vrai","Faux"], correctIndex: 0, explanation: "6=2x3, donc tout multiple de 6 est multiple de 3." },
      { question: "La mediane d'un triangle passe par le milieu d'un cote.", options: ["Vrai","Faux"], correctIndex: 0, explanation: "Elle relie un sommet au milieu du cote oppose." },
      { question: "La somme de deux nombres irrationnels est toujours irrationnelle.", options: ["Vrai","Faux"], correctIndex: 1, explanation: "$\\sqrt{2}+(-\\sqrt{2})=0$ qui est rationnel." },
    ]
  },
  {
    id: "geometrie", label: "Geometrie", description: "Figures, aires et volumes",
    questions: [
      { question: "Aire d'un cercle de rayon 7 cm ($\\pi \\approx 22/7$) ?", options: ["154 cm$^2$","144 cm$^2$","164 cm$^2$","134 cm$^2$"], correctIndex: 0, explanation: "$A=\\pi r^2=22/7 \\times 49=154$ cm$^2$" },
      { question: "Combien de faces a un cube ?", options: ["4","6","8","12"], correctIndex: 1, explanation: "Un cube a 6 faces carrees." },
      { question: "Le theoreme de Pythagore s'applique aux triangles...", options: ["Isoceles","Equilateraux","Rectangles","Quelconques"], correctIndex: 2, explanation: "Pythagore ne s'applique qu'aux triangles rectangles." },
      { question: "Somme des angles d'un hexagone regulier ?", options: ["540","720","900","360"], correctIndex: 1, explanation: "$(6-2) \\times 180 = 720$ degres." },
      { question: "Volume d'une sphere de rayon $r$ ?", options: ["$\\frac{4}{3}\\pi r^3$","$2\\pi r^2$","$\\pi r^3$","$4\\pi r^2$"], correctIndex: 0, explanation: "$V=\\frac{4}{3}\\pi r^3$ est la formule du volume." },
      { question: "Aire d'un triangle de base 10 et hauteur 6 ?", options: ["60","30","16","45"], correctIndex: 1, explanation: "$A=\\frac{b \\times h}{2}=\\frac{60}{2}=30$" },
      { question: "Nombre d'aretes d'un cube ?", options: ["8","10","12","6"], correctIndex: 2, explanation: "Un cube a 12 aretes." },
      { question: "Perimetre d'un cercle de rayon 5 ?", options: ["15.7","31.4","25","50"], correctIndex: 1, explanation: "$P=2\\pi r=2 \\times 3.14 \\times 5=31.4$" },
      { question: "Volume d'un cone (r=3, h=4, $\\pi$=3.14) ?", options: ["37.68","113.04","12.56","75.36"], correctIndex: 0, explanation: "$V=\\frac{1}{3}\\pi r^2 h=\\frac{1}{3} \\times 3.14 \\times 9 \\times 4=37.68$" },
      { question: "Combien de diagonales dans un pentagone ?", options: ["3","4","5","10"], correctIndex: 2, explanation: "$\\frac{n(n-3)}{2}=\\frac{5 \\times 2}{2}=5$" },
      { question: "Le theoreme de Thales concerne...", options: ["Les aires","Les droites paralleles","Les angles","Les volumes"], correctIndex: 1, explanation: "Thales : proportionnalite avec droites paralleles." },
      { question: "Aire d'un parallelogramme (base 8, hauteur 5) ?", options: ["40","30","20","26"], correctIndex: 0, explanation: "$A=base \\times hauteur=40$" },
      { question: "Un angle de 90 degres est dit...", options: ["Aigu","Obtus","Droit","Plat"], correctIndex: 2, explanation: "90 degres = angle droit." },
      { question: "Volume d'un cube d'arete 3 cm ?", options: ["9","18","27","36"], correctIndex: 2, explanation: "$V=a^3=27$ cm$^3$" },
      { question: "Combien de sommets a un prisme triangulaire ?", options: ["4","5","6","8"], correctIndex: 2, explanation: "3 en haut + 3 en bas = 6 sommets." },
      { question: "Surface laterale d'un cylindre (r=2, h=5) ?", options: ["62.8","31.4","50","40"], correctIndex: 0, explanation: "$S=2\\pi rh=2 \\times 3.14 \\times 2 \\times 5=62.8$" },
      { question: "La mediatrice d'un segment passe par...", options: ["Un sommet","Le milieu","L'extremite","Le centre"], correctIndex: 1, explanation: "Elle passe par le milieu et est perpendiculaire." },
      { question: "Aire d'un trapeze (bases 6 et 10, h=4) ?", options: ["32","24","40","64"], correctIndex: 0, explanation: "$A=\\frac{(6+10) \\times 4}{2}=32$" },
      { question: "Combien de faces a un tetraedre ?", options: ["3","4","5","6"], correctIndex: 1, explanation: "Un tetraedre a 4 faces triangulaires." },
      { question: "L'angle inscrit est egal a...", options: ["L'angle au centre","La moitie de l'angle au centre","Le double de l'angle au centre","Le tiers de l'angle au centre"], correctIndex: 1, explanation: "L'angle inscrit = moitie de l'angle au centre interceptant le meme arc." },
    ]
  },
  {
    id: "algebre", label: "Algebre", description: "Equations et identites remarquables",
    questions: [
      { question: "$(a+b)^2 = $ ?", options: ["$a^2+b^2$","$a^2+2ab+b^2$","$a^2-2ab+b^2$","$2a^2+2b^2$"], correctIndex: 1, explanation: "1ere identite remarquable." },
      { question: "Si $2x+5=15$, alors $x=$ ?", options: ["5","10","7.5","3"], correctIndex: 0, explanation: "$2x=10$, donc $x=5$." },
      { question: "Factoriser $x^2-9$", options: ["$(x-3)(x+3)$","$(x-9)(x+1)$","$(x-3)^2$","$x(x-9)$"], correctIndex: 0, explanation: "$a^2-b^2=(a-b)(a+b)$ avec $a=x$, $b=3$." },
      { question: "Discriminant de $2x^2+3x-5=0$ ?", options: ["49","31","-31","19"], correctIndex: 0, explanation: "$\\Delta=9-4(2)(-5)=9+40=49$" },
      { question: "$|x-3|=7$, les solutions ?", options: ["$x=10$ ou $x=-4$","$x=10$","$x=-4$","$x=4$ ou $x=-10$"], correctIndex: 0, explanation: "$x-3=7$ ou $x-3=-7$, donc $x=10$ ou $x=-4$." },
      { question: "$(a-b)^2 = $ ?", options: ["$a^2-b^2$","$a^2+2ab+b^2$","$a^2-2ab+b^2$","$a^2-ab+b^2$"], correctIndex: 2, explanation: "2eme identite remarquable." },
      { question: "$3x-7=2x+5$, $x=$ ?", options: ["12","2","-12","1"], correctIndex: 0, explanation: "$x=12$." },
      { question: "$x^2-5x+6=0$, solutions ?", options: ["2 et 3","1 et 6","-2 et -3","2 et -3"], correctIndex: 0, explanation: "$\\Delta=1$, $x=(5 \\pm 1)/2$, soit 2 et 3." },
      { question: "Developper $(2x+3)(x-1)$", options: ["$2x^2+x-3$","$2x^2-x-3$","$2x^2+5x-3$","$2x^2-2x-3$"], correctIndex: 0, explanation: "$2x^2-2x+3x-3=2x^2+x-3$." },
      { question: "Si $f(x)=3x+2$, $f(4)=$ ?", options: ["14","12","10","16"], correctIndex: 0, explanation: "$f(4)=12+2=14$." },
      { question: "Resoudre $\\frac{x}{3}=4$", options: ["$x=12$","$x=7$","$x=1$","$x=4/3$"], correctIndex: 0, explanation: "$x=3 \\times 4=12$." },
      { question: "$(a+b)(a-b) = $ ?", options: ["$a^2-b^2$","$a^2+b^2$","$a^2-2ab$","$2ab$"], correctIndex: 0, explanation: "3eme identite remarquable." },
      { question: "Factoriser $3x^2+6x$", options: ["$3x(x+2)$","$3(x^2+2x)$","$x(3x+6)$","$6x(x+1)$"], correctIndex: 0, explanation: "Facteur commun : $3x$." },
      { question: "$x^2=49$, $x=$ ?", options: ["$\\pm 7$","$7$","$-7$","$49$"], correctIndex: 0, explanation: "$x=7$ ou $x=-7$." },
      { question: "Si $5(x-2)=15$, $x=$ ?", options: ["5","7","3","1"], correctIndex: 0, explanation: "$x-2=3$, $x=5$." },
      { question: "$\\log_{10}(1000) = $ ?", options: ["2","3","4","10"], correctIndex: 1, explanation: "$10^3=1000$." },
      { question: "Simplifier $(x^3)^2$", options: ["$x^5$","$x^6$","$x^9$","$x^{32}$"], correctIndex: 1, explanation: "$(x^a)^b=x^{ab}=x^6$." },
      { question: "Resoudre $2^x=32$", options: ["$x=5$","$x=4$","$x=6$","$x=3$"], correctIndex: 0, explanation: "$2^5=32$." },
      { question: "Si $a+b=10$ et $ab=21$, $a^2+b^2=$ ?", options: ["58","52","46","64"], correctIndex: 0, explanation: "$(a+b)^2=a^2+2ab+b^2 \\Rightarrow 100=a^2+b^2+42$, donc $a^2+b^2=58$." },
      { question: "Factoriser $4x^2-12x+9$", options: ["$(2x-3)^2$","$(2x+3)^2$","$(4x-3)(x-3)$","$(2x-9)^2$"], correctIndex: 0, explanation: "$(2x)^2-2(2x)(3)+3^2=(2x-3)^2$." },
    ]
  },
  {
    id: "suites", label: "Suites numeriques", description: "Arithmetiques et geometriques",
    questions: [
      { question: "$U_1=3$, $r=4$. $U_{10}=$ ?", options: ["39","43","36","40"], correctIndex: 0, explanation: "$U_{10}=3+9 \\times 4=39$" },
      { question: "Suite geo : $U_1=2$, $q=3$. $U_4=$ ?", options: ["54","18","162","48"], correctIndex: 0, explanation: "$U_4=2 \\times 3^3=54$" },
      { question: "Somme des $n$ premiers entiers ?", options: ["$n(n+1)/2$","$n^2$","$n(n-1)/2$","$2n+1$"], correctIndex: 0, explanation: "Formule de Gauss." },
      { question: "$U_{n+1}=U_n+5$, $U_0=2$. $U_3=$ ?", options: ["17","12","15","20"], correctIndex: 0, explanation: "$U_1=7, U_2=12, U_3=17$" },
      { question: "Une suite monotone et bornee est...", options: ["Convergente","Divergente","Periodique","Constante"], correctIndex: 0, explanation: "Theoreme fondamental des suites monotones bornees." },
      { question: "$U_1=1$, $q=2$. $S_4=$ ?", options: ["15","16","14","31"], correctIndex: 0, explanation: "$S=1 \\times \\frac{2^4-1}{2-1}=15$" },
      { question: "Suite de Fibonacci : 1, 1, 2, 3, 5, 8... Le terme suivant ?", options: ["13","11","10","15"], correctIndex: 0, explanation: "5+8=13. Chaque terme est la somme des deux precedents." },
      { question: "$S=1+2+4+8+\\ldots+512=$ ?", options: ["1023","1024","511","512"], correctIndex: 0, explanation: "Geo $q=2$, $S=2^{10}-1=1023$" },
      { question: "$U_n=(-1)^n$, cette suite est...", options: ["Convergente","Divergente","Croissante","Bornee et divergente"], correctIndex: 3, explanation: "Alterne entre -1 et 1 : bornee mais non convergente." },
      { question: "Raison de la suite : 3, 7, 11, 15...", options: ["3","4","7","5"], correctIndex: 1, explanation: "$r=7-3=4$" },
      { question: "Raison geometrique de : 2, 6, 18, 54...", options: ["2","3","4","6"], correctIndex: 1, explanation: "$q=6/2=3$" },
      { question: "$\\lim_{n \\to \\infty} (1+1/n)^n = $ ?", options: ["1","$e$","$\\pi$","$\\infty$"], correctIndex: 1, explanation: "C'est la definition du nombre $e$." },
      { question: "$U_0=5$, $U_{n+1}=2U_n$. $U_3=$ ?", options: ["40","20","80","10"], correctIndex: 0, explanation: "$U_1=10, U_2=20, U_3=40$" },
      { question: "Somme arith : $U_1=2$, $r=3$, $n=10$. $S=$ ?", options: ["155","150","165","145"], correctIndex: 0, explanation: "$S=\\frac{10}{2}(4+27)=5 \\times 31=155$" },
      { question: "Une suite est arithmetique si...", options: ["$U_{n+1}-U_n$ = cst","$U_{n+1}/U_n$ = cst","$U_{n+1} \\times U_n$ = cst","$U_{n+1}+U_n$ = cst"], correctIndex: 0, explanation: "Difference constante = arithmetique." },
      { question: "Une suite est geometrique si...", options: ["$U_{n+1}-U_n$ = cst","$U_{n+1}/U_n$ = cst","$U_{n+1} \\times U_n$ = cst","$U_n^2$ = cst"], correctIndex: 1, explanation: "Rapport constant = geometrique." },
      { question: "$\\lim_{n \\to \\infty} n^2/e^n = $ ?", options: ["$\\infty$","0","1","$e$"], correctIndex: 1, explanation: "L'exponentielle domine tout polynome." },
      { question: "Suite : 1, -1/2, 1/4, -1/8... $q=$ ?", options: ["-1/2","1/2","-2","2"], correctIndex: 0, explanation: "$q=(-1/2)/1=-1/2$" },
      { question: "Somme infinie geo ($|q|<1$) : $S=$ ?", options: ["$U_1/(1-q)$","$U_1/(1+q)$","$U_1 \\times q$","$U_1/(q-1)$"], correctIndex: 0, explanation: "$S=\\frac{U_1}{1-q}$ pour $|q|<1$." },
      { question: "Si $U_n=3n+2$, la suite est...", options: ["Arithmetique de raison 3","Geometrique de raison 3","Ni l'un ni l'autre","Constante"], correctIndex: 0, explanation: "$U_{n+1}-U_n=3(n+1)+2-(3n+2)=3$ : constante." },
    ]
  },
  {
    id: "probabilites", label: "Probabilites", description: "Chance, combinaisons et denombrement",
    questions: [
      { question: "De equilibre : $P$(nombre pair) ?", options: ["1/2","1/3","1/6","2/3"], correctIndex: 0, explanation: "$\\{2,4,6\\}=3/6=1/2$" },
      { question: "$C_5^2 = $ ?", options: ["10","20","25","15"], correctIndex: 0, explanation: "$\\frac{5!}{2!3!}=10$" },
      { question: "$P(A)+P(\\bar{A}) = $ ?", options: ["1","0","$P(A)$","$2P(A)$"], correctIndex: 0, explanation: "Evenement et son complementaire : somme = 1." },
      { question: "$A$ et $B$ independants, $P(A)=0.3$, $P(B)=0.5$. $P(A \\cap B)=$ ?", options: ["0.15","0.8","0.35","0.2"], correctIndex: 0, explanation: "$P(A \\cap B)=P(A) \\times P(B)=0.15$" },
      { question: "$4! = $ ?", options: ["24","16","12","4"], correctIndex: 0, explanation: "$4!=4 \\times 3 \\times 2 \\times 1=24$" },
      { question: "Probabilite de tirer un as d'un jeu de 52 cartes ?", options: ["1/13","1/52","4/52","1/4"], correctIndex: 0, explanation: "4 as sur 52 cartes = 4/52 = 1/13." },
      { question: "$A_5^3 = $ ?", options: ["60","10","20","120"], correctIndex: 0, explanation: "$\\frac{5!}{(5-3)!}=5 \\times 4 \\times 3=60$" },
      { question: "$P(A \\cup B)$ si $A$ et $B$ incompatibles ?", options: ["$P(A)+P(B)$","$P(A) \\times P(B)$","$P(A)-P(B)$","1"], correctIndex: 0, explanation: "Evenements incompatibles : $P(A \\cup B)=P(A)+P(B)$." },
      { question: "Esperance d'un de equilibre ?", options: ["3.5","3","4","3.67"], correctIndex: 0, explanation: "$E=\\frac{1+2+3+4+5+6}{6}=3.5$" },
      { question: "Combien de mots de 3 lettres (26 lettres, repetition) ?", options: ["17576","78","15600","2600"], correctIndex: 0, explanation: "$26^3=17576$" },
      { question: "$C_n^0 = $ ?", options: ["0","1","$n$","100"], correctIndex: 1, explanation: "$C_n^0=1$ toujours." },
      { question: "$P(A|B) = $ ?", options: ["$P(A \\cap B)/P(B)$","$P(A)/P(B)$","$P(B)/P(A)$","$P(A \\cup B)/P(B)$"], correctIndex: 0, explanation: "Formule de probabilite conditionnelle." },
      { question: "Loi binomiale : $E(X)$ si $n=10$, $p=0.3$ ?", options: ["3","7","0.3","30"], correctIndex: 0, explanation: "$E(X)=np=3$" },
      { question: "Variance de $X \\sim B(n,p)$ ?", options: ["$np(1-p)$","$np$","$n(1-p)$","$p(1-p)$"], correctIndex: 0, explanation: "$V(X)=np(1-p)$" },
      { question: "Nombre de facons d'aligner 5 personnes ?", options: ["120","25","10","5"], correctIndex: 0, explanation: "$5!=120$" },
      { question: "$C_n^k = C_n^{...}$ ?", options: ["$n-k$","$k-1$","$n+k$","$k$"], correctIndex: 0, explanation: "$C_n^k=C_n^{n-k}$ (symetrie)." },
      { question: "Tirage avec remise de 3 boules parmi 5 ?", options: ["125","60","10","15"], correctIndex: 0, explanation: "$5^3=125$" },
      { question: "$P$(pile 3 fois de suite, piece equilibree) ?", options: ["1/8","1/4","1/6","1/2"], correctIndex: 0, explanation: "$(1/2)^3=1/8$" },
      { question: "Relation de Pascal ?", options: ["$C_n^k=C_{n-1}^{k-1}+C_{n-1}^k$","$C_n^k=C_n^{k-1}+C_n^{k+1}$","$C_n^k=nC_{n-1}^k$","$C_n^k=C_{n+1}^k$"], correctIndex: 0, explanation: "Relation de Pascal pour le triangle de Pascal." },
      { question: "$0! = $ ?", options: ["0","1","indefini","$\\infty$"], correctIndex: 1, explanation: "$0!=1$ par convention." },
    ]
  },
]

export function generateChapterQuiz(chapter: string, classId: string): QuizQuestion[] {
  const chLow = chapter.toLowerCase()
  if (chLow.includes("equation")) return [
    { question: "Resoudre $3x+7=22$", options: ["$x=5$","$x=3$","$x=7$","$x=15$"], correctIndex: 0, explanation: "$3x=15$, $x=5$" },
    { question: "Resoudre $x^2-9=0$", options: ["$x=\\pm3$","$x=3$","$x=9$","$x=-3$"], correctIndex: 0, explanation: "$x^2=9$, $x=\\pm3$" },
    { question: "Resoudre $\\frac{x}{4}+3=7$", options: ["$x=16$","$x=10$","$x=28$","$x=1$"], correctIndex: 0, explanation: "$x/4=4$, $x=16$" },
    { question: "Si $2(x-1)=10$, $x=$ ?", options: ["6","4","5","11"], correctIndex: 0, explanation: "$x-1=5$, $x=6$" },
    { question: "Discriminant de $x^2-6x+9=0$ ?", options: ["0","36","9","-36"], correctIndex: 0, explanation: "$\\Delta=36-36=0$, racine double." },
    { question: "Resoudre $5x-3>12$", options: ["$x>3$","$x>2$","$x<3$","$x>15$"], correctIndex: 0, explanation: "$5x>15$, $x>3$" },
    { question: "Resoudre $|2x+1|=5$", options: ["$x=2$ ou $x=-3$","$x=2$","$x=-3$","$x=3$ ou $x=-2$"], correctIndex: 0, explanation: "$2x+1=5$ ou $2x+1=-5$" },
    { question: "L'equation $x^2+1=0$ a combien de solutions reelles ?", options: ["0","1","2","$\\infty$"], correctIndex: 0, explanation: "$x^2=-1$ : pas de solution reelle." },
    { question: "Produit des racines de $x^2-7x+12=0$ ?", options: ["12","7","-12","-7"], correctIndex: 0, explanation: "Produit = $c/a = 12$" },
    { question: "Resoudre $x^2=2x$", options: ["$x=0$ ou $x=2$","$x=2$","$x=0$","$x=-2$"], correctIndex: 0, explanation: "$x(x-2)=0$" },
  ]
  if (chLow.includes("triangle")) return [
    { question: "Somme des angles d'un triangle ?", options: ["$180^\\circ$","$360^\\circ$","$90^\\circ$","$270^\\circ$"], correctIndex: 0, explanation: "Toujours $180^\\circ$." },
    { question: "Un triangle isocele a...", options: ["2 cotes egaux","3 cotes egaux","0 cote egal","1 angle droit"], correctIndex: 0, explanation: "Isocele = 2 cotes egaux." },
    { question: "Un triangle avec un angle de $90^\\circ$ est...", options: ["Rectangle","Isocele","Equilateral","Quelconque"], correctIndex: 0, explanation: "Un angle droit = triangle rectangle." },
    { question: "Inegalite triangulaire : chaque cote est...", options: ["Inferieur a la somme des deux autres","Egal a la somme des deux autres","Superieur a la somme des deux autres","Le double d'un autre"], correctIndex: 0, explanation: "Condition d'existence du triangle." },
    { question: "La hauteur d'un triangle est perpendiculaire a...", options: ["Un cote","La mediane","La bissectrice","La mediatrice"], correctIndex: 0, explanation: "La hauteur est perpendiculaire au cote oppose." },
    { question: "Le centre du cercle circonscrit est a l'intersection des...", options: ["Mediatrices","Medianes","Hauteurs","Bissectrices"], correctIndex: 0, explanation: "Les mediatrices se coupent au centre du cercle circonscrit." },
    { question: "Aire d'un triangle equilateral de cote $a$ ?", options: ["$\\frac{a^2\\sqrt{3}}{4}$","$\\frac{a^2}{2}$","$a^2$","$a\\sqrt{3}$"], correctIndex: 0, explanation: "Formule de l'aire du triangle equilateral." },
    { question: "La mediane relie un sommet au...", options: ["Milieu du cote oppose","Pied de la hauteur","Centre du cercle inscrit","Sommet oppose"], correctIndex: 0, explanation: "Definition de la mediane." },
    { question: "Les 3 medianes se coupent au...", options: ["Centre de gravite","Orthocentre","Circumcentre","Incentre"], correctIndex: 0, explanation: "Le centre de gravite est l'intersection des medianes." },
    { question: "Un triangle dont les 3 angles sont aigus est dit...", options: ["Acutangle","Obtusangle","Rectangle","Plat"], correctIndex: 0, explanation: "Tous les angles < 90 = acutangle." },
  ]
  if (chLow.includes("statistiques")) return [
    { question: "La moyenne de 4, 6, 8, 10, 12 ?", options: ["8","7","9","10"], correctIndex: 0, explanation: "$(4+6+8+10+12)/5=40/5=8$" },
    { question: "La mediane de 3, 5, 7, 9, 11 ?", options: ["7","5","9","6"], correctIndex: 0, explanation: "Valeur centrale = 7." },
    { question: "Le mode de 2, 3, 3, 5, 7, 3, 8 ?", options: ["3","5","2","7"], correctIndex: 0, explanation: "3 apparait le plus souvent." },
    { question: "L'etendue de 4, 8, 15, 23 ?", options: ["19","15","23","8"], correctIndex: 0, explanation: "23-4=19" },
    { question: "L'effectif total pour : 5, 10, 15, 20 ?", options: ["50","4","20","15"], correctIndex: 0, explanation: "5+10+15+20=50" },
    { question: "Frequence de 10 sur effectif total 50 ?", options: ["20%","10%","50%","25%"], correctIndex: 0, explanation: "10/50=0.2=20%" },
    { question: "La moyenne ponderee de 8(coef 3) et 12(coef 2) ?", options: ["9.6","10","8","12"], correctIndex: 0, explanation: "$(8 \\times 3+12 \\times 2)/5=48/5=9.6$" },
    { question: "Un diagramme circulaire a combien de degres au total ?", options: ["360","180","100","720"], correctIndex: 0, explanation: "Un cercle complet = 360 degres." },
    { question: "L'ecart-type mesure...", options: ["La dispersion","La tendance centrale","L'effectif","La frequence"], correctIndex: 0, explanation: "L'ecart-type mesure la dispersion des donnees." },
    { question: "La variance est le carre de...", options: ["L'ecart-type","La moyenne","La mediane","L'etendue"], correctIndex: 0, explanation: "Variance = ecart-type au carre." },
  ]
  // Default generic quiz
  return [
    { question: `En ${chapter}, quel concept est fondamental ?`, options: ["La definition de base","Le theoreme principal","La propriete cle","L'application directe"], correctIndex: 0, explanation: "La definition de base est toujours le point de depart." },
    { question: `Quelle methode utilise-t-on en ${chapter} ?`, options: ["Calcul direct","Demonstration","Construction graphique","Raisonnement par recurrence"], correctIndex: 0, explanation: "Le calcul direct est la methode la plus courante." },
    { question: `Quelle erreur courante en ${chapter} ?`, options: ["Oublier une condition","Mal appliquer la formule","Erreur de signe","Confondre les notions"], correctIndex: 0, explanation: "Oublier une condition est l'erreur la plus frequente." },
    { question: `Quel prerequis pour ${chapter} ?`, options: ["Calcul de base","Geometrie elementaire","Algebre","Logique"], correctIndex: 0, explanation: "Le calcul de base est essentiel." },
    { question: `Combien d'etapes dans un exercice type en ${chapter} ?`, options: ["3","4","5","2"], correctIndex: 0, explanation: "Un exercice type comporte generalement 3 etapes." },
  ]
}

// ===================== ABOUT APP =====================
export const ABOUT_APP = `Ndolomath
L'application qui t'aide a exceller en mathematiques.
Ndolomath est une application educative qui rassemble tous les cours de mathematiques de la sixieme a la terminale, ainsi que tous les sujets du BEPC, Probatoire A, C, D et Bac A, C, D de 1999 a nos jours, avec corrections.
L'application propose des biographies inspirantes, des conseils et des astuces pour progresser efficacement. Elle met a disposition des contenus texte, audio et video pour apprendre avec plaisir et evoluer chaque jour.`

export const ABOUT_CREATOR = `Madame Mba
Enseignante de mathematiques
Madame Mba a cree Ndolomath avec la volonte de rendre les mathematiques plus accessibles et comprehensibles pour tous. Elle a voulu creer une solution moderne pour apprendre les mathematiques de maniere plus claire et plus motivante.
Son objectif : aider les eleves a prendre confiance, permettre aux parents de mieux accompagner leur enfant dans leurs apprentissages, et proposer aux enseignants des contenus simples, concrets et pratiques.`

export const ABOUT_USAGE = `Ndolomath est une application que tu peux utiliser meme sans connexion internet. Pour une premiere utilisation, avec ta connexion internet, prends le temps de parcourir ta classe et d'ouvrir une a une les pages qui t'interessent : une fois chargees, tu pourras les revoir plus tard sans connexion.`

export function getExamLabel(classId: string): string | null {
  if (classId === "3e") return "BEPC"
  if (["1ereA","1ereC","1ereD"].includes(classId)) return "Probatoire"
  if (["TleA","TleC","TleD"].includes(classId)) return "Baccalaureat"
  return null
}

export function isExamClass(classId: string): boolean {
  return getExamLabel(classId) !== null
}

export function getExamCountdown(classId: string, userExamDate?: string | null): { label: string; days: number } | null {
  const label = getExamLabel(classId)
  if (!label) return null
  if (!userExamDate) return null // No date set = no countdown
  const now = new Date()
  const target = new Date(userExamDate + "T00:00:00")
  if (isNaN(target.getTime())) return null
  const days = Math.max(0, Math.ceil((target.getTime() - now.getTime()) / 86400000))
  return { label, days }
}

export function getExamBlancLabel(classId: string): string | null {
  if (classId === "3e") return "BEPC Blanc"
  if (["1ereA","1ereC","1ereD"].includes(classId)) return "Probatoire Blanc"
  if (["TleA","TleC","TleD"].includes(classId)) return "Bac Blanc"
  return null
}

export function getEvaluations(classId: string): { id: string; label: string }[] {
  const evals = []
  const examBlanc = getExamBlancLabel(classId)
  const count = examBlanc ? 5 : 6
  for (let i = 1; i <= count; i++) evals.push({ id: `eval-${i}`, label: `Evaluation ${i}` })
  if (examBlanc) evals.push({ id: "eval-blanc", label: examBlanc })
  return evals
}
