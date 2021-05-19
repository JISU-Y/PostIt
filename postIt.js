const toDoForm = document.querySelector('.toDoForm')
const toDoInput = document.querySelector('.toDoInput')
const toDoSubmit = document.querySelector('.toDoSubmit')
const toDoUL = document.querySelector('.toDoList')
const addButton = document.querySelector('.addBtn') //todobutton인셈
const inputText = document.querySelector('.inputText')

const TODO_LIST = 'TO_DOs'

let toDoList = [] // to do list 배열 생성


function idReorder(toDos) {

    // 배열에서 id 바꾸고
    
    console.log(toDos)
}

function deleteToDo(event) {
    const btn = event.target
    const li = btn.parentNode
    const intIdx = toDoList.id
    toDoUL.removeChild(li)

    console.log(btn)
    console.log(li)
    console.log(intIdx)

    toDoList.splice(intIdx, 1) // splice 배열에서 (index번째 몇개)를 지운다.
    console.log(toDoList)
    //localStorage.setItem(TODO_LIST, JSON.stringify(toDoList))
    // toDoList = toDoList.map(e => {
    //     if(e.id === intIdx) {
    //         return false
    //     }
    //     return e
    // })
    //idReorder(toDoList)
    //saveToDoList()
}

function saveToDoList(toDoObj) {

    toDoList.push(toDoObj)
    // 만들어진 to do list 모두 save (local storage에)
    localStorage.setItem(TODO_LIST, JSON.stringify(toDoList))
}

function showToDoList() {
    const toDoList_LS = localStorage.getItem(TODO_LIST)
    if(toDoList_LS !== null) {
        const parsedToDoObj = JSON.parse(toDoList_LS)

        parsedToDoObj.forEach((toDo) => {
            createToDo(toDo.text)
        })
    }
}

function createToDo(text) {
    // li 생성
    const li = document.createElement('li')
    // 생성된 li 지울 삭제 버튼도 같이 생성
    const delBtn = document.createElement('button')
    delBtn.setAttribute('class','fa fa-times')
    const checkBtn = document.createElement('input')
    checkBtn.setAttribute('type','checkbox')
    // span에다가 text 넣고 생성
    const span = document.createElement('span')
    // To Do List 개수로 0부터 id 부여
    const idx = toDoList.length

    span.innerText = text
    li.appendChild(checkBtn)
    li.appendChild(span)
    li.appendChild(delBtn)

    toDoUL.appendChild(li)

    delBtn.addEventListener('click', deleteToDo)

    const toDoObj = {
        text,
        id: idx
    }

    return toDoObj
}

function tabToLower(event) {
    event.preventDefault()
}

function init() {

    showToDoList()

    addButton.addEventListener('click', () => {
        // 버튼이 눌리면 input이 생기고
        createToDo(inputText.value)
        if(inputText.value = '') {
        }
    })
    
    inputText.addEventListener('keydown', (event) => {
        
        if(event.key === 'Enter') {
            // list 생성하고
            let task = createToDo(inputText.value)
            // task obj를 배열에 넣기
            saveToDoList(task)
            // console.log(task)

            // input안에 내용은 지우기
            inputText.value = ''
        }
        if(event.key === 'Tab') {
            // 하위 항목으로 바꾸기
            tabToLower(event)
        }
    })

}

init()