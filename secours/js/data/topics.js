/* Fiches de sensibilisation.
   Structure : id, cat, title, thumb, intro, signs, steps, warnings, avoid, emergency, sources, lastVerified.
   step  = [titre, description, [pose, zone, effet], idFicheLiée?]
   avoid = [erreur, pourquoi]
   lastVerified : null tant que la fiche n'a pas été relue (ex. "2026-10-05").
   ⚠ Contenu de démonstration : à faire relire par un formateur / professionnel de santé. */
window.SECOURS = window.SECOURS || {};

SECOURS.cats = [
  { id: "urgences", title: "URGENCES", sub: "Situations où chaque décision compte" },
  { id: "blessures", title: "BLESSURES", sub: "Plaies, brûlures, chocs" },
  { id: "environnement", title: "ENVIRONNEMENT", sub: "Eau, chaleur, froid, électricité" }
];

SECOURS.topics = [
/* ───────────── URGENCES ───────────── */
{ id: "inconscient", cat: "urgences", title: "Personne inconsciente", thumb: ["lie", "head", "tilt"],
  intro: "Une personne ne répond pas quand on lui parle ou quand on la secoue doucement.",
  signs: ["Ne répond pas à la voix", "Ne réagit pas quand on secoue doucement ses épaules", "Yeux fermés, corps relâché"],
  steps: [
    ["Sécurisez", "Regardez autour de vous : circulation, feu, courant, eau. Ne vous mettez pas en danger.", ["lie", null, "warn"]],
    ["Parlez, secouez doucement", "Parlez fort et secouez doucement les épaules. Sans réaction, criez pour appeler de l'aide.", ["lie", "shoulder", "tap"]],
    ["Alertez", "Appelez les secours ou faites-les appeler, en haut-parleur. Faites chercher un défibrillateur s'il y en a un.", ["lie", null, "phone"]],
    ["Libérez les voies aériennes", "Basculez doucement la tête en arrière et soulevez le menton.", ["lie", "head", "tilt"]],
    ["Vérifiez la respiration", "Regardez la poitrine, écoutez, sentez le souffle. Pas plus de 10 secondes.", ["lie", "head", "breath"]],
    ["Elle respire normalement", "Placez-la en position latérale de sécurité (PLS), un geste à apprendre en formation. Surveillez sa respiration jusqu'aux secours.", ["side", "chest", "pulse"]],
    ["Elle ne respire pas normalement", "Traitez comme un arrêt cardiaque : commencez les compressions thoraciques.", ["lie", "chest", "press"], "arret-cardiaque"]
  ],
  warnings: ["Si vous soupçonnez un traumatisme grave (accident, chute de hauteur), évitez de bouger la personne sauf pour libérer sa respiration ou en cas de danger, et suivez les instructions des secours."],
  avoid: [
    ["Ne la laissez pas seule sans avoir alerté", "Son état peut s'aggraver à tout moment."],
    ["Ne lui donnez ni à boire ni à manger", "Risque de fausse route : le liquide passe dans les voies respiratoires."],
    ["Ne la giflez pas, ne la secouez pas violemment", "Cela ne la réveille pas mieux et peut aggraver une blessure."]
  ],
  emergency: { when: ["Dès qu'une personne ne répond pas.", "Même si elle respire normalement."], note: "Restez auprès d'elle et suivez les instructions données au téléphone." },
  sources: ["erc-fa-2025", "erc-bls-2025", "ilcor"], lastVerified: null },

{ id: "arret-cardiaque", cat: "urgences", title: "Arrêt cardiaque", thumb: ["lie", "chest", "press"],
  intro: "Le cœur ne fait plus circuler le sang efficacement : la personne ne répond pas et ne respire pas, ou respire de façon anormale.",
  signs: ["Ne répond pas", "Ne respire pas, ou seulement par « halètements » irréguliers", "Parfois quelques secousses au tout début"],
  steps: [
    ["Constatez", "Elle ne répond pas et ne respire pas normalement : c'est une urgence vitale.", ["lie", null, "warn"]],
    ["Alertez", "Appelez les secours (haut-parleur) ou faites-les appeler. Faites apporter un défibrillateur (DAE) s'il y en a un.", ["lie", null, "phone"]],
    ["Comprimez", "Mains superposées au centre de la poitrine, bras tendus. Comprimez fort et vite : environ 5 à 6 cm de profondeur, 100 à 120 fois par minute.", ["lie", "chest", "press"]],
    ["Relâchez complètement", "Laissez la poitrine remonter entre deux compressions. Ne vous arrêtez pas sans nécessité.", ["lie", "chest", "press"]],
    ["Défibrillateur", "Dès qu'il arrive, allumez-le et suivez ses instructions vocales.", ["lie", "chest", "bolt"]],
    ["Continuez", "Continuez jusqu'à l'arrivée des secours, jusqu'à ce que la personne respire normalement ou que vous ne puissiez plus continuer. Relayez-vous si possible.", ["lie", "chest", "press"]]
  ],
  warnings: ["Si vous êtes formé et à l'aise, vous pouvez alterner 30 compressions et 2 insufflations. Sinon, compressions seules.", "Chez l'enfant et le nourrisson, les gestes diffèrent : à apprendre en formation."],
  avoid: [
    ["N'attendez pas d'être sûr à 100 %", "Les recommandations encouragent à agir en cas de doute. Les secours vous guident au téléphone."],
    ["Ne cherchez pas le pouls", "Difficile à évaluer sans formation : cela fait perdre du temps."],
    ["N'arrêtez pas sans raison", "Chaque pause réduit la circulation du sang vers le cerveau et le cœur."],
    ["Ne craignez pas de fracturer une côte", "C'est possible et ne doit pas vous faire arrêter."]
  ],
  emergency: { when: ["Immédiatement : ne répond pas + ne respire pas normalement."], note: "Ne raccrochez pas avant qu'on vous le dise." },
  sources: ["erc-bls-2025", "ilcor", "ifrc"], lastVerified: null },

{ id: "etouffement", cat: "urgences", title: "Étouffement", thumb: ["throat", "neck", "pulse"],
  intro: "Un corps étranger bloque partiellement ou totalement le passage de l'air.",
  signs: ["Légère : la personne peut parler, tousser, respirer", "Sévère : ne peut plus parler ni respirer, toux faible ou silencieuse, mains à la gorge"],
  steps: [
    ["Évaluez", "Demandez : « Vous vous étouffez ? ». Si elle tousse fort et peut parler, elle respire encore.", ["throat", "neck", "pulse"]],
    ["Toux efficace : encouragez", "Encouragez-la à tousser et restez auprès d'elle. Ne la frappez pas tant qu'elle tousse efficacement.", ["lean", "chest", "pulse"]],
    ["Toux inefficace : 5 tapes dans le dos", "Penchez-la en avant. Donnez jusqu'à 5 claques vigoureuses entre les omoplates, avec le talon de la main.", ["lean", "back", "blows"]],
    ["Toujours bloquée : compressions abdominales", "Placez-vous derrière, poing au-dessus du nombril, tirez vers vous et vers le haut, jusqu'à 5 fois.", ["stand", "abdomen", "thrust"]],
    ["Alternez et alertez", "Alternez 5 tapes dans le dos et 5 compressions abdominales. Faites alerter les secours.", ["stand", null, "phone"]],
    ["Elle perd connaissance", "Allongez-la, alertez si ce n'est pas fait et commencez les compressions thoraciques.", ["lie", "chest", "press"], "arret-cardiaque"]
  ],
  warnings: ["Nourrisson, jeune enfant, femme enceinte, personne très corpulente : gestes spécifiques, à apprendre en formation.", "Après des compressions abdominales, un avis médical est recommandé."],
  avoid: [
    ["Ne frappez pas le dos d'une personne qui tousse efficacement", "Vous risqueriez de déplacer l'objet et de bloquer complètement l'air."],
    ["Ne mettez pas les doigts au fond de la bouche à l'aveugle", "Vous pourriez enfoncer l'objet plus loin."],
    ["Ne lui donnez pas à boire", "Cela ne dégage pas l'objet et peut aggraver la situation."]
  ],
  emergency: { when: ["Toux inefficace ou impossibilité de respirer.", "Perte de connaissance.", "Après des compressions abdominales, même si tout semble aller mieux."] },
  sources: ["erc-fa-2025", "erc-bls-2025", "aha-arc"], lastVerified: null },

{ id: "hemorragie", cat: "urgences", title: "Hémorragie", thumb: ["stand", "arm", "press"],
  intro: "Un saignement abondant, qui coule ou jaillit et ne s'arrête pas.",
  signs: ["Sang qui coule en continu ou jaillit", "Vêtements ou sol rapidement imbibés", "Pâleur, faiblesse, sueurs, vertiges"],
  steps: [
    ["Protégez-vous", "Mettez des gants si possible. Sinon, faites comprimer la plaie par la personne elle-même.", ["stand", "arm", "warn"]],
    ["Comprimez la plaie", "Appuyez fort, sans relâcher, directement sur la plaie avec un tissu propre ou la main.", ["stand", "arm", "press"]],
    ["Allongez la personne", "Allongez-la et rassurez-la. Ne relâchez pas la pression.", ["lie", "arm", "press"]],
    ["Alertez", "Faites appeler les secours pendant que vous maintenez la pression.", ["lie", null, "phone"]],
    ["Maintenez", "Si le tissu s'imbibe, ajoutez-en un par-dessus sans retirer le premier. Couvrez la personne.", ["lie", "arm", "cover"]],
    ["Garrot : réservé aux personnes formées", "Il n'est envisagé que si la pression directe ne suffit pas, par une personne formée, souvent guidée par les secours.", ["stand", "arm", "warn"]]
  ],
  warnings: ["Objet planté dans la plaie : ne le retirez pas, comprimez autour."],
  avoid: [
    ["Ne retirez pas un objet planté", "Il peut boucher le vaisseau : le retirer peut aggraver le saignement."],
    ["Ne soulevez pas le pansement pour regarder", "Vous arracheriez le caillot qui commence à se former."],
    ["Ne donnez ni à boire ni à manger", "Une intervention médicale peut être nécessaire."],
    ["Ne posez pas de garrot sans formation", "Mal placé, il peut causer des lésions."]
  ],
  emergency: { when: ["Saignement abondant ou qui ne s'arrête pas.", "Pâleur, faiblesse, malaise.", "Objet planté."] },
  sources: ["erc-fa-2025", "aha-arc", "ifrc"], lastVerified: null },

{ id: "allergie", cat: "urgences", title: "Réaction allergique sévère", thumb: ["sit", "head", "pulse"],
  intro: "Une réaction allergique rapide qui peut gêner la respiration et provoquer un malaise, après une piqûre, un aliment ou un médicament.",
  signs: ["Gonflement du visage, des lèvres ou de la langue", "Gêne pour respirer, sifflements, gorge serrée", "Malaise, vertiges, vomissements, plaques étendues"],
  steps: [
    ["Reconnaissez", "Après un contact possible avec un allergène : gonflement, gêne respiratoire ou malaise.", ["sit", "head", "pulse"]],
    ["Alertez sans attendre", "Appelez les secours immédiatement. N'attendez pas de voir si cela passe.", ["sit", null, "phone"]],
    ["Auto-injecteur d'adrénaline", "Si la personne en a un prescrit, aidez-la à l'utiliser selon la notice (face externe de la cuisse).", ["sit", "leg", "pulse"]],
    ["Position adaptée", "Allongée si elle est faible ou pâle. Assise si elle respire mieux ainsi. Ne la laissez pas se lever brusquement.", ["lie", "chest", "pulse"]],
    ["Surveillez", "Restez auprès d'elle. Sans amélioration, une seconde dose peut être nécessaire selon la notice et les secours.", ["sit", "chest", "breath"]]
  ],
  warnings: ["Même si la personne va mieux, un avis médical reste nécessaire."],
  avoid: [
    ["N'attendez pas que cela passe", "Les signes graves peuvent s'aggraver rapidement."],
    ["Ne la faites pas marcher", "Se lever brusquement peut provoquer un malaise grave."],
    ["Ne comptez pas sur un antihistaminique seul", "Il n'agit pas assez vite sur la respiration ni sur le malaise."]
  ],
  emergency: { when: ["Dès que le visage gonfle, que la respiration est gênée ou qu'un malaise apparaît après une exposition à un allergène."] },
  sources: ["erc-fa-2025", "aha-arc"], lastVerified: null },

{ id: "malaise", cat: "urgences", title: "Malaise", thumb: ["sit", "head", "pulse"],
  intro: "Faiblesse, vertiges, sueurs ou gêne, sans cause évidente.",
  signs: ["Pâleur, sueurs", "Vertiges, faiblesse", "Douleur ou gêne (thorax, tête, ventre)", "Difficulté à parler, visage qui s'affaisse, faiblesse d'un côté du corps"],
  steps: [
    ["Mettez au calme", "Installez la personne en sécurité, rassurez-la, desserrez ce qui la gêne.", ["sit", null, "none"]],
    ["Posez des questions simples", "Comment vous sentez-vous ? Où avez-vous mal ? Avez-vous une maladie ou un traitement connus ? Retenez les réponses pour les secours.", ["sit", "head", "pulse"]],
    ["Choisissez la position", "Allongée si elle se sent faible ou pâle. Assise si elle respire mal ou a mal au thorax.", ["lie", "chest", "pulse"]],
    ["Repérez les signes d'alerte", "Douleur thoracique, gêne respiratoire, visage qui s'affaisse, faiblesse d'un bras, difficulté à parler, confusion : alertez immédiatement.", ["sit", null, "warn"]],
    ["Surveillez", "Restez avec elle. Si elle ne répond plus, appliquez la conduite pour une personne inconsciente.", ["sit", "head", "breath"], "inconscient"]
  ],
  warnings: [],
  avoid: [
    ["Ne donnez pas de médicaments de votre initiative", "Ils peuvent être inadaptés ou dangereux. Suivez les consignes des secours."],
    ["Ne la laissez pas se relever brusquement", "Le malaise peut revenir."],
    ["Ne donnez pas à boire à une personne confuse ou somnolente", "Risque de fausse route."]
  ],
  emergency: { when: ["Douleur thoracique, difficulté à respirer, difficulté à parler, visage qui s'affaisse, faiblesse d'un bras.", "Confusion ou somnolence.", "Malaise qui dure ou qui revient."] },
  sources: ["erc-fa-2025", "aha-arc"], lastVerified: null },

{ id: "intoxication", cat: "urgences", title: "Intoxication", thumb: ["sit", "head", "warn"],
  intro: "Un produit (médicament, produit ménager, plante…) avalé, respiré ou projeté.",
  signs: ["Produit ouvert ou renversé à proximité", "Somnolence, nausées, brûlures de la bouche, toux", "Enfant ayant pu avaler quelque chose"],
  steps: [
    ["Écartez", "Éloignez la personne et le produit. Aérez si des vapeurs sont en cause.", ["sit", null, "warn"]],
    ["Identifiez", "Quel produit ? Quelle quantité approximative ? À quelle heure ? Gardez l'emballage.", ["sit", null, "none"]],
    ["Appelez", "Appelez le centre antipoison de votre pays ou les secours, emballage en main.", ["sit", null, "phone"]],
    ["Suivez les consignes", "Faites exactement ce qu'on vous indique.", ["sit", null, "none"]],
    ["Surveillez", "Surveillez la conscience et la respiration. Si elle ne répond plus, voir « Personne inconsciente ».", ["sit", "head", "breath"], "inconscient"]
  ],
  warnings: ["Le numéro du centre antipoison dépend du pays : à renseigner dans la trousse et à conserver à portée de main."],
  avoid: [
    ["Ne faites pas vomir", "Le produit peut abîmer à nouveau la gorge et passer dans les poumons."],
    ["Ne donnez pas de lait ni d'aliments sans avis", "Cela peut aggraver la situation selon le produit."],
    ["Ne minimisez pas, surtout chez l'enfant", "Certains effets apparaissent avec retard."]
  ],
  emergency: { when: ["Perte de connaissance, convulsions ou gêne respiratoire.", "Produit dangereux ou inconnu.", "Enfant concerné."] },
  sources: ["erc-fa-2025", "national"], lastVerified: null },

/* ───────────── BLESSURES ───────────── */
{ id: "brulures", cat: "blessures", title: "Brûlures", thumb: ["stand", "arm", "drops"],
  intro: "Peau atteinte par la chaleur, un liquide brûlant, un produit chimique ou l'électricité.",
  signs: ["Rougeur, douleur vive", "Cloques", "Peau blanche, brune ou noire, parfois peu douloureuse (brûlure profonde)"],
  steps: [
    ["Éloignez de la source", "Éteignez ou éloignez la source de chaleur. Retirez les vêtements imbibés et les bijoux s'ils ne sont pas collés.", ["stand", "arm", "warn"]],
    ["Refroidissez à l'eau", "Eau courante fraîche (pas glacée), au moins 10 minutes ; certains référentiels vont jusqu'à 20 minutes.", ["stand", "arm", "drops"]],
    ["Couvrez", "Couvrez sans serrer avec un pansement stérile ou un linge propre non pelucheux.", ["stand", "arm", "cover"]],
    ["Alertez si nécessaire", "Voir « Besoin d'aide ? » : certaines brûlures nécessitent des secours.", ["stand", null, "phone"]],
    ["Surveillez", "Surveillez la personne. En cas de brûlure étendue, ne prolongez pas le refroidissement jusqu'à la faire grelotter : demandez conseil aux secours.", ["stand", "arm", "pulse"]]
  ],
  warnings: ["Brûlure chimique : rincez abondamment à l'eau en retirant les vêtements contaminés, et alertez."],
  avoid: [
    ["Pas de glace ni d'eau glacée", "Le froid extrême peut aggraver la lésion et refroidir la personne."],
    ["Pas de beurre, d'huile ni de dentifrice", "Ils retiennent la chaleur, salissent et gênent l'évaluation."],
    ["Ne percez pas les cloques", "Vous ouvririez la porte à une infection."],
    ["Ne retirez pas un vêtement collé à la peau", "Vous arracheriez la peau avec."]
  ],
  emergency: { when: ["Brûlure étendue ou profonde.", "Visage, cou, mains, pieds, articulations, parties intimes.", "Brûlure chimique ou électrique.", "Nourrisson, jeune enfant ou personne âgée.", "Gêne respiratoire ou fumées inhalées."] },
  sources: ["erc-fa-2025", "aha-arc", "ifrc"], lastVerified: null },

{ id: "plaies", cat: "blessures", title: "Plaies", thumb: ["stand", "hand", "cover"],
  intro: "Coupure, éraflure ou écorchure qui saigne peu ou modérément.",
  signs: ["Peau ouverte", "Saignement léger à modéré", "Souillures possibles (terre, gravier)"],
  steps: [
    ["Protégez-vous", "Lavez-vous les mains ou mettez des gants.", ["stand", "hand", "none"]],
    ["Arrêtez le saignement", "Appuyez avec un tissu propre pendant quelques minutes.", ["stand", "hand", "press"]],
    ["Nettoyez", "Rincez à l'eau propre courante ; lavez à l'eau et au savon autour de la plaie.", ["stand", "hand", "drops"]],
    ["Protégez", "Couvrez avec un pansement propre.", ["stand", "hand", "cover"]],
    ["Surveillez", "Rougeur qui s'étend, chaleur, gonflement, écoulement ou fièvre : avis médical. Vérifiez la vaccination contre le tétanos.", ["stand", "hand", "pulse"]]
  ],
  warnings: ["Saignement abondant : voir « Hémorragie »."],
  avoid: [
    ["Pas de coton directement sur la plaie", "Les fibres restent collées dans la plaie."],
    ["Ne retirez pas un objet planté", "Cela peut aggraver le saignement."],
    ["Ne soulevez pas sans cesse le pansement", "Vous retardez la cicatrisation."]
  ],
  emergency: { when: ["Plaie profonde ou large, ou saignement qui ne s'arrête pas.", "Morsure, plaie souillée ou objet planté.", "Plaie au visage, à l'œil, au thorax ou au ventre."] },
  sources: ["erc-fa-2025", "aha-arc"], lastVerified: null },

{ id: "traumatismes", cat: "blessures", title: "Traumatismes", thumb: ["lie", "leg", "pulse"],
  intro: "Chute, choc ou accident : douleur, gonflement, déformation, difficulté à bouger.",
  signs: ["Douleur vive après un choc", "Gonflement, déformation d'un membre", "Douleur à la nuque ou au dos", "Coup à la tête"],
  steps: [
    ["Sécurisez", "Écartez le danger (circulation, chute d'objets) avant de vous approcher.", ["lie", null, "warn"]],
    ["Ne bougez pas la personne sans nécessité", "Surtout après un choc violent, une chute de hauteur ou en cas de douleur à la nuque, au dos ou à la tête.", ["lie", "neck", "pulse"]],
    ["Parlez et alertez", "Rassurez-la, demandez-lui de ne pas bouger la tête. Faites alerter les secours.", ["lie", null, "phone"]],
    ["Soutenez le membre", "Laissez un membre douloureux ou déformé dans la position où il se trouve. Soutenez-le doucement.", ["lie", "leg", "pulse"]],
    ["Surveillez", "Surveillez la conscience et la respiration jusqu'aux secours.", ["lie", "head", "breath"]]
  ],
  warnings: ["Coup à la tête : alertez en cas de perte de connaissance, vomissements répétés, confusion, somnolence, convulsion ou écoulement de sang ou de liquide par le nez ou l'oreille."],
  avoid: [
    ["Ne remettez pas un membre déformé en place", "Vous pourriez léser des nerfs ou des vaisseaux."],
    ["Ne retirez pas un casque sans nécessité", "Geste risqué sans formation. Faites-le seulement si c'est indispensable pour respirer ou réanimer, guidé par les secours."],
    ["Ne relevez pas une personne qui se plaint de la nuque", "Vous pourriez aggraver une lésion."]
  ],
  emergency: { when: ["Douleur à la nuque ou au dos, chute de hauteur, choc violent.", "Coup à la tête avec signes d'alerte.", "Membre déformé ou saignement abondant."] },
  sources: ["erc-fa-2025", "aha-arc", "ifrc"], lastVerified: null },

{ id: "nez", cat: "blessures", title: "Saignement de nez", thumb: ["sit", "head", "hold"],
  intro: "Le nez saigne, souvent sans gravité.",
  signs: ["Sang qui coule d'une narine ou des deux"],
  steps: [
    ["Asseyez-vous, penchez en avant", "Tête penchée vers l'avant pour éviter que le sang coule dans la gorge.", ["lean", "head", "none"]],
    ["Pincez la partie molle du nez", "Bouche ouverte, sans relâcher pendant 10 minutes.", ["lean", "head", "hold"]],
    ["Crachez le sang", "Ne l'avalez pas.", ["lean", "head", "none"]],
    ["Vérifiez", "Après 10 minutes, relâchez doucement. Si cela saigne encore, recommencez une fois.", ["lean", "head", "pulse"]]
  ],
  warnings: [],
  avoid: [
    ["Ne renversez pas la tête en arrière", "Le sang coule dans la gorge : nausées, fausse route."],
    ["Ne relâchez pas trop tôt pour regarder", "Le caillot n'a pas le temps de se former."]
  ],
  emergency: { when: ["Saignement qui persiste après deux essais de 10 minutes.", "Saignement abondant ou après un choc.", "Personne sous traitement anticoagulant."] },
  sources: ["erc-fa-2025"], lastVerified: null },

{ id: "entorse", cat: "blessures", title: "Entorse", thumb: ["sit", "leg", "ice"],
  intro: "Une articulation est tordue : douleur, gonflement, difficulté à s'appuyer.",
  signs: ["Douleur après une torsion", "Gonflement", "Difficulté à bouger ou à prendre appui"],
  steps: [
    ["Arrêtez l'activité", "Installez la personne et évitez de forcer sur l'articulation.", ["sit", "leg", "none"]],
    ["Appliquez du froid protégé", "Poche froide enveloppée dans un linge, 10 à 20 minutes. Jamais directement sur la peau.", ["sit", "leg", "ice"]],
    ["Soutenez", "Maintenez l'articulation dans une position confortable. Un bandage souple peut aider sans serrer.", ["sit", "leg", "cover"]],
    ["Décidez de la suite", "Voir « Besoin d'aide ? » pour savoir quand demander un avis médical.", ["sit", null, "phone"]]
  ],
  warnings: [],
  avoid: [
    ["Pas de glace directement sur la peau", "Risque de brûlure par le froid."],
    ["Ne massez pas", "Cela peut aggraver les lésions."],
    ["Ne forcez pas à marcher", "Une fracture n'est pas toujours visible."]
  ],
  emergency: { when: ["Douleur intense ou impossibilité de prendre appui.", "Déformation visible.", "Engourdissement, pâleur ou gonflement rapide."] },
  sources: ["erc-fa-2025", "aha-arc"], lastVerified: null },

/* ───────────── ENVIRONNEMENT ───────────── */
{ id: "noyade", cat: "environnement", title: "Noyade", thumb: ["lie", "head", "breath"],
  intro: "Une personne est en difficulté dans l'eau ou vient d'en être sortie.",
  signs: ["Personne qui lutte ou coule", "Personne sortie de l'eau qui ne répond pas", "Une noyade peut être silencieuse"],
  steps: [
    ["Ne vous mettez pas en danger", "Restez au bord. N'entrez pas dans l'eau si vous n'êtes pas formé.", ["stand", null, "warn"]],
    ["Alertez", "Appelez les secours ou faites-les appeler. Appelez un sauveteur s'il y en a.", ["stand", null, "phone"]],
    ["Tendez quelque chose", "Perche, bouée, corde : tendez-la depuis le bord.", ["stand", "hand", "pulse"]],
    ["Personne sortie de l'eau", "Allongez-la sur le dos. Vérifiez sa respiration (10 secondes maximum).", ["lie", "head", "breath"]],
    ["Elle ne respire pas normalement", "Le manque d'oxygène est en cause. Formé : commencez par des insufflations puis les compressions. Non formé : compressions et instructions des secours.", ["lie", "chest", "press"], "arret-cardiaque"],
    ["Réchauffez", "Retirez les vêtements mouillés si possible et couvrez la personne.", ["lie", "chest", "cover"]]
  ],
  warnings: ["Toute personne qui a été en difficulté dans l'eau doit être examinée par un professionnel de santé, même si elle semble aller bien."],
  avoid: [
    ["N'entrez pas dans l'eau sans formation", "Une personne paniquée peut entraîner son sauveteur."],
    ["N'essayez pas de « vider » l'eau des poumons", "Tête en bas ou pression sur le ventre est inefficace et fait vomir."],
    ["Ne concluez pas trop vite que tout va bien", "Un avis médical reste nécessaire."]
  ],
  emergency: { when: ["Toute personne en difficulté dans l'eau.", "Personne sortie de l'eau qui ne répond pas ou respire mal."] },
  sources: ["erc-bls-2025", "erc-fa-2025", "ilcor"], lastVerified: null },

{ id: "chaleur", cat: "environnement", title: "Chaleur", thumb: ["sit", "head", "sun"],
  intro: "Exposition prolongée à la chaleur ou effort intense par forte chaleur.",
  signs: ["Peau chaude, rouge ou moite", "Maux de tête, nausées, soif, crampes", "Signes graves : confusion, comportement inhabituel, perte de connaissance"],
  steps: [
    ["Mettez au frais", "À l'ombre ou dans un endroit frais, si possible ventilé.", ["sit", null, "sun"]],
    ["Allégez", "Retirez les vêtements en excès.", ["sit", "chest", "none"]],
    ["Refroidissez", "Eau fraîche sur la peau, linges mouillés, ventilation.", ["sit", "chest", "drops"]],
    ["Faites boire", "Si elle est consciente et capable d'avaler : petites gorgées d'eau fraîche.", ["sit", "head", "none"]],
    ["Alertez si besoin", "Confusion, pas d'amélioration rapide ou malaise grave : appelez les secours.", ["sit", null, "phone"]]
  ],
  warnings: [],
  avoid: [
    ["Ne la laissez pas au soleil", "La température du corps continue de monter."],
    ["Ne forcez pas à boire une personne confuse ou somnolente", "Risque de fausse route."],
    ["Ne reprenez pas l'effort", "Cela aggrave la situation."]
  ],
  emergency: { when: ["Confusion, comportement inhabituel, convulsions ou perte de connaissance.", "Absence d'amélioration après refroidissement."] },
  sources: ["erc-fa-2025", "aha-arc"], lastVerified: null },

{ id: "froid", cat: "environnement", title: "Froid", thumb: ["sit", "chest", "snow"],
  intro: "Le corps perd plus de chaleur qu'il n'en produit.",
  signs: ["Frissons, peau froide, engourdissement", "Gestes maladroits, paroles confuses, somnolence", "Frissons qui s'arrêtent : signe grave"],
  steps: [
    ["Mettez à l'abri", "Protégez du vent, de l'humidité et du froid.", ["sit", null, "snow"]],
    ["Isolez et couvrez", "Retirez les vêtements mouillés, isolez du sol, couvrez avec des couvertures, couvrez la tête.", ["sit", "chest", "cover"]],
    ["Manipulez avec douceur", "Évitez les mouvements brusques.", ["sit", null, "none"]],
    ["Boisson chaude", "Si elle est consciente et capable d'avaler : boisson chaude et sucrée.", ["sit", "head", "none"]],
    ["Alertez si besoin", "Confusion, somnolence importante ou absence d'amélioration : appelez les secours.", ["sit", null, "phone"]]
  ],
  warnings: [],
  avoid: [
    ["Ne frottez pas, ne massez pas", "Cela peut abîmer la peau et ne réchauffe pas."],
    ["Pas d'alcool", "Il augmente la perte de chaleur."],
    ["Pas de bain très chaud ni de source de chaleur directe", "Risque de brûlure et de choc."]
  ],
  emergency: { when: ["Confusion, somnolence importante, frissons qui cessent.", "Absence d'amélioration."] },
  sources: ["erc-fa-2025", "aha-arc"], lastVerified: null },

{ id: "electrocution", cat: "environnement", title: "Électrocution", thumb: ["lie", "hand", "bolt"],
  intro: "Une personne a reçu un choc électrique.",
  signs: ["Personne encore en contact avec un appareil ou un câble", "Brûlures aux points d'entrée et de sortie", "Malaise, perte de connaissance"],
  steps: [
    ["Ne touchez pas la victime", "Tant que le courant n'est pas coupé, ne la touchez surtout pas.", ["lie", "hand", "warn"]],
    ["Coupez le courant", "Disjoncteur ou prise, seulement si vous pouvez le faire en sécurité.", ["stand", null, "bolt"]],
    ["Ligne haute tension", "Restez à distance et alertez : le courant peut se propager dans le sol.", ["stand", null, "warn"]],
    ["Alertez", "Appelez les secours, même si la personne semble bien.", ["lie", null, "phone"]],
    ["Une fois en sécurité", "Vérifiez si elle répond et respire. Sinon, suivez la conduite d'urgence correspondante.", ["lie", "head", "breath"], "inconscient"]
  ],
  warnings: [],
  avoid: [
    ["Ne touchez pas une personne encore en contact avec le courant", "Vous seriez électrisé à votre tour."],
    ["N'utilisez pas d'objet métallique ou humide pour l'écarter", "Il peut conduire le courant."],
    ["Ne vous approchez pas d'un câble tombé", "Le courant peut se propager dans le sol."]
  ],
  emergency: { when: ["Après tout choc électrique, même si la personne semble bien : un avis médical est nécessaire."] },
  sources: ["erc-fa-2025", "erc-bls-2025"], lastVerified: null }
];
