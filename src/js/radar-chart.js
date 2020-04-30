
class RadarChart extends HTMLElement {
    constructor() {
        super();
        this.elements = {}
    }

    connectedCallback() {
        this.fontSize = parseInt(getComputedStyle(this).fontSize)
        window.addEventListener('resize', this.render.bind(this));
        window.addEventListener('orientationchange', this.render.bind(this));
        this.render()
    }

    get levels() {
        return this.getAttribute('levels') | 6;
    }

    get skills() {
        const attributeRegex = /skill\[(.*)\]/
        const skillNames = this.getAttributeNames().filter(attribute => attribute.match(attributeRegex))
        return skillNames.map(skill => {
            const name = skill.replace(attributeRegex, '$1').replace('-', ' ')
            return [name, this.getAttribute(skill)]
        })
    }
    
    get chartRadius() {
        const charWidth = this.fontSize * 0.550; // TODO: Improve this rough estimate
        const maxRadiiPerAngle = this.skills.map((skill, index) => {
            const skillWidth = skill[0].length * charWidth;
            const angle = Math.PI / 2 - index * 2 * Math.PI / this.skills.length;
            const spacing = this.fontSize;
            if (index == 0 | index/this.skills.length == 0.5) return this.offsetHeight / 2 - 2 * this.fontSize;
            return (this.offsetWidth / 2 - skillWidth) / Math.abs(Math.cos(angle)) - spacing;
        });
        console.log(Math.min(...maxRadiiPerAngle))
        return Math.min(...maxRadiiPerAngle);
    }

    get textRadius() {
        return this.chartRadius + this.fontSize;
    }

    circleCoordinates(percentage, radius=this.chartRadius) {
        const x = Math.sin(2 * Math.PI * (0.5 - percentage)) * radius;
        const y = Math.cos(2 * Math.PI * (0.5 - percentage)) * radius;
        return { x, y }
    }

    renderSvg() {
        this.elements.svg = d3.select(this).selectAll('svg').data([1]).join('svg');
        this.elements.svg.attr('width', this.offsetWidth).attr('height', this.offsetHeight);
        this.elements.group = this.elements.svg.selectAll('g').data([1]).join('g');
        this.elements.group.attr('transform', `translate(${this.offsetWidth / 2}, ${this.offsetHeight / 2})`)
    }

    renderAxes() {
        this.elements.axes = this.elements.group.selectAll('.axis').data(this.skills).join('svg:line');
        this.elements.axes.classed('axis', true)
            .attrs((_, index) => {
                const end = this.circleCoordinates(index / this.skills.length);
                return { x1: 0, y1: 0, x2: end.x, y2: end.y }
            });
        this.elements.labels = this.elements.group.selectAll('.label').data(this.skills).join('svg:text');
        this.elements.labels.classed('label', true);
        this.elements.labels
            .text(skill => skill[0])
            .attrs((_, index) => this.circleCoordinates(index / this.skills.length, this.textRadius))
            .attrs((_, index) => {
                const percentage = index / this.skills.length;
                if (percentage == 0) return { 'text-anchor': 'middle', 'dominant-baseline': 'baseline' }
                if (percentage < 0.5) return { 'text-anchor': 'start', 'dominant-baseline': 'middle' }
                if (percentage == 0.5) return { 'text-anchor': 'middle', 'dominant-baseline': 'hanging' }
                if (percentage > 0.5) return { 'text-anchor': 'end', 'dominant-baseline': 'middle'}
            });
    }

    renderLevels() {
        const vertices = d3.range(0, 1, 1 / this.skills.length).map(percentage => this.circleCoordinates(percentage));
        const polygons = d3.range(1 / this.levels, 1, 1 / this.levels).map(level => {
            return vertices.map(vertex => vertex.x * level + ',' + vertex.y * level).join(' ')
        });
        this.elements.levels = this.elements.group.selectAll('.level').data(polygons).join('polygon').classed('level', true);
        this.elements.levels.attr('points', polygon => polygon).attr('fill', 'none');
    }

    renderSkillMap() {
        this.elements.skillmap = this.elements.group.selectAll('.skillmap').data([this.skills.map(skill => skill[1])]).join('path');
        this.elements.skillmap.classed('skillmap', true)
        d3.range(0, this.skills.length + 1).map((_, maxIndex) => {
            this.elements.skillmap = this.elements.skillmap
                .transition()
                .duration(150)
                .ease(d3.easePolyInOut)
                .attr('d', (skills) => {
                    return 'M' + skills.map((proficiency, index) => {
                        if (index >= maxIndex) return '0,0'
                        const { x, y } = this.circleCoordinates(index / this.skills.length)
                        return x * proficiency + ',' + y * proficiency
                    }).join(' ') + 'z'
                })
        })
    }

    render() {
        this.renderSvg();
        this.renderAxes();
        this.renderLevels();
        this.renderSkillMap();
    }
    
}

customElements.define('radar-chart', RadarChart);