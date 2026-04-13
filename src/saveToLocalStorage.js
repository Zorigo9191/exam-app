

export const LOCAL_STORAGE_KEYS = {
    attendees : "ExamData", 
    waitingsL : "WaitLists"
}

//==== Lcl_Storage ====//

export function getDataFromLocalStr(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

export function saveDataToLocalStr(key, data) {
    localStorage.setItem(key, JSON.stringify(data));

}

//==== Inputs ====//

export function getInputFelds() { 
    const fname = document.getElementById("firstName").value.trim() || "";
    const lname = document.getElementById("lastName").value.trim() ||"";
    let fullName = `${fname} ${lname}`.trim();
    const selectedDate = document.getElementById("dateSelect").value ||"";
    const time = document.getElementById("time").value;
    let selectedCategory = document.getElementById("category").value ||"";
    
    return {
        fname,
        lname,
        fullName,
        selectedDate,
        time,
        selectedCategory
    };

}

// ==== Validations ==== //


export function validateStudentData(fullName, selectedDate, time, selectedCategory) {

    if (!fullName || !selectedDate || !time || !selectedCategory) {
        alert("Bitte alle Felder ausfüllen!");
        return false;
    }

    const nameRegex = /^[a-zA-ZäöüÄÖÜß\s-]+$/;
    if (!nameRegex.test(fullName)) {
        alert("Der Name enthält ungültige Zeichen oder nicht vollständig!");
        return false;
    }

    return true;
    
}


// ==== Is_Duplicate ? ==== //

function isDuplicateName(fullName, key = LOCAL_STORAGE_KEYS.attendees) {
    const savedData = getDataFromLocalStr(key)

    for (const day of savedData) {
        if (day.attendees.some(attendee => attendee.fullName === fullName)) {
            return true;
        }
    }
    return false;
}

function isDuplicateDateAndTime(selectedDate, selectedTime, key = LOCAL_STORAGE_KEYS.attendees){
      const savedData = getDataFromLocalStr(key);

      const dayEntry = savedData.find(s => s.date === selectedDate);

      const isTaken = dayEntry
            ? dayEntry.attendees.some (t => t.time === selectedTime) 
            :false; 
      
      if(isTaken) {
         alert("Die Uhrzeit ist schon belegt");
         return true;
      }
      return false;
}

// ==== create_Objekts ==== //

export function createAttendee(fullName, selectedDate, time, selectedCategory, key = LOCAL_STORAGE_KEYS.attendees) {
    
    const savedData = getDataFromLocalStr(key);
    const dateEntry = savedData.find (d => d.date === selectedDate); 
    const nextId = dateEntry ? String(dateEntry.attendees.length + 1) : "1";


    return {
        id: nextId,
        fullName,
        selectedDate,
        time,
        category: selectedCategory
    };
}

// ==== students_get_Id ==== //

export function updateIds(key = LOCAL_STORAGE_KEYS.attendees) {
    const allData = getDataFromLocalStr(key);
    allData.forEach(day => {
        day.attendees.forEach((a, idx) => a.id = String(idx + 1));
    });
    saveDataToLocalStr(key,allData);
}


// ==== clear_Input_Felds ==== //

export function clearinput() {
    if(document.getElementById("firstName")) document.getElementById("firstName").value = "";
    if(document.getElementById("lastName")) document.getElementById("lastName").value = "";
    if(document.getElementById("time")) document.getElementById("time").value = "";
}



// ==== main_Function ==== // 


export function addStudentsToLocalStr() {
     
    const data  = getInputFelds();
    
  
    if(!data.fname || !data.lname) {
        alert("Bitte den Namen vollständig ausfüllen!"); 
        return;
    }
  

    if (!validateStudentData(
            data.fullName, 
            data.selectedDate, 
            data.time, 
            data.selectedCategory)) {
        return;
    }

    if (isDuplicateName(data.fullName, LOCAL_STORAGE_KEYS.attendees)) {
        alert("Der Name existiert bereits!");
        return;
    }

    if (isDuplicateDateAndTime(data.selectedDate, data.time, LOCAL_STORAGE_KEYS.attendees)) {
        return;
    }
    

    const savedData = getDataFromLocalStr(LOCAL_STORAGE_KEYS.attendees);

    const attendee = createAttendee (
            data.fullName, 
            data.selectedDate, 
            data.time, 
            data.selectedCategory,
            LOCAL_STORAGE_KEYS.attendees
        );

    const max = 8;

    let dateEntry = savedData.find(day => day.date === data.selectedDate);

    if (!dateEntry) {
        savedData.push({
            date: data.selectedDate,
            attendees: [attendee]
        });
    } else {

        if (dateEntry.attendees.length >= max) {
            alert("Kein Platz mehr vorhanden!");
            return;
        }

        dateEntry.attendees.push(attendee);
    }

    saveDataToLocalStr(LOCAL_STORAGE_KEYS.attendees, savedData);

    clearinput();

    alert("Schüler erfolgreich gespeichert!");

    return true;
}