 const input           = document.getElementById('todoInput');
    const prioritySelect  = document.getElementById('prioritySelect');
    const addBtn          = document.getElementById('addBtn');
    const todoList        = document.getElementById('todoList');
    const filterBtns      = document.querySelectorAll('.filter-btn');

    const totalSpan       = document.getElementById('totalTasks');
    const pendingSpan     = document.getElementById('pendingTasks');
    const completedSpan   = document.getElementById('completedTasks');
    const rateSpan        = document.getElementById('completionRate');


    const showEmptyState = () => {
      if (!todoList.querySelector('.todo-item')) {
        todoList.innerHTML = '<div class="empty-state">No tasks yet</div>';
      }
    };

   function sortTasksByPriority() {
     const rank = { high: 0, medium: 1, low: 2 };
   
     const items = Array.from(todoList.querySelectorAll('.todo-item'));
   
     items.sort((a, b) => {
       const pa = a.querySelector('.priority-badge').dataset.priority;
       const pb = b.querySelector('.priority-badge').dataset.priority;
       return rank[pa] - rank[pb];
     });

  items.forEach(item => todoList.appendChild(item));
}


    const updateStats = () => {
      const allItems       = todoList.querySelectorAll('.todo-item');
      const completedItems = todoList.querySelectorAll('.todo-item.completed');

      const total    = allItems.length;
      const done     = completedItems.length;
      const pending  = total - done;
      const rate     = total ? Math.round((done / total) * 100) : 0;

      totalSpan.textContent     = total;
      pendingSpan.textContent   = pending;
      completedSpan.textContent = done;
      rateSpan.textContent      = `${rate}%`;
    };

    const applyFilter = type => {
      todoList.querySelectorAll('.todo-item').forEach(item => {
        const isDone = item.classList.contains('completed');
        const shouldHide =
          type === 'pending'   ? isDone :
          type === 'completed' ? !isDone :
          false;               // 'all'

        item.classList.toggle('hidden', shouldHide);
      });
    };

    const clearActiveFilters = () =>
      filterBtns.forEach(btn => btn.classList.remove('active'));

  
    addBtn.addEventListener('click', () => {
      const taskText = input.value.trim();
      if (!taskText) { alert('Task is empty'); return; }

      // remove empty‑state, if present
      const empty = todoList.querySelector('.empty-state');
      if (empty) empty.remove();

      const priority = prioritySelect.value;
      const todoHTML = `
        <div class="todo-item">
          <input type="checkbox" class="todo-checkbox" />
          <div class="todo-text">${taskText}</div>
          <div class="priority-badge priority-${priority}"data-priority="${priority}">${priority}</div>
          <button class="action-btn edit-btn">Edit</button>
          <button class="action-btn del-btn">Delete</button>
        </div>`;

      todoList.insertAdjacentHTML('beforeend', todoHTML);
      sortTasksByPriority(); 
      updateStats();
      applyFilter(document.querySelector('.filter-btn.active').dataset.filter);

      // clear & refocus
      input.value = '';
      input.focus();
    });

   
    todoList.addEventListener('change', e => {
      if (!e.target.matches('.todo-checkbox')) return;

      const item = e.target.closest('.todo-item');
      item.classList.toggle('completed', e.target.checked);
      updateStats();
      applyFilter(document.querySelector('.filter-btn.active').dataset.filter);
    });

    todoList.addEventListener('click', e => {
      const item = e.target.closest('.todo-item');
      if (!item) return;

      /* ----- Delete ----- */
      if (e.target.matches('.del-btn')) {
        item.remove();
        showEmptyState();
        updateStats();
        return;
      }

if (e.target.matches('.edit-btn')) {
  const textEl      = item.querySelector('.todo-text');
  const priorityEl  = item.querySelector('[class^="priority-"]'); // label div
  const oldPriority = priorityEl.textContent.trim().toLowerCase();

  // Prompt for new task text
  const newText = prompt('Edit task:', textEl.textContent.trim());
  if (newText === null) return; // user hit “Cancel”
  if (newText.trim()) textEl.textContent = newText.trim();

  // Prompt for new priority
  let newPriority = prompt('Priority (low / medium / high):', oldPriority);
  if (newPriority !== null) {
    newPriority = newPriority.trim().toLowerCase();
    if (['low', 'medium', 'high'].includes(newPriority)) {
      // Swap class and update text
      priorityEl.classList.remove(`priority-${oldPriority}`);
      priorityEl.classList.add(`priority-${newPriority}`);
      priorityEl.textContent = newPriority;
     sortTasksByPriority(); 
    }
  }
}

    });

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        clearActiveFilters();
        btn.classList.add('active');
        applyFilter(btn.dataset.filter);
      });
    });

    /* initial stats */
    updateStats();
