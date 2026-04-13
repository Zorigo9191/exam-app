
import { examData, renderSavedWlist, loadDetailView, renderDetailView} from "./detailView"; 

import {  getDataFromLocalStr, LOCAL_STORAGE_KEYS, saveDataToLocalStr,  clearinput, addStudentsToLocalStr } from "./saveToLocalStorage";


//==== RenderExamListStudents ==== StudentDataAddToExamListBtn()//

export function  StudentDataAddToExamListBtn() {
    const addToListBtn = document.getElementById("examlistBtn"); 
    if(addToListBtn){
      
        addToListBtn.onclick = () => { 
            const succes = addStudentsToLocalStr();
            if(succes) { 
                renderDetailView(); 
            }
        };
    }
}

//==== render Waitlist ==== toWlistBtn ()//

export function toWlistBtn () {
    const toWaitlistBtn = document.getElementById("towaitlistbtn");
        if(!toWaitlistBtn) return;        
   
    toWaitlistBtn.addEventListener("click", renderSavedWlist);

}


export function toStartSeiteBtn () {

    const toStartSeiteBtn = document.querySelector(".wlistcontainer__backBtn"); 
        if(!toStartSeiteBtn) return; 
    
    toStartSeiteBtn.addEventListener("click", loadDetailView);

}



//==== Dialog(Window) ==== dialogForAddToWListBtn()//


export function dialogForAddToWListBtn() {

    const dialog= document.getElementById("dialog"); 
    const dialogClose=document.getElementById("close");
    const addToWListBtn = document.getElementById("add-waitlist-btn"); 

    if(!dialog || !dialogClose || !addToWListBtn) { 
        console.warn("Dialog elements not found in DOM"); 
        return;
    }


    document.addEventListener("click", (e) => {
        if (e.target.id === "add-waitlist-btn") {
            document.getElementById("dialog")?.showModal();
        }

        if (e.target.id === "close") {
            document.getElementById("dialog")?.close();
        }
    });
 }



//==== Input for WList and saveToLocalstr ==== StudentDataAddToWListBtn() //


export function StudentDataAddToWListBtn() {
     
    const firstname = document.getElementById("dialog__firstname");
    const lastname = document.getElementById("dialog__lastname");
    const category = document.getElementById("dialog-category");
    const teacher = document.getElementById("dialog-teacher")
    const toWaitingsL = document.getElementById("submitBtn"); 

    if(!toWaitingsL) return; 

  
    toWaitingsL.addEventListener("click", ()=> {
            const inputFname = firstname.value.trim();
            const inputLname = lastname.value.trim(); 
            const inputCategory = category.value; 
            const inputTeacher = teacher.value;

            if(!inputFname || !inputLname){
                alert("bitte Namen ausfüllen!");
                return;
            }

            if (isDuplicateName(inputFname ,inputLname )) {
                alert("Der Name existiert bereits!");
                return;
            }
           
            createWListAttendees(inputFname, inputLname, inputCategory, inputTeacher);
            alert("Auf WarteListe gesetzt!");
            clearinput();

            return;
        });

}

//==== create Attendee Object for WList ==== createWListAttendee() //

function createWListAttendee(inputFname, inputLname, inputCategory, inputTeacher) {
    return {
        id: getNextFreeId(),
        WlistFirstname: inputFname,
        WlistLastname: inputLname,
        WlistCategory: inputCategory,
        WlistTeacher: inputTeacher,
        WListAddedAt: new Date().toLocaleDateString()
    };
}



function createWListAttendees(inputFname, inputLname, inputCategory, inputTeacher) {

        const StudentOnWList = createWListAttendee(
            inputFname,
            inputLname,
            inputCategory,
            inputTeacher
        ); 

        const dataFromWList = getDataFromLocalStr(LOCAL_STORAGE_KEYS.waitingsL);
            
        if(!dataFromWList.length) {
            dataFromWList.push({WListAttendees: []}); 
        }
        
        const attendeeWL = dataFromWList[0].WListAttendees;
        attendeeWL.push(StudentOnWList); 

        attendeeWL.sort((a,b)=> a.id - b.id);   
        saveDataToLocalStr(LOCAL_STORAGE_KEYS.waitingsL, dataFromWList);
        return attendeeWL;    
}


function isDuplicateName(firstname, lastname,  key = LOCAL_STORAGE_KEYS.waitingsL) {
    const savedData = getDataFromLocalStr(key)

    if(!savedData.length) return false; 

    const attendeesWList = savedData[0].WListAttendees ?? []; 

    return attendeesWList.some(student => 
            student.WlistFirstname?.toLowerCase() === firstname.toLowerCase() && 
            student.WlistLastname?.toLowerCase() === lastname.toLowerCase()
    );     
        
}


function getNextFreeId(key = LOCAL_STORAGE_KEYS.waitingsL) {
    const dataWList = getDataFromLocalStr(key);

    if(!dataWList.length) return 1; 

    const ids = dataWList[0].WListAttendees.map(student => Number(student.id)); 
    ids.sort((a,b) => a-b); 

    let nextId = 1; 
    
    for( let id of ids) {
        if(id === nextId) nextId ++; 
        else break;
    }

    return nextId;
}



//==== Date For Exam ==== dateChangeSaveBtn ()//

export function dateChangeSaveBtn () {
    
    document.querySelectorAll(".examlists__saveDateBtn").forEach(btn => {
        btn.onclick = (e) => {
            const id = e.target.dataset.id;
            const input = document.querySelector(`.examlists__box-date[data-index="${id}"]`);
            const item = examData.find(d => d.id === id); 
            
            if (!item || !input) return;

            const savedData = getDataFromLocalStr(LOCAL_STORAGE_KEYS.attendees) || [];
            const hastStudentsOnOldDate = savedData.some(student => student.date === item.value);
            const isDateChanged = input.value !== item.value; 
            
            if(isDateChanged && hastStudentsOnOldDate){
                    alert("Schüler existieren bereits für dieses Datum. Datum kann nicht geändert werden!");
                    input.value = item.value;
                    return;
            }    
            item.value = input.value; 
        

            const dateSelect = document.getElementById("dateSelect");
            if (dateSelect) {
                dateSelect.innerHTML = examData.map(i => 
                    `<option value="${i.value}"> ${i.value} </option>`
                ).join("");
            } 

            renderDetailView();
            
            setTimeout(() => {
                alert(`Datum für ${item.label} aktualisiert auf ${input.value}.`);
            }, 50);
        };
    });
}

//==== Students remove from exam list ==== removeAttendeeBtn()//

export function removeAttendeeExamLBtn(){
    const removeBtns = document.querySelectorAll(".removeAttendeeBtn");
    removeBtns.forEach(btn => {
        btn.onclick = () => {
            const studentId = btn.dataset.id;
            const date = btn.dataset.date;

            let allData = getDataFromLocalStr(LOCAL_STORAGE_KEYS.attendees); 
            const updatedData = allData.map(day => {
                if(day.date === date) {
                    day.attendees = day.attendees.filter(a => a.id !== studentId);
                    day.attendees.forEach((a, ind) => a.id = String(ind + 1)); 
                }
                return day;
            }).filter(day => day.attendees.length > 0); 

            saveDataToLocalStr(LOCAL_STORAGE_KEYS.attendees, updatedData);
            

            renderDetailView();
        };
    });     
}

