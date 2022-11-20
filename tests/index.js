document.querySelectorAll('button.copy').forEach(btn => {
    btn.addEventListener('click', (ev) => {
        const target = ev.target;
        const parent = target.parentElement.parentElement;

        const code = parent.querySelector('td');
        const codeToCopy = code.textContent.trim();
        code.classList.add('copied');
        target.parentElement.classList.add('copied');

        navigator.clipboard.writeText(codeToCopy).then(cp => console.log(`Copied to clipboard`))
    })
})