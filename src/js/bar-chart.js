

class BarChart extends HTMLElement {
    constructor() {
        super();
        this.elements = {}
    }
    get technologies() {
        return [
            ['backend', [['scala', 0.7], ['python', 0.8], ['c++', 0.4]]],
            ['frontend', [['react', 0.7], ['typescript', 0.5], ['angular', 0.3]]],
            ['data', [['keras', 0.5], ['r', 0.4], ['numpy', 0.3]]],
            ['platform', [['aws', 0.8], ['docker', 0.8], ['k8s', 0.3]]]
        ]
    }

    connectedCallback() {
        this.render();
        window.addEventListener('resize', this.render.bind(this));
        window.addEventListener('orientationchange', this.render.bind(this));
    }

    _setConstants() {
        this.orientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
        this.longSide = this.orientation == 'landscape' ? this.offsetWidth : this.offsetHeight;
        this.shortSide = this.orientation == 'landscape' ? this.offsetHeight : this.offsetWidth;
        this.dotCount = 10;
        this.fontSize = parseInt(getComputedStyle(this).fontSize);
        this.headerSize = this.fontSize * 1.5;
        this.charWidth = this.fontSize * 0.55;
        this.textAngle = this.orientation == 'landscape' ? Math.PI / 4 : 0;
        const skillLengths = this.technologies.reduce((prev, curr) => {
            return prev.concat(curr[1].map(skill => this.charWidth * skill[0].length))
        }, [])
        this.textboxWidth = Math.max(...skillLengths) * Math.cos(this.textAngle) + this.charWidth * Math.sin(this.textAngle);
        this.textboxWidth += this.headerSize * 1.5;
        const shortSideDotCount = 1.5 * (this.dotCount - 1) + 2;
        const longSideDotCount = this.technologies.reduce((count, domain) => {
            return count + (domain[1].length + 1) * 3;
        }, 0) - 5;
        this.overhang = this.orientation == 'portrait' ? 0 :
            this.technologies[0][1][0][0].length * this.charWidth * Math.sin(this.textAngle);
        this.dotSize = Math.min(
            (this.shortSide - this.textboxWidth) / shortSideDotCount,
            (this.longSide - this.overhang) / longSideDotCount
        );
    }

    _renderSvg() {
        this.elements.svg = d3.select(this).selectAll('svg').data([1]).join('svg');
        this.elements.svg.attr('width', this.offsetWidth).attr('height', this.offsetHeight);
        this.elements.drawing = this.elements.svg.selectAll('.drawing').data([1]).join('g');
    }

    _centerDrawing() {
        this.elements.drawing
            .classed('drawing', true)
            .attr('transform', (_, index, nodes) => {
                const size = nodes[index].getBoundingClientRect()
                const x = (this.offsetWidth - size.width) / 2;
                var y = this.orientation == 'landscape' ? this.offsetHeight : 0;
                y -= this.offsetHeight / 2 - size.height / 2;
                return `translate(${x}, ${y})`
            });
    }

    _renderGroups() {
        var currentOffset = { x: 0, y: 0 }
        this.elements.groups = this.elements.drawing.selectAll('.group').data(this.technologies).join('g');
        this.elements.groups.classed('group', true)
        this.elements.groups.attr('transform', (technology, index) => {
            const translate = `translate(${currentOffset.x}, ${currentOffset.y})`;
            currentOffset.x += this.orientation == 'portrait' ? 0 :
                (technology[1].length + 1) * 3 * this.dotSize;
            currentOffset.y += this.orientation == 'landscape' ? 0 :
                (technology[1].length + 1) * 3 * this.dotSize
            return translate;
        })
        this.elements.domainText = this.elements.groups.selectAll('.domainText').data(tech => [tech]).join('text');
        this.elements.domainText
            .classed('domainText', true)
            .attrs((technology, index) => {
                const space = technology[1].length * 3 * this.dotSize - 2 * this.dotSize;
                const x = this.orientation == 'landscape' ? space / 2 : this.headerSize / 2;
                const y = this.orientation == 'portrait' ? space / 2 : -this.headerSize / 2;
                const rotate = this.orientation == 'portrait' ? -90 : 0;
                return {
                    x: x,
                    y: y,
                    transform: `rotate(${rotate} ${x} ${y})`,
                    'font-size': this.headerSize,
                    'text-anchor': 'middle',
                    'dominant-baseline': 'middle'
                }
            })
            .text(tech => tech[0])
    }

    _renderSkills() {
        this.elements.skills = this.elements.groups.selectAll('.skill').data(tech => tech[1]).join('g');
        this.elements.skills.classed('skill', true);
        this.elements.skills.attr('transform', (_, index) => {
            const x = this.orientation == 'landscape' ? index * 3 * this.dotSize + this.dotSize / 2 : 0;
            const y = this.orientation == 'portrait' ? index * 3 * this.dotSize + this.dotSize / 2 : 0;
            return `translate(${x}, ${y})`;
        });
    }

    _renderDots() {
        this.elements.emptyDots = this.elements.skills.selectAll('.emptyDot').data(d3.range(0, this.dotCount)).join('circle');
        this.elements.emptyDots.classed('emptyDot', true);
        this.elements.emptyDots
            .attr('cx', (_, index) => this.orientation == 'portrait' ? this.textboxWidth + this.dotSize + 1.5 * index * this.dotSize : 0)
            .attr('cy', (_, index) => this.orientation == 'landscape' ? - this.textboxWidth - this.dotSize - 1.5 * index * this.dotSize : 0)
            .attr('r', this.dotSize / 2)
            .attr('fill', 'gray');
        this.elements.fullDots = this.elements.skills.selectAll('.fullDot').data(skill => {
            return d3.range(0, Math.round(this.dotCount * skill[1]));
        }).join('circle');
        this.elements.fullDots.classed('fullDot', true);
        this.elements.fullDots
            //.attr('visibility', 'hidden')
            .attr('cx', (_, index) => this.orientation == 'portrait' ? this.textboxWidth + this.dotSize + 1.5 * index * this.dotSize : 0)
            .attr('cy', (_, index) => this.orientation == 'landscape' ? -this.textboxWidth - this.dotSize - 1.5 * index * this.dotSize : 0)
            .attr('r', this.dotSize / 2)
            .attr('fill', 'white');
            //.transition()
            //.delay((_, index) => (index + 1) * 100)
            //.attr('visibility', 'visible');
    }

    renderSkillText() {
        this.elements.skilltext = this.elements.skills.selectAll('.skillText').data(skill => {
            return [skill[0]]
        }).join('text');
        this.elements.skilltext.classed('skillText', true);
        this.elements.skilltext
            .attrs((skill, index) => {
                const x = this.orientation == 'portrait' ? this.textboxWidth : 1.5 * index * this.dotSize;
                const y = this.orientation == 'landscape' ? - this.textboxWidth : 1.5 * index * this.dotSize;
                return {
                    'text-anchor': 'end',
                    'dominant-baseline': this.orientation == 'landscape' ? 'hanging' : 'middle',
                    'x': x,
                    'y': y,
                    'transform': `rotate(${-180 * this.textAngle / Math.PI} ${x} ${y})`
                }
            })
            .text(skill => skill)
    }

    render() {
        this._setConstants();
        this._renderSvg();
        this._renderGroups();
        this._renderSkills();
        this._renderDots();
        this.renderSkillText();
        this._centerDrawing();
    }
}

customElements.define('bar-chart', BarChart);