const { ipcRenderer } = require('electron');
const closeBtn = document.querySelector("#close");
const addValueInput = document.querySelector("#addValue");
const addNewBtn = document.querySelector("#addNew");

addNewBtn.onclick = e => {
    ipcRenderer.send("addNewData", addValueInput.value)
    addValueInput.value = ""
}
addValueInput.onkeypress = e => {
    if (e.keyCode == 13) {
        ipcRenderer.send("addNewData", addValueInput.value)
        addValueInput.value = ""
    }
}

closeBtn.onclick = e => {
    if (confirm("Are you sure?")) { ipcRenderer.send("windowClose") }
}

ipcRenderer.on("msqlData", (e, arg) => {
    for (var i = 0; i < arg.length; i++) {
        addRow(arg[i].text)
    };
})

ipcRenderer.on("addElement", (e, arg) => {
    addRow(arg)
})

function addRow(arg) {
    const table = document.createElement("div");
    document.getElementById("mainBox").appendChild(table)

    const tr = document.createElement("tr");
    tr.className = "p-2 mb-3 text-light bg-dark col-md-12 shadow card d-flex justify-content-center flex-row align-items-center"
    table.appendChild(tr);

    const th1 = document.createElement("th");
    th1.className = "m-0 w-100"
    tr.appendChild(th1);

    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "X"
    deleteBtn.className = "btn btn-sm btn-outline-danger flex-shrink-1 dropdown-toggle::after"
    th1.appendChild(deleteBtn);
    deleteBtn.onclick = e => {
        if (confirm("Are you sure to delete?")) {
            ipcRenderer.send("deleteElement", arg)
            e.target.parentNode.parentNode.remove()
        }
    }

    const th2 = document.createElement("th");
    th2.innerText = arg
    th2.className = "m-0 w-100"
    tr.appendChild(th2);
}