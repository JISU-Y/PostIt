const toDoForm = document.querySelector(".toDoForm");
const addForm = document.querySelector(".addForm");
const toDoInput = document.querySelector(".toDoInput");
const toDoSubmit = document.querySelector(".toDoSubmit");
const toDoUL = document.querySelector(".toDoList");
const addButton = document.querySelector(".addBtn"); //todobutton인셈
const inputText = document.querySelector(".inputText");
const container = document.querySelector(".container");
const listContainer = document.querySelector(".list-container");
const postEdge = document.querySelector(".postEdge"); // 이버튼안에 추가기능, 편집 기능 등등

let TODOS = [];
let localIndex = localStorage.length; // 0으로 초기화 할 게 아니라 지금 local에 저장되어 있는 배열에 따라 달라지자나

//addButton.addEventListener("click", addTodo); // 첨부터 대뜸 되게 하지 말고, input 눌렀을 때만 되도록
// toDoUL.addEventListener("click", deleteCheck);
// document.addEventListener("DOMContentLoaded", getTodos);
document.addEventListener("DOMContentLoaded", getPost);
// postEdge.addEventListener("click", addPost);
container.addEventListener("click", (e) => {
  if (e.target.classList[0] === "list-container") {
    // 그냥 list container를 클릭했을 때만 check list 하도록
    checkList(e);
  } else if (e.target.classList[0] === "container") {
    InEditToDone();
  }
}); // 어느 postit이 체크되었나 확인
//inputText.addEventListener("click", checkList); // 전체 postit 선택하는거 이외에도 input 눌렀을 때도 체크하자

// todos[] 이거마다 저장하는거 먼저
// 흠 이거는 그러면은 todos[]를 선택했을 때 해야하는거 index를 설정해주어야 하는거 아닌가.?
// 아마 post Edge 누르는 순간..?

function addTodo(event) {
  event.preventDefault();

  // 선택된 list-container
  let checked_idx = parseInt(event.path[2].id[6]); // id에서 숫자만
  console.log(event.path[2].id);
  let checked_LC = document.getElementById(`TODOS[${checked_idx}]`);
  if (checked_LC == null) {
    checked_LC = document.querySelector(".list-container"); // 가장 맨 처음에 있는 list Container 이거는 할당된 id가 없으니까
    checked_idx = localIndex;
  }
  const checked_todoUL = checked_LC.children[0];
  const checked_form = checked_LC.children[1];
  const checked_inputText = checked_form.children[0];

  console.log(event);
  console.log(checked_LC);
  console.log(checked_todoUL);
  console.log(checked_form);
  console.log(checked_inputText);
  console.log(checked_idx);

  // 띄어쓰기 자르기
  newInputText = checked_inputText.value.trim();

  if (newInputText === "") {
    alert("empty value");
  } else {
    // todo div
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");

    // check mark btn
    const completedButton = document.createElement("button");
    completedButton.innerHTML = '<i class="fas fa-check"></i>'; // 이렇게 innerHTML로 icon 바로 넣어줘도 된다.
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);

    // li
    const newTodo = document.createElement("li");
    newTodo.innerText = newInputText;
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);

    // add todo to local Storage
    saveLocalTodos(newInputText, checked_idx);

    // del btn
    const trashButton = document.createElement("button");
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);

    // append to list
    checked_todoUL.appendChild(todoDiv);
  }
  // clear todo input value
  checked_inputText.value = "";
}

function deleteCheck(e) {
  const item = e.target; // 선택된 요소를 저장
  //delete todo
  if (item.classList[0] === "trash-btn") {
    // li가 될수도 있고 complete-btn이 될 수도 있다.
    const todo = item.parentElement; // todo는 li,btn2개를 포함하는 div
    const checked_LC = todo.parentElement.parentElement;
    const checked_idx = parseInt(checked_LC.id[6]);

    removeLocalTodos(todo, checked_idx);
    // 바로 지우면 class list 추가되도 그냥 지워짐
    todo.remove();
  }

  // check
  if (item.classList[0] === "complete-btn") {
    const todo = item.parentElement;
    todo.classList.toggle("completed");
  }
}

function saveLocalTodos(todo, index) {
  let todos;

  if (localStorage.getItem(`TODOS[${index}]`) === null) {
    // local storage 배열이 비어있으면
    // 새로운 배열에다가 빈 배열 할당
    todos = [];
  } else {
    // 원래 있으면
    // todos에다가 localstorage 배열 넣고
    todos = JSON.parse(localStorage.getItem(`TODOS[${index}]`)); // 저장하는거 바꾸기!!
  }

  // 그 배열에다가 인자로 받은 todo item을 넣는다.
  todos.push(todo);
  // 그러고 다시 local에다가 저장
  localStorage.setItem(`TODOS[${index}]`, JSON.stringify(todos));
}

// 이걸 getPosts에서 해주니까
// function getTodos() {
//   let todos;

//   // local에 배열 있는지 없는지 체크
//   if (localStorage.getItem(`TODOS[${localIndex}]`) === null) {
//     // local storage 배열이 비어있으면
//     // 새로운 배열에다가 빈 배열 할당
//     todos = [];
//   } else {
//     todos = JSON.parse(localStorage.getItem(`TODOS[${localIndex}]`));
//   }

//   todos.forEach(function (todo) {
//     // todo div
//     const todoDiv = document.createElement("div");
//     todoDiv.classList.add("todo");

//     // check mark btn
//     const completedButton = document.createElement("button");
//     completedButton.innerHTML = '<i class="fas fa-check"></i>'; // 이렇게 innerHTML로 icon 바로 넣어줘도 된다.
//     completedButton.classList.add("complete-btn");
//     todoDiv.appendChild(completedButton);

//     // li
//     const newTodo = document.createElement("li");
//     newTodo.innerText = todo;
//     newTodo.classList.add("todo-item");
//     todoDiv.appendChild(newTodo);

//     // del btn
//     const trashButton = document.createElement("button");
//     trashButton.innerHTML = '<i class="fas fa-trash"></i>';
//     trashButton.classList.add("trash-btn");
//     todoDiv.appendChild(trashButton);

//     // append to list
//     toDoUL.appendChild(todoDiv);
//   });
// }

function removeLocalTodos(todo, index) {
  let todos;

  if (localStorage.getItem(`TODOS[${index}]`) === null) {
    // local storage 배열이 비어있으면
    // 새로운 배열에다가 빈 배열 할당
    todos = [];
  } else {
    // 원래 있으면
    // todos에다가 localstorage 배열 넣고
    todos = JSON.parse(localStorage.getItem(`TODOS[${index}]`));
  }

  // 그래서 children의 0번쨰 요소 li를 찾고 싶음
  const todoIndex = todo.children[1].innerText;

  todos.splice(todos.indexOf(todoIndex), 1);

  if (todos.length === 0) {
    // 지웠는데 빈 배열이면
    // localStorage.removeItem(`TODOS[${index}]`); // 그냥 key를 지워버림
    // splice가 안됨..ㅠㅠ

    for (let i = index; i <= localStorage.length - 1; i++) {
      //nexttodos에 지워지는 배열 다음 거를 담는다.
      nextTodos = JSON.parse(localStorage.getItem(`TODOS[${i + 1}]`));
      localStorage.setItem(`TODOS[${i}]`, JSON.stringify(nextTodos));
    }
    // 하나씩 다 밀렸으니 마지막거를 지움
    localStorage.removeItem(`TODOS[${localStorage.length - 1}]`);

    // 누르자마자 post들 다시 꺼내오기
    addPost();
  } else {
    localStorage.setItem(`TODOS[${index}]`, JSON.stringify(todos));
  }
}

function addPost() {
  // localIndex++; // local에 저장하는 index 1 증가 (다른 배열에 저장 시작하겠다는 뜻)

  // 새로운 포스트잇이 맨 처음에 있어야 하니까
  // 작성 완료한 포스트있은 오른쪽 아래 버튼 누르면 오른쪽으로 붙게끔
  // 먼저 container 클리어
  container.innerHTML = "";

  //div container에 추가
  //<div class="list-container">
  //    <ul class="toDoList"></ul>
  //    <form class="addForm">
  //        <input type="text" class="inputText" placeholder="할 일">
  //        <button class="addBtn" type="submit"><i class="fa fa-plus"></i></button>
  //    </form>
  //    <div class="postEdge"></div>
  //</div>
  const listContainer = document.createElement("div");
  listContainer.classList.add("list-container");

  const ul_todo = document.createElement("ul");
  ul_todo.classList.add("toDoList");
  listContainer.appendChild(ul_todo);

  const form_todo = document.createElement("form");
  form_todo.classList.add("addForm");
  listContainer.appendChild(form_todo);

  const input_todo = document.createElement("input");
  input_todo.classList.add("inputText");
  input_todo.setAttribute("type", "text");
  input_todo.setAttribute("placeholder", "할 일");
  form_todo.appendChild(input_todo);

  const button_todo = document.createElement("button");
  button_todo.classList.add("addBtn");
  button_todo.setAttribute("type", "submit");
  form_todo.appendChild(button_todo);

  const icon_plus = document.createElement("i");
  icon_plus.classList.add("fa");
  icon_plus.classList.add("fa-plus");
  button_todo.appendChild(icon_plus);

  const div_postEdge = document.createElement("div");
  div_postEdge.classList.add("postEdge");
  listContainer.appendChild(div_postEdge);

  container.appendChild(listContainer);

  // local에 저장되어 있던 애들 가져와서 화면에 추가
  getPost();
}

function getPost() {
  let posts = [];

  if (localStorage.length === 0) {
    // local 저장소에 아무것도 없으면
    // 그냥 빈 포스트잇 추가
    posts = [];
  } else {
    // 있으면 local에 저장한게 todos[i]니까 모든 index에 있는거 가져와서
    let i;
    for (i = 0; i < localStorage.length; i++) {
      posts[i] = JSON.parse(localStorage.getItem(`TODOS[${i}]`));
      // console.log(posts[i]);
    }
  }

  for (i = 0; i < localStorage.length; i++) {
    const listContainer = document.createElement("div");
    listContainer.classList.add("list-container");
    listContainer.id = `TODOS[${i}]`; // listContainer 클래스에 각 배열의 이름을 id로 넣어준다.

    const ul_todo = document.createElement("ul");
    ul_todo.classList.add("toDoList");

    posts[i].forEach(function (todo) {
      // todo div
      const todoDiv = document.createElement("div");
      todoDiv.classList.add("todo");

      // check mark btn
      const completedButton = document.createElement("button");
      completedButton.innerHTML = '<i class="fas fa-check"></i>'; // 이렇게 innerHTML로 icon 바로 넣어줘도 된다.
      completedButton.classList.add("complete-btn");
      todoDiv.appendChild(completedButton);

      // li
      const newTodo = document.createElement("li");
      newTodo.innerText = todo;
      newTodo.classList.add("todo-item");
      todoDiv.appendChild(newTodo);

      // del btn
      const trashButton = document.createElement("button");
      trashButton.innerHTML = '<i class="fas fa-trash"></i>';
      trashButton.classList.add("trash-btn");
      todoDiv.appendChild(trashButton);

      // append to list
      ul_todo.appendChild(todoDiv);
    });

    listContainer.appendChild(ul_todo);

    // edge 생성 안하기
    // const div_postEdge = document.createElement("div");
    // div_postEdge.classList.add("postEdge");
    // listContainer.appendChild(div_postEdge);

    // listContainer = document.getElementById(`TODOS[${i}]`);
    console.log(listContainer.children[0].style);

    container.appendChild(listContainer);
  }
  // get Post 해준거면 local에 저장된 거 다 꺼내서 보여준거고
  // 이제 원래 맨 위에 있는 list container에서 다시 시작할테니까 여기서도 초기화 해준다.
  localIndex = localStorage.length;
}

function checkList(e) {
  // 내가 선택한 list-container를 가져온다.
  console.log(e.target);
  let checkedLC = e.target;

  if (!checkedLC.classList.contains("inEdit")) {
    // 선택된 list container가 edit중이 아닐때
    // edit 중이던 list container 다시 원 상태(터치 불가 상태)로
    InEditToDone();
  }

  // 여기서 이렇게 찾지 말고
  // 다른 방법으로 list container를 찾자
  // input Text 눌렀을 때는 무조건 checklist 타야함

  // console.log(e.target.classList); // ["list-container", value: "list-container"]
  // if (e.target.classList[0] === "list-container") {
  //   checkedLC = e.target;
  // } else if (
  //   e.target.classList[0] === "toDoList" ||
  //   e.target.classList[0] === "addForm"
  // ) {
  //   console.log(e.target);
  //   checkedLC = e.target.parentElement;
  // } else if (
  //   e.target.classList[0] === "inputText" ||
  //   e.target.classList[0] === "todo"
  // ) {
  //   console.log(e.target.parentElement.parentElement);
  //   checkedLC = e.target.parentElement.parentElement; // addForm -> list-container
  // } else if (
  //   e.target.classList[0] === "todo-item" ||
  //   e.target.classList[0] === "complete-btn" ||
  //   e.target.classList[0] === "trash-btn"
  // ) {
  //   checkedLC = e.target.parentElement.parentElement.parentElement; // btn -> list-container
  //   console.log(checkedLC);
  // } else {
  //   console.log(e.target.classList[0]);
  //   // do nothing
  //   return;
  // }

  // 클릭되면 toDoUL css속성  pointer-events: none; => auto로 바꿔주기
  // 클릭되면 수정할 수 있게 해야하니까
  // console.log(checkedLC.children); // [ul.toDoList, form.addForm, div.postEdge]
  console.log(checkedLC.children[0]);
  checkedLC.children[0].style.pointerEvents = "auto";
  console.log(checkedLC);
  // 선택한 post로 들어가서 inputText다시 달고 추가할 수 있도록 하기
  editPost(checkedLC); // getPost 한 것들만 / 디폴트로 표현되는 제일 첫번째 post it에는 적용 안해도 되잖아? 아닌가
  // 나중에 수정다하면 다시 pointerEvents none으로 바꿔주기 어디선가...
}

function editPost(checkedLC) {
  // 전에 진행하던 post edit 저장하고 로드
  console.log(checkedLC);
  // 선택한 post로 들어가서 inputText다시 달고 추가할 수 있도록 하기
  // add the form to the list container
  // 선택된 list container 안에 todoList 밑에 붙이기
  //console.log(checkedLC.children[1].className); // postEdge(form 형성 전) / addForm(form 있을 경우)
  const checked_todoUL = checkedLC.children[0];

  if (checkedLC.children.length === 1) {
    checkedLC.classList.add("inEdit"); // edit 중이라는 클래스를 추가

    // children 개수가 1일때는 아직 input form 안만든것
    // input form이 형성이 되지 않은 경우에만
    const form_todo = document.createElement("form");
    form_todo.classList.add("addForm");
    checkedLC.appendChild(form_todo); // list 하위에 todoList 다음에 붙이기

    const input_todo = document.createElement("input");
    input_todo.classList.add("inputText");
    input_todo.setAttribute("type", "text");
    input_todo.setAttribute("placeholder", "할 일");
    form_todo.appendChild(input_todo);

    const button_todo = document.createElement("button");
    button_todo.classList.add("addBtn");
    button_todo.setAttribute("type", "submit");
    form_todo.appendChild(button_todo);

    const icon_plus = document.createElement("i");
    icon_plus.classList.add("fa");
    icon_plus.classList.add("fa-plus");
    button_todo.appendChild(icon_plus);
  } else if (checkedLC.children.length === 2) {
    // input form이 형성되어 있는 경우
    // 다른 곳 (현재 list container 아닌 다른 어느 곳) 클릭했을 때 form 사라지게
  } else {
    // 사실 이 경우가 제일 처음 포스트잇을 가리키는 것임
    checkedLC.children[2].addEventListener("click", addPost);
  }

  const checked_addForm = checkedLC.children[1];
  const checked_addBtn = checked_addForm.children[1];

  // input에다 바로 갖다놓기
  checked_addForm.style.pointerEvents = "auto";
  checked_addForm.children[0].focus();

  console.log(checkedLC.children[1]); // addForm
  console.log(checkedLC.children[1].children[1]); // addBtn 맞음
  console.log(checked_addBtn);
  checked_addBtn.addEventListener("click", addTodo);
  checked_todoUL.addEventListener("click", deleteCheck);
}

function InEditToDone() {
  const LCs = document.querySelectorAll(".list-container");
  console.log(LCs);
  LCs.forEach((LC) => {
    if (LC.classList.contains("inEdit")) {
      LC.classList.remove("inEdit");
      LC.children[1].remove(); // form 지우기
      LC.children[0].style.pointerEvents = "none"; // UL list 다시 비활성화
    }
  });
}
