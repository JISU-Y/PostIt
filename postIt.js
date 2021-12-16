const toDoForm = document.querySelector(".toDoForm")
const addForm = document.querySelector(".addForm")
const toDoInput = document.querySelector(".toDoInput")
const toDoSubmit = document.querySelector(".toDoSubmit")
const toDoUL = document.querySelector(".toDoList")
const addButton = document.querySelector(".addBtn") //todobutton인셈
const inputText = document.querySelector(".inputText")
const container = document.querySelector(".container")
const postEdge = document.querySelector(".postEdge") // 이버튼안에 추가기능, 편집 기능 등등

let TODOS = []
let localIndex = localStorage.length // 0으로 초기화 할 게 아니라 지금 local에 저장되어 있는 배열에 따라 달라지자나

document.addEventListener("DOMContentLoaded", getPost)
container.addEventListener("click", (e) => {
  if (e.target.classList[0] === "list-container") {
    // 그냥 list container를 클릭했을 때만 check list 하도록
    checkList(e)
  } else if (e.target.classList[0] === "container") {
    InEditToDone()
  }
}) // 어느 postit이 체크되었나 확인
//inputText.addEventListener("click", checkList); // 전체 postit 선택하는거 이외에도 input 눌렀을 때도 체크하자

// todos[] 이거마다 저장하는거 먼저
// 흠 이거는 그러면은 todos[]를 선택했을 때 해야하는거 index를 설정해주어야 하는거 아닌가.?
// 아마 post Edge 누르는 순간..?

function addTodo(event) {
  event.preventDefault()

  // 선택된 list-container
  let checked_idx = parseInt(event.path[2].id[6]) // id에서 숫자만
  let checked_LC = document.getElementById(`TODOS[${checked_idx}]`)
  if (checked_LC == null) {
    checked_LC = document.querySelector(".list-container") // 가장 맨 처음에 있는 list Container 이거는 할당된 id가 없으니까
    checked_idx = localIndex
  }
  const checked_todoUL = checked_LC.children[0]
  const checked_form = checked_LC.children[1]
  const checked_inputText = checked_form.children[0]

  // 띄어쓰기 자르기
  newInputText = checked_inputText.value.trim()

  if (newInputText === "") {
    alert("empty value")
  } else {
    // todo div
    const todoDiv = document.createElement("div")
    todoDiv.classList.add("todo")

    // check mark btn
    const completedButton = document.createElement("button")
    completedButton.innerHTML = '<i class="fas fa-check"></i>' // 이렇게 innerHTML로 icon 바로 넣어줘도 된다.
    completedButton.classList.add("complete-btn")
    todoDiv.appendChild(completedButton)

    // li
    const newTodo = document.createElement("li")
    newTodo.innerText = newInputText
    newTodo.classList.add("todo-item")
    todoDiv.appendChild(newTodo)

    // add todo to local Storage
    saveLocalTodos(newInputText, checked_idx)

    // del btn
    const trashButton = document.createElement("button")
    trashButton.innerHTML = '<i class="fas fa-trash"></i>'
    trashButton.classList.add("trash-btn")
    todoDiv.appendChild(trashButton)

    // append to list
    checked_todoUL.appendChild(todoDiv)
  }
  // clear todo input value
  checked_inputText.value = ""
}

function deleteCheck(e) {
  const item = e.target // 선택된 요소를 저장
  //delete todo
  if (item.classList[0] === "trash-btn") {
    // li가 될수도 있고 complete-btn이 될 수도 있다.
    const todo = item.parentElement // todo는 li,btn2개를 포함하는 div
    const checked_LC = todo.parentElement.parentElement
    const checked_idx = parseInt(checked_LC.id[6])

    removeLocalTodos(todo, checked_idx)
    // 바로 지우면 class list 추가되도 그냥 지워짐
    todo.remove()
  }

  // check
  if (item.classList[0] === "complete-btn") {
    const todo = item.parentElement
    const checked_LC = todo.parentElement.parentElement
    const checked_idx = parseInt(checked_LC.id[6])

    completeTodos(todo, checked_idx)

    todo.classList.toggle("completed")

    // 갱신
    addPost()
  }
}

function saveLocalTodos(todo, index) {
  let todos = [[], []] // 0은 todo list / 1은 그 중에 completed 된 애

  if (localStorage.getItem(`TODOS[${index}]`) === null) {
    // local storage 배열이 비어있으면
    // 새로운 배열에다가 빈 배열 할당
    todos = [[], []]
  } else {
    // 원래 있으면
    // todos에다가 localstorage 배열 넣고
    // 0번째는 todo / 1이 completed
    todos = JSON.parse(localStorage.getItem(`TODOS[${index}]`))
  }

  // 그 배열 안의 배열[0]에다가 인자로 받은 todo item을 넣는다.
  todos[0].push(todo)
  // 그러고 다시 local에다가 저장
  localStorage.setItem(`TODOS[${index}]`, JSON.stringify(todos))
}

function removeLocalTodos(todo, index) {
  let todos = [[], []]

  if (localStorage.getItem(`TODOS[${index}]`) === null) {
    // local storage 배열이 비어있으면
    // 새로운 배열에다가 빈 배열 할당
    todos = [[], []]
  } else {
    // 원래 있으면
    // todos에다가 localstorage 배열 넣고
    todos = JSON.parse(localStorage.getItem(`TODOS[${index}]`))
  }

  // 그래서 children의 0번쨰 요소 li를 찾고 싶음
  const todoIdxText = todo.children[1].innerText

  if (todo.parentElement.classList[0] === "toDoList") {
    todos[0].splice(todos[0].indexOf(todoIdxText), 1)
  } else {
    todos[1].splice(todos[1].indexOf(todoIdxText), 1)
  }

  if (todos[0].length === 0 && todos[1].length === 0) {
    // 지웠는데 빈 배열이면
    // localStorage.removeItem(`TODOS[${index}]`); // 그냥 key를 지워버림
    // splice가 안됨..ㅠㅠ

    for (let i = index; i <= localStorage.length - 1; i++) {
      //nexttodos에 지워지는 배열 다음 거를 담는다.
      nextTodos = JSON.parse(localStorage.getItem(`TODOS[${i + 1}]`))
      localStorage.setItem(`TODOS[${i}]`, JSON.stringify(nextTodos))
    }
    // 하나씩 다 밀렸으니 마지막거를 지움
    localStorage.removeItem(`TODOS[${localStorage.length - 1}]`)

    // 누르자마자 post들 다시 꺼내오기
    addPost()
  } else {
    localStorage.setItem(`TODOS[${index}]`, JSON.stringify(todos))
  }
}

function addPost() {
  // localIndex++; // local에 저장하는 index 1 증가 (다른 배열에 저장 시작하겠다는 뜻)

  // 새로운 포스트잇이 맨 처음에 있어야 하니까
  // 작성 완료한 포스트있은 오른쪽 아래 버튼 누르면 오른쪽으로 붙게끔
  // 먼저 container 클리어
  container.innerHTML = ""

  //div container에 추가
  //<div class="list-container mother">
  //    <ul class="toDoList"></ul>
  //    <form class="addForm">
  //        <input type="text" class="inputText" placeholder="할 일">
  //        <button class="addBtn" type="submit"><i class="fa fa-plus"></i></button>
  //    </form>
  //    <ul class="completedList"></ul>
  //    <div class="postEdge"></div>
  //</div>
  // 항시 맨 앞에 있는 list container는 기준이 되어야 함
  const listContainer = document.createElement("div")
  listContainer.classList.add("list-container")
  listContainer.classList.add("mother")

  const ul_todo = document.createElement("ul")
  ul_todo.classList.add("toDoList")
  listContainer.appendChild(ul_todo)

  const form_todo = document.createElement("form")
  form_todo.classList.add("addForm")
  listContainer.appendChild(form_todo)

  const input_todo = document.createElement("input")
  input_todo.classList.add("inputText")
  input_todo.setAttribute("type", "text")
  input_todo.setAttribute("placeholder", "할 일")
  form_todo.appendChild(input_todo)

  const button_todo = document.createElement("button")
  button_todo.classList.add("addBtn")
  button_todo.setAttribute("type", "submit")
  form_todo.appendChild(button_todo)

  const icon_plus = document.createElement("i")
  icon_plus.classList.add("fa")
  icon_plus.classList.add("fa-plus")
  button_todo.appendChild(icon_plus)

  const ul_completed = document.createElement("ul")
  ul_completed.classList.add("completedList")
  listContainer.appendChild(ul_completed)

  const div_postEdge = document.createElement("div")
  div_postEdge.classList.add("postEdge")
  listContainer.appendChild(div_postEdge)

  container.appendChild(listContainer)

  // local에 저장되어 있던 애들 가져와서 화면에 추가
  getPost()
}

function getPost() {
  let posts = []

  if (localStorage.length === 0) {
    // local 저장소에 아무것도 없으면
    // 그냥 빈 포스트잇 추가
    posts = []
  } else {
    // 있으면 local에 저장한게 todos[i]니까 모든 index에 있는거 가져와서
    let i
    for (i = 0; i < localStorage.length; i++) {
      posts[i] = JSON.parse(localStorage.getItem(`TODOS[${i}]`))
    }
  }

  for (i = 0; i < localStorage.length; i++) {
    const listContainer = document.createElement("div")
    listContainer.classList.add("list-container")
    listContainer.id = `TODOS[${i}]` // listContainer 클래스에 각 배열의 이름을 id로 넣어준다.

    const ul_todo = document.createElement("ul")
    ul_todo.classList.add("toDoList")

    // 가져온 posts[i]에서 [0]만 뿌려주면 되니까 일단은
    // complete된거는 좀 나중에
    posts[i][0].forEach(function (todo) {
      // todo div
      const todoDiv = document.createElement("div")
      todoDiv.classList.add("todo")

      // check mark btn
      const completedButton = document.createElement("button")
      completedButton.innerHTML = '<i class="fas fa-check"></i>' // 이렇게 innerHTML로 icon 바로 넣어줘도 된다.
      completedButton.classList.add("complete-btn")
      todoDiv.appendChild(completedButton)

      // li
      const newTodo = document.createElement("li")
      newTodo.innerText = todo
      newTodo.classList.add("todo-item")
      todoDiv.appendChild(newTodo)

      // del btn
      const trashButton = document.createElement("button")
      trashButton.innerHTML = '<i class="fas fa-trash"></i>'
      trashButton.classList.add("trash-btn")
      todoDiv.appendChild(trashButton)

      // append to list
      ul_todo.appendChild(todoDiv)
    })

    listContainer.appendChild(ul_todo)

    // completed 된거
    const ul_todo_completed = document.createElement("ul")
    ul_todo_completed.classList.add("completedList")

    posts[i][1].forEach(function (todo) {
      // todo div
      const todoDiv = document.createElement("div")
      todoDiv.classList.add("todo")

      // check mark btn
      const completedButton = document.createElement("button")
      completedButton.innerHTML = '<i class="fas fa-check"></i>' // 이렇게 innerHTML로 icon 바로 넣어줘도 된다.
      completedButton.classList.add("complete-btn")
      todoDiv.appendChild(completedButton)

      // li
      const newTodo = document.createElement("li")
      newTodo.innerText = todo
      newTodo.classList.add("todo-item")
      todoDiv.appendChild(newTodo)

      // del btn
      const trashButton = document.createElement("button")
      trashButton.innerHTML = '<i class="fas fa-trash"></i>'
      trashButton.classList.add("trash-btn")
      todoDiv.appendChild(trashButton)

      // append to list
      ul_todo_completed.appendChild(todoDiv)
    })

    listContainer.appendChild(ul_todo_completed)

    // edge 생성 안하기
    // const div_postEdge = document.createElement("div");
    // div_postEdge.classList.add("postEdge");
    // listContainer.appendChild(div_postEdge);

    container.appendChild(listContainer)
  }
  // get Post 해준거면 local에 저장된 거 다 꺼내서 보여준거고
  // 이제 원래 맨 위에 있는 list container에서 다시 시작할테니까 여기서도 초기화 해준다.
  localIndex = localStorage.length
}

function checkList(e) {
  // 내가 선택한 list-container를 가져온다.
  let checkedLC = e.target

  if (!checkedLC.classList.contains("inEdit")) {
    // 선택된 list container가 edit중이 아닐때
    // edit 중이던 list container 다시 원 상태(터치 불가 상태)로
    InEditToDone()
  }

  // 클릭되면 toDoUL css속성  pointer-events: none; => auto로 바꿔주기
  // 클릭되면 수정할 수 있게 해야하니까
  checkedLC.children[0].style.pointerEvents = "auto"
  checkedLC.children[1].style.pointerEvents = "auto"

  // 마우스 오른쪽 클릭 했을 때 색 바꾸기 이건 진짜 list container만 눌러야함
  checkedLC.addEventListener("contextmenu", changeContainerColor)

  // 선택한 post로 들어가서 inputText다시 달고 추가할 수 있도록 하기
  editPost(checkedLC) // getPost 한 것들만 / 디폴트로 표현되는 제일 첫번째 post it에는 적용 안해도 되잖아? 아닌가
  // 나중에 수정다하면 다시 pointerEvents none으로 바꿔주기 어디선가...
}

function editPost(checkedLC) {
  // 선택한 post로 들어가서 inputText다시 달고 추가할 수 있도록 하기
  // add the form to the list container
  // 선택된 list container 안에 todoList 밑에 붙이기
  const checked_todoUL = checkedLC.children[0]
  const checked_completedUL = checkedLC.children[1]

  // addForm이 없을 경우에만
  if (checkedLC.children[1].classList[0] !== "addForm") {
    checkedLC.classList.add("inEdit") // edit 중이라는 클래스를 추가

    // children 개수가 1일때는 아직 input form 안만든것
    // input form이 형성이 되지 않은 경우에만
    const form_todo = document.createElement("form")
    form_todo.classList.add("addForm")
    checked_todoUL.after(form_todo) // ul 밑에 갖다가 붙인다.
    // checkedLC.appendChild(form_todo); // list 하위에 todoList 다음에 붙이기

    const input_todo = document.createElement("input")
    input_todo.classList.add("inputText")
    input_todo.setAttribute("type", "text")
    input_todo.setAttribute("placeholder", "할 일")
    form_todo.appendChild(input_todo)

    const button_todo = document.createElement("button")
    button_todo.classList.add("addBtn")
    button_todo.setAttribute("type", "submit")
    form_todo.appendChild(button_todo)

    const icon_plus = document.createElement("i")
    icon_plus.classList.add("fa")
    icon_plus.classList.add("fa-plus")
    button_todo.appendChild(icon_plus)
  }

  const checked_addForm = checkedLC.children[1]
  const checked_addBtn = checked_addForm.children[1]

  // input에다 바로 갖다놓기
  checked_addForm.style.pointerEvents = "auto"
  checked_addForm.children[0].focus()

  checked_addBtn.addEventListener("click", addTodo)
  checked_todoUL.addEventListener("click", deleteCheck)
  checked_completedUL.addEventListener("click", deleteCheck)
  if (checkedLC.classList.contains("mother")) {
    // 사실 이 경우가 제일 처음 포스트잇을 가리키는 것임
    checkedLC.children[3].addEventListener("click", addPost) // 나중에 이거 누르면 드래그 앤 드롭으로 홀드 되게
  }
}

function InEditToDone() {
  const LCs = document.querySelectorAll(".list-container")

  LCs.forEach((LC) => {
    if (LC.classList.contains("inEdit")) {
      LC.classList.remove("inEdit")
      LC.children[1].remove() // form 지우기
      LC.children[0].style.pointerEvents = "none" // UL list 다시 비활성화
      LC.children[1].style.pointerEvents = "none" // UL list 다시 비활성화
    }
  })
}

function completeTodos(todo, index) {
  let todos = [[], []]

  if (localStorage.getItem(`TODOS[${index}]`) === null) {
    todos = [[], []]
  } else {
    todos = JSON.parse(localStorage.getItem(`TODOS[${index}]`))
  }

  // 이미 위에서 삭제할려는 list container선택해줬으니까
  // 배열 하나만 갖고 온거임
  const todoIdxText = todo.children[1].innerText

  if (todo.parentElement.classList[0] === "completedList") {
    // completed 였다가 방금 눌러서 다시 uncomplete하려고 했을 때
    todos[1].splice(todos[1].indexOf(todoIdxText), 1)

    todos[0].push(todoIdxText)
  } else {
    // completed 아니었다가 방금 눌러서 complete하려고 했을 때
    todos[0].splice(todos[0].indexOf(todoIdxText), 1)

    todos[1].push(todoIdxText)
  }

  localStorage.setItem(`TODOS[${index}]`, JSON.stringify(todos))
}

function changeContainerColor(e) {
  e.preventDefault()

  if (e.target.classList[0] === "list-container") {
    // 선택한 것이 list-container일 때
    const checked_LC = e.target
    // color input clear
    if (checked_LC.children.length >= 5) {
      //input이 추가되었던 것이면
      checked_LC.children[4].remove()
    }

    // checked_LC.style.backgroundColor = "#f58634";
    // checked_LC.children[3].style.borderLeft = "24px solid #da7731";

    // <!-- use inputs so users can set colors with text -->
    // <input class="color-input" value="#F80" />
    // <!-- anchors can be buttons -->
    // <button class="color-button">Select color</button>
    // <!-- anchors can be any element -->
    // <span class="current-color">Current color</span>
    const color_input = document.createElement("input")
    color_input.classList.add("color-input")
    // color_input.value = `${checked_LC.style.backgroundColor}`;
    const color_button = document.createElement("button")
    color_button.classList.add("color-button")
    color_button.style.height = "20px"

    checked_LC.appendChild(color_input)
    checked_LC.appendChild(color_button)

    color_button.addEventListener("click", () => {
      console.log(color_input.value)
      checked_LC.style.backgroundColor = color_input.value
      color_input.remove()
      color_button.remove()
    })

    var hueb = new Huebee(".color-input", {
      // options
      notation: "hex",
      saturations: 1,
      customColors: ["#C25", "#E62", "#EA0", "#19F", "#333"],
    })

    hueb.open()
  }
}

// 0: "구글 킵 처럼 클릭해서 하위 항목으로 만들기"
// 1: "css 꾸미기"
// 2: "add post하고 바로 밑에다가 붙이지 말고, hold 하고 있다가 원하는 곳에 붙이기"
// 3: "포스트잇 색 바꾸기 추가"
// 4: "포스트잇 전체 삭제 만들기"
// 5: "inEdit 클래스 css 효과 추가"
// 6: "색 바꾸기 되었긴 한데 그 list container의 색을 어떻게 저장할 것임?"
// 7: "mother postIt에서 색 바꾸고 addPost하면 어떻게 그 색을 전달할 것?"
