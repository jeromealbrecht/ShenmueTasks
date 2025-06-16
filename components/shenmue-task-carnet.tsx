"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckSquare,
  Square,
  PlusCircle,
  Trash2,
  Edit3,
  Save,
  XCircle,
} from "lucide-react";
import RyoWatch from "./ryo-watch";
import Image from "next/image";

interface Task {
  id: number;
  text: string;
  done: boolean;
}

const DEFAULT_TASKS: Task[] = [
  { id: 1, text: "Trouver une alternance sérieuse", done: false },
  { id: 2, text: "Finaliser la V1 du projet Timelog", done: false },
  { id: 3, text: "Écouter le mix Amandine pour validation", done: false },
];

const LOCAL_STORAGE_KEY = "shenmue-tasks";

export default function ShenmueTaskCarnet() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newTask, setNewTask] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isClient, setIsClient] = useState(false);

  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editingTaskText, setEditingTaskText] = useState<string>("");
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsClient(true);
    try {
      const savedTasks = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      } else {
        setTasks(DEFAULT_TASKS);
      }
    } catch (error) {
      console.error(
        "Erreur lors du chargement des tâches depuis le localStorage:",
        error
      );
      setTasks(DEFAULT_TASKS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading && isClient) {
      try {
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
      } catch (error) {
        console.error(
          "Erreur lors de la sauvegarde des tâches dans le localStorage:",
          error
        );
      }
    }
  }, [tasks, isLoading, isClient]);

  useEffect(() => {
    if (editingTaskId !== null && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingTaskId]);

  const handleCheck = (id: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );

    if (audioRef.current) {
      const audio = audioRef.current;
      // S'assurer que la source est bien définie, surtout si elle est dynamique ou peut changer
      if (audio.src !== window.location.origin + "/audio/shen.mp3") {
        audio.src = "/audio/shen.mp3";
      }
      audio.load(); // Recharger l'élément audio si la source a pu changer ou pour s'assurer qu'il est prêt

      setTimeout(() => {
        audio.currentTime = 0;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((e) => {
            console.error("La lecture audio a échoué:", e);
            // Si l'erreur est NotSupportedError, cela confirme que la source est le problème
            if (e.name === "NotSupportedError") {
              console.error(
                "Vérifiez que le fichier /audio/shen.mp3 est accessible et au bon format."
              );
            }
          });
        }
      }, 300);
    }
  };

  const handleAddTask = () => {
    if (newTask.trim() === "") return;
    setTasks((prevTasks) => [
      ...prevTasks,
      { id: Date.now(), text: newTask.trim(), done: false },
    ]);
    setNewTask("");
  };

  const handleDeleteTask = (id: number) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const handleStartEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingTaskText(task.text);
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditingTaskText("");
  };

  const handleSaveEdit = () => {
    if (editingTaskId === null || editingTaskText.trim() === "") {
      handleCancelEdit();
      return;
    }
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === editingTaskId
          ? { ...task, text: editingTaskText.trim() }
          : task
      )
    );
    handleCancelEdit();
  };

  if (isLoading && !isClient) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-lg font-hand">Chargement du carnet...</p>
      </div>
    );
  }

  return (
    <div className="relative perspective-[1000px] max-w-xl mx-auto my-10 p-4 sm:p-0">
      <motion.div
        initial={{ rotateY: -90, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "circOut" }}
        className="bg-paper bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] p-6 sm:p-8 rounded-xl shadow-2xl border-2 border-neutral-700 relative min-h-[300px] flex flex-col min-w-[340px] max-w-md"
        style={{
          backgroundBlendMode: "multiply",
          backgroundColor: "var(--color-paper)",
        }}
      >
        {/* Header avec titre et montre */}
        <div className="flex items-center justify-between mb-6 w-full gap-2">
          <h1 className="text-3xl sm:text-4xl font-hand text-ink flex items-center gap-2 m-0 p-0 whitespace-nowrap">
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
            >
              📓
            </motion.span>
            Carnet de Bord
          </h1>
          {isClient && (
            <div className="shrink-0 min-w-[70px] flex justify-end">
              <RyoWatch />
            </div>
          )}
        </div>

        <div className="mb-6 flex gap-2 items-center">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
            placeholder="Nouvelle tâche..."
            className="flex-1 p-3 border border-neutral-400 rounded-lg font-hand text-lg text-ink bg-white/80 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
          />
          <button
            onClick={handleAddTask}
            className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
            aria-label="Ajouter une tâche"
          >
            <PlusCircle size={24} />
          </button>
        </div>

        {tasks.length === 0 && !isLoading && isClient ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center justify-center text-center text-ink font-hand mt-8 flex-grow"
          >
            <Image
              src="/images/ryo-pensive.png"
              alt="Ryo pensif"
              width={150}
              height={150}
              className="rounded-md mb-4 opacity-90 object-contain shadow-lg"
              priority
            />
            <p className="text-xl">Le carnet est vide.</p>
            <p className="text-lg opacity-70">
              Il est temps d'enquêter ou d'ajouter une nouvelle mission.
            </p>
          </motion.div>
        ) : (
          <ul className="space-y-3">
            <AnimatePresence initial={false}>
              {tasks.map((task) => (
                <motion.li
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 30, transition: { duration: 0.3 } }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="flex items-center space-x-3 p-3 bg-white/50 rounded-md shadow-sm"
                >
                  <button
                    onClick={() => handleCheck(task.id)}
                    className="focus:outline-none focus:ring-2 focus:ring-green-500 rounded shrink-0"
                    aria-label={
                      task.done
                        ? "Marquer comme non terminée"
                        : "Marquer comme terminée"
                    }
                  >
                    {task.done ? (
                      <CheckSquare size={28} className="text-green-600" />
                    ) : (
                      <Square size={28} className="text-neutral-500" />
                    )}
                  </button>

                  {editingTaskId === task.id ? (
                    <input
                      ref={editInputRef}
                      type="text"
                      value={editingTaskText}
                      onChange={(e) => setEditingTaskText(e.target.value)}
                      onBlur={handleSaveEdit}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveEdit();
                        if (e.key === "Escape") handleCancelEdit();
                      }}
                      className="flex-1 p-1 border border-green-500 rounded-md font-hand text-lg text-ink bg-white focus:outline-none"
                    />
                  ) : (
                    <span
                      className={`flex-1 text-lg font-hand text-ink cursor-pointer ${
                        task.done ? "line-through opacity-60" : ""
                      }`}
                      onClick={() => handleStartEdit(task)}
                      onDoubleClick={() => handleStartEdit(task)}
                      title="Cliquer pour éditer"
                    >
                      {task.text}
                    </span>
                  )}

                  <div className="flex items-center space-x-1 shrink-0">
                    {editingTaskId === task.id ? (
                      <>
                        <button
                          onClick={handleSaveEdit}
                          className="p-1 text-green-600 hover:text-green-700 focus:outline-none focus:ring-1 focus:ring-green-500 rounded"
                          aria-label="Sauvegarder la tâche"
                        >
                          <Save size={20} />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-1 text-red-500 hover:text-red-700 focus:outline-none focus:ring-1 focus:ring-red-500 rounded"
                          aria-label="Annuler l'édition"
                        >
                          <XCircle size={20} />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleStartEdit(task)}
                        className="p-1 text-blue-500 hover:text-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded"
                        aria-label="Éditer la tâche"
                      >
                        <Edit3 size={20} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-1 text-red-500 hover:text-red-700 focus:outline-none focus:ring-1 focus:ring-red-500 rounded"
                      aria-label="Supprimer la tâche"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </motion.div>
      {/* L'élément audio est rendu uniquement côté client */}
      {isClient && (
        <audio ref={audioRef} src="/audio/shen.mp3" preload="auto" />
      )}
    </div>
  );
}
