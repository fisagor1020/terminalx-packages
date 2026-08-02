"use strict";

/* ==========================================
   TerminalX Todo Package v1.0.0
   Developer : Sagor
========================================== */

const TODO_KEY = "terminalx_todo";

/* ===============================
   STORAGE
=============================== */

function loadTodos() {

    try {

        return JSON.parse(
            localStorage.getItem(TODO_KEY) || "[]"
        );

    } catch {

        return [];

    }

}

function saveTodos(todos) {

    localStorage.setItem(
        TODO_KEY,
        JSON.stringify(todos)
    );

}

function nextTodoId(todos) {

    if (!todos.length) return 1;

    return Math.max(...todos.map(t => t.id)) + 1;

}

/* ===============================
   UTILITIES
=============================== */

function formatDate(timestamp) {

    return new Date(timestamp).toLocaleString();

}

function findTodo(todos, id) {

    return todos.find(
        t => t.id === Number(id)
    );

}

/* ===============================
   TODO COMMANDS
=============================== */

function addTodo(args) {

    if (!args.length) {
        return "Usage: todo add <text>";
    }

    const todos = loadTodos();

    const item = {
        id: nextTodoId(todos),
        text: args.join(" "),
        done: false,
        created: Date.now()
    };

    todos.push(item);

    saveTodos(todos);

    return `✓ Todo #${item.id} added.`;

}

function listTodos() {

    const todos = loadTodos();

    if (!todos.length) {
        return "No todos found.";
    }

    let out = "";

    todos.forEach(item => {

        out +=
`[${item.done ? "x" : " "}] #${item.id}  ${item.text}
${formatDate(item.created)}

`;

    });

    return out.trim();

}

/* ===============================
   DONE / DELETE
=============================== */

function doneTodo(id) {

    const todos = loadTodos();

    const item = findTodo(todos, id);

    if (!item) {
        return `Todo #${id} not found.`;
    }

    item.done = true;

    saveTodos(todos);

    return `✓ Todo #${item.id} marked done.`;

}

function deleteTodo(id) {

    const todos = loadTodos();

    const index = todos.findIndex(
        t => t.id === Number(id)
    );

    if (index === -1) {
        return `Todo #${id} not found.`;
    }

    const removed = todos.splice(index, 1)[0];

    saveTodos(todos);

    return `✓ Todo #${removed.id} deleted.`;

}

/* ===============================
   SEARCH / CLEAR / COUNT / HELP
=============================== */

function searchTodos(args) {

    if (!args.length) {
        return "Usage: todo search <text>";
    }

    const keyword = args.join(" ").toLowerCase();

    const todos = loadTodos();

    const result = todos.filter(item =>
        item.text.toLowerCase().includes(keyword)
    );

    if (!result.length) {
        return "No matching todos found.";
    }

    let out = "";

    result.forEach(item => {

        out +=
`[${item.done ? "x" : " "}] #${item.id}  ${item.text}
${formatDate(item.created)}

`;

    });

    return out.trim();

}

function clearTodos() {

    saveTodos([]);

    return "✓ All todos deleted.";

}

function countTodos() {

    const todos = loadTodos();
    const done = todos.filter(t => t.done).length;

    return `Total Todos : ${todos.length}  (Done: ${done})`;

}

function todoHelp() {

    return `
TODO PACKAGE v1.0

Commands
--------
todo add <text>
todo list
todo done <id>
todo delete <id>
todo search <text>
todo clear
todo count
todo help
`.trim();

}

/* ==========================================
   REGISTER PACKAGE
   NOTE: the command key below ("todo") matches
   the package "name" exactly on purpose -- that
   mismatch (name: "notes" vs commands: { note })
   is exactly what broke the previous package.
========================================== */

registerPackage({

    name: "todo",

    title: "Todo List",

    version: "1.0.0",

    commands: {

        todo(args) {

            if (!args.length) {
                return todoHelp();
            }

            const action = args.shift().toLowerCase();

            switch (action) {

                case "add":
                    return addTodo(args);

                case "list":
                    return listTodos();

                case "done":
                    return doneTodo(args[0]);

                case "delete":
                    return deleteTodo(args[0]);

                case "search":
                    return searchTodos(args);

                case "clear":
                    return clearTodos();

                case "count":
                    return countTodos();

                case "help":
                    return todoHelp();

                default:
                    return "Unknown todo command.\nUse: todo help";

            }

        }

    }

});
