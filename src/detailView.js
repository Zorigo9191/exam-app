
import { dateChangeSaveBtn , dialogForAddToWListBtn,  StudentDataAddToExamListBtn, StudentDataAddToWListBtn,  toWlistBtn, toStartSeiteBtn, removeAttendeeExamLBtn  } from "./buttons";
import { rootElement } from "./main"
import {  getDataFromLocalStr, LOCAL_STORAGE_KEYS, saveDataToLocalStr } from "./saveToLocalStorage";


export const categories = ["B", "B78", "B197", "A", "A1", "A2"];
export const teachers = ["Thomas", "Michael", "Luka", "Christina", "Zori"];
export let examData = [
    { 
        label: "Datum 1", 
        value: "2026-03-25", 
        id: "list1",
        times: ["08:00","08:55","09:50","10:45","11:40","12:35","14:00","14:55"]
      
    },
    { 
        label: "Datum 2", 
        value: "2026-03-29", 
        id: "list2",
        times: ["08:00","08:55","09:50","10:45","11:40","12:35","14:00","14:55"]
    
       
    },
    { 
        label: "Datum 3", 
        value: "2026-04-25", 
        id: "list3",
        times: ["08:00","08:55","09:50","10:45","11:40","12:35","14:00","14:55"]
      
    }
];


export function loadDetailView() { 
    RenderAfterNewStart();
    renderDetailView();

  
  
}


export function renderDetailView() {
     
     const wrapper = document.querySelector(".examlists__wrapper");
     const scrollPos = wrapper ? wrapper.scrollLeft : 0;

  

 rootElement.innerHTML = `
      
        ${renderInputsForExamList()}
        ${renderExamOptions()}
        ${renderWListDialog()}
    `; 

        initDetailViewEvents();

    const newWrapper = document.querySelector(".examlists__wrapper");
    if (newWrapper) newWrapper.scrollLeft = scrollPos;
      
};
  
function initDetailViewEvents () {
        dateChangeSaveBtn();
        StudentDataAddToExamListBtn();
        dialogForAddToWListBtn();
        toWlistBtn();
        StudentDataAddToWListBtn();
        removeAttendeeExamLBtn();
       
 }
    


 function renderInputsForExamList() { 

    return `
          
        <section class="student-add">
            <div class="student-add__towaitlistbtn" id="towaitlistbtn">
                <button>Zur WarteListe </button>   
            </div> 
                <div class="student-add__names">
                    <div class="student-add__field">
                        <label for="firstName">Vorname</label>
                        <input type="text" id="firstName" class="student-add__input" placeholder="Vorname eingeben">
                    </div>

                    <div class="student-add__field">
                        <label for="lastName">Nachname</label>
                        <input type="text" id="lastName" class="student-add__input" placeholder="Nachname eingeben">
                    </div>
                </div>

                <div class="student-add__date-times">

                    <div class="student-add__field">
                        <label for="dateSelect">Datum</label>
                        <select id="dateSelect" class="student-add__input">
                            ${examData.map(item=> `<option value="${item.value}"> ${item.value} </option>`).join("")}
                        </select>
                    </div>

                    <div class="student-add__field">
                        <label for="time">Uhrzeit</label>
                        <select id="time" class="student-add__input">
                            ${examData[0].times.map(time=> `<option value="${time}"> ${time} </option> `).join("")}
                        </select>
                    </div>

                    <div class="student-add__field">
                        <label for="category">Kategorie</label>
                        <select id="category" class="student-add__input">
                            ${categories.map(cat=> `<option value="${cat}">${cat}</option>`).join("")}
                        </select>
                    </div>
                </div>

                <div class="student-add__buttons">
                    <button type="button" class="student-add__btn student-add__btn--green" id="examlistBtn">
                        Zur Prüfungsliste hinzufügen
                    </button>

                    <button type="button" class="student-add__btn student-add__btn--yellow" id="add-waitlist-btn">
                        Zur Warteliste hinzufügen
                    </button>
                </div>

        </section>
            
    `;
}  


 function renderExamOptions() {
     
       return `

       <section class="examlists">

            <h3 class="examlists__title">Prüfungstermine</h3>

                <div class="examlists__wrapper">
                    ${examData.map((item) =>`

                    <div class="examlists__box">
                        <h4 class="examlists__box-title">
                            ${item.label}:

                            <input 
                                type="date" 
                                class="examlists__box-date" 
                                data-index="${item.id}" 
                                value="${item.value}"
                                >

                            <button 
                                class="examlists__saveDateBtn" 
                                data-id="${item.id}">
                                Datum speichern
                            </button>
                        </h4>
                    
                
                    <ul id="${item.id}">
                       ${renderTimeSlots(item.value,item.times)}
                    </ul>

                </div>
            `).join("")}
        </div>

    </section>
    
`;}   

 function renderTimeSlots( date, time) {
        const savedData = getDataFromLocalStr(LOCAL_STORAGE_KEYS.attendees);
        const dayEntry = savedData.find(d => d.date === date);
        const attendees = dayEntry ? dayEntry.attendees : [];
        return time.map(t=> {
            const slotStudents = attendees.filter(a => a.time === t);
            const attendeesHtml = slotStudents.map(a => `
                <li class="attendee-item" data-id="${a.id}" >
                    ${a.fullName} (${a.category}) 
                    <button class="removeAttendeeBtn" data-id="${a.id}" data-time="${t}" data-date="${date}"> Löschen</button>
                </li>
        `).join(""); 
        
       
        return `<li class="time-slot" data-date="${date}" data-time="${t}">
                    <div class="slot-header"> <strong>${t} Uhr</strong> </div>
                    <ul class="attendees-list">
                       ${attendeesHtml}
                    </ul>
                </li>`;
        }).join("");
       
       
    }  

 function renderWListDialog() {

        return `

        <dialog id="dialog" class="dialog">
            <form method="dialog" class="dialogform">
               
                <button type="button" id="close" class="dialogform__close">×</button>
                    
                <h3 class="dialogform__title"> Warteliste </h3>

                <label >Vorname:</label>
                <input type="text" class="dialogform__firstname" id="dialog__firstname" required>

                <label>Nachname:</label>
                <input type="text" class="dialogform__lastname" id="dialog__lastname" required>
                
                <label>Kategorie:</label>
                <select id="dialog-category" class="dialogform__category">
                        ${categories.map(cat=> `<option value="${cat}">${cat}</option>`).join("")}
                </select>  

                <label>Fahrlehrer:</label>
                <select id="dialog-teacher" class="dialogform__teacher">
                        ${teachers.map(te=> `<option value="${te}">${te}</option>`).join("")}
                </select>  

                <div class="dialogform__actions">
                    <button class="dialogform__submit-btn" id="submitBtn" value="ok"> zur Warteliste hinzufügen</button>
                </div>
            </form>
        </dialog>


        `;   
    }


export function renderSavedWlist () {

    const savedWlist = getDataFromLocalStr(LOCAL_STORAGE_KEYS.waitingsL); 

    if (!Array.isArray(savedWlist)) return;

    rootElement.innerHTML = "";

    const divContainer = document.createElement("div"); 
    divContainer.classList.add("wlistcontainer"); 
    
    const backBtn = document.createElement("button"); 
    backBtn.classList.add("wlistcontainer__backBtn")
    backBtn.textContent = "Zurück zur Startseite"; 
    
      
 
    savedWlist.forEach(entry => {

        if (!Array.isArray(entry.WListAttendees)) return;

        entry.WListAttendees.forEach(student => {

         
          

            const itemDiv = document.createElement("div"); 
            itemDiv.classList.add("wlistcontainer__item");

            
            const nameP = document.createElement("p"); 
            nameP.classList.add("wlistcontainer__name")
            nameP.textContent = `${student.WlistFirstname} - ${student.WlistLastname}`;

            
            const teacherP = document.createElement("p"); 
            teacherP.classList.add("wlistcontainer__teacher")
            teacherP.textContent =  `FL :` + student.WlistTeacher ;


            const categoryP = document.createElement("p"); 
            categoryP.classList.add("wlistcontainer__category")
            categoryP.textContent = `Fs-klasse :` + student.WlistCategory;

            const dateP = document.createElement("p"); 
            dateP.classList.add("wlistcontainer__date");
            dateP.textContent = `am: ` + student.WListAddedAt + ` eingetragen`;


            const removeBtn = document.createElement("button"); 
            removeBtn.classList.add("wlistcontainer__removeBtn");
            removeBtn.textContent = "Löschen"; 
            removeBtn.dataset.id = student.id;

            removeBtn.addEventListener("click", (e) => {

            const studentId = e.currentTarget.dataset.id;

            const allWListData = getDataFromLocalStr(LOCAL_STORAGE_KEYS.waitingsL);

            const updateWList = allWListData.map(entry => {

                entry.WListAttendees = entry.WListAttendees
                    .filter(s => s.id !== studentId)
                    .map((s, idx) => ({ ...s, id: String(idx + 1) }));

                return entry;

            }).filter(entry => entry.WListAttendees.length > 0);

            saveDataToLocalStr(LOCAL_STORAGE_KEYS.waitingsL, updateWList);

            renderSavedWlist();
        });

            itemDiv.append( nameP, categoryP, teacherP,dateP, removeBtn);
            divContainer.appendChild(itemDiv);
        });
    });
    rootElement.appendChild(backBtn);   
    rootElement.appendChild(divContainer);
  
    toStartSeiteBtn();
}   
 




 function RenderAfterNewStart (){

        const savedDataExamList = getDataFromLocalStr(LOCAL_STORAGE_KEYS.attendees); 
        const savedDataWaitList = getDataFromLocalStr(LOCAL_STORAGE_KEYS.waitingsL); 
        
        if(!Array.isArray(savedDataExamList) || !Array.isArray(savedDataWaitList)) {
        return;  

    } 
  
 }
