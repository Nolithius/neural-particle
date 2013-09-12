$(function()
{
    var newPipInterval = 8;

    // The farthest
    var maxPipRadius = 6;
    var minPipRadius = maxPipRadius * 0.5;
    var avgPipRadius = maxPipRadius * 0.75;
    var pipCount = 600;

    var center;

    var canvas = $("#canvas");
    var width = canvas.width();
    var height = canvas.height();

    var pips = new Array();

    reset();

    setInterval(addNewPip, newPipInterval);

    function reset ()
    {
        canvas.empty();
        pips = new Array();
        center = createRandomPip();
        addPip(center);
    }

    function addNewPip ()
    {
        if (pips.length < pipCount)
        {
            addPip(createPip());
        }
        else
        {
            reset();
        }
    }

    function createPip ()
    {
        var randomPip = createRandomPip();
        var nearestPip = getNearestPip(randomPip);
        var pipDistance = distance(randomPip, nearestPip);

        // Too close, toss
        while (pipDistance < minPipRadius)
        {
            randomPip = createRandomPip();
            nearestPip = getNearestPip(randomPip);
            pipDistance = distance(randomPip, nearestPip);
        }

        // Adjust if we're too far
        if (pipDistance > maxPipRadius)
        {
            // Calculate unit vector
            var unitX = (randomPip.x - nearestPip.x) / pipDistance;
            var unitY = (randomPip.y - nearestPip.y) / pipDistance;

            randomPip.x = avgPipRadius * unitX + nearestPip.x;
            randomPip.y = avgPipRadius * unitY + nearestPip.y;
        }

        return randomPip;
    }

    function getNearestPip (pip)
    {
        var nearestPip = center;
        var nearestDistance = distance(pip, center);

        for (var i = 0; i < pips.length; i++)
        {
            var candidatePip = pips[i];
            var candidateDistance = distance(pip, candidatePip);

            if (candidateDistance < nearestDistance)
            {
                nearestPip = candidatePip;
                nearestDistance = candidateDistance;
            }
        }

        return nearestPip;
    }

    function createRandomPip ()
    {
        return {x: rand(0, width), y: rand(0, height)};
    }

    function addPip (pip)
    {
        pips.push(pip);

        var div = document.createElement("div");
        div.setAttribute("class", "pip");
        div.style.left = pip.x + "px";
        div.style.top = pip.y + "px";

        canvas.append(div);

        $(div).animate({width: "2px", height: "2px", opacity: 1}, 500);
    }

    function rand(min, max)
    {
        return Math.floor(Math.random()*(max-min+1)+min);
    }

    function clamp (number, min, max)
    {
        return Math.min(Math.max(number, min), max);
    }

    function distance(pip1, pip2)
    {
        var xs = 0;
        var ys = 0;

        xs = pip2.x - pip1.x;
        xs = xs * xs;

        ys = pip2.y - pip1.y;
        ys = ys * ys;

        return Math.sqrt(xs + ys);
    }
});