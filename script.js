// Gestion de la génération de mot de passe.

// On récupère les éléments du DOM

// Paramètres du mot de passe
// Longueur du mot de passe
const passwordLength = document.getElementById('password-length'); // Longueur du mot de passe (input range)
const passwordLengthValue = document.getElementById('password-length-value'); // Valeur de la longueur du mot de passe (number)

// Mode de génération
const easyToSpell = document.getElementById('easy-to-spell'); // Mode de génération (radio)
const easyToRead = document.getElementById('easy-to-read'); // Mode de génération (radio)
const allCharacters = document.getElementById('all-characters'); // Mode de génération (radio)
const generationModeArray = [easyToSpell, easyToRead, allCharacters]; // Tableau des modes de génération

// Caractères à utiliser
const lowercase = document.getElementById('lowercase'); // Caractères à utiliser (checkbox)
const uppercase = document.getElementById('uppercase'); // Caractères à utiliser (checkbox)
const numbers = document.getElementById('numbers'); // Caractères à utiliser (checkbox)
const symbols = document.getElementById('symbols'); // Caractères à utiliser (checkbox)
const charactersArray = [lowercase, uppercase, numbers, symbols]; // Tableau des caractères à utiliser

// Affichage du mot de passe
const password = document.getElementById('password-container'); // Mot de passe (input text)
const strengthBarFill = document.getElementsByClassName('password-strength-bar-fill')[0]; // Barre de force du mot de passe (div)

// Boutons d'action
const copyButton = document.getElementsByClassName('fa-clone')[0]; // Bouton de copie du mot de passe (icon)
const regenerateButton = document.getElementsByClassName('fa-sync')[0]; // Bouton de regénération du mot de passe (icon)

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Synchronisation des éléments du DOM

// Synchronisation de la longueur du mot de passe pour que :
// - La valeur de l'input range soit égale à la valeur de l'input number
// - La valeur de l'input number soit égale à la valeur de l'input range
// - La modification du champs de texte modifie la valeur des deux inputs
passwordLengthValue.addEventListener('input', () => {
    passwordLength.value = passwordLengthValue.value;
});

passwordLength.addEventListener('input', () => {
    passwordLengthValue.value = passwordLength.value;
});

password.addEventListener('input', () => {
    passwordLengthValue.value = password.value.length;
    passwordLength.value = password.value.length;
});

// Quand un radio est sélectionné, on décoche les autres radios
// Si le mode de génération est "Facile à lire" on désactive les caractères spéciaux et les chiffres et on les décoche
// Sinon on réactive les caractères spéciaux et les chiffres
generationModeArray.forEach((generationMode) => {
    generationMode.addEventListener('change', () => {
        generationModeArray.forEach((otherGenerationMode) => {
            if (otherGenerationMode !== generationMode) {
                otherGenerationMode.checked = false;
            }
        });

        if (easyToSpell.checked) {
            charactersArray.forEach((character) => {
                if (character !== lowercase && character !== uppercase) {
                    character.checked = false;
                    character.disabled = true;
                } else {
                    character.disabled = false;
                }
            });
        } else {
            charactersArray.forEach((character) => {
                character.disabled = false;
            });
        }
    });
});

// On fait un sorte qu'au moins un bouton radio soit sélectionné
// Si aucun bouton radio n'est sélectionné, on sélectionne le bouton radio "Facile à lire"
generationModeArray.forEach((generationMode) => {
    generationMode.addEventListener('change', () => {
        if (!easyToSpell.checked && !easyToRead.checked && !allCharacters.checked) {
            easyToRead.checked = true;
        }
    });
});

// On fait un sorte qu'au moins un bouton checkbox soit sélectionné
// Si aucun bouton checkbox n'est sélectionné, on sélectionne le bouton checkbox "Minuscules"
charactersArray.forEach((character) => {
    character.addEventListener('change', () => {
        if (!lowercase.checked && !uppercase.checked && !numbers.checked && !symbols.checked) {
            lowercase.checked = true;
        }
    });
});


// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// On défini les caractères à utiliser
const characters = {
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+~`|}{[]\:;?><,./-=',
    easy_lowercase: 'abcdefghjkmnpqrstuvwxyz',
    easy_uppercase: 'ABCDEFGHJKMNPQRSTUVWXYZ',
    easy_numbers: '23456789'
};

// On créé une fonction pour récupérer le jeu de caractères à utiliser
function getCharacters() {
    let charactersToUse = [];

    // On récupère les cases cochées
    // Si le mode de génération est "Facile à dire"
    if (easyToSpell.checked) {
        // On ajoute les caractères à utiliser
        if (lowercase.checked) charactersToUse.push(characters.easy_lowercase);
        if (uppercase.checked) charactersToUse.push(characters.easy_uppercase);
        if (numbers.checked) charactersToUse.push(characters.easy_numbers);
    } else {
        // On ajoute les caractères à utiliser
        if (lowercase.checked) charactersToUse.push(characters.lowercase);
        if (uppercase.checked) charactersToUse.push(characters.uppercase);
        if (numbers.checked) charactersToUse.push(characters.numbers);
        if (symbols.checked) charactersToUse.push(characters.symbols);
    }

    // On retourne le jeu de caractères à utiliser
    return charactersToUse;
}

// On créé une fonction pour générer un nombre aléatoire
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// On créé une fonction pour générer un mot de passe
function generatePassword() {
    // On récupère le jeu de caractères à utiliser
    const charactersToUse = getCharacters();

    // On récupère la longueur du mot de passe
    const passwordLengthValue = passwordLength.value;

    // On créé une variable pour stocker le mot de passe
    let generatedPassword = '';

    // On créé une boucle pour générer le mot de passe
    for (let i = 0; i < passwordLengthValue; i++) {
        // On récupère un jeu de caractères aléatoire
        const randomCharacters = charactersToUse[getRandomNumber(0, charactersToUse.length - 1)];

        // On récupère un caractère aléatoire
        const randomCharacter = randomCharacters[getRandomNumber(0, randomCharacters.length - 1)];

        // On ajoute le caractère au mot de passe
        generatedPassword += randomCharacter;
    }

    // On retourne le mot de passe
    return generatedPassword;
}

// On créé une fonction pour retourner la force du mot de passe (entre 0 et 100)
function getPasswordStrength(password) {
    // On créé une variable pour stocker la force du mot de passe
    let passwordStrength = 0;

    // On créé une variable pour stocker le nombre de caractères différents
    let differentCharacters = 0;

    // On créé une variable pour stocker le nombre de caractères différents
    let differentCharactersArray = [];

    // On créé une boucle pour vérifier chaque caractère du mot de passe
    for (let i = 0; i < password.length; i++) {
        // On récupère le caractère actuel
        const currentCharacter = password[i];

        // On vérifie si le caractère actuel est déjà présent dans le tableau des caractères différents
        if (!differentCharactersArray.includes(currentCharacter)) {
            // Si le caractère actuel n'est pas présent dans le tableau des caractères différents
            // On ajoute le caractère actuel au tableau des caractères différents
            differentCharactersArray.push(currentCharacter);

            // On incrémente le nombre de caractères différents
            differentCharacters++;
        }
    }

    // On ajoute la force du mot de passe en fonction du nombre de caractères différents
    passwordStrength += differentCharacters * 5;

    // On ajoute la force du mot de passe en fonction de la longueur du mot de passe
    passwordStrength += password.length;

    // On retourne la force du mot de passe
    return passwordStrength;
}

// On créé une fonction pour mettre à jour la barre de force du mot de passe
function updatePasswordStrengthBar(password) {
    // On récupère la force du mot de passe
    const passwordStrength = getPasswordStrength(password);

    // On définit la taille de la barre de force du mot de passe
    if (passwordStrength >= 100) {
        strengthBarFill.style.width = '100%';
    } else {
        strengthBarFill.style.width = `${passwordStrength}%`;
    }

    // On définit la transition de la barre de force du mot de passe
    strengthBarFill.style.transition = 'width 0.5s ease';

    // On définit la couleur de la barre de force du mot de passe
    if (passwordStrength <= 25) {
        strengthBarFill.style.backgroundColor = '#DF6661';
    } else if (passwordStrength <= 50) {
        strengthBarFill.style.backgroundColor = '#EFC20F';
    } else if (passwordStrength <= 75) {
        strengthBarFill.style.backgroundColor = '#00A878';
    } else if (passwordStrength < 100) {
        strengthBarFill.style.backgroundColor = '#006B4D';
    }
}

// On créé une fonction pour mettre à jour le texte d'affichage du mot de passe
function updatePasswordText(passwordText) {
    // On met à jour le texte d'affichage du mot de passe
    password.value = passwordText;
}

// On définit un tableau de couleurs pour la barre de force du mot de passe
const colorsArray = ['#FF8C8C', '#FFC569', '#FFFA83', '#A3FF89', '#8387FF'];

// Dés que la longueur de la barre de force du mot de passe change
strengthBarFill.addEventListener('transitionend', () => {
    // Si la longueur de la barre de force du mot de passe est égale à 100%
    if (strengthBarFill.style.width == '100%') {
        // On change la couleur de la barre de force du mot de passe toutes les 0.5 secondes
        let currentColor = 0;
        setInterval(() => {
            // On vérifie si la taille de la barre de force du mot de passe est toujours égale à 100%
            if (strengthBarFill.style.width != '100%') {
                // On désactive l'effet de glow à la barre de force du mot de passe
                strengthBarFill.style.boxShadow = 'none';
                // On arrête la fonction
                return;
            }
            // On récupère une couleur
            const color = colorsArray[currentColor];
            // On change la couleur de la barre de force du mot de passe
            strengthBarFill.style.backgroundColor = color;
            // On ajoute un effet de glow à la barre de force du mot de passe
            strengthBarFill.style.boxShadow = `0 0 10px ${color}, 0 0 40px ${color}, 0 0 80px ${color}`;
            // On incrémente la couleur actuelle
            currentColor++;
            // Si la couleur actuelle est supérieure à la longueur du tableau des couleurs
            if (currentColor > colorsArray.length - 1) currentColor = 0;
        }, 100);
    }
});

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// On gère la génération du mot de passe

// Quand on modifie n'imporque quel input
// On génère un mot de passe
// On met à jour la barre de force du mot de passe
// On met à jour le texte d'affichage du mot de passe

// On récupère tous les inputs
const inputs = document.querySelectorAll('input');

inputs.forEach((input) => {
    input.addEventListener('input', () => {
        // Si l'id de l'input est "password-container"
        if (input.id === 'password-container') {
            // On mets à jour la barre de force du mot de passe
            updatePasswordStrengthBar(password.value);
        } else {
            // On génère un mot de passe
            const generatedPassword = generatePassword();
            // On met à jour la barre de force du mot de passe
            updatePasswordStrengthBar(generatedPassword);

            // On met à jour le texte d'affichage du mot de passe
            updatePasswordText(generatedPassword);
        }
    });
});

// On coche des options de génération de mot de passe par défaut
// Boutons radio
easyToSpell.checked = true;
easyToRead.checked = false;
allCharacters.checked = false;

// Checkbox
lowercase.checked = true;
uppercase.checked = true;
numbers.checked = false;
symbols.checked = false;
numbers.disabled = true;
symbols.disabled = true;

// On génère un mot de passe
const generatedPassword = generatePassword();
// On met à jour la barre de force du mot de passe
updatePasswordStrengthBar(generatedPassword);
// On met à jour le texte d'affichage du mot de passe
updatePasswordText(generatedPassword);

// On gère les boutons d'action

// Quand le bouton de copie du mot de passe est cliqué
copyButton.addEventListener('click', () => {
    // On copie le mot de passe dans le presse-papier
    let passwordText = password.value;
    navigator.clipboard.writeText(passwordText);
    // On passe la couleur en vert
    copyButton.style.color = '#00A878';
    // On fait une animation de zoom et de dezoom
    copyButton.animate([
        { transform: 'scale(1)' },
        { transform: 'scale(1.2)' },
        { transform: 'scale(1)' }
    ], {
        duration: 500,
        iterations: 1
    }).onfinish = () => {
        // On passe la couleur en blanc
        copyButton.style.color = '#6F7F92';
    };
});

// Quand le bouton de régénération du mot de passe est cliqué
regenerateButton.addEventListener('click', () => {
    // On génère un mot de passe
    const generatedPassword = generatePassword();
    // On met à jour la barre de force du mot de passe
    updatePasswordStrengthBar(generatedPassword);
    // On met à jour le texte d'affichage du mot de passe
    updatePasswordText(generatedPassword);

    // On passe la couleur en bleu
    regenerateButton.style.color = '#3B70D4';

    // On fait une animation de rotation à 180°
    regenerateButton.animate([
        { transform: 'rotate(0deg)' },
        { transform: 'rotate(180deg)' },
        { transform: 'rotate(0deg)' }
    ], {
        duration: 800,
        iterations: 1
    }).onfinish = () => {
        // On passe la couleur en blanc
        regenerateButton.style.color = '#6F7F92';
    }
});