---
layout: layouts/base.njk
title: andrew millspaugh
subtitle: developer
bodyId: resume
---
<script type="module" src="/js/bar-chart.js" defer></script>
<script type="module" src="/js/event-timeline.js" defer></script>
<script type="module" src="/js/print-button.js" defer></script>
<div class='resume-page'>
    <div class='content'>
        <div class='column'>
            <div class='name'>Andrew Millspaugh</div>
            <div class='title'>Developer</div>
            <div class='email'>millspaugh.andrew@gmail.com</div>
            <div class='section'>   
I am a software engineer with a pretty unique background. My career path has taken me through a number of incredibly diverse and challenging experiences, including commercial fishing on the Bering Sea (yes, like Deadliest Catch), building boats, campaigning for environmental nonprofits, engineering, and investing.

At my most recent job, I played a lot of different roles (trying to avoid overused idioms here...). I've had an active part in both of our product offerings all across the stack. I've done a significant subset of our architecture, and written a lot of code. Most notably, I wrote and maintained our machine learning service, which allows our customers to find never-before-seen materials for their product problems. Though, throughout all of this, my driving force has been impact. In my next role, I'm looking to continue to have outsized impact, and to leverage my diverse skillset in order to think about and solve problems in new ways.
            </div>
            <div class='section-header'>Technologies</div>
            <div class='section technologies'>
                <bar-chart />
            </div>
            <div class='section-header'>Areas of Interest</div>
            <div class='section interests'>
                <div class='category'>
                    <img src='/images/dna.svg'></img>
                    <div>Bioengineering</div>
                </div>
                <div class='category'>
                    <img src='/images/rocket.svg'></img>
                    <div>Startups</div>
                </div>
                <div class='category'>
                    <img src='/images/brain.svg'></img>
                    <div>Data Science</div>
                </div>
                <div class='category'>
                    <img src='/images/drone.svg'></img>
                    <div>Hardware</div>
                </div>
            </div>
            <div class='section-header'>Education</div>
            <div class='section education'>
                <div class='date'>September 2009 to June 2013</div>
                <div class='degree'>B.S. Bioengineering</div>
                <div class='school'>University of Washington</div>
            </div>
        </div>
        <div class='column'>
            <event-timeline chart-align='left' looking='false'>
        </div>
    </div>
</div>