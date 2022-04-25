let filters = document.querySelectorAll(".filter div");
let addbtn = document.querySelector(".action-add-btn");
let modalVisible_Flag = false;
let body = document.querySelector("body")
let grid = document.querySelector(".grid");
let uid = new ShortUniqueId();
let colors = {
    pink: "hsl(350, 100%, 88%)",
    orange: "#ffa500",
    yellow: "rgb(243, 243, 97)",
    green: "rgb(37, 189, 125)",
};

let colorClasses = ["pink", "orange", "yellow", "green"];

let deleteState = false;
let dltBtn = document.querySelector(".action-dlt-btn");

if (!localStorage.getItem("tasks")) {
    localStorage.setItem("tasks", JSON.stringify([]));
}
dltBtn.addEventListener("click", function (e) {
    if (deleteState) {
        deleteState = false;
        e.currentTarget.classList.remove("delete-state");
    }
    else {
        deleteState = true;
        e.currentTarget.classList.add("delete-state");
    }
});

addbtn.addEventListener("click", function () {
    if (modalVisible_Flag) return;

    if (dltBtn.classList.contains("delete-state")) {
        deleteState = false;
        dltBtn.classList.remove("delete-state");
    }
    let modal = document.createElement("div")
    modal.classList.add("modal-container");
    modal.setAttribute("click-first", true);
    modal.innerHTML = `<div class="writing-area" contenteditable> Enter Task Here !</div> 
    <div class="filter-area">
        <div class="modal-filter pink active-modal-filter"></div>
        <div class="modal-filter orange"></div>
        <div class="modal-filter yellow"></div>
        <div class="modal-filter green"></div>
    </div>`;

    let allModalFilters = modal.querySelectorAll(".modal-filter")
    for (let i = 0; i < allModalFilters.length; i++) {
        allModalFilters[i].addEventListener("click", function allModalFiltersHandler(e) {
            for (let j = 0; j < allModalFilters.length; j++) {
                allModalFilters[j].classList.remove("active-modal-filter");
            }
            e.currentTarget.classList.add("active-modal-filter");
        });
    }

    let writing_area = modal.querySelector(".writing-area");
    writing_area.addEventListener("click", function (e) {
        if (modal.getAttribute("click-first") == "true") {
            writing_area.innerHTML = ""
            modal.setAttribute("click-first", false)
        }
    });
    writing_area.addEventListener("keypress", function (e) {
        if (e.key == "Enter") {
            let task = e.currentTarget.innerText;
            let selectedModalFilter = document.querySelector(".active-modal-filter");
            let color = selectedModalFilter.classList[1];
            // let colorCode = colors[color];
            let ticket = document.createElement("div");
            let id = uid();
            ticket.classList.add("tickets");
            ticket.innerHTML = `<div class="ticket-color ${color}"></div>
            <div class="ticket-id">#${id}</div>
            <div class="ticket-text-area" contenteditable>
            ${task}
            </div>`;

            saveTicketInLocalStorage(id, color, task);

            let ticketWritingArea = ticket.querySelector(".ticket-text-area");
            ticketWritingArea.addEventListener("input", ticketWritingAreaHandler);

            ticket.addEventListener("click", function (e) {
                if (deleteState) {
                    let id = e.currentTarget.querySelector(".ticket-id").innerText.split("#")[1];
                    let tasksArr = JSON.parse(localStorage.getItem("tasks"));

                    tasksArr = tasksArr.filter(function (el) {
                        return el.id != id;
                    });
                    localStorage.setItem("tasks", JSON.stringify(tasksArr));
                    e.currentTarget.remove();
                }
            });

            let ticketColorDiv = ticket.querySelector(".ticket-color");
            ticketColorDiv.addEventListener("click", ticketColorHandler);

            grid.appendChild(ticket);
            modal.remove();
            modalVisible_Flag = false;

        }
    });

    body.appendChild(modal);
    modalVisible_Flag = true;
})

for (let i = 0; i < filters.length; i++) {
    filters[i].addEventListener("click", function (e) {

        if (e.currentTarget.parentElement.classList.contains("selectedFilter")) {
            e.currentTarget.parentElement.classList.remove("selectedFilter");
            loadTasks();
        }
        else {
            let color = e.currentTarget.classList[0].split("-")[0];
            e.currentTarget.parentElement.classList.add("selectedFilter");
            console.log(color);
            loadTasks(color);
        }

    });
}

function saveTicketInLocalStorage(id, color, task) {
    let requiredObj = { id, color, task };
    let tasksArr = JSON.parse(localStorage.getItem("tasks"));
    tasksArr.push(requiredObj);
    localStorage.setItem("tasks", JSON.stringify(tasksArr));
}



function ticketColorHandler(e) {
    let id = e.currentTarget.parentElement.querySelector(".ticket-id").innerText.split("#")[1];
    let tasksArr = JSON.parse(localStorage.getItem("tasks"));
    let reqIndex = -1;
    for (let i = 0; i < tasksArr.length; i++) {
        if (tasksArr[i].id == id) {
            reqIndex = i;
            break;
        }
    }
    let currentColor = e.currentTarget.classList[1];
    let index = colorClasses.indexOf(currentColor);
    index++;
    index = index % 4;
    e.currentTarget.classList.remove(currentColor);
    e.currentTarget.classList.add(colorClasses[index]);
    tasksArr[reqIndex].color = colorClasses[index];
    localStorage.setItem("tasks", JSON.stringify(tasksArr));
}


function ticketWritingAreaHandler(e) {
    let id = e.currentTarget.parentElement.querySelector(".ticket-id").innerText.split("#")[1];
    let tasksArr = JSON.parse(localStorage.getItem("tasks"));
    let reqIndex = -1;
    for (let i = 0; i < tasksArr.length; i++) {
        if (tasksArr[i].id == id) {
            reqIndex = i;
            break;
        }
    }
    tasksArr[reqIndex].task = e.currentTarget.innerText;
    localStorage.setItem("tasks", JSON.stringify(tasksArr));
}


function loadTasks(passedColor) {

    let allTickets = document.querySelectorAll(".tickets");
    for (let t = 0; t < allTickets.length; t++) allTickets[t].remove();

    let tasks = JSON.parse(localStorage.getItem("tasks"));
    for (let i = 0; i < tasks.length; i++) {
        let id = tasks[i].id;
        let color = tasks[i].color;
        let taskValue = tasks[i].task;

        if (passedColor) {
            if (passedColor != color) continue;
        }

        let ticket = document.createElement("div");
        ticket.classList.add("tickets");
        ticket.innerHTML = `<div class="ticket-color ${color}"></div>
            <div class="ticket-id">#${id}</div>
            <div class="ticket-text-area" contenteditable>
            ${taskValue}
            </div>`;

        let ticketWritingArea = ticket.querySelector(".ticket-text-area");
        ticketWritingArea.addEventListener("input", ticketWritingAreaHandler);

        let ticketColorDiv = ticket.querySelector(".ticket-color");
        ticketColorDiv.addEventListener("click", ticketColorHandler);

        ticket.addEventListener("click", function (e) {
            if (deleteState) {
                let id = e.currentTarget.querySelector(".ticket-id").innerText.split("#")[1];
                let tasksArr = JSON.parse(localStorage.getItem("tasks"));

                tasksArr = tasksArr.filter(function (el) {
                    return el.id != id;
                });
                localStorage.setItem("tasks", JSON.stringify(tasksArr));
                e.currentTarget.remove();
            }
        });

        grid.appendChild(ticket);
    }
}

loadTasks();
