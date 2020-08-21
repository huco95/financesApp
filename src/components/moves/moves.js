import state from "../../state";
import Modal from "bootstrap/js/dist/modal";
import stats from "../stats/stats";
import { isWithinInterval, format } from 'date-fns';

const movesDiv = document.getElementById("movesDiv");
const moveModal = document.getElementById('moveModal');
const delteMoveBtn = document.getElementById('deleteMoveBtn');
const addMoveForm = document.getElementById("postMovement");
const moveIdInput = document.getElementById("idInput");
const categoryInput = document.getElementById("categoryInput");

function initialize() {
  _initializeTypeSelector();
  _initalizeForm();
  _initalizeDeleteBtn();
}

/**
 * Render moves table.
 */
function render() {
    var request = new XMLHttpRequest();
  
    request.onreadystatechange = () => {
      if (request.readyState == XMLHttpRequest.DONE) {   // XMLHttpRequest.DONE == 4
        if (request.status == 200) {
          movesDiv.innerHTML = request.response;
        } else { console.log("ERROR"); }
      }
    };
  
    request.open("get", "/getMovesDate?initDate=" + state.getInitDateMiliseconds() + "&endDate=" + state.getEndDateMiliseconds(), true);
    request.send();
}

/**
 * Add type radio buttons listener.
 */
function _initializeTypeSelector() {
    var types = addMoveForm.elements["type"];
    for (var i = 0; i < types.length; i++) {
      types[i].onclick = () => {
        _renderCategories();
      }
    }
}

/**
 * Render Categories selector.
 */
function _renderCategories() {
    var request = new XMLHttpRequest();
    var type = addMoveForm.elements["type"].value;
  
    request.onreadystatechange = () => {
      if (request.readyState == XMLHttpRequest.DONE) {   // XMLHttpRequest.DONE == 4
        if (request.status == 200) {
          categoryInput.innerHTML = request.response;
        } else { console.log("ERROR"); }
      }
    };
  
    request.open("get", "/getCategories?type=" + type, false);
    request.send();
}

/**
 * Initalize form submit listener.
 */
function _initalizeForm() {
    addMoveForm.addEventListener("submit", (event) => {
        event.preventDefault();
        let isNew = moveIdInput.value === "";
        let moveId = moveIdInput.value;
      
        if (addMoveForm.checkValidity()) {
          var request = new XMLHttpRequest();
          request.onreadystatechange = () => {
            if (request.readyState == XMLHttpRequest.DONE) {   // XMLHttpRequest.DONE == 4
              if (request.status == 200) {
                Modal.getInstance(moveModal).hide();
      
                let response = JSON.parse(request.response);
                let moveDate = response.move.date;
                let moveHtml = response.moveHtml;
      
                // Check if move is for this month
                if (isWithinInterval(new Date(moveDate), { start: state.getInitDate(), end: state.getEndDate() })) {
                  if (isNew) {
                    // Add the new move to the list
                    _addNewMoveToMovesList(moveDate, moveHtml);
      
                  } else {
                    let newMoveGroupDateId = "movesGroup-" + format(new Date(moveDate), "ddMMyyyy", { locale: state.getLocale() });
                    let oldMoveElement = document.getElementById(moveId);
                    let oldMoveDateGroupElement = oldMoveElement.parentElement.parentElement;
      
                    if (oldMoveDateGroupElement.id == newMoveGroupDateId) {
                      // newMoveDay has not change, update element
                      oldMoveElement.outerHTML = moveHtml;
      
                    } else {
                      // newMoveDay has changed, remove element and add as a new one
                      _deleteMoveNode(oldMoveElement);
                      _addNewMoveToMovesList(moveDate, moveHtml);
                    }
                  }
      
                  stats.render();
                }
                
              }
              else { console.log("ERROR"); }
            }
          };
      
          if (isNew) { request.open("post", "/addMove", true); }
          else { request.open("post", "/updateMove", true); }
      
          request.send(new FormData(event.target));
      
        } else {
          addMoveForm.classList.add('was-validated');
        }
    });

    /**
     * Move modal hide event listener.
     */
    moveModal.addEventListener('hide.bs.modal', function (event) {
        addMoveForm.reset();
        addMoveForm.classList.remove('was-validated');
    });
    
    /**
     * Move modal show event listener.
     */
    moveModal.addEventListener('show.bs.modal', function (event) {
        // Button that triggered the modal
        var button = event.relatedTarget;
        // Extract info from data-* attributes
        var action = button.getAttribute('data-action');
        var modalTitle = moveModal.querySelector('.modal-title');
    
        if (action == "edit") {
            _populateEditMoveModal(button.id);
            var modalTitle = moveModal.querySelector('.modal-title');
            modalTitle.textContent = 'Editar moviemiento';
            delteMoveBtn.removeAttribute("hidden");
    
        } else {
            _renderCategories(); // Render form categories
            var modalTitle = moveModal.querySelector('.modal-title');
            modalTitle.textContent = 'Nuevo movimiento';
            delteMoveBtn.setAttribute("hidden", true);
        }
    });
}

/**
 * Populate move modal for edit.
 * 
 * @param {int} id 
 */
function _populateEditMoveModal(id) {
    var request = new XMLHttpRequest();
  
    request.onreadystatechange = () => {
      if (request.readyState == XMLHttpRequest.DONE) {   // XMLHttpRequest.DONE == 4
        if (request.status == 200) {
          const move = JSON.parse(request.response);
          addMoveForm.elements["moveId"].value = move._id;
          addMoveForm.elements["amount"].value = move.amount;
          addMoveForm.elements["type"].value = move.type;
          _renderCategories(); // Render form categories
          addMoveForm.elements["description"].value = move.description;
          addMoveForm.elements["category"].value = move.category;
          addMoveForm.elements["date"].value = format(new Date(move.date), "yyyy-MM-dd", { locale: state.getLocale() });
        } else { console.log("ERROR"); }
      }
    };
  
    request.open("get", "/getMove?id=" + id, false);
    request.send();
}

/**
 * Delete move button listener.
 */
function _initalizeDeleteBtn() {
    delteMoveBtn.addEventListener("click", () => {
        _deleteMove(addMoveForm.elements["moveId"].value);
        Modal.getInstance(moveModal).hide();
    });
}

/**
 * Delete move by id.
 * 
 * @param {int} id 
 */
function _deleteMove(id) {
    var request = new XMLHttpRequest();
  
    request.onreadystatechange = () => {
      if (request.readyState == XMLHttpRequest.DONE) {   // XMLHttpRequest.DONE == 4
        if (request.status == 200) {
          _deleteMoveNode(document.getElementById(id));
          if (movesDiv.childElementCount == 0) {
            // There are no moves, some no moves image
            render();
          }
          
          stats.render();
        } else { console.log("ERROR"); }
      }
    };
  
    request.open("post", "/deleteMove?id=" + id, true);
    request.send();
}

/**
 * Delete move Node form move list.
 * 
 * @param {Node} moveNode 
 */
function _deleteMoveNode(moveNode) {
    // If the dateGroup only one child remove the whole dateGroup
    if (moveNode.parentElement.childElementCount == 1) {
      // Remove date group
      moveNode.parentElement.parentElement.remove();
    } else {
      // Remove only old element
      moveNode.remove();
    }
}

function _addNewMoveToMovesList(moveDate, moveHtml) {
    let nearestDateGroupDayDiff = 31;
    let createNewDateGroup = true;
    let nearestDateGroupElement;
  
    const dateGroupList = document.querySelectorAll('[id^="movesGroup-"]');
    const newMoveGroupDateId = "movesGroup-" + format(new Date(moveDate), "ddMMyyyy", { locale: state.getLocale() });
    const newMoveDay = format(new Date(moveDate), "dd", { locale: state.getLocale() });

    for (let dateGroup of dateGroupList) {
      if (dateGroup.id === newMoveGroupDateId) {
        // There is a date group for the current date
        nearestDateGroupElement = dateGroup;
        createNewDateGroup = false;
        break;
  
      } else {
        // Save the nearest date group to append the new group (if necesary) in the correct position
        let newNearestDateGroupDayDiff = newMoveDay - dateGroup.dataset.day;
  
        if (Math.abs(nearestDateGroupDayDiff) > Math.abs(newNearestDateGroupDayDiff)) {
          nearestDateGroupDayDiff = newNearestDateGroupDayDiff;
          nearestDateGroupElement = dateGroup;
        }
      }
    }
  
    if (createNewDateGroup) {
      // Create new group
      let newDateGroup = document.createElement("div");
      newDateGroup.id = newMoveGroupDateId;
      newDateGroup.dataset.day = newMoveDay;
      let dateContainer = "<div class='moveDate font-weight-bold p-2'>" + format(new Date(moveDate), "dd MMMM yyyy", { locale: state.getLocale() }) + "</div>";
      newDateGroup.innerHTML = dateContainer + "<div class='bg-white px-2 py-1'>" + moveHtml + "</div>";
  
      if (nearestDateGroupDayDiff > 0) {
        // Add the consultation before the nearest one
        movesDiv.insertBefore(newDateGroup, nearestDateGroupElement);
      } else if (nearestDateGroupDayDiff < 0) {
        // Add the consultation after the nearest one
        movesDiv.insertBefore(newDateGroup, nearestDateGroupElement.nextSibling);
      }
  
      // Remove no moves div if necessary
      const noMovesDiv = document.getElementById("noMovesDiv");
      if (noMovesDiv != null) { noMovesDiv.remove(); }
  
    } else {
      // Add to date group
      nearestDateGroupElement.children[1].innerHTML += moveHtml;
    }
}

export default { initialize, render };