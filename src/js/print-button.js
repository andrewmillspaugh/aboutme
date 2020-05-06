class PrintButton extends HTMLElement {
    connectedCallback() {
        this.innerHTML = '<button>print</button>';
        this.addEventListener('click', this.print.bind(this));
    }

    print() {
        var doc = new jsPDF();
        doc.text(20, 20, 'Hello world.');
        doc.save('Test.pdf');
    }

}

customElements.define('print-button', PrintButton);