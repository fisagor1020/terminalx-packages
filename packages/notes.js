"use strict";

/* ==========================================
   TerminalX Notes Package v1.0.0
   Developer : Sagor
========================================== */

const NOTES_KEY = "terminalx_notes";

/* ===============================
   STORAGE
=============================== */

function loadNotes() {

    try {

        return JSON.parse(
            localStorage.getItem(NOTES_KEY) || "[]"
        );

    } catch {

        return [];

    }

}

function saveNotes(notes) {

    localStorage.setItem(
        NOTES_KEY,
        JSON.stringify(notes)
    );

}

function nextNoteId(notes) {

    if (!notes.length) return 1;

    return Math.max(...notes.map(n => n.id)) + 1;

}

/* ===============================
   UTILITIES
=============================== */

function formatDate(timestamp) {

    return new Date(timestamp).toLocaleString();

}

function findNote(notes, id) {

    return notes.find(
        note => note.id === Number(id)
    );

}

/* ===============================
   NOTE COMMANDS
=============================== */

function addNote(args) {

    if (!args.length) {
        return "Usage: note add <text>";
    }

    const notes = loadNotes();

    const note = {
        id: nextNoteId(notes),
        text: args.join(" "),
        created: Date.now()
    };

    notes.push(note);

    saveNotes(notes);

    return `✓ Note #${note.id} saved.`;

}

function listNotes() {

    const notes = loadNotes();

    if (!notes.length) {
        return "No notes found.";
    }

    let out = "";

    notes.forEach(note => {

        out +=
`#${note.id}
${note.text}
${formatDate(note.created)}

`;

    });

    return out.trim();

}

/* ===============================
   READ / DELETE
=============================== */

function readNote(id) {

    const notes = loadNotes();

    const note = findNote(notes, id);

    if (!note) {
        return `Note #${id} not found.`;
    }

    return `#${note.id}

${note.text}

Created : ${formatDate(note.created)}`;

}

function deleteNote(id) {

    const notes = loadNotes();

    const index = notes.findIndex(
        note => note.id === Number(id)
    );

    if (index === -1) {
        return `Note #${id} not found.`;
    }

    const removed = notes.splice(index, 1)[0];

    saveNotes(notes);

    return `✓ Note #${removed.id} deleted.`;

}

/* ===============================
   SEARCH / CLEAR / HELP
=============================== */

function searchNotes(args) {

    if (!args.length) {
        return "Usage: note search <text>";
    }

    const keyword = args.join(" ").toLowerCase();

    const notes = loadNotes();

    const result = notes.filter(note =>
        note.text.toLowerCase().includes(keyword)
    );

    if (!result.length) {
        return "No matching notes found.";
    }

    let out = "";

    result.forEach(note => {

        out +=
`#${note.id}
${note.text}
${formatDate(note.created)}

`;

    });

    return out.trim();

}

function clearNotes() {

    saveNotes([]);

    return "✓ All notes deleted.";

}

function countNotes() {

    return `Total Notes : ${loadNotes().length}`;

}

function noteHelp() {

    return `
NOTES PACKAGE v1.0

Commands
--------
note add <text>
note list
note read <id>
note delete <id>
note search <text>
note clear
note count
note help
`.trim();

}

/* ==========================================
   REGISTER PACKAGE
========================================== */

registerPackage({

    name: "notes",

    title: "Notes",

    version: "1.0.0",

    commands: {

        note(args) {

            if (!args.length) {
                return noteHelp();
            }

            const action = args.shift().toLowerCase();

            switch (action) {

                case "add":
                    return addNote(args);

                case "list":
                    return listNotes();

                case "read":
                    return readNote(args[0]);

                case "delete":
                    return deleteNote(args[0]);

                case "search":
                    return searchNotes(args);

                case "clear":
                    return clearNotes();

                case "count":
                    return countNotes();

                case "help":
                    return noteHelp();

                default:
                    return "Unknown note command.\nUse: note help";

            }

        }

    }

});