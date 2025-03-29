const DIFFICULTY_LEVELS = [
  {
    key: 'easy',
    label: 'Easy',
    icon: 'smile',
    maxSteps: 5,
    maxGainPoints: 10,
    maxLosingPoints: 2,
    hiringThreshold: 60,
  },
  {
    key: 'medium',
    label: 'Medium',
    icon: 'meh',
    maxSteps: 6,
    maxGainPoints: 7,
    maxLosingPoints: 5,
    hiringThreshold: 70,
  },
  {
    key: 'hard',
    label: 'Hard',
    icon: 'frown',
    maxSteps: 8,
    maxGainPoints: 5,
    maxLosingPoints: 7,
    hiringThreshold: 70,
  },
  {
    key: 'ultraHard',
    label: 'Ultra Hard',
    icon: 'skull-crossbones',
    maxSteps: 10,
    maxGainPoints: 3,
    maxLosingPoints: 9,
    hiringThreshold: 62,
  },
]

const LANGUAGES = [
  { key: 'english', flag: 'https://flagcdn.com/us.svg', label: 'English' },
  { key: 'spanish', flag: 'https://flagcdn.com/es.svg', label: 'Spanish' },
  { key: 'french', flag: 'https://flagcdn.com/fr.svg', label: 'French' },
  { key: 'german', flag: 'https://flagcdn.com/de.svg', label: 'German' },
  { key: 'italian', flag: 'https://flagcdn.com/it.svg', label: 'Italian' },
  { key: 'portuguese', flag: 'https://flagcdn.com/pt.svg', label: 'Portuguese' },
  { key: 'lithuanian', flag: 'https://flagcdn.com/lt.svg', label: 'Lithuanian' },
  { key: 'polish', flag: 'https://flagcdn.com/pl.svg', label: 'Polish' },
]


export { DIFFICULTY_LEVELS, LANGUAGES }