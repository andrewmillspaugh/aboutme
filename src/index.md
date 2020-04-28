---
layout: layouts/base.njk
title: andrew millspaugh
subtitle: developer
eleventyNavigation:
  key: Mammals
  title: All of the Mammals
---
<div id='heading'>
    <div id="title">
        {{ title }}
    </div>
    <div id="subtitle">
        {{ subtitle }}
    </div>
</div>
<radar-chart 
    skill[infrastructure]=0.4
    skill[architecture]=0.75 
    skill[frontend]=0.6
    skill[machine-learning]=0.4
    skill[statistics]=0.4
    skill[backend]=0.8 
     />
