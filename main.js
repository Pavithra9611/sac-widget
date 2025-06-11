class IncidentChart extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<div style="font-family: Arial, sans-serif; padding: 10px; color: #333;">
      Custom Widget Loaded Successfully!
    </div>`;
  }
}

customElements.define('incident-chart', IncidentChart);
