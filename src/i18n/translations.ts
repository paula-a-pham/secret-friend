export type TranslationKey = keyof typeof translations.en

export const translations: Record<string, Record<string, string>> = {
  en: {
    // Common
    secretFriend: 'Secret Friend',
    back: 'Back',
    backArrow: '\u2190',
    cancel: 'Cancel',
    add: 'Add',
    enterName: 'Enter a name...',
    nameAlreadyExists: 'Name already exists',

    // Home
    tagline: 'Draw names, exchange gifts, have fun!',
    startNewGame: 'Start New Game',
    continueGame: 'Continue Game',
    resetEverything: 'Reset Everything',
    confirmDeleteMessage: 'This will delete your saved game. Are you sure?',
    reset: 'Reset',
    gameOptions: 'Game options',
    confirmReset: 'Confirm reset',
    giftBoxAlt: 'Gift box',

    // Setup - PIN
    pinSet: 'PIN Set!',
    setOrganizerPin: 'Set Organizer PIN',
    pinDescription: "You'll need this to view all pairs at the end",
    goBackHome: 'Go back to home',

    // Setup - Players
    nameAlreadyAdded: 'Name already added',
    needAtLeast3: 'Need at least 3 participants',
    addParticipants: 'Add Participants',
    participantName: 'Participant name',
    goBackToPin: 'Go back to PIN setup',
    participantCount_one: '1 participant added',
    participantCount_other: '{count} participants added',
    needMinimum: '(need at least 3)',
    startDrawing: 'Start Drawing!',
    removeName: 'Remove {name}',

    // Draw
    drawNames: 'Draw Names',
    drawProgress: '{drawn} of {total} have drawn',
    tapToDraw: 'Tap to draw',
    addNewPlayer: 'Add new player...',
    newPlayerName: 'New player name',
    drawingProgress: 'Drawing progress',
    allDoneViewResults: 'All Done \u2014 View Results',
    drawing: 'Drawing...',
    yourSecretFriendIs: 'Your secret friend is',
    drawAgain: 'Draw Again',
    accept: 'Accept',
    handDeviceTo: 'Hand the device to',
    lookAway: 'Everyone else, please look away!',
    imPersonDraw: "I'm {name} \u2014 Draw!",
    alreadyDrawn: '{name} has already drawn',
    tapToDrawAria: '{name} \u2014 tap to draw',

    // Results
    wrongPin: 'Wrong PIN',
    unlocked: 'Unlocked!',
    viewResults: 'View Results',
    enterPinToSee: 'Enter the organizer PIN to see all pairs',
    allPairs: 'All Pairs',
    tapCardToReveal: 'Tap a card to reveal the secret friend',
    tapToReveal: 'Tap to reveal',
    secretFriendLabel: 'Secret friend',
    addNewPlayersBtn: '+ Add New Players',
    home: 'Home',
    givesTo: '{giver} gives to {recipient}',
    revealPerson: "Reveal {name}'s secret friend",

    // How to Play
    howToPlay: 'How to Play',
    whatIsIt: 'What is it?',
    whatIsItDesc: 'Secret Friend is a gift exchange game where each participant is randomly assigned another person to give a gift to \u2014 without them knowing who picked their name!',
    howItWorks: 'How it works',
    howItWorks1: 'A group of friends, family, or coworkers join the game.',
    howItWorks2: 'Set a PIN so only players can see their draw.',
    howItWorks3: 'Each person draws a name in secret \u2014 the app makes sure no one draws themselves.',
    howItWorks4: 'Buy or make a gift for the person you drew.',
    howItWorks5: 'On the exchange day, give your gift and try to guess who your secret friend is!',
    rules: 'Rules',
    rules1: "Keep it a secret! Don't tell anyone who you drew.",
    rules2: 'Choose a gift with care \u2014 think about what would make them smile.',
    tips: 'Tips',
    tips1: 'Use the Results screen to check your assignment later if you forget.',
    gotIt: 'Got it!',

    // Add Players Form
    addNewPlayersTitle: 'Add New Players',
    newPlayersDesc: 'New players will join the draw and pick their secret friend.',
    addAtLeast2: 'Add at least 2 players',
    newPlayerCount_one: '1 new player',
    newPlayerCount_other: '{count} new players',
    addAndDraw: 'Add & Draw',

    // FAB
    menu: 'Menu',
    close: 'Close',
    muteSound: 'Mute sounds',
    unmuteSound: 'Unmute sounds',

    // PIN Input
    pinDigit: 'PIN digit {n}',
  },

  ar: {
    // Common
    secretFriend: '\u0627\u0644\u0635\u062f\u064a\u0642 \u0627\u0644\u0633\u0631\u064a',
    back: '\u0631\u062c\u0648\u0639',
    backArrow: '\u2192',
    cancel: '\u0625\u0644\u063a\u0627\u0621',
    add: '\u0625\u0636\u0627\u0641\u0629',
    enterName: '\u0623\u062f\u062e\u0644 \u0627\u0633\u0645\u0627\u064b...',
    nameAlreadyExists: '\u0627\u0644\u0627\u0633\u0645 \u0645\u0648\u062c\u0648\u062f \u0645\u0633\u0628\u0642\u0627\u064b',

    // Home
    tagline: '\u0627\u0633\u062d\u0628 \u0627\u0644\u0623\u0633\u0645\u0627\u0621\u060c \u062a\u0628\u0627\u062f\u0644 \u0627\u0644\u0647\u062f\u0627\u064a\u0627\u060c \u0648\u0627\u0633\u062a\u0645\u062a\u0639!',
    startNewGame: '\u0628\u062f\u0621 \u0644\u0639\u0628\u0629 \u062c\u062f\u064a\u062f\u0629',
    continueGame: '\u0645\u062a\u0627\u0628\u0639\u0629 \u0627\u0644\u0644\u0639\u0628\u0629',
    resetEverything: '\u0625\u0639\u0627\u062f\u0629 \u062a\u0639\u064a\u064a\u0646 \u0627\u0644\u0643\u0644',
    confirmDeleteMessage: '\u0633\u064a\u062a\u0645 \u062d\u0630\u0641 \u0627\u0644\u0644\u0639\u0628\u0629 \u0627\u0644\u0645\u062d\u0641\u0648\u0638\u0629. \u0647\u0644 \u0623\u0646\u062a \u0645\u062a\u0623\u0643\u062f\u061f',
    reset: '\u0625\u0639\u0627\u062f\u0629 \u062a\u0639\u064a\u064a\u0646',
    gameOptions: '\u062e\u064a\u0627\u0631\u0627\u062a \u0627\u0644\u0644\u0639\u0628\u0629',
    confirmReset: '\u062a\u0623\u0643\u064a\u062f \u0625\u0639\u0627\u062f\u0629 \u0627\u0644\u062a\u0639\u064a\u064a\u0646',
    giftBoxAlt: '\u0635\u0646\u062f\u0648\u0642 \u0647\u062f\u064a\u0629',

    // Setup - PIN
    pinSet: '\u062a\u0645 \u062a\u0639\u064a\u064a\u0646 \u0627\u0644\u0631\u0645\u0632!',
    setOrganizerPin: '\u062a\u0639\u064a\u064a\u0646 \u0631\u0645\u0632 PIN \u0644\u0644\u0645\u0646\u0638\u0645',
    pinDescription: '\u0633\u062a\u062d\u062a\u0627\u062c \u0647\u0630\u0627 \u0627\u0644\u0631\u0645\u0632 \u0644\u0639\u0631\u0636 \u062c\u0645\u064a\u0639 \u0627\u0644\u0623\u0632\u0648\u0627\u062c \u0641\u064a \u0627\u0644\u0646\u0647\u0627\u064a\u0629',
    goBackHome: '\u0627\u0644\u0639\u0648\u062f\u0629 \u0644\u0644\u0631\u0626\u064a\u0633\u064a\u0629',

    // Setup - Players
    nameAlreadyAdded: '\u0627\u0644\u0627\u0633\u0645 \u0645\u0636\u0627\u0641 \u0645\u0633\u0628\u0642\u0627\u064b',
    needAtLeast3: '\u064a\u062c\u0628 \u0625\u0636\u0627\u0641\u0629 3 \u0645\u0634\u0627\u0631\u0643\u064a\u0646 \u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0644',
    addParticipants: '\u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0645\u0634\u0627\u0631\u0643\u064a\u0646',
    participantName: '\u0627\u0633\u0645 \u0627\u0644\u0645\u0634\u0627\u0631\u0643',
    goBackToPin: '\u0627\u0644\u0639\u0648\u062f\u0629 \u0644\u0625\u0639\u062f\u0627\u062f \u0627\u0644\u0631\u0645\u0632',
    participantCount_one: '\u062a\u0645\u062a \u0625\u0636\u0627\u0641\u0629 \u0645\u0634\u0627\u0631\u0643 \u0648\u0627\u062d\u062f',
    participantCount_other: '\u062a\u0645\u062a \u0625\u0636\u0627\u0641\u0629 {count} \u0645\u0634\u0627\u0631\u0643\u064a\u0646',
    needMinimum: '(\u064a\u062c\u0628 3 \u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0644)',
    startDrawing: '\u0627\u0628\u062f\u0623 \u0627\u0644\u0633\u062d\u0628!',
    removeName: '\u0625\u0632\u0627\u0644\u0629 {name}',

    // Draw
    drawNames: '\u0633\u062d\u0628 \u0627\u0644\u0623\u0633\u0645\u0627\u0621',
    drawProgress: '\u0633\u062d\u0628 {drawn} \u0645\u0646 {total}',
    tapToDraw: '\u0627\u0646\u0642\u0631 \u0644\u0644\u0633\u062d\u0628',
    addNewPlayer: '\u0625\u0636\u0627\u0641\u0629 \u0644\u0627\u0639\u0628 \u062c\u062f\u064a\u062f...',
    newPlayerName: '\u0627\u0633\u0645 \u0627\u0644\u0644\u0627\u0639\u0628 \u0627\u0644\u062c\u062f\u064a\u062f',
    drawingProgress: '\u062a\u0642\u062f\u0645 \u0627\u0644\u0633\u062d\u0628',
    allDoneViewResults: '\u0627\u0646\u062a\u0647\u0649 \u2014 \u0639\u0631\u0636 \u0627\u0644\u0646\u062a\u0627\u0626\u062c',
    drawing: '\u062c\u0627\u0631\u064a \u0627\u0644\u0633\u062d\u0628...',
    yourSecretFriendIs: '\u0635\u062f\u064a\u0642\u0643 \u0627\u0644\u0633\u0631\u064a \u0647\u0648',
    drawAgain: '\u0633\u062d\u0628 \u0645\u0631\u0629 \u0623\u062e\u0631\u0649',
    accept: '\u0642\u0628\u0648\u0644',
    handDeviceTo: '\u0633\u0644\u0651\u0645 \u0627\u0644\u062c\u0647\u0627\u0632 \u0625\u0644\u0649',
    lookAway: '\u0627\u0644\u0622\u062e\u0631\u0648\u0646\u060c \u064a\u0631\u062c\u0649 \u0639\u062f\u0645 \u0627\u0644\u0646\u0638\u0631!',
    imPersonDraw: '\u0623\u0646\u0627 {name} \u2014 \u0627\u0633\u062d\u0628!',
    alreadyDrawn: '{name} \u0633\u062d\u0628 \u0628\u0627\u0644\u0641\u0639\u0644',
    tapToDrawAria: '{name} \u2014 \u0627\u0646\u0642\u0631 \u0644\u0644\u0633\u062d\u0628',

    // Results
    wrongPin: '\u0631\u0645\u0632 PIN \u062e\u0627\u0637\u0626',
    unlocked: '\u062a\u0645 \u0627\u0644\u0641\u062a\u062d!',
    viewResults: '\u0639\u0631\u0636 \u0627\u0644\u0646\u062a\u0627\u0626\u062c',
    enterPinToSee: '\u0623\u062f\u062e\u0644 \u0631\u0645\u0632 PIN \u0644\u0644\u0645\u0646\u0638\u0645 \u0644\u0639\u0631\u0636 \u062c\u0645\u064a\u0639 \u0627\u0644\u0623\u0632\u0648\u0627\u062c',
    allPairs: '\u062c\u0645\u064a\u0639 \u0627\u0644\u0623\u0632\u0648\u0627\u062c',
    tapCardToReveal: '\u0627\u0646\u0642\u0631 \u0639\u0644\u0649 \u0628\u0637\u0627\u0642\u0629 \u0644\u0643\u0634\u0641 \u0627\u0644\u0635\u062f\u064a\u0642 \u0627\u0644\u0633\u0631\u064a',
    tapToReveal: '\u0627\u0646\u0642\u0631 \u0644\u0644\u0643\u0634\u0641',
    secretFriendLabel: '\u0627\u0644\u0635\u062f\u064a\u0642 \u0627\u0644\u0633\u0631\u064a',
    addNewPlayersBtn: '+ \u0625\u0636\u0627\u0641\u0629 \u0644\u0627\u0639\u0628\u064a\u0646 \u062c\u062f\u062f',
    home: '\u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629',
    givesTo: '{giver} \u064a\u0647\u062f\u064a {recipient}',
    revealPerson: '\u0643\u0634\u0641 \u0635\u062f\u064a\u0642 {name} \u0627\u0644\u0633\u0631\u064a',

    // How to Play
    howToPlay: '\u0637\u0631\u064a\u0642\u0629 \u0627\u0644\u0644\u0639\u0628',
    whatIsIt: '\u0645\u0627 \u0647\u064a\u061f',
    whatIsItDesc: '\u0627\u0644\u0635\u062f\u064a\u0642 \u0627\u0644\u0633\u0631\u064a \u0647\u064a \u0644\u0639\u0628\u0629 \u062a\u0628\u0627\u062f\u0644 \u0647\u062f\u0627\u064a\u0627 \u062d\u064a\u062b \u064a\u062a\u0645 \u062a\u0639\u064a\u064a\u0646 \u0634\u062e\u0635 \u0639\u0634\u0648\u0627\u0626\u064a \u0644\u0643\u0644 \u0645\u0634\u0627\u0631\u0643 \u0644\u064a\u0642\u062f\u0645 \u0644\u0647 \u0647\u062f\u064a\u0629 \u2014 \u062f\u0648\u0646 \u0623\u0646 \u064a\u0639\u0631\u0641 \u0645\u0646 \u0627\u062e\u062a\u0627\u0631 \u0627\u0633\u0645\u0647!',
    howItWorks: '\u0643\u064a\u0641 \u062a\u0639\u0645\u0644',
    howItWorks1: '\u0645\u062c\u0645\u0648\u0639\u0629 \u0645\u0646 \u0627\u0644\u0623\u0635\u062f\u0642\u0627\u0621 \u0623\u0648 \u0627\u0644\u0639\u0627\u0626\u0644\u0629 \u0623\u0648 \u0627\u0644\u0632\u0645\u0644\u0627\u0621 \u064a\u0646\u0636\u0645\u0648\u0646 \u0644\u0644\u0639\u0628\u0629.',
    howItWorks2: '\u0642\u0645 \u0628\u062a\u0639\u064a\u064a\u0646 \u0631\u0645\u0632 PIN \u062d\u062a\u0649 \u064a\u062a\u0645\u0643\u0646 \u0627\u0644\u0644\u0627\u0639\u0628\u0648\u0646 \u0641\u0642\u0637 \u0645\u0646 \u0631\u0624\u064a\u0629 \u0633\u062d\u0628\u0647\u0645.',
    howItWorks3: '\u0643\u0644 \u0634\u062e\u0635 \u064a\u0633\u062d\u0628 \u0627\u0633\u0645\u0627\u064b \u0628\u0633\u0631\u064a\u0629 \u2014 \u0627\u0644\u062a\u0637\u0628\u064a\u0642 \u064a\u062a\u0623\u0643\u062f \u0623\u0646 \u0644\u0627 \u0623\u062d\u062f \u064a\u0633\u062d\u0628 \u0627\u0633\u0645\u0647.',
    howItWorks4: '\u0627\u0634\u062a\u0631\u0650 \u0623\u0648 \u0627\u0635\u0646\u0639 \u0647\u062f\u064a\u0629 \u0644\u0644\u0634\u062e\u0635 \u0627\u0644\u0630\u064a \u0633\u062d\u0628\u062a \u0627\u0633\u0645\u0647.',
    howItWorks5: '\u0641\u064a \u064a\u0648\u0645 \u0627\u0644\u062a\u0628\u0627\u062f\u0644\u060c \u0642\u062f\u0645 \u0647\u062f\u064a\u062a\u0643 \u0648\u062d\u0627\u0648\u0644 \u062a\u062e\u0645\u064a\u0646 \u0645\u0646 \u0647\u0648 \u0635\u062f\u064a\u0642\u0643 \u0627\u0644\u0633\u0631\u064a!',
    rules: '\u0627\u0644\u0642\u0648\u0627\u0639\u062f',
    rules1: '\u062d\u0627\u0641\u0638 \u0639\u0644\u0649 \u0627\u0644\u0633\u0631\u064a\u0629! \u0644\u0627 \u062a\u062e\u0628\u0631 \u0623\u062d\u062f\u0627\u064b \u0645\u0646 \u0633\u062d\u0628\u062a \u0627\u0633\u0645\u0647.',
    rules2: '\u0627\u062e\u062a\u0631 \u0647\u062f\u064a\u0629 \u0628\u0639\u0646\u0627\u064a\u0629 \u2014 \u0641\u0643\u0631 \u0641\u064a\u0645\u0627 \u0633\u064a\u0631\u0633\u0645 \u0627\u0644\u0628\u0633\u0645\u0629 \u0639\u0644\u0649 \u0648\u062c\u0647\u0647.',
    tips: '\u0646\u0635\u0627\u0626\u062d',
    tips1: '\u0627\u0633\u062a\u062e\u062f\u0645 \u0634\u0627\u0634\u0629 \u0627\u0644\u0646\u062a\u0627\u0626\u062c \u0644\u0644\u062a\u062d\u0642\u0642 \u0645\u0646 \u0627\u0633\u0645\u0643 \u0644\u0627\u062d\u0642\u0627\u064b \u0625\u0630\u0627 \u0646\u0633\u064a\u062a.',
    gotIt: '\u0641\u0647\u0645\u062a!',

    // Add Players Form
    addNewPlayersTitle: '\u0625\u0636\u0627\u0641\u0629 \u0644\u0627\u0639\u0628\u064a\u0646 \u062c\u062f\u062f',
    newPlayersDesc: '\u0627\u0644\u0644\u0627\u0639\u0628\u0648\u0646 \u0627\u0644\u062c\u062f\u062f \u0633\u064a\u0646\u0636\u0645\u0648\u0646 \u0644\u0644\u0633\u062d\u0628 \u0648\u064a\u062e\u062a\u0627\u0631\u0648\u0646 \u0635\u062f\u064a\u0642\u0647\u0645 \u0627\u0644\u0633\u0631\u064a.',
    addAtLeast2: '\u0623\u0636\u0641 \u0644\u0627\u0639\u0628\u064a\u0646 \u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0644',
    newPlayerCount_one: '\u0644\u0627\u0639\u0628 \u062c\u062f\u064a\u062f \u0648\u0627\u062d\u062f',
    newPlayerCount_other: '{count} \u0644\u0627\u0639\u0628\u064a\u0646 \u062c\u062f\u062f',
    addAndDraw: '\u0625\u0636\u0627\u0641\u0629 \u0648\u0633\u062d\u0628',

    // FAB
    menu: '\u0627\u0644\u0642\u0627\u0626\u0645\u0629',
    close: '\u0625\u063a\u0644\u0627\u0642',
    muteSound: '\u0643\u062a\u0645 \u0627\u0644\u0635\u0648\u062a',
    unmuteSound: '\u062a\u0634\u063a\u064a\u0644 \u0627\u0644\u0635\u0648\u062a',

    // PIN Input
    pinDigit: '\u0631\u0642\u0645 PIN {n}',
  },
}
