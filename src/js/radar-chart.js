
class RadarChart extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.fontSize = parseInt(getComputedStyle(this).fontSize)
        this.elements = {}
        window.addEventListener('resize', this._onResize.bind(this));
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

    get radius() {
        const longestSkill = this.skills.reduce((prev, curr) => {
            return prev.length > curr[0].length ? prev : curr[0]
        }, '').length
        const maxHeight = this.offsetHeight - 4 * this.fontSize;
        const charWidth = this.fontSize * 0.5; // TODO: Improve this rough estimate
        const maxWidth = this.offsetWidth - 2 * (longestSkill + 0.5) * charWidth;
        return Math.min(maxHeight, maxWidth) / 2;
    }

    get textRadius() {
        return this.radius + this.fontSize / 2;
    }

    get yOffset() {
        return this.offsetHeight / 2 - this.radius;
    }

    get xOffset() {
        return this.offsetWidth / 2 - this.radius;
    }

    circleCoordinates(percentage, radius=this.radius) {
        const x = Math.sin(2 * Math.PI * (0.5 - percentage)) * radius;
        const y = Math.cos(2 * Math.PI * (0.5 - percentage)) * radius;
        return { x, y }
    }

    _onResize() {
        this.elements.svg = this.elements.svg.attr('width', this.offsetWidth).attr('height', this.offsetHeight);
        this.elements.group.attr('transform', `translate(${this.xOffset + this.radius}, ${this.yOffset + this.radius})`)
    }

    renderSvg() {
        const svgSelection = d3.select(this).selectAll('svg').data([1]);
        this.elements.svg = svgSelection.enter().append('svg').attr('width', this.offsetWidth).attr('height', this.offsetHeight);
        svgSelection.exit().remove()

        const groupSelection = this.elements.svg.selectAll('g').data([1]);
        this.elements.group = groupSelection.enter().append('g').attr('transform', `translate(${this.xOffset + this.radius}, ${this.yOffset + this.radius})`)
        groupSelection.exit().remove()
    }

    renderAxes() {
        const selection = this.elements.group.selectAll('.axis').data(this.skills);
        this.elements.axes = selection.enter().append('svg:line').classed('axis', true)
            .attrs((_, index) => {
                const end = this.circleCoordinates(index / this.skills.length);
                return { x1: 0, y1: 0, x2: end.x, y2: end.y }
            });
        selection.enter().append('svg:text')
            .text(skill => skill[0])
            .attrs((_, index) => this.circleCoordinates(index / this.skills.length, this.textRadius))
            .attrs((_, index) => {
                const percentage = index / this.skills.length;
                if (percentage == 0) return { 'text-anchor': 'middle', 'dominant-baseline': 'baseline' }
                if (percentage < 0.5) return { 'text-anchor': 'start', 'dominant-baseline': 'middle' }
                if (percentage == 0.5) return { 'text-anchor': 'middle', 'dominant-baseline': 'hanging' }
                if (percentage > 0.5) return { 'text-anchor': 'end', 'dominant-baseline': 'middle'}
            })
            .attr('font-size', this.fontSize);
        selection.exit().remove();
    }

    renderLevels() {
        const vertices = d3.range(0, 1, 1 / this.skills.length).map(percentage => this.circleCoordinates(percentage));
        const polygons = d3.range(1 / this.levels, 1, 1 / this.levels).map(level => {
            return vertices.map(vertex => vertex.x * level + ',' + vertex.y * level).join(' ')
        });
        const selection = this.elements.group.selectAll('.level').data(polygons);
        this.elements.levels = selection.enter().append('svg:polygon').classed('level', true)
            .attr('points', polygon => polygon)
            .attr('fill', 'none');
        selection.exit().remove();
    }

    renderSkillMap() {
        const selection = this.elements.group.selectAll('.skillmap').data([this.skills.map(skill => skill[1])]);
        this.elements.skillmap = selection.enter().append('svg:path').classed('skillmap', true);
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
        selection.exit().remove();
    }

    render() {
        this.renderSvg();
        this.renderAxes();
        this.renderLevels();
        this.renderSkillMap();
    }
    
}

customElements.define('radar-chart', RadarChart);