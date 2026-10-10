/* Scénarios : contexte → observation → décision → explication → conduite → alerte → fin.
   decisions[i].o = options { t: texte, r: 'ok' | 'nuance' | 'no', w: explication }.
   L'option « Je ne sais pas » est ajoutée automatiquement.
   La conduite pas à pas vient de la fiche liée (topic). */
(function () {
window.SECOURS = window.SECOURS || {};

const ok = (t, w) => ({ t, r: "ok", w });
const nu = (t, w) => ({ t, r: "nuance", w });
const no = (t, w) => ({ t, r: "no", w });

SECOURS.envs = [
  { id: "maison", label: "🏠 MAISON" }, { id: "ecole", label: "🏫 ÉCOLE" }, { id: "route", label: "🛣️ ROUTE" },
  { id: "travail", label: "🏢 TRAVAIL" }, { id: "exterieur", label: "🌳 EXTÉRIEUR" }, { id: "eau", label: "🏖️ EAU" }
];

SECOURS.scenarios = [
{ id: "s01", n: "01", title: "Personne inconsciente", place: "Dans la rue", env: ["route", "exterieur"], topic: "inconscient",
  context: ["Vous êtes dans la rue.", "Une personne marche devant vous.", "Soudain, elle s'effondre. Elle ne bouge plus."],
  scene: { bg: "street", victim: { pose: "lie", x: 88, s: 0.85, fall: true }, others: [{ pose: "stand", x: 28, s: 0.75 }] },
  observe: [
    { k: "victim", label: "La personne", text: "Elle est allongée, immobile. Ce que vous devez vérifier : réagit-elle ?" },
    { k: "danger", label: "Danger potentiel", at: [82, 42], text: "Des véhicules passent à proximité. Avant de vous approcher, regardez si la circulation ou autre chose peut vous menacer, vous ou elle." },
    { k: "breath", label: "Respiration", text: "De loin, on ne voit pas bien. Il faudra s'approcher pour regarder la poitrine, écouter, sentir le souffle." },
    { k: "reaction", label: "Réaction", text: "Elle n'a pas bougé depuis sa chute. Il faudra lui parler fort et secouer doucement ses épaules." },
    { k: "others", label: "Entourage", text: "Un passant s'est arrêté. Il peut appeler les secours pendant que vous restez auprès d'elle." }
  ],
  decisions: [
    { q: "Que faites-vous en premier ?", o: [
      ok("Je regarde s'il y a un danger, puis je m'approche.", "La sécurité d'abord : un sauveteur blessé ne peut plus aider."),
      nu("Je cours la relever.", "L'élan est bon, mais la relever peut aggraver une blessure et vous exposer si un danger existe."),
      no("Je continue mon chemin : quelqu'un d'autre s'en occupera.", "Chacun peut penser que quelqu'un d'autre agira. Vous pouvez être la personne qui alerte.")] },
    { q: "La personne répond-elle ?", ctx: "Vous vous êtes approché. Vous lui parlez fort et secouez doucement ses épaules.", o: [
      ok("NON", "Elle ne répond pas : faites appeler les secours et chercher un défibrillateur."),
      nu("OUI", "Dans cette scène elle ne répond pas. Si elle répond, restez avec elle et alertez si elle se sent mal.")] },
    { q: "Elle ne répond pas. Que faites-vous ensuite ?", o: [
      ok("Je libère ses voies aériennes (tête en arrière, menton relevé) et je vérifie sa respiration.", "C'est la démarche recommandée. La vérification ne doit pas dépasser 10 secondes."),
      no("Je lui donne à boire pour qu'elle reprenne ses esprits.", "Risque de fausse route : on ne donne rien à boire à une personne inconsciente."),
      no("J'attends un peu pour voir si elle se réveille.", "Sans réponse, chaque minute perdue compte. Alertez et vérifiez la respiration.")] }
  ],
  surv: ["Vérifiez régulièrement que la personne respire normalement.", "Si elle respire : position latérale de sécurité et surveillance jusqu'aux secours.", "Si elle cesse de respirer normalement : compressions thoraciques.", "Dites aux secours ce que vous avez observé."] },

{ id: "s02", n: "02", title: "Arrêt cardiaque", place: "Au bureau", env: ["travail"], topic: "arret-cardiaque",
  context: ["Vous êtes au travail.", "Un collègue dit avoir un vertige, puis s'affaisse de sa chaise.", "Il ne répond plus."],
  scene: { bg: "work", victim: { pose: "lie", x: 82, s: 0.85, fall: true }, others: [{ pose: "stand", x: 30, s: 0.75 }, { pose: "stand", x: 128, s: 0.75 }] },
  observe: [
    { k: "victim", label: "La personne", text: "Il est au sol et ne bouge pas." },
    { k: "breath", label: "Respiration", text: "Sa poitrine ne se soulève pas normalement. Parfois on voit des halètements irréguliers : ce n'est pas une respiration normale." },
    { k: "reaction", label: "Réaction", text: "Il ne répond pas quand on lui parle ou qu'on secoue ses épaules." },
    { k: "env", label: "Environnement", at: [85, 40], text: "Pas de danger visible. Un défibrillateur est peut-être installé dans le bâtiment : demandez." },
    { k: "others", label: "Entourage", text: "Plusieurs collègues regardent. Répartissez les rôles : un appelle, un cherche le défibrillateur." }
  ],
  decisions: [
    { q: "Il ne répond pas et sa respiration est anormale. Que faites-vous ?", o: [
      ok("Je fais alerter les secours et chercher un défibrillateur.", "Une personne qui ne répond pas et ne respire pas normalement est en arrêt cardiaque."),
      nu("Je le mets sur le côté et j'attends.", "La position latérale convient à une personne qui respire normalement. Ici la respiration est anormale."),
      no("J'attends de voir si cela s'arrange.", "Sans aide rapide, la situation ne s'arrange pas d'elle-même.")] },
    { q: "Qui alerte ? Comment ?", o: [
      ok("Je désigne quelqu'un précisément : « Appelez les secours, mettez en haut-parleur ».", "Une consigne claire à une personne précise évite que chacun pense que quelqu'un d'autre l'a fait."),
      nu("Je crie « Quelqu'un appelle ! » à la cantonade.", "Chacun peut croire que quelqu'un d'autre s'en charge. Désignez une personne."),
      no("Je m'éloigne pour appeler moi-même.", "Pendant ce temps, personne ne comprime. Faites appeler par quelqu'un d'autre.")] },
    { q: "Où appuyez-vous, et comment ?", o: [
      ok("Au centre de la poitrine, mains superposées, bras tendus, fort et vite.", "5 à 6 cm de profondeur, environ 100 à 120 par minute, en relâchant complètement."),
      no("Sur le ventre, doucement.", "Cela ne fait pas circuler le sang. Les compressions se font sur la poitrine."),
      nu("J'appuie légèrement, de peur de faire mal.", "Des compressions trop faibles sont inefficaces. Il faut comprimer fort, même si une côte peut se fracturer.")] }
  ],
  surv: ["Continuez sans interruption inutile jusqu'à l'arrivée des secours.", "Relayez-vous si possible.", "Dès que le défibrillateur arrive, suivez ses instructions vocales.", "Transmettez aux secours l'heure approximative de l'effondrement."] },

{ id: "s03", n: "03", title: "Étouffement", place: "À table", env: ["maison"], topic: "etouffement",
  context: ["Vous êtes à table avec des proches.", "Un convive porte les mains à sa gorge.", "Il ne peut plus parler."],
  scene: { bg: "home", victim: { pose: "throat", x: 80, s: 0.8 }, others: [{ pose: "sit", x: 38, s: 0.7 }, { pose: "sit", x: 128, s: 0.7 }] },
  observe: [
    { k: "victim", label: "La personne", text: "Elle est debout, agitée, mains à la gorge." },
    { k: "breath", label: "Respiration", text: "Elle ne peut plus parler et sa toux est faible ou silencieuse : c'est le signe d'une obstruction sévère." },
    { k: "reaction", label: "Réaction", text: "Elle vous regarde et fait signe. Vous pouvez lui demander : « Vous vous étouffez ? »." },
    { k: "env", label: "Environnement", at: [50, 60], text: "Un aliment ou un petit objet est peut-être en cause. Gardez-le en tête pour les secours." },
    { k: "others", label: "Entourage", text: "Les autres convives sont sous le choc. Quelqu'un peut appeler les secours." }
  ],
  decisions: [
    { q: "Elle hoche la tête sans pouvoir parler. Que faites-vous ?", o: [
      ok("Je la penche en avant et je donne jusqu'à 5 claques entre les omoplates.", "C'est la première étape face à une obstruction sévère."),
      no("Je lui fais lever les bras.", "Cela n'aide pas à dégager les voies aériennes."),
      no("Je lui donne un verre d'eau.", "Cela ne dégage pas l'objet et peut aggraver la situation.")] },
    { q: "Les claques dans le dos n'ont pas suffi. Que faites-vous ?", o: [
      ok("Je fais alerter les secours et je fais jusqu'à 5 compressions abdominales.", "On alterne tapes dans le dos et compressions abdominales tout en faisant alerter les secours."),
      nu("Je recommence seulement les claques.", "Alternez avec des compressions abdominales si les claques échouent."),
      no("Je passe mes doigts au fond de sa gorge.", "Vous risquez d'enfoncer l'objet plus loin.")] },
    { q: "Elle perd connaissance. Que faites-vous ?", o: [
      ok("Je l'allonge, je fais alerter les secours et je commence les compressions thoraciques.", "Une personne inconsciente qui ne respire pas est prise en charge comme un arrêt cardiaque."),
      no("Je continue les compressions abdominales debout.", "Une personne inconsciente ne peut plus être maintenue debout."),
      no("J'attends les secours sans rien faire.", "Il faut agir : les secours peuvent mettre du temps à arriver.")] }
  ],
  surv: ["Toute personne ayant reçu des compressions abdominales doit être examinée par un médecin.", "Si elle respire à nouveau et se sent mal, restez auprès d'elle.", "Décrivez aux secours ce qui s'est passé."] },

{ id: "s04", n: "04", title: "Saignement important", place: "Dans un atelier", env: ["travail", "ecole"], topic: "hemorragie",
  context: ["Vous êtes dans un atelier.", "Un collègue se coupe profondément l'avant-bras.", "Le sang coule abondamment."],
  scene: { bg: "work", victim: { pose: "stand", x: 84, s: 0.8 }, others: [{ pose: "stand", x: 34, s: 0.72 }] },
  observe: [
    { k: "victim", label: "La personne", text: "Elle tient son bras. Elle est pâle et parle vite." },
    { k: "danger", label: "Danger potentiel", at: [62, 78], text: "Un outil tranchant est resté au sol. Écartez-le pour éviter une deuxième blessure." },
    { k: "reaction", label: "Réaction", text: "Elle répond, mais paraît faible. Elle vous regarde et attend de l'aide." },
    { k: "env", label: "Environnement", at: [20, 40], text: "Un chiffon propre et des gants sont sur l'établi." },
    { k: "others", label: "Entourage", text: "Un collègue peut appeler les secours pendant que vous comprimez." }
  ],
  decisions: [
    { q: "Que faites-vous en premier ?", o: [
      ok("Je comprime fortement la plaie avec un tissu propre.", "La compression directe est le geste principal face à un saignement abondant."),
      nu("Je pose un garrot avec une ceinture.", "Le garrot est réservé aux personnes formées, si la pression ne suffit pas."),
      no("Je passe la plaie sous l'eau pendant longtemps.", "Il faut d'abord arrêter le saignement en comprimant.")] },
    { q: "Le saignement est abondant. Que faites-vous ?", o: [
      ok("Je fais alerter les secours pendant que je maintiens la pression.", "Un saignement abondant nécessite des secours. Ne relâchez pas la pression."),
      nu("Je l'emmène moi-même en voiture sans alerter.", "Vous ne pourrez pas comprimer en conduisant, et son état peut s'aggraver en route."),
      no("J'attends de voir si cela s'arrête.", "Un saignement abondant ne s'arrête pas seul.")] },
    { q: "Le tissu s'imbibe de sang. Que faites-vous ?", o: [
      ok("J'ajoute un tissu par-dessus, sans relâcher.", "Retirer le premier tissu arracherait le caillot qui commence à se former."),
      no("Je retire le tissu pour regarder la plaie.", "Vous arracheriez le caillot et le saignement reprendrait."),
      nu("Je serre moins fort pour économiser mes forces.", "Gardez une pression ferme et continue. Relayez-vous si possible.")] }
  ],
  surv: ["Maintenez la pression jusqu'à l'arrivée des secours.", "Allongez et couvrez la personne, rassurez-la.", "Surveillez sa conscience et sa respiration.", "Ne lui donnez ni à boire ni à manger."] },

{ id: "s05", n: "05", title: "Brûlure", place: "Dans la cuisine", env: ["maison"], topic: "brulures",
  context: ["Vous cuisinez avec un proche.", "Une casserole d'eau bouillante se renverse sur son avant-bras.", "Il crie de douleur."],
  scene: { bg: "home", victim: { pose: "stand", x: 84, s: 0.8 }, others: [] },
  observe: [
    { k: "victim", label: "La personne", text: "Elle tient son avant-bras. La peau rougit." },
    { k: "danger", label: "Danger potentiel", at: [64, 82], text: "De l'eau chaude est au sol : risque de glissade et de nouvelle brûlure." },
    { k: "reaction", label: "Réaction", text: "Elle est consciente et parle, mais souffre beaucoup." },
    { k: "env", label: "Environnement", at: [22, 45], text: "L'évier est à proximité : de l'eau courante est disponible." }
  ],
  decisions: [
    { q: "Que faites-vous en premier ?", o: [
      ok("Je l'éloigne de la source et je retire ce qui est imbibé, sauf ce qui colle à la peau.", "Il faut faire cesser le contact avec la chaleur."),
      no("J'étale du dentifrice sur la brûlure.", "Cela retient la chaleur et gêne l'évaluation."),
      nu("J'applique de la glace.", "Le froid extrême peut aggraver la lésion. Utilisez de l'eau fraîche courante.")] },
    { q: "Comment refroidissez-vous ?", o: [
      ok("À l'eau courante fraîche, au moins 10 minutes.", "Le refroidissement limite l'aggravation de la brûlure."),
      no("Avec de la glace directement sur la peau.", "Risque de lésion supplémentaire."),
      nu("Avec une compresse sèche.", "Elle ne refroidit pas. Commencez par l'eau fraîche.")] },
    { q: "Quand faut-il appeler les secours ?", o: [
      ok("Si la brûlure est étendue, profonde, sur le visage, les mains, ou chez un jeune enfant.", "Ce sont des critères de gravité. En cas de doute, demandez conseil."),
      no("Jamais : une brûlure se soigne toujours seul.", "Certaines brûlures nécessitent des soins médicaux urgents."),
      nu("Seulement si la personne pleure.", "La douleur n'est pas un critère fiable de gravité.")] }
  ],
  surv: ["Après le refroidissement, couvrez sans serrer avec un pansement propre.", "Surveillez la personne.", "Ne percez pas les cloques.", "Demandez un avis médical au moindre doute."] },

{ id: "s06", n: "06", title: "Malaise", place: "Dans la cour", env: ["ecole", "exterieur"], topic: "malaise",
  context: ["Vous êtes dans la cour, il fait chaud.", "Une personne s'arrête, pâle et en sueur.", "Elle dit qu'elle se sent mal."],
  scene: { bg: "school", victim: { pose: "sit", x: 82, s: 0.8 }, others: [{ pose: "stand", x: 32, s: 0.7 }, { pose: "stand", x: 128, s: 0.7 }] },
  observe: [
    { k: "victim", label: "La personne", text: "Elle est assise, pâle et en sueur." },
    { k: "reaction", label: "Réaction", text: "Elle répond, mais lentement. Elle paraît faible." },
    { k: "env", label: "Environnement", at: [50, 25], text: "Soleil direct et forte chaleur : un endroit à l'ombre serait préférable." },
    { k: "others", label: "Entourage", text: "Des curieux se rapprochent. Demandez-leur de laisser de la place." }
  ],
  decisions: [
    { q: "Elle répond mais se sent faible. Que faites-vous ?", o: [
      ok("Je l'installe au calme, à l'ombre, et je lui parle.", "Rassurer et mettre à l'abri est un premier réflexe utile."),
      no("Je lui dis de se relever vite.", "Elle risque un nouveau malaise."),
      nu("Je lui donne un médicament que j'ai dans mon sac.", "Ne donnez pas de médicament de votre initiative.")] },
    { q: "Elle dit avoir mal à la poitrine et parle difficilement. Que faites-vous ?", o: [
      ok("J'alerte immédiatement les secours.", "Douleur thoracique et difficulté à parler sont des signes d'alerte."),
      no("J'attends que cela passe.", "Ces signes peuvent être graves."),
      nu("Je lui fais boire de l'eau.", "Boire ne règle pas ces signes et peut faire fausse route si elle est confuse.")] },
    { q: "Elle devient somnolente et ne répond plus. Que faites-vous ?", o: [
      ok("Je vérifie sa respiration et j'applique la conduite pour une personne inconsciente.", "Elle ne répond plus : c'est un nouvel état, à traiter comme tel."),
      no("Je la laisse dormir.", "Une somnolence qui s'aggrave est un signe d'alerte."),
      nu("Je lui donne à boire pour la réveiller.", "Risque de fausse route.")] }
  ],
  surv: ["Restez auprès d'elle jusqu'à l'amélioration ou l'arrivée des secours.", "Surveillez la conscience et la respiration.", "Retenez ce qu'elle vous a dit pour le répéter aux secours."] },

{ id: "s07", n: "07", title: "Réaction allergique sévère", place: "Pique-nique", env: ["exterieur"], topic: "allergie",
  context: ["Vous êtes en pique-nique.", "Un ami est piqué par une guêpe.", "Quelques minutes plus tard, son visage gonfle et il respire mal."],
  scene: { bg: "outdoor", victim: { pose: "sit", x: 82, s: 0.8 }, others: [{ pose: "stand", x: 34, s: 0.72 }] },
  observe: [
    { k: "victim", label: "La personne", text: "Son visage gonfle. Il porte la main à sa gorge." },
    { k: "breath", label: "Respiration", text: "Sa respiration est sifflante et difficile." },
    { k: "reaction", label: "Réaction", text: "Il est conscient mais inquiet, et il vous dit qu'il a un stylo d'adrénaline dans son sac." },
    { k: "env", label: "Environnement", at: [50, 60], text: "Des guêpes et de la nourriture sont sur la table. Éloignez-vous de la source." }
  ],
  decisions: [
    { q: "Que faites-vous en premier ?", o: [
      ok("J'alerte les secours immédiatement.", "Une réaction sévère peut s'aggraver très vite."),
      no("J'attends 30 minutes pour voir.", "Les signes graves demandent une aide immédiate."),
      nu("Je lui donne un antihistaminique et j'attends.", "Il n'agit pas assez vite sur la respiration.")] },
    { q: "Il a un auto-injecteur d'adrénaline. Que faites-vous ?", o: [
      ok("Je l'aide à l'utiliser selon la notice.", "Il est prescrit pour ce type de situation."),
      no("Je le garde pour plus tard.", "L'auto-injecteur doit être utilisé dès les signes graves."),
      nu("Je préfère attendre les secours.", "Les secours mettent du temps : ne retardez pas l'injection.")] },
    { q: "Il a des vertiges. Quelle position ?", o: [
      ok("Allongé, ou assis s'il respire mieux ainsi, sans le faire se lever.", "La position dépend de la respiration et du malaise."),
      no("Je le fais marcher pour qu'il se remette.", "Se lever brusquement peut provoquer un malaise grave."),
      nu("Debout, pour qu'il respire mieux.", "Debout, le malaise peut s'aggraver.")] }
  ],
  surv: ["Restez auprès de lui jusqu'à l'arrivée des secours.", "Sans amélioration, une seconde dose peut être nécessaire selon la notice et les secours.", "Gardez l'auto-injecteur utilisé pour le donner aux secours."] },

{ id: "s08", n: "08", title: "Noyade", place: "Au bord de l'eau", env: ["eau"], topic: "noyade",
  context: ["Vous êtes au bord de l'eau.", "Une personne lutte à quelques mètres.", "Elle agite les bras, puis coule."],
  scene: { bg: "water", victim: { pose: "stand", x: 92, s: 0.75 }, others: [] },
  observe: [
    { k: "victim", label: "La personne", text: "Elle est en difficulté. Une noyade peut être silencieuse." },
    { k: "danger", label: "Danger potentiel", at: [30, 80], text: "L'eau est profonde et il peut y avoir du courant. Ne vous y jetez pas sans formation." },
    { k: "env", label: "Environnement", at: [20, 40], text: "Une bouée est accrochée près du bord." }
  ],
  decisions: [
    { q: "Que faites-vous ?", o: [
      ok("Je reste au bord, j'appelle à l'aide et je fais appeler les secours.", "Ne vous mettez pas en danger : une personne paniquée peut entraîner son sauveteur."),
      nu("Je plonge immédiatement.", "Sans formation, vous risquez de devenir une seconde victime."),
      no("Je regarde pour voir si elle s'en sort.", "Une noyade évolue très vite.")] },
    { q: "Une bouée est accrochée près du bord. Que faites-vous ?", o: [
      ok("Je la lui tends ou la lui lance depuis le bord.", "Un objet flottant permet de l'aider sans entrer dans l'eau."),
      no("Je la garde pour moi.", "Elle est là pour secourir."),
      nu("Je nage avec elle vers la personne.", "Sans formation, restez au bord.")] },
    { q: "Elle est sortie de l'eau et ne répond pas. Que faites-vous ?", o: [
      ok("Je l'allonge, libère les voies aériennes et vérifie la respiration. Si elle est anormale, j'applique la conduite d'arrêt cardiaque.", "Le manque d'oxygène est en cause : suivez les recommandations et les instructions des secours."),
      no("Je la mets la tête en bas pour vider l'eau.", "Inefficace, et cela fait vomir."),
      nu("Je la laisse se reposer au soleil.", "Elle ne répond pas : c'est une urgence.")] }
  ],
  surv: ["Retirez les vêtements mouillés si possible et couvrez la personne.", "Surveillez la respiration.", "Toute personne en difficulté dans l'eau doit être examinée par un professionnel de santé."] },

{ id: "s09", n: "09", title: "Traumatisme", place: "Sur la piste cyclable", env: ["route"], topic: "traumatismes",
  context: ["Vous êtes sur une piste cyclable.", "Un cycliste chute violemment et reste au sol.", "Il se plaint du cou et du dos."],
  scene: { bg: "road", victim: { pose: "lie", x: 86, s: 0.85 }, others: [{ pose: "stand", x: 32, s: 0.72 }] },
  observe: [
    { k: "victim", label: "La personne", text: "Il est allongé et parle, mais souffre." },
    { k: "danger", label: "Danger potentiel", at: [60, 55], text: "D'autres cyclistes et des véhicules peuvent arriver. Signalez la zone." },
    { k: "reaction", label: "Réaction", text: "Il répond, mais vous dit avoir mal à la nuque." },
    { k: "others", label: "Entourage", text: "Un passant peut signaler la zone et alerter les secours." }
  ],
  decisions: [
    { q: "Que faites-vous en premier ?", o: [
      ok("Je sécurise la zone puis je lui parle.", "Sécurité d'abord, puis contact verbal."),
      no("Je le relève pour le mettre à l'écart.", "Une douleur à la nuque impose de ne pas le bouger sans nécessité."),
      nu("Je lui retire son casque.", "Geste risqué sans formation : à éviter sauf nécessité vitale.")] },
    { q: "Il répond mais souffre de la nuque. Que faites-vous ?", o: [
      ok("J'alerte et je lui demande de ne pas bouger la tête.", "Rassurer et limiter les mouvements est la meilleure conduite."),
      no("Je l'aide à se lever pour vérifier qu'il tient debout.", "Vous pourriez aggraver une lésion."),
      nu("J'attends de voir s'il va mieux.", "Une douleur à la nuque après un choc violent justifie d'alerter.")] },
    { q: "Une jambe semble déformée. Que faites-vous ?", o: [
      ok("Je ne la remets pas en place, je la soutiens dans la position trouvée.", "Remettre en place peut léser des nerfs ou des vaisseaux."),
      no("Je tire sur la jambe pour la remettre droite.", "Geste dangereux."),
      nu("Je lui demande de marcher pour tester.", "Une fracture n'est pas toujours visible : évitez tout appui.")] }
  ],
  surv: ["Surveillez la conscience et la respiration jusqu'aux secours.", "Rassurez-le, gardez-le au chaud.", "Décrivez aux secours ce que vous avez vu de la chute."] },

{ id: "s10", n: "10", title: "Accident domestique", place: "À la maison", env: ["maison"], topic: "intoxication",
  context: ["Vous gardez un enfant à la maison.", "Vous trouvez un flacon de produit ménager ouvert à côté de lui.", "Il en a peut-être avalé."],
  scene: { bg: "home", victim: { pose: "sit", x: 82, s: 0.55 }, others: [] },
  observe: [
    { k: "victim", label: "L'enfant", text: "Il est éveillé et pleure." },
    { k: "env", label: "Le flacon", at: [56, 78], text: "Le flacon est ouvert. Gardez l'emballage pour les secours." },
    { k: "danger", label: "Danger potentiel", at: [22, 30], text: "Des vapeurs peuvent gêner. Aérez si possible." }
  ],
  decisions: [
    { q: "Que faites-vous en premier ?", o: [
      ok("J'éloigne l'enfant et le produit, et je garde l'emballage.", "L'emballage permet d'identifier le produit."),
      no("Je le fais vomir.", "Le produit peut abîmer à nouveau et passer dans les poumons."),
      nu("Je lui donne du lait.", "Cela peut aggraver selon le produit. Demandez conseil.")] },
    { q: "Qui appelez-vous ?", o: [
      ok("Le centre antipoison ou les secours, avec le nom du produit.", "Ils vous guident selon le produit et l'état de l'enfant."),
      no("J'attends de voir s'il a des symptômes.", "Certains effets apparaissent avec retard."),
      nu("Je cherche d'abord sur internet.", "Appelez d'abord : vous perdez du temps sinon.")] },
    { q: "Il devient somnolent. Que faites-vous ?", o: [
      ok("Je vérifie sa respiration et j'applique la conduite pour une personne inconsciente, secours déjà alertés.", "C'est un signe d'aggravation."),
      no("Je le laisse dormir.", "La somnolence est un signe d'alerte."),
      nu("Je lui donne à boire.", "Risque de fausse route.")] }
  ],
  surv: ["Gardez l'emballage du produit.", "Surveillez la conscience et la respiration.", "Suivez les consignes des secours ou du centre antipoison.", "Rangez tous les produits hors de portée après l'incident."] }
];
})();
