import { useEffect, useState } from "react";
import API from "../api";
import Navbar from "./Navbar";
export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const role = localStorage.getItem("role")?.toLowerCase();
  const plan = localStorage.getItem("plan")?.toLowerCase();
  const tenantSlug = localStorage.getItem("tenant");
  const [editingNoteId, setEditingNoteId] = useState(null);
  // Load notes
  async function loadNotes() {
    try {
      const res = await API.get("/notes");
      setNotes(res.data);
      setError(""); // clear previous errors
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load notes");
    }
  }

  // Add a new note
  async function addNote() {
    try {
      if (editingNoteId) {
        // Update existing note
        await API.put(`/notes/${editingNoteId}`, { title, content });
        setEditingNoteId(null);
      } else {
        // Create new note
        await API.post("/notes", { title, content });
      }
      setTitle("");
      setContent("");
      setError("");
      loadNotes();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save note");
    }
  }

  // Delete a note
  async function deleteNote(id) {
     try {
      await API.delete(`/notes/${id}`);
      // If deleting the note being edited, reset fields
      if (editingNoteId === id) {
        setEditingNoteId(null);
        setTitle("");
        setContent("");
      }
      loadNotes();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete note");
    }
  }

  // Upgrade tenant to Pro (Admin only)
  async function upgradePlan() {
    try {
      await API.post(`/tenants/${tenantSlug}/upgrade`);
      setError("");
      alert("Upgraded to Pro plan!");
      loadNotes();
    } catch (err) {
      setError(err.response?.data?.error || "Upgrade failed");
    }
  }
async function inviteUser() {
    const email = prompt("Enter email for new user:");
    const role = prompt("Enter role (admin/member):", "member")?.toLowerCase();
    if (!email || !role) return;

    try {
      const res = await API.post(`/tenants/${tenantSlug}/invite`,{ email, role });
      alert(`User invited! Temp password: ${res.data.user.tempPassword}`);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to invite user");
    }
  }
  useEffect(() => {
    loadNotes();
  }, []);

  console.log("role:", role, "error:", error);
 function editNote(note) {
    setEditingNoteId(note._id);
    setTitle(note.title);
    setContent(note.content);
  }
  return (
    <>
      <Navbar />

      
    <div className="notes-container">
      <h1>Notes</h1>
{error && <div style={{ color: "red" }}>{error}</div>}
      {/* Show error & upgrade button for admins */}
       {role === "admin" && (
    <div style={{ margin: "10px 0", justifyContent: "center", display: "flex", gap: "10px" }}>
      {plan === "free" && (
        <button onClick={upgradePlan}>Upgrade to Pro</button>
      )}
      <button onClick={inviteUser}>Invite User</button>
    </div>
    
  )}
    <div className="notes-inputs">
      <input 
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
      />
      <button
        onClick={addNote}
        disabled={notes.length >= 3 && plan === "free" && !editingNoteId}
      >
        Add
      </button>
      {notes.length >= 3 && plan === "free" && !editingNoteId && (
    <p className="error-message">Free plan allows only 3 notes. Upgrade to Pro for more.</p>
  )}
    </div>

     <ul className="notes-list">
  {notes.map((n) => (
    <li key={n._id}>
      <b>{n.title}</b>
      <p className="note-content">{n.content}</p>
      <div className="note-actions">
        <button className="edit-btn" onClick={() => editNote(n)}>Edit</button>
        <button className="delete-btn" onClick={() => deleteNote(n._id)}>Delete</button>
      </div>
    </li>
  ))}
</ul>

    </div>
    </>
  );
}
