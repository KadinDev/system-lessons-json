
const page = location.pathname
const active_menu = document.querySelectorAll('.pages a')

for ( let active of active_menu ) {
    if ( page.includes(active.getAttribute('href')) ) {
        active.classList.add('active')
    }
}