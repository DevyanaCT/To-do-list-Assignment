document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const dueDateInput = document.getElementById('dueDateInput');
    const categoryInput = document.getElementById('categoryInput');
    const addTaskButton = document.getElementById('addTask');
    const taskList = document.getElementById('taskList');
    const filterSelect = document.getElementById('filterSelect');
    const sortSelect = document.getElementById('sortSelect');

    // Load tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks(tasksToRender = tasks) {
        taskList.innerHTML = '';
        
        // Apply filter
        let filteredTasks = tasksToRender.filter(task => {
            const filterValue = filterSelect.value;
            if (filterValue === 'completed') return task.completed;
            if (filterValue === 'pending') return !task.completed;
            return true;
        });

        // Apply sort
        const sortValue = sortSelect.value;
        switch(sortValue) {
            case 'date':
                filteredTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
                break;
            case 'category':
                filteredTasks.sort((a, b) => a.category.localeCompare(b.category));
                break;
            case 'status':
                filteredTasks.sort((a, b) => a.completed - b.completed);
                break;
        }

        filteredTasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            
            const taskContent = document.createElement('span');
            taskContent.textContent = `${task.text} (${task.category || 'No Category'}) - Due: ${task.dueDate || 'No Date'}`;
            taskContent.classList.add(`category-${task.category ? task.category.toLowerCase() : 'default'}`);

            const taskActions = document.createElement('div');
            taskActions.className = 'task-actions';

            const completeButton = document.createElement('button');
            completeButton.textContent = '✓';
            completeButton.onclick = () => toggleComplete(index);

            const editButton = document.createElement('button');
            editButton.textContent = '✎';
            editButton.onclick = () => editTask(index);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = '✖';
            deleteButton.onclick = () => deleteTask(index);

            taskActions.append(completeButton, editButton, deleteButton);
            li.append(taskContent, taskActions);
            taskList.appendChild(li);
        });
    }

    function addTask() {
        const text = taskInput.value.trim();
        const dueDate = dueDateInput.value;
        const category = categoryInput.value;

        if (text) {
            tasks.push({
                text,
                completed: false,
                dueDate,
                category
            });
            
            saveTasks();
            renderTasks();

            // Reset inputs
            taskInput.value = '';
            dueDateInput.value = '';
            categoryInput.value = '';
        }
    }

    function toggleComplete(index) {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
    }

    function editTask(index) {
        const task = tasks[index];
        const li = taskList.children[index];
        const currentText = li.querySelector('span');
        
        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.value = task.text;
        editInput.className = 'edit-input';

        editInput.onblur = () => {
            task.text = editInput.value.trim();
            saveTasks();
            renderTasks();
        };

        editInput.onkeypress = (e) => {
            if (e.key === 'Enter') {
                task.text = editInput.value.trim();
                saveTasks();
                renderTasks();
            }
        };

        currentText.replaceWith(editInput);
        editInput.focus();
    }

    function deleteTask(index) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }

    // Event Listeners
    addTaskButton.addEventListener('click', addTask);
    filterSelect.addEventListener('change', renderTasks);
    sortSelect.addEventListener('change', renderTasks);

    // Initial render
    renderTasks();
});