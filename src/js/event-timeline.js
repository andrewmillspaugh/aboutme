class TimelineEvent {
    constructor(title, subtitle, datestring, description = [], tags=[]) {
        this.title = title
        this.subtitle = subtitle
        this.datestring = datestring
        this.description = description
        this.tags = tags
    }
}

class Timeline extends HTMLElement {
    constructor() {
        super();
    }
    get events() {
        return [
            new TimelineEvent('looking for new opportunities', null, 'now'),
            new TimelineEvent(
                'senior software engineer', 
                'citrine informatics',
                'january 2018 to april 2020',
                [
                    'Directed first round of architectural discussions for revamped data model',
                    'Directed movement of team to monorepository and backend language unification',
                    'Personally designed and built distributed batch computing service for long-running, dynamically de ned long-running tasks',
                    'Collaboratively designed, built, and maintained con gurable machine learning service on top of batch computing service',
                    'Planned and executed engineering offsites',
                    'Screened countless engineers, interviewed hundreds, hired dozens'
                ],
                ['scala', 'python', 'architecture', 'startups']
            ),
            new TimelineEvent(
                'managing partner', 
                'covalent ventures',
                'april 2016 to september 2019',
                [
                    'Raised $2.2M in limited partner commitments',
                    'Formed partnerships with VC firms in Seattle and Silicon Valley',
                    'Helped portfolio companies with development, growth, and hiring',
                    'Maintained on-paper returns of >5x over 18 months'
                ]
                
            ),
            new TimelineEvent(
                'consultant engineer', 
                'stackery.io',
                'september 2016 to march 2017',
                [
                    'Designed/architected entirely new frontend',
                    'Scaffolded frontend application',
                    'Trained team on proper React/Redux implementation',
                    'Worked with team to finish application'
                ]
            ),
            new TimelineEvent(
                'founder and architect', 
                'rebase',
                'october 2014 to september 2017',
                [
                    'architected scalable microservice architecture for code analysis',
                    'led team of five developers',
                    'Developed complex ast traversal tools and ml featurizers',
                    'Found purchaser and executed sale'
                ]
            ),
            new TimelineEvent(
                'founding engineer', 
                'spiral genetics',
                'may 2012 to september 2015',
                [
                    'Developed highly reliable upload tool for files in petabyte range',
                    'Helped architect novel distributed computing platform',
                    'Sourced custom hardware for on-premises computation',
                    'Developed program for, hired, and managed intern team'
                ]
            ),
            new TimelineEvent(
                'engineer', 
                'aurora consulting',
                'september 2009 to may 2012',
                [
                    'Developed custom software for academic labs',
                    'Worked with PIs to understand project requirements',
                    'Developed applications in complex domains including computer vision, robotics, and reaction modeling'
                ]
            ),
        ]
    }
    connectedCallback() {
        this.render();
        window.addEventListener('resize', this.render.bind(this));
        window.addEventListener('orientationchange', this.render.bind(this));
        window.addEventListener('scroll', this._handleScroll.bind(this));
        this._handleScroll();
    }
    _handleScroll() {
        const node = d3.select(this).selectAll('.event').classed('centered', false).nodes().sort((a,b) => {
            const rectA = a.getBoundingClientRect();
            const rectB = b.getBoundingClientRect();
            const positionA = rectA.top + rectA.height / 2;
            const positionB = rectB.top + rectB.height / 2;
            return Math.abs(window.innerHeight / 2 - positionA) - Math.abs(window.innerHeight / 2 - positionB);
        })[0];
        d3.select(node).classed('centered', true);
    }
    render() {
        this.orientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
        this.fontSize = parseInt(getComputedStyle(this).fontSize);
        this.charWidth = this.fontSize * 0.55;
        this.dotSize = this.fontSize * 1.5;
        this.minSpacing = this.fontSize * 6;

        const svg = d3.select(this).selectAll('svg').data([1]).join('svg');
        const drawing = svg.selectAll('.drawing').data([1]).join('g').classed('drawing', true);
        const events = drawing.selectAll('.event').data(this.events).join('g').classed('event', true);
        const dates = events.selectAll('.date').data(event => [event.datestring]).join('text').classed('date', true).text(date => date);

        const titles = events.selectAll('.title').data(event => [event.title]).join('text').classed('title', true).text(title => title);
        const subtitles = events.selectAll('.subtitle').data(event => [event.subtitle]).join('text').classed('subtitle', true).text(subtitle => subtitle);
        const descriptions = events.selectAll('.description').data(event => [event.description]).join('text').classed('description', true);
        const descriptionLines = descriptions.selectAll('tspan')
            .data(lines => lines.reduce((allLines, line) => {
                const split = line.split(' ').reduce((all, word) => {
                    if (all[all.length - 1].length + word.length <= 80) {
                        all[all.length - 1] = all[all.length - 1].concat(' ' + word);
                    } else {
                        all = all.concat(word);
                    }
                    return all
                }, ['• ']);
                return allLines.concat(...split);
            }, []))
            .join('tspan')
            .text(text => text)
            .attr('y', (_, index) => index * this.fontSize)
            .attr('x', text => text.startsWith('•') ? 0 : 1.25 * this.charWidth);
                
        const lines = events.selectAll('line').data((event, index, nodes) => {
            return index == nodes.length - 1 ? [] : [event]
        }).join('line');
        const dots = events.selectAll('.dot').data(event => [event]).join('circle').classed('dot', true);
        
        const verticalOffset = Math.max(this.fontSize / 2, this.dotSize / 2);
        dates.attr('font-size', this.fontSize * 0.666);
        dates.attr('transform', (_, index, nodes) => {
            const width = nodes[index].getBoundingClientRect().width;
            console.log(this.orientation)
            return this.orientation == 'portrait' ? `rotate(-90, ${width} 0)` : 'rotate(0)';
        })
        const dateWidth = Math.max(...dates.nodes().map(n => n.getBoundingClientRect().width));
        dates.attrs((_, index, nodes) => { 
            return { 
                x: dateWidth,
                y: verticalOffset, 
                'dominant-baseline': 'middle', 
                'text-anchor': 'end',
                'transform': this.orientation == 'portrait' ? `rotate(-90 ${dateWidth} ${verticalOffset})` : 'rotate(0)'
            }
        });
        titles.attrs({ 
            x: dateWidth + 2 * this.dotSize, 
            y: verticalOffset, 
            'dominant-baseline': 'middle' 
        });
        subtitles.attrs({ 
            x: dateWidth + 2 * this.dotSize + this.fontSize / 10, 
            y: verticalOffset + this.fontSize, 
            'font-size': this.fontSize * 0.666,
            'dominant-baseline': 'middle'
        });
        descriptions.attrs({ 
            transform: `translate(${dateWidth + 2 * this.dotSize + this.fontSize / 10}, ${verticalOffset + 2.5 * this.fontSize})`,
            'font-size': this.fontSize * 0.666
        });
        dots.attrs({ 
            'stroke-width': this.dotSize / 3,
            cx: dateWidth + this.dotSize, 
            cy: verticalOffset, 
            r: this.dotSize / 3 
        });
        let height = 0;
        events.attr('transform', (_, index, nodes) => {
            const transform = `translate(0, ${height})`;
            height += Math.max(nodes[index].getBoundingClientRect().height + 2 * this.fontSize, this.minSpacing)
            return transform
        });
        lines.attrs((_, index, nodes) => ({ 
            x1: dateWidth + this.dotSize, 
            x2: dateWidth + this.dotSize, 
            y1: verticalOffset, 
            y2: Math.max(this.minSpacing, nodes[index].parentNode.getBoundingClientRect().height + 2 * this.fontSize),
            'stroke-width': this.dotSize / 4,
        }));
        const rightsideWidth = Math.max(...events.nodes().map(node => {
            return node.getBoundingClientRect().width - d3.select(node).select('.date').node().getBoundingClientRect().width;
        }));
        drawing.attr('transform', (_, index, nodes) => {
            const totalWidth = nodes[index].getBoundingClientRect().width;
            return `translate(${(totalWidth - rightsideWidth) / 2}, 0)`;
        });
        svg.attrs({
            height: drawing.nodes()[0].getBoundingClientRect().height,
            width: drawing.nodes()[0].getBoundingClientRect().width
        });
        events.selectAll('rect').data([1]).join('rect').attrs((_, index, nodes) => {
            const height = nodes[index].parentNode.getBoundingClientRect().height;
            const width = drawing.node().getBoundingClientRect().width;
            return { width: width, height: Math.max(height, this.minSpacing) }
        }).attr('fill', 'black').attr('opacity', '0')
    }


}

customElements.define('event-timeline', Timeline);