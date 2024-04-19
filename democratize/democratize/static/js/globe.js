

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded and parsed");



    const svg = setupSVG();
    const projection = defineProjection();
    const cities = defineCities();
    console.log(`Cities defined: ${cities.length}`);

    console.log("Drawing cities");
    drawCities(svg, cities, projection); 
    
    console.log("Drawing city labels");
    drawCityLabels(svg, cities, projection);

    console.log("Animating city links");
    console.log("Animating city links proof");
    var complete = 0;

    animateCityLinks(svg, cities, projection, complete); // Call to start the animation
    console.log("complete = " + complete + "<");

});



// Rest of the globe.js code...
function setupSVG() {
    const svg = d3.select('#globe-container').append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .style('position', 'absolute')
        .style('top', '0')
        .style('left', '0');

    // Define the defs block for SVG filters and gradients
    const defs = svg.append('defs');

    // Define a glow filter with a Gaussian blur and color matrix operations
    const glowFilter = defs.append('filter')
        .attr('id', 'glow')
        .attr('x', '-50%')
        .attr('y', '-50%')
        .attr('width', '200%')
        .attr('height', '200%');
    glowFilter.append('feGaussianBlur')
        .attr('in', 'SourceGraphic')
        .attr('stdDeviation', '2')
        .attr('result', 'blur');
    glowFilter.append('feColorMatrix')
        .attr('in', 'blur')
        .attr('type', 'matrix')
        .attr('values', '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10')
        .attr('result', 'glowColorMatrix');
    glowFilter.append('feComposite')
        .attr('in', 'SourceGraphic')
        .attr('in2', 'glowColorMatrix')
        .attr('operator', 'over');

    // Define a linear gradient for the fire-like effect
const fireGradient = defs.append('linearGradient')
    .attr('id', 'fireGradient')
    .attr('gradientUnits', 'userSpaceOnUse');
fireGradient.append('stop')
    .attr('offset', '0%')
    .attr('stop-color', '#ff8c00') // A brighter color for more visibility
    .attr('stop-opacity', '1');    // Full opacity for start of gradient
fireGradient.append('stop')
    .attr('offset', '50%')
    .attr('stop-color', '#ff4500') // Bright orange
    .attr('stop-opacity', '1');    // Full opacity for mid-gradient
fireGradient.append('stop')
    .attr('offset', '100%')
    .attr('stop-color', '#b22222') // Dark red
    .attr('stop-opacity', '1');    // Full opacity for end of gradient


    return svg;
}



function setupSVG1() {
    const svg = d3.select('#globe-container').append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .style('position', 'absolute')
        .style('top', '0')
        .style('left', '0');

    // Definitions for filters and gradients
    const defs = svg.append('defs');

    // Glow filter
    const glow = defs.append('filter')
        .attr('id', 'glow')
        .attr('x', '-50%')
        .attr('y', '-50%')
        .attr('width', '200%')
        .attr('height', '200%');
    glow.append('feGaussianBlur')
        .attr('in', 'SourceGraphic')
        .attr('stdDeviation', '2')
        .attr('result', 'blur');
    glow.append('feColorMatrix')
        .attr('in', 'blur')
        .attr('type', 'matrix')
        .attr('values', '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10')
        .attr('result', 'glowColorMatrix');
    glow.append('feComposite')
        .attr('in', 'SourceGraphic')
        .attr('in2', 'glowColorMatrix')
        .attr('operator', 'over');

    // Gradient for the path
    const gradient = defs.append('linearGradient')
        .attr('id', 'fireGradient')
        .attr('gradientUnits', 'userSpaceOnUse');
    gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', '#ff0')
        .attr('stop-opacity', 0.8);
    gradient.append('stop')
        .attr('offset', '50%')
        .attr('stop-color', '#f00')
        .attr('stop-opacity', 0.8);
    gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', '#800')
        .attr('stop-opacity', 0.8);

    return svg;
}

function animateCityLinks(svg, cities, projection, index = 0) {
    console.log(`Animating city link at index ${index}, city name: ${cities[index].name}`);

    // Handling to cycle back to the first city after the last one
    const nextIndex = (index + 1) % cities.length; // Use modulus to loop back

    const currentCity = cities[index];
    const nextCity = cities[nextIndex];
    const duration = 3000; // Duration of the animation in milliseconds
    const startNextDelay = duration * 0.25; // Start next animation when 25% of the way through the current animation

    startAnimationForCityPair(svg, currentCity, nextCity, projection, duration, () => {
        console.log(`Completed animation from ${currentCity.name} to ${nextCity.name}`);
    });

    // Set timeout to call the next pair with the calculated delay
    setTimeout(() => {
        animateCityLinks(svg, cities, projection, nextIndex);
    }, startNextDelay);
}

function startAnimationForCityPair(svg, currentCity, nextCity, projection, duration, callback) {
    console.log(`Preparing to animate from ${currentCity.name} to ${nextCity.name}`);
    const start = projection(currentCity.coordinates);
    const end = projection(nextCity.coordinates);

    // Calculate control point for a nice arc
    const control = [(start[0] + end[0]) / 2, Math.min(start[1], end[1]) - Math.abs(start[0] - end[0]) / 2];

    // Create a gradient for the path
    const gradientId = `gradient-${currentCity.name}-to-${nextCity.name}`;
    const gradient = svg.append("defs")
      .append("linearGradient")
      .attr("id", gradientId)
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", start[0])
      .attr("y1", start[1])
      .attr("x2", end[0])
      .attr("y2", end[1]);
    gradient.append("stop").attr("offset", "0%").attr("stop-color", "#ff0");
    gradient.append("stop").attr("offset", "100%").attr("stop-color", "#f00");

    // Create the path with the gradient
    const path = svg.append("path")
    .attr("d", `M${start[0]} ${start[1]} Q${control[0]} ${control[1]} ${end[0]} ${end[1]}`)
    .style("stroke", "url(#fireGradient)") // Use the defined gradient for stroke
    .style("stroke-width", 4) // Increase the stroke width for visibility
    .style("fill", "none");

    console.log(`Path created from ${currentCity.name} to ${nextCity.name}`);

    const totalLength = path.node().getTotalLength();
    path.style("stroke-dasharray", `${totalLength} ${totalLength}`)
        .style("stroke-dashoffset", totalLength);

    // Create the moving dot with a glow effect
    const movingDot = svg.append("circle")
        .attr("r", 5)
        .attr("fill", "black")
        .style("filter", "url(#glow)")
        .attr("transform", `translate(${start[0]}, ${start[1]})`);

    console.log(`Starting dot animation from ${currentCity.name} to ${nextCity.name}`);
    movingDot.transition()
        .duration(duration)
        .ease(d3.easeLinear)
        .attrTween("transform", translateAlongPath(path.node()))
        .on("start", () => {
            console.log(`Dot started moving from ${currentCity.name} to ${nextCity.name}`);
            path.transition()
                .duration(duration)
                .ease(d3.easeLinear)
                .style("stroke-dashoffset", 0)
                .on("end", () => {
                    console.log(`Path animation ended for ${currentCity.name} to ${nextCity.name}`);
                    path.remove();
                });
        })
        .on("end", () => {
            console.log(`Dot animation ended for ${currentCity.name} to ${nextCity.name}`);
            movingDot.remove();
            if (callback) callback();
        });
}


function translateAlongPath(path) {
    const l = path.getTotalLength();
    return function(d, i, a) {
        return function(t) {
            const p = path.getPointAtLength(t * l);
            return `translate(${p.x},${p.y})`;
        };
    };
}




function defineProjection() {
    console.log("Defining projection");
    const width = window.innerWidth;
    const height = window.innerHeight;
    const projection = d3.geoMercator().center([0, 20]).scale(width / (2 * Math.PI)).translate([width / 2, height / 2]);
    console.log(`Projection defined with center [0,20], scale based on width`);
    return projection;
}

function defineCities() {
    console.log("Defining cities");
    // Insert your actual cities data here
    return [
        { name: 'New York City', coordinates: [-76.0060, 41.7128] },
        { name: 'Delhi', coordinates: [57.1025, 31.7041] },        
        { name: 'Toronto', coordinates: [-79.3832, 43.6532] },
        { name: 'Mumbai', coordinates: [51.8777, 23.0760] },
        { name: 'Los Angeles', coordinates: [-113.2437, 36.0522] },
       { name: 'Jakarta', coordinates: [82.8650, -0.5] },
        { name: 'Lima', coordinates: [-81.0428, -5.0464] },
        { name: 'Nagoya', coordinates: [107.9066, 35.1815] },        
        { name: 'Rio de Janeiro', coordinates: [-53.1729, -18.9068] },        
        { name: 'Washington', coordinates: [-79, 38]},
        { name: 'Beijing', coordinates: [93.4737, 36.2304] },            
        { name: 'Charlotte', coordinates: [-83.8431, 35.2271] },
        { name: 'Bangkok', coordinates: [77.5018, 17.7563] },        
        { name: 'Denver', coordinates: [-107.9903, 40.7392] },
        { name: 'Kolkata', coordinates: [67.0099, 24.8615] },
        { name: 'Los Angeles', coordinates: [-113.2437, 36.0522] },
        { name: 'Manila', coordinates: [97.9842, 19.5995] },    
        { name: 'San Francisco', coordinates: [-117.4194, 37.7749] },
        { name: 'Moscow', coordinates: [21.5946, 36.9716] },
        { name: 'Tokyo', coordinates: [111.6917, 37.6895] },
        { name: 'Amsterdam', coordinates: [-4.9041, 51.3676] },
        { name: 'Singapore', coordinates: [79.8198, 8.3521] },
        { name: 'San Francisco', coordinates: [-117.4194, 37.7749] },        
        { name: 'Luxembourg', coordinates: [-7.1296, 48.8153] },
        { name: 'Shanghai', coordinates: [96.4737, 32.2304] },
        { name: 'Munich', coordinates: [0, 47.1351] },
        { name: 'Cairo', coordinates: [14.2357, 32.0444] },       { name: 'Mexico City', coordinates: [-101.1332, 21.4326] },
        { name: 'Hong Kong', coordinates: [89.2644, 26.1291] },
        { name: 'Bogotá', coordinates: [-76.0721, 8.5110] },
        { name: 'Jakarta', coordinates: [82.8650, -0.5] },
        { name: 'Lima', coordinates: [-81.0428, -5.0464] },
        { name: 'Nagoya', coordinates: [107.9066, 35.1815] },        
        { name: 'Rio de Janeiro', coordinates: [-53.1729, -18.9068] },
        { name: 'Buenos Aires', coordinates: [-64.3816, -30.6037] },
        { name: 'Santiago', coordinates: [-74.3816, -26.6037] },
        { name: 'London', coordinates: [-12.1276, 49.5074] },
        { name: 'Madrid', coordinates: [-14.7038, 42.4168] },
        { name: 'Melbourne', coordinates: [117.9631, -29.8136] },
        { name: 'Paris', coordinates: [-10.3522, 46.8566] },
        { name: 'Tokyo', coordinates: [111.6917, 37.6895] },
        { name: 'Amsterdam', coordinates: [-4.9041, 51.3676] },
        { name: 'Singapore', coordinates: [79.8198, 8.3521] },
        { name: 'Luxembourg', coordinates: [-7.1296, 48.8153] },
        { name: 'Shanghai', coordinates: [96.4737, 32.2304] },
        { name: 'Munich', coordinates: [0, 47.1351] },
        { name: 'Cairo', coordinates: [14.2357, 32.0444] },
        { name: 'Zurich', coordinates: [-3.1900, 45.4642] },
        { name: 'Milan', coordinates: [-5.5417, 45.3769] },
        { name: 'Istanbul', coordinates: [12.9784, 41.0082] },
        { name: 'Johannesburg', coordinates: [13.0473, -18.2041] },
        { name: 'Chennai', coordinates: [61.2707, 19.0827] },        
        { name: 'Lagos', coordinates: [-8.3792, 12.5244] },
        { name: 'Sydney', coordinates: [120.2093, -27.8688] },
        { name: 'Seoul', coordinates: [100.9780, 39.5665] },
        { name: 'Dublin', coordinates: [-17.1276, 50.5074] },
        { name: 'Zurich', coordinates: [-3.1900, 45.4642] },   
        { name: 'Dubai', coordinates: [37.2708, 28.2048] },
        { name: 'Oslo', coordinates: [-2.7522, 57.9139] },








        // Add more cities as needed
    ];
}

function createCityLinks(cities) {
    console.log("Creating links between cities");
    let links = [];
    for (let i = 0; i < cities.length - 1; i++) {
        links.push({
            source: cities[i].coordinates,
            target: cities[i + 1].coordinates
        });
    }
    return links;
}

function drawCityLinks(svg, links, projection) {
    console.log(`Attempting to draw ${links.length} links`);
    const linkGenerator = d3.linkHorizontal()
        .x(d => projection(d)[0])
        .y(d => projection(d)[1]);

    const drawnLinks = svg.selectAll('.link')
        .data(links)
        .enter().append('path')
        .attr('class', 'link')
        .attr('d', linkGenerator)
        .style('stroke', 'cyan')
        .style('stroke-width', '2px')
        .style('fill', 'none');

    console.log(`Links drawn: ${svg.selectAll('.link').size()}`);
}


function drawCities(svg, cities, projection) {
    console.log(`Drawing ${cities.length} cities`);
    
    // Define the glow filter
    const defs = svg.append("defs");

    const glowFilter = defs.append("filter")
        .attr("id", "glow");
    glowFilter.append("feGaussianBlur")
        .attr("class", "blur")
        .attr("stdDeviation", "2.5")
        .attr("result", "coloredBlur");
    const feMerge = glowFilter.append("feMerge");
    feMerge.append("feMergeNode")
        .attr("in", "coloredBlur");
    feMerge.append("feMergeNode")
        .attr("in", "SourceGraphic");
    // Select all the city elements and append circle SVG elements for each city
    const citySelection = svg.selectAll('.city')
        .data(cities)
        .enter().append('circle')
        .attr('class', 'city')
        .attr('cx', d => projection(d.coordinates)[0])
        .attr('cy', d => projection(d.coordinates)[1])
        .attr('r', '3')
        .attr('fill', 'silver')
        .style("filter", "url(#glow)");

    // Add animations to city circles for a pulsating effect
    citySelection.append("animate")
        .attr("attributeName", "r")
        .attr("from", 5)
        .attr("to", 8)
        .attr("dur", "1s")
        .attr("repeatCount", "indefinite"); 

    // Attach event handlers for mouse interaction
    citySelection
        .on('mouseover', function(event, d) {
            // Show popup
            showPopup(d, event);
        })
        .on('mousemove', function(event, d) {
            // Move popup
            movePopup(event);
        })
        .on('mouseout', function(event, d) {
            // Hide popup
            hidePopup();
        });

    console.log(`Cities drawn: ${svg.selectAll('.city').size()}`);
}



function drawCityLabels(svg, cities, projection) {
    console.log(`Adding labels to ${cities.length} cities`);
    svg.selectAll('.city-label')
    
        .data(cities)
        .enter().append('text')
        .attr('class', 'city-label')
        .attr('x', d => projection(d.coordinates)[0])
        .attr('y', d => projection(d.coordinates)[1] + 15)
        .text(d => d.name)
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .style('font-size', '10px');

    console.log(`City labels added: ${svg.selectAll('.city-label').size()}`);
}

  /*start of new code */

  
let initialX, initialY; // Variables to hold the initial position of the cursor when the popup is shown

function showPopup(cityData, event) {
    const popup = document.getElementById('city-popup');
    initialX = event.clientX; // Set initial X
    initialY = event.clientY; // Set initial Y
    popup.style.display = 'block';
    popup.textContent = cityData.name;
    movePopup(event);
}

function movePopup(event) {
    const popup = document.getElementById('city-popup');
    const distance = calculateDistance(event.clientX, event.clientY, initialX, initialY);
    if (distance < 300) {
      popup.style.left = `${event.clientX}px`;
      popup.style.top = `${event.clientY}px`;
    } else {
      hidePopup();
    }
}

function hidePopup() {
    const popup = document.getElementById('city-popup');
    popup.style.display = 'none';
}

function calculateDistance(x, y, initialX, initialY) {
    const dx = x - initialX;
    const dy = y - initialY;
    return Math.sqrt(dx * dx + dy * dy); // Actual distance calculation
}