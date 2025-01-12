const todoInput = document.getElementById('todoInput');
const warning = document.getElementById('warning');
const dropdown = document.getElementById('dropdown');
const todoList = document.getElementById('todo-list'); // القائمة التي ستعرض المهام
let tasks = JSON.parse(localStorage.getItem('tasks')) || []; // جلب المهام المخزنة من localStorage
const editModal = document.getElementById('editModal');
const editInput = document.getElementById('editInput');
let editingIndex = null;

// إضافة الأحداث للأزرار
document.getElementById('show-all').addEventListener('click', () => filterTasks('all'));
document.getElementById('show-done').addEventListener('click', () => filterTasks('done'));
document.getElementById('show-todo').addEventListener('click', () => filterTasks('todo'));

// دالة لتصفية المهام
function filterTasks(filter) {
  let filteredTasks = [];

  if (filter === 'done') {
    // تصفية المهام المكتملة
    filteredTasks = tasks.filter(task => task.done);
  } else if (filter === 'todo') {
    // تصفية المهام غير المكتملة
    filteredTasks = tasks.filter(task => !task.done);
  } else {
    // عرض جميع المهام
    filteredTasks = tasks;
  }

  renderTasks(filteredTasks); // إعادة عرض المهام بناءً على الفلتر
}

// تحديث واجهة القائمة لعرض المهام
function renderTasks(filteredTasks) {
  todoList.innerHTML = ''; // مسح القائمة لإعادة بنائها
  filteredTasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = task.done ? 'done' : ''; // إذا كانت المهمة مكتملة، أضف التنسيق

    // إضافة checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;
    checkbox.addEventListener('change', () => toggleTaskDone(index)); // تحديث حالة المهمة

    // نص المهمة
    const taskText = document.createElement('span');
    taskText.textContent = task.text;

    // أزرار التعديل والحذف
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.innerHTML = '<i class="fas fa-edit"></i>'; // أيقونة التعديل
    editBtn.addEventListener('click', () => editTask(index)); // تعديل المهمة

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>'; // أيقونة الحذف
    deleteBtn.addEventListener('click', () => deleteTask(index)); // حذف المهمة

    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(deleteBtn);

    li.appendChild(checkbox);
    li.appendChild(taskText);
    li.appendChild(actionsDiv);

    todoList.appendChild(li);
  });
}

// إضافة مهمة جديدة
function addTask() {
  const value = todoInput.value.trim();

  if (value === '') {
    warning.textContent = 'Task cannot be empty';
    return;
  }

  if (/^\d/.test(value)) {
    warning.textContent = 'Task cannot start with a number';
    return;
  }

  warning.textContent = '';
  tasks.push({ text: value, done: false }); // إضافة مهمة جديدة ككائن
  localStorage.setItem('tasks', JSON.stringify(tasks)); // تخزين المهام في localStorage
  todoInput.value = '';
  dropdown.style.display = 'none';
  renderTasks(tasks); // إعادة عرض المهام بعد إضافة جديدة
}

// تحديث حالة المهمة (مكتملة أو غير مكتملة)
function toggleTaskDone(index) {
  tasks[index].done = !tasks[index].done;
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks(tasks);
}

// تعديل المهمة
function editTask(index) {
  editingIndex = index; // حفظ الفهرس الخاص بالمهمة لتعديلها لاحقاً
  editInput.value = tasks[index].text; // تحميل نص المهمة في الـ input
  editModal.style.display = 'flex'; // عرض نافذة التعديل
}

// حفظ التعديلات
function saveEdit() {
  const newTask = editInput.value.trim();
  if (newTask !== '') {
    tasks[editingIndex].text = newTask; // تحديث نص المهمة
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks(tasks); // إعادة عرض المهام
    closeEditModal(); // إغلاق نافذة التعديل
  }
}

// إغلاق نافذة التعديل
function closeEditModal() {
  editModal.style.display = 'none';
  editInput.value = ''; // مسح حقل الإدخال بعد الإغلاق
}

// حذف المهمة
function deleteTask(index) {
  tasks.splice(index, 1);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks(tasks);
}

// حذف المهام المكتملة
document.getElementById('delete-done').addEventListener('click', () => {
  // تصفية المهام وحذف التي تحتوي على علامة "مكتملة"
  tasks = tasks.filter(task => !task.done);  // الاحتفاظ بالمهام غير المكتملة
  localStorage.setItem('tasks', JSON.stringify(tasks)); // تخزين المهام المحدثة
  renderTasks(tasks); // إعادة عرض المهام بعد الحذف
});

// حذف جميع المهام
document.getElementById('delete-all').addEventListener('click', () => {
  tasks = []; // مسح جميع المهام
  localStorage.setItem('tasks', JSON.stringify(tasks)); // تخزين المهام المحدثة
  renderTasks(tasks); // إعادة عرض المهام بعد الحذف
});
// عرض السجل في القائمة المنسدلة
todoInput.addEventListener('input', () => {
  const value = todoInput.value.trim();

  // عرض رسالة التحذير إذا كان الإدخال يبدأ برقم
  if (/^\d/.test(value)) {
    warning.textContent = 'Task cannot start with a number';
  } else {
    warning.textContent = '';
  }

  // تحديث القائمة المنسدلة مع المهام المخزنة
  dropdown.innerHTML = ''; // إعادة تعيين المحتوى القديم
  if (value.length > 0) {
    const filteredTasks = tasks.filter(task => task.text.toLowerCase().includes(value.toLowerCase()));

    if (filteredTasks.length > 0) {
      dropdown.style.display = 'block';
      filteredTasks.forEach(task => {
        const div = document.createElement('div');
        div.textContent = task.text;
        div.className = 'dropdown-item';
        dropdown.appendChild(div);

        div.addEventListener('click', () => {
          todoInput.value = task.text;
          dropdown.style.display = 'none';
        });
      });
    } else {
      dropdown.style.display = 'none';
    }
  } else {
    dropdown.style.display = 'none';
  }
});

// عند تحميل الصفحة، عرض المهام المخزنة
renderTasks(tasks);

let taskToDeleteIndex = null; // حفظ الفهرس الخاص بالمهمة للحذف لاحقًا

// حذف المهمة مع رسالة تأكيد مخصصة
function deleteTask(index) {
  taskToDeleteIndex = index; // حفظ الفهرس الخاص بالمهمة
  document.getElementById('confirmModal').style.display = 'flex'; // إظهار النافذة
}

// تأكيد الحذف
document.getElementById('confirmDelete').addEventListener('click', () => {
  if (taskToDeleteIndex !== null) {
    tasks.splice(taskToDeleteIndex, 1); // حذف المهمة من المصفوفة
    localStorage.setItem('tasks', JSON.stringify(tasks)); // تحديث التخزين المحلي
    renderTasks(tasks); // إعادة عرض المهام
    taskToDeleteIndex = null; // إعادة تعيين الفهرس
  }
  closeConfirmModal(); // إغلاق النافذة
});

// إلغاء الحذف
document.getElementById('cancelDelete').addEventListener('click', closeConfirmModal);

// إغلاق النافذة
function closeConfirmModal() {
  document.getElementById('confirmModal').style.display = 'none'; // إخفاء النافذة
}

