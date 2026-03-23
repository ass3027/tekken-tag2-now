/**
 * Maps backend character names (from TTT2_CHARACTERS in data.py)
 * to their portrait filenames under /characters/*.webp
 */
const NAME_TO_FILE: Record<string, string> = {
  'Paul':         'Paul',
  'Law':          'Law',
  'Lei':          'Lei',
  'Yoshimitsu':   'Yoshimitsu',
  'Nina':         'Nina',
  'Hwoarang':     'Hwoarang',
  'Xiayu':        'Xiaoyu',       // spelling difference in backend
  'Christie':     'Christie',
  'Jin':          'Jin',
  'Julia':        'Jaycee',       // Julia Chang fights as Jaycee in TTT2
  'Kuma':         'Kuma',
  'Bryan':        'Bryan',
  'Heihachi':     'Heihachi',
  'Kazuya':       'Kazuya',
  'Lee':          'Lee',
  'Steve':        'Steve',
  'Roger Jr.':    'Roger_Jr',
  'Mokujin':      'Mokujin',
  'Jack':         'Jack-6',
  'Marduk':       'Marduk',
  'Anna':         'Anna',
  'Ganryu':       'Ganryu',
  'Asuka':        'Asuka',
  'Bruce':        'Bruce',
  'Baek':         'Baek',
  'Devil Jin':    'Devil_Jin',
  'Raven':        'Raven',
  'Armor King':   'Armor_King',
  'Lili':         'Lili',
  'Dragunov':     'Dragunov',
  'Eddy':         'Eddy',
  'Bob':          'Bob',
  'Zafina':       'Zafina',
  'Miguel':       'Miguel',
  'Leo':          'Leo',
  'Lars':         'Lars',
  'Alisa':        'Alisa',
  'Jinpachi':     'Jinpachi',
  'True Ogre':    'True_Ogre',
  'Jun':          'Jun',
  'Combot':       'Combot',
  'Unknown':      'Unknown',
  'Kunimitsu':    'Kunimitsu',
  'Michelle':     'Michelle',
  'Forest Law':   'Forest',
  'Miharu':       'Miharu',
  'Ancient Ogre': 'Ancient_Ogre',
  'P-Jack':       'Prototype_Jack',
  'Sebastian':    'Sebastian',
  'Violet':       'Violet',
  'Dr.':          'Dr_Bosconovitch',
  'Slim Bob':     'Slim_Bob',
  'Tiger':        'Tiger',
  'Feng':         'Feng',
  'Wang':         'Wang',
  'King':         'King',
  'Alex':         'Alex',
  'Angel':        'Angel',
  'Panda':        'Panda',
}

export const CHARACTER_NAMES = Object.keys(NAME_TO_FILE)

/** Characters arranged in a grid matching the TTT2 character select screen layout (10 columns) */
export const CHARACTER_GRID: string[][] = [
    ['','','','Unknown','Dr.','Slim Bob','Ancient Ogre','Kunimitsu','Forest Law','P-Jack','Combot','','Tiger','Alex','Angel','Michelle','Sebastian','Miharu', 'Violet','','','',''],
    ['Roger Jr.','Raven', 'Bruce','Steve','Paul','Bob','Nina','Wang','Asuka','Kazuya','Jun','','Heihachi','Jin','Devil Jin','King','Marduk','Leo','Hwoarang','Eddy','Lee','Lei','Kuma'],
    ['Mokujin','Yoshimitsu','Jack','Bryan','Law','Miguel','Anna','Xiayu','Lili','Lars','True Ogre','','Jinpachi','Alisa','Julia','Armor King','Ganryu','Zafina','Baek','Christie','Dragunov','Feng','Panda'],
]

/**
 * Returns the public URL for a character portrait, or null if unknown.
 */
export function charImageUrl(name: string): string | null {
  const file = NAME_TO_FILE[name]
  return file ? `/characters/${file}.webp` : null
}
