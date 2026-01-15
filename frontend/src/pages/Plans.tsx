import React, { useEffect, useState } from "react";
import planService from "../services/plan.service";
import type { Plan } from "../types";
import Navbar from "../components/layout/Navbar";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Loader from "../components/common/Loader";

const Plans: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingDescription, setEditingDescription] = useState("");

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setIsLoading(true);
    try {
      const data = await planService.getPlans();
      setPlans(data);
    } catch (err: any) {
      setError("Failed to load plans");
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------- CREATE ----------------
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Title required");
      return;
    }

    try {
      await planService.createPlan({ title, description });
      setTitle("");
      setDescription("");
      await fetchPlans();
      setSuccessMessage("Plan created!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch {
      setError("Failed to create plan");
    }
  };

  // ---------------- DELETE (Optimistic) ----------------
  const handleDelete = async (id: number) => {
    const old = [...plans];
    setPlans(plans.filter(p => p.id !== id));

    try {
      await planService.deletePlan(id);
      setSuccessMessage("Plan deleted!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch {
      setPlans(old);
      setError("Delete failed");
    }
  };

  // ---------------- EDIT ----------------
  const startEdit = (plan: Plan) => {
    setEditingId(plan.id);
    setEditingTitle(plan.title);
    setEditingDescription(plan.description || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (id: number) => {
    const old = [...plans];

    // Optimistic
    setPlans(plans.map(p => p.id === id ? { ...p, title: editingTitle, description: editingDescription } : p));
    setEditingId(null);

    try {
      await planService.updatePlan(id, { title: editingTitle, description: editingDescription });
      setSuccessMessage("Plan updated!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch {
      setPlans(old);
      setError("Update failed");
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <Loader size="lg" text="Loading plans..." />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">

          <h1 className="text-3xl font-bold mb-6">Study Plans</h1>

          {successMessage && <div className="mb-4 text-green-600">{successMessage}</div>}
          {error && <div className="mb-4 text-red-600">{error}</div>}

          {/* Create Form */}
          <Card className="mb-6">
            <form onSubmit={handleCreate} className="space-y-3">
              <Input placeholder="Plan title" value={title} onChange={e => setTitle(e.target.value)} />
              <Input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
              <Button type="submit">Create Plan</Button>
            </form>
          </Card>

          {/* Plans List */}
          <div className="space-y-4">
            {plans.map(plan => (
              <Card key={plan.id}>
                {editingId === plan.id ? (
                  <>
                    <Input value={editingTitle} onChange={e => setEditingTitle(e.target.value)} />
                    <Input value={editingDescription} onChange={e => setEditingDescription(e.target.value)} />
                    <div className="flex gap-2 mt-3">
                      <Button onClick={() => saveEdit(plan.id)}>Save</Button>
                      <Button variant="secondary" onClick={cancelEdit}>Cancel</Button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-bold">{plan.title}</h3>
                    <p className="text-gray-600">{plan.description}</p>
                    <div className="flex gap-2 mt-3">
                      <Button variant="secondary" onClick={() => startEdit(plan)}>Edit</Button>
                      <Button variant="danger" onClick={() => handleDelete(plan.id)}>Delete</Button>
                    </div>
                  </>
                )}
              </Card>
            ))}
          </div>

        </div>
      </div>
    </>
  );
};

export default Plans;
