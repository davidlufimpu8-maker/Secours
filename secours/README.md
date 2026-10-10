# SECOURS — Les bons gestes. Au bon moment.

Expérience web interactive de sensibilisation aux premiers secours.
100 % frontend : HTML, CSS, JavaScript vanilla, SVG. Aucun backend, aucune base de données, aucun service tiers.

Ouvrir `index.html` dans un navigateur suffit (pas de serveur nécessaire).

## Structure

```
index.html
css/style.css
js/
  app.js            routeur, vues, simulateur, quiz, mode urgence
  figures.js        silhouettes SVG, effets, scènes animées
  audio.js          sons discrets et facultatifs (Web Audio)
  data/
    config.js       pays, numéros d'urgence, date de relecture, mentions légales
    topics.js       16 fiches (signes, étapes, à éviter, besoin d'aide, sources)
    scenarios.js    10 scénarios (observation, décisions, surveillance)
    extras.js       quiz, mythe ou bon réflexe, trousse, premières secondes
    sources.js      références médicales
```

## Avant toute mise en ligne (obligatoire)

1. **Relecture médicale** : faire relire toutes les fiches et tous les scénarios par un formateur aux premiers secours ou un professionnel de santé, selon le référentiel du pays ciblé. Le contenu livré est une base de démonstration.
2. **Date de vérification** : renseigner `contentReview.date` dans `js/data/config.js` (et `lastVerified` par fiche). Tant qu'elle est vide, le site l'indique honnêtement.
3. **Numéros d'urgence** : vérifier chaque pays dans `config.js` (`verified`). Un pays absent tombe sur « Autre pays ». Pour figer un pays : `defaultCountry: "fr"`.
4. **Sources** : confirmer édition, chapitre et lien exact de chaque référence dans `sources.js`.
5. **Mentions** : compléter contact, hébergeur et juridiction (`config.js`), puis faire relire la page Confidentialité selon la juridiction.
6. **Centre antipoison** : ajouter le numéro local dans la trousse et la fiche Intoxication.

## Mettre à jour le contenu

Chaque fiche est un objet : `title, intro, signs, steps, warnings, avoid, emergency, sources, lastVerified`.
Une étape : `["Titre", "Description", ["pose", "zone", "effet"], "id-fiche-liée"]`.
Poses : `stand, throat, lean, sit, lie, side`. Zones : `head, neck, shoulder, chest, back, abdomen, arm, hand, leg`.
Effets : `pulse, press, blows, thrust, drops, cover, ice, phone, breath, warn, bolt, tap, tilt, hold, snow, sun, none`.

## Confidentialité

Aucune donnée personnelle n'est collectée. Trois préférences (pays, son, mode allégé) sont gardées dans le stockage local du navigateur ; l'avertissement lu est gardé pour la session. Pas de cookie, pas de police ni de script externe.

## Accessibilité et performance

Navigation clavier, focus visible, dialogues natifs, libellés, `prefers-reduced-motion`, aucun sens porté par la couleur seule (✓ ~ ✕ ? + texte), boutons ≥ 44 px, mode sombre selon les préférences système. Mode allégé automatique (économie de données, peu de mémoire ou de cœurs) ou manuel depuis le pied de page.

## Ce qui a été ajouté au brief

- Numéros d'urgence par pays, configurables, jamais supposés.
- Polices système (aucune requête externe) pour respecter le « privacy by design ».
- Marquage clair « version de démonstration / relecture requise » et date de vérification vide plutôt qu'inventée.
- Timeline : distinction RECOMMANDATION / REPÈRE, car seuls certains délais sont sourcés.
- « Je ne sais pas » ajouté automatiquement à chaque décision.
- Mode allégé, `noscript` avec rappel d'appeler les secours, données chargées sans module ES (fonctionne en `file://`).

NLD — Web Design • Development • Digital Experiences
