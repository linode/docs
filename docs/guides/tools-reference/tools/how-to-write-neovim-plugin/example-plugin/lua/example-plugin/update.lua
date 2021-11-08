-- Imports the module for handling SQLite.
local sqlite = require("ljsqlite3")

-- Creates an object for the module.
local M = {}

-- Inserts a new todo task, prompting the
-- user to enter a description.
function M.insert_todo()
    local todo_description = ""
    repeat
        todo_description = vim.fn.input("Enter a description (150 characters or fewer): ")
        print("")
    until (todo_description ~= "") and (string.len(todo_description) <= 150)

    local db = sqlite.open("todo.db")
    db:exec("INSERT INTO todo_list (description) VALUES ('" .. todo_description .. "');")
    db:close()
end

-- Marks a todo task completed. Lists open
-- tasks, and prompts the user to select
-- one for completing.
function M.complete_todo()
    local db = sqlite.open("todo.db")

    local todo_completed = -1
    local todo_selected = -1
    repeat
        local db_results = db:exec("SELECT * FROM todo_list WHERE completed == 'No';")
        for i, item in ipairs(db_results[2]) do
            print(tostring(db_results[1][i]) .. ': ' .. item)
        end

        todo_selected = tonumber(vim.fn.input("Enter an ID number for a task listed above: "))

        for _, id in ipairs(db_results[1]) do
            if (id == todo_selected) then todo_completed = todo_selected end
        end

        print("")
    until todo_completed >= 0

    db:exec("UPDATE todo_list SET completed = 'Yes' WHERE id = " .. todo_completed .. " AND completed = 'No';")
    db:close()
end

return M
