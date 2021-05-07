const filelist = document.getElementById('filelist')
function update() {
    fetch('/json').then((response) => {
		return response.json()
	}).then((json) => {
        filelist.innerHTML = 
            JSON.parse(json)
                .map((item) => {
                    const file = item.replace(/\.pdf$/, '')
                    return `<li>
                                <a href="./document/${file}.pdf">
                                    ${file}
                                </a>
                            </li>
                            `
                })
                .join('')
        setTimeout(update, UPDATE_INTERVAL)
	}).catch((err) => {
		console.warn('Помилка завантаження списку.', err)
        setTimeout(update, UPDATE_INTERVAL)
	})
}

setTimeout(update, UPDATE_INTERVAL)