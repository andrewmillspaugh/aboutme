---
layout: layouts/base.njk
bodyId: 'fixed'
---
<script type="module" src="/js/radar-chart.js" defer></script>
<div id='heading'>
    <div id="title">andrew millspaugh</div>
    <div id="subtitle">developer</div>
</div>
<radar-chart 
    skill[backend]=0.8
    skill[frontend]=0.6
    skill[architecture]=0.75 
    skill[infrastructure]=0.4
    skill[bayesian-ml]=0.5
    skill[deep-learning]=0.4>
</radar-chart>