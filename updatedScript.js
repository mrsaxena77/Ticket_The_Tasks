let db;
let submitBtn = document.querySelector("button");
let title = document.querySelector("#title");
let content = document.querySelector("#content");
let select = document.querySelector("#select");
submitBtn.addEventListener("click", function () {
    if (content.value == "" || title.value == "" ) {
        alert("Enter Something");
        return;
    }
    else{
        let collectionName = select.value;
        let obj = {};
        if (collectionName == "GeneralNotes") {
            obj.gId = Date.now();
        }
        if (collectionName == "PlacementNotes"){ 
            obj.pId = Date.now();
        }
        if (collectionName == "CollegeNotes") {
            obj.cId = Date.now();
        }

        obj.title = title.value;
        obj.content = content.value;

        addNotes(collectionName, obj);
    }
})

let req = indexedDB.open("NotesDB", 2);

req.addEventListener("success", function(){
    alert("DB Openned Successful.");
    db = req.result;
});
req.addEventListener("upgradeneeded", function(){
    let res = req.result;
    res.createObjectStore("GeneralNotes", {keyPath : "gId"});
    res.createObjectStore("PlacementNotes", {keyPath : "pId"});
    res.createObjectStore("CollegeNotes", {keyPath : "cId"});
    alert("DB Upgraded/Created.")
});
req.addEventListener("error", function(){
    // alert("DB has Error.")
});

function addNotes(collectionName, obj) {
    let tx = db.transaction(collectionName, "readwrite");
    let reqObjStr = tx.objectStore(collectionName);
    reqObjStr.add(obj);
}
