import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import {
  getStudyItems,
  createStudyItem,
  completeStudyItem,
  deleteStudyItem,
  type StudyItem,
  type StudyItemType,
} from "../services/studyItem.service";

export default function StudyItems() {
  const DRAFT_TIMEOUT = 60; // seconds

  /* -------------------- STATE -------------------- */

  const [type, setType] = useState<StudyItemType>("task");
  const [items, setItems] = useState<StudyItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [draftItem, setDraftItem] = useState<{
    title: string;
    description?: string;
    type: StudyItemType;
    expiresAt: number;
  } | null>(null);

  /* -------------------- EFFECTS -------------------- */

  // Load items whenever tab (type) changes
  useEffect(() => {
    loadItems();
  }, [type]);

  // Auto-delete draft after timeout
  useEffect(() => {
    if (!draftItem) return;

    const timeout = setTimeout(() => {
      setDraftItem(null);
    }, draftItem.expiresAt - Date.now());

    return () => clearTimeout(timeout);
  }, [draftItem]);

  /* -------------------- API HANDLERS -------------------- */

  const loadItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getStudyItems(type);
      setItems(res.data);
    } catch {
      setError("Failed to load items");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    if (draftItem) {
    setError("Please confirm or cancel the current draft first.");
    return;
    }
    if (!title.trim()) return;

    setDraftItem({
      title,
      description,
      type,
      expiresAt: Date.now() + DRAFT_TIMEOUT * 1000,
    });

    setTitle("");
    setDescription("");
  };

  const handleConfirm = async () => {
    if (!draftItem) return;

    const tempItem: StudyItem = {
    id: Date.now(), // temporary id
    title: draftItem.title,
    description: draftItem.description,
    type: draftItem.type,
    completed: false,
  };

    setItems((prev) => [tempItem, ...prev]);

    // Clear draft and switch to correct tab
    setDraftItem(null);
    setError(null);
    setType(draftItem.type);

    try {
    //  Save to backend
    await createStudyItem({
      title: tempItem.title,
      description: tempItem.description,
      type: tempItem.type,
    });

    // Sync with backend data
    loadItems();
        } catch {
    //  Rollback if failed
    setItems((prev) => prev.filter((i) => i.id !== tempItem.id));
    setError("Failed to save item");
    }

  };

  const handleComplete = async (id: number) => {
    try {
      await completeStudyItem(id);
      loadItems();
    } catch {
      setError("Failed to complete task");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteStudyItem(id);
      loadItems();
    } catch {
      setError("Failed to delete item");
    }
  };

  /* -------------------- UI -------------------- */

  return (
    <>
      <Navbar />

      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Study Items</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setType("task")}
            className={`px-4 py-2 rounded ${
              type === "task" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Tasks
          </button>
          <button
            onClick={() => setType("plan")}
            className={`px-4 py-2 rounded ${
              type === "plan" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Plans
          </button>
        </div>

        {/* Create Form */}
        <div className="border p-4 rounded mb-6">
          <h2 className="font-semibold mb-3">
            Add New {type === "task" ? "Task" : "Plan"}
          </h2>

          <input
            value={title}
            onChange={(e) => {setTitle(e.target.value);
                setError(null);
            }}
            placeholder="Title"
            className="border p-2 w-full mb-2 rounded"
          />

          <textarea
            value={description}
            onChange={(e) => { setDescription(e.target.value);
                setError(null);
            }}
            placeholder="Description (optional)"
            className="border p-2 w-full mb-3 rounded"
            rows={3}
          />

          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>

        {/* Draft Confirmation */}
        {draftItem && (
          <div className="border p-4 rounded bg-yellow-50 mb-6">
            <p className="font-semibold">Confirm this item?</p>
            <p className="mt-1">{draftItem.title}</p>

            <button
              onClick={handleConfirm}
              className="bg-green-600 text-white px-3 py-1 rounded mt-2"
            >
              Confirm
            </button>

            <button
              onClick={() => {setDraftItem(null);
                setError(null);
              }}
              className="ml-2 text-gray-600"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Error */}
        {error && <div className="text-red-600 mb-4">{error}</div>}

        {/* List */}
        {loading ? (
          <p>Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-gray-500">No {type}s found.</p>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={item.id}
                className="border p-4 rounded flex justify-between items-start"
              >
                <div>
                  <h3
                    className={`font-semibold ${
                      item.completed ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-sm text-gray-600">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  {item.type === "task" && !item.completed && (
                    <button
                      onClick={() => handleComplete(item.id)}
                      className="text-green-600"
                    >
                      Complete
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

