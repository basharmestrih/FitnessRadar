import { useEffect, useMemo, useRef, useState } from 'react';

const MILK_COUNT = 5;
const PROTEIN_COUNT = 5;

const BOTTLE_META = {
  milk: { count: MILK_COUNT, calories: 250, label: 'Milk' },
  protein: { count: PROTEIN_COUNT, calories: 400, label: 'Protein' },
};

function createInitialSlots() {
  return {
    milk: Array.from({ length: MILK_COUNT }, (_, index) => ({
      available: null,
      calories: BOTTLE_META.milk.calories,
      id: index + 1,
    })),
    protein: Array.from({ length: PROTEIN_COUNT }, (_, index) => ({
      available: null,
      calories: BOTTLE_META.protein.calories,
      id: index + 1,
    })),
  };
}

function getWebSocketUrl() {
  if (process.env.REACT_APP_WS_URL) {
    return process.env.REACT_APP_WS_URL;
  }

  if (typeof window === 'undefined') {
    return 'ws://localhost:8080';
  }

  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  const hostname = window.location.hostname || 'localhost';

  return `${protocol}://${hostname}:8080`;
}

function parseBottleMessage(rawMessage) {
  const normalized = rawMessage.trim().replace(/\s+/g, ' ');
  const match = normalized.match(
    /(milk|protein)\s*bottle\s*(\d+)\s*(available|consumed)/i
  );

  if (!match) {
    return null;
  }

  const type = match[1].toLowerCase();
  const id = Number(match[2]);
  const available = match[3].toLowerCase() === 'available';
  const { calories, count, label } = BOTTLE_META[type];

  if (!Number.isInteger(id) || id < 1 || id > count) {
    return null;
  }

  return {
    type,
    id,
    available,
    calories,
    name: `${label} Bottle ${id}`,
  };
}

export function useBottleData() {
  const [slot, setSlot] = useState(createInitialSlots);
  const [daily, setDaily] = useState([]);
  const [connectionState, setConnectionState] = useState('connecting');
  const [lastMessage, setLastMessage] = useState('');
  const [connectionError, setConnectionError] = useState('');
  const reconnectTimerRef = useRef(null);
  const dailyRef = useRef([]);

  const websocketUrl = useMemo(() => getWebSocketUrl(), []);

  useEffect(() => {
    dailyRef.current = daily;
  }, [daily]);

useEffect(() => {

  const staticSlots = {
    milk: Array.from({ length: MILK_COUNT }, (_, index) => ({
      id: index + 1,
      calories: BOTTLE_META.milk.calories,
      available: index !== 4, // first 4 available, last one consumed
    })),
    protein: Array.from({ length: PROTEIN_COUNT }, (_, index) => ({
      id: index + 1,
      calories: BOTTLE_META.protein.calories,
      available: index !== 4,
    })),
  };

  setSlot(staticSlots);

  const time = new Date().toLocaleTimeString();

  const staticDaily = [
    {
      key: `Milk Bottle 5-${time}`,
      name: 'Milk Bottle 5',
      calories: BOTTLE_META.milk.calories,
      time,
    },
    {
      key: `Protein Bottle 5-${time}`,
      name: 'Protein Bottle 5',
      calories: BOTTLE_META.protein.calories,
      time,
    },
  ];

  setDaily(staticDaily);
  setConnectionState('mocked');
  setConnectionError('');
}, []);



  const totalCalories = daily.reduce((sum, item) => sum + item.calories, 0);

  return {
    slot,
    daily,
    totalCalories,
    websocketUrl,
    connectionState,
    connectionError,
    lastMessage,
  };
}
