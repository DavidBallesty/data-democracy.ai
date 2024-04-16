

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
    animateCityLinks(svg, cities, projection); // Call to start the animation

});

// Define other functions like setupSVG, defineProjection, drawCities, and drawCityLabels...
function animateCityLinks(svg, cities, projection, index = 0) {
    print(`Animating links, current index: ${index}`);
    console.log(`Animating links, current index: ${index}`);

    if (index < cities.length - 1) {
        const currentCity = cities[index];
        const nextCity = cities[index + 1];
        console.log(`Animating from ${currentCity.name} to ${nextCity.name}`);

        startAnimationForCityPair(svg, currentCity, nextCity, projection, () => {
            console.log(`Completed animation for ${currentCity.name} to ${nextCity.name}`);
            // Schedule the next pair animation
            setTimeout(() => {
                animateCityLinks(svg, cities, projection, index + 1);
            }, 750);  // Adjusted for a 25% progress overlap
        });
    } else {
        console.log("Reached the end of city pairs, restarting...");
        // Ensure there's no stall by setting a definitive timeout to restart
        setTimeout(() => {
            animateCityLinks(svg, cities, projection, 0);  // Recursively start from the first city pair
        }, 3000);  // Delay before restarting the cycle
    }
}

function startAnimationForCityPair(svg, currentCity, nextCity, projection, callback) {
    try {
        const start = projection(currentCity.coordinates);
        const end = projection(nextCity.coordinates);
        console.log(`Starting animation pair: ${currentCity.name} to ${nextCity.name}`);

        const path = svg.append("path")
            .attr("d", `M${start[0]} ${start[1]} L${end[0]} ${end[1]}`)
            .style("stroke", "cyan")
            .style("stroke-width", 2)
            .style("fill", "none");

        const movingDot = svg.append("circle")
            .attr("r", 5)
            .attr("fill", "yellow")
            .attr("transform", `translate(${start[0]},${start[1]})`);

        movingDot.transition()
            .duration(5000)
            .ease(d3.easeLinear)
            .attrTween("transform", translateAlongPath(path.node()))
            .on("start", function() {
                console.log(`Dot started moving from ${currentCity.name}`);
            })
            .on("end", () => {
                console.log(`Dot completed moving to ${nextCity.name}`);
                movingDot.remove(); // Remove the dot at the end of the transition
                path.remove(); // Remove the path at the end of the transition
                if (callback) callback();  // Execute the callback to continue the loop
            });
    } catch (error) {
        console.error("Animation failed:", error);
    }
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



// Rest of the globe.js code...


function setupSVG() {
    console.log("Setting up SVG");
    const width = window.innerWidth;
    const height = window.innerHeight;
    const svg = d3.select('#globe-container').append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .style('position', 'absolute')
        .style('top', '0')
        .style('left', '0');
    console.log(`SVG dimensions set: width=${width}, height=${height}`);
    return svg;
}
function animateCityLinks(svg, cities, projection, index = 0) {
    // Stop if we've reached the end of the cities array
    if (index >= cities.length - 1) return;

    // Time control variables
    const duration = 5000; // Duration of the entire path from city to city
    const delayBetweenAnimations = duration * 0.25; // Delay to start next animation

    // Call the animation function for the current city pair
    startAnimationForCityPair(svg, cities[index], cities[index + 1], projection, duration, () => {
        // The callback is empty because we're chaining animations with setTimeout
    });

    // Set timeout to call the next pair, ensuring the index is incremented
    setTimeout(() => {
        animateCityLinks(svg, cities, projection, index + 1);
    }, delayBetweenAnimations);
}
function startAnimationForCityPair(svg, currentCity, nextCity, projection, duration, callback) {
    const start = projection(currentCity.coordinates); // Starting point
    const end = projection(nextCity.coordinates); // Ending point

    // Calculate a control point for the arc
    const control = [
        (start[0] + end[0]) / 2, // x midpoint
        Math.min(start[1], end[1]) - Math.abs(start[0] - end[0]) / 2, // y is above the highest point
    ];

    // Define the path as a quadratic bezier curve (arc)
    const path = svg.append("path")
        .attr("d", `M${start[0]} ${start[1]} Q${control[0]} ${control[1]} ${end[0]} ${end[1]}`)
        .style("stroke", "cyan")
        .style("stroke-width", 2)
        .style("fill", "none");

    // Calculate the total length of the path
    const totalLength = path.node().getTotalLength();

    // Set up the initial state of the path's dash array so the path isn't visible initially
    path.style("stroke-dasharray", `${totalLength} ${totalLength}`)
        .style("stroke-dashoffset", totalLength);

    // Create the moving dot
    const movingDot = svg.append("circle")
        .attr("r", 5)
        .attr("fill", "yellow")
        .attr("transform", `translate(${start[0]},${start[1]})`);

    // Start the dot animation
    movingDot.transition()
        .duration(duration)
        .ease(d3.easeLinear)
        .attrTween("transform", translateAlongPath(path.node()))
        .on("start", function() {
            // Start the path animation when the dot starts moving
            path.transition()
                .duration(duration)
                .ease(d3.easeLinear)
                .style("stroke-dashoffset", 0)
                .style("stroke-dasharray", `${totalLength}`)
                .on("end", () => {
                    path.remove(); // Remove the path at the end
                });
        })
        .on("end", () => {
            // Remove the dot at the end of the transition
            movingDot.remove();
            // Execute the callback if provided
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
        { name: 'Mexico City', coordinates: [-101.1332, 21.4326] },
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
    svg.selectAll('.city')
        .data(cities)
        .enter().append('circle')
        .attr('class', 'city')
        .attr('cx', d => projection(d.coordinates)[0])
        .attr('cy', d => projection(d.coordinates)[1])
        .attr('r', '5') 
        .attr('fill', 'yellow');

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
