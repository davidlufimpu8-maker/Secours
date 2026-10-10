/* Quiz, « Mythe ou bon réflexe ? », trousse, « Les premières secondes ». */
(function () {
window.SECOURS = window.SECOURS || {};
const ok = (t, w) => ({ t, r: "ok", w });
const nu = (t, w) => ({ t, r: "nuance", w });
const no = (t, w) => ({ t, r: "no", w });

SECOURS.quiz = [
  { q: "Vous arrivez sur les lieux : une personne est au sol. Que faites-vous en premier ?", topic: "inconscient", o: [
    ok("Je regarde s'il y a un danger pour moi ou pour elle.", "La sécurité d'abord : un sauveteur blessé ne peut plus aider."),
    nu("Je me précipite pour la secouer.", "L'élan est bon, mais vérifier le danger avant protège tout le monde."),
    no("Je la déplace loin de la scène.", "La déplacer sans nécessité peut aggraver une blessure.")] },
  { q: "La personne ne répond pas. Quelle est votre priorité ?", topic: "inconscient", o: [
    ok("Alerter les secours et vérifier sa respiration.", "Sans réponse, les secours doivent être prévenus et la respiration vérifiée (10 secondes maximum)."),
    no("Lui donner à boire.", "Risque de fausse route."),
    no("Attendre qu'elle se réveille.", "Sans aide, son état peut s'aggraver.")] },
  { q: "Elle ne répond pas et ne respire que par « halètements » irréguliers. Que faites-vous ?", topic: "arret-cardiaque", o: [
    ok("Je considère que c'est un arrêt cardiaque : j'alerte et je commence les compressions.", "Une respiration anormale est traitée comme une absence de respiration."),
    no("Je la mets sur le côté : elle respire.", "Une respiration irrégulière n'est pas une respiration normale."),
    no("J'attends de voir si cela s'améliore.", "Chaque minute compte.")] },
  { q: "Une personne tousse fort après avoir avalé de travers. Que faites-vous ?", topic: "etouffement", o: [
    ok("Je l'encourage à tousser et je reste à côté d'elle.", "Une toux efficace peut suffire à dégager l'objet."),
    nu("Je lui tape dans le dos immédiatement.", "Cela peut déplacer l'objet et bloquer complètement l'air."),
    no("Je fais une compression abdominale tout de suite.", "Réservée aux obstructions sévères.")] },
  { q: "Une plaie saigne beaucoup. Quel est le premier geste ?", topic: "hemorragie", o: [
    ok("Comprimer directement sur la plaie avec un tissu propre.", "C'est le geste principal face à un saignement abondant."),
    nu("Poser un garrot.", "Réservé aux personnes formées, si la pression ne suffit pas."),
    no("Rincer sous l'eau longuement.", "Il faut d'abord arrêter le saignement.")] },
  { q: "Quelqu'un s'est brûlé la main avec de l'eau chaude. Que faites-vous ?", topic: "brulures", o: [
    ok("Refroidir à l'eau courante fraîche, au moins 10 minutes.", "Le refroidissement limite l'aggravation de la brûlure."),
    no("Mettre du beurre.", "Cela retient la chaleur et complique l'évaluation."),
    no("Mettre de la glace.", "Le froid extrême peut aggraver la lésion.")] },
  { q: "Un câble électrique est tombé et une personne est allongée à côté. Que faites-vous ?", topic: "electrocution", o: [
    ok("Je ne touche pas la personne, je reste à distance et j'alerte.", "Le courant peut se propager : ne vous mettez pas en danger."),
    no("Je la tire par les bras.", "Vous seriez électrisé à votre tour."),
    no("Je pousse le câble avec un balai métallique.", "Un objet métallique conduit le courant.")] },
  { q: "Un ami est en difficulté dans l'eau et vous nagez mal. Que faites-vous ?", topic: "noyade", o: [
    ok("Je reste au bord, j'alerte et je lui tends une perche ou une bouée.", "Vous l'aidez sans vous mettre en danger."),
    no("Je plonge tout de suite.", "Une personne paniquée peut vous entraîner."),
    no("J'attends de voir s'il s'en sort.", "Une noyade évolue vite.")] },
  { q: "Après une piqûre, le visage d'une personne gonfle et elle respire mal. Que faites-vous ?", topic: "allergie", o: [
    ok("J'appelle les secours immédiatement et je l'aide à utiliser son auto-injecteur s'il est prescrit.", "Réaction sévère : agir vite."),
    no("J'attends 30 minutes.", "Les signes graves peuvent s'aggraver rapidement."),
    nu("Je lui donne un antihistaminique et je surveille.", "Il n'agit pas assez vite sur la respiration.")] },
  { q: "Vous n'êtes pas sûr de ce que vous voyez ni de ce qu'il faut faire. Que faites-vous ?", topic: "inconscient", o: [
    ok("Je demande de l'aide : j'appelle les secours qui me guident.", "En cas de doute, on demande de l'aide plutôt que de rester passif."),
    no("Je ne fais rien pour ne pas aggraver.", "Ne rien faire peut aussi aggraver la situation.")] }
];

SECOURS.myths = [
  { s: "Il faut faire boire une personne qui fait un malaise.", a: "myth", w: "Risque de fausse route, surtout si elle est confuse ou somnolente.", topic: "malaise" },
  { s: "Sur une brûlure, on met du beurre ou du dentifrice.", a: "myth", w: "Ces produits retiennent la chaleur. On refroidit à l'eau courante fraîche.", topic: "brulures" },
  { s: "Une personne qui tousse fort en s'étouffant doit être encouragée à tousser.", a: "good", w: "Une toux efficace peut dégager l'objet. On surveille et on reste près d'elle.", topic: "etouffement" },
  { s: "En cas de saignement de nez, il faut renverser la tête en arrière.", a: "myth", w: "Le sang coule dans la gorge. On penche la tête en avant et on pince le nez.", topic: "nez" },
  { s: "Face à un saignement abondant, on comprime directement la plaie.", a: "good", w: "C'est le geste principal recommandé.", topic: "hemorragie" },
  { s: "On peut faire vomir une personne qui a avalé un produit dangereux.", a: "myth", w: "Le produit peut abîmer à nouveau et passer dans les poumons. Appelez les secours ou le centre antipoison.", topic: "intoxication" },
  { s: "Il faut retirer un objet planté pour arrêter le saignement.", a: "myth", w: "Il peut boucher le vaisseau. On comprime autour.", topic: "hemorragie" },
  { s: "Mieux vaut commencer des compressions même sans formation que ne rien faire.", a: "good", w: "Les recommandations encouragent à agir, avec l'aide des secours au téléphone.", topic: "arret-cardiaque" },
  { s: "Il ne faut pas toucher une personne encore en contact avec le courant.", a: "good", w: "On coupe le courant d'abord, sans se mettre en danger.", topic: "electrocution" }
];

SECOURS.kit = [
  { id: "gants", name: "Gants à usage unique", icon: '<path d="M8 21v-8l-2-3 2-1 1 2V5h2v6V4h2v7V5h2v7l1-3 2 1-2 8z"/>', fn: "Protéger le secouriste et la victime lors d'un contact avec du sang ou des liquides.", limits: "Ne remplacent pas le lavage des mains.", cautions: "Choisir sans latex en cas d'allergie ; en changer après chaque personne." },
  { id: "compresses", name: "Compresses stériles", icon: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>', fn: "Couvrir une plaie ou comprimer un saignement.", limits: "Ne remplacent pas une prise en charge médicale d'une plaie grave.", cautions: "Emballage intact, date vérifiée ; ne pas toucher la partie qui va sur la plaie." },
  { id: "bandes", name: "Bandes", icon: '<circle cx="9" cy="12" r="6"/><circle cx="9" cy="12" r="2"/><path d="M15 12h6M15 8h6"/>', fn: "Maintenir un pansement ou une compresse.", limits: "Ne remplacent pas l'immobilisation d'un os cassé.", cautions: "Ne pas serrer : vérifier la couleur, la chaleur et la sensibilité des doigts ou orteils." },
  { id: "pansements", name: "Pansements adhésifs", icon: '<rect x="2" y="8" width="20" height="8" rx="4" transform="rotate(-30 12 12)"/><rect x="9" y="9" width="6" height="6" transform="rotate(-30 12 12)"/>', fn: "Protéger les petites plaies.", limits: "Pas pour une plaie profonde ou qui saigne beaucoup.", cautions: "Peau propre et sèche ; changer si mouillé ; attention aux allergies à l'adhésif." },
  { id: "ciseaux", name: "Ciseaux à bouts ronds", icon: '<circle cx="6" cy="17" r="3"/><circle cx="18" cy="17" r="3"/><path d="M8 15 18 3M16 15 6 3"/>', fn: "Couper bandes, sparadrap ou vêtements.", limits: "Ne pas s'en servir pour dégager un vêtement collé à la peau ou un objet planté.", cautions: "Nettoyer après usage ; hors de portée des enfants." },
  { id: "pince", name: "Pince à épiler", icon: '<path d="M12 3 9 21M12 3l3 18M10 14h4"/>', fn: "Retirer une petite écharde superficielle.", limits: "Pas pour un corps étranger dans l'œil ou une plaie profonde.", cautions: "Nettoyer avant et après ; avis médical si difficile ou infection." },
  { id: "couverture", name: "Couverture isotherme", icon: '<rect x="3" y="6" width="18" height="12" rx="1"/><path d="M7 9l3 3-3 3M13 9l3 3-3 3"/>', fn: "Limiter la perte de chaleur d'une personne.", limits: "Ne réchauffe pas par elle-même.", cautions: "Suivre la notice pour le sens ; ne pas couvrir le visage." },
  { id: "echarpe", name: "Écharpe triangulaire", icon: '<path d="M3 5h18L12 20z"/>', fn: "Soutenir un bras ou une épaule.", limits: "Ne constitue pas une immobilisation complète.", cautions: "Ne pas serrer ; vérifier la circulation." },
  { id: "serum", name: "Sérum physiologique ou eau propre", icon: '<rect x="8" y="3" width="8" height="4"/><path d="M7 7h10v14H7z M10 12h4"/>', fn: "Rincer une plaie ou un œil.", limits: "Ne remplace pas un avis médical, notamment après une projection chimique.", cautions: "Usage unique ; vérifier la date." },
  { id: "masque", name: "Masque de poche à valve", icon: '<path d="M4 12a8 6 0 0 1 16 0 8 6 0 0 1-16 0z M12 6v12"/>', fn: "Barrière de protection pour les insufflations.", limits: "Usage réservé aux personnes formées.", cautions: "À apprendre en formation pratique." },
  { id: "lampe", name: "Lampe de poche", icon: '<path d="M9 3h6l1 6H8zM10 9v10h4V9"/>', fn: "Voir dans l'obscurité.", limits: "—", cautions: "Vérifier les piles régulièrement." },
  { id: "numeros", name: "Liste des numéros utiles", icon: '<rect x="6" y="3" width="12" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/>', fn: "Numéros d'urgence de votre pays, centre antipoison, personnes à prévenir.", limits: "À tenir à jour.", cautions: "Écrire lisiblement et ranger dans la trousse." }
];

/* « Les premières secondes » — le seul délai issu d'une recommandation est le
   maximum de 10 secondes pour vérifier la respiration. Les autres repères illustrent l'enchaînement
   des étapes ; ce ne sont pas des délais garantis. */
SECOURS.timeline = [
  { t: "00:00", title: "Une personne s'effondre", text: "Elle ne répond pas quand vous lui parlez ou la secouez doucement.", kind: "illu" },
  { t: "00:05", title: "Sécurité et appel à l'aide", text: "Vous vérifiez le danger et vous criez pour attirer de l'aide.", kind: "illu" },
  { t: "00:10", title: "Respiration", text: "Vous regardez, écoutez, sentez. Pas plus de 10 secondes.", kind: "reco" },
  { t: "00:20", title: "Alerte", text: "Quelqu'un appelle les secours (haut-parleur) et cherche un défibrillateur.", kind: "illu" },
  { t: "00:30", title: "Compressions", text: "Elles commencent dès que possible : environ 100 à 120 par minute, 5 à 6 cm.", kind: "reco" },
  { t: "…", title: "Puis", text: "Vous continuez sans interruption inutile jusqu'à l'arrivée des secours. Relayez-vous si possible.", kind: "reco" }
];
})();
