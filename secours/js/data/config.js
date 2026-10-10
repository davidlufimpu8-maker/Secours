/* SECOURS — configuration éditoriale
   Tout ce qui dépend du pays, de l'hébergeur ou de la relecture médicale se règle ICI. */
window.SECOURS = window.SECOURS || {};

SECOURS.config = {
  tagline: "Les bons gestes. Au bon moment.",

  // null = le visiteur choisit son pays. Mettre 'fr', 'be'… pour figer le pays ciblé.
  defaultCountry: null,

  // À renseigner APRÈS relecture par un formateur / professionnel de santé.
  // Tant que date = null, le site affiche « version de démonstration ».
  contentReview: { date: null, reviewer: null },

  // Mentions à compléter avant mise en ligne
  contact: "[À COMPLÉTER : moyen de contact du responsable du site]",
  jurisdiction: "[À COMPLÉTER : pays / juridiction d'exploitation]",
  host: "[À COMPLÉTER : hébergeur du site]"
};

/* Numéros d'urgence par pays.
   RÈGLE : ne jamais supposer un numéro. Un pays absent de cette liste tombe sur
   « Autre pays ». Chaque entrée doit être vérifiée auprès des autorités locales
   avant publication (champ verified). `call:false` = numéro affiché sans lien d'appel. */
SECOURS.countries = [
  { id: "fr", name: "France", primary: "15", verified: null, numbers: [
    { n: "15",  l: "SAMU — urgence médicale", call: true },
    { n: "18",  l: "Sapeurs-pompiers", call: true },
    { n: "112", l: "Numéro d'urgence européen", call: true },
    { n: "114", l: "Urgence par SMS (personnes sourdes ou malentendantes)", call: false }
  ]},
  { id: "be", name: "Belgique", primary: "112", verified: null, numbers: [
    { n: "112", l: "Urgences (ambulance, pompiers)", call: true },
    { n: "101", l: "Police", call: true }
  ]},
  { id: "ch", name: "Suisse", primary: "144", verified: null, numbers: [
    { n: "144", l: "Ambulance", call: true },
    { n: "118", l: "Pompiers", call: true },
    { n: "117", l: "Police", call: true },
    { n: "112", l: "Numéro d'urgence européen", call: true }
  ]},
  { id: "lu", name: "Luxembourg", primary: "112", verified: null, numbers: [
    { n: "112", l: "Urgences (ambulance, pompiers)", call: true }
  ]},
  { id: "ca", name: "Canada", primary: "911", verified: null, numbers: [
    { n: "911", l: "Urgences", call: true }
  ]}
];
