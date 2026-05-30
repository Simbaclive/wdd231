
document.addEventListener("DOMContentLoaded", () => {

    const timestampField = document.getElementById("formTimestamp");
    if (timestampField) {
        timestampField.value = new Date().toISOString();
    }

  
    const triggers = document.querySelectorAll(".modal-trigger");
    const closers = document.querySelectorAll(".close-modal");

    triggers.forEach(button => {
        button.addEventListener("click", () => {
            const modalId = button.getAttribute("data-target");
            const modalElement = document.getElementById(modalId);
            if (modalElement) {
                modalElement.showModal(); 
            }
        });
    });

    closers.forEach(button => {
        button.addEventListener("click", (e) => {
            const openModal = e.target.closest("dialog");
            if (openModal) {
                openModal.close();
            }
        });
    });


    document.querySelectorAll("dialog").forEach(modal => {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.close();
            }
        });
    });
});