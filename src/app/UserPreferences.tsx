import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { storage } from "./storage";

type UserPreferencesValue = {
  elderMode: boolean;
  favorites: string[];
  history: string[];
  toggleElderMode: () => void;
  toggleFavorite: (id: string) => void;
  addHistory: (id: string) => void;
};

const UserPreferencesContext = createContext<UserPreferencesValue | null>(null);

export const UserPreferencesProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [elderMode, setElderMode] = useState(storage.elderMode);
  const [favorites, setFavorites] = useState(storage.favorites);
  const [history, setHistory] = useState(storage.history);

  const toggleElderMode = useCallback(
    () =>
      setElderMode((current) => {
        storage.writeElderMode(!current);
        return !current;
      }),
    [],
  );
  const toggleFavorite = useCallback(
    (id: string) =>
      setFavorites((current) => {
        const next = current.includes(id)
          ? current.filter((item) => item !== id)
          : [id, ...current];
        storage.writeList("heritage-favorites", next);
        return next;
      }),
    [],
  );
  const addHistory = useCallback(
    (id: string) =>
      setHistory((current) => {
        const next = [id, ...current.filter((item) => item !== id)].slice(
          0,
          12,
        );
        if (next.join() !== current.join())
          storage.writeList("heritage-history", next);
        return next.join() === current.join() ? current : next;
      }),
    [],
  );

  const value = useMemo<UserPreferencesValue>(
    () => ({
      elderMode,
      favorites,
      history,
      toggleElderMode,
      toggleFavorite,
      addHistory,
    }),
    [
      addHistory,
      elderMode,
      favorites,
      history,
      toggleElderMode,
      toggleFavorite,
    ],
  );

  return (
    <UserPreferencesContext.Provider value={value}>
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = () => {
  const value = useContext(UserPreferencesContext);
  if (!value)
    throw new Error("useUserPreferences 必须在 UserPreferencesProvider 内使用");
  return value;
};
