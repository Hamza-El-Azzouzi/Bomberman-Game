
export function checkResizing(){
    document.addEventListener('DOMContentLoaded', () => {
    const errorMessage = document.getElementById('error-message');
    const gameContainer = document.getElementById('map');
    const minWidth = 800;
    function checkWindowSize() {
        if (window.innerWidth < minWidth) {
            errorMessage.style.display = 'block';
            gameContainer.style.display = 'none';
        } else {
            errorMessage.style.display = 'none';
            gameContainer.style.display = 'flex';
        }
    }
    checkWindowSize();
    window.addEventListener('resize', checkWindowSize);
});
}
